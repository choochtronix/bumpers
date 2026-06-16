param(
  [int]$Port = 5173,
  [string]$Host = "127.0.0.1",
  [switch]$NoBrowser
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $repoRoot

if (-not (Test-Path ".env.local")) {
  Write-Warning ".env.local was not found. Copy .env.example to .env.local and add local secrets before using cloud features."
}

$env:PORT = "$Port"
$env:HOST = "$Host"

$localUrl = "http://127.0.0.1:$Port/"

Write-Host "Starting Brrtz from $repoRoot"
Write-Host "Local URL: $localUrl"
if ($Host -eq "0.0.0.0") {
  Write-Host "Wi-Fi preview: use the LAN URL printed by the Brrtz server output."
}

if (-not $NoBrowser) {
  Start-Job -ScriptBlock {
    param($Url)
    Start-Sleep -Seconds 2
    Start-Process $Url
  } -ArgumentList $localUrl | Out-Null
}

npm start
