import { useState, useEffect, useCallback } from 'react';

export const useSpotifyPlayer = (token) => {
    const [player, setPlayer] = useState(null);
    const [isPaused, setIsPaused] = useState(true);
    const [isActive, setIsActive] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [volume, setVolumeState] = useState(0.5);
    const [deviceId, setDeviceId] = useState(null);

    useEffect(() => {
        if (!token) return;

        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const newPlayer = new window.Spotify.Player({
                name: 'Ataraxia Web Player',
                getOAuthToken: cb => { cb(token); },
                volume: volume
            });

            newPlayer.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceId(device_id);
            });

            newPlayer.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });

            newPlayer.addListener('initialization_error', ({ message }) => console.error(message));
            newPlayer.addListener('authentication_error', ({ message }) => console.error(message));
            newPlayer.addListener('account_error', ({ message }) => console.error("Error de cuenta (Premium requerido):", message));

            newPlayer.addListener('player_state_changed', (state) => {
                if (!state) {
                    setIsActive(false);
                    return;
                }
                setCurrentTrack(state.track_window.current_track);
                setIsPaused(state.paused);

                newPlayer.getVolume().then(v => setVolumeState(v));

                newPlayer.getCurrentState().then(currentState => {
                    setIsActive(currentState !== null);
                });
            });

            newPlayer.connect();
            setPlayer(newPlayer);
        };

        return () => {
            if (player) player.disconnect();
        };
    }, [token]);

    const togglePlay = useCallback(() => {
        if (player) player.togglePlay();
    }, [player]);

    const setVolume = useCallback((newVolume) => {
        if (player) player.setVolume(newVolume);
    }, [player]);

    const playTrack = useCallback((spotifyUri) => {
        if (!deviceId || !token) return;

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotifyUri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).catch(err => console.error("Error playTrack:", err));
    }, [deviceId, token]);

    const playContext = useCallback((spotifyUri) => {
        if (!deviceId || !token) return;

        fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
            method: 'PUT',
            body: JSON.stringify({ context_uri: spotifyUri }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        }).catch(err => console.error("Error playContext:", err));
    }, [deviceId, token]);

    return {
        player,
        isPaused,
        isActive,
        currentTrack,
        volume,
        togglePlay,
        setVolume,
        playTrack,
        playContext,
        deviceId
    };
};