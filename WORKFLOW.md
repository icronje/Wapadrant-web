# Wapadrant Web — Workflow & Issue Log

## Issue #1: Admin Route 500 Internal Server Error (2026-08-10)

### Problem
Admin routes returned 500 Internal Server Error after login attempt.

### Root Cause
src/middleware.ts imported auth from @/lib/auth, which imports Prisma (@/lib/prisma). Prisma depends on Node.js native modules (node:util/types). Middleware runs in the Edge Runtime, which cannot load Node.js native modules, causing the module to crash on every admin route request.

### Fix
Split the NextAuth config into two files:

1. src/lib/auth.config.ts (NEW) — Edge-safe NextAuth config with providers, pages, callbacks, session strategy. No Prisma import. The authorize function is a placeholder returning null.
2. src/lib/auth.ts (UPDATED) — Imports authConfig from auth.config.ts, overrides the credentials provider with the real authorize function that queries Prisma and verifies passwords. Used by server components and API routes (Node.js runtime).
3. src/middleware.ts (UPDATED) — Imports authConfig from @/lib/auth.config instead of auth from @/lib/auth. Calls NextAuth(authConfig) to get the Edge-safe auth wrapper. Prisma stays out of the Edge bundle.

### Files Changed
- src/lib/auth.config.ts — created (Edge-safe config)
- src/lib/auth.ts — modified (imports from auth.config, adds Prisma authorize)
- src/middleware.ts — modified (uses authConfig, no Prisma in Edge)

### Verification
- Login page (/admin/login): 200 OK
- Admin route unauthenticated (/admin): 307 redirect to /admin/login
- Server-side auth with credentials: valid session returned
- No node:util/types errors in PM2 logs after fix

### Commits
- fix: split auth config to keep Prisma out of Edge middleware (2026-08-10)
