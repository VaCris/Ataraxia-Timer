const fs = require('fs')
const { execSync } = require('child_process')
const path = require('path')

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

        changelog = gitLog.split('\n').filter(Boolean)
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