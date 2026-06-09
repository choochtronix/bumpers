# Railway Beta Deploy

Use this for the first friends-only Brrtz beta.

## Repo

```text
GitHub repo URL: https://github.com/choochtronix/bumpers
Branch: main
Service name: brrtz-beta
```

Railway should use the root `Dockerfile`.

## Environment Variables

Set these in Railway service variables. Do not commit real values to GitHub.

```text
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_REQUIRE_INVITE=true
BUMPERS_JOB_TOKEN=<long random secret>
SUPABASE_URL=<Supabase project URL>
SUPABASE_ANON_KEY=<Supabase anon/publishable key>
SUPABASE_SERVICE_ROLE_KEY=<Supabase service role key>
```

Railway provides `PORT`; do not set it manually unless Railway support tells you to.

## Deploy Steps

1. Push the latest repo to GitHub.
2. In Railway, create a project from the GitHub repo.
3. Choose the `main` branch.
4. Name the service `brrtz-beta`.
5. Add the environment variables above.
6. Deploy.
7. Open Railway's generated URL.
8. Check:

```text
https://<railway-url>/api/health
```

Expected response includes:

```json
{
  "ok": true,
  "app": "brrtz"
}
```

## Supabase Auth URLs

After the Railway URL is known, set Supabase Auth URL configuration:

```text
Site URL:
https://<railway-url>

Redirect URLs:
https://<railway-url>/*
http://127.0.0.1:5173/*
```

After `beta.brrtz.com` is connected, change Site URL to:

```text
https://beta.brrtz.com
```

And add:

```text
https://beta.brrtz.com/*
```

## Custom Domain

In Railway:

```text
Service -> Settings -> Domains -> Add custom domain
beta.brrtz.com
```

Railway will provide DNS instructions.

In Porkbun DNS, add the CNAME Railway gives you:

```text
Type: CNAME
Host: beta
Value: <Railway target>
```

## Beta Smoke Test

- Open `https://beta.brrtz.com`.
- Confirm `/api/health` returns `ok: true`.
- Sign in with an invited email.
- Settings -> Sync now.
- Search `Waldorf`, `Oberheim`, and `Juno 106`.
- Save a search.
- Pull from cloud in a second browser.

