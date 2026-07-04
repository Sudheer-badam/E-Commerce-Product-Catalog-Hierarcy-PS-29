'use client';
import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Check if we've already shown the splash screen in this session
    if (sessionStorage.getItem('splash_shown')) {
      setShow(false);
      return;
    }

    // Start fade out at 4.5s
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 4500);

    // Completely remove at 5s
    const removeTimer = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem('splash_shown', 'true');
    }, 5000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!show) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        background: '#0D0D0F', // var(--bg-base)
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        opacity: fade ? 0 : 1,
        transition: 'opacity 0.5s ease-out',
        pointerEvents: 'none'
      }}
    >
      {/* Animation Styles for Water Flow */}
      <style>{`
        @keyframes liquidFlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .water-layer {
          position: absolute;
          left: -50vw;
          width: 200vw;
          height: 200vw;
          animation: liquidFlow linear infinite;
        }
        .water-1 { 
          bottom: -160vw; 
          border-radius: 43%; 
          background: rgba(59, 130, 246, 0.4); /* Blue */
          animation-duration: 12s; 
        }
        .water-2 { 
          bottom: -165vw; 
          border-radius: 45%; 
          background: rgba(16, 185, 129, 0.3); /* Green/Teal */
          animation-duration: 16s; 
        }
        .water-3 { 
          bottom: -170vw; 
          border-radius: 40%; 
          background: rgba(245, 158, 11, 0.3); /* Amber */
          animation-duration: 20s; 
        }
      `}</style>

      {/* Water flow animated layers */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: -2 }}>
        <div className="water-layer water-1" />
        <div className="water-layer water-2" />
        <div className="water-layer water-3" />
      </div>

      {/* Background Glow */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', zIndex: -1 }} />

      <div style={{ animation: 'slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both' }}>
        {/* Logo */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 40 }}>
          <img 
            src="/logo.png" 
            alt="ShopSmart Logo" 
            style={{ 
              width: 100, height: 100, borderRadius: '50%', objectFit: 'contain', 
              background: '#fff', padding: '6px', border: '4px solid #F59E0B',
              marginBottom: 16, boxShadow: '0 8px 32px rgba(245,158,11,0.3)'
            }} 
          />
          <h1 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 900, fontSize: 36, letterSpacing: '-0.02em', margin: 0 }}>
            Shop<span style={{ color: '#F59E0B' }}>Smart</span>
          </h1>
          <p style={{ color: '#9A9896', fontSize: 16, marginTop: 4, fontWeight: 500 }}>E-Commerce Product Catalog</p>
        </div>

        {/* Team Members Box */}
        <div style={{ 
          background: 'rgba(255,255,255,0.03)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: 24, 
          padding: '32px 48px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 16px 64px rgba(0,0,0,0.5)'
        }}>
          <p style={{ color: '#F59E0B', fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 20 }}>
            Developed By Group
          </p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { name: 'BOTTA SASIKIRAN', id: '2300032014' },
              { name: 'BADAM SUDHEER REDDY', id: '2300033278', role: 'TEAM LEAD' },
              { name: 'THOTA SHYAM', id: '2300032351' },
              { name: 'KONKIMALLA SHANMUKH SAI', id: '2300030955' }
            ].map((member, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.05)' : 'none', paddingBottom: i < 3 ? 12 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: '#F0EEE8' }}>{member.name}</span>
                  {member.role && (
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#0D0D0F', background: '#4ADE80', padding: '3px 8px', borderRadius: 99, letterSpacing: '0.05em' }}>
                      {member.role}
                    </span>
                  )}
                </div>
                <span style={{ fontSize: 14, fontWeight: 600, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '4px 12px', borderRadius: 99, flexShrink: 0 }}>{member.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
