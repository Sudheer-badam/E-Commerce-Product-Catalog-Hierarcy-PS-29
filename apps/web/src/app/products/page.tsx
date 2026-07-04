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
  try {
    const res = await fetch('https://shop-smart-api-production.up.railway.app/products', { cache: 'no-store' });
    if (res.ok) products = await res.json();
  } catch (e) {
    console.error('Failed to fetch products:', e);
  }

  return (
    <div className="min-h-screen animate-fade-in py-12">
      <section className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
          <div>
            <p className="label-upper mb-2">Our Collection</p>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              All Products
            </h1>
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
                  <div className="product-image-box mb-5" style={{ padding: '16px' }}>
                    {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
                      <img src={encodeURI(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                    ) : (
                      product.image
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    <span className={`badge ${meta.color}`}>{meta.icon} {meta.label}</span>
                    <span className={`badge ${product.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                      {product.stock > 0 ? '● In Stock' : '○ Out of Stock'}
                    </span>
                  </div>

                  <p className="label-upper" style={{ marginBottom: 6 }}>{product.category}</p>

                  <h3 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8, lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1, marginBottom: 16, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {product.description}
                  </p>

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
    </div>
  );
}
