'use client';
import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../firebase/config';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [phone, setPhone]     = useState('');
  const { login, isAuthenticated } = useAuthStore();

  // Handle redirect result (fallback for browsers that block popups)
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          const u = result.user;
          const savedPhone = sessionStorage.getItem('login_phone') || '';
          login({ uid: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL, phoneNumber: savedPhone });
          sessionStorage.removeItem('login_phone');
          window.location.href = '/';
        }
      })
      .catch((err) => {
        if (err.code !== 'auth/no-auth-event') {
          setError(err.message || 'Sign-in failed. Please try again.');
        }
      });
  }, []); // eslint-disable-line

  // Auto-redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    if (phone) sessionStorage.setItem('login_phone', phone);

    try {
      // Primary: popup (works in most browsers including mobile)
      const result = await signInWithPopup(auth, googleProvider);
      const u = result.user;
      login({ uid: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL, phoneNumber: phone || '' });
      sessionStorage.removeItem('login_phone');
      window.location.href = '/';
    } catch (err: any) {
      // Popup blocked → fall back to redirect
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
          // redirect will reload page; result handled in useEffect above
        } catch (redirectErr: any) {
          setError(redirectErr.message || 'Sign-in failed. Please try again.');
          setLoading(false);
        }
      } else {
        setError(err.message || 'Google sign-in failed. Please try again.');
        setLoading(false);
      }
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>
      <style>{`
        @keyframes loginSlideUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes pulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(197,160,89,0.4); }
          50%      { box-shadow: 0 0 0 12px rgba(197,160,89,0); }
        }
        .google-btn:hover:not(:disabled) {
          background: #f8f8f8 !important;
          border-color: rgba(197,160,89,0.5) !important;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(0,0,0,0.12) !important;
        }
        .google-btn:active:not(:disabled) { transform: translateY(0px) !important; }
      `}</style>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 440,
        animation: 'loginSlideUp 0.65s cubic-bezier(0.16,1,0.3,1) both',
        position: 'relative',
      }}>
        {/* Gold glow rim */}
        <div style={{
          position: 'absolute', inset: -2, borderRadius: 26,
          background: 'linear-gradient(135deg, rgba(197,160,89,0.4), rgba(212,175,55,0.05))',
          filter: 'blur(2px)', zIndex: 0,
        }} />

        {/* Card body */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: '#fff',
          borderRadius: 24,
          padding: 'clamp(32px,6vw,52px) clamp(24px,6vw,48px)',
          border: '1px solid rgba(197,160,89,0.18)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.04)',
        }}>

          {/* Logo & brand */}
          <div style={{ textAlign: 'center', marginBottom: 36 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 68, height: 68, borderRadius: 20,
              background: 'linear-gradient(135deg, #C5A059, #D4AF37)',
              marginBottom: 18,
              animation: 'pulse 2.5s ease-in-out infinite',
            }}>
              <span style={{ fontSize: 30, fontWeight: 900, color: '#fff', fontFamily: 'Outfit,sans-serif' }}>S</span>
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(26px,4vw,34px)',
              letterSpacing: '-0.03em',
              color: '#1A1A1A',
              marginBottom: 8,
              lineHeight: 1.2,
            }}>Welcome Back</h1>
            <p style={{ fontSize: 14, color: '#6B6B6B', lineHeight: 1.65 }}>
              Sign in to explore premium products and track your orders.
            </p>
          </div>

          {/* Phone field (optional) */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6B6B6B', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              Phone Number <span style={{ fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={{
                width: '100%', padding: '13px 16px', borderRadius: 12,
                background: '#FAF8F5', border: '1.5px solid rgba(0,0,0,0.09)',
                color: '#1A1A1A', fontSize: 15, fontFamily: 'Outfit,sans-serif',
                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box',
              }}
              onFocus={e => e.currentTarget.style.borderColor = '#C5A059'}
              onBlur={e  => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.09)'}
            />
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: '#9C9C9C', textTransform: 'uppercase' }}>Sign in with</span>
            <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.07)' }} />
          </div>

          {/* Google button */}
          <button
            id="google-signin-btn"
            className="google-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: 12, padding: '15px 24px', borderRadius: 14,
              background: loading ? '#f5f5f5' : '#fff',
              border: '1.5px solid rgba(0,0,0,0.1)', color: '#1f1f1f',
              fontFamily: 'Outfit,sans-serif', fontSize: 15, fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
              opacity: loading ? 0.72 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, border: '2.5px solid rgba(0,0,0,0.12)', borderTopColor: '#C5A059', borderRadius: '50%', animation: 'spin 0.75s linear infinite', flexShrink: 0 }} />
                <span>Signing you in…</span>
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Error message */}
          {error && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 10, background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', fontSize: 13, color: '#dc2626', lineHeight: 1.55 }}>
              ⚠ {error}
            </div>
          )}

          {/* Trust badges */}
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['🔒 Secure Login', '✓ No Password', '⚡ Instant Access'].map(b => (
              <span key={b} style={{ fontSize: 12, color: '#9C9C9C', fontWeight: 500 }}>{b}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
