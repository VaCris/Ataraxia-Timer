const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.stats.currentLevel = "Nivel Actual";
es.stats.xp = "Experiencia (XP)";
es.stats.focusStreak = "Racha de Enfoque";
es.stats.totalPomodoros = "Total Pomodoros";

en.stats.currentLevel = "Current Level";
en.stats.xp = "Experience (XP)";
en.stats.focusStreak = "Focus Streak";
en.stats.totalPomodoros = "Total Pomodoros";

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
