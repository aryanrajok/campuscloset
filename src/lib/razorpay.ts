// ============================================
// Razorpay Payment Gateway Integration
// ============================================

export interface RazorpayOrder {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
}

export interface RazorpayPaymentResult {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
}

export interface PaymentDetails {
    productId: string;
    productTitle: string;
    amount: number;
    sellerName: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    paymentMethod: 'razorpay' | 'upi-direct';
    upiId?: string;
}

interface RazorpayInstance {
    open: () => void;
    on: (event: string, callback: (response: { error: { code: string; description: string } }) => void) => void;
}

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => RazorpayInstance;
    }
}

// Load Razorpay checkout script dynamically
export function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') return resolve(false);

        // Already loaded
        if (window.Razorpay) return resolve(true);

        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

// Initialize Razorpay payment
export async function initiateRazorpayPayment(
    details: PaymentDetails,
    onSuccess: (result: RazorpayPaymentResult) => void,
    onFailure: (error: Error) => void,
) {
    const loaded = await loadRazorpayScript();
    if (!loaded || !window.Razorpay) {
        onFailure(new Error('Failed to load Razorpay SDK'));
        return;
    }

    // In production, this order would be created server-side via /api/payment/create-order
    // For MVP demo, we simulate the order creation
    const orderId = `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

    const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_demo_key',
        amount: details.amount * 100, // Razorpay expects paise
        currency: 'INR',
        name: 'CampusCloset',
        description: `Payment for ${details.productTitle}`,
        order_id: orderId,
        image: '/favicon.ico',
        prefill: {
            name: details.buyerName,
            email: details.buyerEmail,
            contact: details.buyerPhone,
        },
        notes: {
            product_id: details.productId,
            seller: details.sellerName,
        },
        theme: {
            color: '#6C63FF',
            backdrop_color: 'rgba(10, 10, 26, 0.85)',
        },
        handler: function (response: RazorpayPaymentResult) {
            onSuccess(response);
        },
        modal: {
            ondismiss: function () {
                onFailure(new Error('Payment cancelled by user'));
            },
        },
    };

    try {
        const razorpay = new window.Razorpay(options);
        razorpay.on('payment.failed', (response) => {
            onFailure(new Error(response.error.description || 'Payment failed'));
        });
        razorpay.open();
    } catch (error) {
        onFailure(error instanceof Error ? error : new Error(String(error)));
    }
}

// Generate UPI payment link (deep link)
export function generateUPILink(
    upiId: string,
    amount: number,
    productTitle: string,
    txnId: string,
): string {
    const params = new URLSearchParams({
        pa: upiId, // payee VPA
        pn: 'CampusCloset', // payee name
        tn: `Payment for ${productTitle}`, // transaction note
        am: amount.toString(), // amount
        cu: 'INR', // currency
        tr: txnId, // transaction reference
    });
    return `upi://pay?${params.toString()}`;
}

// Format card number for display
export function formatCardNumber(num: string): string {
    return num.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
}

// Validate UPI ID format
export function isValidUPI(upiId: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/.test(upiId);
}
