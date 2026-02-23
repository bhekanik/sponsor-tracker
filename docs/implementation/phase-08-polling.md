# Phase 8: Scheduled Polling

## Status: COMPLETE

## Tasks

- [x] Create cron endpoint (`/api/cron/poll`) with CRON_SECRET auth
- [x] Create daily digest cron endpoint (`/api/cron/daily-digest`)
- [x] Polling schedule via vercel.json (6h weekdays, 12h weekends, digest at 8am UTC)
- [x] ETag/conditional fetch — skip download if unchanged (in ingest.ts)
- [x] Auto-trigger diff + notification pipeline on changes
- [x] Create "What changed today?" public page (`/changes`) with ChangeFeed component
- [x] Create public changes API route (`/api/changes`) with type/date filtering
- [x] Create change feed component with type filter pills (all/added/removed/updated)
- [x] Create change item components with icons (green plus, red minus, amber refresh)
- [x] Secure cron endpoints with CRON_SECRET
- [x] Verify: lint clean, 58 tests pass, build succeeds (35 routes)

## Acceptance Criteria

- [x] Cron endpoint processes CSV and creates changesets
- [x] Unchanged CSV detected via ETag — no unnecessary processing
- [x] Changes feed shows additions/removals/updates with filtering
- [x] Notifications triggered after successful poll with changes
