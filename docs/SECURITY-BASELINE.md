# Brrtz Security Baseline

Last reviewed: 2026-07-26

This document is the non-secret security baseline for Brrtz. It records the
system's external dependencies, sensitive data, current protections, known
gaps, response procedures, and recurring security work.

Do not add passwords, API keys, access tokens, recovery codes, private user
data, complete environment files, or screenshots containing credentials.

This is a practical beta security baseline, not a formal penetration test or
compliance certification.

## Baseline Goals

1. Keep user accounts, saved searches, watched gear, and email addresses private.
2. Prevent credentials from reaching browsers, Git, logs, or support channels.
3. Limit abuse of public search, scraping, browser automation, and agent tools.
4. Make account compromise, data loss, and unexpected usage visible quickly.
5. Keep recovery steps documented so the service can survive personnel,
   computer, hosting, or account changes.

## Current Production Snapshot

The public health endpoint was checked on 2026-07-26 and reported:

```text
app=brrtz
cloudProvider=supabase
inviteRequired=true
supabaseConfigured=true
ebayConfigured=true
craigslistMode=parked
```

The health endpoint intentionally returns configuration booleans, not secret
values.

Primary production services:

| Service | Security role |
| --- | --- |
| Porkbun | Domain registration and DNS authority for `brrtz.com` |
| Railway | Production application runtime, environment secrets, logs, compute, and network |
| GitHub | Source repository and deployment source for Railway |
| Supabase | Authentication, authorization data, user profiles, saved searches, invite gate, and alert history |
| Resend | Authentication and saved-search email delivery |
| eBay | OAuth-protected US and UK Browse API source |
| Reverb | Japan, US, and UK public marketplace API source |
| ChatGPT | Optional MCP client that calls Brrtz; Brrtz does not call an OpenAI model API |

The fuller ownership register is in `docs/account-services-register.md`. Secret
names and deployment checks are in `docs/production-env-checklist.md`.

## Data Classification

### Restricted

Never expose these outside their intended server or service dashboard:

- Supabase service role key.
- eBay client secret and OAuth access tokens.
- Resend API key and SMTP credential.
- Brrtz operations/job token.
- GitHub, Railway, Supabase, Resend, and Porkbun recovery codes.
- Browser refresh tokens and access tokens.

### Private User Data

Access must be limited to the owning user and necessary server operations:

- Email address and Supabase user ID.
- Saved-search terms, exclusions, sources, regions, alert preferences, and scan history.
- Watched-listing IDs and watchlist state.
- Gear/noise feedback and curation context.
- User preferences and account metadata.
- Alert delivery and deduplication records.

### Operational

Useful for running the service but not intended as private user data:

- Source health status and parser errors.
- Search query terms in request URLs and logs.
- Rate-limit identifiers such as client IP addresses.
- Deployment revisions, timestamps, and connector status.

### Public

- Public listing summaries and original marketplace URLs.
- Region and source metadata.
- AEO pages, `robots.txt`, `llms.txt`, sitemap, and agent tool metadata.
- Public read-only MCP search results.

## Runtime Data Flows

### Search

```text
Browser or MCP client
  -> Railway / Brrtz API
  -> selected marketplace APIs, HTML pages, or Playwright connector
  -> normalized public listing results
  -> browser or MCP client
```

Search terms are shared with the selected listing sources. Railway and upstream
sources may receive request metadata such as IP address, timestamp, user agent,
and query terms. Brrtz should not send Supabase account tokens or private
account state to marketplace sources.

### Account And Cloud Sync

```text
Browser
  -> Supabase Auth using the public anon/publishable key
  -> Brrtz API using a Supabase user access token
  -> Supabase REST using the server-only service role key
```

The service role key must never enter `index.html`, `app.js`, browser storage,
client responses, screenshots, or logs.

### Email

```text
Supabase Auth -> Resend SMTP -> authentication email
Brrtz alert job -> Resend API -> saved-search alert email
```

Resend receives the recipient email address and message content. Saved-search
alerts can include the saved-search name, listing title, price, source, and
original listing URL.

### ChatGPT And Agents

```text
ChatGPT or another MCP client -> https://brrtz.com/mcp -> Brrtz search
```

Current MCP tools are public, read-only, schema-bounded, result-capped, and
rate-limited. They do not expose saved searches, profiles, watchlists, or
Supabase credentials. Brrtz currently has no `OPENAI_API_KEY`, OpenAI SDK, or
server-side model call, so there is no Brrtz-side OpenAI token billing path.

## Current Verified Controls

- Production is invite-gated.
- HTTPS is terminated by the production hosting platform.
- `.env` and `.env.local` are ignored by Git; only `.env.example` is tracked.
- Supabase service-role operations occur in `server.js`, not browser code.
- Browser authentication uses the Supabase anon/publishable key as intended.
- Saved-search and profile RLS policy SQL exists for user-owned rows.
- Operations and job routes require `BUMPERS_JOB_TOKEN` when configured.
- Operations routes fall back to loopback-only access when no job token exists.
- MCP inputs are schema validated, bounded, result capped, and rate limited.
- JSON request bodies have size limits.
- Rakuma proxy endpoints allowlist exact HTTPS hostnames, reducing SSRF risk.
- Static file serving normalizes paths and checks that files remain under the repository root.
- Craigslist automated access is parked by default.
- No Stripe, advertising, analytics, or third-party behavior-tracking SDK was found.
- `npm audit --omit=dev` reported zero known production dependency vulnerabilities on 2026-07-26.

