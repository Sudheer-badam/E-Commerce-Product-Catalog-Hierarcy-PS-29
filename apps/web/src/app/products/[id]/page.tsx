'use client';
import React, { useEffect, useState } from 'react';
import { useCartStore } from '../../../store/useCartStore';
import Link from 'next/link';


const KIND_COLOR: Record<string, string> = {
  Physical: 'bg-green-500/20 text-green-400 border-green-500/30',
  Digital: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Subscription: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
};

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const urls = [
      'https://shop-smart-api-production.up.railway.app',
      process.env.NEXT_PUBLIC_API_URL,
      'http://127.0.0.1:8080',
    ].filter(Boolean) as string[];

    const tryFetch = async () => {
      for (const base of urls) {
        try {
          const controller = new AbortController();
          const tid = setTimeout(() => controller.abort(), 15000);
          const res = await fetch(`${base}/products`, { signal: controller.signal });
          clearTimeout(tid);
          if (res.ok) {
            const data = await res.json();
            const found = data.find((p: any) => p.id === params.id);
            if (found) {
              found.tax = found.price * 0.18;
              found.deliveryMethod = found.kind === 'PHYSICAL' ? 'Ships in 2-3 days' : 'Instant Delivery';
              setProduct(found);
              setLoading(false);
              return;
            }
          }
        } catch {
          // try next
        }
      }
      setLoading(false);
    };
    tryFetch();
  }, [params.id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div></div>;

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center text-gray-400">
      <div className="text-6xl mb-4">🔍</div>
      <h2 className="text-2xl font-bold text-white mb-2">Product Not Found</h2>
      <Link href="/" className="btn-primary mt-4">← Back to Store</Link>
    </div>
  );

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const rawKind = product.kind || 'PHYSICAL';
  const kindCapitalized = rawKind.charAt(0).toUpperCase() + rawKind.slice(1).toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in relative z-10">
      <Link href="/" className="btn-ghost text-sm mb-8 inline-flex items-center gap-2" style={{ color: '#3C3C3C', fontWeight: 600 }}>
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Image Panel */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 24, height: 380, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 32, position: 'sticky', top: 96, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
            <img src={encodeURI(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
          ) : (
            <span style={{ fontSize: 96 }}>{product.image || '📦'}</span>
          )}
        </div>

        {/* Info Panel */}
        <div style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.09)', borderRadius: 24, padding: 32, boxShadow: '0 4px 24px rgba(0,0,0,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <span className={`badge border ${KIND_COLOR[kindCapitalized] || 'bg-gray-500/20 text-gray-400'}`}>
              {kindCapitalized} Product
            </span>
            <span style={{ fontSize: 13, color: '#5C5C5C', fontWeight: 500 }}>{product.category}</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#111111', marginBottom: 16, lineHeight: 1.2, letterSpacing: '-0.02em' }}>{product.name}</h1>

          <div style={{ fontSize: 42, fontWeight: 900, color: '#C5A059', marginBottom: 4, letterSpacing: '-0.03em' }}>₹{product.price}</div>
          {product.tax > 0 && (
            <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 20 }}>+ ₹{product.tax.toFixed(2)} GST/Tax</p>
          )}

          <p style={{ color: '#3C3C3C', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>{product.description}</p>

          {/* Delivery Info */}
          <div style={{ background: '#F4F1EA', borderRadius: 12, padding: 16, marginBottom: 24, borderLeft: '4px solid #6366F1' }}>
            <p style={{ fontSize: 11, color: '#6366F1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Delivery Method</p>
            <p style={{ color: '#1A1A1A', fontSize: 14, fontWeight: 600 }}>{product.deliveryMethod}</p>
            {product.weight > 0 && (
              <p style={{ color: '#6B7280', fontSize: 12, marginTop: 4 }}>Weight: {product.weight}kg</p>
            )}
          </div>

          {/* Quantity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <span style={{ fontSize: 14, color: '#3C3C3C', fontWeight: 600 }}>Quantity</span>
            <div style={{ display: 'flex', alignItems: 'center', background: '#F4F1EA', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ padding: '12px 18px', fontSize: 18, fontWeight: 700, color: '#1A1A1A', background: 'transparent', border: 'none', cursor: 'pointer' }}>−</button>
              <span style={{ padding: '12px 20px', fontWeight: 800, color: '#111111', fontSize: 16, borderLeft: '1px solid rgba(0,0,0,0.08)', borderRight: '1px solid rgba(0,0,0,0.08)' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ padding: '12px 18px', fontSize: 18, fontWeight: 700, color: '#1A1A1A', background: 'transparent', border: 'none', cursor: 'pointer' }}>+</button>
            </div>
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }} className="sm:flex-row">
            <button
              onClick={handleAddToCart}
              className="btn-primary flex-1"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 24px', fontSize: 15, background: added ? '#16a34a' : undefined }}
            >
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <Link href="/checkout" style={{ flex: 1, textAlign: 'center', padding: '14px 24px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.15)', color: '#1A1A1A', fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              Buy Now →
            </Link>
          </div>

          {/* Trust badges */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginTop: 24 }}>
            {[['🔒', 'Secure Payment'], ['↩️', 'Easy Returns'], ['⚡', 'Fast Support']].map(([icon, label]) => (
              <div key={label} style={{ background: '#F4F1EA', borderRadius: 12, padding: 12, textAlign: 'center', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <div style={{ fontSize: 11, color: '#3C3C3C', fontWeight: 600 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
