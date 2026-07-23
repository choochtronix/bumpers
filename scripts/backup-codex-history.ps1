[CmdletBinding()]
param(
  [string]$SourceRoot = (Join-Path $env:USERPROFILE ".codex"),
  [string]$BackupRoot = "D:\SHARED\Brrtz Backups\Codex"
)

$ErrorActionPreference = "Stop"
Set-StrictMode -Version Latest

$scriptVersion = 1
$timestamp = Get-Date -Format "yyyy-MM-dd_HHmmss"
$baselineRoot = Join-Path $BackupRoot "Baseline"
$currentRoot = Join-Path $BackupRoot "Current"
$snapshotRoot = Join-Path $BackupRoot "Snapshots"
$workingRoot = Join-Path $snapshotRoot ".working-$timestamp"
$manifestPath = Join-Path $BackupRoot "session-manifest.json"
$logPath = Join-Path $BackupRoot "backup.log"

$directoryTargets = @(
  "sessions",
  "attachments",
  "codex-remote-attachments",
  "visualizations"
)

$alwaysMetadata = @(
  "session_index.jsonl",
  ".codex-global-state.json",
  ".codex-global-state.json.bak"
)

$databaseMetadata = @(
  "state_5.sqlite",
  "state_5.sqlite-shm",
  "state_5.sqlite-wal",
  "memories_1.sqlite",
  "memories_1.sqlite-shm",
  "memories_1.sqlite-wal",
  "goals_1.sqlite",
  "goals_1.sqlite-shm",
  "goals_1.sqlite-wal"
)

function Write-BackupLog {
  param([string]$Message)

  $line = "{0} {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
  Write-Output $line
  Add-Content -LiteralPath $logPath -Value $line -Encoding UTF8
}

function Invoke-SafeRobocopy {
  param(
    [string]$Source,
    [string]$Destination
  )

  if (-not (Test-Path -LiteralPath $Source)) {
    return
  }

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  & robocopy.exe $Source $Destination /E /COPY:DAT /DCOPY:DAT /R:2 /W:2 /XJ /NP /NFL /NDL | Out-Null
  $code = $LASTEXITCODE
  if ($code -ge 8) {
    throw "Robocopy failed with exit code $code for $Source"
  }
}

function Copy-Metadata {
  param(
    [string]$Destination,
    [bool]$IncludeDatabases
  )

  New-Item -ItemType Directory -Path $Destination -Force | Out-Null
  foreach ($name in $alwaysMetadata) {
    $source = Join-Path $SourceRoot $name
    if (Test-Path -LiteralPath $source) {
      Copy-Item -LiteralPath $source -Destination (Join-Path $Destination $name) -Force
    }
  }

  if ($IncludeDatabases) {
    foreach ($name in $databaseMetadata) {
      $source = Join-Path $SourceRoot $name
      if (Test-Path -LiteralPath $source) {
        Copy-Item -LiteralPath $source -Destination (Join-Path $Destination $name) -Force
      }
    }
  }
}

function Get-CompleteJsonlLength {
  param([string]$Path)

  $stream = [System.IO.File]::Open(
    $Path,
    [System.IO.FileMode]::Open,
    [System.IO.FileAccess]::Read,
    [System.IO.FileShare]::ReadWrite -bor [System.IO.FileShare]::Delete
  )

  try {
    if ($stream.Length -eq 0) {
      return [int64]0
    }

    $position = $stream.Length
    $buffer = New-Object byte[] 65536
    while ($position -gt 0) {
      $readSize = [int][Math]::Min($buffer.Length, $position)
      $position -= $readSize
      $stream.Position = $position
      $actual = $stream.Read($buffer, 0, $readSize)
      for ($index = $actual - 1; $index -ge 0; $index--) {
        if ($buffer[$index] -eq 10) {
          return [int64]($position + $index + 1)
        }
      }
    }

    return $stream.Length
  }
  finally {
    $stream.Dispose()
  }
}

function Copy-FileSegment {
  param(
    [string]$Source,
    [string]$Destination,
    [int64]$Offset,
    [int64]$Length
  )

  $parent = Split-Path -Parent $Destination
  New-Item -ItemType Directory -Path $parent -Force | Out-Null

  $inputStream = [System.IO.File]::Open(
    $Source,
    [System.IO.FileMode]::Open,
    [System.IO.FileAccess]::Read,
    [System.IO.FileShare]::ReadWrite -bor [System.IO.FileShare]::Delete
  )
  $outputStream = [System.IO.File]::Create($Destination)

  try {
    $inputStream.Position = $Offset
    $remaining = $Length
    $buffer = New-Object byte[] 1048576
    while ($remaining -gt 0) {
      $requested = [int][Math]::Min($buffer.Length, $remaining)
      $read = $inputStream.Read($buffer, 0, $requested)
      if ($read -le 0) {
        break
      }
      $outputStream.Write($buffer, 0, $read)
      $remaining -= $read
    }
  }
  finally {
    $outputStream.Dispose()
    $inputStream.Dispose()
  }
}

if (-not (Test-Path -LiteralPath $SourceRoot)) {
  throw "Codex data directory not found: $SourceRoot"
}

New-Item -ItemType Directory -Path $BackupRoot -Force | Out-Null
New-Item -ItemType Directory -Path $snapshotRoot -Force | Out-Null

