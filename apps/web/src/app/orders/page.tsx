'use client';
import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function UserOrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.push('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch(`https://shop-smart-api-production.up.railway.app/orders/user/${user.uid}`);
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, router]);

  const requestReturn = async (orderId: string) => {
    try {
      const res = await fetch(`https://shop-smart-api-production.up.railway.app/orders/${orderId}/request-return`, { method: 'PATCH' });
      if (res.ok) {
        setOrders(o => o.map(order => order.id === orderId ? { ...order, orderStatus: 'Return Requested' } : order));
        alert('Return request submitted successfully!');
      } else {
        alert('Could not submit return request. Please contact support.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred. Please try again.');
    }
  };

  if (loading || user === undefined) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#C5A059] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in relative z-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-[#111111] mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>
          Your Orders
        </h1>
        <p className="text-[#4A4A4A] mb-8 font-medium">Track your recent purchases and delivery status.</p>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center" style={{ border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <div className="text-6xl mb-4">🛍️</div>
            <h2 className="text-xl font-bold text-[#111111] mb-2">No orders found</h2>
            <p className="text-[#4A4A4A] mb-6">Looks like you haven't made any purchases yet.</p>
            <button onClick={() => router.push('/')} className="btn-primary">
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-3xl overflow-hidden animate-slide-up" style={{ border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                {/* Header */}
                <div className="px-6 py-4 border-b border-[rgba(0,0,0,0.08)] bg-[#F9F8F6] flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">Order #{order.id.substring(0, 8).toUpperCase()}</p>
                    <p className="text-sm font-medium text-[#111111]">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="text-lg font-black text-[#C5A059]">₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Items */}
                    <div>
                      <h3 className="text-sm font-bold text-[#111111] mb-4 uppercase tracking-wider">Items</h3>
                      <div className="space-y-3">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex gap-4 items-center">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                              {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-[#111111] line-clamp-1">{item.name || 'Product'}</p>
                              <p className="text-xs text-[#4A4A4A] font-medium">Qty: {item.quantity || 1} × ₹{item.price?.toFixed(2)}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Status */}
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-sm font-bold text-[#111111] mb-3 uppercase tracking-wider">Order Status</h3>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold" 
                              style={{ 
                                background: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '#DCFCE7' : order.orderStatus === 'Cancelled' ? '#FEE2E2' : '#F3F4F6',
                                color: order.orderStatus === 'Shipped' || order.orderStatus === 'Delivered' ? '#166534' : order.orderStatus === 'Cancelled' ? '#991B1B' : '#374151'
                              }}>
                              {order.orderStatus === 'Shipped' ? '📦 Shipped' : order.orderStatus === 'Delivered' ? '✅ Delivered' : order.orderStatus === 'Confirmed' ? '👍 Confirmed' : order.orderStatus === 'Cancelled' ? '❌ Cancelled' : order.orderStatus === 'Return Requested' ? '🔄 Return Pending' : '⏳ Processing'}
                            </div>
                          </div>
                          {order.orderStatus === 'Delivered' && order.isReturnEnabled && (
                            <button 
                              onClick={() => {
                                if (window.confirm('Are you sure you want to request a return for this order?')) {
                                  requestReturn(order.id);
                                }
                              }}
                              className="px-4 py-2 rounded-xl text-sm font-bold transition-colors hover:opacity-80"
                              style={{ border: '2px solid #C5A059', color: '#C5A059', background: 'transparent' }}
                            >
                              Request Return
                            </button>
                          )}
                        </div>
                        
                        {order.trackingId && (
                          <div className="mt-4 p-4 rounded-xl border border-[rgba(197,160,89,0.3)] bg-[#FFFBEB]">
                            <p className="text-xs font-bold text-[#4A4A4A] uppercase tracking-wider mb-1">Tracking ID</p>
                            <p className="text-sm font-mono font-bold text-[#C5A059] flex items-center gap-2">
                              🚚 {order.trackingId}
                            </p>
                          </div>
                        )}
                      </div>

                      <div>
                        <h3 className="text-sm font-bold text-[#111111] mb-3 uppercase tracking-wider">Payment Status</h3>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                           style={{ 
                            background: order.paymentStatus === 'Paid' ? '#DCFCE7' : order.paymentStatus === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                            color: order.paymentStatus === 'Paid' ? '#166534' : order.paymentStatus === 'Rejected' ? '#991B1B' : '#92400E'
                          }}>
                          {order.paymentStatus === 'Paid' ? '✅ Paid' : order.paymentStatus === 'Rejected' ? '❌ Rejected' : '⏳ Pending'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
