# Brrtz Beta Launch Milestone

Date: June 9, 2026

Status: public invite-only beta is live.

## Live URLs

Primary public URL:

```text
https://brrtz.com
```

Railway fallback URL:

```text
https://brrtz-beta-production.up.railway.app
```

Health check:

```text
https://brrtz.com/api/health
```

Expected response:

```json
{
  "ok": true,
  "app": "brrtz",
  "cloudProvider": "supabase",
  "inviteRequired": true,
  "supabaseConfigured": true
}
```

## What Was Confirmed

- Railway production deployment is live.
- `brrtz.com` points to the Railway service.
- Railway TLS certificate for `brrtz.com` is active.
- Supabase Auth redirects work from the production domain.
- Invite-only sign-in works with the configured Supabase/Resend magic-link flow.
- Pull from cloud works after sign-in on the production domain.

## Hosting

Hosting provider:

```text
Railway
```

Railway project/service:

```text
Project: supportive-light
Environment: production
Service: brrtz-beta
```

GitHub source:

```text
Repo: https://github.com/choochtronix/bumpers
Branch: main
Root directory: /
```

Runtime:

```text
Dockerfile in repo root
Node server
Railway-detected port: 8080
```

Important production variables are stored in Railway service variables, not in Git.

## Domain And DNS

Registrar and DNS:

```text
Porkbun
DNS powered by Cloudflare through Porkbun
```

Domain:

```text
brrtz.com
```

Railway custom domain target:

```text
1bhfx7oc.up.railway.app
```

Required Porkbun DNS records for Railway:

```text
Type: ALIAS
Host: blank/root
Value: 1bhfx7oc.up.railway.app
TTL: 600
```

```text
Type: TXT
Host: _railway-verify
Value: railway-verify=53ccf8afdd66b56df2dd9ebd35744a9ad022ca36f0838e84bfb09164e21ab051
TTL: 600
```

Notes:

- Porkbun does not allow a root-domain CNAME, so `ALIAS` is required for `brrtz.com`.
- Old Porkbun parking/hosting `A` records for root and wildcard had to be removed.
- The ALIAS direction matters: root `brrtz.com` points to Railway, not the other way around.

Old records removed during launch:

```text
Type: A
Host: blank/root
Value: 192.0.79.188
```

```text
Type: A
Host: *
Value: 192.0.79.130
```

## Supabase Auth URL Configuration

Supabase Site URL:

```text
https://brrtz.com
```

Allowed redirect URLs:

```text
https://brrtz.com/*
https://brrtz-beta-production.up.railway.app/*
http://127.0.0.1:5173/*
```

Do not keep malformed combined redirect strings such as:

```text
https://brrtz-beta-production.up.railway.app/*http://127.0.0.1:5173/*
```

## Beta Access Model

Brrtz beta remains invite-only.

Relevant production settings:

```text
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_REQUIRE_INVITE=true
BUMPERS_JOB_TOKEN=<stored in Railway>
SUPABASE_URL=<stored in Railway>
SUPABASE_ANON_KEY=<stored in Railway>
SUPABASE_SERVICE_ROLE_KEY=<stored in Railway>
```

The `BUMPERS_` environment variable prefix is still intentionally used internally until a separate safe rename pass.

## Operational Notes

- Keep the Railway fallback URL allowed in Supabase during beta.
- Keep real secrets out of GitHub and out of documentation.
- If a future Railway deploy does not trigger from GitHub, re-check Railway's GitHub App access to `choochtronix/bumpers`.
- If `brrtz.com` fails but the Railway URL works, check DNS and TLS status first.
- If magic links redirect incorrectly, check Supabase Auth URL Configuration before changing app code.
