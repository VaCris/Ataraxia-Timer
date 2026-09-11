const VERSION_STORAGE_KEY = 'ataraxia-app-version'
const VERSION_CHECK_INTERVAL = 15 * 60 * 1000

async function getRemoteVersion() {
    if (!navigator.onLine) return null

    const res = await fetch(`/version.json?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
            'Cache-Control': 'no-cache',
        },
    })

    if (!res.ok) return null

    return res.json()
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

        // Ask the browser to check for a newer service worker without deleting
        // the active precache or forcing a reload. With registerType='prompt' and
        // skipWaiting=false, the currently controlled app keeps working until
        // the new worker can activate safely after the current session ends.
        await registration?.update()
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