## Security Risk Register

| ID | Priority | Status | Finding | Recommended treatment |
| --- | --- | --- | --- | --- |
| SEC-001 | High | Open | Public `/api/search` and `/api/browse` can trigger expensive network and Playwright work without a general rate limit. | Add per-client rate limits, concurrency caps, request timeouts, and source budgets. Return `429` with `Retry-After`. |
| SEC-002 | High | Open | `POST /api/curation/noise` writes to the curation inbox without account authorization or a route-specific rate limit. | Require a valid signed-in user or a scoped feedback token, add rate limiting, and retain the current body-size limit. |
| SEC-003 | High | Verify in Supabase | RLS policy docs cover `saved_searches` and `user_profiles`; `alpha_invites` and `saved_search_alert_events` need explicit privilege/RLS verification. | Revoke `anon` and `authenticated` access where direct client access is unnecessary. Enable RLS or otherwise prove service-role-only access. |
| SEC-004 | Medium | Open | The Node application does not set a complete security-header policy. | Add CSP, `X-Content-Type-Options`, frame protection, `Referrer-Policy`, and `Permissions-Policy`. Confirm HSTS at Railway before duplicating it. |
| SEC-005 | Medium | Open | Supabase access and refresh tokens are stored in browser `localStorage`. Any future XSS would be able to read them. | Make CSP and output encoding immediate priorities. Evaluate server-managed `HttpOnly`, `Secure`, `SameSite` sessions before a wider public launch. |
| SEC-006 | Medium | Open | The top-level error handler returns raw internal error messages to clients. | Return stable public error codes and log sanitized diagnostic detail server-side. Never include upstream response bodies or secrets in public errors. |
| SEC-007 | Medium | Open | Search terms travel in URL query strings and may appear in browser history, proxy logs, and Railway request logs. | Avoid sensitive search content, document this behavior, set log-retention limits, and use request bodies for future private operations. |
| SEC-008 | Medium | Verify | Administrator MFA, recovery-code storage, and least-privilege membership are documented as recommendations but not centrally attested. | Require MFA on GitHub, Railway, Supabase, Resend, Porkbun, and the domain-owner email. Store recovery codes offline in a password manager. |
| SEC-009 | Medium | Verify | Database backup, point-in-time recovery, and restore testing are not documented as completed controls. | Confirm Supabase backup capabilities, schedule exports where appropriate, and perform a test restore using non-production data. |
| SEC-010 | Medium | Open | Monitoring and cost alerts are not captured in one operational policy. | Configure Railway resource alerts, Supabase usage alerts, Resend delivery monitoring, eBay quota monitoring, and job/source failure notifications. |
| SEC-011 | Low | Open | The operations bearer token uses ordinary string comparison. | Use a constant-time comparison after validating equal byte lengths when the authorization helper is hardened. |
| SEC-012 | Medium | Open | Privacy retention and deletion periods for user profiles, alerts, feedback, and logs are not yet fixed. | Define retention, account deletion, export, and incident-notification policies before opening the beta broadly. |

## Prioritized Hardening Plan

### Phase 0: Account Lockdown

Complete before inviting substantially more users:

- Require MFA on GitHub, Railway, Supabase, Resend, Porkbun, and the owner email account.
- Remove unused team members, OAuth apps, deploy keys, and personal access tokens.
- Store recovery codes in a password manager and one offline recovery location.
- Confirm GitHub secret scanning and push protection are enabled.
- Confirm Railway production secrets are available only to the production service.
- Rotate a credential immediately if it appears in Git, a public screenshot, a support message, or a third-party log.

Do not rotate healthy credentials only for appearance. Rotation should be
planned so Supabase auth, Railway deployment, eBay search, and Resend email are
tested immediately afterward.

### Phase 1: Public Route Protection

Implement next:

1. Add shared rate limiting to `/api/search` and `/api/browse`.
2. Add global and per-source concurrency ceilings.
3. Add upstream timeouts and cancellation.
4. Protect `/api/curation/noise` with authenticated identity and rate limiting.
5. Keep MCP's existing limits and add deployment-level limits if traffic grows.
6. Record counters without logging bearer tokens or complete private payloads.

### Phase 2: Browser And HTTP Hardening

- Add a tested Content Security Policy compatible with Supabase, Google Fonts,
  listing images, and required marketplace assets.
- Add MIME-sniffing, frame, referrer, and browser-permission headers.
- Validate `Host` and forwarded host values against known production and local hosts.
- Replace raw client-facing exception messages with public-safe errors.
- Audit every dynamic HTML insertion for escaping or safe DOM construction.
- Reassess `localStorage` sessions after the CSP pass.

### Phase 3: Supabase Authorization Audit

