import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ShopSmart Admin – Control Panel',
  description: 'Admin Dashboard for Smart E-Commerce Platform',
  icons: { icon: '/favicon.svg' }
};
import Script from 'next/script';
import AdminNotificationInbox from '../components/AdminNotificationInbox';
import AdminAuthGuard from '../components/AdminAuthGuard';
import AdminLogoutButton from '../components/AdminLogoutButton';

const NAV_ITEMS = [
  { href: '/',          label: 'Dashboard',  icon: '▣' },
  { href: '/products',  label: 'Catalog',    icon: '◈' },
  { href: '/orders',    label: 'Orders',     icon: '◎' },
  { href: '/payments',  label: 'Payments',   icon: '◆' },
  { href: '/customers', label: 'Customers',  icon: '◉' },
  { href: '/chat',      label: 'Live Chat',  icon: '◐' },
  { href: '/analytics', label: 'Analytics',  icon: '▲' },
  { href: '/settings',  label: 'Settings',   icon: '◌' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body style={{ background: 'var(--bg-base)', minHeight: '100vh', display: 'flex', margin: 0 }}>
        <AdminAuthGuard>
          <Script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" strategy="lazyOnload" />

          {/* ── Sidebar ───────────────────────────────── */}
          <aside style={{
            width: 240,
            flexShrink: 0,
            background: 'var(--bg-surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            overflowY: 'auto',
          }}>
            {/* Logo */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
              <a href="http://localhost:3000" target="_blank" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
                <img src="/logo.png" alt="ShopSmart Logo" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '2px', border: '2px solid var(--amber)', flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.03em', lineHeight: 1.2 }}>
                    Shop<span style={{ color: 'var(--amber)' }}>Smart</span>
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Admin Panel</div>
                </div>
              </a>
            </div>

            {/* Navigation */}
            <nav style={{ flex: 1, padding: '12px', overflowY: 'auto' }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '8px 14px', marginBottom: 4 }}>
                Main Menu
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV_ITEMS.slice(0, 5).map(item => (
                  <a key={item.href} href={item.href} className="sidebar-link">
                    <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', padding: '16px 14px 4px', marginTop: 8 }}>
                Insights
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {NAV_ITEMS.slice(5).map(item => (
                  <a key={item.href} href={item.href} className="sidebar-link">
                    <span style={{ fontSize: 13, width: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>
            </nav>

            {/* Admin User Profile */}
            <div style={{ padding: '12px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
              <div style={{ borderRadius: 10, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                {/* Profile row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px' }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#0D0D0F', fontWeight: 800, fontSize: 13 }}>A</span>
                  </div>
                  <div style={{ overflow: 'hidden', flex: 1 }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>BADAM SUDHEER REDDY</p>
                    <p style={{ fontSize: 10, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0, marginTop: 1 }}>Admin</p>
                  </div>
                </div>
                {/* Logout button — full width */}
                <AdminLogoutButton />
              </div>
            </div>
          </aside>

          {/* ── Main Content Area ─────────────────────── */}
          <div style={{ flex: 1, marginLeft: 240, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            {/* Topbar */}
            <header style={{
              height: 60,
              background: 'rgba(13,13,15,0.85)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border)',
              position: 'sticky',
              top: 0,
              zIndex: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 32px',
              flexShrink: 0,
            }}>
              {/* Breadcrumb */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)' }}>ShopSmart</span>
                <span style={{ color: 'var(--text-muted)' }}>/</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Admin Dashboard</span>
              </div>

              {/* Right actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                {/* Live Indicator */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ADE80', display: 'inline-block', boxShadow: '0 0 6px #4ADE80' }}></span>
                  Live
                </div>

                <AdminNotificationInbox />

                {/* View Store */}
                <a href="http://localhost:3000" target="_blank" className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                  View Store ↗
                </a>
              </div>
            </header>

            {/* Page Content */}
            <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
              {children}
            </main>
          </div>
        </AdminAuthGuard>
      </body>
    </html>
  );
}
