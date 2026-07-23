'use client';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';

export default function UserMenu() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (e) { /* ignore */ }
    logout();
    window.location.href = '/login';
  };

  if (isAuthenticated && user) {
    return (
      <div style={{ position: 'relative' }}>
        {/* Avatar button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'var(--bg-elevated)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '6px 12px 6px 6px',
            cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name || 'User'}
              width={28} height={28}
              style={{ borderRadius: '50%', flexShrink: 0 }}
            />
          ) : (
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0D0D0F' }}>
                {(user.name || user.email || 'U')[0].toUpperCase()}
              </span>
            </div>
          )}
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', maxWidth: 100, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user.name?.split(' ')[0] || 'Account'}
          </span>
          <svg style={{ width: 14, height: 14, color: 'var(--text-muted)', flexShrink: 0, transition: 'transform 0.2s', transform: menuOpen ? 'rotate(180deg)' : 'none' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
          </svg>
        </button>

        {/* Dropdown */}
        {menuOpen && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 14, padding: 8, minWidth: 200, zIndex: 100,
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
          }}>
            {/* User info */}
            <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid var(--border)', marginBottom: 6 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{user.name}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{user.email}</p>
            </div>

            <a href="/cart" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              🛒 My Cart
            </a>

            <a href="/orders" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 8, fontSize: 13, color: 'var(--text-secondary)', textDecoration: 'none', transition: 'all 0.15s', marginBottom: 4 }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              📦 My Orders
            </a>

            <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 13, color: '#F87171', background: 'transparent', border: 'none', cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              ↩ Sign Out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <a href="/login" className="btn-primary" style={{ fontSize: 13, padding: '9px 20px' }}>
      Sign In with Google
    </a>
  );
}
