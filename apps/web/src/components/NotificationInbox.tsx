'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface InvoiceData {
  orderId: string;
  shortId: string;
  name: string;
  phone: string;
  address: string;
  paymentMethod: string;
  transactionId: string;
  items: { name: string; price: number; quantity: number }[];
  totalAmount: number;
  paymentStatus: string;
  orderStatus: string;
  issuedAt: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'invoice' | 'alert';
  data?: any;
}

export default function NotificationInbox() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState<InvoiceData | null>(null);
  
  // Toast overlay state
  const [toastQueue, setToastQueue] = useState<NotificationItem[]>([]);

  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('shopsmart_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  // Save to localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('shopsmart_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const playChime = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioRef.current = ctx;
      const playTone = (freq: number, start: number, dur: number, vol = 0.4) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0, ctx.currentTime + start);
        gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };
      playTone(880, 0,    0.18);
      playTone(1100, 0.2, 0.18);
      playTone(1320, 0.4, 0.3);
    } catch (e) { /* silent fail */ }
  }, []);

  const addNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'time' | 'read'>) => {
    const newItem: NotificationItem = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      time: new Date().toISOString(),
      read: false,
    };
    
    setNotifications(prev => [newItem, ...prev]);
    setToastQueue(prev => [...prev, newItem]);
    playChime();
    
    // Auto remove toast after 5s
    setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== newItem.id));
    }, 5000);
  }, [playChime]);

  useEffect(() => {
    const socket = io('https://shop-smart-api-production.up.railway.app');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', 'support_room');
    });

    socket.on('invoice_received', (data: InvoiceData) => {
      addNotification({
        title: 'Invoice Received',
        message: `Your payment receipt for Order #${data.shortId} is ready.`,
        type: 'invoice',
        data
      });
    });

    socket.on('dispatch_alert', (data: { orderId: string, shortId: string }) => {
      addNotification({
        title: 'Order Dispatched',
        message: `Great news! Your Order #${data.shortId} has been dispatched.`,
        type: 'alert'
      });
    });

    return () => { socket.disconnect(); };
  }, [addNotification]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const downloadPdf = (invoice: InvoiceData) => {
    const element = document.getElementById('user-invoice-content');
    if (element) {
      const opt = {
        margin:       10,
        filename:     `ShopSmart-Invoice-${invoice.shortId}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          backgroundColor: '#0f0f13', 
          scrollY: 0, 
          scrollX: 0,
          windowWidth: element.scrollWidth,
          windowHeight: element.scrollHeight
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      if ((window as any).html2pdf) {
        (window as any).html2pdf().set(opt).from(element).save();
      } else {
        alert('PDF generator is loading... Please try again in a few seconds.');
      }
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        className="btn-ghost relative p-2" style={{ border: '1px solid var(--border)', borderRadius: 10 }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 bg-amber-500 text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0f0f13]">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Inbox Dropdown */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl z-50 overflow-hidden animate-slide-down"
          style={{ background: '#13131a', border: '1px solid var(--border)' }}
        >
          <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1a24]">
            <h3 className="font-bold text-sm text-white">Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={() => setNotifications([])} className="text-xs text-gray-400 hover:text-white">Clear All</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">No notifications yet</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} className="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => n.type === 'invoice' && setActiveInvoice(n.data)}>
                  <div className="flex justify-between items-start mb-1">
                    <p className={`font-semibold text-sm ${n.read ? 'text-gray-300' : 'text-amber-500'}`}>
                      {n.type === 'invoice' ? '📄 ' : '🔔 '}{n.title}
                    </p>
                    <span className="text-[10px] text-gray-500 font-mono">
                      {new Date(n.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Toast Overlays for active screen */}
      <div className="fixed top-24 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toastQueue.map(toast => (
          <div key={toast.id} className="w-80 bg-[#16213e] border border-amber-500/50 rounded-xl p-4 shadow-2xl pointer-events-auto animate-slide-left">
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                {toast.type === 'invoice' ? '📄' : '🔔'}
              </div>
              <div>
                <p className="text-sm font-bold text-amber-500 mb-1">{toast.title}</p>
                <p className="text-xs text-gray-300">{toast.message}</p>
                {toast.type === 'invoice' && (
                  <button 
                    onClick={() => { setActiveInvoice(toast.data); setToastQueue(q => q.filter(t => t.id !== toast.id)); }}
                    className="mt-3 text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20 hover:bg-amber-500/20"
                  >
                    View Invoice
                  </button>
                )}
              </div>
              <button onClick={() => setToastQueue(q => q.filter(t => t.id !== toast.id))} className="ml-auto self-start text-gray-500 hover:text-white">✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* Full Invoice Modal (Re-used here) */}
      {activeInvoice && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 10000,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
          }}
          onClick={() => setActiveInvoice(null)}
        >
          <div
            style={{
              background: '#0f0f13', border: '1px solid rgba(245,158,11,0.3)',
              borderRadius: 20, padding: 36, maxWidth: 540, width: '100%',
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
              animation: 'pop-in 0.3s ease',
              maxHeight: '90vh', overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div id="user-invoice-content" style={{ padding: '20px', background: '#0f0f13', borderRadius: 16 }}>
              {/* Logo and Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <img src="/logo.png" alt="ShopSmart Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '3px', border: '2px solid var(--amber)', marginBottom: 12, display: 'inline-block' }} />
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white', margin: 0 }}>
                  ShopSmart Invoice
                </h2>
                <p style={{ color: '#F59E0B', fontSize: 13, marginTop: 4, fontFamily: 'monospace' }}>
                  INV-{activeInvoice.shortId}
                </p>
              </div>

              {/* Status */}
              <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 16px', borderRadius: 10, marginBottom: 24,
                background: activeInvoice.paymentStatus === 'Paid' ? 'rgba(74,222,128,0.08)' : 'rgba(239,68,68,0.08)',
                border: `1px solid ${activeInvoice.paymentStatus === 'Paid' ? 'rgba(74,222,128,0.25)' : 'rgba(239,68,68,0.25)'}`,
              }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>Payment Status</span>
                <span style={{
                  fontSize: 12, fontWeight: 700, padding: '3px 10px', borderRadius: 99,
                  background: activeInvoice.paymentStatus === 'Paid' ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                  color: activeInvoice.paymentStatus === 'Paid' ? '#4ADE80' : '#F87171',
                }}>
                  {activeInvoice.paymentStatus === 'Paid' ? '✓ PAID' : '✗ FAILED'}
                </span>
              </div>

              {/* Customer Details */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 10 }}>
                  Bill To
                </p>
                {[
                  ['Name', activeInvoice.name],
                  ['Phone', activeInvoice.phone],
                  ['Address', activeInvoice.address],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 500, maxWidth: '60%', textAlign: 'right' }}>{val}</span>
                  </div>
                ))}
              </div>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 10 }}>
                  Items Ordered
                </p>
                {(activeInvoice.items || []).map((item: any, i: number) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'white' }}>{item.name || item.id} × {item.quantity}</span>
                    <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', fontWeight: 800 }}>
                  <span style={{ fontSize: 14, color: 'white' }}>Total Paid</span>
                  <span style={{ fontSize: 16, color: '#4ADE80' }}>₹{activeInvoice.totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Details */}
              <div style={{ marginBottom: 28 }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 10 }}>
                  Payment Details
                </p>
                {[
                  ['Method', activeInvoice.paymentMethod],
                  ['Transaction ID', activeInvoice.transactionId],
                  ['Issued At (IST)', new Date(activeInvoice.issuedAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })],
                ].map(([label, val]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                    <span style={{ fontSize: 12, color: 'white', fontWeight: 500, fontFamily: label === 'Transaction ID' ? 'monospace' : 'inherit' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => downloadPdf(activeInvoice)}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                  background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)',
                  color: '#F59E0B', cursor: 'pointer',
                }}>
                ⬇ Download PDF
              </button>
              <button onClick={() => setActiveInvoice(null)}
                style={{
                  padding: '12px 20px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
                }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
