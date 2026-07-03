'use client';
import React from 'react';

export default function SettingsPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
            Settings
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Configure your admin dashboard preferences.</p>
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Store Settings</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Settings module is under construction. Please check back later.
        </p>
      </div>
    </div>
  );
}
