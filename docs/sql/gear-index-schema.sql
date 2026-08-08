-- Gear Index daily snapshots: one aggregate row per model x region x day.
-- Stores derived statistics only (median/quartiles/counts) — never listing
-- snapshots — to stay inside the live-search legal posture.
-- Run in the Supabase SQL editor. Idempotent.

create table if not exists public.gear_index_daily (
  model_slug text not null,
  region text not null,
  day date not null,
  currency text not null,
  sample_count integer not null default 0,
  trimmed_count integer not null default 0,
  median_price numeric,
  p25_price numeric,
  p75_price numeric,
  min_price numeric,
  max_price numeric,
  usd_median numeric,
  fx_rate_usd numeric,
  source_count integer not null default 0,
  source_breakdown jsonb,
  updated_at timestamptz not null default now(),
  primary key (model_slug, region, day)
);

create index if not exists gear_index_daily_day_idx on public.gear_index_daily (day desc);

alter table public.gear_index_daily enable row level security;

-- Index values are public product data: anyone may read, only the server
-- (service role, which bypasses RLS) may write.
drop policy if exists "gear_index_daily_public_read" on public.gear_index_daily;
create policy "gear_index_daily_public_read"
  on public.gear_index_daily for select
  using (true);
