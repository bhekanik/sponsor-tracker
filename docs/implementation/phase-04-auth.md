# Phase 4: Auth & User Accounts

## Status: PENDING

## Tasks

- [ ] Install Better Auth + Drizzle adapter
- [ ] Create `src/lib/auth.ts` — Better Auth config (email/password + magic link)
- [ ] Create `src/lib/auth-client.ts` — client-side auth helpers
- [ ] Create auth API route handler (`/api/auth/[...all]`)
- [ ] Create login page (`/auth/login`)
- [ ] Create register page (`/auth/register`)
- [ ] Create `src/middleware.ts` — protect dashboard routes
- [ ] Create user dashboard shell (`/dashboard`)
- [ ] Create dashboard layout with sidebar navigation
- [ ] Stub Resend email client for magic links (log to console in dev)
- [ ] Create Providers component (QueryClient, ThemeProvider, etc.)
- [ ] Write tests: registration creates user
- [ ] Write tests: login returns session
- [ ] Write tests: protected routes redirect unauthenticated users
- [ ] Write tests: middleware allows public routes
- [ ] Verify: can register, login, access dashboard

## Acceptance Criteria

- Email/password registration and login work
- Magic link sends (or logs in dev)
- Dashboard routes protected — redirect to login
- Session persists across page navigation
