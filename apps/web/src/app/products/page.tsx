import React from 'react';
import Link from 'next/link';

const CATEGORIES = ['All', 'Electronics', 'Software', 'Services', 'Education'];

const KIND_META: Record<string, { icon: string; color: string; label: string }> = {
  Physical:     { icon: '📦', color: 'badge-green',  label: 'Physical' },
  Digital:      { icon: '⚡', color: 'badge-blue',   label: 'Digital' },
  Subscription: { icon: '🔄', color: 'badge-amber',  label: 'Subscription' },
};

export default async function ProductsPage() {
  let products: any[] = [];
  const urls = [
    'https://shop-smart-api-production.up.railway.app',
    process.env.NEXT_PUBLIC_API_URL,
    'http://127.0.0.1:8080',
  ].filter(Boolean) as string[];

  for (const base of urls) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${base}/products`, { cache: 'no-store', signal: controller.signal });
      clearTimeout(tid);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) { products = data; break; }
      }
    } catch {
      // try next
    }
  }

  return (
    <div className="min-h-screen animate-fade-in py-12 relative z-10">
      <section className="max-w-7xl mx-auto px-6">

        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="label-upper mb-2">Our Collection</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, letterSpacing: '-0.03em', color: '#1A1A1A', textShadow: '0 1px 4px rgba(255,255,255,0.7)' }}>
              All Products
            </h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} className="category-pill">{cat}</button>
            ))}
          </div>
        </div>

        {/* Type Legend */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {Object.entries(KIND_META).map(([key, { icon, label }]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#3C3C3C', background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.12)', padding: '5px 12px', borderRadius: 99, fontWeight: 600 }}>
              <span>{icon}</span> <strong style={{ color: '#1A1A1A', fontWeight: 700 }}>{label}</strong>
            </div>
          ))}
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div style={{ background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 16, textAlign: 'center', padding: '64px 24px' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
            <p style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A' }}>No products found.</p>
            <p style={{ fontSize: 13, marginTop: 8, color: '#5C5C5C' }}>Ensure the API server is running.</p>
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
                  className="group animate-slide-up"
                  style={{
                    display: 'flex', flexDirection: 'column', textDecoration: 'none',
                    animationDelay: `${i * 60}ms`,
                    background: '#FFFFFF',
                    border: '1.5px solid rgba(0,0,0,0.09)',
                    borderRadius: 16,
                    padding: 16,
                    boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {/* Image */}
                  <div style={{ height: 200, borderRadius: 12, background: '#F4F1EA', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 16, transition: 'transform 0.3s ease' }}>
                    {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
                      <img src={encodeURI(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    ) : (
                      <span style={{ fontSize: 64 }}>{product.image || '📦'}</span>
                    )}
                  </div>

                  {/* Badges */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className={`badge ${meta.color}`}>{meta.icon} {meta.label}</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 700, background: product.stock > 0 ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)', color: product.stock > 0 ? '#166534' : '#991b1b', border: `1px solid ${product.stock > 0 ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}` }}>
                      {product.stock > 0 ? '● In Stock' : '○ Out of Stock'}
                    </span>
                  </div>

                  {/* Category */}
                  <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A07830', marginBottom: 6 }}>{product.category}</p>

                  {/* Name */}
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: '#111111', marginBottom: 8, lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                    {product.name}
                  </h3>

                  {/* Description */}
                  <p style={{ fontSize: 13, color: '#4A4A4A', lineHeight: 1.6, flex: 1, marginBottom: 16, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                  </p>

                  {/* Price row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(0,0,0,0.08)', marginTop: 'auto' }}>
                    <div style={{ fontSize: 24, fontWeight: 900, color: '#111111', letterSpacing: '-0.03em' }}>
                      ₹{product.price}
                    </div>
                    <span style={{ background: '#C5A059', color: '#fff', fontSize: 13, fontWeight: 700, padding: '8px 18px', borderRadius: 10 }}>
                      View →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
