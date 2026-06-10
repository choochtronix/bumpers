# Brrtz Production Environment Checklist

Use this checklist when deploying the friends-only beta. It names the required environment variables without storing real secret values.

For the external account/service inventory, see `docs/account-services-register.md`.

## Rule Zero

Do not commit real `.env`, `.env.local`, Supabase service role keys, tokens, or invite-only secrets to GitHub.

Production values should live in the hosting provider's environment/secrets panel.

## Required For Beta

| Variable | Required | Secret? | Example | Notes |
|---|---:|---:|---|---|
| `BUMPERS_CLOUD_PROVIDER` | Yes | No | `supabase` | Enables Supabase-backed cloud sync. |
| `BUMPERS_REQUIRE_INVITE` | Yes | No | `true` | Must be `true` for beta friends launch. |
| `BUMPERS_JOB_TOKEN` | Yes | Yes | `make-a-long-random-secret` | Protects beta ops/job routes such as source health checks. |
| `BRRTZ_CRAIGSLIST_MODE` | No | No | `parked` | Defaults to `parked`. Set to `live` only for short, controlled Craigslist test windows. |
| `SUPABASE_URL` | Yes | No | `https://your-project-ref.supabase.co` | Project URL from Supabase Project Settings. |
| `SUPABASE_ANON_KEY` | Yes | Public-ish | `sb_publishable_...` | Used for browser auth. Safe to expose only with RLS configured. |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Yes | `sb_secret_...` | Server-only. Never expose in browser or commit. |

## Hosting Runtime

| Variable | Required | Secret? | Example | Notes |
|---|---:|---:|---|---|
| `PORT` | Host-dependent | No | `5173` | Many hosts inject this automatically. Do not hardcode if host provides it. |
| `HOST` | Usually no | No | `0.0.0.0` | Brrtz defaults to `0.0.0.0`, which is correct for most hosted Node apps. |

## Local / Fallback Only

These are useful for local development but should not be relied on for the public beta account model.

| Variable | Required For Beta | Secret? | Example | Notes |
|---|---:|---:|---|---|
| `BUMPERS_CLOUD_USER_ID` | No | No | `alpha` | Local fallback user id when not using authenticated Supabase sessions. |
| `BUMPERS_CLOUD_USER_EMAIL` | No | No | `alpha@bumpers.local` | Local fallback email. |
| `BUMPERS_CLOUD_USER_NAME` | No | No | `Brrtz Alpha User` | Local fallback display name. |

## Supabase Tables Needed

The beta environment expects these tables and policies to exist:

- `public.user_profiles`
- `public.saved_searches`
- `public.alpha_invites`
- Row Level Security policies from `docs/supabase-rls-policies.sql`

## Invite Setup

For each beta friend:

```sql
insert into public.alpha_invites (email, status, invited_by)
values ('friend@example.com', 'active', 'craig')
on conflict (email) do update
set status = 'active',
    invited_by = 'craig';
```

To pause access:

```sql
update public.alpha_invites
set status = 'paused'
where email = 'friend@example.com';
```

## Pre-Launch Checks

- [ ] `BUMPERS_REQUIRE_INVITE=true` in production.
- [ ] `BUMPERS_JOB_TOKEN` is set to a long random value in production.
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is set only in server/host secrets.
- [ ] `SUPABASE_ANON_KEY` is set for browser sign-in.
- [ ] Supabase RLS policies have been applied.
- [ ] At least one real tester email is active in `alpha_invites`.
- [ ] Unauthenticated `/api/cloud/profile` returns `401` when invite mode is enabled.
- [ ] Signed-in invited user can use Settings -> Sync now.
- [ ] Signed-in invited user can use Settings -> Pull from cloud.
- [ ] No real `.env` files are tracked by Git.

## Current Beta Recommendation

Use Railway with Docker for the first friends beta because Brrtz currently includes server-side search connectors, Supabase service-role operations, and Playwright/browser automation.

Selected beta path:

- Railway project from GitHub repo.
- Dockerfile in repo root.
- Custom domain: `brrtz.com`.
- Health check: `/api/health`.

Use Codex Sites later if/when the frontend and backend are separated or the build shape is confirmed compatible.

## Current Production URLs

Primary public beta:

```text
https://brrtz.com
```

Railway fallback:

```text
https://brrtz-beta-production.up.railway.app
```

Supabase Auth should use:

```text
Site URL:
https://brrtz.com

Redirect URLs:
https://brrtz.com/*
https://brrtz-beta-production.up.railway.app/*
http://127.0.0.1:5173/*
```
