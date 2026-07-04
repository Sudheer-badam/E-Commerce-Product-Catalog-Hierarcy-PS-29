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
    fetch(`https://shop-smart-api-production.up.railway.app/products`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.id === params.id);
        if (found) {
          // Mock tax/delivery logic for frontend display, real logic is in backend
          found.tax = found.price * 0.18;
          found.deliveryMethod = found.kind === 'PHYSICAL' ? 'Ships in 2-3 days' : 'Instant Delivery';
          setProduct(found);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
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

  const kindCapitalized = product.kind.charAt(0).toUpperCase() + product.kind.slice(1).toLowerCase();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <Link href="/" className="btn-ghost text-sm mb-8 inline-flex items-center gap-2">
        ← Back to Catalog
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

        {/* Image Panel */}
        <div className="glass rounded-3xl h-96 flex items-center justify-center text-9xl sticky top-24 overflow-hidden" style={{ padding: '32px' }}>
          {product.image && typeof product.image === 'string' && product.image.startsWith('/') ? (
            <img src={encodeURI(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '16px' }} />
          ) : (
            product.image
          )}
        </div>

        {/* Info Panel */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className={`badge border ${KIND_COLOR[kindCapitalized] || 'bg-gray-500/20 text-gray-400'}`}>
              {kindCapitalized} Product
            </span>
            <span className="text-sm text-gray-500">{product.category}</span>
          </div>

          <h1 className="text-4xl font-black text-white mb-4 leading-tight">{product.name}</h1>

          <div className="text-5xl font-black gradient-text mb-2">₹{product.price}</div>
          {product.tax > 0 && (
            <p className="text-gray-500 text-sm mb-6">+ ₹{product.tax.toFixed(2)} GST/Tax</p>
          )}

          <p className="text-gray-400 text-lg leading-relaxed mb-8">{product.description}</p>

          {/* OOP Delivery Info */}
          <div className="glass rounded-xl p-4 mb-8 border-l-4 border-indigo-500">
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Delivery Method</p>
            <p className="text-gray-300 text-sm">{product.deliveryMethod}</p>
            {product.weight > 0 && (
              <p className="text-gray-500 text-xs mt-1">Weight: {product.weight}kg</p>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-8">
            <span className="text-sm text-gray-400 font-medium">Quantity</span>
            <div className="flex items-center glass rounded-xl overflow-hidden">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-white/10 transition-colors text-lg">−</button>
              <span className="px-6 py-3 font-bold text-white border-x border-white/10">{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="px-4 py-3 hover:bg-white/10 transition-colors text-lg">+</button>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={handleAddToCart}
              className={`btn-primary flex-1 text-center flex items-center justify-center gap-2 transition-all ${added ? 'bg-green-600 from-green-600 to-green-600 shadow-green-500/25' : ''}`}>
              {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
            </button>
            <Link href="/checkout" className="flex-1 text-center btn-ghost border border-white/20 text-white py-3 rounded-xl font-semibold hover:border-white/40">
              Buy Now →
            </Link>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3 mt-10 text-center">
            {[['🔒', 'Secure Payment'], ['↩️', 'Easy Returns'], ['⚡', 'Fast Support']].map(([icon, label]) => (
              <div key={label} className="glass rounded-xl p-3">
                <div className="text-xl mb-1">{icon}</div>
                <div className="text-xs text-gray-500">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
