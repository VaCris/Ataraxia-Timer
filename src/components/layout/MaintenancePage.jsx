import React, { useState, useEffect } from 'react';
import { RefreshCw, Play, Settings } from 'lucide-react';
import FocusFlight from '../games/FocusFlight';

const MaintenancePage = () => {
    const [isRetrying, setIsRetrying] = useState(false);
    const [showGame, setShowGame] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'unset'; };
    }, []);

    const handleRetry = () => {
        setIsRetrying(true);
        setTimeout(() => { window.location.href = '/'; }, 1500);
    };

    return (
        <div className="maintenance-wrapper">
            <div className="bg-glow"></div>

            <div className="content-card">
                <div className="icon-container">
                    <Settings size={64} className="animate-spin-slow icon-purple" />
                    <div className="icon-shadow"></div>
                </div>

                <h1>Ataraxia is under maintenance</h1>
                <p>The server is currently offline. You can try to reconnect or enter the minigame.</p>

                <div className="button-group">
                    <button onClick={handleRetry} disabled={isRetrying} className="maint-btn primary">
                        <RefreshCw size={20} className={isRetrying ? 'animate-spin' : ''} />
                        Try Reconnect
                    </button>
                    <button onClick={() => setShowGame(true)} className="maint-btn secondary">
                        <Play size={20} fill="currentColor" />
                        Mini-Game
                    </button>
                </div>
            </div>

            {showGame && <FocusFlight onClose={() => setShowGame(false)} />}

            <style>{`
                .maintenance-wrapper {
                    height: 100vh;
                    width: 100vw;
                    background: #050505;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    zIndex: 9999;
                    text-align: center;
                    padding: 20px;
                    overflow: hidden;
                }

                .bg-glow {
                    position: absolute;
                    width: 40vw;
                    height: 40vw;
                    background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%);
                    border-radius: 50%;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                }

                .content-card {
                    position: relative;
                    z-index: 1;
                    max-width: 500px;
                    padding: 40px;
                    border-radius: 32px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(20px);
                }

                .icon-container {
                    position: relative;
                    margin-bottom: 30px;
                    display: inline-block;
                }

                .icon-purple {
                    color: #8b5cf6;
                    filter: drop-shadow(0 0 15px rgba(139, 92, 246, 0.5));
                }

                .icon-shadow {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 40px;
                    height: 40px;
                    background: #8b5cf6;
                    filter: blur(40px);
                    opacity: 0.4;
                    transform: translate(-50%, -50%);
                    z-index: -1;
                }

                h1 {
                    font-size: 1.8rem;
                    font-weight: 700;
                    margin-bottom: 16px;
                    letter-spacing: -0.02em;
                    background: linear-gradient(to bottom, #ffffff, #a1a1aa);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                p {
                    color: #a1a1aa;
                    line-height: 1.6;
                    font-size: 1rem;
                    margin-bottom: 0;
                }

                .button-group {
                    display: flex;
                    gap: 12px;
                    margin-top: 32px;
                    justify-content: center;
                }

                .maint-btn { 
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 28px; 
                    border-radius: 16px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255,255,255,0.1);
                }

                .primary {
                    background: #8b5cf6;
                    color: white;
                    border: none;
                    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25);
                }

                .primary:hover:not(:disabled) {
                    background: #7c3aed;
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.4);
                }

                .secondary {
                    background: rgba(255, 255, 255, 0.05);
                    color: white;
                    backdrop-filter: blur(10px);
                }

                .secondary:hover {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                    border-color: rgba(255, 255, 255, 0.2);
                }

                .maint-btn:active {
                    transform: translateY(0);
                }

                .animate-spin-slow { animation: spin 8s linear infinite; }
                .animate-spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .game-modal {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.95);
                    backdrop-filter: blur(15px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .game-container {
                    background: #0a0a0a;
                    border: 1px solid rgba(139, 92, 246, 0.3);
                    border-radius: 24px;
                    width: 340px;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                }
            `}</style>
        </div>
    );
};

export default MaintenancePage;