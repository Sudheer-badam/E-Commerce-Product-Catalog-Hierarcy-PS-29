'use client';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailedPage() {
  const params = useSearchParams();
  const orderId = params.get('orderId') || '';
  const amount = params.get('amount') || '';
  const reason = params.get('reason') || 'Payment could not be completed';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Glow background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.07) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="glass rounded-3xl p-12 max-w-md w-full text-center" style={{ position: 'relative', zIndex: 1 }}>
        {/* Animated error icon */}
        <div style={{
          width: 96, height: 96, margin: '0 auto 28px',
          borderRadius: '50%',
          background: 'rgba(239,68,68,0.12)',
          border: '2px solid rgba(239,68,68,0.35)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44,
          animation: 'shake 0.5s ease 0.2s, pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          boxShadow: '0 0 40px rgba(239,68,68,0.15)',
        }}>
          ❌
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#F87171', marginBottom: 8 }}>
          PAYMENT FAILED
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 12 }}>
          Oops! Something Went Wrong
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          {reason}. Don't worry — you have not been charged. Please try again or choose a different payment method.
        </p>

        {/* Details card */}
        <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 16, padding: '20px', marginBottom: 28, textAlign: 'left' }}>
          {orderId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ORDER REF</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#F59E0B', fontWeight: 700 }}>#{orderId.substr(0, 8).toUpperCase()}</span>
            </div>
          )}
          {amount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>AMOUNT</span>
              <span style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 800 }}>₹{parseFloat(amount).toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F87171', padding: '2px 10px', background: 'rgba(239,68,68,0.12)', borderRadius: 99, border: '1px solid rgba(239,68,68,0.3)' }}>Failed ✗</span>
          </div>
        </div>

        {/* Help note */}
        <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 24, textAlign: 'left' }}>
          <p style={{ fontSize: 12, color: 'var(--amber)', fontWeight: 700, marginBottom: 6 }}>💡 What you can do</p>
          <ul style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.8, paddingLeft: 16, margin: 0 }}>
            <li>Check your internet connection and try again.</li>
            <li>Try a different UPI app (GPay, Paytm, PhonePe).</li>
            <li>Contact support if money was debited.</li>
          </ul>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/checkout" className="btn-primary" style={{ textAlign: 'center', fontSize: 14, width: '100%', display: 'block' }}>
            🔄 Try Again
          </Link>
          <Link href="/" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '8px', display: 'block' }}>
            Go to Home
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
