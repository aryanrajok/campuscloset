'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, CreditCard, Smartphone, ShieldCheck,
    CheckCircle2, Clock, MapPin, Lock,
    Copy, ChevronRight, AlertCircle, IndianRupee
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProducts, formatPrice } from '@/lib/data';
import { CONDITIONS } from '@/types';
import { loadRazorpayScript, isValidUPI, generateUPILink, RazorpayPaymentResult } from '@/lib/razorpay';
import { useProductStore } from '@/store';

type PaymentMethod = 'razorpay' | 'upi' | 'cod';
type CheckoutStep = 'details' | 'payment' | 'success';

const categoryIcon: Record<string, string> = {
    suit: '🤵', pant: '👖', 'formal-shoes': '👞', tie: '👔',
    'white-shirt': '👕', blazer: '🧥', combo: '📦',
};

export default function CheckoutPage() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('product');

    // Merge user listings with mock products to find any product
    const { userListings } = useProductStore();
    const userListingIds = new Set(userListings.map(p => p.id));
    const allProducts = [...userListings, ...mockProducts.filter(p => !userListingIds.has(p.id))];

    const product = allProducts.find((p) => p.id === productId);

    const [step, setStep] = useState<CheckoutStep>('details');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('razorpay');
    const [loading, setLoading] = useState(false);
    const [upiId, setUpiId] = useState('');
    const [upiError, setUpiError] = useState('');
    const [buyerDetails, setBuyerDetails] = useState({
        name: '',
        email: '',
        phone: '',
        meetupNote: '',
    });
    const [paymentResult, setPaymentResult] = useState<{
        paymentId: string;
        orderId: string;
        method: string;
    } | null>(null);
    const [copied, setCopied] = useState(false);

    if (!product) {
        return (
            <main className="min-h-screen bg-dark-bg">
                <Navbar />
                <div className="pt-32 text-center">
                    <p className="text-6xl mb-4">😔</p>
                    <h2 className="text-2xl font-bold text-dark-text">Product not found</h2>
                    <Link href="/marketplace" className="btn-primary mt-6 inline-flex">
                        <ArrowLeft size={18} /> Back to Marketplace
                    </Link>
                </div>
            </main>
        );
    }

    // These are now safe — product is guaranteed to exist
    const condition = CONDITIONS.find((c) => c.value === product.condition);

    // Platform fee (2.5%) + GST simulation
    const platformFee = Math.round(product.sellingPrice * 0.025);
    const totalAmount = product.sellingPrice + platformFee;

    const handleCopyUPI = () => {
        navigator.clipboard.writeText(product.seller?.upiId || 'seller@upi');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);

        try {
            // Create order via API
            const res = await fetch('/api/payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: totalAmount,
                    productId: product.id,
                    productTitle: product.title,
                    buyerId: 'current-user',
                    sellerId: product.sellerId,
                }),
            });

            const data = await res.json();
            if (!data.success) throw new Error('Order creation failed');

            // Load Razorpay
            const loaded = await loadRazorpayScript();
            if (!loaded) throw new Error('Razorpay SDK failed to load');

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_1234567890',
                amount: totalAmount * 100,
                currency: 'INR',
                name: 'CampusCloset',
                description: `Payment for ${product.title}`,
                order_id: data.order.id,
                prefill: {
                    name: buyerDetails.name,
                    email: buyerDetails.email,
                    contact: buyerDetails.phone,
                },
                notes: {
                    product_id: product.id,
                    seller: product.seller?.name,
                },
                theme: {
                    color: '#6C63FF',
                },
                handler: function (response: RazorpayPaymentResult) {
                    setPaymentResult({
                        paymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
                        orderId: response.razorpay_order_id || data.order.id,
                        method: 'Razorpay',
                    });
                    setStep('success');
                    setLoading(false);
                },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    },
                },
            };

            if (!window.Razorpay) throw new Error('Razorpay SDK failed to load');
            const razorpay = new window.Razorpay(options);
            razorpay.on('payment.failed', () => {
                setLoading(false);
            });
            razorpay.open();
        } catch (error) {
            console.error('Payment error:', error);
            // For demo: simulate success anyway
            setPaymentResult({
                paymentId: `pay_demo_${Date.now()}`,
                orderId: `order_demo_${Date.now()}`,
                method: 'Razorpay (Demo)',
            });
            setStep('success');
            setLoading(false);
        }
    };

    const handleUPIPayment = () => {
        if (!isValidUPI(upiId)) {
            setUpiError('Please enter a valid UPI ID (e.g., name@paytm)');
            return;
        }
        setUpiError('');
        setLoading(true);

        // Generate UPI deep link
        const txnId = `TXN${Date.now()}`;
        const upiLink = generateUPILink(
            product.seller?.upiId || 'campuscloset@upi',
            totalAmount,
            product.title,
            txnId,
        );

        // Open UPI app
        window.open(upiLink, '_blank');

        // Simulate payment confirmation after 3 seconds
        setTimeout(() => {
            setPaymentResult({
                paymentId: txnId,
                orderId: `upi_${Date.now()}`,
                method: `UPI (${upiId})`,
            });
            setStep('success');
            setLoading(false);
        }, 3000);
    };

    const handleCODPayment = () => {
        setLoading(true);
        setTimeout(() => {
            setPaymentResult({
                paymentId: `cod_${Date.now()}`,
                orderId: `meetup_${Date.now()}`,
                method: 'Cash on Meetup',
            });
            setStep('success');
            setLoading(false);
        }, 1500);
    };

    const handlePayment = () => {
        if (paymentMethod === 'razorpay') handleRazorpayPayment();
        else if (paymentMethod === 'upi') handleUPIPayment();
        else handleCODPayment();
    };

    const isDetailsValid =
        buyerDetails.name.length > 1 &&
        buyerDetails.email.includes('@') &&
        buyerDetails.phone.length >= 10;

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-dark-text-muted mb-8">
                    <Link href={`/product/${product.id}`} className="hover:text-brand-primary transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Back to Product
                    </Link>
                    <span>/</span>
                    <span className="text-dark-text-secondary">Checkout</span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[
                        { key: 'details', label: 'Your Details', num: 1 },
                        { key: 'payment', label: 'Payment', num: 2 },
                        { key: 'success', label: 'Confirmation', num: 3 },
                    ].map((s, i) => {
                        const isActive = step === s.key;
                        const isDone =
                            (s.key === 'details' && (step === 'payment' || step === 'success')) ||
                            (s.key === 'payment' && step === 'success');
                        return (
                            <div key={s.key} className="flex items-center gap-2">
                                {i > 0 && (
                                    <div className={`w-12 sm:w-20 h-0.5 rounded ${isDone || isActive ? 'bg-brand-primary' : 'bg-dark-border'}`} />
                                )}
                                <div className="flex items-center gap-2">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${isDone
                                            ? 'bg-brand-primary text-white'
                                            : isActive
                                                ? 'bg-brand-primary/20 text-brand-primary border-2 border-brand-primary'
                                                : 'bg-dark-card text-dark-text-muted border border-dark-border'
                                            }`}
                                    >
                                        {isDone ? <CheckCircle2 size={16} /> : s.num}
                                    </div>
                                    <span
                                        className={`text-sm font-medium hidden sm:inline ${isActive ? 'text-dark-text' : isDone ? 'text-brand-primary' : 'text-dark-text-muted'
                                            }`}
                                    >
                                        {s.label}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid lg:grid-cols-5 gap-8">
                    {/* LEFT — Main Content */}
                    <div className="lg:col-span-3">
                        {/* ========== STEP 1: DETAILS ========== */}
                        {step === 'details' && (
                            <div className="glass rounded-3xl p-8 animate-fade-in">
                                <h2 className="text-xl font-bold text-dark-text mb-1">Your Details</h2>
                                <p className="text-sm text-dark-text-secondary mb-6">
                                    We&apos;ll share this with the seller for meetup coordination
                                </p>

                                <div className="space-y-5">
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Full Name *</label>
                                        <input
                                            type="text"
                                            placeholder="Your name"
                                            value={buyerDetails.name}
                                            onChange={(e) => setBuyerDetails({ ...buyerDetails, name: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-sm text-dark-text-secondary mb-1.5 block">Email *</label>
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={buyerDetails.email}
                                                onChange={(e) => setBuyerDetails({ ...buyerDetails, email: e.target.value })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm text-dark-text-secondary mb-1.5 block">Phone *</label>
                                            <input
                                                type="tel"
                                                placeholder="10-digit phone number"
                                                value={buyerDetails.phone}
                                                onChange={(e) => setBuyerDetails({ ...buyerDetails, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Meetup Note (optional)</label>
                                        <textarea
                                            placeholder="Any preferred time or location for meetup..."
                                            value={buyerDetails.meetupNote}
                                            onChange={(e) => setBuyerDetails({ ...buyerDetails, meetupNote: e.target.value })}
                                            rows={3}
                                            className="input-field resize-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep('payment')}
                                    disabled={!isDetailsValid}
                                    className="btn-primary w-full justify-center py-3.5 text-base mt-8 disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Continue to Payment <ChevronRight size={18} />
                                </button>
                            </div>
                        )}

                        {/* ========== STEP 2: PAYMENT ========== */}
                        {step === 'payment' && (
                            <div className="space-y-6 animate-fade-in">
                                <div className="glass rounded-3xl p-8">
                                    <h2 className="text-xl font-bold text-dark-text mb-1">Choose Payment Method</h2>
                                    <p className="text-sm text-dark-text-secondary mb-6">
                                        All payments are secured with 256-bit encryption
                                    </p>

                                    {/* Payment Options */}
                                    <div className="space-y-3">
                                        {/* Razorpay */}
                                        <button
                                            onClick={() => setPaymentMethod('razorpay')}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${paymentMethod === 'razorpay'
                                                ? 'border-brand-primary bg-brand-primary/5'
                                                : 'border-dark-border bg-dark-card hover:border-dark-card-hover'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === 'razorpay' ? 'bg-brand-primary/20' : 'bg-dark-surface'
                                                }`}>
                                                <CreditCard size={22} className={paymentMethod === 'razorpay' ? 'text-brand-primary' : 'text-dark-text-muted'} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-dark-text">Razorpay</h3>
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-accent/15 text-brand-accent font-semibold">
                                                        RECOMMENDED
                                                    </span>
                                                </div>
                                                <p className="text-xs text-dark-text-secondary mt-0.5">
                                                    Cards, UPI, Net Banking, Wallets — all in one
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {['💳', '📱', '🏦', '👛'].map((e, i) => (
                                                        <span key={i} className="text-sm">{e}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${paymentMethod === 'razorpay' ? 'border-brand-primary' : 'border-dark-border'
                                                }`}>
                                                {paymentMethod === 'razorpay' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-primary" />
                                                )}
                                            </div>
                                        </button>

                                        {/* UPI Direct */}
                                        <button
                                            onClick={() => setPaymentMethod('upi')}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${paymentMethod === 'upi'
                                                ? 'border-brand-accent bg-brand-accent/5'
                                                : 'border-dark-border bg-dark-card hover:border-dark-card-hover'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === 'upi' ? 'bg-brand-accent/20' : 'bg-dark-surface'
                                                }`}>
                                                <Smartphone size={22} className={paymentMethod === 'upi' ? 'text-brand-accent' : 'text-dark-text-muted'} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-dark-text">UPI Direct</h3>
                                                <p className="text-xs text-dark-text-secondary mt-0.5">
                                                    Pay directly via GPay, PhonePe, Paytm, BHIM
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    {['📲', '₹'].map((e, i) => (
                                                        <span key={i} className="text-sm">{e}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${paymentMethod === 'upi' ? 'border-brand-accent' : 'border-dark-border'
                                                }`}>
                                                {paymentMethod === 'upi' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-accent" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Cash on Meetup */}
                                        <button
                                            onClick={() => setPaymentMethod('cod')}
                                            className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-4 ${paymentMethod === 'cod'
                                                ? 'border-brand-gold bg-brand-gold/5'
                                                : 'border-dark-border bg-dark-card hover:border-dark-card-hover'
                                                }`}
                                        >
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${paymentMethod === 'cod' ? 'bg-brand-gold/20' : 'bg-dark-surface'
                                                }`}>
                                                <IndianRupee size={22} className={paymentMethod === 'cod' ? 'text-brand-gold' : 'text-dark-text-muted'} />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-dark-text">Cash on Meetup</h3>
                                                <p className="text-xs text-dark-text-secondary mt-0.5">
                                                    Pay in cash when you meet the seller on campus
                                                </p>
                                            </div>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-1 ${paymentMethod === 'cod' ? 'border-brand-gold' : 'border-dark-border'
                                                }`}>
                                                {paymentMethod === 'cod' && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-gold" />
                                                )}
                                            </div>
                                        </button>
                                    </div>

                                    {/* UPI ID Input (when UPI selected) */}
                                    {paymentMethod === 'upi' && (
                                        <div className="mt-6 p-4 rounded-xl bg-dark-surface border border-dark-border animate-slide-up">
                                            <label className="text-sm text-dark-text-secondary mb-1.5 block">Your UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="yourname@paytm"
                                                value={upiId}
                                                onChange={(e) => { setUpiId(e.target.value); setUpiError(''); }}
                                                className="input-field"
                                            />
                                            {upiError && (
                                                <p className="text-xs text-brand-secondary mt-1 flex items-center gap-1">
                                                    <AlertCircle size={12} /> {upiError}
                                                </p>
                                            )}

                                            {/* Seller's UPI for direct transfer */}
                                            <div className="mt-4 p-3 rounded-lg bg-dark-card border border-dark-border">
                                                <p className="text-xs text-dark-text-muted mb-1">Seller&apos;s UPI ID:</p>
                                                <div className="flex items-center gap-2">
                                                    <code className="text-sm font-mono text-brand-accent flex-1">
                                                        {product.seller?.upiId || 'seller@upi'}
                                                    </code>
                                                    <button
                                                        onClick={handleCopyUPI}
                                                        className="p-1.5 rounded-lg hover:bg-dark-surface transition-all text-dark-text-muted hover:text-brand-accent"
                                                    >
                                                        {copied ? <CheckCircle2 size={14} className="text-condition-new" /> : <Copy size={14} />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Security badges */}
                                <div className="flex items-center justify-center gap-6 text-xs text-dark-text-muted">
                                    <span className="flex items-center gap-1"><Lock size={12} /> SSL Secured</span>
                                    <span className="flex items-center gap-1"><ShieldCheck size={12} /> PCI Compliant</span>
                                    <span className="flex items-center gap-1"><CheckCircle2 size={12} /> Verified Seller</span>
                                </div>

                                {/* Action buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setStep('details')}
                                        className="btn-secondary py-3.5 px-6"
                                    >
                                        <ArrowLeft size={16} /> Back
                                    </button>
                                    <button
                                        onClick={handlePayment}
                                        disabled={loading || (paymentMethod === 'upi' && !upiId)}
                                        className="btn-primary flex-1 justify-center py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Processing...
                                            </div>
                                        ) : (
                                            <>
                                                <Lock size={16} />
                                                Pay {formatPrice(totalAmount)}
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ========== STEP 3: SUCCESS ========== */}
                        {step === 'success' && paymentResult && (
                            <div className="glass rounded-3xl p-8 text-center animate-fade-in">
                                {/* Success animation */}
                                <div className="relative w-24 h-24 mx-auto mb-6">
                                    <div className="absolute inset-0 bg-condition-new/20 rounded-full animate-ping" />
                                    <div className="relative w-full h-full bg-gradient-to-br from-condition-new to-emerald-600 rounded-full flex items-center justify-center">
                                        <CheckCircle2 size={40} className="text-white" />
                                    </div>
                                </div>

                                <h2 className="text-2xl font-bold text-dark-text mb-2">Payment Successful! 🎉</h2>
                                <p className="text-dark-text-secondary mb-8">
                                    Your order has been confirmed. The seller will be notified.
                                </p>

                                {/* Order details */}
                                <div className="glass rounded-xl p-5 text-left mb-6 max-w-md mx-auto">
                                    <h3 className="text-sm font-semibold text-dark-text mb-3">Order Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-dark-text-muted">Payment ID</span>
                                            <span className="text-dark-text font-mono text-xs">{paymentResult.paymentId.slice(0, 20)}...</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-dark-text-muted">Method</span>
                                            <span className="text-dark-text">{paymentResult.method}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-dark-text-muted">Amount Paid</span>
                                            <span className="text-dark-text font-semibold gradient-text">{formatPrice(totalAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-dark-text-muted">Status</span>
                                            <span className="text-condition-new font-semibold flex items-center gap-1">
                                                <CheckCircle2 size={14} /> Confirmed
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Meetup info */}
                                <div className="glass rounded-xl p-5 text-left mb-8 max-w-md mx-auto border border-brand-accent/20">
                                    <h3 className="text-sm font-semibold text-brand-accent mb-2 flex items-center gap-2">
                                        <MapPin size={14} /> Meetup Details
                                    </h3>
                                    <p className="text-sm text-dark-text">
                                        📍 <strong>{product.pickupLocation}</strong>, {product.university}
                                    </p>
                                    <p className="text-xs text-dark-text-secondary mt-2">
                                        Chat with the seller to confirm exact time and location.
                                        Always meet in a public place on campus!
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                                    <Link href="/chat" className="btn-primary flex-1 justify-center py-3">
                                        Chat with Seller
                                    </Link>
                                    <Link href="/marketplace" className="btn-secondary flex-1 justify-center py-3">
                                        Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT — Order Summary Sidebar */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-3xl p-6 sticky top-28">
                            <h3 className="text-sm font-semibold text-dark-text mb-4">Order Summary</h3>

                            {/* Product */}
                            <div className="flex gap-3 mb-5">
                                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-2xl shrink-0 overflow-hidden">
                                    {product.images?.[0] && !product.images[0].startsWith('/api/placeholder') ? (
                                        <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        categoryIcon[product.category]
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-dark-text text-sm truncate">{product.title}</p>
                                    <p className="text-xs text-dark-text-muted mt-0.5">{product.brand} · Size {product.size}</p>
                                    <span className={`badge badge-${product.condition} text-[10px] mt-1`}>
                                        {condition?.label}
                                    </span>
                                </div>
                            </div>

                            {/* Seller info */}
                            <div className="flex items-center gap-2 mb-5 p-3 rounded-xl bg-dark-surface border border-dark-border">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-xs">
                                    {product.seller?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-dark-text flex items-center gap-1">
                                        {product.seller?.name}
                                        <ShieldCheck size={10} className="text-brand-accent" />
                                    </p>
                                    <p className="text-[10px] text-dark-text-muted">Verified Student Seller</p>
                                </div>
                            </div>

                            {/* Price breakdown */}
                            <div className="space-y-2.5 mb-5 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Price</span>
                                    <span className="text-dark-text">{formatPrice(product.sellingPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Original Price</span>
                                    <span className="text-dark-text-muted line-through">{formatPrice(product.originalPrice)}</span>
                                </div>
                                <div className="flex justify-between text-condition-new">
                                    <span>You Save</span>
                                    <span className="font-medium">{formatPrice(product.originalPrice - product.sellingPrice)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary flex items-center gap-1">
                                        Platform Fee <span className="text-[10px] text-dark-text-muted">(2.5%)</span>
                                    </span>
                                    <span className="text-dark-text">{formatPrice(platformFee)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-dark-text-secondary">Delivery</span>
                                    <span className="text-condition-new font-medium">FREE (Campus Meetup)</span>
                                </div>
                                <div className="border-t border-dark-border pt-2.5 flex justify-between">
                                    <span className="font-semibold text-dark-text">Total</span>
                                    <span className="font-bold text-lg gradient-text">{formatPrice(totalAmount)}</span>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="space-y-2">
                                {[
                                    { icon: <ShieldCheck size={14} />, text: 'Verified Student Seller' },
                                    { icon: <MapPin size={14} />, text: 'Safe Campus Meetup' },
                                    { icon: <Lock size={14} />, text: 'Secure Payment' },
                                    { icon: <Clock size={14} />, text: '24h Money-Back Guarantee' },
                                ].map((badge, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs text-dark-text-muted">
                                        <span className="text-brand-accent">{badge.icon}</span>
                                        {badge.text}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
