-- Additive migration. Back up saved_searches first; deploy the matching server/client together.
begin;
alter table public.saved_searches add column if not exists region_id text;
alter table public.saved_searches add column if not exists category_intent text;
create table if not exists public.saved_search_sync_state (
  user_id text primary key,
  revision bigint not null default 0
);
alter table public.saved_search_sync_state enable row level security;
grant all on public.saved_search_sync_state to service_role;

create or replace function public.brrtz_sync_saved_searches(
  p_user_id text, p_revision bigint default null,
  p_rows jsonb default null, p_deleted_ids text[] default '{}'
) returns jsonb language plpgsql security invoker set search_path = public as $$
declare v_revision bigint; v_result jsonb;
begin
  if p_user_id is null or length(p_user_id) = 0 then raise exception 'invalid_owner'; end if;
  insert into saved_search_sync_state(user_id) values(p_user_id) on conflict do nothing;
  select revision into v_revision from saved_search_sync_state where user_id = p_user_id for update;
  if p_rows is not null then
    if p_revision is distinct from v_revision then
      return jsonb_build_object('conflict', true, 'revision', v_revision);
    end if;
    if jsonb_typeof(p_rows) <> 'array' or jsonb_array_length(p_rows) > 500
      or cardinality(p_deleted_ids) > 5000 then raise exception 'invalid_batch'; end if;
    if exists(select 1 from jsonb_array_elements(p_rows) r
      where r->>'user_id' is distinct from p_user_id
      or left(r->>'id', length(p_user_id) + 1) is distinct from p_user_id || ':')
      or exists(select 1 from unnest(p_deleted_ids) id where left(id, length(p_user_id) + 1) <> p_user_id || ':')
      then raise exception 'invalid_owner'; end if;

    insert into saved_searches select * from jsonb_populate_recordset(null::saved_searches, p_rows)
    on conflict(id) do update set
      schema_version = excluded.schema_version, name = excluded.name,
      terms = excluded.terms, excludes = excluded.excludes, noise_terms = excluded.noise_terms,
      sources = excluded.sources, max_price = excluded.max_price,
      alert_mode = excluded.alert_mode, alerts_enabled = excluded.alerts_enabled,
      updated_at = excluded.updated_at, last_scanned_at = excluded.last_scanned_at,
      last_match_count = excluded.last_match_count, last_new_count = excluded.last_new_count,
      last_source_count = excluded.last_source_count, last_scan_status = excluded.last_scan_status,
      region_id = excluded.region_id, category_intent = excluded.category_intent
    where saved_searches.user_id = p_user_id and saved_searches.deleted_at is null;

    insert into saved_searches(id, user_id, name, deleted_at)
      select id, p_user_id, 'Deleted search', now() from unnest(p_deleted_ids) id
    on conflict(id) do update set deleted_at = coalesce(saved_searches.deleted_at, now()),
      alerts_enabled = false, updated_at = now()
    where saved_searches.user_id = p_user_id;
    update saved_search_sync_state set revision = revision + 1 where user_id = p_user_id
      returning revision into v_revision;
  end if;
  select coalesce(jsonb_agg(to_jsonb(s) order by s.updated_at desc, s.id), '[]') into v_result
    from saved_searches s where user_id = p_user_id;
  return jsonb_build_object('revision', v_revision, 'rows', v_result);
end $$;
revoke all on function public.brrtz_sync_saved_searches(text, bigint, jsonb, text[]) from public, anon, authenticated;
grant execute on function public.brrtz_sync_saved_searches(text, bigint, jsonb, text[]) to service_role;
commit;
