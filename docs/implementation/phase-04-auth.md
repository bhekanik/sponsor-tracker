# Phase 4: Auth & User Accounts

## Status: COMPLETE

## Tasks

- [x] Install Better Auth + Drizzle adapter
- [x] Create `src/lib/auth.ts` — Better Auth config (email/password)
- [x] Create `src/lib/auth-client.ts` — client-side auth helpers
- [x] Create auth API route handler (`/api/auth/[...all]`)
- [x] Create login page (`/auth/login`) with Suspense for useSearchParams
- [x] Create register page (`/auth/register`)
- [x] Create `src/middleware.ts` — protect dashboard routes
- [x] Create user dashboard shell (`/dashboard`)
- [x] Create dashboard layout with sidebar navigation (Overview, Watchlists, Alerts, API Keys)
- [x] Create dashboard sub-pages (watchlists, alerts, api) with placeholder content
- [x] Providers component already created in Phase 1 (QueryClient, ThemeProvider, etc.)
- [x] Write tests: middleware allows public routes (4 tests)
- [x] Write tests: middleware redirects unauthenticated users with callbackUrl
- [x] Write tests: login page renders form and calls signIn.email
- [x] Write tests: register page renders form and calls signUp.email
- [x] Write tests: error display on failed auth
- [x] Verify: lint clean, 39 tests pass, build succeeds

## Acceptance Criteria

- [x] Email/password registration and login work
- [x] Dashboard routes protected — redirect to login
- [x] Session persists across page navigation (via Better Auth + nextCookies plugin)
