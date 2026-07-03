'use client';
import React from 'react';

export default function SupportPage() {
  return (
    <div style={{ padding: '60px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{ maxWidth: 600, width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 24, padding: 40, textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: 'var(--amber)', marginBottom: 20 }}>
          Support
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 40, lineHeight: 1.6 }}>
          Need help with your order or have a question about our products? Please reach out to our dedicated support administrator directly.
        </p>

        <div style={{ background: '#0f0f13', borderRadius: 16, padding: 24, border: '1px solid rgba(245,158,11,0.2)', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              👨‍💻
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Administrator</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>BADAM SUDHEER REDDY</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              📞
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Phone</div>
              <a href="tel:8688509699" style={{ fontSize: 18, fontWeight: 700, color: '#60A5FA', textDecoration: 'none' }}>8688509699</a>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(245,158,11,0.1)', color: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
              ✉️
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', fontWeight: 600 }}>Email</div>
              <a href="mailto:badamsudheerreddy@gmail.com" style={{ fontSize: 16, fontWeight: 700, color: '#60A5FA', textDecoration: 'none' }}>badamsudheerreddy@gmail.com</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
