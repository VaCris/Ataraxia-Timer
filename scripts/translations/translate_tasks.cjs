const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.tasks = {
  missionLog: "Bitácora de Misión",
  nextObjective: "¿Cuál es el siguiente objetivo?",
  estPomos: "Pomos Est.",
  general: "General"
};

en.tasks = {
  missionLog: "Mission Log",
  nextObjective: "What's the next objective?",
  estPomos: "Est. Pomos",
  general: "General"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
