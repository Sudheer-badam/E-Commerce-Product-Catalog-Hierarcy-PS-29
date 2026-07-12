'use client';
import React, { useState, useEffect, useRef } from 'react';
import VideoGlobe from './VideoGlobe';

const PLAYLIST = [
  "5889465-uhd_3840_2160_25fps.mp4",
  "5662337-hd_1080_1920_25fps.mp4",
  "5836561-uhd_2160_3840_30fps.mp4",
  "5889747-uhd_2160_3840_25fps.mp4",
  "5890235-uhd_2160_3840_25fps.mp4",
  "6342197-uhd_2160_3840_24fps.mp4",
  "6956686-hd_1080_1920_25fps.mp4",
  "7287926-uhd_3840_2160_25fps.mp4",
  "7288127-uhd_2160_3840_25fps.mp4",
  "7308102-hd_1920_1080_24fps.mp4",
  "7669660-hd_1080_1920_25fps.mp4",
  "7680430-uhd_4096_2160_25fps.mp4",
  "7855462-uhd_3840_2160_25fps.mp4",
  "8626759-hd_1920_1080_25fps.mp4",
  "8628061-hd_1080_1920_25fps.mp4",
  "8938174-hd_1080_1920_30fps.mp4",
  "istockphoto-1208403780-640_adpp_is.mp4",
  "istockphoto-884005050-640_adpp_is.mp4",
  "13441356-uhd_2160_3840_24fps.mp4",
  "5836561-uhd_2160_3840_30fps (1).mp4",
];

/* ── Streak type ── */
interface Streak {
  angle: number;    // radians from vanishing point
  speed: number;   // px per frame
  progress: number; // 0..1
  length: number;  // px tail length
  width: number;   // line width
  color: string;   // rgba
  side: 'left' | 'center' | 'right';
}

