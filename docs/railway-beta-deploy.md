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

After `brrtz.com` is connected, change Site URL to:

```text
https://brrtz.com
```

And add:

```text
https://brrtz.com/*
```

## Custom Domain

In Railway:

```text
Service -> Settings -> Networking -> Add custom domain
brrtz.com
```

Railway will provide DNS instructions.

For the root domain, Porkbun does not allow a CNAME. Use ALIAS:

```text
Type: ALIAS
Host: blank/root
Value: 1bhfx7oc.up.railway.app
TTL: 600
```

Add Railway's TXT verification record:

```text
Type: TXT
Host: _railway-verify
Value: railway-verify=53ccf8afdd66b56df2dd9ebd35744a9ad022ca36f0838e84bfb09164e21ab051
TTL: 600
```

Remove conflicting root or wildcard `A` records before waiting for TLS validation.

## Beta Smoke Test

- Open `https://brrtz.com`.
- Confirm `/api/health` returns `ok: true`.
- Sign in with an invited email.
- Settings -> Sync now.
- Search `Waldorf`, `Oberheim`, and `Juno 106`.
- Save a search.
- Pull from cloud in a second browser.

## June 9, 2026 Launch Result

Production beta URL:

```text
https://brrtz.com
```

Fallback URL:

```text
https://brrtz-beta-production.up.railway.app
```

Confirmed:

- Railway deploy succeeded.
- `brrtz.com` TLS became active.
- Supabase Auth returned sign-in users to `https://brrtz.com`.
- Pull from cloud worked on the public domain.
