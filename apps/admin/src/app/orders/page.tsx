'use client';
import React, { useState, useEffect } from 'react';
import ClockIST from '../../components/ClockIST';
import AdminInvoiceModal from '../../components/AdminInvoiceModal';

const PAYMENT_BADGE: Record<string, string> = {
  Paid:     'badge-green',
  Pending:  'badge-amber',
  Rejected: 'badge-red',
  Refunded: 'badge-gray',
};

const ORDER_BADGE: Record<string, string> = {
  Pending:          'badge-gray',
  Confirmed:        'badge-blue',
  Shipped:          'badge-blue',
  Delivered:        'badge-green',
  Cancelled:        'badge-red',
  'Return Requested': 'badge-amber',
};

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function formatDateGroup(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(dateStr)) return 'Today';
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (d.getDate() === yesterday.getDate() && d.getMonth() === yesterday.getMonth() && d.getFullYear() === yesterday.getFullYear()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [toast, setToast] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('all');

  const fetchOrders = async () => {
    try {
      const res = await fetch('https://shop-smart-api-production.up.railway.app/orders');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const approvePayment = async (id: string) => {
    try {
      await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Paid' })
      });
      await fetchOrders();
    } catch (e) { console.error(e); }
  };

  const rejectPayment = async (id: string) => {
    try {
      await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Rejected' })
      });
      await fetchOrders();
    } catch (e) { console.error(e); }
  };

  const dispatchOrder = async (id: string) => {
    try {
      await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/dispatch`, { method: 'PATCH' });
      // Always refetch so trackingId is populated from server
      await fetchOrders();
      setToast('📦 Order dispatched! Tracking ID generated.');
      setTimeout(() => setToast(''), 4000);
    } catch (e) { console.error(e); }
  };

  const markDelivered = async (id: string) => {
    try {
      await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/deliver`, { method: 'PATCH' });
      await fetchOrders();
    } catch (e) { console.error(e); }
  };

  const enableReturn = async (id: string) => {
    try {
      await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/enable-return`, { method: 'PATCH' });
      await fetchOrders();
      setToast('✅ Returns enabled for this order!');
      setTimeout(() => setToast(''), 3000);
    } catch (e) { console.error(e); }
  };

  const sendInvoice = async (id: string) => {
    try {
      const res = await fetch(`https://shop-smart-api-production.up.railway.app/orders/${id}/send-invoice`, { method: 'POST' });
      if (res.ok) {
        setToast('✅ Invoice sent to customer!');
        setTimeout(() => setToast(''), 3000);
      }
    } catch (e) { console.error(e); }
  };

  // Filter + group orders
  const filteredOrders = activeTab === 'today'
    ? orders.filter(o => isToday(o.createdAt))
    : orders;

  // Group by date
  const grouped: Record<string, any[]> = {};
  filteredOrders.forEach(order => {
    const key = formatDateGroup(order.createdAt);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(order);
  });

  const todayCount = orders.filter(o => isToday(o.createdAt)).length;

  const renderOrderRow = (order: any) => (
    <tr key={order.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.015)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ padding: '14px 20px' }}>
        <div>
          <span style={{ fontFamily: 'monospace', fontSize: 12, color: 'var(--amber)', fontWeight: 600 }}>
            #{order.id.substr(0, 8).toUpperCase()}
          </span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>
            🕐 {formatTime(order.createdAt)}
          </div>
        </div>
      </td>
      <td style={{ padding: '14px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
          {order.customerId.split(' | ')[0] || 'Unknown'}
        </div>
        {order.customerId.split(' | ')[1] && order.customerId.split(' | ')[1] !== 'N/A' && (
          <a href={`tel:${order.customerId.split(' | ')[1].replace(/\s/g, '')}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: '#60A5FA', textDecoration: 'none', fontWeight: 600, padding: '2px 6px', background: 'rgba(96,165,250,0.1)', borderRadius: 4 }}>
            📞 {order.customerId.split(' | ')[1]}
          </a>
        )}
        {order.customerId.split(' | ')[2] && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, marginLeft: 4, fontSize: 11, color: 'var(--amber)', fontWeight: 600, padding: '2px 6px', background: 'rgba(245,158,11,0.1)', borderRadius: 4 }}>
            💳 {order.customerId.split(' | ')[2].replace(/\s*\|.*/, '')}
          </div>
        )}
        {(() => {
          const parts = order.customerId.split(' | ');
          const addrPart = parts.find((p: string) => p.startsWith('ADDR:'));
          const txnPart  = parts.find((p: string) => p.startsWith('TXN:'));
          return (
            <>
              {addrPart && addrPart.replace('ADDR:', '').trim() !== 'N/A' && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginTop: 5, fontSize: 11, color: '#86EFAC', fontWeight: 500, padding: '3px 7px', background: 'rgba(134,239,172,0.08)', borderRadius: 4, border: '1px solid rgba(134,239,172,0.2)' }}>
                  📍 {addrPart.replace('ADDR:', '').trim()}
                </div>
              )}
              {txnPart && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, fontSize: 11, color: '#A78BFA', fontWeight: 600, padding: '3px 7px', background: 'rgba(167,139,250,0.1)', borderRadius: 4, border: '1px solid rgba(167,139,250,0.2)', fontFamily: 'monospace' }}>
                  🔑 {txnPart}
                </div>
              )}
            </>
          );
        })()}
      </td>
      <td style={{ padding: '14px 20px', fontSize: 13, color: 'var(--text-secondary)' }}>
        {order.items?.length || 0} items
      </td>
      <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: 14, color: 'var(--text-primary)' }}>
        ₹{order.totalAmount?.toFixed(2)}
      </td>
      <td style={{ padding: '14px 20px' }}>
        <span className={`badge ${PAYMENT_BADGE[order.paymentStatus] || 'badge-gray'}`}>
          {order.paymentStatus}
        </span>
        {order.paymentScreenshotUrl && (
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>📸 Screenshot</div>
        )}
      </td>
      <td style={{ padding: '14px 20px' }}>
        <span className={`badge ${ORDER_BADGE[order.orderStatus] || 'badge-gray'}`}>
          {order.orderStatus}
        </span>
        {order.trackingId && (
          <div style={{ marginTop: 6, fontSize: 11, fontFamily: 'monospace', color: 'var(--amber)', background: 'rgba(245,158,11,0.1)', padding: '4px 8px', borderRadius: 4, display: 'inline-block', border: '1px solid rgba(245,158,11,0.2)' }}>
            🚚 {order.trackingId}
          </div>
        )}
      </td>
      <td style={{ padding: '14px 20px' }}>
        {order.paymentStatus === 'Pending' && order.paymentScreenshotUrl ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => approvePayment(order.id)} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px' }}>
              ✓ Approve
            </button>
            <button onClick={() => rejectPayment(order.id)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#F87171', border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer', fontWeight: 600 }}>
              ✕ Reject
            </button>
          </div>
        ) : order.paymentStatus === 'Pending' && !order.paymentScreenshotUrl ? (
          <span style={{ fontSize: 12, color: '#FB923C' }}>Awaiting screenshot</span>
        ) : order.orderStatus === 'Confirmed' ? (
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <button onClick={() => dispatchOrder(order.id)} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px', background: 'var(--amber)', color: '#0D0D0F' }}>
              📦 Dispatch Item
            </button>
            <button onClick={() => setSelectedInvoiceOrder(order)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}>
              📄 View Invoice
            </button>
          </div>
        ) : order.orderStatus === 'Shipped' ? (
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            <button onClick={() => markDelivered(order.id)} className="btn-primary" style={{ fontSize: 12, padding: '6px 14px', background: '#16a34a', color: '#fff' }}>
              ✅ Mark Delivered
            </button>
            <button onClick={() => setSelectedInvoiceOrder(order)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}>
              📄 View Invoice
            </button>
          </div>
        ) : order.orderStatus === 'Delivered' ? (
          <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
            {!order.isReturnEnabled ? (
              <button onClick={() => enableReturn(order.id)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: 'rgba(167,139,250,0.1)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.2)', cursor: 'pointer', fontWeight: 600 }}>
                🔄 Enable Return
              </button>
            ) : (
              <span style={{ fontSize: 11, color: '#A78BFA', fontWeight: 700, padding: '4px 8px', background: 'rgba(167,139,250,0.1)', borderRadius: 6, textAlign: 'center' }}>✓ Returns Allowed</span>
            )}
            <button onClick={() => setSelectedInvoiceOrder(order)} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontWeight: 600 }}>
              📄 View Invoice
            </button>
          </div>
        ) : order.orderStatus === 'Return Requested' ? (
          <span style={{ fontSize: 12, color: '#A78BFA', fontWeight: 'bold', padding: '4px 8px', background: 'rgba(167,139,250,0.1)', borderRadius: 6, display: 'inline-block' }}>
            🔄 Return Pending
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</span>
        )}
      </td>
    </tr>
  );

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 28, position: 'relative' }}>
      <AdminInvoiceModal order={selectedInvoiceOrder} onClose={() => setSelectedInvoiceOrder(null)} onSend={sendInvoice} />

      {toast && (
        <div style={{ position: 'fixed', top: 80, right: 32, zIndex: 9999, background: '#4ADE80', color: '#0D0D0F', padding: '12px 24px', borderRadius: 12, fontWeight: 700, boxShadow: '0 8px 32px rgba(74,222,128,0.3)', animation: 'slide-up 0.3s ease-out' }}>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
            {activeTab === 'today' ? "Today's Orders" : 'All Orders'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {activeTab === 'today' ? `${todayCount} order${todayCount !== 1 ? 's' : ''} placed today` : `${orders.length} total order${orders.length !== 1 ? 's' : ''}`}
            </p>
            <ClockIST />
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 8, background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, border: '1px solid var(--border)' }}>
          <button
            onClick={() => setActiveTab('today')}
            style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: activeTab === 'today' ? 'var(--amber)' : 'transparent',
              color: activeTab === 'today' ? '#0D0D0F' : 'var(--text-muted)'
            }}
          >
            Today {todayCount > 0 && <span style={{ marginLeft: 4, fontSize: 11, background: activeTab === 'today' ? 'rgba(0,0,0,0.2)' : 'rgba(245,158,11,0.2)', color: activeTab === 'today' ? '#0D0D0F' : 'var(--amber)', padding: '1px 6px', borderRadius: 99 }}>{todayCount}</span>}
          </button>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: 'none', transition: 'all 0.2s',
              background: activeTab === 'all' ? 'var(--amber)' : 'transparent',
              color: activeTab === 'all' ? '#0D0D0F' : 'var(--text-muted)'
            }}
          >
            All Orders
          </button>
        </div>
      </div>

      {/* Orders Table grouped by date */}
      {Object.keys(grouped).length === 0 ? (
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
          {activeTab === 'today' ? '📭 No orders placed today yet.' : '📭 No orders yet.'}
        </div>
      ) : (
        Object.entries(grouped).map(([dateLabel, groupOrders]) => (
          <div key={dateLabel} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            {/* Date group header */}
            <div style={{ padding: '10px 20px', background: 'rgba(245,158,11,0.07)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--amber)', letterSpacing: '0.02em' }}>
                {dateLabel === 'Today' ? '📅 Today' : dateLabel === 'Yesterday' ? '📅 Yesterday' : `📅 ${dateLabel}`}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: 99 }}>
                {groupOrders.length} order{groupOrders.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    {['Order ID & Time', 'Customer', 'Items', 'Amount', 'Payment', 'Order Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {groupOrders.map(order => renderOrderRow(order))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
