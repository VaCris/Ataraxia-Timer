const fs = require('fs');

const es = JSON.parse(fs.readFileSync('src/locales/es/translation.json', 'utf8'));
const en = JSON.parse(fs.readFileSync('src/locales/en/translation.json', 'utf8'));

es.profile = {
  loading: "Cargando perfil...",
  usernameShort: "El nombre de usuario es muy corto",
  invalidUrl: "URL de imagen inválida (usa https://)",
  updateSuccess: "Perfil actualizado correctamente",
  updateFailed: "No se pudo actualizar el perfil",
  deletePrompt: "Para eliminar tu cuenta, ingresa tu contraseña:",
  deleteFailed: "No se pudo eliminar la cuenta. ¿Contraseña incorrecta?",
  usernamePlaceholder: "Nombre de usuario",
  avatarPlaceholder: "URL de la imagen de avatar",
  level: "Nivel",
  logout: "Cerrar Sesión",
  deleteAccount: "Eliminar Cuenta"
};

en.profile = {
  loading: "Loading profile...",
  usernameShort: "Username too short",
  invalidUrl: "Invalid image URL (use https://)",
  updateSuccess: "Profile updated successfully",
  updateFailed: "Failed to update profile",
  deletePrompt: "To delete your account, please enter your password:",
  deleteFailed: "Failed to delete account. Incorrect password?",
  usernamePlaceholder: "Username",
  avatarPlaceholder: "Avatar Image URL",
  level: "Level",
  logout: "Logout",
  deleteAccount: "Delete Account"
};

fs.writeFileSync('src/locales/es/translation.json', JSON.stringify(es, null, 2));
fs.writeFileSync('src/locales/en/translation.json', JSON.stringify(en, null, 2));
