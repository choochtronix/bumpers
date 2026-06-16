# Brrtz Windows Migration Guide

This guide moves Brrtz development from the Mac to a Windows PC while keeping the same GitHub repo, Supabase cloud sync, Railway deployment, and source connector setup.

## Goal

Use the Windows PC as the main local development machine, while the Mac can stay free for other work. Brrtz should continue to deploy from GitHub to Railway when changes are pushed.

## Before Leaving The Mac

1. Sync account data in Brrtz:
   - Open Brrtz on the Mac.
   - Go to Settings -> Account.
   - Use Sync now.
   - Optional safety backup: Settings -> Data -> Export saved searches.

2. Commit and push local code changes:

   ```sh
   cd /Users/craigdrake/Documents/Codex/bumpers
   git status
   git add .
   git commit -m "Prepare Windows migration"
   git push
   ```

3. Copy secret values from `.env.local` into a secure note or password manager.

   Do not commit `.env.local`. It is intentionally ignored by Git.

## Windows Software Checklist

Install these on the Windows PC:

- Git for Windows: https://git-scm.com/download/win
- Node.js LTS: https://nodejs.org/
- Visual Studio Code: https://code.visualstudio.com/
- Chrome or Edge for testing
- Optional: GitHub Desktop if you prefer a visual Git workflow

Recommended Node version: current LTS. Brrtz has also been running on newer Node builds, but LTS is the calmer beta-launch choice.

## Clone Brrtz On Windows

Open PowerShell:

```powershell
cd $HOME\Documents
git clone https://github.com/choochtronix/bumpers.git brrtz
cd brrtz
npm install
```

The GitHub repo is still named `bumpers`; using a local folder named `brrtz` is fine.

If a browser-automation source complains about a missing Playwright browser on first run, install Chromium once:

```powershell
npx playwright install chromium
```

## Create `.env.local`

From PowerShell:

```powershell
copy .env.example .env.local
notepad .env.local
```

Fill in the real values:

```env
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_REQUIRE_INVITE=true
BUMPERS_JOB_TOKEN=your-long-random-job-token

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

EBAY_CLIENT_ID=your-ebay-client-id
EBAY_CLIENT_SECRET=your-ebay-client-secret
EBAY_MARKETPLACE_ID=EBAY_US
```

Security notes:

- `SUPABASE_ANON_KEY` is designed to be public-ish, but still keep it in env config.
- `SUPABASE_SERVICE_ROLE_KEY` is private server-side power. Never paste it into client code, GitHub, screenshots, or public docs.
- `EBAY_CLIENT_SECRET` is private. Keep it out of GitHub.
- `.env.local` is already ignored by `.gitignore`.

## Start Brrtz On Windows

Basic start:

```powershell
npm start
```

Then open:

```text
http://127.0.0.1:5173/
```

Or use the included helper:

```powershell
.\scripts\start-brrtz-windows.ps1
```

If PowerShell blocks the script, run this once from the repo folder:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\start-brrtz-windows.ps1
```

## Preview From Phone On The Same Wi-Fi

Run:

```powershell
.\scripts\start-brrtz-windows.ps1 -Host 0.0.0.0
```

The server output should show the Windows PC's LAN URL. Open that URL from your phone while both devices are on the same Wi-Fi.

If Windows Firewall asks for permission, allow private network access.

## If Port 5173 Is Busy

Find the process:

```powershell
netstat -ano | findstr :5173
```

Stop it:

```powershell
taskkill /PID <PID> /F
```

Or run Brrtz on another port:

```powershell
.\scripts\start-brrtz-windows.ps1 -Port 5199
```

## First Windows QA Pass

After the app starts:

1. Open `http://127.0.0.1:5173/api/health`.
2. Confirm it returns `"ok": true`.
3. Open `http://127.0.0.1:5173/`.
4. Sign in through Settings -> Account.
5. Pull from cloud and confirm saved searches appear.
6. Run searches in:
   - Japan
   - Bay Area
   - LA
7. Confirm eBay appears in US regions if eBay env vars are present.
8. Watch/unwatch a listing, sync, then verify the change on another browser.

## Continuing Codex Context On PC

If this exact Mac Codex chat is not visible on the Windows PC, use the repo as the source of truth:

1. Open `docs/pc-codex-handoff.md`.
2. Copy the short prompt from that file into the new Codex session.
3. Ask Codex to read the files listed there before continuing work.

That handoff file is intentionally small and current, while this migration guide is the full machine setup checklist.

## Git And Railway Flow

Daily Windows workflow:

```powershell
git pull
npm install
npm start
```

After making changes:

```powershell
git status
git add .
git commit -m "Describe the change"
git push
```

Railway is connected to GitHub, so pushed commits can deploy to `brrtz.com`.

## What Not To Move

Do not copy these into Git:

- `.env.local`
- `node_modules/`
- local cache files
- exported saved-search JSON backups unless intentionally archiving one

Saved searches, watched listings, and profile preferences should live in Supabase once synced.
