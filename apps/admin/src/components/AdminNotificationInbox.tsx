'use client';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert';
}

export default function AdminNotificationInbox() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [toastQueue, setToastQueue] = useState<NotificationItem[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('shopsmart_admin_notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shopsmart_admin_notifications', JSON.stringify(notifications));
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
    
    setTimeout(() => {
      setToastQueue(prev => prev.filter(t => t.id !== newItem.id));
    }, 5000);
  }, [playChime]);

  useEffect(() => {
    const socket = io('https://shop-smart-api-production.up.railway.app');
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_room', 'admin_room');
    });

    socket.on('admin_alert', (data: any) => {
      addNotification({
        title: data.title || 'System Alert',
        message: data.message || 'You have a new alert.',
        type: 'alert'
      });
    });

    return () => { socket.disconnect(); };
  }, [addNotification]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button 
        onClick={() => { setIsOpen(!isOpen); if (!isOpen) markAllRead(); }}
        className="btn-ghost" style={{ padding: '7px 10px', position: 'relative', border: '1px solid var(--border)', borderRadius: 10 }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, background: '#F59E0B', color: '#0D0D0F', fontSize: 10, fontWeight: 'bold', width: 16, height: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', border: '2px solid var(--bg-base)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          style={{ position: 'absolute', right: 0, marginTop: 12, width: 320, borderRadius: 16, background: '#13131a', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', zIndex: 50, overflow: 'hidden', animation: 'slide-down 0.2s ease-out' }}
        >
          <div style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#1a1a24' }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: 'white' }}>Admin Notifications</h3>
            {notifications.length > 0 && (
              <button onClick={() => setNotifications([])} style={{ fontSize: 11, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
            )}
          </div>
          <div style={{ maxHeight: 384, overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>No new alerts</div>
            ) : (
              notifications.map(n => (
                <div key={n.id} style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: n.read ? 'var(--text-secondary)' : '#F59E0B' }}>
                      🔔 {n.title}
                    </p>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {new Date(n.time).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true })}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: 'var(--text-muted)' }}>{n.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {typeof window !== 'undefined' && document.body ? React.createPortal(
        <div style={{ position: 'fixed', top: 96, right: 24, zIndex: 999999, display: 'flex', flexDirection: 'column', gap: 12, pointerEvents: 'none' }}>
          {toastQueue.map(toast => (
            <div key={toast.id} style={{ width: 320, background: '#16213e', border: '1px solid rgba(245,158,11,0.5)', borderRadius: 12, padding: 16, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', pointerEvents: 'auto', animation: 'slide-left 0.3s ease-out' }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  🔔
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#F59E0B', marginBottom: 4 }}>{toast.title}</p>
                  <p style={{ margin: 0, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{toast.message}</p>
                  <a href="/orders" style={{ display: 'inline-block', marginTop: 12, fontSize: 11, fontWeight: 700, color: '#F59E0B', background: 'rgba(245,158,11,0.1)', padding: '6px 12px', borderRadius: 8, textDecoration: 'none', border: '1px solid rgba(245,158,11,0.2)' }}>
                    View Orders
                  </a>
                </div>
                <button onClick={() => setToastQueue(q => q.filter(t => t.id !== toast.id))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', alignSelf: 'flex-start' }}>✕</button>
              </div>
            </div>
          ))}
        </div>,
        document.body
      ) : null}
    </div>
  );
}
