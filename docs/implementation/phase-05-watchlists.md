# Phase 5: Watchlists & Rules

## Status: COMPLETE

## Tasks

- [x] Create `POST/GET /api/watchlists` routes (CRUD)
- [x] Create `GET/PATCH/DELETE /api/watchlists/[id]` route
- [x] Create `POST/GET /api/watchlists/[id]/rules` routes
- [x] Create `DELETE /api/watchlists/[id]/rules/[ruleId]` route
- [x] Create rule matching engine (`src/lib/ingestion/rule-matcher.ts`)
- [x] Match rule types: company (exact), keyword (substring), location, route
- [x] Create watchlist manager component (create, delete, expand)
- [x] Create rule editor component (add/remove rules with type selector)
- [x] Create watchlist dashboard page (`/dashboard/watchlists`)
- [x] Enforce plan limits (free: 0, pro: 10, business: unlimited)
- [x] Write tests: rule matching — company rule matches exact sponsor (13 tests)
- [x] Write tests: rule matching — keyword rule matches partial name
- [x] Write tests: rule matching — location rule matches town
- [x] Write tests: rule matching — route rule matches sponsor route
- [x] Write tests: null handling for town/routes
- [x] Write tests: findMatchingRules returns all matching rules
- [x] Write tests: plan limits enforced (in API route)
- [x] Verify: lint clean, 52 tests pass, build succeeds

## Acceptance Criteria

- [x] Users can create/edit/delete watchlists and rules
- [x] Rule matcher correctly identifies matching changes for each rule type
- [x] Plan limits enforced (403 when exceeding)
