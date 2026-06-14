# QA Release Loop

## Purpose

Protect production stability.

## Workflow

1. Every meaningful change happens in a branch.
2. PR includes summary, screenshots if UI changed, and test notes.
3. Automated checks run.
4. Preview deploy is inspected.
5. Smoke tests are completed.
6. Release notes are written.
7. Merge only after pass.

## Smoke Test Searches

- Roland TR-909
- TB-303
- Minimoog
- Juno-106
- Prophet-5
- MPC
- OP-1
- Elektron Digitakt
- SP-404
- MS-20

## Definition Of Done

- Search works.
- Results page loads.
- Listing links work.
- Mobile layout works.
- No obvious source breakage.
- No console errors if easy to check.
