'use client';
import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const orderId = params.get('orderId') || '';
  const amount = params.get('amount') || '';
  const method = params.get('method') || 'UPI';
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple confetti burst using CSS animation
    const el = confettiRef.current;
    if (!el) return;
    const colors = ['#F59E0B', '#4ADE80', '#60A5FA', '#F97316', '#A78BFA'];
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 8 + 4}px;
        height: ${Math.random() * 8 + 4}px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        left: ${Math.random() * 100}%;
        top: -20px;
        opacity: 0;
        animation: confetti-fall ${Math.random() * 2 + 1.5}s ease-in ${Math.random() * 0.8}s forwards;
      `;
      el.appendChild(particle);
    }
    return () => { el.innerHTML = ''; };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 animate-fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Confetti container */}
      <div ref={confettiRef} style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 50 }} />

      {/* Glow background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,222,128,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div className="glass rounded-3xl p-12 max-w-md w-full text-center" style={{ position: 'relative', zIndex: 1 }}>
        {/* Animated success icon */}
        <div style={{
          width: 96, height: 96, margin: '0 auto 28px',
          borderRadius: '50%',
          background: 'rgba(74,222,128,0.15)',
          border: '2px solid rgba(74,222,128,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44,
          animation: 'pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          boxShadow: '0 0 40px rgba(74,222,128,0.25)',
        }}>
          ✅
        </div>

        <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#4ADE80', marginBottom: 8 }}>
          PAYMENT SUCCESSFUL
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 38, color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 12 }}>
          Thank You!
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 32, lineHeight: 1.6 }}>
          Your payment has been received and your order is now confirmed. You'll receive a dispatch notification in chat once it's shipped.
        </p>

        {/* Details card */}
        <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 16, padding: '20px', marginBottom: 28, textAlign: 'left' }}>
          {orderId && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>ORDER ID</span>
              <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#F59E0B', fontWeight: 700 }}>#{orderId.substr(0, 8).toUpperCase()}</span>
            </div>
          )}
          {amount && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>AMOUNT PAID</span>
              <span style={{ fontSize: 13, color: '#4ADE80', fontWeight: 800 }}>₹{parseFloat(amount).toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>METHOD</span>
            <span style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 600 }}>{method}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#4ADE80', padding: '2px 10px', background: 'rgba(74,222,128,0.12)', borderRadius: 99, border: '1px solid rgba(74,222,128,0.3)' }}>Paid ✓</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/" className="btn-primary" style={{ textAlign: 'center', fontSize: 14, width: '100%', display: 'block' }}>
            🛍️ Continue Shopping
          </Link>
          <Link href="/cart" style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', padding: '8px', display: 'block' }}>
            View Cart
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: scale(0); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
