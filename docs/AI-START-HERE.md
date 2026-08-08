# Brrtz AI Start Here

Use this document to onboard a fresh Codex, ChatGPT, or Claude development task without relying on a long conversation history. The repository and the documents below remain the source of truth.

## Read First

Read these files in order before making changes:

1. `docs/AI-START-HERE.md`
2. `docs/BRRTZ-HANDOFF.md`
3. `ROADMAP.md`
4. `DESIGN-SYSTEM.md`
5. `AGENTS.md`
6. Any task-specific handoff document named by the user

## Project Snapshot

Brrtz is a free beta gear radar for finding used synthesizers, drum machines, samplers, modular gear, effects, and pro audio across regional marketplaces. It emphasizes fast multi-source search, deterministic gear curation, saved searches, alerts, watched gear, and direct links to original listings.

- Frontend: vanilla HTML, CSS, and JavaScript
- Server: Node.js
- Account and cloud data: Supabase
- Selected connector automation: Playwright
- Local repository: `/home/hanzj/code/brrtz`
- Start locally: `npm start`
- Local URL: `http://127.0.0.1:5173`
- Mobile/LAN URL: use the Wi-Fi address printed by the server

## Sources Of Truth

- Runtime behavior and data contracts: repository code and tests
- Current product context and operational history: `docs/BRRTZ-HANDOFF.md`
- Planned work and sequencing: `ROADMAP.md`
- Visual rules: the Brrtz Figma design system, `DESIGN-SYSTEM.md`, tokens, and generated `design-system.css`
- Repository-specific engineering constraints: `AGENTS.md`

When sources disagree, inspect the live implementation and recent Git history before deciding. Do not silently overwrite newer working behavior with an older document or mockup.

## Product Invariants

- Preserve search, saved searches, watchlist, authentication, alerts, Gear Scanner, and responsive behavior unless the task explicitly changes them.
- GLG means the shared Grid, List, and Gallery result-card system.
- SSD means the Saved Searches Drawer in developer conversation only. Do not expose `SSD` as customer-facing copy.
- Every normalized listing must include `region` and `currency`.
- Keep full listing caches out of saved-search records.
- When changing the saved-search schema, bump its version and provide migration behavior.
- Prefer deterministic filtering and curation before introducing recurring AI cost.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to browser code.

## Design-System Contract

- Never edit generated `design-system.css` by hand.
- Use existing design tokens and CSS variables instead of hardcoded colors, radii, font weights, shadows, or motion durations.
- Dark mode is controlled through `body[data-theme="dark"]` and theme tokens.
- Check desktop and mobile layouts as well as light and dark modes when a visual change affects shared UI.
- When a task changes a reusable visual convention, keep the production implementation, documentation, and Figma component aligned when the available tools permit it.
- Production behavior is authoritative unless the task explicitly asks to update the implementation from a newer approved Figma design.

## Working Method

1. Inspect `git status`, recent commits, and the relevant implementation before editing.
2. Preserve unrelated working-tree changes. Never revert user work to simplify a task.
3. Follow existing architecture and local patterns.
4. Implement the request end to end rather than stopping at a proposal unless the user asks for analysis only.
5. Run the relevant existing validation commands from `package.json`.
6. Verify responsive and theme states when applicable.
7. Report what changed, what was validated, and any remaining risk.
8. Do not commit, push, merge, or deploy unless the user explicitly requests it.

## Documentation Upkeep

Update the durable handoff or roadmap when work introduces a meaningful product decision, architecture change, schema migration, external-service requirement, security consideration, or new operational process. Routine visual polish does not require a handoff rewrite unless it establishes a reusable convention.

## Fresh Task Opening Prompt

Use this prompt to begin a new Brrtz development task:

```text
Continue Brrtz development in /home/hanzj/code/brrtz.

First read, in order:
1. docs/AI-START-HERE.md
2. docs/BRRTZ-HANDOFF.md
3. ROADMAP.md
4. DESIGN-SYSTEM.md
5. AGENTS.md

Then inspect git status, recent commits, and the relevant implementation before editing. Treat the repository and those documents as the source of truth. Preserve all current product behavior and unrelated working-tree changes. Follow the design-system contract, test relevant desktop/mobile and light/dark states, run the existing validation commands, and handle the requested work end to end.

Do not commit, push, merge, or deploy unless I explicitly request it. Ping me only when a product or design decision genuinely needs approval.

Current task:
[PASTE THE NEXT BRRTZ TASK HERE]
```
