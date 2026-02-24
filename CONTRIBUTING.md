# Contributing to SponsorTracker

Thanks for your interest in contributing. This guide will get you up and running.

## Quick Start

```bash
# Clone the repo
git clone https://github.com/bhekanik/sponsor-tracker.git
cd sponsor-tracker

# Run the dev script (installs Bun, Docker, Postgres, dependencies, and starts the server)
bun run dev
```

That's it. The dev script handles everything:
- Installs Bun if missing
- Installs Docker if missing
- Creates `.env` from `.env.example` with a generated auth secret
- Starts Postgres via Docker Compose
- Enables the `pg_trgm` extension
- Pushes the database schema
- Starts Next.js on `http://localhost:3000`

### Optional services

Some features need API keys in `.env`. They're optional for local dev:

| Variable | Required for |
|----------|-------------|
| `RESEND_API_KEY` | Email notifications |
| `STRIPE_SECRET_KEY` | Payment flows |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhooks |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Checkout UI |
| `CRON_SECRET` | Cron job endpoints |

## Development Commands

```bash
bun run dev          # Start dev server (with full setup)
bun run build        # Production build
bun run lint         # Check with Biome
bun run lint:fix     # Auto-fix lint issues
bun run test         # Run tests in watch mode
bun run test:run     # Run tests once
bun run db:generate  # Generate Drizzle migrations
bun run db:migrate   # Run migrations
bun run db:push      # Push schema to database
bun run db:seed      # Seed database with GOV.UK data
bun run db:studio    # Open Drizzle Studio
```

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Language:** TypeScript (strict)
- **Database:** PostgreSQL + Drizzle ORM
- **Auth:** better-auth
- **Styling:** Tailwind CSS v4
- **Tables:** TanStack Table
- **State:** nuqs (URL state), TanStack Query
- **Payments:** Stripe
- **Email:** Resend
- **Testing:** Vitest + Testing Library
- **Linting:** Biome

## Making Changes

1. **Fork and clone** the repo
2. **Create a branch** from `main`: `git checkout -b feat/my-feature`
3. **Make your changes** — keep the diff focused
4. **Run tests:** `bun run test:run`
5. **Run lint:** `bun run lint`
6. **Run build:** `bun run build`
7. **Commit** with a descriptive message: `feat: add sponsor export button`
8. **Push** and open a PR against `main`

### Commit message format

```
type: short description

optional body explaining why
```

Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `test`

### What makes a good PR

- Solves one thing
- Has a clear description of what and why
- Tests pass
- Build succeeds
- No unrelated changes

## Reporting Bugs

Open an issue with:
- What you expected
- What happened instead
- Steps to reproduce
- Browser/OS if relevant

## Suggesting Features

Open an issue describing:
- The problem you're trying to solve
- Your proposed solution
- Any alternatives you considered

## Code Style

We use Biome for linting and formatting. Run `bun run lint:fix` before committing. The main rules:
- Tabs for indentation
- Double quotes
- No unused imports
- Strict TypeScript

## License

By contributing, you agree that your contributions will be licensed under the [AGPL-3.0 License](LICENSE).