function makeStreak(vpX: number, vpY: number, W: number, H: number): Streak {
  // Divide screen into 3 zones: left (orange), center (white/gray), right (green)
  const zone = Math.random();
  let side: Streak['side'];
  let color: string;
  let angle: number;

  if (zone < 0.38) {
    // LEFT — TCS orange/red streaks
    side = 'left';
    const hue = Math.random() < 0.5 ? '#FF6B2B' : '#E84B1A';
    const alpha = 0.4 + Math.random() * 0.55;
    color = hue + Math.round(alpha * 255).toString(16).padStart(2, '0');
    // Left-side angles — fan out to upper-left and left
    angle = Math.PI + Math.random() * (Math.PI * 0.55);
  } else if (zone < 0.62) {
    // CENTER — white/gray road dashes
    side = 'center';
    const alpha = 0.25 + Math.random() * 0.4;
    color = `rgba(220,220,220,${alpha})`;
    // Mostly straight down
    angle = Math.PI * 0.5 + (Math.random() - 0.5) * 0.3;
  } else {
    // RIGHT — TCS green streaks (curved right side)
    side = 'right';
    const g = Math.floor(180 + Math.random() * 75);
    const alpha = 0.45 + Math.random() * 0.5;
    color = `rgba(0,${g},60,${alpha})`;
    // Right-side angles — fan to upper-right
    angle = -Math.random() * (Math.PI * 0.55);
  }

  return {
    angle,
    speed: 4 + Math.random() * 9,
    progress: Math.random(),
    length: 60 + Math.random() * 260,
    width: 0.5 + Math.random() * 2.5,
    color,
    side,
  };
}

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);
  const [globeSize, setGlobeSize] = useState(760);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem('splash_shown') === 'true') {
      setShow(false);
      return;
    }
    const fadeTimer   = setTimeout(() => setFade(true),  3500);
    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('splash_shown', 'true');
    }, 4000);
    const onResize = () => setGlobeSize(Math.min(window.innerWidth, window.innerHeight) * 0.75);
    onResize();
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(fadeTimer); clearTimeout(removeTimer); window.removeEventListener('resize', onResize); };
  }, []);

  /* ── Highway canvas ── */
  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let W = canvas.width  = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    // Vanishing point: 58% from left, 38% from top — mimics TCS perspective
    let vpX = W * 0.58;
    let vpY = H * 0.38;

    const NUM_STREAKS = 140;
    const streaks: Streak[] = Array.from({ length: NUM_STREAKS }, () =>
      makeStreak(vpX, vpY, W, H)
    );

    let raf: number;

    const draw = () => {
      // Slight motion blur trail
      ctx.fillStyle = 'rgba(6,6,10,0.18)';
      ctx.fillRect(0, 0, W, H);

      // Road surface — subtle dark gradient for the asphalt feel
      const roadGrad = ctx.createLinearGradient(vpX, vpY, W / 2, H);
      roadGrad.addColorStop(0, 'rgba(20,20,26,0)');
      roadGrad.addColorStop(1, 'rgba(20,20,26,0.55)');
      ctx.fillStyle = roadGrad;
      ctx.fillRect(0, 0, W, H);

      streaks.forEach(s => {
        // Max radius from vanishing point to screen edge
        const maxR = Math.hypot(Math.max(vpX, W - vpX), Math.max(vpY, H - vpY)) * 1.1;
        const r = s.progress * maxR;

        const headX = vpX + Math.cos(s.angle) * r;
        const headY = vpY + Math.sin(s.angle) * r;
        const tailR = Math.max(0, r - s.length);
        const tailX = vpX + Math.cos(s.angle) * tailR;
        const tailY = vpY + Math.sin(s.angle) * tailR;

        // Gradient along the streak (bright head, fades to transparent)
        const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.6, s.color);
        grad.addColorStop(1,   s.color);

        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(headX, headY);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width * (0.3 + s.progress * 0.7); // thicker as it approaches
        ctx.lineCap = 'round';
        ctx.stroke();

        // Advance
        s.progress += s.speed / maxR;
        if (s.progress > 1) {
          // Reset streak
          Object.assign(s, makeStreak(vpX, vpY, W, H));
          s.progress = 0;
        }
      });

      raf = requestAnimationFrame(draw);
    };

    // Initial full black fill
    ctx.fillStyle = '#06060a';
    ctx.fillRect(0, 0, W, H);
    draw();

    const onResize = () => {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
      vpX = W * 0.58;
      vpY = H * 0.38;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, [show]);

  if (!mounted || !show) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999999,
      opacity: fade ? 0 : 1,
      transition: 'opacity 0.5s ease-out',
      pointerEvents: 'none',
      background: '#06060a',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes slideUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes subtlePulse {
          0%,100% { opacity:0.85; } 50% { opacity:1; }
        }
      `}</style>

      {/* Highway canvas */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }} />

      {/* 3D Video Globe — centred at the TCS vanishing-point */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <VideoGlobe size={globeSize} speed={36} />
      </div>

      {/* TCS-style bottom-left brand text overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        padding: '0 5% 8%',
        zIndex: 10,
        background: 'linear-gradient(to top, rgba(6,6,10,0.92) 0%, transparent 100%)',
      }}>
        {/* Small label */}
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(9px,1.2vw,13px)',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: 'rgba(255,255,255,0.55)',
          textTransform: 'uppercase',
          margin: '0 0 16px',
          animation: 'slideUp 0.7s 0.2s both',
        }}>
          SHOPSMART WORLDWIDE
        </p>

        {/* Main headline — TCS style */}
        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px,7vw,88px)',
          fontWeight: 400,
          color: '#ffffff',
          margin: '0 0 16px',
          lineHeight: 1.0,
          letterSpacing: '-0.01em',
          animation: 'slideUp 0.8s 0.4s both',
        }}>
          Accelerating<br />
          <span style={{ color: '#C5A059' }}>Commerce</span>
        </h1>

        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(13px,1.8vw,20px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          margin: '0 0 6px',
          animation: 'slideUp 0.8s 0.6s both',
        }}>
          AI Powered Shopping
        </p>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 'clamp(11px,1.4vw,16px)',
          fontWeight: 300,
          color: 'rgba(255,255,255,0.45)',
          margin: '0 0 32px',
          animation: 'slideUp 0.8s 0.7s both',
        }}>
          From Catalog to Doorstep
        </p>

        {/* Dev credit pill */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 14,
          background: 'rgba(197,160,89,0.12)',
          border: '1px solid rgba(197,160,89,0.35)',
          borderRadius: 50,
          padding: '10px 22px',
          animation: 'slideUp 0.8s 0.9s both',
          backdropFilter: 'blur(8px)',
        }}>
          <div style={{ width:8, height:8, borderRadius:'50%', background:'#C5A059', animation:'subtlePulse 2s infinite' }} />
          <span style={{ fontFamily:"'Outfit',sans-serif", fontSize:13, color:'rgba(255,255,255,0.8)', fontWeight:500 }}>
            Developed by <strong style={{ color:'#C5A059' }}>BADAM SUDHEER REDDY</strong>
            <span style={{ color:'rgba(255,255,255,0.4)', marginLeft:10 }}>ID: 2300033278</span>
          </span>
        </div>
      </div>

      {/* ── PROMINENT LOGO — always visible at top-centre ── */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        zIndex: 20,
        display: 'flex',
        justifyContent: 'center',
        padding: '32px 24px 24px',
        background: 'linear-gradient(to bottom, rgba(6,6,10,0.95) 0%, rgba(6,6,10,0.6) 70%, transparent 100%)',
        animation: 'slideUp 0.6s 0.1s both',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          background: 'rgba(255,255,255,0.05)',
          border: '1.5px solid rgba(197,160,89,0.45)',
          borderRadius: 100,
          padding: '14px 32px 14px 16px',
          backdropFilter: 'blur(16px)',
          boxShadow: '0 0 60px rgba(197,160,89,0.25), 0 4px 24px rgba(0,0,0,0.5)',
        }}>
          {/* Logo image */}
          <img
            src="/logo.png"
            alt="ShopSmart Logo"
            style={{
              width: 64, height: 64,
              borderRadius: '50%',
              objectFit: 'contain',
              background: '#fff',
              padding: 5,
              border: '3px solid #C5A059',
              boxShadow: '0 0 24px rgba(197,160,89,0.6)',
            }}
          />
          {/* Company name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: 'clamp(26px, 4vw, 40px)',
              color: '#fff',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}>
              Shop<span style={{ color: '#C5A059' }}>Smart</span>
            </span>
            <span style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(11px, 1.2vw, 14px)',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}>
              E-Commerce Product Catalog
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
