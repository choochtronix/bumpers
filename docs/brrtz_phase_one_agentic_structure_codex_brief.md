# Brrtz Phase One Agentic Structure

## Objective

Implement a starter agentic operating system for **Brrtz.com**, an invite-only beta search engine for music gear listings.

The goal is not to build “AI agents” as abstract chatbots. The goal is to create **repeatable operational modules** that improve listing quality, source reliability, user search value, and regional expansion.

Phase One should focus on six starter agents:

1. **Source Scout Agent**
2. **Source Health Agent**
3. **Listing Normalizer Agent**
4. **Duplicate / Noise Detector Agent**
5. **Saved Search Agent**
6. **Beta Feedback Agent**

These agents can begin as scheduled scripts, API routes, background jobs, admin tools, and structured LLM prompts. They should be modular enough to become more autonomous later.

---

# Core Principle

Brrtz should be structured around this model:

```text
Every region is a module.
Every source is a feed.
Every listing is normalized.
Every user search becomes a signal.
Every beta user action improves the system.
```

---

# Phase One System Architecture

Implement the agentic system as five main layers:

```text
Brrtz App
│
├── Sources
│   ├── Regions
│   ├── Source configs
│   └── Source health checks
│
├── Listings
│   ├── Raw listings
│   ├── Normalized listings
│   ├── duplicate groups
│   └── noise flags
│
├── Users
│   ├── invite-only accounts
│   ├── saved searches
│   └── alert preferences
│
├── Agent Jobs
│   ├── source scout
│   ├── source health
│   ├── listing normalizer
│   ├── duplicate detector
│   ├── saved search matcher
│   └── beta feedback collector
│
└── Admin Dashboard
    ├── source status
    ├── listing quality review
    ├── saved search activity
    ├── beta feedback
    └── region expansion checklist
```

---

# Recommended Folder Structure

Codex should implement or adapt something close to this:

```text
/src
  /agents
    sourceScoutAgent.ts
    sourceHealthAgent.ts
    listingNormalizerAgent.ts
    duplicateNoiseAgent.ts
    savedSearchAgent.ts
    betaFeedbackAgent.ts

  /lib
    db.ts
    logger.ts
    sourceAdapters.ts
    normalization.ts
    duplicateDetection.ts
    gearTaxonomy.ts
    alerts.ts

  /regions
    japan.ts
    bayArea.ts
    california.ts

  /sources
    sourceTypes.ts
    sourceRegistry.ts
    adapters/
      craigslist.ts
      reverb.ts
      yahooAuctions.ts
      mercari.ts
      digimart.ts
      jmty.ts
      hardoff.ts

  /jobs
    runSourceHealth.ts
    runListingNormalization.ts
    runDuplicateDetection.ts
    runSavedSearchMatching.ts
    runBetaFeedbackDigest.ts

  /admin
    sources/
    listings/
    feedback/
    saved-searches/
    regions/
```

This does not need to be exact, but the logic should stay modular.

---

# Database Schema

Codex should create or adapt these core database tables.

## 1. Regions

