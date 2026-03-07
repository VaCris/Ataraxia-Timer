const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

try {
    const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    const newVersion = packageJson.version;

    const gitLog = execSync('git log -5 --pretty=format:"%s" --no-merges').toString().trim();
    const changelog = gitLog.split('\n').filter(line => line.length > 0);

    const versionData = {
        version: newVersion,
        date: new Date().toISOString().split('T')[0],
        changelog: changelog,
        targetUrl: "/"
    };

    fs.writeFileSync(
        path.join(__dirname, '../public/version.json'),
        JSON.stringify(versionData, null, 2)
    );

    console.log(`V${newVersion}`);
} catch (error) {
    console.error(error.message);
}