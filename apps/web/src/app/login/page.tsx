'use client';
import React, { useState } from 'react';
import { auth, googleProvider } from '../../firebase/config';
import { signInWithPopup } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const { login } = useAuthStore();

  const handleGoogleLogin = async () => {
    if (!phone) {
      setError('Please enter your phone number first.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      login({
        uid:      firebaseUser.uid,
        name:     firebaseUser.displayName,
        email:    firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        phoneNumber: phone,
      });

      window.location.href = '/';
    } catch (err: any) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Google sign-in failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 60px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative', overflow: 'hidden' }}>

      {/* Background glow orbs */}
      <div style={{ position: 'absolute', top: '30%', left: '20%', width: 480, height: 480, borderRadius: '50%', background: 'rgba(245,158,11,0.06)', filter: 'blur(100px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: 360, height: 360, borderRadius: '50%', background: 'rgba(249,115,22,0.05)', filter: 'blur(120px)', pointerEvents: 'none' }} />

      {/* Card */}
      <div className="animate-slide-up" style={{ width: '100%', maxWidth: 440, position: 'relative' }}>

        {/* Amber glow border */}
        <div style={{
          position: 'absolute', inset: -1, borderRadius: 24,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.4), rgba(249,115,22,0.2), rgba(245,158,11,0.1))',
          filter: 'blur(1px)', zIndex: 0,
        }} />

        {/* Card body */}
        <div style={{
          position: 'relative', zIndex: 1,
          background: 'var(--bg-surface)',
          borderRadius: 22,
          padding: '44px 40px',
          border: '1px solid rgba(245,158,11,0.15)',
        }}>

          {/* Logo mark */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              width: 64, height: 64, borderRadius: 18,
              background: 'linear-gradient(135deg, #F59E0B, #F97316)',
              marginBottom: 16,
              boxShadow: '0 8px 32px rgba(245,158,11,0.4)',
            }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: '#0D0D0F', fontFamily: 'Outfit, sans-serif' }}>S</span>
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 32, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', marginBottom: 8,
            }}>
              Welcome Back
            </h1>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Please enter your phone number to continue with Google. We need it for delivery updates!
            </p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
              Phone Number
            </label>
            <input 
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={{
                width: '100%', padding: '14px 16px', borderRadius: 12,
                background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: 15, fontFamily: 'Outfit, sans-serif',
                outline: 'none', transition: 'border-color 0.2s'
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'var(--amber)'}
              onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'}
            />
          </div>

          {/* Divider with label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Continue with
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          {/* Google Sign-In Button */}
          <button
            id="google-signin-btn"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              padding: '14px 24px',
              borderRadius: 14,
              background: loading ? 'var(--bg-elevated)' : '#ffffff',
              border: '1px solid rgba(0,0,0,0.08)',
              color: '#1f1f1f',
              fontFamily: 'Outfit, sans-serif',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: loading ? 'none' : '0 2px 12px rgba(0,0,0,0.3)',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? (
              <>
                <div style={{ width: 20, height: 20, border: '2.5px solid rgba(0,0,0,0.15)', borderTopColor: '#1f1f1f', borderRadius: '50%', animation: 'spin 0.75s linear infinite' }} />
                <span>Signing you in…</span>
              </>
            ) : (
              <>
                {/* Google "G" Logo */}
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

          {/* Error message */}
          {error && (
            <div style={{
              marginTop: 16, padding: '12px 16px', borderRadius: 10,
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
              fontSize: 13, color: '#F87171', lineHeight: 1.5,
            }}>
              {error}
            </div>
          )}

          {/* Trust badges */}
          <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap' }}>
            {['🔒 Secure Login', '✓ No Password', '⚡ Instant Access'].map(badge => (
              <span key={badge} style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Inline spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
