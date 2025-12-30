import React, { useState, useEffect } from 'react';
import SimpleParallax from "simple-parallax-js";
import { ChevronDown, Globe } from 'lucide-react';
import background from '../../assets/photo-1416169607655-0c2b3ce2e1cc.avif'

const IntroScreen = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userTimeZone, setUserTimeZone] = useState('');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const cleanZone = zone.replace('_', ' ').split('/').pop();
      setUserTimeZone(cleanZone);
    } catch (e) {
      setUserTimeZone('Local Time');
    }

    return () => clearInterval(timer);
  }, []);

  const handleScroll = (e) => {
    if (e.target.scrollTop > 50) {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }
  };

  return (
    <div
      onScroll={handleScroll}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#050505',
        zIndex: 9999,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'transform 0.8s cubic-bezier(0.7, 0, 0.3, 1)',
        transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
      }}
    >
      <div style={{
        minHeight: '130vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}>

        <div style={{
          height: '100vh',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0 20px',
          boxSizing: 'border-box',
          transition: 'opacity 0.5s ease, transform 0.8s ease',
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(150px)'
        }}>

          <div style={{ marginBottom: 'clamp(1.5rem, 3vh, 2.5rem)' }}>
            <SimpleParallax orientation="up" scale={1.2} delay={.6} transition="cubic-bezier(0,0,0,1)">
              <img
                src={background}
                alt="Zenith Landscape"
                style={{
                  width: 'min(90vw, 400px)',
                  height: 'auto',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: '20px',
                  filter: 'brightness(0.6) contrast(1.1)',
                  boxShadow: '0 0 60px rgba(139, 92, 246, 0.25)',
                  display: 'block'
                }}
              />
            </SimpleParallax>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 800,
            margin: '0 0 0.5rem 0',
            background: 'linear-gradient(to right, #fff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textAlign: 'center',
            lineHeight: 1.1,
            letterSpacing: '-1px'
          }}>
            Zenith Timer
          </h1>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: 'clamp(1.5rem, 4vh, 3rem)',
            opacity: 0.8
          }}>
            <span style={{ color: '#71717a', fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', textTransform: 'uppercase', letterSpacing: '1px' }}>Created by</span>
            <span style={{
              color: 'var(--primary-purple, #8b5cf6)',
              fontWeight: 700,
              fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
              letterSpacing: '0.5px'
            }}>
              Studios TKOH!
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(255,255,255,0.03)',
            padding: '10px 20px',
            borderRadius: '50px',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: '5vh'
          }}>
            <Globe size={16} color="#a1a1aa" />
            <span style={{ color: '#e4e4e7', fontSize: '0.95rem', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            <span style={{ width: '1px', height: '14px', background: '#3f3f46' }}></span>
            <span style={{ color: '#a1a1aa', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              {userTimeZone}
            </span>
          </div>

          <div style={{
            position: 'absolute',
            bottom: 'clamp(20px, 5vh, 40px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeInUp 1s ease-out 1s forwards',
            opacity: 0
          }}>
            <span style={{
              color: '#52525b',
              fontSize: '0.75rem',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}>
              Scroll to Start
            </span>
            <div style={{ animation: 'bounce 2s infinite' }}>
              <ChevronDown size={28} color="#71717a" />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
          40% {transform: translateY(5px);}
          60% {transform: translateY(3px);}
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        div::-webkit-scrollbar { display: none; }
        div { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default IntroScreen;