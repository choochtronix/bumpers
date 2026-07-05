# This is Noise Curation Process

This document explains the beta workflow behind the `This is noise` action in Brrtz.

## Goal

Use real user feedback to improve Gear Scanner curation without over-filtering valid gear.

The important rule: tapping `This is noise` captures evidence. It does not immediately create a global exclusion rule.

## What Happens When You Tap This Is Noise

1. The listing is marked as noise for the current user/profile.
2. The listing is dismissed from the current view.
3. Brrtz sends a compact listing snapshot to the local curation endpoint:

```txt
POST /api/curation/noise
```

4. The server appends the record to:

```txt
ops/curation/noise-inbox.jsonl
```

That file is intentionally ignored by git, because it is beta feedback data, not source code.

## What Gets Captured

Each record stores a small review snapshot:

- listing title
- source
- region
- currency
- price
- URL
- image URL
- condition
- shop/source metadata when available
- category metadata when available
- current page/view context
- current region/category/search source context
- capture timestamp
- dedupe key
- empty review fields for later classification

It does not store bulky listing caches or full source pages.

## Reviewing Captured Noise

Run:

```sh
cd ~/code/brrtz
npm run curation:noise-inbox
```

The report shows:

- total captured records
- unique listing groups
- duplicate clusters
- recent pending examples

Use this to spot repeated bad patterns like replacement screens, stickers, cases, ROM chips, sheet music, computer keyboard accessories, and unrelated media.

## Promoting Examples Into Real Filters

After review, promote only confirmed bad examples into the curation system.

Primary files:

```txt
test/fixtures/gear-scanner-curation.json
gear-scanner-curation.js
```

Recommended process:

1. Review the inbox with `npm run curation:noise-inbox`.
2. Pick clear bad examples.
3. Classify each reason, such as:
   - accessory-only
   - replacement part
   - computer accessory
   - sheet music / band accessory
   - cable/adapter/manual/case only
   - ROM/firmware/chip upgrade
   - unrelated item
4. Add exact examples to `test/fixtures/gear-scanner-curation.json` under `excluded`.
5. Add or tune generalized rules in `gear-scanner-curation.js`.
6. Preserve valid full gear listings that mention accessories included in the sale.
7. Run:

```sh
npm run qa:gear-scanner-curation
npm test
```

## Why We Do Not Auto-Filter Immediately

One bad click should not become a global rule. Many valid listings mention words like `case`, `manual`, `LCD`, `display`, or `adapter` because those items are included with a real synth or drum machine.

The inbox keeps beta feedback fast while keeping the actual curation rules intentional and reviewable.

## Useful Mental Model

`This is noise` is the collection step.

The curation fixture and rule update is the decision step.

That separation is what keeps Brrtz from becoming too aggressive and hiding good gear.
