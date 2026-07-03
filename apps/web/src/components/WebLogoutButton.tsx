'use client';
import { useAuthStore } from '../store/useAuthStore';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';

export default function WebLogoutButton() {
  const { isAuthenticated, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isAuthenticated) return null;

  const handleSignOut = async () => {
    try { await signOut(auth); } catch (e) { /* ignore */ }
    logout();
    window.location.href = '/login';
  };

  return (
    <button
      onClick={handleSignOut}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(239, 68, 68, 0.1)',
        border: '1px solid rgba(239, 68, 68, 0.35)',
        borderRadius: 10,
        padding: '7px 14px',
        color: '#F87171',
        fontWeight: 700,
        fontSize: 13,
        cursor: 'pointer',
        transition: 'all 0.2s',
        flexShrink: 0,
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
        e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Logout
    </button>
  );
}
