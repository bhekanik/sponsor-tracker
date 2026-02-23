# Phase 3: Search

## Status: PENDING

## Tasks

- [ ] Enable pg_trgm extension in migration/push
- [ ] Create `GET /api/search` route — full-text + trigram search
- [ ] Create `src/lib/matching/fuzzy-match.ts` — pg_trgm similarity queries
- [ ] Implement filters: town, county, route, rating, status
- [ ] Implement pagination (page/limit/offset)
- [ ] Create search results page (`/search`)
- [ ] Create search bar component with debounced input
- [ ] Create search results list with sponsor cards
- [ ] Create search filters sidebar/toolbar
- [ ] Create sponsor detail page (`/sponsor/[id]`)
- [ ] Create sponsor status badge component
- [ ] Create change timeline component for sponsor detail
- [ ] Create `GET /api/sponsors/[id]` route
- [ ] Create `GET /api/sponsors/[id]/history` route
- [ ] Landing page search bar (hero section)
- [ ] Write tests: search API returns correct results
- [ ] Write tests: fuzzy matching finds similar names
- [ ] Write tests: filters narrow results correctly
- [ ] Write tests: pagination works
- [ ] Run react-doctor on search components
- [ ] Verify: can search sponsors, see details and history

## Acceptance Criteria

- Search "Deloite" finds "Deloitte" (fuzzy matching)
- Filters by town/route/rating work correctly
- Sponsor detail shows current status + change timeline
- Pagination returns correct pages