- Confirm RLS is enabled and forced where appropriate.
- Confirm `anon` cannot read or write user-owned tables.
- Confirm `authenticated` users can access only rows where `user_id = auth.uid()`.
- Confirm `alpha_invites` and alert-event tables are service-role-only unless a
  narrower user policy is explicitly required.
- Test with two real test users and verify that neither can access the other's rows.
- Confirm deleted accounts and saved searches are handled consistently.

### Phase 4: Recovery, Monitoring, And Privacy

- Document Supabase backup frequency and retention.
- Perform and record a non-production restore drill.
- Enable service usage, failure, and billing alerts.
- Set log retention and redact tokens, email-link fragments, credentials, and private payloads.
- Publish Privacy Policy and Terms before a broad public launch.
- Add account data export and deletion procedures.
- Create a concise user-facing security contact path.

## Credential Handling Rules

- Use separate local and production credentials whenever a provider supports it.
- Keep production secrets in Railway or the responsible provider, never in Git.
- Keep `.env.local` only on trusted development machines.
- Do not pass secrets in URLs, query strings, screenshots, issue descriptions, or chat.
- Do not expose secrets through `/api/health`, debug endpoints, client bundles, or source maps.
- Give each secret one purpose. Do not reuse the job token as an API key elsewhere.
- Record the owner, purpose, creation date, and last rotation date in a password
  manager or private operations register, not this repository.

Suggested rotation triggers:

| Credential | Rotate when |
| --- | --- |
| Supabase service role | Exposure is suspected, an administrator leaves, or project policy requires it |
| Supabase anon key | Project key rotation or abuse response; remember it is browser-visible |
| Resend API key | Exposure, sender abuse, or administrator change |
| eBay client secret | Exposure, app-owner change, or eBay security event |
| Brrtz job token | Exposure, unauthorized job activity, or operator change |
| GitHub/Railway deploy credentials | Exposure, repository transfer, or administrator change |

## Incident Response

When suspicious usage, a leaked secret, or unauthorized access is reported:

1. Preserve evidence. Record the time, affected service, symptoms, and relevant
   sanitized request or deployment identifiers.
2. Contain. Disable the affected key, route, account, source, or deployment.
3. Rotate the exposed credential and update only the required trusted services.
4. Review Railway, Supabase, Resend, GitHub, DNS, and source-provider logs for
   the exposure window.
5. Check for unexpected database changes, invite additions, email sends,
   deployments, source usage, and job executions.
6. Restore clean data or code if necessary.
7. Test authentication, search, saved searches, email, and deployment health.
8. Notify affected users when private data may have been accessed.
9. Record the root cause and add a preventive control to this baseline.

Never paste complete logs into public issues before checking them for tokens,
email addresses, query strings, and private account data.

## Recurring Security Checklist

### Monthly

- Review GitHub, Railway, Supabase, Resend, and Porkbun administrators.
- Review production environment variable names and remove unused credentials.
- Check Railway resource usage and unexpected traffic changes.
- Check Supabase auth, database usage, and failed authorization patterns.
- Check Resend delivery volume and unusual recipients.
- Check eBay/Reverb quota or error changes.
- Run `npm audit --omit=dev`.
- Run Brrtz tests and source-health checks.
- Review open items in the risk register.

### Quarterly

- Test a non-production backup restore.
- Review Supabase RLS and grants with two-user isolation tests.
- Review dependency versions and Docker base image updates.
- Review public routes, rate limits, body limits, and timeouts.
- Review privacy retention and account deletion behavior.
- Review OAuth apps, deploy keys, API keys, and recovery access.
- Re-check this document against the current architecture.

### Before Every Production Push

- Review `git diff` and `git status`.
- Confirm no `.env`, token, private export, database dump, or screenshot is staged.
- Run the relevant tests and `npm audit --omit=dev` after dependency changes.
- Confirm new routes have authentication, authorization, body limits, and rate limits.
- Confirm new external services are added to the service register and this baseline.
- Verify `https://brrtz.com/api/health` after Railway deploys.

## Security Verification Commands

These commands are designed to report status without printing secret values:

```sh
git status --short
git ls-files '.env*'
git check-ignore -v .env .env.local
npm audit --omit=dev
curl -sS https://brrtz.com/api/health
```

Do not run broad environment-printing commands in shared terminals or support
messages. Prefer tests that report only whether a required variable is present.

## Document Maintenance

Update this baseline when any of the following changes:

- A new account, API, marketplace connector, analytics tool, or email provider is added.
- Authentication, session storage, account recovery, or invite behavior changes.
- A new public write route or agent tool is introduced.
- User data fields, retention, deletion, or sharing behavior changes.
- Hosting, DNS, deployment, database, or backup providers change.
- A security incident or meaningful near miss occurs.

Related documents:

- `docs/BRRTZ-HANDOFF.md`
- `docs/account-services-register.md`
- `docs/production-env-checklist.md`
- `docs/supabase-alpha-cloud-sync.md`
- `docs/supabase-rls-policies.sql`
- `docs/BRRTZ-MCP.md`
- `docs/railway-beta-deploy.md`
