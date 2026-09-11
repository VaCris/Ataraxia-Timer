# Ataraxia Timer

Ataraxia is a Pomodoro-focused productivity PWA built with React, Vite, Redux Toolkit, Dexie and Workbox.

The application follows a **local-first architecture for its core productivity features**: the timer, tasks, tags and settings must remain usable when the API is unavailable. Remote services are used for account operations, cross-device synchronization and other inherently online capabilities.

## Core offline capabilities

The following functionality is expected to work without an active internet connection after the application has been installed or loaded previously:

- Start, pause, resume and restore Pomodoro sessions.
- Create, update, complete and delete tasks.
- Create, update and delete tags/categories.
- Read and update application settings.
- Restore the last known local profile/session for a previously known user.
- Queue local mutations for later synchronization.

IndexedDB, through Dexie, is the persistence layer and local source of truth for core data. A temporary backend outage must not make the core application unusable.

## Online-only capabilities

Some operations inherently require a remote service and cannot be performed completely offline:

- First-time remote sign-in and registration.
- Password recovery/reset.
- Email verification.
- Cross-device synchronization.
- Receiving data created on another device.
- Server-backed account and gamification operations that have no local equivalent.

Failure of an online-only operation must not delete local productivity data or block the core offline experience.

## Synchronization model

Local mutations are persisted before synchronization is attempted.

The sync queue distinguishes between:

- `pending`: ready to be synchronized.
- `retrying`: transient failure; retried using backoff.
- `blocked_auth`: waiting for a valid remote session.
- `conflict`: requires explicit conflict handling.
- `failed_permanent`: rejected permanently and retained for inspection/recovery.

Transient network, rate-limit and server failures must **never silently delete queued user changes**.

The remote API acts as a synchronization peer, not as the source required to render or edit core local data.

## PWA behavior

Production builds precache the application shell and use a navigation fallback so an installed/cached application can start without network access.

Service-worker updates use a prompt instead of immediately replacing the running version. PWA service-worker behavior is disabled during normal Vite development to avoid stale development caches.

## Local session vs remote session

Ataraxia distinguishes between:

- **Local session/profile:** allows a previously known user to keep accessing locally persisted productivity data.
- **Remote session:** authorizes API and synchronization operations.

An expired or temporarily unavailable remote session must not invalidate the local session. Explicit logout clears the local profile and remote credentials.

## Development

### Requirements

- Node.js compatible with the versions required by the current dependency tree.
- pnpm 10 (the repository declares its package-manager version in `package.json`).

### Install

```bash
pnpm install
```

### Environment

The frontend expects the API base URL through:

```env
VITE_API_URL=https://your-api.example.com/api/v1
```

Account and synchronization features require a reachable API. Core local functionality must remain usable without it.

### Commands

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm test:run
pnpm build
pnpm preview
```

`pnpm test` runs Vitest in watch/development mode. `pnpm test:run` executes the suite once and is suitable for automated validation.

## Project structure

The codebase is organized by application, features and infrastructure:

- `src/app/` — application shell, layouts and pages.
- `src/features/` — domain features such as auth, Pomodoro, tasks, tags and settings.
- `src/infrastructure/database/` — Dexie/IndexedDB schema and migrations.
- `src/infrastructure/sync/` — durable push/pull synchronization queue.
- `src/infrastructure/api/` — HTTP and generated OpenAPI clients.
- `src/store/` — Redux store and root orchestration.
- `src/__tests__/` — automated tests.

See [`Structure.md`](./Structure.md) for the broader repository map.

## Data migration rules

IndexedDB schema changes must use an explicit Dexie version and migration when existing user data needs transformation. Store renames must migrate data before removing the old store.

Service-worker changes and IndexedDB migrations must be designed so updating the application cannot silently discard pending local work.

## Current development focus

The `dev` branch is being hardened around four guarantees:

1. Core workflows remain operational offline.
2. Local mutations are never silently discarded.
3. Remote authentication is independent from local usability.
4. Reconnection and synchronization are idempotent and conflict-aware.
