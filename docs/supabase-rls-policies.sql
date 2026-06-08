-- Bumpers basic Row Level Security policies.
-- Run after creating saved_searches and user_profiles.
-- The Node server uses SUPABASE_SERVICE_ROLE_KEY and continues to bypass RLS.

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
