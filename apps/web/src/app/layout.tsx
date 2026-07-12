import type { Metadata } from 'next';
import './globals.css';
import ChatWidget from '../components/ChatWidget';
import AuthProvider from '../components/AuthProvider';
import UserMenu from '../components/UserMenu';
import NotificationInbox from '../components/NotificationInbox';
import ClockIST from '../components/ClockIST';
import WebLogoutButton from '../components/WebLogoutButton';
import Script from 'next/script';
import SplashScreen from '../components/SplashScreen';
import MobileMenu from '../components/MobileMenu';
import GlobalWatermark from '../components/GlobalWatermark';

export const metadata: Metadata = {
  title: 'ShopSmart – Discover Amazing Products',
  description: 'Shop physical products, digital downloads, and subscriptions — all in one place.',
  icons: { icon: '/favicon.svg' },
};

const NAV_LINKS = [
  { href: '/#catalog', label: 'Shop' },
  { href: '/products', label: 'Collections' },
  { href: '/cart', label: 'Cart' },
  { href: '/support', label: 'Support' },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: 'var(--bg-base)', minHeight: '100vh', position: 'relative' }}>
        {/* Global Video Watermark Background Component */}
        <GlobalWatermark />
        {/* Overlay to balance watermark visibility and content readability */}
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(250,248,245,0.72)', zIndex: -9, pointerEvents: 'none' }} />

        <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />
        <AuthProvider>
          <SplashScreen />

          {/* ── Top Announcement Bar ── */}
          <div style={{ background: 'var(--amber)', color: '#0D0D0F' }} className="text-center text-xs font-semibold py-2 px-4 tracking-wide">
            🚀 Free Shipping on Orders Over ₹999 &nbsp;·&nbsp; Real-time OTP Login Active
          </div>

          {/* ── Main Navigation ── */}
          <nav className="glass sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 py-0 flex items-center justify-between h-16">

              <a href="/" className="flex items-center gap-3 flex-shrink-0 no-underline">
                <img src="/logo.png" alt="ShopSmart Logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '2px', border: '2px solid var(--amber)' }} />
                <span style={{ fontFamily: 'Outfit', fontWeight: 800, fontSize: 20, color: '#000000', letterSpacing: '-0.03em' }}>
                  Shop<span className="gradient-text">Smart</span>
                </span>
                <div className="hidden sm:block ml-4">
                  <ClockIST />
                </div>
              </a>

              {/* Center Links */}
              <div className="hidden md:flex items-center gap-1">
                {NAV_LINKS.map(link => (
                  <a key={link.href} href={link.href} className="btn-ghost text-sm">{link.label}</a>
                ))}
              </div>

              {/* Right Side: Search + User */}
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden lg:flex items-center gap-2 rounded-xl px-4 py-2 text-sm" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', minWidth: 220 }}>
                  <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-primary)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  <input
                    placeholder="Search products..."
                    className="bg-transparent outline-none flex-1 text-sm"
                    style={{ color: '#000000' }}
                  />
                </div>

                {/* Cart Icon */}
                <a href="/cart" className="btn-ghost relative p-2" style={{ border: '1px solid var(--border)', borderRadius: 10 }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                </a>

                <NotificationInbox />
                <UserMenu />
                <WebLogoutButton />
                <MobileMenu />
              </div>
            </div>
          </nav>

          {/* ── Page Content ── */}
          <main>{children}</main>

          {/* ── Footer ── */}
          <footer style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', marginTop: 80 }}>
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.03em', marginBottom: 8 }}>
                  Shop<span className="gradient-text">Smart</span>
                </div>
                <p style={{ color: 'var(--text-primary)', fontSize: 13, lineHeight: 1.7 }}>
                  Your one-stop premium marketplace for physical, digital & subscription products.
                </p>
              </div>
              {[
                { title: 'Shop', items: ['All Products', 'Electronics', 'Software', 'Services'] },
                { title: 'Support', items: ['Help Center', 'Live Chat', 'Returns', 'Shipping'] },
                { title: 'Company', items: ['About Us', 'Blog', 'Careers', 'Privacy Policy'] },
              ].map(col => (
                <div key={col.title}>
                  <p className="label-upper mb-4">{col.title}</p>
                  <div className="space-y-2">
                    {col.items.map(item => (
                      <a key={item} href="#" style={{ display: 'block', color: 'var(--text-primary)', fontSize: 13, textDecoration: 'none' }}>
                        {item}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', textAlign: 'center', color: 'var(--text-primary)', fontSize: 12 }}>
              © 2025 ShopSmart. All rights reserved. Built with Next.js, NestJS & Neon PostgreSQL.
            </div>
          </footer>

          <ChatWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
