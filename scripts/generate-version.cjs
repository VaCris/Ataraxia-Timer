const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

const PREFIX_RE = /^(feat|fix|style|refactor|perf|test|docs|build|ci|chore|revert)(\(.+?\))?:\s*/i

const TRANSLATIONS = {
    'sync': {
        'feat': 'Sync engine with offline batching',
        'fix': 'Sync reliability fixes',
    },
    'pwa': {
        'feat': 'Installable PWA improvements',
        'fix': 'Service worker and update fixes',
    },
    'tags': {
        'feat': 'Tag sync and inline editing',
        'fix': 'Tag display fixes',
    },
    'theme': {
        'feat': 'New theme options',
        'fix': 'Visual and background fixes',
    },
    'timer': {
        'feat': 'Pomodoro timer improvements',
        'fix': 'Timer accuracy fixes',
    },
    'auth': {
        'feat': 'Login and profile features',
        'fix': 'Authentication fixes',
    },
    'settings': {
        'feat': 'Settings panel improvements',
        'fix': 'Settings persistence fixes',
    },
    'pages': {
        'feat': 'Page redesigns',
        'style': 'Page layout improvements',
    },
    'gamification': {
        'feat': 'Achievements and leaderboard',
        'fix': 'Gamification fixes',
    },
    'notifications': {
        'feat': 'Smart notifications',
        'fix': 'Notification fixes',
    },
    'offline': {
        'feat': 'Offline support improvements',
        'fix': 'Offline mode fixes',
    },
    'tasks': {
        'feat': 'Task management improvements',
        'fix': 'Task persistence fixes',
    },
}

const TYPE_LABELS = {
    'feat': 'New',
    'fix': 'Fixed',
    'style': 'Updated',
    'refactor': 'Improved',
    'perf': 'Faster',
}

function toUserFriendly(message) {
    const match = message.match(PREFIX_RE)
    if (!match) return message

    const [, type, scopeRaw] = match
    const scope = scopeRaw?.replace(/[()]/g, '').toLowerCase()
    const rest = message.slice(match[0].length).trim()

    if (scope && TRANSLATIONS[scope]?.[type]) {
        return TRANSLATIONS[scope][type]
    }

    const label = TYPE_LABELS[type] || type
    const scopeLabel = scope ? ` (${scope})` : ''

    const cleaned = rest
        .replace(/^(implement|add|update|support|enable|disable|remove|merge)\s+/i, '')
        .replace(/ and /g, ' & ')
        .trim()

    const final = cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
    return `${label}${scopeLabel}: ${final}`
}

try {
    const packageJson = JSON.parse(
        fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8')
    )

    let commit = 'local'

    try {
        commit = execSync('git rev-parse --short HEAD').toString().trim()
    } catch { }

    let changelog = []

    try {
        const gitLog = execSync('git log -5 --pretty=format:"%s" --no-merges')
            .toString()
            .trim()

        changelog = gitLog.split('\n').filter(Boolean).map(toUserFriendly)
    } catch { }

    const versionData = {
        version: `${packageJson.version}-${commit}`,
        appVersion: packageJson.version,
        build: commit,
        date: new Date().toISOString(),
        changelog,
        targetUrl: '/',
    }

    fs.writeFileSync(
        path.join(__dirname, '../public/version.json'),
        JSON.stringify(versionData, null, 2)
    )

    console.log(`Ataraxia version: ${versionData.version}`)
} catch (error) {
    console.error(error.message)
    process.exit(1)
}