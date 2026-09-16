const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.stats = {
  insights: "Estadísticas",
  pomodoros: "Pomodoros",
  completed: "Completados",
  currentStreak: "Racha Actual",
  days: "Días",
  best: "Mejor",
  level: "Nivel",
  currentRank: "Rango actual",
  experience: "Experiencia",
  totalXp: "XP Total"
};

en.stats = {
  insights: "Insights",
  pomodoros: "Pomodoros",
  completed: "Completed",
  currentStreak: "Current Streak",
  days: "Days",
  best: "Best",
  level: "Level",
  currentRank: "Current rank",
  experience: "Experience",
  totalXp: "Total XP"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
