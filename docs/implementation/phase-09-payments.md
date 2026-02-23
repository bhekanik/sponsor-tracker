# Phase 9: Payments

## Status: PENDING

## Tasks

- [ ] Install Stripe SDK
- [ ] Create Stripe products/prices config
- [ ] Create pricing page (`/pricing`) with plan comparison
- [ ] Create Stripe checkout session endpoint
- [ ] Create Stripe webhook handler (`/api/stripe/webhook`)
- [ ] Handle subscription events: created, updated, deleted
- [ ] Update user plan on subscription changes
- [ ] Create billing portal link for existing subscribers
- [ ] Enforce plan limits: watchlists, API rate limits, features
- [ ] Create pricing cards component
- [ ] Write tests: checkout creates subscription
- [ ] Write tests: webhook updates user plan
- [ ] Write tests: plan limits enforced across features
- [ ] Verify: can subscribe, plan limits enforced

## Acceptance Criteria

- Pricing page shows Free/Pro/Business tiers
- Stripe checkout flow works
- Subscription events update user plan
- Features gated by plan (watchlists, API limits, bulk endpoints)
