'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/#catalog', label: 'Shop' },
  { href: '/products', label: 'Collections' },
  { href: '/cart', label: 'Cart' },
  { href: '/support', label: 'Support' },
];

export default function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden flex items-center ml-2">
      <button 
        onClick={() => setOpen(!open)}
        className="btn-ghost p-2 rounded-xl border border-default"
        style={{ color: 'var(--text-primary)' }}
        aria-label="Menu"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          ) : (
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute top-16 left-0 w-full glass border-b shadow-2xl z-50 p-4 flex flex-col gap-2 animate-slide-up" style={{ borderColor: 'var(--border)' }}>
          {NAV_LINKS.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              onClick={() => setOpen(false)}
              className="text-lg font-semibold px-4 py-3 rounded-xl transition-colors"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.03)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
