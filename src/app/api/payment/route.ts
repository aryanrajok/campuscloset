import { NextRequest, NextResponse } from 'next/server';

// POST /api/payment/create-order
// In production, this would use the Razorpay server SDK to create a real order
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { amount, productId, productTitle, buyerId, sellerId } = body;

        if (!amount || !productId) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 },
            );
        }

        // Generate a mock order ID (in production, use Razorpay server SDK)
        // const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
        // const order = await razorpay.orders.create({ amount: amount * 100, currency: 'INR', receipt: `receipt_${Date.now()}` });

        const order = {
            id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
            amount: amount * 100, // in paise
            currency: 'INR',
            receipt: `receipt_${productId}_${Date.now()}`,
            status: 'created',
            productId,
            productTitle,
            buyerId,
            sellerId,
            createdAt: new Date().toISOString(),
        };

        return NextResponse.json({ success: true, order });
    } catch (error) {
        console.error('Payment order creation failed:', error);
        return NextResponse.json(
            { error: 'Failed to create payment order' },
            { status: 500 },
        );
    }
}
