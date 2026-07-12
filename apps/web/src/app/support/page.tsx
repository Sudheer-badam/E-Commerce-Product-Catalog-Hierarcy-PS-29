'use client';
import React from 'react';

export default function SupportPage() {
  return (
    <div style={{ padding: '60px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-fade-in">
      <div style={{ maxWidth: 600, width: '100%', background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: 24, padding: 40, textAlign: 'center', boxShadow: '0 8px 40px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, color: '#111111', marginBottom: 12 }}>
          Support
        </h1>
        <p style={{ fontSize: 16, color: '#4A4A4A', marginBottom: 40, lineHeight: 1.7 }}>
          Need help with your order or have a question about our products? Please reach out to our dedicated support administrator directly.
        </p>

        {/* Admin Info Card */}
        <div style={{ background: '#F4F1EA', borderRadius: 20, padding: 28, border: '1.5px solid rgba(197,160,89,0.3)', display: 'flex', flexDirection: 'column', gap: 0 }}>

          {/* Name Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid rgba(0,0,0,0.07)', marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#000000', color: '#C5A059', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              👨‍💻
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B7280', fontWeight: 700, marginBottom: 4 }}>Administrator</div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#111111', letterSpacing: '-0.02em' }}>BADAM SUDHEER REDDY</div>
            </div>
          </div>

          {/* Phone Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 20, borderBottom: '1px solid rgba(0,0,0,0.07)', marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#EF4444', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 4px 12px rgba(239,68,68,0.25)' }}>
              📞
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B7280', fontWeight: 700, marginBottom: 4 }}>Phone</div>
              <a href="tel:8688509699" style={{ fontSize: 20, fontWeight: 900, color: '#111111', textDecoration: 'none', letterSpacing: '-0.01em' }}>
                8688509699
              </a>
            </div>
          </div>

          {/* Email Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#C5A059', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0, boxShadow: '0 4px 12px rgba(197,160,89,0.3)' }}>
              ✉️
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#6B7280', fontWeight: 700, marginBottom: 4 }}>Email</div>
              <a href="mailto:badamsudheerreddy@gmail.com" style={{ fontSize: 16, fontWeight: 800, color: '#111111', textDecoration: 'none', wordBreak: 'break-all' }}>
                badamsudheerreddy@gmail.com
              </a>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div style={{ display: 'flex', gap: 12, marginTop: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="tel:8688509699"
            style={{ padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 14, background: '#111111', color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.15)' }}>
            📞 Call Now
          </a>
          <a href="mailto:badamsudheerreddy@gmail.com"
            style={{ padding: '14px 28px', borderRadius: 12, fontWeight: 700, fontSize: 14, background: '#C5A059', color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8, boxShadow: '0 4px 16px rgba(197,160,89,0.3)' }}>
            ✉️ Email Us
          </a>
        </div>
      </div>
    </div>
  );
}
