# Phase 1: Project Scaffold

## Status: PENDING

## Tasks

- [ ] Initialize Next.js app with TypeScript, Tailwind, App Router (`bunx create-next-app`)
- [ ] Configure path alias `@/*` → `./src/*`
- [ ] Install and configure shadcn/ui
- [ ] Install and configure Biome (remove any eslint config)
- [ ] Install and configure Vitest + Testing Library + MSW
- [ ] Create `vitest.config.ts` with jsdom, globals, setup file
- [ ] Create test setup file (`src/test/setup.ts`)
- [ ] Install Drizzle ORM + drizzle-kit + postgres-js
- [ ] Create `src/db/index.ts` (DB connection — follow sports-db pattern)
- [ ] Create `src/db/schema/index.ts` (barrel export)
- [ ] Create `src/db/schema/sponsors.ts` (sponsors, sponsorAliases, sponsorSnapshots tables)
- [ ] Create `src/db/schema/source-fetches.ts` (sourceFetches table)
- [ ] Create `src/db/schema/changes.ts` (changesets, changes tables)
- [ ] Create `src/db/schema/users.ts` (users table with plan, API key fields)
- [ ] Create `src/db/schema/watchlists.ts` (watchlists, watchlistRules tables)
- [ ] Create `src/db/schema/notifications.ts` (notifications, deliveries tables)
- [ ] Create `src/db/schema/auth.ts` (Better Auth tables: sessions, accounts, verifications)
- [ ] Create `drizzle.config.ts`
- [ ] Create `docker-compose.yml` for local Postgres
- [ ] Create `.env.example`
- [ ] Create `scripts/dev.sh` (adapted from sports-db)
- [ ] Create `vercel.json` with cron config
- [ ] Create `biome.json`
- [ ] Configure `package.json` scripts
- [ ] Create basic layout shell: `src/app/layout.tsx`, header, footer
- [ ] Create placeholder pages: `/`, `/search`, `/changes`, `/pricing`, `/about`
- [ ] Write smoke test: app renders without crashing
- [ ] Create `.gitignore`
- [ ] Initialize git repo and push to GitHub
- [ ] Verify: app runs, DB connects, tests pass, lint passes

## Acceptance Criteria

- `bun run dev` starts everything (Docker Postgres + Next.js)
- `bun run test` passes
- `bun run lint` passes
- DB schema pushed successfully
- All placeholder pages render
