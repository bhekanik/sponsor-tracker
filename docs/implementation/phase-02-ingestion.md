# Phase 2: CSV Ingestion & Diff Engine

## Status: PENDING

## Tasks

- [ ] Research actual GOV.UK CSV download URL
- [ ] Create `src/lib/ingestion/fetch-csv.ts` — download CSV with ETag/If-Modified-Since
- [ ] Create `src/lib/ingestion/parse-csv.ts` — parse CSV rows, normalize names
- [ ] Create `src/lib/matching/normalize.ts` — name normalization (lowercase, trim, stopword removal)
- [ ] Create `src/lib/ingestion/diff-engine.ts` — compute added/removed/updated sponsors
- [ ] Create `src/lib/ingestion/ingest.ts` — orchestrate: fetch → parse → diff → store
- [ ] Store source_fetches metadata on each fetch
- [ ] Match CSV rows to existing sponsors by normalized name + town
- [ ] Create/update sponsor records from CSV rows
- [ ] Create changeset + individual change records
- [ ] Store snapshots for audit trail
- [ ] Handle "removed" sponsors (mark status, set removedAt)
- [ ] Handle field-level diffs for "updated" sponsors
- [ ] Write tests: name normalization
- [ ] Write tests: CSV parsing
- [ ] Write tests: diff computation (added, removed, updated)
- [ ] Write tests: full ingestion pipeline with mock data
- [ ] Verify: can ingest CSV, compute diffs between two versions

## Acceptance Criteria

- Given two CSV snapshots, correctly identifies added/removed/updated sponsors
- Name normalization handles edge cases (Ltd/Limited, extra spaces, casing)
- All changes stored with proper changeset records
- Source fetch metadata tracked (hash, row count, etag)
