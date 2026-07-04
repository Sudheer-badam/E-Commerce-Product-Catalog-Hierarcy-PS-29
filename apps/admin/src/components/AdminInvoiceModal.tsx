import React from 'react';

export default function AdminInvoiceModal({ order, onClose, onSend }: { order: any, onClose: () => void, onSend: (id: string) => void }) {
  if (!order) return null;

  const parts = order.customerId.split(' | ');
  const name    = parts[0] || 'Customer';
  const phone   = parts[1] || 'N/A';
  const method  = parts[2] ? parts[2].replace(/\s*\|.*/, '') : 'N/A';
  const addrRaw = parts.find((p: string) => p.startsWith('ADDR:'));
  const txnRaw  = parts.find((p: string) => p.startsWith('TXN:'));
  const address = addrRaw ? addrRaw.replace('ADDR:', '').trim() : 'N/A';
  const txnId   = txnRaw  ? txnRaw.replace('TXN:', '').trim()   : 'N/A';

  const downloadPdf = () => {
    const element = document.getElementById('invoice-content');
    if (element) {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-10000px';
      iframe.style.width = '800px';
      iframe.style.height = '2000px';
      document.body.appendChild(iframe);
      
      const doc = iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <head>
              <style>
                body { margin: 0; padding: 20px; background: #0f0f13; font-family: sans-serif; }
                * { box-sizing: border-box; }
              </style>
            </head>
            <body>
              ${element.outerHTML}
            </body>
          </html>
        `);
        doc.close();

        const opt = {
          margin:       10,
          filename:     `ShopSmart-Invoice-${order.id.substr(0, 8).toUpperCase()}.pdf`,
          image:        { type: 'jpeg', quality: 0.98 },
          html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#0f0f13', scrollY: 0 },
          jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        if ((window as any).html2pdf) {
          setTimeout(() => {
            (window as any).html2pdf().set(opt).from(doc.body.children[0]).save().then(() => {
              document.body.removeChild(iframe);
            });
          }, 300);
        } else {
          alert('PDF generator is loading... Please try again in a few seconds.');
          document.body.removeChild(iframe);
        }
      }
    }
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 10000,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onClick={onClose}
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
        <div id="invoice-content" style={{ padding: '20px', background: '#0f0f13', borderRadius: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <img src="/logo.png" alt="ShopSmart Logo" style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'contain', background: '#fff', padding: '3px', border: '2px solid var(--amber)', marginBottom: 12, display: 'inline-block' }} />
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'white', margin: 0 }}>
              ShopSmart Invoice
            </h2>
            <p style={{ color: '#F59E0B', fontSize: 13, marginTop: 4, fontFamily: 'monospace' }}>
              INV-{order.id.substr(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Customer Details */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 10 }}>
              Bill To
            </p>
            {[
              ['Name', name],
              ['Phone', phone],
              ['Address', address],
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
            {(order.items || []).map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: 'white' }}>{item.name || item.id} × {item.quantity}</span>
                <span style={{ fontSize: 12, color: '#F59E0B', fontWeight: 700 }}>₹{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 4px', fontWeight: 800 }}>
              <span style={{ fontSize: 14, color: 'white' }}>Total Paid</span>
              <span style={{ fontSize: 16, color: '#4ADE80' }}>₹{order.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Details */}
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#F59E0B', marginBottom: 10 }}>
              Payment Details
            </p>
            {[
              ['Method', method],
              ['Transaction ID', txnId],
              ['Issued At (IST)', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' })],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{label}</span>
                <span style={{ fontSize: 12, color: 'white', fontWeight: 500, fontFamily: label === 'Transaction ID' ? 'monospace' : 'inherit' }}>{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <button onClick={() => { onSend(order.id); onClose(); }}
            style={{
              padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 13,
              background: '#4ADE80', color: '#0D0D0F', cursor: 'pointer', border: 'none'
            }}>
            📤 Send Invoice to Customer
          </button>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={downloadPdf}
              style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.4)',
                color: '#F59E0B', cursor: 'pointer',
              }}>
              ⬇ Download PDF
            </button>
            <button onClick={onClose}
              style={{
                flex: 1, padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 13,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              }}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
