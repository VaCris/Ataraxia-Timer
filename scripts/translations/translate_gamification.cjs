const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.gamification = {
  achievements: "Logros",
  leaderboard: "Clasificación"
};

en.gamification = {
  achievements: "Achievements",
  leaderboard: "Leaderboard"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
