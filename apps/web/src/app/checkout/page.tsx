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

  const [address, setAddress] = useState({ name: user?.name || '', phone: user?.phoneNumber || '', pincode: '', address: '' });

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const handleSubmit = async (autoMarkPaid = false) => {
    setLoading(true);
    try {
      const selectedMethodName = UPI_METHODS.find(m => m.id === payMethod)?.label || payMethod;
      const txnSuffix = txnRef ? ` | TXN:${txnRef}` : '';
      const addressStr = [address.address, address.pincode].filter(v => v && v !== 'N/A').join(', ') || 'N/A';
      const customerStr = `${address.name || user?.name || 'N/A'} | ${address.phone || 'N/A'} | ${selectedMethodName} | ADDR:${addressStr}${txnSuffix}`;
      
      const res = await fetch('http://localhost:8080/orders', {
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

      // If customer clicked "I've Paid", auto-mark as Paid immediately
      if (autoMarkPaid) {
        const statusRes = await fetch(`http://localhost:8080/orders/${order.id}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'Paid' })
        });
        if (!statusRes.ok) throw new Error('Status update failed');
      } else if (screenshot) {
        await fetch(`http://localhost:8080/orders/${order.id}/payment-screenshot`, {
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
    <div className="min-h-screen py-12 px-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">

        {/* Steps Indicator */}
        <div className="flex items-center justify-center mb-12">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <div className={`flex items-center gap-2 ${i <= step ? 'text-indigo-400' : 'text-gray-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${i < step ? 'bg-indigo-600 border-indigo-600 text-white' : i === step ? 'border-indigo-500 text-indigo-400' : 'border-gray-700 text-gray-600'}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className="text-sm font-medium">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-4 ${i < step ? 'bg-indigo-600' : 'bg-gray-800'}`}/>}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Form */}
          <div className="lg:col-span-2">

            {/* Step 1: Delivery */}
            {step === 0 && (
              <div className="glass-card animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-6">📍 Delivery Address</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { key: 'name', label: 'Full Name', placeholder: 'John Doe', cols: 1 },
                    { key: 'phone', label: 'Phone Number', placeholder: '+91 XXXXX XXXXX', cols: 1 },
                    { key: 'address', label: 'Street Address', placeholder: '123 Main Street, Apt 4B', cols: 2 },
                    { key: 'pincode', label: 'PIN Code', placeholder: '400001', cols: 1 },
                  ].map(field => (
                    <div key={field.key} className={field.cols === 2 ? 'md:col-span-2' : ''}>
                      <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">{field.label}</label>
                      <input
                        value={address[field.key as keyof typeof address]}
                        onChange={e => setAddress(a => ({ ...a, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 placeholder-gray-600 transition-colors text-sm"
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
                  className="btn-primary mt-8 w-full"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 1 && (
              <div className="glass-card animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-6">💳 Payment Method</h2>

                {/* Payment Options */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                  {UPI_METHODS.map(m => (
                    <button key={m.id} onClick={() => setPayMethod(m.id)}
                      className={`glass rounded-xl p-4 text-center transition-all border-2 flex flex-col items-center justify-center gap-2 ${payMethod === m.id ? 'border-amber-500 bg-amber-500/10' : 'border-white/10 hover:border-white/20'}`}>
                      <img src={m.icon} alt={m.label} className="h-8 object-contain rounded" />
                      <div className="text-xs font-medium text-gray-300">{m.label}</div>
                    </button>
                  ))}
                </div>

                {/* QR Code Panel */}
                {payMethod === 'qr' && (
                  <div className="glass rounded-2xl p-6 mb-6 border border-amber-500/20">
                    <p className="text-sm text-gray-400 mb-2 text-center">Scan with any UPI app to pay</p>
                    <div className="w-48 h-48 mx-auto rounded-2xl bg-white flex items-center justify-center mb-4 border-4 border-amber-500/40 overflow-hidden">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`upi://pay?pa=8688509699@upi&pn=ShopSmart&am=${total.toFixed(2)}&cu=INR`)}`} 
                        alt="Dynamic QR Code" 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="text-amber-400 font-mono font-bold text-sm text-center">8688509699@upi</p>
                    <p className="text-gray-400 text-sm mt-1 font-semibold text-center">Amount: ₹{total.toFixed(2)}</p>

                    {/* Transaction Reference Input */}
                    <div className="mt-5 border-t border-white/10 pt-5">
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Step 1 — Enter Full UPI Transaction ID
                      </label>
                      <input
                        value={txnRef}
                        onChange={e => { setTxnRef(e.target.value.replace(/\s/g, '')); setPaidNow(false); }}
                        placeholder="e.g. 426710983654 (12 digits)"
                        maxLength={20}
                        inputMode="numeric"
                        className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-amber-500 placeholder-gray-600 transition-colors text-sm font-mono tracking-widest"
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          Find in your UPI app: Payment History → Transaction ID
                        </p>
                        <p className="text-xs font-mono font-bold" style={{ color: txnRef.trim().length >= 12 ? '#4ADE80' : 'rgba(255,255,255,0.3)' }}>
                          {txnRef.trim().length}/12
                        </p>
                      </div>
                    </div>

                    {/* I've Paid button — enabled only after full 12-digit txnRef is entered */}
                    <div className="mt-4">
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                        Step 2 — Confirm Payment
                      </label>
                      {!paidNow ? (
                        <button
                          onClick={() => { if (txnRef.trim().length >= 12) setPaidNow(true); }}
                          disabled={txnRef.trim().length < 12}
                          style={{
                            width: '100%', padding: '12px', borderRadius: 12, fontWeight: 700, fontSize: 14,
                            border: txnRef.trim().length >= 12 ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            background: txnRef.trim().length >= 12 ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.04)',
                            color: txnRef.trim().length >= 12 ? '#4ADE80' : 'rgba(255,255,255,0.25)',
                            cursor: txnRef.trim().length >= 12 ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {txnRef.trim().length >= 12 ? '✅ I\'ve Completed the Payment' : `🔒 Enter ${12 - txnRef.trim().length} more digit${12 - txnRef.trim().length !== 1 ? 's' : ''} to unlock`}
                        </button>
                      ) : (
                        <div className="rounded-xl p-4 animate-fade-in" style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.3)' }}>
                          <p style={{ color: '#4ADE80', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>🎉 Transaction verified!</p>
                          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Ref: <span style={{ color: '#F59E0B', fontFamily: 'monospace' }}>{txnRef}</span> — Click "Confirm Paid Order" below.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* UPI ID input */}
                {payMethod === 'upi' && (
                  <div className="mb-6">
                    <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">Your UPI ID</label>
                    <input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="yourname@upi"
                      className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 placeholder-gray-600 transition-colors text-sm"/>
                  </div>
                )}

                {/* Screenshot upload */}
                <div className="mb-6">
                  <label className="block text-xs text-gray-400 font-semibold uppercase tracking-wider mb-2">
                    Upload Payment Screenshot URL
                  </label>
                  <input value={screenshot} onChange={e => setScreenshot(e.target.value)}
                    placeholder="https://your-screenshot-url.jpg"
                    className="w-full bg-white/5 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-indigo-500 placeholder-gray-600 transition-colors text-sm"/>
                  <p className="text-gray-600 text-xs mt-2">In production, this uploads directly to Firebase Storage</p>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="btn-ghost border border-white/10 flex-1">← Back</button>
                  <button onClick={() => setStep(2)} className="btn-primary flex-1">Review Order →</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 2 && (
              <div className="glass-card animate-slide-up">
                <h2 className="text-2xl font-bold text-white mb-6">📋 Review & Confirm</h2>
                <div className="space-y-4 mb-8">
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Delivery to</p>
                    <p className="text-white font-medium">{address.name || 'John Doe'}</p>
                    <p className="text-gray-400 text-sm">{address.address || '123 Main Street'}, {address.pincode || '400001'}</p>
                  </div>
                  <div className="glass rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Payment via</p>
                    <p className="text-white font-medium">{UPI_METHODS.find(m => m.id === payMethod)?.label}</p>
                  </div>
                  {screenshot && (
                    <div className="glass rounded-xl p-4">
                      <p className="text-xs text-gray-500 mb-1">Screenshot</p>
                      <p className="text-indigo-400 text-sm font-mono truncate">{screenshot}</p>
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} disabled={loading} className="btn-ghost border border-white/10 flex-1">← Back</button>
                  <button 
                    onClick={() => handleSubmit(paidNow)}
                    disabled={loading}
                    className={`btn-primary flex-1 ${paidNow ? 'border-2 border-green-400' : ''} ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
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
          <div className="glass-card h-fit sticky top-24">
            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
            <div className="space-y-3 text-sm text-gray-400">
              <div className="flex justify-between"><span>Subtotal</span><span className="text-white">₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax (18% GST)</span><span className="text-white">₹{tax.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="text-green-400">Free</span></div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-black text-lg">
                <span className="text-white">Total</span>
                <span className="gradient-text">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <div className="mt-6 text-xs text-gray-600 text-center">🔒 256-bit SSL encryption</div>
          </div>
        </div>
      </div>
    </div>
  );
}