```ts
Region {
  id: string
  name: string              // "Japan", "Bay Area", "Los Angeles"
  slug: string              // "japan", "bay-area", "los-angeles"
  country: string
  status: "active" | "planned" | "testing" | "paused"
  priority: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

Example records:

```text
Japan — active
Bay Area — testing
Los Angeles — planned
California — planned
```

---

## 2. Sources

```ts
Source {
  id: string
  name: string              // "Digimart", "Craigslist SF Bay", "Robot Speak"
  slug: string
  regionId: string
  url: string
  type: "marketplace" | "classifieds" | "shop" | "forum" | "social" | "manual"
  accessType: "scrape" | "rss" | "api" | "manual" | "search-url"
  status: "active" | "testing" | "broken" | "paused" | "candidate"
  reliabilityScore: number  // 0-100
  noiseScore: number        // 0-100, higher = noisier
  lastCheckedAt?: Date
  lastSuccessfulFetchAt?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 3. Raw Listings

Raw listings preserve whatever comes from the source.

```ts
RawListing {
  id: string
  sourceId: string
  regionId: string
  externalId?: string
  sourceUrl: string
  rawTitle: string
  rawDescription?: string
  rawPrice?: string
  rawLocation?: string
  rawImages?: string[]
  rawSeller?: string
  rawPostedAt?: Date
  rawData: Json
  fetchedAt: Date
  createdAt: Date
}
```

---

## 4. Normalized Listings

This is the clean Brrtz version.

```ts
NormalizedListing {
  id: string
  rawListingId: string
  sourceId: string
  regionId: string

  title: string
  brand?: string
  model?: string
  category?: string             // synth, drum-machine, sampler, effects, modular, mixer
  gearType?: string             // analog synth, FM synth, groovebox, eurorack module
  priceAmount?: number
  priceCurrency?: string
  condition?: string            // new, used, junk, excellent, unknown
  location?: string
  sellerName?: string
  sellerType?: "individual" | "shop" | "unknown"

  sourceUrl: string
  imageUrls?: string[]

  postedAt?: Date
  fetchedAt: Date

  duplicateGroupId?: string
  qualityScore: number          // 0-100
  noiseScore: number            // 0-100
  trustScore: number            // 0-100

  status: "active" | "stale" | "sold" | "hidden" | "needs-review"

  createdAt: Date
  updatedAt: Date
}
```

---

## 5. Duplicate Groups

```ts
DuplicateGroup {
  id: string
  canonicalListingId: string
  listingIds: string[]
  confidenceScore: number
  reason?: string
  createdAt: Date
  updatedAt: Date
}
```

---

## 6. Saved Searches

```ts
SavedSearch {
  id: string
  userId: string
  name: string                  // "Roland SH-101 under ¥160,000"
  query: string                 // "Roland SH-101"
  brands?: string[]
  models?: string[]
  categories?: string[]
  regionIds?: string[]
  maxPrice?: number
  minPrice?: number
  currency?: string
  condition?: string[]
  includeShops: boolean
  includePrivateSellers: boolean
  alertEnabled: boolean
  alertFrequency: "instant" | "daily" | "weekly" | "off"
  lastMatchedAt?: Date
  createdAt: Date
  updatedAt: Date
}
```

---

## 7. Saved Search Matches

```ts
SavedSearchMatch {
  id: string
  savedSearchId: string
  userId: string
  listingId: string
  matchScore: number
  reason: string
  notificationStatus: "pending" | "sent" | "dismissed" | "viewed"
  createdAt: Date
}
```

---

## 8. Beta Feedback

```ts
BetaFeedback {
  id: string
  userId?: string
  type: "bug" | "source-request" | "feature-request" | "bad-result" | "missing-result" | "general"
  title: string
  message: string
  relatedListingId?: string
  relatedSourceId?: string
  relatedSearchQuery?: string
  status: "new" | "reviewed" | "planned" | "resolved" | "rejected"
  priority: "low" | "medium" | "high"
  createdAt: Date
  updatedAt: Date
}
```

---

# Agent 1: Source Scout Agent

## Purpose

Find and track possible new sources for gear listings.

In Phase One, this can be semi-manual. The agent should support adding candidate sources through an admin form and ranking them.

## Responsibilities

- Maintain source candidates by region.
- Score each source.
- Recommend which source should be added next.
- Track whether source is scrapeable, manual, search URL only, or needs custom adapter.

## Source Scout Scoring

Each source should receive:

```ts
SourceCandidateScore {
  relevanceScore: number       // Is this source actually good for synth/music gear?
  freshnessScore: number       // Does it update often?
  feasibilityScore: number     // Can Brrtz access it reliably?
  uniquenessScore: number      // Does it have listings not found elsewhere?
  noiseScore: number           // How much junk appears?
  priorityScore: number        // Weighted final score
}
```

## Recommended Formula

```ts
priorityScore =
  relevanceScore * 0.30 +
  freshnessScore * 0.20 +
  feasibilityScore * 0.20 +
  uniquenessScore * 0.20 -
  noiseScore * 0.10
```

## Admin UI

Create an admin page:

```text
/admin/sources/candidates
```

Fields:

- source name
- region
- URL
- type
- notes
- status
- scores
- “promote to active source” button

## Codex Task

```text
Create a Source Scout module that allows admin users to add, review, score, and promote candidate listing sources by region. Store candidate source metadata in the database and display a sortable admin table by priority score.
```

---

# Agent 2: Source Health Agent

## Purpose

Monitor whether each source is working, stale, broken, or noisy.

## Responsibilities

- Check active sources on a schedule.
- Record success or failure.
- Track number of listings fetched.
- Track last successful fetch.
- Mark sources as broken if they fail repeatedly.
- Surface source problems in admin.

## Health States

```ts
SourceHealthStatus =
  | "healthy"
  | "degraded"
  | "stale"
  | "broken"
  | "paused"
```

## Health Check Logic

For each active source:

```text
1. Attempt fetch or test query.
2. If response succeeds, count listings.
3. If listings > 0, mark healthy.
4. If response succeeds but listings = 0 repeatedly, mark stale or degraded.
5. If response fails 3 times in a row, mark broken.
6. Store error details.
```

## Source Health Log

```ts
SourceHealthLog {
  id: string
  sourceId: string
  status: "healthy" | "degraded" | "stale" | "broken"
  responseTimeMs?: number
  listingsFound: number
  errorMessage?: string
  checkedAt: Date
}
```

## Admin UI

Create:

```text
/admin/sources/health
```

Display:

- source name
- region
- current status
- listings fetched today
- last successful fetch
- reliability score
- latest error
- “pause source”
- “retry health check”
- “view logs”

## Codex Task

```text
Implement a Source Health Agent that checks each active source, records health logs, updates source status, and displays source health in the admin dashboard.
```

---

# Agent 3: Listing Normalizer Agent

## Purpose

Convert messy raw listings into clean Brrtz listings.

This is a core moat.

## Responsibilities

- Parse raw title and description.
- Extract brand, model, category, condition, price, currency, location.
- Normalize inconsistent gear names.
- Assign quality score.
- Assign trust score.
- Mark uncertain listings as `needs-review`.

## Example

Raw:

```text
"ROLAND JUNO106 vintage synth great sound no case"
```

Normalized:

```json
{
  "brand": "Roland",
  "model": "Juno-106",
  "category": "synth",
  "gearType": "analog polyphonic synthesizer",
  "condition": "used",
  "qualityScore": 82,
  "noiseScore": 12
}
```

## Gear Taxonomy Seed

Codex should create a basic taxonomy file.

```ts
export const GEAR_TAXONOMY = {
  brands: [
    "Roland",
    "Korg",
    "Yamaha",
    "Moog",
    "Sequential",
    "Oberheim",
    "Akai",
    "Elektron",
    "Ensoniq",
    "E-mu",
    "Casio",
    "Novation",
    "Arturia",
    "Teenage Engineering",
    "Make Noise",
    "Mutable Instruments",
    "Intellijel",
    "Dave Smith Instruments"
  ],

  categories: [
    "synth",
    "drum-machine",
    "sampler",
    "sequencer",
    "groovebox",
    "effects",
    "modular",
    "mixer",
    "audio-interface",
    "keyboard-controller",
    "rack-synth"
  ],

  aliases: {
    "Juno106": "Juno-106",
    "Juno 106": "Juno-106",
    "TR909": "TR-909",
    "TR 909": "TR-909",
    "TB303": "TB-303",
    "TB 303": "TB-303",
    "DX7": "DX7",
    "SP1200": "SP-1200",
    "SP 1200": "SP-1200"
  }
}
```

## Normalization Function

Codex should implement:

```ts
normalizeListing(rawListing: RawListing): NormalizedListing
```

Minimum behavior:

```text
1. Clean title.
2. Detect brand.
3. Detect model alias.
4. Extract price.
5. Detect currency.
6. Detect location.
7. Detect category.
8. Estimate condition.
9. Assign quality score.
10. Assign noise score.
11. Save normalized listing.
```

## Quality Score

Suggested inputs:

```text
+ title contains known brand
+ title contains known model
+ price exists
+ image exists
+ location exists
+ source is reliable
+ description exists
- title is vague
- price missing
- no image
- old listing
- duplicate suspected
```

## Codex Task

```text
Implement a Listing Normalizer Agent that transforms RawListing records into NormalizedListing records using a gear taxonomy, alias map, price parser, condition detector, and quality scoring system.
```

---

# Agent 4: Duplicate / Noise Detector Agent

## Purpose

Reduce clutter and detect repeated listings across sources.

## Responsibilities

- Compare normalized listings.
- Detect likely duplicates.
- Group duplicates.
- Pick a canonical listing.
- Flag noisy or irrelevant listings.
- Hide very low-quality listings from default search.

## Duplicate Signals

Use a weighted comparison:

```text
brand match
model match
price similarity
title similarity
same image URL
same seller
same location
same source URL
posted around same time
```

## Duplicate Confidence

```ts
DuplicateCandidate {
  listingA: string
  listingB: string
  confidenceScore: number
  reasons: string[]
}
```

## Suggested Thresholds

```text
90–100: automatic duplicate
75–89: probable duplicate, admin review
60–74: possible duplicate
below 60: ignore
```

## Noise Detection

Flag listings as noisy if:

```text
title does not contain music gear terms
missing price and missing image
contains unrelated categories
contains too many unrelated keywords
source has high noise score
listing is very old
listing has scam-like language
```

## Codex Task

```text
Implement a Duplicate / Noise Detection Agent that compares normalized listings, groups high-confidence duplicates, assigns duplicateGroupId values, selects a canonical listing, and marks noisy listings as hidden or needs-review.
```

---

# Agent 5: Saved Search Agent

## Purpose

Turn users’ searches into persistent intent.

This is where Brrtz becomes sticky.

## Responsibilities

- Allow beta users to save searches.
- Match new listings against saved searches.
- Create match records.
- Eventually trigger alerts.
- Track what users are hunting for.

## User Flow

On search results page:

```text
User searches: "Roland TR-909"
User filters: Japan, max ¥500,000
Button appears: "Save this search"
User names it: "TR-909 Japan"
User chooses alert frequency: instant, daily, weekly, off
Saved search is created.
```

## Matching Logic

When a new listing is normalized:

```text
1. Fetch active saved searches.
2. Compare listing against query, brand, model, region, price, condition.
3. If match score exceeds threshold, create SavedSearchMatch.
4. Avoid duplicate matches for the same listing/search pair.
5. Mark notification as pending.
```

## Match Score

```text
+ query match
+ exact brand match
+ exact model match
+ region match
+ price within range
+ condition match
+ high listing quality
- noisy listing
- duplicate listing
- stale listing
```

## Suggested Match Threshold

```text
80+ = strong match
65–79 = possible match
below 65 = ignore
```

For beta, show strong matches only.

## Admin UI

Create:

```text
/admin/saved-searches
```

Display:

- user
- saved search name
- query
- region
- max price
- alert frequency
- matches generated
- last matched

## Codex Task

```text
Implement saved search functionality for beta users, including creating saved searches from search results, storing filters, matching new normalized listings against saved searches, and recording matches.
```

---

# Agent 6: Beta Feedback Agent

## Purpose

Capture beta-user signals before they disappear.

## Responsibilities

- Let users submit feedback from search results.
- Let users flag bad listings.
- Let users request sources.
- Let users report missing results.
- Summarize feedback for admin review.

## Feedback Entry Points

Add small feedback actions:

```text
On search results:
- “Bad result”
- “Duplicate”
- “Missing gear?”
- “Request a source”
- “General feedback”

On listing cards:
- “Flag listing”
- “Not music gear”
- “Already sold”
- “Duplicate”
```

## Admin UI

Create:

```text
/admin/feedback
```

Display:

- feedback type
- user
- related query
- related listing
- message
- priority
- status
- created date

## Feedback Digest

Add a simple weekly/daily digest generator:

```text
Top beta feedback this week:
1. Most requested gear
2. Most requested sources
3. Most common bad results
4. Most common missing regions
5. Bugs reported
6. Suggested next fixes
```

## Codex Task

```text
Implement a Beta Feedback Agent with user-facing feedback controls and an admin feedback dashboard. Store feedback records and provide a digest view grouped by type, source, region, and search query.
```

---

# Admin Dashboard

Create a basic internal page:

```text
/admin
```

Sections:

```text
Search Ops
- Source Health
- Source Candidates
- Listing Quality
- Duplicate Review
- Noise Review

User Signal
- Saved Searches
- Saved Search Matches
- Beta Feedback
- Top Queries
- Missing Results

Region Expansion
- Japan
- Bay Area
- Los Angeles
- California
```

This dashboard does not need to be beautiful yet. It needs to make the system visible.

---

# Phase One Priority Order

Codex should implement in this order:

## Step 1: Database Schema

Create tables/models for:

```text
Region
Source
SourceHealthLog
RawListing
NormalizedListing
DuplicateGroup
SavedSearch
SavedSearchMatch
BetaFeedback
```

---

## Step 2: Source Registry

Create a source registry file:

```ts
export const SOURCE_REGISTRY = [
  {
    name: "Digimart",
    region: "japan",
    type: "marketplace",
    accessType: "search-url",
    status: "active"
  },
  {
    name: "Jmty",
    region: "japan",
    type: "classifieds",
    accessType: "search-url",
    status: "active"
  },
  {
    name: "Yahoo Auctions Japan",
    region: "japan",
    type: "marketplace",
    accessType: "search-url",
    status: "testing"
  },
  {
    name: "Craigslist SF Bay",
    region: "bay-area",
    type: "classifieds",
    accessType: "search-url",
    status: "testing"
  },
  {
    name: "Robot Speak",
    region: "bay-area",
    type: "shop",
    accessType: "manual",
    status: "candidate"
  }
]
```

---

## Step 3: Listing Normalizer

Implement core normalizer before advanced agents.

Reason: everything depends on clean listings.

---

## Step 4: Source Health

Make sure the system can detect broken or stale sources.

---

## Step 5: Duplicate / Noise Detection

Improve result quality.

---

## Step 6: Saved Searches

Add user value and beta retention.

---

## Step 7: Beta Feedback

Add feedback loops before inviting more beta users.

---

# Suggested Job Schedule

For beta:

```text
Source Health Agent:
Every 6 hours

Listing Normalizer Agent:
Every time new raw listings are fetched
or every 30 minutes

Duplicate / Noise Agent:
Every 30 minutes

Saved Search Agent:
Every 30 minutes

Beta Feedback Digest:
Once per day

Source Scout Review:
Manual/admin triggered
```

If background jobs are not yet available, Codex can implement these as protected API routes first:

```text
/api/jobs/source-health
/api/jobs/normalize-listings
/api/jobs/detect-duplicates
/api/jobs/match-saved-searches
/api/jobs/feedback-digest
```

Later these can move to cron jobs.

---

# Minimum Viable Admin Views

For beta this week, build these first:

```text
/admin/sources
/admin/sources/health
/admin/listings/review
/admin/saved-searches
/admin/feedback
```

Each page can be simple tables.

---

# Listing Card Improvements

The public search result cards should eventually show:

```text
Title
Brand
Model
Price
Location
Source
Posted date
Image
Quality signal
Duplicate indicator
Save / watch button
Flag button
```

For beta, the most important controls are:

```text
Save this search
Flag bad result
Request source
```

---

# Codex Master Prompt

Paste this into Codex:

```text
You are working on Brrtz.com, an invite-only beta search engine for new and used music gear listings.

Implement a Phase One agentic structure for the product. These are not chat agents. They are modular operational agents implemented as database models, job functions, admin views, and reusable logic.

The six starter agents are:

1. Source Scout Agent
2. Source Health Agent
3. Listing Normalizer Agent
4. Duplicate / Noise Detector Agent
5. Saved Search Agent
6. Beta Feedback Agent

Core principle:
Every region is a module.
Every source is a feed.
Every listing is normalized.
Every user search becomes a signal.
Every beta user action improves the system.

Please implement the system in this order:

1. Add database models/tables for:
- Region
- Source
- SourceHealthLog
- RawListing
- NormalizedListing
- DuplicateGroup
- SavedSearch
- SavedSearchMatch
- BetaFeedback

2. Create a source registry module with initial regions:
- Japan
- Bay Area
- Los Angeles
- California

3. Create starter source records for:
- Digimart
- Jmty
- Yahoo Auctions Japan
- Mercari Japan
- Hard-Off
- Craigslist SF Bay
- Reverb
- Robot Speak

4. Implement a Listing Normalizer Agent:
- Normalize raw listing titles
- Detect brand
- Detect model
- Use alias mapping
- Extract price and currency
- Detect category
- Estimate condition
- Assign qualityScore, noiseScore, and trustScore
- Save NormalizedListing records

5. Implement a Source Health Agent:
- Check active sources
- Record SourceHealthLog entries
- Update source status
- Mark sources as healthy, degraded, stale, or broken
- Display source health in admin

6. Implement a Duplicate / Noise Detection Agent:
- Compare normalized listings
- Detect likely duplicates
- Create DuplicateGroup records
- Assign duplicateGroupId
- Select a canonical listing
- Hide or flag noisy listings

7. Implement Saved Search functionality:
- Let beta users save a search from search results
- Store query and filters
- Match new normalized listings against saved searches
- Create SavedSearchMatch records
- Track pending notifications, but do not send external emails unless email infrastructure is already configured

8. Implement Beta Feedback:
- Add feedback controls to search result pages and listing cards
- Store BetaFeedback records
- Create admin view for reviewing feedback
- Add statuses: new, reviewed, planned, resolved, rejected

9. Create simple admin pages:
- /admin
- /admin/sources
- /admin/sources/health
- /admin/listings/review
- /admin/saved-searches
- /admin/feedback

10. Create protected job routes or background functions:
- runSourceHealth
- runListingNormalization
- runDuplicateDetection
- runSavedSearchMatching
- runBetaFeedbackDigest

Do not overbuild. Use simple, readable code. Prioritize beta reliability, visibility, and modularity. The system should be easy to expand to new regions and sources.
```

---

# Founder Operating Workflow

This is how Craig should personally use the system during beta.

## Daily Search Ops Review

Open:

```text
/admin/sources/health
```

Ask:

```text
Which sources broke?
Which sources went stale?
Which sources generated junk?
Which source produced the best listings?
```

Then open:

```text
/admin/listings/review
```

Ask:

```text
Are the results clean?
Are duplicates showing up?
Are brands/models being parsed correctly?
Are prices readable?
```

---

## Daily User Signal Review

Open:

```text
/admin/saved-searches
/admin/feedback
```

Ask:

```text
What are beta users hunting for?
What searches are failing?
What sources are users asking for?
What gear terms need aliases?
What listings are being flagged?
```

---

## Weekly Expansion Review

Open:

```text
/admin/sources/candidates
```

Ask:

```text
What source should be added next?
Which region is gaining momentum?
Is Bay Area ready?
Is LA separate or part of California?
Which shops or communities are missing?
```

---

# First Beta KPI Set

Track these manually or in the admin dashboard:

```text
Number of active sources
Number of healthy sources
Number of normalized listings
Percentage of listings with detected brand
Percentage of listings with detected model
Duplicate rate
Noise rate
Saved searches created
Matches generated
Feedback submissions
Most searched gear
Most requested sources
```

The most important early metric is not traffic.

The most important early metric is:

```text
Did Brrtz surface something useful that the user would have missed elsewhere?
```

---

# Recommended Phase One Definition of Done

Phase One is successful when:

```text
1. Admin can see all sources by region.
2. Admin can see source health.
3. Raw listings become normalized listings.
4. Listings have brand/model/category/price where possible.
5. Obvious duplicates are grouped or flagged.
6. Users can save a search.
7. Saved searches can match new listings.
8. Beta users can submit feedback.
9. Admin can review feedback.
10. Adding a new region does not require rewriting the whole app.
```

---

# Recommended Beta Priority

For this week’s invite-only beta, prioritize this order:

```text
1. Listing Normalizer
2. Source Health
3. Saved Searches
4. Feedback
5. Duplicate Detection
6. Source Scout
```

Reason: beta friends need to feel immediate value. The most visible value is clean results, saved searches, and a way to tell you what is missing.

The deeper agentic system can evolve underneath that.
