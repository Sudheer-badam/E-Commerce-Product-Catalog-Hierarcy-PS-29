'use client';
import React, { useState, useEffect } from 'react';

export default function ClockIST() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }));
    };
    
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
      color: '#F59E0B', padding: '4px 10px', borderRadius: 8,
      fontSize: 12, fontWeight: 700, fontFamily: 'monospace'
    }}>
      <span>⏱ IST</span>
      <span>{time}</span>
    </div>
  );
}
