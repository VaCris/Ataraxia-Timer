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
                    normalized.includes('runtime')
                )
            })
            .map((key) => caches.delete(key))
    )
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
            return
        }

        if (storedVersion === remoteVersion) return

        localStorage.setItem(VERSION_STORAGE_KEY, remoteVersion)

        await registration?.update()
        await updateRegistrations()
        await cleanOldCaches()

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