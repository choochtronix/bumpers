# Supabase Alpha Cloud Sync

This is the first production-shaped cloud step for Brrtz:

`Brrtz UI -> Node server/search connectors -> Supabase profiles/saved searches`

The app remains local-first. If Supabase is not configured, Brrtz keeps using the local cloud emulator at `data/cloud-saved-searches.json`.

## 1. Create A Supabase Project

Create a small Supabase project for the Brrtz alpha. The free tier is enough for friend testing saved searches and profile preferences.

## 2. Create The Saved Searches Table

Run this SQL in the Supabase SQL editor:

```sql
create table if not exists public.saved_searches (
  id text primary key,
  user_id text not null,
  schema_version integer not null default 1,
  name text not null,
  terms jsonb not null default '[]'::jsonb,
  excludes jsonb not null default '[]'::jsonb,
  noise_terms jsonb not null default '[]'::jsonb,
  sources jsonb not null default '[]'::jsonb,
  max_price integer not null default 0,
  alert_mode text not null default 'immediate',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  last_scanned_at timestamptz,
  last_match_count integer not null default 0,
  last_new_count integer not null default 0,
  last_source_count integer not null default 0,
  last_scan_status text
);

create index if not exists saved_searches_user_updated_idx
  on public.saved_searches (user_id, updated_at desc);

create table if not exists public.user_profiles (
  user_id text primary key,
  email text not null,
  name text not null,
  preferences jsonb not null default '{}'::jsonb,
  invite_status text not null default 'not_required',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.alpha_invites (
  email text primary key,
  status text not null default 'active',
  invited_by text,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create index if not exists alpha_invites_status_idx
  on public.alpha_invites (status, email);

grant select, insert, update, delete on public.saved_searches to service_role;
grant select, insert, update, delete on public.user_profiles to service_role;
grant select, insert, update, delete on public.alpha_invites to service_role;
```

For the current alpha adapter, the Node server uses the Supabase service role key and talks to Supabase server-side only. Do not expose the service role key in browser JavaScript.

## 3. Enable Basic RLS Policies

Run this after the tables above exist. This lets authenticated Supabase users access only their own saved searches and profile rows if Brrtz later reads directly from the client. The current Node server continues to work because `service_role` bypasses RLS.

The same SQL lives in `docs/supabase-rls-policies.sql`.

```sql
alter table public.saved_searches enable row level security;
alter table public.user_profiles enable row level security;

grant select, insert, update, delete on public.saved_searches to authenticated;
grant select, insert, update, delete on public.user_profiles to authenticated;

drop policy if exists "Users can read own saved searches" on public.saved_searches;
drop policy if exists "Users can insert own saved searches" on public.saved_searches;
drop policy if exists "Users can update own saved searches" on public.saved_searches;
drop policy if exists "Users can delete own saved searches" on public.saved_searches;

create policy "Users can read own saved searches"
  on public.saved_searches
  for select
  to authenticated
  using (user_id = auth.uid()::text);

create policy "Users can insert own saved searches"
  on public.saved_searches
  for insert
  to authenticated
  with check (user_id = auth.uid()::text);

create policy "Users can update own saved searches"
  on public.saved_searches
  for update
  to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "Users can delete own saved searches"
  on public.saved_searches
  for delete
  to authenticated
  using (user_id = auth.uid()::text);

drop policy if exists "Users can read own profile" on public.user_profiles;
drop policy if exists "Users can insert own profile" on public.user_profiles;
drop policy if exists "Users can update own profile" on public.user_profiles;
drop policy if exists "Users can delete own profile" on public.user_profiles;

create policy "Users can read own profile"
  on public.user_profiles
  for select
  to authenticated
  using (user_id = auth.uid()::text);

create policy "Users can insert own profile"
  on public.user_profiles
  for insert
  to authenticated
  with check (user_id = auth.uid()::text);

create policy "Users can update own profile"
  on public.user_profiles
  for update
  to authenticated
  using (user_id = auth.uid()::text)
  with check (user_id = auth.uid()::text);

create policy "Users can delete own profile"
  on public.user_profiles
  for delete
  to authenticated
  using (user_id = auth.uid()::text);
```

