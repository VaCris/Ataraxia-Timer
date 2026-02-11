const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const BASE_URL = window.location.origin.includes('localhost')
    ? 'http://127.0.0.1:5173'
    : window.location.origin;
const REDIRECT_URI = `${BASE_URL}/callback`;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

const SCOPES = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-read-playback-state",
    "user-modify-playback-state"
];

function generateCodeVerifier() {
    const array = new Uint8Array(64);
    window.crypto.getRandomValues(array);
    return Array.from(array, b =>
        ('0' + b.toString(16)).slice(-2)
    ).join('');
}

async function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);

    return btoa(
        String.fromCharCode(...new Uint8Array(digest))
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export async function loginWithSpotify() {
    const verifier = generateCodeVerifier();
    localStorage.setItem("spotify_verifier", verifier);

    const challenge = await generateCodeChallenge(verifier);

    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES.join(" "),
        code_challenge_method: "S256",
        code_challenge: challenge
    });

    window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
}

export async function getAccessToken(code) {
    const verifier = localStorage.getItem("spotify_verifier");

    const body = new URLSearchParams({
        client_id: CLIENT_ID,
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        code_verifier: verifier
    });

    const res = await fetch(TOKEN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body
    });

    const data = await res.json();

    if (data.access_token) {
        localStorage.setItem("spotify_access_token", data.access_token);
        if (data.refresh_token) {
            localStorage.setItem("spotify_refresh_token", data.refresh_token);
        }
        return data.access_token;
    } else {
        throw new Error("No access token returned");
    }
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return null;

    try {
        const res = await fetch(TOKEN_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({
                client_id: CLIENT_ID,
                grant_type: "refresh_token",
                refresh_token: refreshToken
            })
        });

        const data = await res.json();

        if (data.access_token) {
            console.log("Token refrescado con éxito");
            localStorage.setItem("spotify_access_token", data.access_token);
            if (data.refresh_token) {
                localStorage.setItem("spotify_refresh_token", data.refresh_token);
            }
            return data.access_token;
        }
    } catch (error) {
        console.error("Error al refrescar token:", error);
    }
    return null;
}

export async function getSpotifyProfile() {
    let token = localStorage.getItem("spotify_access_token");
    if (!token) return null;

    try {
        let res = await fetch(PROFILE_ENDPOINT, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401) {
            console.warn("Token expirado. Intentando refrescar...");
            token = await refreshAccessToken();

            if (token) {
                window.dispatchEvent(new Event('spotify-token-updated'));
                res = await fetch(PROFILE_ENDPOINT, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                console.warn("No se pudo refrescar. Cerrando sesión.");
                localStorage.removeItem("spotify_access_token");
                localStorage.removeItem("spotify_refresh_token");
                return null;
            }
        }

        if (!res.ok) return null;
        return await res.json();

    } catch (error) {
        console.error("Error obteniendo perfil:", error);
        return null;
    }
}
export async function resumePlayer() {
    const token = localStorage.getItem("spotify_access_token");
    return fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function pausePlayer() {
    const token = localStorage.getItem("spotify_access_token");
    return fetch("https://api.spotify.com/v1/me/player/pause", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export const spotifyService = {
    loginWithSpotify,
    getAccessToken,
    getSpotifyProfile,
    refreshAccessToken,
    resume: resumePlayer,
    pause: pausePlayer
};