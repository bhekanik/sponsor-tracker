# Phase 7: API

## Status: PENDING

## Tasks

- [ ] Create API key generation (`src/lib/api/api-keys.ts`)
- [ ] Create API key management UI (`/dashboard/api`)
- [ ] Create API auth middleware (`src/lib/api/auth-middleware.ts`)
- [ ] Create rate limiter (`src/lib/api/rate-limiter.ts`) — per plan limits
- [ ] Implement `GET /api/v1/sponsors/search`
- [ ] Implement `GET /api/v1/sponsors/:id`
- [ ] Implement `GET /api/v1/sponsors/:id/history`
- [ ] Implement `POST /api/v1/sponsors/resolve` — bulk fuzzy match
- [ ] Implement `GET /api/v1/changes?since=`
- [ ] Implement `GET /api/v1/changes/latest`
- [ ] Implement `POST /api/v1/bulk/check` — CSV-like bulk check
- [ ] Implement `POST /api/v1/webhooks` — register webhook target
- [ ] Create API documentation page (`/docs/api`)
- [ ] Write tests: API key auth works
- [ ] Write tests: rate limiting enforced per plan
- [ ] Write tests: search endpoint returns results
- [ ] Write tests: resolve endpoint matches names
- [ ] Write tests: bulk check returns statuses
- [ ] Verify: can use API key to search, resolve names, get changes

## Acceptance Criteria

- API key auth required for all /v1/ endpoints
- Rate limits enforced (100/day free, 1000/day pro, 10000/day business)
- All endpoints return correct JSON responses
- Bulk resolve handles up to 500 names