foreach ($staleWorkingDirectory in Get-ChildItem -LiteralPath $snapshotRoot -Directory -Filter ".working-*" -ErrorAction SilentlyContinue) {
  $resolvedSnapshotRoot = [System.IO.Path]::GetFullPath($snapshotRoot).TrimEnd("\") + "\"
  $resolvedWorkingPath = [System.IO.Path]::GetFullPath($staleWorkingDirectory.FullName)
  if ($resolvedWorkingPath.StartsWith($resolvedSnapshotRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
    Remove-Item -LiteralPath $resolvedWorkingPath -Recurse -Force
  }
}

New-Item -ItemType Directory -Path $workingRoot -Force | Out-Null

$codexRunning = @(Get-Process -Name "Codex" -ErrorAction SilentlyContinue).Count -gt 0
Write-BackupLog "Backup started. Codex running: $codexRunning"

try {
  $baselineMarker = Join-Path $baselineRoot ".baseline-complete"
  if (-not (Test-Path -LiteralPath $baselineMarker)) {
    Write-BackupLog "Creating immutable baseline."
    foreach ($target in $directoryTargets) {
      Invoke-SafeRobocopy -Source (Join-Path $SourceRoot $target) -Destination (Join-Path $baselineRoot $target)
    }
    Copy-Metadata -Destination (Join-Path $baselineRoot "metadata") -IncludeDatabases (-not $codexRunning)
    Set-Content -LiteralPath $baselineMarker -Value $timestamp -Encoding ASCII
  }

  Write-BackupLog "Refreshing incremental current mirror."
  foreach ($target in $directoryTargets) {
    Invoke-SafeRobocopy -Source (Join-Path $SourceRoot $target) -Destination (Join-Path $currentRoot $target)
  }
  Copy-Metadata -Destination (Join-Path $currentRoot "metadata") -IncludeDatabases (-not $codexRunning)

  $previousSessions = @{}
  if (Test-Path -LiteralPath $manifestPath) {
    $previousManifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
    foreach ($entry in @($previousManifest.sessions)) {
      $previousSessions[$entry.path] = $entry
    }
  }

  $sessionRoot = Join-Path $SourceRoot "sessions"
  $sessionEntries = @()
  $deltaCount = 0
  $deltaBytes = [int64]0

  if (Test-Path -LiteralPath $sessionRoot) {
    foreach ($file in Get-ChildItem -LiteralPath $sessionRoot -File -Recurse -Force) {
      $relativePath = $file.FullName.Substring($sessionRoot.Length).TrimStart("\")
      $safeLength = Get-CompleteJsonlLength -Path $file.FullName
      $oldEntry = $previousSessions[$relativePath]

      if ($null -ne $oldEntry) {
        $oldLength = [int64]$oldEntry.length
        if ($safeLength -gt $oldLength) {
          $deltaPath = Join-Path (Join-Path $workingRoot "session-deltas") ($relativePath + ".append")
          $length = $safeLength - $oldLength
          Copy-FileSegment -Source $file.FullName -Destination $deltaPath -Offset $oldLength -Length $length
          $deltaCount++
          $deltaBytes += $length
        }
        elseif ($safeLength -lt $oldLength) {
          $resetPath = Join-Path (Join-Path $workingRoot "session-resets") $relativePath
          Copy-FileSegment -Source $file.FullName -Destination $resetPath -Offset 0 -Length $safeLength
          $deltaCount++
          $deltaBytes += $safeLength
        }
      }

      $sessionEntries += [pscustomobject]@{
        path = $relativePath
        length = $safeLength
        lastWriteUtc = $file.LastWriteTimeUtc.ToString("o")
      }
    }
  }

  Copy-Metadata -Destination (Join-Path $workingRoot "metadata") -IncludeDatabases (-not $codexRunning)
  $snapshotInfo = [ordered]@{
    createdAt = (Get-Date).ToUniversalTime().ToString("o")
    scriptVersion = $scriptVersion
    computer = $env:COMPUTERNAME
    codexWasRunning = $codexRunning
    sessionDeltaFiles = $deltaCount
    sessionDeltaBytes = $deltaBytes
    note = "Private local backup. Never commit this archive to a source repository."
  }
  $snapshotInfo | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath (Join-Path $workingRoot "snapshot.json") -Encoding UTF8

  $manifest = [ordered]@{
    updatedAt = (Get-Date).ToUniversalTime().ToString("o")
    scriptVersion = $scriptVersion
    sessions = $sessionEntries
  }
  $temporaryManifest = $manifestPath + ".tmp"
  $manifest | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath $temporaryManifest -Encoding UTF8
  Move-Item -LiteralPath $temporaryManifest -Destination $manifestPath -Force

  $archivePath = Join-Path $snapshotRoot ("Codex-Snapshot-{0}.zip" -f $timestamp)
  Compress-Archive -Path (Join-Path $workingRoot "*") -DestinationPath $archivePath -CompressionLevel Optimal -Force
  Remove-Item -LiteralPath $workingRoot -Recurse -Force

  $archiveSize = (Get-Item -LiteralPath $archivePath).Length
  Write-BackupLog ("Backup completed. Snapshot: {0}; deltas: {1}; delta MB: {2:N2}; archive MB: {3:N2}" -f $archivePath, $deltaCount, ($deltaBytes / 1MB), ($archiveSize / 1MB))
}
catch {
  Write-BackupLog ("Backup failed: {0}" -f $_.Exception.Message)
  throw
}
