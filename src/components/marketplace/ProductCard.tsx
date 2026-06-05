'use client';

import Link from 'next/link';
import { Heart, MapPin, Tag, Eye } from 'lucide-react';
import { Product, CONDITIONS } from '@/types';
import { formatPrice, calcDiscount, timeAgo } from '@/lib/data';
import { useState } from 'react';

const categoryGradient: Record<string, string> = {
    suit: 'from-indigo-900 via-indigo-800 to-blue-900',
    pant: 'from-gray-900 via-gray-800 to-slate-900',
    'formal-shoes': 'from-stone-900 via-stone-800 to-neutral-900',
    tie: 'from-rose-900 via-red-900 to-pink-900',
    'white-shirt': 'from-slate-200 via-gray-100 to-slate-300',
    blazer: 'from-slate-800 via-gray-800 to-zinc-900',
    combo: 'from-cyan-900 via-teal-900 to-emerald-900',
};

const categoryIcon: Record<string, string> = {
    suit: '🤵',
    pant: '👖',
    'formal-shoes': '👞',
    tie: '👔',
    'white-shirt': '👕',
    blazer: '🧥',
    combo: '📦',
};

export default function ProductCard({ product }: { product: Product }) {
    const [wishlisted, setWishlisted] = useState(false);
    const [imgError, setImgError] = useState(false);
    const condition = CONDITIONS.find((c) => c.value === product.condition);
    const discount = calcDiscount(product.originalPrice, product.sellingPrice);

    // Check if product has a valid displayable image
    const hasValidImage = product.images &&
        product.images.length > 0 &&
        product.images[0] &&
        !product.images[0].startsWith('/api/placeholder') &&
        !imgError;

    return (
        <Link href={`/product/${product.id}`} className="block group">
            <div className="card overflow-hidden">
                {/* Image Area */}
                <div className={`relative h-52 bg-gradient-to-br ${categoryGradient[product.category] || 'from-gray-900 to-gray-800'} flex items-center justify-center overflow-hidden`}>
                    {/* Actual product image or fallback emoji */}
                    {hasValidImage ? (
                        <img
                            src={product.images[0]}
                            alt={product.title}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <span className="text-6xl opacity-30 group-hover:scale-125 transition-transform duration-500">
                            {categoryIcon[product.category] || '👔'}
                        </span>
                    )}

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent" />

                    {/* Discount badge */}
                    {discount > 0 && (
                        <div className="absolute top-3 left-3 bg-brand-secondary/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                            {discount}% OFF
                        </div>
                    )}

                    {/* Condition badge */}
                    <div className="absolute top-3 right-12">
                        <span className={`badge badge-${product.condition}`}>
                            {condition?.label}
                        </span>
                    </div>

                    {/* Wishlist */}
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setWishlisted(!wishlisted);
                        }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-dark-bg/60 backdrop-blur-sm flex items-center justify-center hover:bg-dark-bg/80 transition-all"
                    >
                        <Heart
                            size={16}
                            className={wishlisted ? 'text-brand-secondary fill-brand-secondary' : 'text-white'}
                        />
                    </button>

                    {/* Negotiable badge */}
                    {product.negotiable && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-brand-accent/20 backdrop-blur-sm text-brand-accent text-[10px] font-semibold px-2 py-1 rounded-md border border-brand-accent/30">
                            <Tag size={10} /> NEGOTIABLE
                        </div>
                    )}

                    {/* Views */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1 text-dark-text-muted text-[10px] bg-dark-bg/60 backdrop-blur-sm px-2 py-1 rounded-md">
                        <Eye size={10} /> {product.views}
                    </div>
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="text-sm font-semibold text-dark-text group-hover:text-brand-primary transition-colors line-clamp-1">
                        {product.title}
                    </h3>

                    {product.brand && (
                        <p className="text-xs text-dark-text-muted mt-0.5">{product.brand}</p>
                    )}

                    <div className="flex items-baseline gap-2 mt-2">
                        <span className="text-lg font-bold gradient-text">
                            {formatPrice(product.sellingPrice)}
                        </span>
                        <span className="text-xs text-dark-text-muted line-through">
                            {formatPrice(product.originalPrice)}
                        </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-border">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={12} className="text-dark-text-muted" />
                            <span className="text-[11px] text-dark-text-secondary truncate max-w-[120px]">
                                {product.university}
                            </span>
                        </div>
                        <span className="text-[11px] text-dark-text-muted">
                            {timeAgo(product.createdAt)}
                        </span>
                    </div>

                    {/* Size & Color pills */}
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-card text-dark-text-secondary border border-dark-border">
                            Size: {product.size}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-dark-card text-dark-text-secondary border border-dark-border">
                            {product.color}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
