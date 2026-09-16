const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.tags = {
  selectCategory: "Seleccionar Categoría",
  noCategory: "Sin Categoría",
  deleteConfirm: "¿Seguro que quieres eliminar esta etiqueta?"
};

en.tags = {
  selectCategory: "Select Category",
  noCategory: "No Category",
  deleteConfirm: "Are you sure you want to delete this tag?"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
