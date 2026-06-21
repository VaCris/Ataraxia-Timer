import React, { useEffect, useRef, useState } from 'react';

const PaintTransitionOverlay = ({ triggerRef, onMidpoint }) => {
  const canvasRef = useRef(null);
  const [active, setActive] = useState(false);
  const [targetTheme, setTargetTheme] = useState(null);
  const animationRef = useRef(null);

  // Use a stable ref for onMidpoint to prevent re-renders from restarting the animation
  const onMidpointRef = useRef(onMidpoint);
  useEffect(() => {
    onMidpointRef.current = onMidpoint;
  }, [onMidpoint]);

  useEffect(() => {
    if (triggerRef) {
      triggerRef.current = (nextTheme) => {
        if (active) return;
        setTargetTheme(nextTheme);
        setActive(true);
      };
    }
  }, [triggerRef, active]);

  useEffect(() => {
    if (!active || !targetTheme) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Apply transitioning class to root element to synchronize real-time CSS variable crossfade
    document.documentElement.classList.add('theme-transitioning');

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const colWidth = 16;
    const numCols = Math.ceil(width / colWidth) + 1;
    
    // Bottom edge wave (for covering phase)
    const yBottom = new Array(numCols).fill(0);
    const bottomV = new Array(numCols).fill(0).map(() => 5 + Math.random() * 8);
    const bottomDelay = new Array(numCols).fill(0).map(() => Math.random() * 150);

    // Top edge wave (for revealing phase)
    const yTop = new Array(numCols).fill(0);
    const topV = new Array(numCols).fill(0).map(() => 6 + Math.random() * 8);
    const topDelay = new Array(numCols).fill(0).map(() => Math.random() * 100);

    let phase = 'covering'; // 'covering' | 'revealing'
    let midpointTriggered = false;
    let startTime = performance.now();

    // Background color of the incoming theme to paint the canvas
    const paintColor = targetTheme === 'dark' ? '#0a0a0a' : '#f5f0e6';

    const tick = (now) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = paintColor;
      
      if (phase === 'covering') {
        let allCovered = true;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i < numCols; i++) {
          const x = i * colWidth;
          if (elapsed > bottomDelay[i]) {
            yBottom[i] += bottomV[i] * 0.9;
            bottomV[i] += 0.22; // simulate acceleration/gravity
          }
          ctx.lineTo(x, yBottom[i]);
          if (yBottom[i] < height + 80) {
            allCovered = false;
          }
        }
        ctx.lineTo(width, 0);
        ctx.closePath();
        ctx.fill();

        // Draw gooey droplets ahead of the wave
        for (let i = 0; i < numCols; i += 4) {
          if (yBottom[i] > 60 && yBottom[i] < height) {
            const dropY = yBottom[i] + 35 + (i % 3) * 20;
            if (dropY < height) {
              ctx.beginPath();
              ctx.arc(i * colWidth, dropY, 8 + (i % 6), 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }

        if (allCovered) {
          phase = 'revealing';
          startTime = performance.now();
          if (!midpointTriggered) {
            midpointTriggered = true;
            onMidpointRef.current?.(targetTheme);
          }
        }
      } else if (phase === 'revealing') {
        let allCleared = true;

        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let i = 0; i < numCols; i++) {
          const x = i * colWidth;
          if (elapsed > topDelay[i]) {
            yTop[i] += topV[i] * 0.9;
            topV[i] += 0.25;
          }
          ctx.lineTo(x, yTop[i]);
          if (yTop[i] < height + 80) {
            allCleared = false;
          }
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fill();

        // Draw small lingering drops falling behind the revealing wave
        for (let i = 2; i < numCols; i += 5) {
          if (yTop[i] > 30 && yTop[i] < height) {
            ctx.beginPath();
            ctx.arc(i * colWidth, yTop[i] - 25, 6, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        if (allCleared) {
          document.documentElement.classList.remove('theme-transitioning');
          setActive(false);
          return;
        }
      }

      animationRef.current = requestAnimationFrame(tick);
    };

    animationRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      document.documentElement.classList.remove('theme-transitioning');
    };
  }, [active, targetTheme]);

  if (!active) return null;

  return (
    <>
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0 }} width="0" height="0">
        <defs>
          <filter id="paint-goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 25 -12"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="fixed inset-0 z-[2] pointer-events-none w-screen h-screen"
        style={{
          filter: 'url(#paint-goo)',
          mixBlendMode: 'normal',
        }}
      />
    </>
  );
};

export default PaintTransitionOverlay;

