'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function UserOrdersPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (!user?.uid) return;
    if (showRefresh) setRefreshing(true);
    try {
      const res = await fetch(`https://shop-smart-api-production.up.railway.app/orders/user/${user.uid}`, {
        cache: 'no-store',
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    if (user === undefined) return;
    if (user === null) {
      router.push('/login');
      return;
    }
    fetchOrders();
    // Poll every 10 seconds so new orders / status changes appear automatically
    const interval = setInterval(() => fetchOrders(), 10000);
    return () => clearInterval(interval);
  }, [user, router, fetchOrders]);

  const requestReturn = async (orderId: string) => {
    try {
      const res = await fetch(`https://shop-smart-api-production.up.railway.app/orders/${orderId}/request-return`, { method: 'PATCH' });
      if (res.ok) {
        await fetchOrders();
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
      <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, border: '4px solid #C5A059', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }}></div>
          <p style={{ color: '#4A4A4A', fontSize: 14 }}>Loading your orders…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '48px 24px' }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: '#111111', margin: 0, lineHeight: 1 }}>
              Your Orders
            </h1>
            <p style={{ color: '#4A4A4A', fontSize: 14, marginTop: 8, fontWeight: 500 }}>
              Track your recent purchases and delivery status.
            </p>
          </div>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '10px 20px', borderRadius: 12,
              border: '2px solid #C5A059', background: 'transparent', color: '#C5A059',
              fontSize: 13, fontWeight: 700, cursor: refreshing ? 'not-allowed' : 'pointer',
              opacity: refreshing ? 0.6 : 1, transition: 'all 0.2s',
            }}
          >
            {refreshing ? '↻ Refreshing…' : '↻ Refresh Orders'}
          </button>
        </div>

        {orders.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 24, padding: 60, textAlign: 'center', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🛍️</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111111', marginBottom: 8 }}>No orders found</h2>
            <p style={{ color: '#4A4A4A', marginBottom: 24 }}>Looks like you haven't made any purchases yet.</p>
            <button onClick={() => router.push('/')} style={{ padding: '12px 32px', borderRadius: 14, background: '#C5A059', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer' }}>
              Start Shopping
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order.id} style={{ background: '#fff', borderRadius: 24, overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                {/* Card header */}
                <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(0,0,0,0.07)', background: '#F9F8F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#4A4A4A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                    <p style={{ fontSize: 13, color: '#111111', margin: '4px 0 0', fontWeight: 500 }}>
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Kolkata' })}
                      {' at '}
                      {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#4A4A4A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Total</p>
                    <p style={{ fontSize: 18, fontWeight: 900, color: '#C5A059', margin: '2px 0 0' }}>₹{order.totalAmount.toFixed(2)}</p>
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

                  {/* Items list */}
                  <div>
                    <p style={{ fontSize: 11, fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Items Ordered</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {(order.items || []).map((item: any, i: number) => (
                        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                          <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F3F4F6', flexShrink: 0, overflow: 'hidden' }}>
                            {item.image && <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
                          </div>
                          <div>
                            <p style={{ fontSize: 13, fontWeight: 700, color: '#111111', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 180 }}>{item.name || 'Product'}</p>
                            <p style={{ fontSize: 12, color: '#4A4A4A', margin: '2px 0 0' }}>Qty: {item.quantity || 1} × ₹{Number(item.price || 0).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status section */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

                    {/* Order Status + Return Button */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>Order Status</p>
                        {order.orderStatus === 'Delivered' && order.isReturnEnabled && (
                          <button
                            onClick={() => { if (window.confirm('Request a return for this order?')) requestReturn(order.id); }}
                            style={{ padding: '6px 14px', borderRadius: 10, border: '2px solid #C5A059', color: '#C5A059', background: 'transparent', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                          >
                            Return Item
                          </button>
                        )}
                      </div>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                        background: order.orderStatus === 'Delivered' ? '#DCFCE7' : order.orderStatus === 'Shipped' ? '#DBEAFE' : order.orderStatus === 'Cancelled' ? '#FEE2E2' : order.orderStatus === 'Return Requested' ? '#EDE9FE' : '#F3F4F6',
                        color: order.orderStatus === 'Delivered' ? '#166534' : order.orderStatus === 'Shipped' ? '#1e40af' : order.orderStatus === 'Cancelled' ? '#991B1B' : order.orderStatus === 'Return Requested' ? '#6d28d9' : '#374151',
                      }}>
                        {order.orderStatus === 'Shipped' ? '📦 Shipped'
                          : order.orderStatus === 'Delivered' ? '✅ Delivered'
                          : order.orderStatus === 'Confirmed' ? '👍 Confirmed'
                          : order.orderStatus === 'Cancelled' ? '❌ Cancelled'
                          : order.orderStatus === 'Return Requested' ? '🔄 Return Pending'
                          : '⏳ Processing'}
                      </div>
                    </div>

                    {/* Tracking ID */}
                    {order.trackingId && (
                      <div style={{ padding: '12px 16px', borderRadius: 12, border: '1.5px solid rgba(197,160,89,0.35)', background: '#FFFBEB' }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: '#4A4A4A', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>Tracking ID</p>
                        <p style={{ fontFamily: 'monospace', fontSize: 15, fontWeight: 800, color: '#C5A059', margin: 0 }}>
                          🚚 {order.trackingId}
                        </p>
                      </div>
                    )}

                    {/* Payment Status */}
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, color: '#111111', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Payment Status</p>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 12, fontSize: 13, fontWeight: 700,
                        background: order.paymentStatus === 'Paid' ? '#DCFCE7' : order.paymentStatus === 'Rejected' ? '#FEE2E2' : '#FEF3C7',
                        color: order.paymentStatus === 'Paid' ? '#166534' : order.paymentStatus === 'Rejected' ? '#991B1B' : '#92400E',
                      }}>
                        {order.paymentStatus === 'Paid' ? '✅ Paid' : order.paymentStatus === 'Rejected' ? '❌ Rejected' : '⏳ Pending Approval'}
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
