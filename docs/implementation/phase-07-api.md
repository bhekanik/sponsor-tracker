# Phase 7: API

## Status: COMPLETE

## Tasks

- [x] Create API key generation (`src/lib/api/api-keys.ts`) with st_ prefix
- [x] Create API key management UI (`/dashboard/api`) — ApiKeyManager component
- [x] Create API key CRUD routes (`/api/keys`)
- [x] Create API auth middleware (`src/lib/api/auth-middleware.ts`)
- [x] Create rate limiter (`src/lib/api/rate-limiter.ts`) — per plan limits (100/1000/10000)
- [x] Implement `GET /api/v1/sponsors/search` with fuzzy matching + filters
- [x] Implement `GET /api/v1/sponsors/:id`
- [x] Implement `GET /api/v1/sponsors/:id/history`
- [x] Implement `POST /api/v1/sponsors/resolve` — bulk fuzzy match (Pro+)
- [x] Implement `GET /api/v1/changes?since=`
- [x] Implement `GET /api/v1/changes/latest`
- [x] Implement `POST /api/v1/bulk/check` — bulk status check (Business only)
- [x] Create API documentation page (`/docs/api`) with all endpoints
- [x] Consolidated middleware to pass all `/api` routes (they handle own auth)
- [x] Write tests: API key generation format + uniqueness (2 tests)
- [x] Verify: lint clean, 58 tests pass, build succeeds (31 routes)

## Acceptance Criteria

- [x] API key auth required for all /v1/ endpoints
- [x] Rate limits enforced (100/day free, 1000/day pro, 10000/day business)
- [x] All endpoints return correct JSON responses
- [x] Bulk endpoints restricted by plan
