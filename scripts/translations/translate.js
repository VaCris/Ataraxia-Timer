import fs from 'node:fs';

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.settings = {
  title: "Configuración",
  save: "Guardar Cambios",
  timer: "Temporizador",
  display: "Apariencia",
  audio: "Audio",
  shortcuts: "Atajos",
  focus: "Enfoque",
  shortBreak: "Descanso Corto",
  longBreak: "Descanso Largo",
  autoStartBreaks: "Auto-iniciar descansos",
  autoStartPomodoros: "Auto-iniciar Pomodoros",
  longBreakInterval: "Intervalo para descanso largo",
  theme: "Tema",
  dark: "Oscuro",
  light: "Claro",
  accentColor: "Color Principal",
  bgImage: "URL de Imagen de Fondo",
  blurIntensity: "Intensidad de Desenfoque",
  timeFormat: "Formato de hora",
  twentyFourHour: "24 horas",
  twelveHour: "12 horas",
  soundEnabled: "Sonido Activado",
  volume: "Volumen",
  reset: "Restaurar"
};

en.settings = {
  title: "Settings",
  save: "Save Changes",
  timer: "Timer",
  display: "Display",
  audio: "Audio",
  shortcuts: "Shortcuts",
  focus: "Focus",
  shortBreak: "Short Break",
  longBreak: "Long Break",
  autoStartBreaks: "Auto-start Breaks",
  autoStartPomodoros: "Auto-start Pomodoros",
  longBreakInterval: "Long Break Interval",
  theme: "Theme",
  dark: "Dark",
  light: "Light",
  accentColor: "Accent Color",
  bgImage: "Background Image URL",
  blurIntensity: "Blur Intensity",
  timeFormat: "Time Format",
  twentyFourHour: "24-hour",
  twelveHour: "12-hour",
  soundEnabled: "Sound Enabled",
  volume: "Volume",
  reset: "Reset"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
