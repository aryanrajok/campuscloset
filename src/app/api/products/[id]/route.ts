import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Product, IProduct, IUser } from '@/lib/models';

type PopulatedProduct = Omit<IProduct, 'sellerId'> & {
    _id: { toString: () => string };
    sellerId?: IUser & { _id: { toString: () => string } };
};

// GET /api/products/[id] — Get single product
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const product = await Product.findById(id)
            .populate('sellerId', 'name email avatar university isVerifiedStudent rating totalRatings upiId phone')
            .lean();

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        const p = product as unknown as PopulatedProduct;
        const response = {
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
                phone: p.sellerId.phone,
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
        };

        // Increment views
        await Product.findByIdAndUpdate(id, { $inc: { views: 1 } });

        return NextResponse.json({ success: true, product: response });
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch product' },
            { status: 500 }
        );
    }
}

// PUT /api/products/[id] — Update product
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;
        const updates = await request.json();

        const product = await Product.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).lean();

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        const p = product as unknown as { _id: { toString: () => string } } & Record<string, unknown>;
        return NextResponse.json({
            success: true,
            product: {
                id: p._id.toString(),
                ...p,
                _id: undefined,
            },
        });
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update product' },
            { status: 500 }
        );
    }
}

// DELETE /api/products/[id] — Delete product (soft delete by setting status to 'removed')
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectDB();
        const { id } = await params;

        const product = await Product.findByIdAndUpdate(
            id,
            { status: 'removed' },
            { new: true }
        );

        if (!product) {
            return NextResponse.json(
                { success: false, error: 'Product not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete product' },
            { status: 500 }
        );
    }
}
