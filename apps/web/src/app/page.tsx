import React from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Electronics', 'Software', 'Services', 'Education'];

const KIND_META: Record<string, { icon: string; color: string; label: string }> = {
  Physical:     { icon: '📦', color: 'badge-green',  label: 'Physical' },
  Digital:      { icon: '⚡', color: 'badge-blue',   label: 'Digital' },
  Subscription: { icon: '🔄', color: 'badge-amber',  label: 'Subscription' },
};

export default async function HomePage() {
  let products: any[] = [];
  try {
    const res = await fetch('https://shop-smart-api-production.up.railway.app/products', { cache: 'no-store' });
    if (res.ok) products = await res.json();
  } catch (e) {
    console.error('Failed to fetch products:', e);
  }

  return (
    <div className="animate-fade-in">

      {/* ── Hero Section ───────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(160deg, rgba(245,158,11,0.06) 0%, rgba(13,13,15,0) 60%)',
          borderBottom: '1px solid var(--border)',
          padding: '80px 24px 72px',
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Text */}
            <div className="animate-slide-up">
              <div className="badge badge-amber mb-6">
                ✦ Production-Grade E-Commerce Platform
              </div>
              <h1
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 'clamp(48px, 6vw, 80px)',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.05,
                  color: 'var(--text-primary)',
                  marginBottom: 24,
                }}
              >
                Shop <span className="gradient-text">Smarter</span>,<br />
                Live Better.
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 17, lineHeight: 1.7, maxWidth: 480, marginBottom: 36 }}>
                Physical products, digital downloads, and subscriptions — powered by a polymorphic OOP catalog with real-time order management.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#catalog" className="btn-primary" style={{ fontSize: 15, padding: '13px 28px' }}>
                  Browse Catalog
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"/>
                  </svg>
                </a>
                <Link href="/checkout" className="btn-outline" style={{ fontSize: 15, padding: '13px 28px' }}>
                  Try Checkout →
                </Link>
              </div>
            </div>

            {/* Right Stats */}
            <div className="grid grid-cols-2 gap-4 animate-slide-up" style={{ animationDelay: '150ms' }}>
              {[
                { value: '500+', label: 'Curated Products', icon: '🛍️' },
                { value: '10K+', label: 'Happy Customers', icon: '😍' },
                { value: '99.9%', label: 'Uptime SLA', icon: '⚡' },
                { value: '3 Types', label: 'Product Catalog', icon: '📦' },
              ].map(stat => (
                <div key={stat.label} className="card" style={{ textAlign: 'center', padding: 20 }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>{stat.icon}</div>
                  <div className="gradient-text" style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em' }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4, fontWeight: 500 }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Categories & Catalog ───────────────────────────── */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 py-16">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="label-upper mb-2">Explore the Catalog</p>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Featured Products
            </h2>
          </div>
          {/* Category Pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} className="category-pill">{cat}</button>
            ))}
          </div>
        </div>

        {/* Type Legend */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {Object.entries(KIND_META).map(([key, { icon, label }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)', background: 'var(--bg-surface)', border: '1px solid var(--border)', padding: '5px 12px', borderRadius: 99 }}>
              <span>{icon}</span> <strong style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>{label}</strong>
            </div>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="card text-center py-16" style={{ color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 16, fontWeight: 500 }}>No products found.</p>
            <p style={{ fontSize: 13, marginTop: 4 }}>Ensure the API server is running on port 8080.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product: any, i: number) => {
              const rawKind  = product.kind || 'PHYSICAL';
              const kindKey  = rawKind.charAt(0).toUpperCase() + rawKind.slice(1).toLowerCase();
              const meta     = KIND_META[kindKey] || KIND_META['Physical'];

              return (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group card animate-slide-up"
                  style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none', animationDelay: `${i * 60}ms` }}
                >
                  {/* Product Image */}
                  <div className="product-image-box mb-5" style={{ padding: '16px' }}>
                    {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
                      <img src={encodeURI(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    ) : (
                      product.image
                    )}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className={`badge ${meta.color}`}>{meta.icon} {meta.label}</span>
                    <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                      {product.stock > 0 ? '● In Stock' : '○ Out of Stock'}
                    </span>
                  </div>

                  {/* Category */}
                  <p className="label-upper" style={{ marginBottom: 6 }}>{product.category}</p>

                  {/* Name & Description */}
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1, marginBottom: 16, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                  </p>

                  {/* Footer: Price + CTA */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
                    <div>
                      <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                        ₹{product.price}
                      </div>
                    </div>
                    <span className="btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Payment Methods ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card text-center" style={{ padding: '40px 24px' }}>
          <p className="label-upper mb-4">Secure Payments</p>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 28, letterSpacing: '-0.02em' }}>
            All Major Payment Methods Accepted
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', alignItems: 'center' }}>

            {/* UPI */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="36" height="20" viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="40" rx="6" fill="#5F259F"/>
                <text x="8" y="27" fontFamily="Arial" fontWeight="900" fontSize="20" fill="white">UPI</text>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>UPI</span>
            </div>

            {/* PhonePe */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#5F259F"/>
                <path d="M30 35 Q50 15 70 35 L70 65 Q50 85 30 65 Z" fill="white"/>
                <circle cx="50" cy="50" r="10" fill="#5F259F"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>PhonePe</span>
            </div>

            {/* Razorpay */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="16" fill="#2D6BFF"/>
                <polygon points="20,80 50,20 65,50 40,50 70,80" fill="white"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Razorpay</span>
            </div>

            {/* BHIM */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="50" fill="#00A1E4"/>
                <text x="18" y="63" fontFamily="Arial" fontWeight="900" fontSize="36" fill="white">B</text>
                <rect x="50" y="25" width="6" height="50" rx="3" fill="white"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>BHIM</span>
            </div>

            {/* Google Pay */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="26" height="22" viewBox="0 0 120 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="38" fontFamily="Arial" fontWeight="700" fontSize="38" fill="#4285F4">G</text>
                <text x="28" y="38" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#EA4335">o</text>
                <text x="50" y="38" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#FBBC05">o</text>
                <text x="72" y="38" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#4285F4">g</text>
                <text x="92" y="38" fontFamily="Arial" fontWeight="700" fontSize="28" fill="#34A853">l</text>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Google Pay</span>
            </div>

            {/* Paytm */}
            <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="12" fill="#00BAF2"/>
                <rect x="15" y="15" width="30" height="70" rx="6" fill="white"/>
                <rect x="55" y="15" width="30" height="35" rx="6" fill="white"/>
                <rect x="55" y="58" width="30" height="27" rx="6" fill="white"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)' }}>Paytm</span>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
