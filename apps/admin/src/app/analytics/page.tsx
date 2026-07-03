'use client';
import React from 'react';

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
            Analytics
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Store performance and traffic metrics.</p>
        </div>
      </div>
      <div className="card">
        <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>Store Insights</h3>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Under construction.</p>
      </div>
    </div>
  );
}
