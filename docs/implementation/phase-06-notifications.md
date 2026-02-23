# Phase 6: Notifications & Alerts

## Status: PENDING

## Tasks

- [ ] Create notification preferences UI (`/dashboard/alerts`)
- [ ] Create `POST/GET /api/notifications` routes
- [ ] Create Resend email client (`src/lib/email.ts`)
- [ ] Create email templates: instant alert, daily digest
- [ ] Create notification pipeline (`src/lib/ingestion/notification-pipeline.ts`)
- [ ] Wire: changeset → rule matching → notification queue → email send
- [ ] Create delivery tracking (deliveries table)
- [ ] Create delivery log UI in dashboard
- [ ] Handle instant vs daily digest frequency
- [ ] Create daily digest aggregation job
- [ ] Write tests: notification pipeline matches rules to changes
- [ ] Write tests: instant notification triggers email
- [ ] Write tests: daily digest batches notifications
- [ ] Write tests: delivery status tracked
- [ ] Verify: changes trigger email notifications for matching watchlists

## Acceptance Criteria

- When a changeset matches a watchlist rule, notification is queued
- Instant notifications send immediately
- Daily digest batches and sends at configured time
- Delivery log shows sent/failed/pending status
