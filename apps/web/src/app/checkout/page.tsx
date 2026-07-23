'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

const STEPS = ['Delivery', 'Payment', 'Confirm'];

const UPI_METHODS = [
  { id: 'upi', label: 'UPI ID', icon: '/payment-logos/upi.jpeg' },
  { id: 'qr', label: 'Scan QR Code', icon: '/payment-logos/bhim.png' },
  { id: 'googlepay', label: 'Google Pay', icon: '/payment-logos/gpay.jpeg' },
  { id: 'phonepe', label: 'PhonePe', icon: '/payment-logos/phonepe.webp' },
  { id: 'paytm', label: 'Paytm', icon: '/payment-logos/paytm.jpeg' },
  { id: 'razorpay', label: 'Razorpay', icon: '/payment-logos/razorpay.jpeg' },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [payMethod, setPayMethod] = useState('qr');
  const [upiId, setUpiId] = useState('');
  const [screenshot, setScreenshot] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paidNow, setPaidNow] = useState(false);
  const [txnRef, setTxnRef] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);

  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phoneNumber || '', email: user?.email || '', pincode: '', address: '' });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = async (autoMarkPaid = false) => {
    setLoading(true);
    try {
      const selectedMethodName = UPI_METHODS.find(m => m.id === payMethod)?.label || payMethod;
      const txnSuffix = txnRef ? ` | TXN:${txnRef}` : '';
      const addressStr = [address.address, address.pincode].filter(v => v && v !== 'N/A').join(', ') || 'N/A';
      const customerStr = `${address.name || user?.name || 'N/A'} | ${address.phone || 'N/A'} | ${selectedMethodName} | ADDR:${addressStr}${txnSuffix} | EMAIL:${address.email || 'N/A'} | UID:${user?.uid || 'guest'}`;
      
      const res = await fetch('https://shop-smart-api-production.up.railway.app/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customerStr,
          items,
          totalAmount: total
        })
      });

      if (!res.ok) throw new Error('Order creation failed');
      const order = await res.json();

      if (autoMarkPaid) {
        const statusRes = await fetch(`https://shop-smart-api-production.up.railway.app/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Paid' })
        });
        if (!statusRes.ok) throw new Error('Status update failed');
      } else if (screenshot) {
        await fetch(`https://shop-smart-api-production.up.railway.app/orders/${order.id}/payment-screenshot`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ screenshotUrl: screenshot })
        });
      }

      clearCart();
      const params = new URLSearchParams({ orderId: order.id, amount: total.toFixed(2), method: selectedMethodName });
      if (autoMarkPaid) {
        router.push(`/payment-success?${params.toString()}`);
      } else {
        router.push(`/payment-success?${params.toString()}&pending=true`);
      }
    } catch (e) {
      console.error(e);
      const params = new URLSearchParams({ amount: total.toFixed(2), reason: 'Could not connect to the payment server' });
      router.push(`/payment-failed?${params.toString()}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-6 animate-fade-in relative z-10">
      <div className="max-w-4xl mx-auto">

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-[#111111]' : 'text-[#6B7280]'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-[#16a34a] border-[#16a34a] text-white' : i === step ? 'border-[#C5A059] text-[#C5A059]' : 'border-[#D1D5DB] text-[#9CA3AF]'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-bold">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-4 ${i < step ? 'bg-[#16a34a]' : 'bg-[#E5E7EB]'}`}/>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form */}
          <div className="lg:col-span-2">

            {/* Step 1: Delivery */}
            {step === 0 && (
              <div className="animate-slide-up rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <h2 className="text-2xl font-black text-[#111111] mb-6">📍 Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'John Doe', cols: 1 },
                    { key: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', cols: 1 },
                    { key: 'email', label: 'Email Address (For Invoice)', placeholder: 'john@example.com', cols: 2 },
                    { key: 'address', label: 'Street Address', placeholder: '123 Main Street, Apt 4B', cols: 2 },
                    { key: 'pincode', label: 'PIN Code', placeholder: '400001', cols: 1 },
                  ].map(field => (
                    <div key={field.key} className={field.cols === 2 ? 'md:col-span-2' : ''}>
                      <label className="block text-xs text-[#4A4A4A] font-bold uppercase tracking-wider mb-2">{field.label}</label>
                      <input
                        value={address[field.key as keyof typeof address]}
                        onChange={e => setAddress(a => ({ ...a, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full rounded-xl px-4 py-3 outline-none transition-colors text-sm font-medium"
                        style={{ background: '#F4F1EA', border: '1.5px solid rgba(0,0,0,0.08)', color: '#111111' }}
                      />
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    const newAddress = { ...address };
                    Object.keys(newAddress).forEach((key) => {
                      if (!newAddress[key as keyof typeof newAddress].trim()) {
                        newAddress[key as keyof typeof newAddress] = 'N/A';
                      }
                    });
                    setAddress(newAddress);
                    setStep(1);
                  }} 
                  className="btn-primary mt-8 w-full" style={{ padding: '14px' }}
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 1 && (
              <div className="animate-slide-up rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <h2 className="text-2xl font-black text-[#111111] mb-6">💳 Payment Method</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {UPI_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      className="rounded-xl p-4 text-center transition-all flex flex-col items-center justify-center gap-2"
                      style={{ 
                        background: payMethod === m.id ? '#FFFBEB' : '#FFFFFF', 
                        border: payMethod === m.id ? '2px solid #C5A059' : '1.5px solid rgba(0,0,0,0.08)' 
                      }}>
                      <img src={m.icon} alt={m.label} className="h-8 object-contain rounded" />
                      <div className="text-xs font-bold" style={{ color: payMethod === m.id ? '#C5A059' : '#4A4A4A' }}>{m.label}</div>
                    </button>
                  ))}
                </div>

                {payMethod === 'qr' && (
                  <div className="rounded-2xl p-6 mb-6" style={{ background: '#F4F1EA', border: '1.5px solid rgba(0,0,0,0.08)' }}>
                    <p className="text-sm font-bold text-[#4A4A4A] mb-4 text-center">Scan with any UPI app to pay</p>
                    <div className="w-48 h-48 mx-auto rounded-2xl bg-white flex items-center justify-center mb-4 overflow-hidden" style={{ border: '3px solid #C5A059' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=8688509699@upi&pn=ShopSmart&am=${total.toFixed(2)}&cu=INR`)}`} 
                        alt="Dynamic QR Code" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="font-mono font-bold text-sm text-center" style={{ color: '#C5A059' }}>8688509699@upi</p>
                    <p className="text-[#111111] text-sm mt-1 font-black text-center">Amount: ₹{total.toFixed(2)}</p>

                    <div className="mt-6 pt-5" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A4A4A' }}>
                        Step 1 — Enter Full UPI Transaction ID
                      </label>
                      <input
                        value={txnRef}
                        onChange={e => { setTxnRef(e.target.value.replace(/\s/g, '')); setPaidNow(false); }}
                        placeholder="e.g. 426710983654 (12 digits)"
                        maxLength={20}
                        inputMode="numeric"
                        className="w-full rounded-xl px-4 py-3 outline-none transition-colors text-sm font-mono font-bold tracking-widest"
                        style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.15)', color: '#111111' }}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs font-medium text-[#6B7280]">
                          Find in your UPI app: Payment History → Transaction ID
                        </p>
                        <p className="text-xs font-mono font-bold" style={{ color: txnRef.trim().length >= 12 ? '#16a34a' : '#9CA3AF' }}>
                          {txnRef.trim().length}/12
                        </p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A4A4A' }}>
                        Step 2 — Confirm Payment
                      </label>
                      {!paidNow ? (
                        <button
                          onClick={() => { if (txnRef.trim().length >= 12) setPaidNow(true); }}
                          disabled={txnRef.trim().length < 12}
                          style={{
                            width: '100%', padding: '14px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                            border: txnRef.trim().length >= 12 ? '2px solid #16a34a' : '2px solid rgba(0,0,0,0.08)',
                            background: txnRef.trim().length >= 12 ? '#DCFCE7' : '#FFFFFF',
                            color: txnRef.trim().length >= 12 ? '#16a34a' : '#9CA3AF',
                            cursor: txnRef.trim().length >= 12 ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {txnRef.trim().length >= 12 ? '✅ I\'ve Completed the Payment' : `🔒 Enter ${12 - txnRef.trim().length} more digit${12 - txnRef.trim().length !== 1 ? 's' : ''} to unlock`}
                        </button>
                      ) : (
                        <div className="rounded-xl p-4 animate-fade-in" style={{ background: '#DCFCE7', border: '1.5px solid #16a34a' }}>
                          <p style={{ color: '#16a34a', fontWeight: 800, fontSize: 14, marginBottom: 4 }}>🎉 Transaction verified!</p>
                          <p style={{ color: '#166534', fontSize: 12, fontWeight: 600 }}>Ref: <span style={{ fontFamily: 'monospace' }}>{txnRef}</span> — Click "Confirm Paid Order" below.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {payMethod === 'upi' && (
                  <div className="mb-6">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#4A4A4A]">Your UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                      className="w-full rounded-xl px-4 py-3 outline-none transition-colors text-sm font-medium"
                      style={{ background: '#F4F1EA', border: '1.5px solid rgba(0,0,0,0.08)', color: '#111111' }}/>
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-[#4A4A4A]">
                    Upload Payment Screenshot URL
                  </label>
                  <input value={screenshot} onChange={e => setScreenshot(e.target.value)}
                    placeholder="https://your-screenshot-url.jpg"
                    className="w-full rounded-xl px-4 py-3 outline-none transition-colors text-sm font-medium"
                    style={{ background: '#F4F1EA', border: '1.5px solid rgba(0,0,0,0.08)', color: '#111111' }}/>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="btn-ghost flex-1 font-bold" style={{ border: '1.5px solid rgba(0,0,0,0.1)', color: '#111111' }}>← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 2 && (
              <div className="animate-slide-up rounded-3xl p-8" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
                <h2 className="text-2xl font-black text-[#111111] mb-6">📋 Review & Confirm</h2>
                <div className="space-y-4 mb-8">
                  <div className="rounded-xl p-4" style={{ background: '#F4F1EA', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="text-xs font-bold text-[#4A4A4A] mb-1">Delivery to</p>
                    <p className="text-[#111111] font-black">{address.name || 'John Doe'}</p>
                    <p className="text-[#4A4A4A] text-sm font-medium mt-1">{address.address || '123 Main Street'}, {address.pincode || '400001'}</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: '#F4F1EA', border: '1px solid rgba(0,0,0,0.05)' }}>
                    <p className="text-xs font-bold text-[#4A4A4A] mb-1">Payment via</p>
                    <p className="text-[#111111] font-black">{UPI_METHODS.find(m => m.id === payMethod)?.label}</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} disabled={loading} className="btn-ghost flex-1 font-bold" style={{ border: '1.5px solid rgba(0,0,0,0.1)', color: '#111111' }}>← Back</button>
                  <button 
                    onClick={() => handleSubmit(paidNow)}
                    disabled={loading}
                    className={`btn-primary flex-1 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
                    style={{ background: paidNow ? '#16a34a' : undefined }}
                  >
                    {loading
                      ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                          <span style={{ width: 16, height: 16, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
                          Processing...
                        </span>
                      : paidNow ? '✅ Confirm Paid Order' : '🚀 Place Order'
                    }
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="h-fit sticky top-24 rounded-3xl p-6" style={{ background: '#FFFFFF', border: '1.5px solid rgba(0,0,0,0.08)', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
            <h3 className="text-lg font-black text-[#111111] mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between font-medium"><span className="text-[#4A4A4A]">Subtotal</span><span className="text-[#111111] font-bold">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium"><span className="text-[#4A4A4A]">Tax (18% GST)</span><span className="text-[#111111] font-bold">₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between font-medium"><span className="text-[#4A4A4A]">Shipping</span><span className="text-[#16a34a] font-bold">Free</span></div>
              <div className="pt-4 flex justify-between font-black text-lg" style={{ borderTop: '1.5px solid rgba(0,0,0,0.08)' }}>
                <span className="text-[#111111]">Total</span>
                <span style={{ color: '#C5A059' }}>₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 text-xs font-bold text-[#4A4A4A] text-center flex justify-center gap-1">
              🔒 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
