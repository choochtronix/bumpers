# Rigby Mac WSL Preview Workflow

Milestone captured after getting the cross-machine preview setup working.

## Working Setup

```text
Mac browser
-> http://192.168.3.45:5173
-> Rigby Windows LAN IP
-> Windows firewall allows port 5173
-> Windows/WSL port proxy
-> Brrtz running in Ubuntu WSL
-> /home/hanzj/code/brrtz
```

## Daily Flow

1. Mac -> Windows App -> connect to Rigby.
2. Open the Codex app on Rigby.
3. Open the Brrtz WSL project:

   ```text
   /home/hanzj/code/brrtz
   ```

4. Start the local server:

   ```sh
   npm start
   ```

5. Preview from the Mac:

   ```text
   http://192.168.3.45:5173
   ```

6. Drag screenshots into the Codex app for visual layout work.

## Mac Bookmark

Bookmark this URL on the Mac:

```text
http://192.168.3.45:5173
```

## Reboot Note

After a full Rigby reboot, WSL's internal IP can change. The Mac URL should stay
the same as long as Rigby keeps `192.168.3.45`, but if preview breaks later,
rerun the port-proxy rebuild command on Rigby.

## Why This Setup Matters

This is the preferred workflow for Brrtz development:

```text
Codex app UX
+ PC processing
+ WSL repo
+ Mac visual preview
```