## 4. Configure Local Environment

Copy `.env.example` to `.env.local` or set these variables in your host:

```bash
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_CLOUD_USER_ID=alpha
BUMPERS_CLOUD_USER_EMAIL=alpha@bumpers.local
BUMPERS_CLOUD_USER_NAME="Brrtz Alpha User"
BUMPERS_REQUIRE_INVITE=false

SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

`SUPABASE_ANON_KEY` is the public anon key from Supabase Project Settings -> API. It is safe for browser auth flows when Row Level Security is configured for user-owned tables. Keep `SUPABASE_SERVICE_ROLE_KEY` private in `.env.local` only.

When signed in, cloud saved-search sync uses the authenticated Supabase user id. When signed out, Brrtz falls back to the configured alpha profile so local testing still works.

Current alpha cloud data:

- Saved searches live in `public.saved_searches`.
- Account preferences live in `public.user_profiles.preferences`.
- Preferences currently include theme, currency, exchange rate, watched listing ids, watched listing snapshots, and search feedback/noise rules.
- Saved-search create/delete/import/scan updates auto-sync in the background when signed in.
- Watched listing and feedback changes auto-sync through profile preferences when signed in.
- Settings -> Account -> Sync now is the primary user-facing sync path. It pulls/merges cloud data first, keeps the newest matching saved-search version, then pushes the merged browser state back to cloud.
- Background saved-search pushes check whether cloud data is newer than this browser's last sync. If another browser changed saved searches first, Brrtz pauses the background push and asks the user to run Sync now.

Leave `BUMPERS_REQUIRE_INVITE=false` while you are testing your own login. Change it to `true` when friend testing should be invite-only, then add allowed emails:

```sql
insert into public.alpha_invites (email, status, invited_by)
values ('friend@example.com', 'active', 'craig')
on conflict (email) do update
set status = excluded.status;
```

The current alpha gate is an email allowlist, not a typed invite-code field. That keeps the first friend-test flow simple:

1. Add the tester email to `alpha_invites` with `status = 'active'`.
2. Set `BUMPERS_REQUIRE_INVITE=true` in `.env.local`.
3. Restart Brrtz.
4. Have the tester sign in from Settings -> Account.

Brrtz normalizes invite email checks by trimming spaces and comparing lowercase emails. This avoids browser-to-browser mismatches caused by case or accidental whitespace in the invite row.

To confirm the blocked-user message, temporarily pause a tester:

```sql
update public.alpha_invites
set status = 'paused'
where email = 'friend@example.com';
```

Then use Settings -> Account -> Sync now. Brrtz should show the invite-only message returned by the server. Restore access with:

```sql
update public.alpha_invites
set status = 'active'
where email = 'friend@example.com';
```

## 5. Run Brrtz

```bash
npm start
```

Then open Settings and use:

- Account -> `Sync now` to keep this browser aligned with Supabase.
- Data -> Advanced recovery tools only if support needs manual saved-search pull/push recovery.

## 6. Next Phase: Invite-Only Login

Pass 2 added:

- Supabase Auth magic-link login in Settings -> Account.
- A local browser auth session for desktop and mobile web.
- Sign out and session restore.

Pass 3 adds:

- Server-side verification of the browser Supabase session.
- Per-user `saved_searches.user_id` routing for cloud push/pull.
- User-scoped Supabase row ids to prevent saved-search id collisions between users.
- Account-level profile preferences in `user_profiles`.
- Optional invite-only account enforcement with `alpha_invites` and `BUMPERS_REQUIRE_INVITE=true`.

To test magic links locally, add your local Brrtz URL to Supabase Auth redirect URLs:

- `http://127.0.0.1:5173`
- Your Wi-Fi preview URL, for example `http://192.168.x.x:5173`
- Your Tailscale preview URL if you use remote mobile testing.

After per-user saved-search and preference sync are working, add:

- Profile fields for source defaults and alert settings.

That will let desktop, mobile web, and the future iOS app all use the same saved-search data without duplicating development.
