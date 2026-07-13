'use client';
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../firebase/config';
import { signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';

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

/* ─── 4-column mosaic with two rows scroll ─── */
function VideoMosaic() {
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: 'repeat(5, 1fr)', gap: 3, overflow: 'hidden' }}>
      <style>{`
        @keyframes mosaicFloat {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
      `}</style>
      {PLAYLIST.map((vid, i) => (
        <div
          key={i}
          style={{
            position: 'relative',
            borderRadius: 6,
            overflow: 'hidden',
            background: '#0a0a0f',
            border: '1px solid rgba(197,160,89,0.15)',
            animation: `mosaicFloat ${3 + (i % 5) * 0.4}s ${(i * 0.15) % 2}s ease-in-out infinite`,
          }}
        >
          <video
            src={`/videos/${vid}`}
            autoPlay muted loop playsInline
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.88 }}
          />
          {/* Gold shimmer overlay */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, rgba(197,160,89,0.08) 0%, transparent 60%)',
            pointerEvents: 'none',
          }} />
        </div>
      ))}
    </div>
  );
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [phone, setPhone]     = useState('');
  const { login } = useAuthStore();

  // Handle the redirect result when user comes back from Google
  useEffect(() => {
    const savedPhone = sessionStorage.getItem('login_phone');
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const u = result.user;
          login({ uid: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL, phoneNumber: savedPhone || '' });
          sessionStorage.removeItem('login_phone');
          window.location.href = '/';
        }
      })
      .catch((err) => {
        setError(err.message || 'Google sign-in failed. Please try again.');
      });
  }, [login]);

  const handleGoogleLogin = async () => {
    if (!phone) { setError('Please enter your phone number first.'); return; }
    setLoading(true);
    setError('');
    try {
      // Save phone to session so we can retrieve it after redirect
      sessionStorage.setItem('login_phone', phone);
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAF8F5', flexWrap: 'wrap' }}>
      <style>{`
        @keyframes loginSlideUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @media(max-width:768px) {
          .login-left  { display:none !important; }
          .login-right { flex:1 1 100% !important; }
        }
      `}</style>

      {/* ══ LEFT — 4×5 video mosaic ══ */}
      <div
        className="login-left"
        style={{
          flex: '1 1 55%',
          position: 'relative',
          minHeight: '100vh',
          background: '#06060a',
          overflow: 'hidden',
        }}
      >
        {/* All 20 videos in mosaic grid */}
        <VideoMosaic />

        {/* Dark vignette so text is readable */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 90% 80% at 50% 50%, rgba(6,6,10,0.1) 0%, rgba(6,6,10,0.7) 100%)',
        }} />

        {/* Bottom overlay text */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '0 40px 48px',
          zIndex: 3,
          background: 'linear-gradient(to top, rgba(6,6,10,0.92) 0%, transparent 100%)',
        }}>
          {/* Text removed as requested */}
        </div>

        {/* Top-right logo watermark */}
        <div style={{
          position: 'absolute', top: 24, right: 28, zIndex: 4,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <img src="/logo.png" alt="ShopSmart"
            style={{ width:38, height:38, borderRadius:'50%', border:'2px solid rgba(197,160,89,0.5)', objectFit:'contain', background:'#fff', padding:3 }} />
          <span style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:18, color:'#fff' }}>
            Shop<span style={{ color:'#C5A059' }}>Smart</span>
          </span>
        </div>
      </div>

      {/* ══ RIGHT — login form ══ */}
      <div
        className="login-right"
        style={{
          flex: '1 1 45%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px 24px',
          position: 'relative',
          background: '#FAF8F5',
          overflow: 'hidden',
        }}
      >
        {/* Glow blobs */}
        <div style={{ position:'absolute', top:'15%', right:'5%', width:220, height:220, borderRadius:'50%', background:'rgba(197,160,89,0.06)', filter:'blur(70px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'10%', left:'5%',  width:200, height:200, borderRadius:'50%', background:'rgba(197,160,89,0.04)', filter:'blur(70px)', pointerEvents:'none' }} />

        {/* Card */}
        <div style={{
          width:'100%', maxWidth:430, position:'relative', zIndex:1,
          animation:'loginSlideUp 0.7s cubic-bezier(0.16,1,0.3,1) both',
        }}>
          {/* Gold rim */}
          <div style={{
            position:'absolute', inset:-1, borderRadius:24,
            background:'linear-gradient(135deg, rgba(197,160,89,0.32), rgba(212,175,55,0.08))',
            filter:'blur(1px)', zIndex:0,
          }} />

          {/* Card body */}
          <div style={{
            position:'relative', zIndex:1,
            background:'#fff', borderRadius:22,
            padding:'clamp(28px,5vw,48px) clamp(20px,5vw,44px)',
            border:'1px solid rgba(197,160,89,0.15)',
            boxShadow:'0 24px 80px rgba(0,0,0,0.06)',
          }}>

            {/* Logo */}
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <div style={{
                display:'inline-flex', alignItems:'center', justifyContent:'center',
                width:64, height:64, borderRadius:18,
                background:'linear-gradient(135deg, #C5A059, #D4AF37)',
                marginBottom:16, boxShadow:'0 8px 32px rgba(197,160,89,0.35)',
              }}>
                <span style={{ fontSize:28, fontWeight:900, color:'#fff', fontFamily:'Outfit,sans-serif' }}>S</span>
              </div>
              <h1 style={{
                fontFamily:"'DM Serif Display',serif", fontSize:'clamp(24px,4vw,32px)',
                letterSpacing:'-0.03em', color:'#1A1A1A', marginBottom:8,
              }}>Welcome Back</h1>
              <p style={{ fontSize:14, color:'#5C5C5C', lineHeight:1.6 }}>
                Enter your phone number to sign in with Google.
              </p>
            </div>

            {/* Phone */}
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#5C5C5C', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
                Phone Number
              </label>
              <input
                type="tel" value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                style={{
                  width:'100%', padding:'14px 16px', borderRadius:12,
                  background:'#FAF8F5', border:'1.5px solid rgba(0,0,0,0.1)',
                  color:'#1A1A1A', fontSize:15, fontFamily:'Outfit,sans-serif',
                  outline:'none', transition:'border-color 0.2s', boxSizing:'border-box',
                }}
                onFocus={e => e.currentTarget.style.borderColor = '#C5A059'}
                onBlur={e  => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>

            {/* Divider */}
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
              <div style={{ flex:1, height:1, background:'rgba(0,0,0,0.08)' }} />
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:'0.1em', color:'#8C8C8C', textTransform:'uppercase' }}>Continue with</span>
              <div style={{ flex:1, height:1, background:'rgba(0,0,0,0.08)' }} />
            </div>

            {/* Google button */}
            <button id="google-signin-btn" onClick={handleGoogleLogin} disabled={loading}
              style={{
                width:'100%', display:'flex', alignItems:'center', justifyContent:'center',
                gap:12, padding:'14px 24px', borderRadius:14,
                background: loading ? '#f3f4f6' : '#fff',
                border:'1.5px solid rgba(0,0,0,0.1)', color:'#1f1f1f',
                fontFamily:'Outfit,sans-serif', fontSize:15, fontWeight:600,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition:'all 0.2s ease',
                boxShadow: loading ? 'none' : '0 2px 16px rgba(0,0,0,0.07)',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <div style={{ width:20, height:20, border:'2.5px solid rgba(0,0,0,0.15)', borderTopColor:'#1f1f1f', borderRadius:'50%', animation:'spin 0.75s linear infinite' }} />
                  <span>Signing you in…</span>
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>

            {error && (
              <div style={{ marginTop:16, padding:'12px 16px', borderRadius:10, background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', fontSize:13, color:'#ef4444', lineHeight:1.5 }}>
                {error}
              </div>
            )}

            {/* Trust badges */}
            <div style={{ marginTop:28, display:'flex', justifyContent:'center', gap:20, flexWrap:'wrap' }}>
              {['🔒 Secure Login', '✓ No Password', '⚡ Instant Access'].map(b => (
                <span key={b} style={{ fontSize:12, color:'#8C8C8C', fontWeight:500 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
