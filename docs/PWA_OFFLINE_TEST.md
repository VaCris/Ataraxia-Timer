# PWA offline cold-start verification

This checklist validates the production PWA behavior required by issue #14.

## Preconditions

- Use the production build, not `pnpm dev`.
- Service worker support must be enabled in the browser.
- The first load must be online so the app shell can be installed in the browser cache.
- Core local data should already exist if you want to verify task/timer/settings restoration.

Development intentionally keeps the PWA service worker disabled through `devOptions.enabled = false` in `vite.config.js`. In addition, `UpdatePrompt` is mounted only when `import.meta.env.PROD` is true, so normal Vite development does not execute the service-worker registration hook.

## Start a production preview

```bash
pnpm build
pnpm preview --host 127.0.0.1
```

Open the preview URL printed by Vite, normally `http://127.0.0.1:4173`.

## 1. Prime the PWA online

1. Open `/` while online.
2. Wait until the dashboard is fully rendered.
3. In DevTools > Application > Service Workers, confirm a service worker is activated and controls the page.
4. In DevTools > Application > Cache Storage, confirm a Workbox precache exists.
5. Create or edit local core state:
   - timer state,
   - at least one task,
   - settings if desired.
6. Reload once while still online and confirm the application remains healthy.

Expected: the app shell is cached and IndexedDB/localStorage data remains available.

## 2. Cold start offline

1. In DevTools > Network, select `Offline`.
2. Close the application tab or standalone PWA window completely.
3. Reopen the same installed PWA or open the preview URL again without restoring connectivity.

Expected:

- the app shell renders without a network connection;
- the dashboard does not remain blocked on boot;
- previously persisted timer/task/settings state remains available;
- failed remote API requests do not prevent core local use.

## 3. Offline refresh

While still offline, refresh `/`.

Expected: the service worker serves the navigation fallback and the application renders again.

## 4. Direct internal routes offline

While still offline, navigate directly to each route and refresh it:

- `/privacy`
- `/terms`
- `/reset-password`

Expected: navigation requests fall back to cached `index.html`; React Router resolves the route instead of the browser showing a network error or server 404.

`/reset-password` may still require network access to perform an actual password reset. The acceptance criterion here is that the application shell and route itself load offline.

## 5. Core navigation and assets

Return to `/` while offline and exercise the local core UI.

Expected:

- timer controls remain usable;
- local tasks remain readable/editable according to the local-first workflow;
- the default dashboard background is served from `/assets/default-image.png`, which is included by the Workbox precache glob;
- missing Google Fonts do not block rendering because CSS includes `ui-sans-serif`/`system-ui` fallbacks;
- third-party or remote-only features may be unavailable without breaking the core shell.

Remote Open Graph/social preview images are metadata and are not required to render the application shell.

## 6. Service worker update safety

1. Restore connectivity.
2. Keep the current application open with local state present.
3. Trigger or wait for a service worker update check.
4. When the update prompt appears, choose **Later** first and confirm the current session continues without reloading.
5. Reopen/trigger the prompt and choose **Update Now** only after the current local state has been persisted.

Expected:

- service-worker registration is owned by `UpdatePrompt` in production;
- the active Workbox precache is not manually deleted;
- Ataraxia application IndexedDB is not deleted;
- no forced `window.location.reload()` occurs from the version guard;
- a newer worker waits until the user explicitly accepts the update;
- dismissing the update does not interrupt the active session.

The production configuration uses `registerType: 'prompt'` and `skipWaiting: false`. The version guard only asks the browser to check for a newer worker; activation remains user-controlled through the update prompt.

## Pass criteria

Issue #14 can be considered manually validated when all of the following are confirmed on a production preview or deployed production build after an initial online load:

- offline cold start succeeds;
- offline refresh succeeds;
- direct internal routes load offline;
- core local data remains usable;
- external fonts/resources do not block the core UI;
- service worker update checks do not erase active caches or application IndexedDB;
- choosing **Later** does not reload or interrupt the active session;
- development mode does not register a service worker accidentally.
