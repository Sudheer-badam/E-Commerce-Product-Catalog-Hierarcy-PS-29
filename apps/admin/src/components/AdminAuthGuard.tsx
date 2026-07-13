'use client';
import React, { useState, useEffect } from 'react';
import { signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../firebase/config';

const ALLOWED_EMAIL = 'badamsudheerreddy@gmail.com';

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');
  const [error, setError] = useState('');
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.toLowerCase() === ALLOWED_EMAIL) {
        setStatus('authenticated');
        setError('');
      } else {
        if (user) {
          // Signed in but wrong account — sign them out immediately
          signOut(auth);
          setError('Access denied. Only the authorized admin account can log in.');
        }
        setStatus('unauthenticated');
      }
    });
    return () => unsub();
  }, []);

  // Handle redirect result when returning from Google sign-in
  useEffect(() => {
    getRedirectResult(auth)
      .then((result) => {
        if (result?.user) {
          if (result.user.email?.toLowerCase() !== ALLOWED_EMAIL) {
            signOut(auth);
            setError('Access denied. Only badamsudheerreddy@gmail.com can access this panel.');
          }
        }
      })
      .catch(() => {
        setError('Sign-in failed. Please try again.');
      });
  }, []);

  const handleGoogleSignIn = async () => {
    setSigning(true);
    setError('');
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (err: any) {
      setError('Sign-in failed. Please try again.');
      setSigning(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setStatus('unauthenticated');
  };

  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#0f0f13', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid rgba(245,158,11,0.2)', borderTop: '3px solid #F59E0B', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (status === 'authenticated') {
    return <>{children}</>;
  }

  // ── Login Screen ─────────────────────────────────────
  return (
    <div style={{
      display: 'flex', minHeight: '100vh', width: '100vw',
      background: '#0f0f13', color: 'white',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Background glow */}
      <div style={{ position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        maxWidth: 420, width: '100%', margin: '0 16px',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24, overflow: 'hidden',
        boxShadow: '0 32px 64px rgba(0,0,0,0.6)',
      }}>
        {/* Top amber strip */}
        <div style={{ height: 4, background: 'linear-gradient(90deg, #F59E0B, #FBBF24, #F59E0B)' }} />

        <div style={{ padding: '40px 40px 36px', textAlign: 'center' }}>
          {/* Logo */}
          <div style={{ marginBottom: 28, display: 'inline-block' }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <img
                src="/logo.png"
                alt="ShopSmart"
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '4px', border: '3px solid #F59E0B', display: 'block' }}
              />
              <div style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: '50%', background: '#4ADE80', border: '2px solid #0f0f13', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'white', marginBottom: 8, letterSpacing: '-0.01em' }}>
            Admin Portal
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', marginBottom: 32, lineHeight: 1.6 }}>
            Sign in with your authorized Google account to access the ShopSmart Control Panel.
          </p>

          {/* Google Sign In Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={signing}
            style={{
              width: '100%', padding: '14px 20px',
              background: signing ? 'rgba(255,255,255,0.05)' : 'white',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 14, cursor: signing ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
              transition: 'all 0.2s', opacity: signing ? 0.7 : 1,
            }}
            onMouseEnter={e => { if (!signing) e.currentTarget.style.transform = 'translateY(-1px)'; if (!signing) e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Google SVG */}
            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.5 20H24v8.5h11.7C34.1 33.9 29.6 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 12.4 3 3 12.4 3 24s9.4 21 21 21c10.5 0 20-7.6 20-21 0-1.3-.2-2.7-.5-4z" fill="#FFC107"/>
              <path d="M6.3 14.7l7 5.1C15 16.1 19.1 13 24 13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 5.1 29.6 3 24 3 16.3 3 9.7 7.9 6.3 14.7z" fill="#FF3D00"/>
              <path d="M24 45c5.5 0 10.4-1.9 14.2-5.1l-6.6-5.4C29.6 36.1 27 37 24 37c-5.6 0-10.1-3.1-11.7-7.5l-7 5.4C8.6 41.4 15.8 45 24 45z" fill="#4CAF50"/>
              <path d="M44.5 20H24v8.5h11.7c-.8 2.4-2.4 4.4-4.5 5.8l6.6 5.4C41.8 36.5 44.5 31 44.5 24c0-1.3-.2-2.7-.5-4z" fill="#1976D2"/>
            </svg>
            <span style={{ fontSize: 15, fontWeight: 700, color: signing ? 'rgba(255,255,255,0.5)' : '#1a1a1a' }}>
              {signing ? 'Signing in...' : 'Continue with Google'}
            </span>
          </button>

          {/* Error message */}
          {error && (
            <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>🚫</span>
              <p style={{ fontSize: 13, color: '#F87171', textAlign: 'left', lineHeight: 1.5, margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Info */}
          <div style={{ marginTop: 24, padding: '12px 16px', background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 12 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0, lineHeight: 1.6 }}>
              🔒 Access restricted to authorized admin account only.<br/>
              Unauthorized access attempts are blocked automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
