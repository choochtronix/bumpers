# Brrtz Figma-to-Code Map

This repository uses a local mapping manifest while native Figma Code Connect is
unavailable on the current Professional plan. The manifest is the bridge between
the Brrtz Figma component library and the production vanilla HTML, CSS, and JS.

## Files

- `docs/figma-code-map.json` is the machine-readable source of truth.
- `scripts/figma-code-map-check.mjs` verifies every mapped file and source anchor.
- `DESIGN-SYSTEM.md` describes the broader token and component workflow.

## Workflow

1. Find the component in the Brrtz Figma Design System.
2. Look up its `nodeId` in `docs/figma-code-map.json`.
3. Follow the listed implementation anchors to the production HTML, CSS, and JS.
4. When a component or source selector is renamed, update both sides of the map.
5. Run `npm run design:map-check` before committing design-system work.

Each node can be opened directly with:

```text
https://www.figma.com/design/U1J4gaqeqckMVjwyrdGiuW/Brrtz-Design-System?node-id=<node-id-with-dash>
```

For example, the Search Field component at `107:180` becomes `node-id=107-180`.

## Scope

The map covers shared buttons, toggles, listing cards, selects, modal shells,
chips, token inputs, the primary search field, navigation, status feedback,
listing action menus, mobile action sheets, and Gear Scanner loading panels.

It intentionally maps to existing DOM and CSS patterns rather than introducing a
component framework. Native Code Connect can replace this manifest later without
changing the implementation source of truth.
