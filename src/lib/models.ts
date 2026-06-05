import mongoose, { Schema, Document, Model } from 'mongoose';

// ============================================
// User Model
// ============================================
export interface IUser extends Document {
    name: string;
    email: string;
    passwordHash?: string;
    avatar?: string;
    role: 'buyer' | 'seller' | 'admin';
    university?: string;
    universityEmail?: string;
    isVerifiedStudent: boolean;
    phone?: string;
    upiId?: string;
    rating: number;
    totalRatings: number;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        passwordHash: { type: String },
        avatar: { type: String },
        role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
        university: { type: String },
        universityEmail: { type: String },
        isVerifiedStudent: { type: Boolean, default: false },
        phone: { type: String },
        upiId: { type: String },
        rating: { type: Number, default: 0, min: 0, max: 5 },
        totalRatings: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// ============================================
// Product Model
// ============================================
export interface IProduct extends Document {
    sellerId: mongoose.Types.ObjectId;
    title: string;
    category: string;
    brand?: string;
    size: string;
    color: string;
    condition: 'new' | 'like-new' | 'good' | 'used';
    originalPrice: number;
    sellingPrice: number;
    negotiable: boolean;
    images: string[];
    university: string;
    pickupLocation: string;
    description: string;
    status: 'active' | 'sold' | 'draft' | 'removed';
    views: number;
    wishlistCount: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        title: { type: String, required: true, trim: true },
        category: {
            type: String,
            enum: ['suit', 'pant', 'formal-shoes', 'tie', 'white-shirt', 'blazer', 'combo'],
            required: true,
        },
        brand: { type: String, trim: true },
        size: { type: String, required: true },
        color: { type: String, required: true },
        condition: { type: String, enum: ['new', 'like-new', 'good', 'used'], required: true },
        originalPrice: { type: Number, required: true, min: 0 },
        sellingPrice: { type: Number, required: true, min: 0 },
        negotiable: { type: Boolean, default: false },
        images: [{ type: String }],
        university: { type: String, required: true },
        pickupLocation: { type: String, required: true },
        description: { type: String, required: true },
        status: { type: String, enum: ['active', 'sold', 'draft', 'removed'], default: 'active' },
        views: { type: Number, default: 0 },
        wishlistCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Add text index for search
ProductSchema.index({ title: 'text', description: 'text', brand: 'text' });
// Index for common queries
ProductSchema.index({ status: 1, category: 1 });
ProductSchema.index({ sellerId: 1 });
ProductSchema.index({ university: 1 });

// ============================================
// Order Model
// ============================================
export interface IOrder extends Document {
    buyerId: mongoose.Types.ObjectId;
    sellerId: mongoose.Types.ObjectId;
    productId: mongoose.Types.ObjectId;
    amount: number;
    platformFee: number;
    totalAmount: number;
    paymentMethod: 'razorpay' | 'upi' | 'cod';
    paymentId?: string;
    razorpayOrderId?: string;
    status: 'pending' | 'paid' | 'meetup-scheduled' | 'delivered' | 'cancelled' | 'refunded';
    meetupNote?: string;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
    {
        buyerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        amount: { type: Number, required: true },
        platformFee: { type: Number, required: true },
        totalAmount: { type: Number, required: true },
        paymentMethod: { type: String, enum: ['razorpay', 'upi', 'cod'], required: true },
        paymentId: { type: String },
        razorpayOrderId: { type: String },
        status: {
            type: String,
            enum: ['pending', 'paid', 'meetup-scheduled', 'delivered', 'cancelled', 'refunded'],
            default: 'pending',
        },
        meetupNote: { type: String },
        buyerName: { type: String, required: true },
        buyerEmail: { type: String, required: true },
        buyerPhone: { type: String, required: true },
    },
    { timestamps: true }
);

OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ sellerId: 1 });
OrderSchema.index({ productId: 1 });

// ============================================
// Export Models (with hot-reload protection)
// ============================================
export const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
export const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
