# UK Sponsor Tracker — Build Prompt

## Overview

Build a SaaS that monitors the UK Home Office Register of Licensed Sponsors, computes diffs on every update, and notifies users when companies they care about are added, removed, or updated. The register is a CSV published at GOV.UK and updated nearly every business day.

**The pitch:** "Stop refreshing the Home Office spreadsheet. Get notified the moment a company becomes a licensed sponsor."

**Product promise:** Track UK sponsor register changes and get notified instantly when a company you care about is added, removed, or updated.

Search is the free landing page feature. The **product** is: diff engine + watchlists + alerts + API + history.

**Domain:** `sponsortracker.uk` or `sponsorwatch.co.uk` (check availability — deploy on Vercel with `.vercel.app` for MVP)

---

## Why This Exists

The UK Home Office maintains a register of ~90,000+ licensed sponsors (employers approved to sponsor Skilled Worker visas). It's published as a downloadable CSV and updated nearly every business day. People who need this data include:

- **Job seekers** needing visa sponsorship — checking if a company can sponsor before applying
- **Recruiters/HR** — verifying sponsor status for candidates, bulk-checking employer lists
- **Immigration lawyers** — monitoring client sponsor status, audit trails for compliance
- **Companies** — tracking competitors' sponsor status, monitoring their own listing

**What exists today:** A few Chrome extensions that do static lookups, and some mirror sites with basic search. None offer diffs, alerts, watchlists, or an API. That's the gap.

---

## Data Source

**URL:** `https://www.gov.uk/government/publications/register-of-licensed-sponsors-workers`

The page links to a downloadable CSV (~11MB) with these columns:

| Column | Description |
|--------|-------------|
| Organisation Name | Company legal name |
| Town/City | Location |
| County | County/region |
| Type & Rating | e.g. "Worker (A rating)" — A is good, B means action plan |
| Route | e.g. "Skilled Worker", "Global Business Mobility", "Temporary Worker" etc. |

**Update frequency:** Nearly every business day (confirmed — 23 updates in Feb 2026 alone).

**Polling strategy:**
- Check every 6 hours on weekdays, every 12 hours on weekends
- Use `If-None-Match` (ETag) / `If-Modified-Since` headers
- Only download CSV when it has actually changed
- Store headers in `source_fetches` for audit trail

---

## Core Features

### 1. Diff Engine (The Moat)

Every time the CSV updates, compute a **ChangeSet**:

- **Added sponsors** — new rows not in previous snapshot
- **Removed sponsors** — rows that disappeared
- **Updated sponsors** — same entity, changed fields (field-level diffs)

Each change records:
```
{
  sponsor_id, change_type: "added" | "removed" | "updated",
  field?: string, old_value?: string, new_value?: string
}
```

Match sponsors across snapshots by normalized name + town (the CSV has no stable ID).

### 2. Search (Free Tier)

- Full-text search across sponsor names
- Fuzzy matching using PostgreSQL `pg_trgm`
- Filter by town/city, county, route, rating
- Company detail page showing: current status, rating, routes, location, **change timeline**
- "Last seen" date (which snapshot they appeared in)

### 3. Watchlists & Alerts (Paid Tier)

Users create watchlists with rules:
- **Exact company watch** — "Notify me about Harvey"
- **Keyword watch** — "Notify me about any sponsor containing 'Capital'"
- **Location watch** — "Notify me about new sponsors in London"
- **Route watch** — "Notify me about new Skilled Worker sponsors"

Alert delivery channels:
- **Email** (MVP) — instant + daily digest options
- **Slack webhook** (V1)
- **Custom webhook** with HMAC signing (V1)
- **RSS/Atom feed** per watchlist (V1)

### 4. API (Paid Tier)

RESTful JSON API with API key auth:

```
GET  /v1/sponsors/search?q=harvey&town=london
GET  /v1/sponsors/:id
GET  /v1/sponsors/:id/history
POST /v1/sponsors/resolve          # Bulk fuzzy match: names → sponsor records
GET  /v1/changes?since=2026-02-20  # Stream of diffs
GET  /v1/changes/latest            # Today's changes
POST /v1/bulk/check                # CSV-like: list of names → status
POST /v1/webhooks                  # Register webhook target
```

Rate limits by tier:
- Free: 100 req/day
- £6/mo: 1,000 req/day
- £49/mo: 10,000 req/day + bulk endpoints

