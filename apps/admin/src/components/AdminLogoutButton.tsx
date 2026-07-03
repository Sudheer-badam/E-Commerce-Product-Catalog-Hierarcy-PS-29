'use client';
import React from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

export default function AdminLogoutButton() {
  const handleLogout = async () => {
    try { await signOut(auth); } catch (_) {}
    // The onAuthStateChanged listener in AdminAuthGuard handles the rest
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        width: '100%',
        background: 'rgba(239, 68, 68, 0.12)',
        border: 'none',
        borderTop: '1px solid rgba(239, 68, 68, 0.25)',
        color: '#F87171',
        cursor: 'pointer',
        padding: '10px 12px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.02em',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
        e.currentTarget.style.color = '#FCA5A5';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
        e.currentTarget.style.color = '#F87171';
      }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" y1="12" x2="9" y2="12"/>
      </svg>
      Logout
    </button>
  );
}
