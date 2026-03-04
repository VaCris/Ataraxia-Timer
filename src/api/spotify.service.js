const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
const SCOPES = import.meta.env.VITE_SPOTIFY_SCOPES;

const BRIDGE_URL = 'https://spotify-bridge.chowdero304.workers.dev/';

const TOKEN_ENDPOINT = "https://accounts.spotify.com/api/token";
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const PROFILE_ENDPOINT = "https://api.spotify.com/v1/me";

export const loginWithSpotify = () => {
    const params = new URLSearchParams({
        client_id: CLIENT_ID,
        response_type: "code",
        redirect_uri: REDIRECT_URI,
        scope: SCOPES,
        show_dialog: "true"
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

export const getAccessToken = async (code) => {
    try {
        const res = await fetch(BRIDGE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code })
        });

        const data = await res.json();

        if (data.access_token) {
            localStorage.setItem("spotify_access_token", data.access_token);
            if (data.refresh_token) {
                localStorage.setItem("spotify_refresh_token", data.refresh_token);
            }
            return data.access_token;
        }
        throw new Error("No access token returned");
    } catch (error) {
        console.error("Error en intercambio:", error);
        throw error;
    }
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("spotify_refresh_token");
    if (!refreshToken) return null;

    try {
        const res = await fetch(BRIDGE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                refresh_token: refreshToken,
                grant_type: 'refresh_token'
            })
        });

        const data = await res.json();

        if (data.access_token) {
            localStorage.setItem("spotify_access_token", data.access_token);
            if (data.refresh_token) {
                localStorage.setItem("spotify_refresh_token", data.refresh_token);
            }
            return data.access_token;
        }
    } catch (error) {
        console.error("Error al refrescar:", error);
    }
    return null;
};

export const getSpotifyProfile = async () => {
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return null;

    try {
        const res = await fetch(PROFILE_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (res.status === 401) {
            const newToken = await refreshAccessToken();
            if (!newToken) return null;

            const retryRes = await fetch(PROFILE_ENDPOINT, {
                headers: { Authorization: `Bearer ${newToken}` }
            });
            return await retryRes.json();
        }

        if (!res.ok) throw new Error("Error fetching profile");

        return await res.json();
    } catch (error) {
        console.error("Spotify Profile Error:", error);
        return null;
    }
};

export const spotifyService = {
    loginWithSpotify,
    getAccessToken,
    getSpotifyProfile,
    refreshAccessToken
};