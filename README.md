# Ataraxia Timer

Ataraxia is a Pomodoro-focused productivity PWA built with React, Vite, Redux Toolkit, Dexie and Workbox.

The application follows a **local-first architecture for its core productivity features**: the timer, tasks, tags and settings must remain usable when the API is unavailable. Remote services are used for account operations, synchronization and other inherently online capabilities.

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

The client keeps a stable `clientMutationId` across retries. Backend deduplication for repeated mutation IDs is implemented, so resending the same mutation does not create a duplicate operation.

The frontend also protects its cursor from advancing when a push batch is only partially acknowledged or when a pulled change cannot be persisted. Local pending changes are not silently overwritten by a simulated concurrent remote change.

### Current synchronization limitation

Full multi-client conflict resolution is **not yet complete end to end**. The current backend still needs real domain-conflict detection and incremental pull behavior for two clients working concurrently. That work is tracked separately in frontend issue `#12` and the linked backend sync issue.

Until that work is complete, do not describe cross-device conflict resolution as fully implemented. The offline/local-first guarantees remain independent from this limitation.

## PWA behavior

Production builds precache the application shell and use a navigation fallback so an installed/cached application can start without network access.

Service-worker updates use a prompt instead of immediately replacing the running version. PWA service-worker behavior is disabled during normal Vite development to avoid stale development caches.

The production cold-start/offline verification procedure is documented in [`docs/PWA_OFFLINE_TEST.md`](./docs/PWA_OFFLINE_TEST.md).

## Local session vs remote session

Ataraxia distinguishes between:

- **Local session/profile:** allows a previously known user to keep accessing locally persisted productivity data.
- **Remote session:** authorizes API and synchronization operations.

An expired or temporarily unavailable remote session must not invalidate the local session. Explicit logout clears or preserves owner-scoped local data according to the selected local-data policy.

### Remote credential strategy

The frontend uses one refresh strategy:

- The short-lived **access token** is stored client-side under the `token` key and is the only credential JavaScript can read. Axios and the generated OpenAPI client obtain it through `src/infrastructure/auth/remoteSession.ts`.
- The **refresh token** is not persisted in Redux or Web Storage. The backend stores it in the `refresh_token` cookie with `HttpOnly`; production can additionally enforce `Secure` and the configured `SameSite` policy.
- `src/infrastructure/api/client.js` is the only module that performs refresh. It calls `/auth/refresh` with credentials enabled and coordinates concurrent 401 responses through one shared refresh promise.
- HTTP 500 responses never trigger refresh or logout.
- If refresh fails, only the remote access credential is cleared. The local profile and IndexedDB data remain available for offline core functionality.
- On an online cold start without an access token, auth bootstrap may attempt cookie-based refresh once before falling back to the known local profile.

Legacy `refreshToken` values left in `localStorage` by older frontend versions are removed by the API/session layer and are not reused.

## Development

### Requirements

- Node.js **20.19+** or **22.12+**. These are the minimum ranges required by Vite 7.
- pnpm **10**. The repository pins pnpm through the `packageManager` field in `package.json`.

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
pnpm test:coverage
pnpm build
pnpm preview
```

- `pnpm test` runs Vitest in watch/development mode.
- `pnpm test:run` executes the suite once and is suitable for automated validation.
- `pnpm test:coverage` runs the suite with V8 coverage.
- `pnpm build` also generates `public/version.json` through the `prebuild` script before producing the production bundle.

A normal validation pass before merging should include:

```bash
pnpm typecheck
pnpm lint
pnpm test:run
pnpm build
```

For PWA/offline work, follow that with the production preview checklist in [`docs/PWA_OFFLINE_TEST.md`](./docs/PWA_OFFLINE_TEST.md).

## Project structure

The codebase is organized by application, features and infrastructure:

- `src/app/` — application shell, layouts and pages.
- `src/features/` — domain features such as auth, Pomodoro, tasks, tags and settings.
- `src/infrastructure/database/` — Dexie/IndexedDB schema and migrations.
- `src/infrastructure/sync/` — durable push/pull synchronization queue.
- `src/infrastructure/api/` — HTTP and generated OpenAPI clients.
- `src/store/` — Redux store and root orchestration.
- `src/__tests__/` — automated tests.

See [`Structure.md`](./Structure.md) for the broader repository map. The generated API client and DTOs live under `src/infrastructure/api/generated/`; synchronization behavior is implemented in `src/infrastructure/sync/` and is validated by integration tests under `src/__tests__/infrastructure/sync/`.

## Data migration rules

IndexedDB schema changes must use an explicit Dexie version and migration when existing user data needs transformation. Store renames must migrate data before removing the old store.

Service-worker changes and IndexedDB migrations must be designed so updating the application cannot silently discard pending local work.

Owner-aware migrations must preserve isolation between local profiles and must not reassign data already owned by another profile.

## Current development status

The client currently guarantees:

1. Core workflows remain operational offline.
2. Local mutations are retained instead of being silently discarded on transient errors.
3. Remote authentication is independent from local usability.
4. Mutation retries are idempotent and cursor advancement is guarded against partial application.

Full conflict resolution and incremental pull across concurrent clients remain tracked separately in `#12`.