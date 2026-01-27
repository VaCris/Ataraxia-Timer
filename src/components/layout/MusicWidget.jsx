import React, { useState, useEffect } from 'react';
import { X, ArrowRight, Link, Music, RotateCcw, LogIn, Check, Sparkles, User, Bookmark, Trash2, Play, AlertCircle } from 'lucide-react';
import { loginWithSpotify, getSpotifyProfile, refreshAccessToken } from '../../api/spotify.service';
import { useSpotifyPlayer } from '../../hooks/useSpotifyPlayer';
import SpotifyPlayerUI from '../spotify/SpotifyPlayerUI';
import { useMusic } from '../../context/music-context';

const MusicWidget = () => {
    const {
        isModalOpen: isOpen,
        closeModal: onClose,
        updateTrackInfo,
        playlistUrl: url,
        setPlaylistUrl: onUrlChange
    } = useMusic();

    const [inputValue, setInputValue] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [spotifyToken, setSpotifyToken] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isSpotifyContent, setIsSpotifyContent] = useState(false);

    const [savedPlaylists, setSavedPlaylists] = useState(() => {
        const saved = localStorage.getItem('dw-saved-playlists');
        return saved ? JSON.parse(saved) : [];
    });

    const spotifyPlayer = useSpotifyPlayer(spotifyToken);
    const { currentTrack, isPaused, togglePlay, volume, setVolume, playContext, playTrack, deviceId } = spotifyPlayer;

    useEffect(() => {
        if (currentTrack) {
            const artist = currentTrack.artists ? currentTrack.artists[0].name : '';
            updateTrackInfo({
                title: currentTrack.name,
                artist: artist,
                isPlaying: !isPaused
            });
        } else if (inputValue && !showInput && !isSpotifyContent) {
            updateTrackInfo({
                title: "External Source",
                artist: "Playing...",
                isPlaying: true
            });
        } else {
            updateTrackInfo(null);
        }
    }, [currentTrack, isPaused, inputValue, showInput, isSpotifyContent, updateTrackInfo]);

    useEffect(() => {
        localStorage.setItem('dw-saved-playlists', JSON.stringify(savedPlaylists));
    }, [savedPlaylists]);

    useEffect(() => {
        if (url) setInputValue(url);

        const embedUrl = getEmbedUrl(url);
        const isSpotify = url?.includes('spotify');
        setIsSpotifyContent(isSpotify);

        if (!inputValue && !url) setShowInput(true);

        const token = localStorage.getItem('spotify_access_token');
        setSpotifyToken(token);

        if (token && !userProfile) {
            getSpotifyProfile().then(profile => {
                if (profile) setUserProfile(profile);
            });
        }
    }, [url]);

    useEffect(() => {
        const handleTokenUpdate = () => {
            const token = localStorage.getItem('spotify_access_token');
            setSpotifyToken(token);
        };
        window.addEventListener('spotify-token-updated', handleTokenUpdate);
        return () => window.removeEventListener('spotify-token-updated', handleTokenUpdate);
    }, []);

    useEffect(() => {
        if (!spotifyToken) return;
        const intervalId = setInterval(() => { refreshAccessToken(); }, 45 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, [spotifyToken]);

    const handleSpotifyLogin = () => loginWithSpotify();

    const getEmbedUrl = (inputUrl) => {
        if (!inputUrl) return null;
        try {
            const spotifyMatch = inputUrl.match(/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
            if (spotifyMatch) {
                const [, type, id] = spotifyMatch;
                return `https://open.spotify.com/embed/${type}/${id}`;
            }

            const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
            const ytMatch = inputUrl.match(ytRegex);

            if (ytMatch && ytMatch[1]) {
                const videoId = ytMatch[1];
                const origin = window.location.origin;
                return `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&origin=${origin}`;
            }

            if (inputUrl.includes('soundcloud.com')) {
                return `https://w.soundcloud.com/player/?url=${encodeURIComponent(inputUrl)}&auto_play=false`;
            }

            return null;
        } catch {
            return null;
        }
    };

    const identifyPlatform = (link) => {
        if (link.includes('spotify')) return { name: 'Spotify', color: '#1db954' };
        if (link.includes('youtu')) return { name: 'YouTube', color: '#ff0000' };
        if (link.includes('soundcloud')) return { name: 'SoundCloud', color: '#ff7700' };
        return { name: 'Link', color: '#ffffff' };
    };

    const saveCurrentPlaylist = () => {
        if (!inputValue || savedPlaylists.some(p => p.url === inputValue)) return;
        const platform = identifyPlatform(inputValue);
        setSavedPlaylists([...savedPlaylists, {
            id: Date.now(), url: inputValue,
            platform: platform.name, color: platform.color,
            date: new Date().toLocaleDateString()
        }]);
    };

    const removePlaylist = (id, e) => {
        e.stopPropagation();
        setSavedPlaylists(savedPlaylists.filter(p => p.id !== id));
    };

    const loadSavedPlaylist = (u) => { setInputValue(u); handleLoad(u); };

    const handleLoad = (u = inputValue) => {
        if (!u) return;
        const sMatch = u.match(/open\.spotify\.com\/(track|album|playlist|artist)\/([a-zA-Z0-9]+)/);
        let newSpotify = false;
        if (sMatch && spotifyToken && deviceId) {
            const uri = `spotify:${sMatch[1]}:${sMatch[2]}`;
            sMatch[1] === 'track' ? playTrack(uri) : playContext(uri);
            newSpotify = true;
        } else { newSpotify = u.includes('spotify'); }

        setIsSpotifyContent(newSpotify);
        setIsAnimating(true);
        setTimeout(() => { onUrlChange(u); setShowInput(false); setIsAnimating(false); }, 400);
    };

    const handleReset = () => {
        setIsAnimating(true);
        setTimeout(() => { setShowInput(true); setIsAnimating(false); }, 400);
    };

    const embedUrl = getEmbedUrl(inputValue);
    const isFormMode = showInput || (!embedUrl && !isSpotifyContent);
    const profileImage = userProfile?.images?.[0]?.url;

    return (
        <div className={`music-widget-container ${isOpen ? 'widget-open' : 'widget-closed'}`}>
            <div className="music-header">
                <div className="music-title">
                    <div className="icon-glow"><Music size={16} color="white" /></div>
                    <span>Musique</span>
                </div>
                <div className="music-controls">
                    {!isFormMode && <button onClick={handleReset} className="control-btn"><RotateCcw size={16} /></button>}
                    <button onClick={onClose} className="control-btn close"><X size={18} /></button>
                </div>
            </div>

            <div className="music-content">
                <div className={`view-slider ${isFormMode && !isAnimating ? 'slide-in' : 'slide-out'}`}>
                    <div className="input-view">
                        <div className="hero-section">
                            <div className="link-circle"><Link size={24} color="white" /></div>
                            <h3>Play Anything</h3>
                            <p>Paste a link from your favorite platform.</p>
                        </div>

                        <div className="input-group">
                            <input value={inputValue} onChange={e => setInputValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLoad()} placeholder="Paste Link..." autoFocus />
                            <button onClick={saveCurrentPlaylist} disabled={!inputValue} className="action-btn save"><Bookmark size={18} /></button>
                            <button onClick={() => handleLoad()} disabled={!inputValue} className="action-btn play active"><ArrowRight size={18} /></button>
                        </div>

                        <div className="youtube-hint">
                            <AlertCircle size={15} className="hint-icon" />
                            <div className="hint-text">
                                <span>Official <b>YouTube</b> videos may be blocked.</span>
                                <span className="hint-sub">Try <b>Lo-Fi</b>, <b>Covers</b> or <b>Lyric Videos</b>.</span>
                            </div>
                        </div>

                        {savedPlaylists.length > 0 && (
                            <div className="saved-list">
                                <span className="list-title">Your Library</span>
                                <div className="list-scroll">
                                    {savedPlaylists.map((item) => (
                                        <div key={item.id} className="saved-item" onClick={() => loadSavedPlaylist(item.url)}>
                                            <div className="item-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}><Play size={10} fill={item.color} /></div>
                                            <div className="item-info"><span className="item-platform">{item.platform}</span><span className="item-date">{item.date}</span></div>
                                            <button className="delete-btn" onClick={(e) => removePlaylist(item.id, e)}><Trash2 size={14} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="spotify-card">
                            {!spotifyToken ? (
                                <div className="spotify-content">
                                    <div className="spotify-icon-bg"><LogIn size={16} color="#1db954" /></div>
                                    <div className="spotify-text"><span className="spotify-title">Connect Spotify</span><span className="spotify-desc">Unlock controls</span></div>
                                    <button onClick={handleSpotifyLogin} className="btn-connect">Connect</button>
                                </div>
                            ) : (
                                <div className="spotify-content connected">
                                    <div className="spotify-profile-wrapper">
                                        {profileImage ? <img src={profileImage} alt="Profile" className="profile-avatar" /> : <div className="profile-avatar-placeholder"><User size={16} /></div>}
                                        <div className="online-badge"><Check size={10} color="white" /></div>
                                    </div>
                                    <div className="spotify-text"><span className="spotify-title">{userProfile?.display_name}</span><span className="spotify-desc">Connected</span></div>
                                    <Sparkles size={16} className="sparkle-icon" color="#1db954" />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="player-view">
                        {isSpotifyContent && spotifyToken && deviceId ? (
                            <SpotifyPlayerUI
                                currentTrack={currentTrack} isPaused={isPaused} togglePlay={togglePlay} volume={volume} setVolume={setVolume}
                            />
                        ) : embedUrl ? (
                            <iframe
                                src={embedUrl} width="100%" height={embedUrl.includes('spotify') ? '152' : '220'} frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin" allowFullScreen
                                style={{ borderRadius: '16px', background: '#000' }}
                            />
                        ) : null}
                    </div>
                </div>
            </div>

            <style>{`
                .music-widget-container {
                    position: fixed; bottom: 90px; left: 2rem; width: 420px;
                    background: rgba(30, 30, 35, 0.75);
                    backdrop-filter: blur(24px) saturate(180%);
                    -webkit-backdrop-filter: blur(24px) saturate(180%);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    overflow: hidden;
                    z-index: 50;
                    transform-origin: bottom left;
                    transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .widget-open { opacity: 1; transform: scale(1) translateY(0); pointer-events: auto; visibility: visible; }
                .widget-closed { opacity: 0; transform: scale(0.9) translateY(20px); pointer-events: none; visibility: hidden; }
                
                .music-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; background: linear-gradient(to bottom, rgba(255,255,255,0.03), transparent); border-bottom: 1px solid rgba(255,255,255,0.05); }
                .music-title { display: flex; align-items: center; gap: 12px; font-weight: 600; color: #fff; }
                .icon-glow { width: 32px; height: 32px; background: linear-gradient(135deg, var(--primary-color, #8b5cf6), #6366f1); border-radius: 10px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(139, 92, 246, 0.3); }
                .music-controls { display: flex; gap: 10px; }
                .control-btn { background: rgba(255,255,255,0.05); border: none; color: rgba(255,255,255,0.6); width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .control-btn:hover { background: rgba(255,255,255,0.15); color: #fff; }
                .control-btn.close:hover { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
                .music-content { position: relative; min-height: 220px; }
                .view-slider { display: grid; grid-template-areas: "stack"; width: 100%; }
                .input-view, .player-view { grid-area: stack; transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
                .slide-in .input-view { opacity: 1; transform: scale(1); pointer-events: all; filter: blur(0); }
                .slide-in .player-view { opacity: 0; transform: scale(0.95); pointer-events: none; filter: blur(10px); }
                .slide-out .input-view { opacity: 0; transform: scale(1.05); pointer-events: none; filter: blur(10px); visibility: hidden; }
                .slide-out .player-view { opacity: 1; transform: scale(1); pointer-events: all; filter: blur(0); }
                .input-view { padding: 28px; display: flex; flex-direction: column; gap: 20px; }
                .hero-section { text-align: center; margin-bottom: 2px; }
                .link-circle { width: 54px; height: 54px; margin: 0 auto 12px; background: rgba(255,255,255,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,0.1); }
                .hero-section h3 { margin: 0 0 6px; color: white; font-size: 1.2rem; font-weight: 600; }
                .hero-section p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.9rem; }
                .input-group { position: relative; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 6px; display: flex; gap: 6px; transition: border-color 0.2s, background 0.2s; }
                .input-group:focus-within { border-color: var(--primary-color, #8b5cf6); background: rgba(0,0,0,0.4); box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2); }
                .input-group input { flex: 1; background: transparent; border: none; color: white; padding: 10px 12px; font-size: 0.95rem; outline: none; min-width: 0; }
                .action-btn { width: 40px; border-radius: 12px; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
                .action-btn.save { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.6); }
                .action-btn.save:hover:not(:disabled) { background: rgba(255,255,255,0.1); color: #fff; }
                .action-btn.play { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); cursor: not-allowed; }
                .action-btn.play.active { background: var(--primary-color, #8b5cf6); color: white; cursor: pointer; box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4); }
                .action-btn.play.active:hover { transform: scale(1.05); }
                
                .youtube-hint {
                    background: rgba(255, 160, 0, 0.08);
                    border: 1px solid rgba(255, 160, 0, 0.15);
                    border-radius: 12px;
                    padding: 10px 14px;
                    display: flex;
                    gap: 12px;
                    align-items: center;
                    margin-top: -8px;
                }
                .hint-icon { color: #ffa000; flex-shrink: 0; }
                .hint-text { display: flex; flex-direction: column; font-size: 0.8rem; line-height: 1.3; }
                .hint-text span:first-child { color: #ffca80; font-weight: 500; }
                .hint-sub { color: rgba(255, 255, 255, 0.5); font-size: 0.75rem; }
                .hint-sub b { color: rgba(255, 255, 255, 0.8); font-weight: 500; }

                .saved-list { display: flex; flex-direction: column; gap: 8px; margin-top: 4px; }
                .list-title { font-size: 0.75rem; font-weight: 600; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.5px; margin-left: 4px; }
                .list-scroll { max-height: 120px; overflow-y: auto; padding-right: 4px; display: flex; flex-direction: column; gap: 6px; }
                .list-scroll::-webkit-scrollbar { width: 4px; }
                .list-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                .saved-item { display: flex; align-items: center; gap: 12px; padding: 8px 10px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: all 0.2s; }
                .saved-item:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.1); transform: translateX(2px); }
                .item-icon { width: 28px; height: 28px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }
                .item-info { flex: 1; display: flex; flex-direction: column; }
                .item-platform { font-size: 0.85rem; font-weight: 500; color: white; }
                .item-date { font-size: 0.7rem; color: rgba(255,255,255,0.4); }
                .delete-btn { background: transparent; border: none; color: rgba(255,255,255,0.2); padding: 6px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
                .delete-btn:hover { background: rgba(239, 68, 68, 0.2); color: #fca5a5; }
                .spotify-card { background: rgba(29, 185, 84, 0.08); border: 1px solid rgba(29, 185, 84, 0.15); border-radius: 18px; padding: 16px 20px; transition: transform 0.2s ease, background 0.2s; }
                .spotify-content { display: flex; align-items: center; gap: 16px; }
                .spotify-icon-bg { width: 42px; height: 42px; background: rgba(29, 185, 84, 0.15); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
                .spotify-profile-wrapper { position: relative; width: 48px; height: 48px; }
                .profile-avatar { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; border: 2px solid rgba(255,255,255,0.1); }
                .profile-avatar-placeholder { width: 100%; height: 100%; border-radius: 50%; background: linear-gradient(135deg, #1db954, #1ed760); display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; font-size: 1rem; border: 2px solid rgba(255,255,255,0.1); }
                .online-badge { position: absolute; bottom: 0; right: 0; width: 16px; height: 16px; background: #1db954; border: 3px solid #252525; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
                .spotify-text { flex: 1; display: flex; flex-direction: column; gap: 4px; overflow: hidden; }
                .spotify-title { font-size: 0.95rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
                .spotify-desc { font-size: 0.8rem; color: rgba(255,255,255,0.6); }
                .btn-connect { background: #1db954; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: transform 0.2s, background 0.2s; }
                .btn-connect:hover { background: #1ed760; transform: scale(1.03); }
                .player-view { padding: 0; display: flex; align-items: center; justify-content: center; }
            `}</style>
        </div>
    );
};

export default MusicWidget;