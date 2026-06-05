import { NextRequest, NextResponse } from 'next/server';
import { FilterQuery, SortOrder } from 'mongoose';
import connectDB from '@/lib/mongodb';
import { Product, User } from '@/lib/models';

interface PopulatedSeller {
    _id: { toString(): string };
    name: string;
    email: string;
    avatar?: string;
    university?: string;
    isVerifiedStudent?: boolean;
    rating?: number;
    totalRatings?: number;
    upiId?: string;
}

interface PopulatedProduct {
    _id: { toString(): string };
    sellerId: PopulatedSeller | { toString(): string };
    title: string;
    category: string;
    brand?: string;
    size: string;
    color: string;
    condition: string;
    originalPrice: number;
    sellingPrice: number;
    negotiable?: boolean;
    images: string[];
    university: string;
    pickupLocation: string;
    description: string;
    status: string;
    views?: number;
    wishlistCount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// GET /api/products — List all active products
export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const condition = searchParams.get('condition');
        const university = searchParams.get('university');
        const size = searchParams.get('size');
        const color = searchParams.get('color');
        const search = searchParams.get('search');
        const sortBy = searchParams.get('sortBy');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const sellerId = searchParams.get('sellerId');
        const status = searchParams.get('status') || 'active';
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build query
        const query: FilterQuery<typeof Product> = { status };

        if (category) query.category = category;
        if (condition) query.condition = condition;
        if (university) query.university = university;
        if (size) query.size = size;
        if (color) query.color = color;
        if (sellerId) query.sellerId = sellerId;
        if (priceMin || priceMax) {
            query.sellingPrice = {} as Record<string, number>;
            if (priceMin) (query.sellingPrice as Record<string, number>).$gte = parseInt(priceMin);
            if (priceMax) (query.sellingPrice as Record<string, number>).$lte = parseInt(priceMax);
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
            ];
        }

        // Build sort
        let sort: Record<string, SortOrder> = { createdAt: -1 }; // default: newest first
        if (sortBy === 'price-asc') sort = { sellingPrice: 1 };
        if (sortBy === 'price-desc') sort = { sellingPrice: -1 };
        if (sortBy === 'newest') sort = { createdAt: -1 };

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit)
                .populate('sellerId', 'name email avatar university isVerifiedStudent rating totalRatings upiId')
                .lean(),
            Product.countDocuments(query),
        ]);

        // Transform _id to id and sellerId to seller for frontend compatibility
        const transformedProducts = (products as unknown as PopulatedProduct[]).map((p) => ({
            id: p._id.toString(),
            sellerId: p.sellerId?._id?.toString() || p.sellerId?.toString(),
            seller: p.sellerId && typeof p.sellerId === 'object' ? {
                id: p.sellerId._id.toString(),
                name: p.sellerId.name,
                email: p.sellerId.email,
                avatar: p.sellerId.avatar,
                university: p.sellerId.university,
                isVerifiedStudent: p.sellerId.isVerifiedStudent,
                rating: p.sellerId.rating,
                totalRatings: p.sellerId.totalRatings,
                upiId: p.sellerId.upiId,
            } : undefined,
            title: p.title,
            category: p.category,
            brand: p.brand,
            size: p.size,
            color: p.color,
            condition: p.condition,
            originalPrice: p.originalPrice,
            sellingPrice: p.sellingPrice,
            negotiable: p.negotiable,
            images: p.images,
            university: p.university,
            pickupLocation: p.pickupLocation,
            description: p.description,
            status: p.status,
            views: p.views,
            wishlistCount: p.wishlistCount,
            createdAt: p.createdAt?.toISOString(),
            updatedAt: p.updatedAt?.toISOString(),
        }));

        return NextResponse.json({
            success: true,
            products: transformedProducts,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch products' },
            { status: 500 }
        );
    }
}

// POST /api/products — Create a new product listing
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body = await request.json();

        const {
            sellerId, title, category, brand, size, color,
            condition, originalPrice, sellingPrice, negotiable,
            images, university, pickupLocation, description, sellerName, sellerEmail,
        } = body;

        // Validate required fields
        if (!title || !category || !size || !color || !condition || !originalPrice || !sellingPrice || !university || !pickupLocation || !description) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Find or create seller user
        let seller;
        if (sellerId) {
            seller = await User.findById(sellerId);
        }
        if (!seller && sellerEmail) {
            seller = await User.findOne({ email: sellerEmail });
        }
        if (!seller) {
            // Create a basic user record for the seller
            seller = await User.create({
                name: sellerName || 'Seller',
                email: sellerEmail || `seller_${Date.now()}@campuscloset.in`,
                role: 'seller',
                university,
            });
        }

        const product = await Product.create({
            sellerId: seller._id,
            title,
            category,
            brand: brand || undefined,
            size,
            color,
            condition,
            originalPrice,
            sellingPrice,
            negotiable: negotiable || false,
            images: images || [],
            university,
            pickupLocation,
            description,
            status: 'active',
        });

        // Transform for frontend
        const response = {
            id: product._id.toString(),
            sellerId: seller._id.toString(),
            seller: {
                id: seller._id.toString(),
                name: seller.name,
                email: seller.email,
                avatar: seller.avatar,
                university: seller.university,
                isVerifiedStudent: seller.isVerifiedStudent,
                rating: seller.rating,
                totalRatings: seller.totalRatings,
            },
            title: product.title,
            category: product.category,
            brand: product.brand,
            size: product.size,
            color: product.color,
            condition: product.condition,
            originalPrice: product.originalPrice,
            sellingPrice: product.sellingPrice,
            negotiable: product.negotiable,
            images: product.images,
            university: product.university,
            pickupLocation: product.pickupLocation,
            description: product.description,
            status: product.status,
            views: product.views,
            wishlistCount: product.wishlistCount,
            createdAt: product.createdAt.toISOString(),
            updatedAt: product.updatedAt.toISOString(),
        };

        return NextResponse.json({ success: true, product: response }, { status: 201 });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create product' },
            { status: 500 }
        );
    }
}
