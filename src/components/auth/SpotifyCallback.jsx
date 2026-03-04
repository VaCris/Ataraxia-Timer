// src/components/auth/SpotifyCallback.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SpotifyCallback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 1. Extraer el código de la URL (?code=...)
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // 2. Llamar a tu Cloudflare Worker
            fetch('https://spotify-bridge.chowdero304.workers.dev/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code })
            })
                .then(res => {
                    if (!res.ok) throw new Error('Error en el puente');
                    return res.json();
                })
                .then(data => {
                    // 3. Guardar los tokens recibidos del Worker
                    localStorage.setItem('spotify_access_token', data.access_token);
                    if (data.refresh_token) {
                        localStorage.setItem('spotify_refresh_token', data.refresh_token);
                    }

                    window.dispatchEvent(new Event('spotify-token-updated'));
                    navigate('/');
                })
                .catch(err => {
                    console.error("Fallo en la conexión con el Worker:", err);
                    navigate('/');
                });
        }
    }, [navigate]);

    return (
        <div style={{
            height: '100vh',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontFamily: 'sans-serif',
            gap: '20px'
        }}>
            <div style={{
                width: '40px', height: '40px',
                border: '3px solid rgba(255,255,255,0.1)',
                borderTopColor: '#1db954',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }} />
            <h3 style={{ fontWeight: 400, opacity: 0.8 }}>Connecting to Spotify...</h3>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default SpotifyCallback;