-- Brrtz Phase One agentic schema.
-- Run manually in Supabase after reviewing. This does not include destructive drops.

create table if not exists public.regions (
  id text primary key,
  name text not null,
  slug text not null unique,
  country text not null,
  status text not null default 'planned'
    check (status in ('active', 'planned', 'testing', 'paused')),
  priority integer not null default 100,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.sources (
  id text primary key,
  name text not null,
  slug text not null unique,
  region_id text references public.regions(id) on delete set null,
  url text not null,
  type text not null
    check (type in ('marketplace', 'classifieds', 'shop', 'forum', 'social', 'manual', 'auction')),
  access_type text not null
    check (access_type in ('scrape', 'rss', 'api', 'manual', 'search-url', 'browser-assisted')),
  status text not null default 'candidate'
    check (status in ('active', 'testing', 'broken', 'paused', 'candidate')),
  reliability_score integer not null default 50 check (reliability_score between 0 and 100),
  noise_score integer not null default 50 check (noise_score between 0 and 100),
  last_checked_at timestamptz,
  last_successful_fetch_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.source_health_logs (
  id text primary key,
  source_id text not null references public.sources(id) on delete cascade,
  status text not null check (status in ('healthy', 'degraded', 'stale', 'broken', 'paused')),
  response_time_ms integer,
  listings_found integer not null default 0,
  error_message text,
  checked_at timestamptz not null default now()
);

create table if not exists public.raw_listings (
  id text primary key,
  source_id text not null references public.sources(id) on delete cascade,
  region_id text references public.regions(id) on delete set null,
  external_id text,
  source_url text not null,
  raw_title text not null,
  raw_description text,
  raw_price text,
  raw_location text,
  raw_images jsonb not null default '[]'::jsonb,
  raw_seller text,
  raw_posted_at timestamptz,
  raw_data jsonb not null default '{}'::jsonb,
  fetched_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.duplicate_groups (
  id text primary key,
  canonical_listing_id text,
  listing_ids jsonb not null default '[]'::jsonb,
  confidence_score integer not null default 0 check (confidence_score between 0 and 100),
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.normalized_listings (
  id text primary key,
  raw_listing_id text references public.raw_listings(id) on delete set null,
  source_id text not null references public.sources(id) on delete cascade,
  region_id text references public.regions(id) on delete set null,
  title text not null,
  brand text,
  model text,
  category text,
  gear_type text,
  price_amount numeric,
  price_currency text,
  condition text,
  location text,
  seller_name text,
  seller_type text check (seller_type in ('individual', 'shop', 'unknown')),
  source_url text not null,
  image_urls jsonb not null default '[]'::jsonb,
  posted_at timestamptz,
  fetched_at timestamptz not null default now(),
  duplicate_group_id text references public.duplicate_groups(id) on delete set null,
  quality_score integer not null default 0 check (quality_score between 0 and 100),
  noise_score integer not null default 0 check (noise_score between 0 and 100),
  trust_score integer not null default 0 check (trust_score between 0 and 100),
  status text not null default 'active'
    check (status in ('active', 'stale', 'sold', 'hidden', 'needs-review')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_search_matches (
  id text primary key,
  saved_search_id text not null references public.saved_searches(id) on delete cascade,
  user_id text not null,
  listing_id text not null references public.normalized_listings(id) on delete cascade,
  match_score integer not null default 0 check (match_score between 0 and 100),
  reason text not null default '',
  notification_status text not null default 'pending'
    check (notification_status in ('pending', 'sent', 'dismissed', 'viewed')),
  created_at timestamptz not null default now(),
  unique (saved_search_id, listing_id)
);

create table if not exists public.beta_feedback (
  id text primary key,
  user_id text,
  type text not null
    check (type in ('bug', 'source-request', 'feature-request', 'bad-result', 'missing-result', 'general', 'duplicate')),
  title text not null,
  message text not null default '',
  related_listing_id text,
  related_source_id text,
  related_search_query text,
  status text not null default 'new'
    check (status in ('new', 'reviewed', 'planned', 'resolved', 'rejected')),
  priority text not null default 'medium'
    check (priority in ('low', 'medium', 'high')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_sources_region_status on public.sources(region_id, status);
create index if not exists idx_source_health_logs_source_checked on public.source_health_logs(source_id, checked_at desc);
create index if not exists idx_raw_listings_source_external on public.raw_listings(source_id, external_id);
create index if not exists idx_normalized_listings_region_status on public.normalized_listings(region_id, status);
create index if not exists idx_normalized_listings_brand_model on public.normalized_listings(brand, model);
create index if not exists idx_saved_search_matches_user on public.saved_search_matches(user_id, created_at desc);
create index if not exists idx_beta_feedback_status on public.beta_feedback(status, created_at desc);

