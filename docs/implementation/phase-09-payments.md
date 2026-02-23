# Phase 9: Payments

## Status: COMPLETE

## Tasks

- [x] Install Stripe SDK
- [x] Create Stripe products/prices config
- [x] Create pricing page (`/pricing`) with plan comparison
- [x] Create Stripe checkout session endpoint
- [x] Create Stripe webhook handler (`/api/stripe/webhook`)
- [x] Handle subscription events: created, updated, deleted
- [x] Update user plan on subscription changes
- [x] Create billing portal link for existing subscribers
- [x] Enforce plan limits: watchlists, API rate limits, features
- [x] Create pricing cards component
- [x] Write tests: checkout creates subscription
- [x] Write tests: webhook updates user plan
- [x] Write tests: plan limits enforced across features
- [x] Verify: can subscribe, plan limits enforced

## Acceptance Criteria

- Pricing page shows Free/Pro/Business tiers
- Stripe checkout flow works
- Subscription events update user plan
- Features gated by plan (watchlists, API limits, bulk endpoints)
