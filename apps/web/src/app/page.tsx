import React from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Electronics', 'Software', 'Services', 'Education'];

const KIND_META: Record<string, { icon: string; color: string; label: string }> = {
  Physical:     { icon: '📦', color: 'badge-green',  label: 'Physical' },
  Digital:      { icon: '⚡', color: 'badge-blue',   label: 'Digital' },
  Subscription: { icon: '🔄', color: 'badge-amber',  label: 'Subscription' },
};

// Try Railway production first, then local as fallback
async function fetchProducts() {
  const urls = [
    'https://shop-smart-api-production.up.railway.app',
    process.env.NEXT_PUBLIC_API_URL,
    'http://127.0.0.1:8080',
  ].filter(Boolean) as string[];

  for (const base of urls) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15000); // 15s for Railway wake-up
      const res = await fetch(`${base}/products`, { cache: 'no-store', signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) return data;
      }
    } catch {
      // try next URL
    }
  }
  return [];
}

export default async function HomePage() {
  const products = await fetchProducts();

  return (
    <div className="min-h-screen animate-fade-in relative z-10" style={{ paddingBottom: 100 }}>

      {/* ── 1. Hero Section ────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl">
            <div
              className="inline-block px-4 py-2 rounded-full mb-6 text-sm font-bold tracking-wide"
              style={{ background: 'rgba(197, 160, 89, 0.15)', color: '#A07830', border: '1px solid rgba(197, 160, 89, 0.3)' }}
            >
              Welcome to ShopSmart
            </div>
            <h1
              className="font-bold mb-6"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 'clamp(40px, 6vw, 72px)',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
                color: '#000000',
                textShadow: '0 1px 4px rgba(255,255,255,0.8)',
              }}
            >
              Shop <span className="gradient-text">Smarter</span>,<br />Live Better.
            </h1>
            <p
              className="text-xl mb-10 leading-relaxed font-medium"
              style={{ color: '#222222', textShadow: '0 1px 3px rgba(255,255,255,0.6)' }}
            >
              A curated collection of physical goods, digital assets, and premium subscriptions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#catalog" className="btn-primary" style={{ padding: '16px 36px', fontSize: 16 }}>
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Featured Products ──────────────────────────────── */}
      <section id="catalog" className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="label-upper mb-2">Explore the Catalog</p>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 36,
                letterSpacing: '-0.03em',
                color: '#000000',
                textShadow: '0 1px 3px rgba(255,255,255,0.5)',
              }}
            >
              Featured Products
            </h2>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} className="category-pill">{cat}</button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <div className="card text-center py-16" style={{ background: 'rgba(255,255,255,0.9)', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 16, fontWeight: 600, color: '#000000' }}>No products found.</p>
            <p style={{ fontSize: 13, marginTop: 8, color: '#444444' }}>
              Ensure the API server is running locally on port 8080.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: any, i: number) => {
              const rawKind = product.kind || 'PHYSICAL';
              const kindKey = rawKind.charAt(0).toUpperCase() + rawKind.slice(1).toLowerCase();
              const meta    = KIND_META[kindKey] || KIND_META['Physical'];
              return (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="group card animate-slide-up"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    textDecoration: 'none',
                    animationDelay: `${i * 50}ms`,
                    padding: 12,
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(0,0,0,0.10)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
                  }}
                >
                  <div
                    className="product-image-box mb-5"
                    style={{
                      position: 'relative',
                      width: '100%',
                      aspectRatio: '4/3',
                      borderRadius: 12,
                      overflow: 'hidden',
                      marginBottom: 16,
                      padding: '16px',
                      background: 'var(--bg-elevated)',
                    }}
                  >
                    {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
                      <img
                        src={encodeURI(product.image)}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>
                        {product.image || '📦'}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className={`badge ${meta.color}`}>{meta.icon} {meta.label}</span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, color: '#000000', marginBottom: 6, lineHeight: 1.3 }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: 13, color: '#444444', lineHeight: 1.5, marginBottom: 8, flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: 12, borderTop: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: '#1A1A1A' }}>₹{product.price}</div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#A07830' }}>View →</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── 3. Payment Methods ────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6 pb-16">
        <div className="card text-center" style={{ padding: '40px 24px', background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <p className="label-upper mb-4">Secure Payments</p>
          <h3 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', marginBottom: 28, letterSpacing: '-0.02em' }}>
            All Major Payment Methods Accepted
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center', alignItems: 'center' }}>
            {['UPI', 'PhonePe', 'Razorpay', 'BHIM', 'Google Pay', 'Paytm'].map(pm => (
              <div
                key={pm}
                style={{
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  padding: '10px 20px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#3C3C3C',
                }}
              >
                {pm}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
