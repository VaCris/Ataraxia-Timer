const VERSION_STORAGE_KEY = 'ataraxia-app-version'
const VERSION_CHECK_INTERVAL = 15 * 60 * 1000

async function getRemoteVersion() {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache',
        },
    })

    if (!res.ok) return null

    return res.json()
}

async function cleanOldCaches() {
    if (!('caches' in window)) return

    const keys = await caches.keys()

    await Promise.all(
        keys
            .filter((key) => {
                const normalized = key.toLowerCase()

                return (
                    normalized.includes('ataraxia') ||
                    normalized.includes('workbox') ||
                    normalized.includes('precache') ||
                    normalized.includes('runtime') ||
                    normalized.includes('api-cache')
                )
            })
            .map((key) => caches.delete(key))
    )
}

async function cleanOldWorkboxDatabases() {
    if (!('indexedDB' in window)) return

    const databaseNames = ['workbox-expiration']

    if (typeof indexedDB.databases === 'function') {
        try {
            const databases = await indexedDB.databases()

            databases.forEach((database) => {
                const name = database?.name || ''
                const normalized = name.toLowerCase()

                if (
                    normalized.includes('workbox') ||
                    normalized.includes('ataraxia-api-cache') ||
                    normalized.includes('api-cache')
                ) {
                    databaseNames.push(name)
                }
            })
        } catch {
            console.warn('Failed to list IndexedDB databases. Old Workbox caches may not be cleaned up.')
        }
    }

    await Promise.allSettled(
        [...new Set(databaseNames)].map(
            (name) =>
                new Promise((resolve) => {
                    const request = indexedDB.deleteDatabase(name)

                    request.onsuccess = resolve
                    request.onerror = resolve
                    request.onblocked = resolve
                })
        )
    )
}

async function cleanLegacyPwaStorage() {
    await Promise.all([
        cleanOldCaches(),
        cleanOldWorkboxDatabases(),
    ])
}

async function updateRegistrations() {
    if (!('serviceWorker' in navigator)) return

    const registrations = await navigator.serviceWorker.getRegistrations()

    await Promise.all(
        registrations.map((registration) => registration.update())
    )
}

async function checkVersion(registration) {
    try {
        const remote = await getRemoteVersion()

        if (!remote?.version) return

        const remoteVersion = String(remote.version)
        const storedVersion = localStorage.getItem(VERSION_STORAGE_KEY)

        if (!storedVersion) {
            localStorage.setItem(VERSION_STORAGE_KEY, remoteVersion)
            await cleanLegacyPwaStorage()
            return
        }

        if (storedVersion === remoteVersion) return

        localStorage.setItem(VERSION_STORAGE_KEY, remoteVersion)

        await registration?.update()
        await updateRegistrations()
        await cleanLegacyPwaStorage()

        window.location.reload()
    } catch (error) {
        console.error(error)
    }
}

export function startVersionGuard(registration) {
    checkVersion(registration)

    setInterval(() => {
        checkVersion(registration)
    }, VERSION_CHECK_INTERVAL)

    window.addEventListener('focus', () => {
        checkVersion(registration)
    })
}
