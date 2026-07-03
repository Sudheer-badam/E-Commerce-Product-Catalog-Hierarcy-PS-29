'use client';
import React from 'react';
import { useCartStore } from '../../store/useCartStore';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();
  const total = getCartTotal();
  const tax = total * 0.18;

  return (
    <div className="min-h-screen py-10 px-6 animate-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-black text-white">Your Cart</h1>
            <p className="text-gray-500 mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={clearCart} className="text-red-400 hover:text-red-300 text-sm font-medium btn-ghost border border-red-500/20">
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center">
            <div className="text-7xl mb-6">🛒</div>
            <h2 className="text-2xl font-bold text-white mb-3">Your cart is empty</h2>
            <p className="text-gray-500 mb-8">Looks like you haven't added anything yet!</p>
            <Link href="/" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="glass-card flex items-center gap-6">
                  <div className="w-16 h-16 rounded-xl bg-white/5 flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden" style={{ padding: '6px' }}>
                    {item.image && typeof item.image === 'string' && item.image.startsWith('/') ? (
                      <img src={encodeURI(item.image)} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                      item.image
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-white text-sm truncate">{item.name}</h3>
                    <p className="text-indigo-400 font-semibold mt-1">₹{item.price}</p>
                  </div>
                  <div className="flex items-center glass rounded-xl overflow-hidden border border-white/10">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">−</button>
                    <span className="px-4 py-2 text-white font-bold text-sm border-x border-white/10">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-2 text-gray-400 hover:text-white hover:bg-white/10 transition-colors">+</button>
                  </div>
                  <div className="text-right ml-2">
                    <p className="font-black text-white">₹{(item.price * item.quantity).toFixed(2)}</p>
                    <button onClick={() => removeItem(item.id)} className="text-red-400 hover:text-red-300 text-xs mt-1">Remove</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="glass-card h-fit sticky top-24">
              <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span><span className="text-white">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax</span><span className="text-white">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Shipping</span><span className="text-green-400">Free</span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between font-black text-lg">
                  <span className="text-white">Total</span>
                  <span className="gradient-text">₹{(total + tax).toFixed(2)}</span>
                </div>
              </div>

              {/* Coupon */}
              <div className="flex gap-2 mb-6">
                <input placeholder="Coupon code" className="flex-1 bg-white/5 border border-white/10 text-white text-sm rounded-xl px-4 py-2 outline-none focus:border-indigo-500 placeholder-gray-600 transition-colors"/>
                <button className="btn-ghost border border-white/10 text-sm px-4">Apply</button>
              </div>

              <Link href="/checkout" className="btn-primary w-full text-center block">
                Proceed to Checkout →
              </Link>

              <p className="text-center text-gray-600 text-xs mt-4">🔒 Secure & Encrypted Checkout</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
