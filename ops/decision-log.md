# Decision Log

Use this file to record important product and engineering decisions.

## 2026-06-14 - Add Loop Engineering Ops Layer

Decision: Add a lightweight `/ops` documentation layer for agent roles, operating loops, data templates, reports, task handoffs, and release checks.

Context: Brrtz has moved from prototype toward beta launch. Work now spans Supabase, Railway, source adapters, search relevance, UX polish, and region expansion.

Options considered:
- Keep working through one-off chat prompts only.
- Add heavy project management tooling.
- Add lightweight repo-native operating docs.

Why this decision: Repo-native docs keep the workflow visible to humans and Codex without adding another tool or slowing the build.

Risks: Docs can drift if they are not updated during actual loop work.

Follow-up: Populate the source registry from the current codebase, then use the loop system for eBay API work.

## Template

### YYYY-MM-DD - Decision Title

Decision:

Context:

Options considered:

Why this decision:

Risks:

Follow-up:
