# Brrtz Release Checklist

For beta-facing changes, also run the focused checklist in `docs/beta-qa-loop.md`.

## Before Merge

- [ ] PR has a clear summary.
- [ ] Scope is small and understandable.
- [ ] No unrelated redesign or refactor.
- [ ] Tests pass if available.
- [ ] Preview build checked.
- [ ] Mobile checked if UI changed.
- [ ] Search checked if search/relevance changed.
- [ ] Source health checked if ingestion changed.
- [ ] Decision log updated if needed.

## Smoke Test Searches

- [ ] Roland TR-909
- [ ] TB-303
- [ ] Minimoog
- [ ] Juno-106
- [ ] Prophet-5
- [ ] MPC
- [ ] OP-1
- [ ] Elektron Digitakt
- [ ] SP-404
- [ ] MS-20

## After Merge

- [ ] Production deploy confirmed.
- [ ] Main search page loads.
- [ ] Listing result links work.
- [ ] No obvious console errors.
- [ ] Release note written.
