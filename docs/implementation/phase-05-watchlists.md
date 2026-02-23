# Phase 5: Watchlists & Rules

## Status: PENDING

## Tasks

- [ ] Create `POST/GET /api/watchlists` routes (CRUD)
- [ ] Create `POST/GET/DELETE /api/watchlists/[id]/rules` routes
- [ ] Create rule matching engine (`src/lib/ingestion/rule-matcher.ts`)
- [ ] Match rule types: company (exact/fuzzy), keyword, location, route
- [ ] Create watchlist manager component
- [ ] Create rule editor component (add/remove rules)
- [ ] Create watchlist dashboard page (`/dashboard/watchlists`)
- [ ] Enforce plan limits (free: 0 watchlists, pro: 10, business: unlimited)
- [ ] Write tests: CRUD operations
- [ ] Write tests: rule matching — company rule matches exact sponsor
- [ ] Write tests: rule matching — keyword rule matches partial name
- [ ] Write tests: rule matching — location rule matches town
- [ ] Write tests: rule matching — route rule matches sponsor route
- [ ] Write tests: plan limits enforced
- [ ] Run react-doctor on watchlist components
- [ ] Verify: can create watchlists, rules match changes correctly

## Acceptance Criteria

- Users can create/edit/delete watchlists and rules
- Rule matcher correctly identifies matching changes for each rule type
- Plan limits enforced (error when exceeding)
