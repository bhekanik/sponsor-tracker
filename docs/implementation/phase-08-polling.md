# Phase 8: Scheduled Polling

## Status: PENDING

## Tasks

- [ ] Create cron endpoint (`/api/cron/poll`)
- [ ] Create daily digest cron endpoint (`/api/cron/daily-digest`)
- [ ] Implement polling schedule logic (6h weekdays, 12h weekends)
- [ ] ETag/conditional fetch — skip download if unchanged
- [ ] Auto-trigger diff + notification pipeline on changes
- [ ] Create "What changed today?" public page (`/changes`)
- [ ] Create changeset detail page (`/changes/[id]`)
- [ ] Create changes feed with filtering (type, date range)
- [ ] Create change item components (added/removed/updated)
- [ ] Secure cron endpoints with CRON_SECRET
- [ ] Write tests: polling detects changes
- [ ] Write tests: unchanged CSV skipped
- [ ] Write tests: changes feed renders correctly
- [ ] Run react-doctor on changes components
- [ ] Verify: polling triggers diffs and notifications automatically

## Acceptance Criteria

- Cron endpoint processes CSV and creates changesets
- Unchanged CSV detected via ETag — no unnecessary processing
- Changes feed shows today's additions/removals/updates
- Changeset detail shows all individual changes
