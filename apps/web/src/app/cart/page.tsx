'use client';
import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();
  const tax = total * 0.18;

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in relative z-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-[#111111]" style={{ letterSpacing: '-0.02em' }}>Your Cart</h1>
            <p className="text-[#4A4A4A] mt-1 font-medium">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-[#dc2626] hover:text-[#b91c1c] text-sm font-bold border border-[#dc2626]/20 px-4 py-2 rounded-lg bg-[#dc2626]/5 transition-colors">
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl p-20 text-center" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-[#111111] mb-3">Your cart is empty</h2>
            <p className="text-[#4A4A4A] mb-8 font-medium">Looks like you haven't added anything yet!</p>
            <Link href="/" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-6 p-4 rounded-2xl" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden" style={{ padding: '6px', background: '#F4F1EA' }}>
                    {item.image && typeof item.image === 'string' && item.image.startsWith('/') ? (
                      <img src={encodeURI(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      item.image || '📦'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#111111] text-sm truncate">{item.name}</h3>
                    <p className="font-bold mt-1" style={{ color: '#C5A059' }}>₹{item.price}</p>
                  </div>
                  <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid rgba(0,0,0,0.08)', background: '#F4F1EA' }}>
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-2 text-[#111111] font-bold hover:bg-[rgba(0,0,0,0.05)] transition-colors">−</button>
                    <span className="px-4 py-2 font-black text-[#111111] text-sm" style={{ borderLeft: '1.5px solid rgba(0,0,0,0.08)', borderRight: '1.5px solid rgba(0,0,0,0.08)' }}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-[#111111] font-bold hover:bg-[rgba(0,0,0,0.05)] transition-colors">+</button>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-black text-[#111111]">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-[#dc2626] font-semibold text-xs mt-1 hover:underline">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="h-fit sticky top-24 rounded-3xl p-6" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' }}>
              <h3 className="text-lg font-black text-[#111111] mb-6">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between font-medium">
                  <span className="text-[#4A4A4A]">Subtotal</span><span className="text-[#111111] font-bold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#4A4A4A]">Estimated Tax</span><span className="text-[#111111] font-bold">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span className="text-[#4A4A4A]">Shipping</span><span className="text-[#16a34a] font-bold">Free</span>
                </div>
                <div className="pt-4 flex justify-between font-black text-lg" style={{ borderTop: '1.5px solid rgba(0,0,0,0.08)' }}>
                  <span className="text-[#111111]">Total</span>
                  <span style={{ color: '#C5A059' }}>₹{(total + tax).toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <input placeholder="Coupon code" className="flex-1 text-sm rounded-xl px-4 py-2 outline-none transition-colors" style={{ background: '#F4F1EA', border: '1.5px solid rgba(0,0,0,0.08)', color: '#111111', fontWeight: 500 }}/>
                <button className="text-sm px-5 rounded-xl font-bold transition-colors" style={{ border: '1.5px solid rgba(0,0,0,0.08)', color: '#111111', background: '#FFFFFF' }}>Apply</button>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block" style={{ padding: '14px' }}>
                Proceed to Checkout →
              </Link>

              <p className="text-center text-[#4A4A4A] font-medium text-xs mt-4 flex items-center justify-center gap-1">
                🔒 Secure & Encrypted Checkout
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
