# Brrtz Account And Services Register

Last updated: June 8, 2026

This document tracks the external accounts and services used by Brrtz. It is intentionally non-secret: do not add API keys, passwords, recovery codes, service role keys, or private tokens to this file.

Note: the product has been renamed from Bumpers to Brrtz. Some code, environment variable names, and docs may still use `Bumpers` / `BUMPERS_` until a formal rename pass is completed.

## Services At A Glance

| Service | Role In Brrtz | Current Status |
|---|---|---|
| Porkbun | Domain registrar and DNS host for `brrtz.com` | Active |
| Supabase | Auth, user profiles, invite gate, cloud saved-search/profile sync | Active alpha/beta backend |
| Resend | Transactional email sender for Supabase auth magic links | Active SMTP provider |

## Porkbun

### What It Is Used For

Porkbun is the registrar and DNS provider for the Brrtz domain.

Current known domain:

```text
brrtz.com
```

### Brrtz Responsibilities

- Own and manage the `brrtz.com` domain.
- Host DNS records required by Resend for domain verification and email deliverability.
- Later host DNS records for the public Brrtz website, such as `brrtz.com`, `www.brrtz.com`, or app-specific subdomains.

### Current DNS/Email Notes

- `brrtz.com` has been verified in Resend.
- Resend DNS records are managed through Porkbun.
- Email sending should use addresses at the verified domain, for example:

```text
login@brrtz.com
no-reply@brrtz.com
```

### Security Notes

- Porkbun account access controls the domain and DNS, so protect it with a strong password and 2FA.
- Do not put Porkbun login credentials in the repo.
- DNS changes can affect sign-in emails and future public website access.

## Supabase

### What It Is Used For

Supabase is the current Brrtz backend for account and cloud-sync features.

It is used for:

- Magic-link authentication.
- Invite-only beta access.
- User profile storage.
- Saved-search cloud sync.
- Watched listing sync.
- Gear/noise feedback sync.
- Future shared web/mobile/iOS account state.

### Current Brrtz Data Model

The current alpha/beta Supabase tables are:

```text
public.saved_searches
public.user_profiles
public.alpha_invites
```

Current behavior:

- Signed-in users sync by Supabase `user_id`.
- Saved searches are stored in `public.saved_searches`.
- Profile preferences are stored in `public.user_profiles`.
- Invite-only access checks `public.alpha_invites` when `BUMPERS_REQUIRE_INVITE=true`.
- The Node server uses the Supabase service role key server-side only.
- Browser sign-in uses the Supabase anon/publishable key.

### Environment Variables

Required for the beta backend:

```text
BUMPERS_CLOUD_PROVIDER=supabase
BUMPERS_REQUIRE_INVITE=true
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

Keep these rules:

- `SUPABASE_SERVICE_ROLE_KEY` is secret and server-only.
- `SUPABASE_ANON_KEY` is public-ish and used for browser auth.
- Real values belong in `.env.local` for local dev or host environment variables for production.
- Never commit real keys to GitHub.

### Security Notes

- Row Level Security has been added for future direct authenticated client access.
- The current Node server can still perform server-side operations because the service role key bypasses RLS.
- Invite-only beta should keep `BUMPERS_REQUIRE_INVITE=true`.
- Add invited tester emails through the Supabase invite table, not in source code.

### Useful Docs In This Repo

- `docs/supabase-alpha-cloud-sync.md`
- `docs/supabase-rls-policies.sql`
- `docs/production-env-checklist.md`
- `docs/saved-search-cloud-schema.md`

## Resend

### What It Is Used For

Resend is the transactional email provider for Brrtz auth emails.

It is currently used as Supabase's custom SMTP provider so Brrtz can send magic-link sign-in emails without hitting Supabase's default email rate limits during beta testing.

### Current Sender Setup

Domain:

```text
brrtz.com
```

Recommended sender:

```text
Brrtz <login@brrtz.com>
```

Supabase SMTP settings:

```text
Host: smtp.resend.com
Port: 465
Username: resend
Password: Resend API key
Sender email: login@brrtz.com
Sender name: Brrtz
```

### Operational Notes

- Resend domain verification is complete for `brrtz.com`.
- Resend DNS records are hosted through Porkbun.
- Resend logs are useful for confirming whether magic-link emails were sent.
- If a tester does not receive a sign-in email, check Resend logs before assuming Brrtz or Supabase failed.

### Security Notes

- The Resend API key is secret.
- Store the Resend API key in Supabase SMTP settings and a secure password manager.
- Do not commit the Resend API key to GitHub.
- Do not paste the Resend API key into ChatGPT/Codex.

## Current Beta Flow

1. User enters email in Brrtz Settings -> Account.
2. Brrtz browser client asks Supabase Auth to send a magic link.
3. Supabase sends the email through Resend SMTP.
4. Resend sends from `login@brrtz.com`.
5. User clicks the magic link and receives a Supabase session.
6. Brrtz server verifies that session with Supabase.
7. If invite mode is enabled, Brrtz checks the user's email against `alpha_invites`.
8. User can sync saved searches, watched listings, feedback, and preferences.

## Production / Beta Friend Launch Checklist

- [ ] Confirm `brrtz.com` remains verified in Resend.
- [ ] Confirm Supabase SMTP uses Resend, not Supabase's default sender.
- [ ] Confirm sender email is `login@brrtz.com` or another verified `@brrtz.com` address.
- [ ] Confirm invited tester emails exist in `public.alpha_invites`.
- [ ] Confirm `BUMPERS_REQUIRE_INVITE=true` in the beta environment.
- [ ] Confirm service role key exists only in server-side environment variables.
- [ ] Confirm no `.env.local`, API key, service role key, Resend key, or Porkbun credential is committed.