### 5. "What Changed Today?" Dashboard

Public page showing today's register changes:
- New sponsors added
- Sponsors removed
- Rating changes (A→B is significant — means the company is under scrutiny)
- Clean diff view, filterable

This is the SEO + social sharing engine. Auto-generate a weekly "biggest changes" summary.

---

## Tech Stack

### Frontend
- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **shadcn/ui** — all UI components
- **Lucide React** — icons
- **next-themes** — light/dark mode

### Backend
- **Next.js API Routes** (App Router route handlers)
- **PostgreSQL** (Neon serverless Postgres — free tier available)
- **Drizzle ORM** — type-safe SQL, migrations, schema
- **pg_trgm extension** — fuzzy text matching (critical for sponsor name resolution)
- **node-cron** or **Vercel Cron** — scheduled CSV polling

### Auth
- **Better Auth** — email/password + magic link (same as the reference project sports-db)
- Follow the sports-db pattern: Drizzle adapter, session via `auth.api.getSession(headers())`, middleware gate for protected routes
- Keep it simple — email is primary (non-dev users won't have GitHub)

### Email
- **Resend** — transactional email for alerts + digests (free tier: 100 emails/day)

### Payments
- **Stripe** — subscriptions for paid tiers

### Deployment
- **Vercel** — hosting + cron jobs
- **Neon** — serverless Postgres (free tier: 0.5GB, plenty for MVP)

### Tooling
- **Bun** — package manager and script runner
- **Biome** — linting and formatting (NOT eslint/prettier)

### Testing
- **Vitest** — test runner
- **MSW (Mock Service Worker)** — API mocking
- **Testing Library** — `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- **Red-Green TDD approach:** Write failing test first, then implementation, then refactor

### Quality Verification
- **react-doctor** (https://github.com/millionco/react-doctor) — Run after building components
- All React/Next.js best practices: Server Components, proper data fetching, accessible markup

---

## Data Model (Drizzle + PostgreSQL)

```typescript
// db/schema.ts
import { pgTable, text, timestamp, integer, boolean, uuid, jsonb, real, index, uniqueIndex } from "drizzle-orm/pg-core";

// Track each time we fetch the CSV
export const sourceFetches = pgTable("source_fetches", {
  id: uuid("id").primaryKey().defaultRandom(),
  fetchedAt: timestamp("fetched_at").notNull().defaultNow(),
  etag: text("etag"),
  lastModified: text("last_modified"),
  contentHash: text("content_hash").notNull(), // SHA-256 of CSV
  rowCount: integer("row_count").notNull(),
  fileSize: integer("file_size"),
  csvUrl: text("csv_url"),
});

// Canonical sponsor records (deduplicated)
export const sponsors = pgTable("sponsors", {
  id: uuid("id").primaryKey().defaultRandom(),
  canonicalName: text("canonical_name").notNull(),
  town: text("town"),
  county: text("county"),
  sponsorType: text("sponsor_type"), // "Worker"
  rating: text("rating"), // "A rating", "B rating"
  routes: text("routes").array(), // ["Skilled Worker", "Global Business Mobility"]
  status: text("status").notNull().default("active"), // active, removed
  firstSeenFetchId: uuid("first_seen_fetch_id").references(() => sourceFetches.id),
  lastSeenFetchId: uuid("last_seen_fetch_id").references(() => sourceFetches.id),
  firstSeenAt: timestamp("first_seen_at"),
  lastSeenAt: timestamp("last_seen_at"),
  removedAt: timestamp("removed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => ({
  nameIdx: index("sponsors_name_idx").on(table.canonicalName),
  townIdx: index("sponsors_town_idx").on(table.town),
  statusIdx: index("sponsors_status_idx").on(table.status),
  nameTrigramIdx: index("sponsors_name_trgm_idx").using("gin", table.canonicalName), // pg_trgm
}));

// Aliases for fuzzy matching
export const sponsorAliases = pgTable("sponsor_aliases", {
  id: uuid("id").primaryKey().defaultRandom(),
  sponsorId: uuid("sponsor_id").notNull().references(() => sponsors.id),
  alias: text("alias").notNull(),
  source: text("source").notNull().default("auto"), // auto, user
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Raw snapshot of each CSV row per fetch (for audit)
export const sponsorSnapshots = pgTable("sponsor_snapshots", {
  id: uuid("id").primaryKey().defaultRandom(),
  fetchId: uuid("fetch_id").notNull().references(() => sourceFetches.id),
  sponsorId: uuid("sponsor_id").notNull().references(() => sponsors.id),
  rawRow: jsonb("raw_row").notNull(), // original CSV row as JSON
  normalizedName: text("normalized_name").notNull(),
}, (table) => ({
  fetchSponsorIdx: uniqueIndex("snapshots_fetch_sponsor_idx").on(table.fetchId, table.sponsorId),
}));

// Changesets (one per CSV update that has differences)
export const changesets = pgTable("changesets", {
  id: uuid("id").primaryKey().defaultRandom(),
  fetchId: uuid("fetch_id").notNull().references(() => sourceFetches.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  addedCount: integer("added_count").notNull().default(0),
  removedCount: integer("removed_count").notNull().default(0),
  updatedCount: integer("updated_count").notNull().default(0),
  summary: text("summary"), // auto-generated human-readable summary
});

// Individual changes within a changeset
export const changes = pgTable("changes", {
  id: uuid("id").primaryKey().defaultRandom(),
  changesetId: uuid("changeset_id").notNull().references(() => changesets.id),
  sponsorId: uuid("sponsor_id").notNull().references(() => sponsors.id),
  changeType: text("change_type").notNull(), // "added", "removed", "updated"
  field: text("field"), // null for added/removed, field name for updated
  oldValue: text("old_value"),
  newValue: text("new_value"),
}, (table) => ({
  changesetIdx: index("changes_changeset_idx").on(table.changesetId),
  sponsorIdx: index("changes_sponsor_idx").on(table.sponsorId),
}));

// Users
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  hashedPassword: text("hashed_password"),
  plan: text("plan").notNull().default("free"), // free, pro, business
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  apiKey: text("api_key").unique(),
  apiRequestsToday: integer("api_requests_today").notNull().default(0),
  apiRequestsResetAt: timestamp("api_requests_reset_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Watchlists
export const watchlists = pgTable("watchlists", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Watchlist rules
export const watchlistRules = pgTable("watchlist_rules", {
  id: uuid("id").primaryKey().defaultRandom(),
  watchlistId: uuid("watchlist_id").notNull().references(() => watchlists.id),
  ruleType: text("rule_type").notNull(), // "company", "keyword", "location", "route"
  value: text("value").notNull(), // the search term
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Notification preferences
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id),
  watchlistId: uuid("watchlist_id").references(() => watchlists.id), // null = all watchlists
  channel: text("channel").notNull(), // "email", "slack", "webhook"
  destination: text("destination").notNull(), // email address, webhook URL, slack webhook URL
  frequency: text("frequency").notNull().default("instant"), // "instant", "daily", "weekly"
  enabled: boolean("enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Delivery log
export const deliveries = pgTable("deliveries", {
  id: uuid("id").primaryKey().defaultRandom(),
  notificationId: uuid("notification_id").notNull().references(() => notifications.id),
  changesetId: uuid("changeset_id").notNull().references(() => changesets.id),
  sentAt: timestamp("sent_at").notNull().defaultNow(),
  status: text("status").notNull(), // "sent", "failed", "pending"
  error: text("error"),
});
```

**Important:** Enable `pg_trgm` extension in Neon:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

---

## Sponsor Name Resolution (The Part People Pay For)

People won't type exact legal entity names. Implement resolution in layers:

1. **Exact match** on normalized name (lowercase, trimmed)
2. **Alias match** (stored aliases from previous resolutions)
3. **Trigram similarity** (`pg_trgm` — `similarity()` function, threshold 0.3)
4. **Contains heuristics** with stopword removal (Ltd, Limited, LLP, PLC, UK, Services, Group, Holdings, International)

Return:
```json
{
  "matches": [
    { "sponsor": {...}, "match_type": "exact", "confidence": 1.0 },
    { "sponsor": {...}, "match_type": "trigram", "confidence": 0.78 }
  ]
}
```

The bulk resolve endpoint (`POST /v1/sponsors/resolve`) accepts up to 500 names and returns matches for each — this is what recruiters pay for.

---

## Page Structure

### Pages

1. **`/`** — Landing page with search bar, "what changed today" preview, pricing CTA
2. **`/search`** — Full search results with filters
3. **`/sponsor/[id]`** — Sponsor detail: status, rating, routes, location, change timeline
4. **`/changes`** — Public changes feed ("What changed today?")
5. **`/changes/[changesetId]`** — Individual changeset detail
6. **`/dashboard`** — User dashboard (auth required): watchlists, alerts, API usage
7. **`/dashboard/watchlists`** — Manage watchlists + rules
8. **`/dashboard/alerts`** — Notification preferences
9. **`/dashboard/api`** — API key management + usage stats
10. **`/pricing`** — Pricing page with Stripe checkout
11. **`/auth/login`** — Login (email + magic link)
12. **`/auth/register`** — Register
13. **`/docs/api`** — API documentation
14. **`/about`** — What this is, data source, FAQ

### Layout

- **Header:** Logo + tagline ("Track UK visa sponsor changes"), nav (Search, Changes, Pricing, Dashboard), auth button
- **Footer:** Data source attribution ("Data from GOV.UK Register of Licensed Sponsors"), disclaimer, links
- **Theme:** Light mode default (professional audience — lawyers, HR, recruiters). Dark mode available.
- **Design:** Clean, professional, trustworthy. Think gov.uk meets Linear. Blue/indigo accent. No flashy gradients.

---

## CSV Ingestion Pipeline

```
1. Cron triggers (every 6h weekdays, 12h weekends)
2. HEAD request to CSV URL → check ETag/Last-Modified
3. If unchanged → skip, log to source_fetches
4. If changed → download CSV
5. Parse CSV rows → normalize names (lowercase, trim, standardize)
6. Hash content (SHA-256) → store in source_fetches
7. Match rows to existing sponsors (by normalized name + town)
8. Compute diff:
   - New rows not matching any existing sponsor → "added"
   - Existing sponsors not in new CSV → "removed"
   - Existing sponsors with changed fields → "updated" (per-field)
9. Create changeset + individual change records
10. Update sponsor records (status, lastSeenFetchId, etc.)
11. Store snapshots for audit trail
12. Trigger notification pipeline:
    - Match changes against all watchlist rules
    - Queue notifications (instant → send now, daily → batch for digest)
13. Send notifications via appropriate channel
```

---

## Pricing

| Tier | Price | Includes |
|------|-------|----------|
| **Free** | £0 | Search, company pages, "last seen" date, last 1 change, changes feed |
| **Pro** | £6/mo | 10 watchlists, 50 rules, instant + daily alerts, full history, CSV export, 1,000 API req/day |
| **Business** | £49/mo | Unlimited watchlists, bulk check (5,000 names/mo), Slack/webhooks, API (10,000 req/day), delivery logs |
| **Enterprise** | Custom | SSO, audit logs, custom matching rules, higher limits, SLA |

Stripe integration with monthly billing. Free tier requires registration (email only).

---

## Project Location

**Working directory:** `~/code/bhekanik/sponsor-tracker`

## Local Development Setup

**Local dev uses Docker for Postgres.** The agent MUST create:

### `docker-compose.yml`
```yaml
services:
  postgres:
    image: postgres:16-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: sponsor_tracker
      POSTGRES_PASSWORD: sponsor_tracker
      POSTGRES_DB: sponsor_tracker
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U sponsor_tracker"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

### `.env.example`
```env
DATABASE_URL=postgresql://sponsor_tracker:sponsor_tracker@localhost:5432/sponsor_tracker
AUTH_SECRET=generate-with-openssl-rand-base64-32
RESEND_API_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### `scripts/dev.sh` — Single command to start everything

This script must:
1. Check & install Bun if missing
2. Check & install Docker if missing, wait for daemon
3. Create `.env` from `.env.example` if missing (auto-generate AUTH_SECRET)
4. Install dependencies if `node_modules` missing
5. Start Postgres via docker compose if not running, wait for health
6. Run `bun run db:push` if schema not applied (probe a known table)
7. Start Next.js dev server

**Reference implementation:** See `/Users/bhekanik/code/bhekanik/sports-db/scripts/dev.sh` — follow the same pattern exactly. It handles macOS/Linux/Windows, Docker daemon startup, health checks, and schema bootstrapping. Adapt the container name, DB user/password, and table probe for this project.

The user should be able to clone the repo and run `bun run dev` to get everything up.

### `package.json` scripts
```json
{
  "scripts": {
    "dev": "bash scripts/dev.sh",
    "build": "next build",
    "start": "next start",
    "lint": "bunx biome check .",
    "lint:fix": "bunx biome check --write .",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "drizzle-kit migrate",
    "db:push": "drizzle-kit push",
    "db:seed": "bun run db/seed.ts",
    "db:studio": "drizzle-kit studio",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

## Setup Steps (Agent Must Do These)

### 1. Create GitHub Repo
```bash
gh repo create bhekanik/sponsor-tracker --public --source=. --push
```

### 2. Local Postgres (Docker)
Handled automatically by `scripts/dev.sh`. No manual setup needed.

### 3. Production Postgres (Neon)
For production deployment on Vercel, use Neon serverless Postgres:
- Create project at https://console.neon.tech
- Store connection string as `DATABASE_URL` in Vercel env vars
- Enable pg_trgm extension via Neon dashboard SQL editor

### 4. Stripe (Can Be Stubbed for MVP)
Stripe integration can be stubbed initially — focus on the core diff engine + search + watchlists first.

### 5. Resend
Sign up at https://resend.com, get API key, store as `RESEND_API_KEY` in `.env`.
Can be stubbed initially — log emails to console in development.

### 6. Vercel Deployment
```bash
bunx vercel --prod
```

---

## Environment Variables

```env
# Database (Neon)
DATABASE_URL=postgresql://...@....neon.tech/...?sslmode=require

# Auth
AUTH_SECRET=             # openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# GOV.UK Data Source
GOVUK_SPONSOR_CSV_URL=https://assets.publishing.service.gov.uk/media/...  # actual CSV download URL

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Agent Instructions

### Before You Start

1. **Study the reference project:** Read `/Users/bhekanik/code/bhekanik/sports-db/CLAUDE.md` thoroughly — this is a sibling project with nearly identical tech (Next.js App Router + Drizzle + Postgres + Better Auth + Resend + Docker Compose). Follow the same patterns:
   - **DB connection:** `src/db/index.ts` using `postgres` client + `drizzle(client, { schema })`
   - **Schema structure:** Split into modules under `src/db/schema/` with barrel export in `index.ts`
   - **Auth:** Better Auth with Drizzle adapter, session via `auth.api.getSession(headers())`
   - **API routes:** Route Handlers with zod validation, session-based authZ, Drizzle queries
   - **Client data:** TanStack Query hooks calling API routes
   - **Email:** Resend client with helper functions
   - **Dev script:** `scripts/dev.sh` — handles Docker, Bun, .env, schema push, dev server
   - **Drizzle config:** `drizzle.config.ts` with schema path + migrations output dir
   
   Copy patterns directly from this project. Don't reinvent what already works.

2. **Read Drizzle ORM docs:** `https://orm.drizzle.team/docs/overview`
3. **Understand pg_trgm:** Research PostgreSQL trigram matching for fuzzy search
4. **Use sub-agents for parallel research:** Spawn sub-agents to:
   - Research Neon serverless Postgres setup with Drizzle
   - Research Vercel Cron configuration
   - Research Resend email integration with Next.js
   - Find the actual current CSV download URL from GOV.UK

### Build Order — Phased Approach (CRITICAL)

**You MUST build this project in small, incremental phases.**

At the very start, create `docs/implementation/` and write each phase as a separate markdown file with checklists. Create `docs/implementation/README.md` as the index. Work through one phase at a time with Red-Green TDD. Mark phases complete and move on.

**Phase 1: Project Scaffold** (`phase-01-scaffold.md`)
- Create Next.js app with TypeScript, Tailwind, App Router
- Set up shadcn/ui
- Configure Biome
- Configure Vitest + Testing Library + MSW
- Set up Drizzle ORM with Neon connection
- Enable pg_trgm extension
- Run initial migration with schema
- Basic layout shell (header, footer, placeholder pages)
- Create GitHub repo and push
- Verify: app runs, DB connects, tests run, linting passes

**Phase 2: CSV Ingestion & Diff Engine** (`phase-02-ingestion.md`)
- Download and parse GOV.UK sponsor CSV
- Normalize sponsor names (lowercase, trim, standardize)
- Store source_fetches metadata
- Create/update sponsor records from CSV rows
- Implement diff computation (added, removed, updated)
- Create changesets + change records
- Store snapshots for audit
- ETag/Last-Modified caching
- Tests for normalization, diffing, matching
- Verify: can ingest CSV, compute diffs between two versions

**Phase 3: Search** (`phase-03-search.md`)
- Search API route (`GET /api/search?q=...`)
- Fuzzy matching with pg_trgm
- Filters: town, county, route, rating, status
- Search results page with shadcn components
- Sponsor detail page with change timeline
- Pagination
- Tests for search, fuzzy matching
- Verify: can search sponsors, see details and history

**Phase 4: Auth & User Accounts** (`phase-04-auth.md`)
- Set up NextAuth.js v5 or Better Auth
- Email + password registration
- Magic link login (via Resend)
- User dashboard shell
- Protected routes
- Tests for auth flows
- Verify: can register, login, access dashboard

**Phase 5: Watchlists & Rules** (`phase-05-watchlists.md`)
- CRUD for watchlists
- CRUD for watchlist rules (company, keyword, location, route)
- Rule matching engine: given a changeset, find all matching watchlist rules
- Watchlist dashboard UI
- Tests for rule matching
- Verify: can create watchlists, rules match changes correctly

**Phase 6: Notifications & Alerts** (`phase-06-notifications.md`)
- Notification preferences UI
- Email notifications via Resend (instant + daily digest)
- Notification queue + delivery tracking
- Delivery log UI
- Wire up: changeset → rule matching → notification queue → email send
- Tests for notification pipeline
- Verify: changes trigger email notifications for matching watchlists

**Phase 7: API** (`phase-07-api.md`)
- API key generation + management UI
- API authentication middleware
- Rate limiting per plan
- Implement all API endpoints (search, sponsor, history, changes, resolve, bulk check)
- API documentation page
- Tests for API endpoints, rate limiting
- Verify: can use API key to search, resolve names, get changes

**Phase 8: Scheduled Polling** (`phase-08-polling.md`)
- Vercel Cron job configuration (or fallback to external cron)
- Scheduled CSV polling (every 6h weekdays, 12h weekends)
- ETag/conditional fetch logic
- Auto-trigger diff + notification pipeline on changes
- "What changed today?" public page
- Changes feed with filtering
- Tests for polling logic
- Verify: polling detects changes, triggers diffs and notifications automatically

**Phase 9: Payments** (`phase-09-payments.md`)
- Stripe integration (products, prices, checkout)
- Pricing page
- Plan enforcement (watchlist limits, API rate limits)
- Webhook handling for subscription events
- Billing portal link
- Tests for plan limits
- Verify: can subscribe, plan limits enforced

**Phase 10: Polish & Deploy** (`phase-10-polish.md`)
- SEO (meta tags, OG images, structured data)
- Landing page content + value prop
- About page with FAQ
- Responsive design pass
- Loading states (skeletons)
- Error boundaries
- robots.txt + sitemap
- Final react-doctor check
- Full test suite green
- Vercel deployment with env vars
- Verify: deployed, all features work in production

---

## Design Guidelines

- **Professional and trustworthy** — this serves lawyers, HR, and recruiters
- Light mode default, dark mode available
- Color palette: White/gray backgrounds, indigo/blue accents (#4F46E5, #3B82F6)
- Clean typography, ample whitespace
- Data-dense where it matters (search results, changes feed) but not cluttered
- Change indicators: green for additions, red for removals, amber for updates
- Mobile responsive but desktop-first (most users are at work)

---

## SEO Strategy (Built In)

Key pages to rank:
- `/sponsor/[name-slug]` — "Does [company] sponsor UK visas?" (90,000+ pages)
- `/changes` — "UK sponsor register changes today"
- `/search?town=london` — "UK visa sponsors in London"

Each sponsor page gets a canonical URL, meta description, and structured data (Organization schema).

Auto-generate title tags like: "[Company Name] — UK Visa Sponsor Status | SponsorTracker"

---

## Stretch Goals (Post-MVP)

- **Chrome extension** — show sponsor status on LinkedIn job listings
- **Slack app** — `/sponsor check [company name]`
- **Zapier/Make integration** — webhook templates
- **Weekly "biggest changes" email** (auto-generated content marketing)
- **Historical analytics** — "X sponsors added this month", trend charts
- **"Can I be sponsored?" helper** — user enters job title + salary + employer → guidance
- **Compare two companies** side-by-side
- **Bulk CSV upload** — recruiters upload a list of companies, get sponsor status for all

---

## File Structure

```
sponsor-tracker/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Landing page
│   ├── search/page.tsx             # Search results
│   ├── sponsor/[id]/page.tsx       # Sponsor detail
│   ├── changes/page.tsx            # Changes feed
│   ├── changes/[id]/page.tsx       # Changeset detail
│   ├── pricing/page.tsx            # Pricing
│   ├── about/page.tsx              # About + FAQ
│   ├── dashboard/
│   │   ├── page.tsx                # Dashboard home
│   │   ├── watchlists/page.tsx     # Watchlists
│   │   ├── alerts/page.tsx         # Notification prefs
│   │   └── api/page.tsx            # API keys + usage
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── docs/
│   │   └── api/page.tsx            # API docs
│   ├── api/
│   │   ├── search/route.ts
│   │   ├── sponsors/[id]/route.ts
│   │   ├── sponsors/[id]/history/route.ts
│   │   ├── sponsors/resolve/route.ts
│   │   ├── changes/route.ts
│   │   ├── changes/latest/route.ts
│   │   ├── bulk/check/route.ts
│   │   ├── webhooks/route.ts
│   │   ├── cron/poll/route.ts      # Vercel Cron endpoint
│   │   └── stripe/webhook/route.ts
│   └── globals.css
├── components/
│   ├── ui/                         # shadcn components
│   ├── layout/
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   └── theme-provider.tsx
│   ├── search/
│   │   ├── search-bar.tsx
│   │   ├── search-results.tsx
│   │   ├── search-filters.tsx
│   │   └── sponsor-card.tsx
│   ├── sponsor/
│   │   ├── sponsor-detail.tsx
│   │   ├── change-timeline.tsx
│   │   └── sponsor-status-badge.tsx
│   ├── changes/
│   │   ├── changes-feed.tsx
│   │   ├── change-item.tsx
│   │   └── changeset-summary.tsx
│   ├── dashboard/
│   │   ├── watchlist-manager.tsx
│   │   ├── rule-editor.tsx
│   │   ├── alert-settings.tsx
│   │   └── api-key-manager.tsx
│   └── pricing/
│       └── pricing-cards.tsx
├── db/
│   ├── schema.ts                   # Drizzle schema
│   ├── index.ts                    # DB connection
│   └── migrations/                 # Drizzle migrations
├── lib/
│   ├── ingestion/
│   │   ├── fetch-csv.ts            # Download + cache CSV
│   │   ├── parse-csv.ts            # Parse + normalize
│   │   ├── diff-engine.ts          # Compute diffs
│   │   └── notification-pipeline.ts # Match rules → queue alerts
│   ├── matching/
│   │   ├── fuzzy-match.ts          # pg_trgm + heuristics
│   │   └── normalize.ts            # Name normalization
│   ├── api/
│   │   ├── auth-middleware.ts      # API key validation
│   │   └── rate-limiter.ts         # Plan-based rate limiting
│   └── utils.ts
├── public/
│   ├── og-image.png
│   └── favicon.ico
├── drizzle.config.ts
├── biome.json
├── vitest.config.ts
├── .env.local
├── vercel.json                     # Cron config
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Vercel Cron Configuration

```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/poll",
      "schedule": "0 */6 * * 1-5"
    },
    {
      "path": "/api/cron/poll",
      "schedule": "0 */12 * * 0,6"
    },
    {
      "path": "/api/cron/daily-digest",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## Content for Launch

### Landing Page Hero
```
Track UK Visa Sponsor Changes — Instantly

The Home Office updates the sponsor register almost every business day.
Stop refreshing the spreadsheet. Get notified when it matters.

[Search sponsors] [Set up alerts →]
```

### About Page
```
SponsorTracker monitors the UK Home Office Register of Licensed Sponsors 
and notifies you when companies you care about are added, removed, or updated.

Data source: GOV.UK Register of Licensed Sponsors: Workers
Updated: Almost every business day
Coverage: 90,000+ licensed sponsors

We are not affiliated with the Home Office or GOV.UK.
This is an independent tool built to make public data more accessible.
```
