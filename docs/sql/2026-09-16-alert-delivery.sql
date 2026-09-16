begin;
create table if not exists public.saved_search_alert_state (
  search_id text primary key references public.saved_searches(id),
  state jsonb not null default '{}',
  next_due_at timestamptz not null default now(),
  lease_until timestamptz,
  lease_token text
);
alter table public.saved_search_alert_state enable row level security;
grant all on public.saved_search_alert_state to service_role;

create or replace function public.brrtz_due_alert_searches(p_limit integer default 25)
returns jsonb language sql security invoker set search_path = public as $$
  select coalesce(jsonb_agg(to_jsonb(d)), '[]') from (
    select to_jsonb(s) as profile, coalesce(a.state, '{}') as state
    from saved_searches s left join saved_search_alert_state a on a.search_id = s.id
    where s.alerts_enabled and s.deleted_at is null
      and coalesce(a.next_due_at, s.created_at) <= now()
      and (a.lease_until is null or a.lease_until <= now())
    order by coalesce(a.next_due_at, s.created_at), s.id
    limit greatest(0, least(p_limit, 100))
  ) d;
$$;

create or replace function public.brrtz_claim_alert_search(p_id text, p_token text)
returns jsonb language plpgsql security invoker set search_path = public as $$
declare result jsonb;
begin
  if not exists(select 1 from saved_searches where id = p_id and alerts_enabled and deleted_at is null) then return null; end if;
  insert into saved_search_alert_state(search_id) values(p_id) on conflict do nothing;
  update saved_search_alert_state set lease_token = p_token, lease_until = now() + interval '2 minutes'
    where search_id = p_id and next_due_at <= now() and (lease_until is null or lease_until <= now())
    returning state into result;
  return result;
end $$;

create or replace function public.brrtz_save_alert_state(p_id text, p_token text, p_state jsonb, p_release boolean default false)
returns boolean language plpgsql security invoker set search_path = public as $$
begin
  update saved_search_alert_state set state = p_state,
    next_due_at = coalesce((p_state->>'nextDueAt')::timestamptz, next_due_at),
    lease_until = case when p_release then null else now() + interval '2 minutes' end,
    lease_token = case when p_release then null else lease_token end
    where search_id = p_id and lease_token = p_token and lease_until > now()
      and exists(select 1 from saved_searches where id = p_id and alerts_enabled and deleted_at is null);
  if not found then raise exception 'alert_claim_lost'; end if;
  return true;
end $$;
revoke all on function public.brrtz_due_alert_searches(integer) from public, anon, authenticated;
revoke all on function public.brrtz_claim_alert_search(text, text) from public, anon, authenticated;
revoke all on function public.brrtz_save_alert_state(text, text, jsonb, boolean) from public, anon, authenticated;
grant execute on function public.brrtz_due_alert_searches(integer) to service_role;
grant execute on function public.brrtz_claim_alert_search(text, text) to service_role;
grant execute on function public.brrtz_save_alert_state(text, text, jsonb, boolean) to service_role;
commit;
