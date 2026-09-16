# Consumo de Cookies Seguras en Ataraxia API

## ¿Qué son las Cookies HttpOnly Secure?

Las cookies son pequeños datos que el servidor envía al navegador. Las cookies de Ataraxia tienen tres atributos de seguridad:

| Atributo | Qué hace | Por qué es necesario |
|----------|----------|---------------------|
| `HttpOnly` | JavaScript no puede leerla (`document.cookie` la oculta) | Previene que scripts maliciosos (XSS) roben el token |
| `Secure` | Solo se envía por HTTPS | Evita que se transmita en texto plano por HTTP |
| `SameSite=Lax` | No se envía en requests cross-origin | Previene ataques CSRF |

## Cómo el Backend Envía la Cookie

Cuando haces login, el backend responde con:

```
HTTP/1.1 200 OK
Set-Cookie: refresh_token=abc123...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
Content-Type: application/json

{
  "access_token": "urLhbGciOiJIU3I5NiJ9...",
  "refresh_token": "abc123...",
  "user": { ... }
}
```

El navegador guarda la cookie automáticamente. JavaScript no puede verla.

## Cómo el Frontend Consuma la Cookie

### En Producción (HTTPS)

El flujo funciona automáticamente:

1. **Login**: El navegador recibe `Set-Cookie` y la almacena.
2. **Requests**: El navegador envía la cookie automáticamente en cada request al mismo dominio.
3. **Refresh**: Al llamar `POST /auth/refresh`, el navegador envía la cookie sin que el frontend haga nada.

```javascript
// El frontend solo envía el access token manualmente
const response = await fetch('/api/v1/tasks', {
  headers: {
    'Authorization': `Bearer ${accessToken}`  // Access token manual
  }
  // La cookie refresh_token se envía automáticamente
});
```

### El Backend Acepta Dos Fuentes

El filtro `JwtAuthenticationFilter` busca el token en:

```java
private String extractJwt(HttpServletRequest request) {
    // Fuente 1: Header Authorization
    String auth = request.getHeader("Authorization");
    if (auth != null && auth.startsWith("Bearer ")) {
        return auth.substring(7);
    }
    
    // Fuente 2: Cookie access_token
    for (Cookie cookie : request.getCookies()) {
        if ("access_token".equals(cookie.getName())) {
            return cookie.getValue();
        }
    }
    return null;
}
```

Y para el refresh token, el backend busca en:

```java
// Prioridad 1: Body
if (request.getRefreshToken() != null) return request.getRefreshToken();

// Prioridad 2: Header
if (authorization.startsWith("Bearer ")) return authorization.substring(7);

// Prioridad 3: Cookie
for (var cookie : servletRequest.getCookies()) {
    if ("refresh_token".equals(cookie.getName())) return cookie.getValue();
}
```

## Por qué No Funciona en Desarrollo (HTTP)

El problema es que `Secure=true` impide el envío por HTTP:

```
Frontend:  http://127.0.0.1:5173   (HTTP)
Backend:   https://ataraxia-api... (HTTPS)
```

1. El backend envía `Set-Cookie` con `Secure`
2. El frontend es HTTP → el navegador **no envía** la cookie
3. Resultado: La cookie nunca llega al backend

## Solución Actual: Sistema Híbrido

Mientras el backend no cambie `Secure=false` para desarrollo:

- **Refresh token**: Se guarda en localStorage (viene en el body JSON)
- **Access token**: Se guarda en localStorage (viene en el body JSON)
- **Cookie httpOnly**: Se recibe pero no se usa en HTTP

En **producción** (HTTPS), la cookie funcionará automáticamente y se podrá eliminar localStorage.

## Configuración de Vite: Desarrollo vs Producción

| | Desarrollo | Producción |
|---|---|---|
| **Vite proxy** | Necesario (evita cross-origin) | No necesario |
| **Vite dev server** | `http://localhost:5173` | No existe (se sirve `dist/`) |
| **Cookies Secure** | No funcionan (HTTP) | Sí funcionan (HTTPS) |
| **SameSite** | No funcionan (cross-origin) | Sí funcionan (same-origin) |
| **VITE_API_URL** | `/api/v1` (proxy local) | `https://ataraxia-api.../api/v1` |

### Desarrollo

```javascript
// vite.config.js
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://example.com',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
```

```bash
# .env.development
VITE_API_URL=/api/v1
```

Las requests van a `http://localhost:5173/api/...` → proxy reenvía al backend.

### Producción

```javascript
// vite.config.js (sin proxy)
export default defineConfig({
  build: {
    outDir: 'dist'
  }
})
```

```bash
# .env.production
VITE_API_URL=http://example.com/api/...
```

El frontend se sirve desde el mismo dominio del backend (o con CORS), así que las cookies se envían automáticamente.

## Flujo en Producción

```
┌─────────────┐                    ┌─────────────┐
│   Frontend  │                    │   Backend   │
└──────┬──────┘                    └──────┬──────┘
       │  POST /auth/login                │
       │  { email, password }             │
       │─────────────────────────────────>│
       │                                  │
       │  200 OK                          │
       │  Set-Cookie: refresh_token=...   │
       │  { access_token, user }          │
       │<─────────────────────────────────│
       │                                  │
       │  GET /api/v1/tasks               │
       │  Authorization: Bearer xxx       │
       │  Cookie: refresh_token=...       │
       │─────────────────────────────────>│
       │                                  │
       │  POST /auth/refresh              │
       │  Cookie: refresh_token=...       │
       │─────────────────────────────────>│
       │                                  │
       │  200 OK                          │
       │  Set-Cookie: refresh_token=...   │
       │  { access_token }                │
       │<─────────────────────────────────│
```

## Resumen

| Entorno | Refresh Token | Access Token |
|---------|---------------|--------------|
| Desarrollo (HTTP) | localStorage | localStorage |
| Producción (HTTPS) | Cookie httpOnly | Memoria/Redux |
