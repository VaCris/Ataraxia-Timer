import React, { useEffect, useState, useRef } from 'react';
import { X, Trophy } from 'lucide-react';

import bgImg from '../../assets/game/BG.png';
import pipeTopImg from '../../assets/game/toppipe.png';
import pipeBotImg from '../../assets/game/botpipe.png';
import g0 from '../../assets/game/ground/g0.png';
import g1 from '../../assets/game/ground/g1.png';
import bird0 from '../../assets/game/bird/b0.png';
import bird1 from '../../assets/game/bird/b1.png';
import bird2 from '../../assets/game/bird/b2.png';
import readyImg from '../../assets/game/getready.png';
import goImg from '../../assets/game/go.png';
import t0 from '../../assets/game/tap/t0.png';
import t1 from '../../assets/game/tap/t1.png';

import startSfx from '../../assets/game/sfx/start.wav';
import flapSfx from '../../assets/game/sfx/flap.wav';
import scoreSfx from '../../assets/game/sfx/score.wav';
import hitSfx from '../../assets/game/sfx/hit.wav';
import dieSfx from '../../assets/game/sfx/die.wav';

const FocusFlight = ({ onClose }) => {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('focus-flight-best')) || 0);
    const [gameState, setGameState] = useState('getReady');
    const requestRef = useRef();

    const canvasWidth = 276;
    const canvasHeight = 414;
    const RAD = Math.PI / 180;

    const assets = useRef({
        sprites: {
            bird: [new Image(), new Image(), new Image()],
            bg: new Image(),
            pipeTop: new Image(),
            pipeBot: new Image(),
            ground: [new Image(), new Image()],
            ready: new Image(),
            go: new Image(),
            tap: [new Image(), new Image()]
        },
        sfx: {
            start: new Audio(startSfx),
            flap: new Audio(flapSfx),
            score: new Audio(scoreSfx),
            hit: new Audio(hitSfx),
            die: new Audio(dieSfx)
        }
    });

    const bird = useRef({ x: 50, y: 150, radius: 12, gravity: 0.25, thrust: 4.5, velocity: 0, rotation: 0, frame: 0 });
    const pipes = useRef([]);
    const frames = useRef(0);
    const sfxPlayed = useRef(false);

    useEffect(() => {
        if (gameState === 'gameOver') {
            if (score > highScore) {
                setHighScore(score);
                localStorage.setItem('focus-flight-best', score.toString());
            }
        }
    }, [gameState, score, highScore]);

    useEffect(() => {
        assets.current.sprites.bg.src = bgImg;
        assets.current.sprites.pipeTop.src = pipeTopImg;
        assets.current.sprites.pipeBot.src = pipeBotImg;
        assets.current.sprites.ground[0].src = g0;
        assets.current.sprites.ground[1].src = g1;
        assets.current.sprites.bird[0].src = bird0;
        assets.current.sprites.bird[1].src = bird1;
        assets.current.sprites.bird[2].src = bird2;
        assets.current.sprites.ready.src = readyImg;
        assets.current.sprites.go.src = goImg;
        assets.current.sprites.tap[0].src = t0;
        assets.current.sprites.tap[1].src = t1;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const update = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);
            frames.current++;

            if (gameState === 'play') {
                if (frames.current % 5 === 0) bird.current.frame = (bird.current.frame + 1) % 3;
                bird.current.velocity += bird.current.gravity;
                bird.current.y += bird.current.velocity;

                bird.current.rotation = bird.current.velocity <= 0
                    ? Math.max(-25, (-25 * bird.current.velocity) / -4.5)
                    : Math.min(90, (90 * bird.current.velocity) / 9);

                if (frames.current % 100 === 0) {
                    pipes.current.push({ x: canvasWidth, y: -210 * Math.min(Math.random() + 1, 1.8), gap: 85, passed: false });
                }

                pipes.current.forEach((p, i) => {
                    p.x -= 2;
                    if (bird.current.x + 12 > p.x && bird.current.x - 12 < p.x + 52) {
                        if (bird.current.y - 12 < p.y + 400 || bird.current.y + 12 > p.y + 400 + 85) {
                            assets.current.sfx.hit.play();
                            setGameState('gameOver');
                        }
                    }
                    if (!p.passed && p.x + 52 < bird.current.x) {
                        p.passed = true;
                        setScore(s => s + 1);
                        assets.current.sfx.score.play();
                    }
                    if (p.x + 52 < 0) pipes.current.splice(i, 1);
                });

                if (bird.current.y + 12 >= canvasHeight - 50) {
                    if (!sfxPlayed.current) {
                        assets.current.sfx.die.play();
                        sfxPlayed.current = true;
                    }
                    setGameState('gameOver');
                }
            }

            draw(ctx);
            requestRef.current = requestAnimationFrame(update);
        };

        const draw = (ctx) => {
            ctx.drawImage(assets.current.sprites.bg, 0, canvasHeight - assets.current.sprites.bg.height);

            pipes.current.forEach(p => {
                ctx.drawImage(assets.current.sprites.pipeTop, p.x, p.y);
                ctx.drawImage(assets.current.sprites.pipeBot, p.x, p.y + 400 + 85);
            });

            const gFrame = Math.floor(frames.current / 10) % 2;
            const groundSprite = assets.current.sprites.ground[gFrame];
            ctx.drawImage(groundSprite, 0, canvasHeight - groundSprite.height);

            ctx.save();
            ctx.translate(bird.current.x, bird.current.y);
            ctx.rotate(bird.current.rotation * RAD);
            const bSprite = assets.current.sprites.bird[bird.current.frame];
            if (bSprite.complete) {
                ctx.drawImage(bSprite, -bSprite.width / 2, -bSprite.height / 2);
            }
            ctx.restore();

            if (gameState === 'getReady' || gameState === 'gameOver') {
                const tapFrame = Math.floor(frames.current / 15) % 2;
                const tapSprite = assets.current.sprites.tap[tapFrame];
                if (tapSprite.complete) {
                    ctx.drawImage(tapSprite, canvasWidth / 2 - tapSprite.width / 2, canvasHeight / 2 + 50);
                }
            }

            ctx.fillStyle = "white"; ctx.strokeStyle = "black"; ctx.lineWidth = 2;
            ctx.font = "35px Squada One"; ctx.textAlign = "center";
            ctx.fillText(score, canvasWidth / 2, 50); ctx.strokeText(score, canvasWidth / 2, 50);
        };

        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [gameState, score, highScore]);

    const handleInteraction = (e) => {
        if (e) e.preventDefault();
        if (gameState === 'getReady') {
            assets.current.sfx.start.play();
            setGameState('play');
            bird.current.velocity = -4.5;
        } else if (gameState === 'play') {
            assets.current.sfx.flap.play();
            bird.current.velocity = -4.5;
        } else if (gameState === 'gameOver') {
            bird.current.y = 150; bird.current.velocity = 0; bird.current.rotation = 0;
            pipes.current = []; frames.current = 0; sfxPlayed.current = false;
            setScore(0); setGameState('getReady');
        }
    };

    return (
        <div className="game-modal" onMouseDown={handleInteraction} onTouchStart={handleInteraction}>
            <div className="game-container" onMouseDown={e => e.stopPropagation()}>
                <div className="game-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Trophy size={16} /> <span>BEST: {highScore}</span>
                    </div>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>
                <div className="canvas-wrapper">
                    <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                    {gameState === 'getReady' && (
                        <div className="game-overlay">
                            <img src={readyImg} alt="Get Ready" style={{ width: '160px' }} />
                        </div>
                    )}
                    {gameState === 'gameOver' && (
                        <div className="game-overlay" style={{ background: 'rgba(0,0,0,0.5)' }}>
                            <img src={goImg} alt="Game Over" style={{ width: '160px' }} />
                            <button className="restart-btn" onClick={handleInteraction}>RESTART</button>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .game-modal { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 10000; }
                .game-container { background: #0a0a0a; border: 1px solid #8b5cf6; border-radius: 20px; width: 276px; overflow: hidden; }
                .game-header { padding: 10px 15px; display: flex; justify-content: space-between; align-items: center; color: #8b5cf6; }
                .close-btn { background: none; border: none; color: #666; cursor: pointer; }
                .canvas-wrapper { position: relative; cursor: pointer; width: 276px; height: 414px; background: #30c0df; }
                .game-overlay { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; }
                .restart-btn { pointer-events: auto; margin-top: 20px; padding: 10px 20px; background: #8b5cf6; color: white; border: none; border-radius: 20px; font-weight: bold; cursor: pointer; }
            `}</style>
        </div>
    );
};

export default FocusFlight;