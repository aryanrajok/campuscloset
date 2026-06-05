'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft, Heart, Share2, Flag, MessageCircle, Tag, MapPin,
    Star, ShieldCheck, Eye, Clock, ChevronLeft, ChevronRight, Send, CreditCard
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { mockProducts, formatPrice, calcDiscount, timeAgo } from '@/lib/data';
import { CONDITIONS } from '@/types';
import ProductCard from '@/components/marketplace/ProductCard';
import { useProductStore } from '@/store';

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
    suit: '🤵', pant: '👖', 'formal-shoes': '👞', tie: '👔',
    'white-shirt': '👕', blazer: '🧥', combo: '📦',
};

export default function ProductDetailPage() {
    const params = useParams();
    const [wishlisted, setWishlisted] = useState(false);
    const [showOfferModal, setShowOfferModal] = useState(false);
    const [offerAmount, setOfferAmount] = useState('');
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [imgError, setImgError] = useState(false);

    // Merge mock products with user listings to find any product
    const { userListings } = useProductStore();
    const userListingIds = new Set(userListings.map(p => p.id));
    const allProducts = [...userListings, ...mockProducts.filter(p => !userListingIds.has(p.id))];

    const product = allProducts.find((p) => p.id === params.id);
    const condition = CONDITIONS.find((c) => c.value === product?.condition);
    const discount = product ? calcDiscount(product.originalPrice, product.sellingPrice) : 0;
    const similarProducts = allProducts.filter((p) => p.id !== product?.id && p.category === product?.category).slice(0, 4);

    // Check if the product has a valid displayable image
    const hasValidImage = product?.images &&
        product.images.length > 0 &&
        product.images[0] &&
        !product.images[0].startsWith('/api/placeholder') &&
        !imgError;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params.id]);

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

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-dark-text-muted mb-6">
                    <Link href="/marketplace" className="hover:text-brand-primary transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Marketplace
                    </Link>
                    <span>/</span>
                    <span className="text-dark-text-secondary">{product.title}</span>
                </div>

                <div className="grid lg:grid-cols-2 gap-10">
                    {/* Left — Image Gallery */}
                    <div className="space-y-4">
                        <div className={`relative aspect-square rounded-3xl bg-gradient-to-br ${categoryGradient[product.category]} flex items-center justify-center overflow-hidden group`}>
                            {/* Show actual image or emoji fallback */}
                            {hasValidImage && product.images[activeImageIndex] && !product.images[activeImageIndex].startsWith('/api/placeholder') ? (
                                <img
                                    src={product.images[activeImageIndex] || product.images[0]}
                                    alt={product.title}
                                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    onError={() => setImgError(true)}
                                />
                            ) : (
                                <span className="text-[120px] opacity-30 group-hover:scale-110 transition-transform duration-700">
                                    {categoryIcon[product.category]}
                                </span>
                            )}

                            {/* Discount badge */}
                            {discount > 0 && (
                                <div className="absolute top-4 left-4 bg-brand-secondary/90 backdrop-blur-sm text-white text-sm font-bold px-3 py-1.5 rounded-xl">
                                    {discount}% OFF
                                </div>
                            )}

                            {/* Condition badge */}
                            <div className="absolute top-4 right-4">
                                <span className={`badge badge-${product.condition} text-sm`}>
                                    {condition?.label}
                                </span>
                            </div>

                            {/* Navigation arrows (for multi-image) */}
                            <button className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-bg/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronLeft size={20} />
                            </button>
                            <button className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-dark-bg/60 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3">
                            {(hasValidImage ? product.images : [0, 1, 2, 3]).map((item, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImageIndex(i)}
                                    className={`w-20 h-20 rounded-xl bg-gradient-to-br ${categoryGradient[product.category]} flex items-center justify-center transition-all overflow-hidden ${activeImageIndex === i ? 'ring-2 ring-brand-primary scale-105' : 'opacity-50 hover:opacity-80'
                                        }`}
                                >
                                    {hasValidImage && typeof item === 'string' && !item.startsWith('/api/placeholder') ? (
                                        <img src={item} alt={`${product.title} ${i + 1}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl opacity-40">{categoryIcon[product.category]}</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right — Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="badge badge-new text-[10px]">{product.category.replace('-', ' ').toUpperCase()}</span>
                                {product.negotiable && (
                                    <span className="badge text-[10px] bg-brand-accent/15 text-brand-accent border border-brand-accent/30">
                                        <Tag size={10} /> NEGOTIABLE
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl sm:text-3xl font-bold text-dark-text">{product.title}</h1>
                            {product.brand && (
                                <p className="text-dark-text-secondary mt-1">by <span className="font-medium text-dark-text">{product.brand}</span></p>
                            )}
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold gradient-text">{formatPrice(product.sellingPrice)}</span>
                            <span className="text-lg text-dark-text-muted line-through">{formatPrice(product.originalPrice)}</span>
                            <span className="text-sm font-semibold text-condition-new">Save {formatPrice(product.originalPrice - product.sellingPrice)}</span>
                        </div>

                        {/* Details */}
                        <div className="glass rounded-2xl p-5 space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs text-dark-text-muted">Size</p>
                                    <p className="text-sm font-semibold text-dark-text mt-0.5">{product.size}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-muted">Color</p>
                                    <p className="text-sm font-semibold text-dark-text mt-0.5">{product.color}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-muted">Condition</p>
                                    <p className="text-sm font-semibold mt-0.5" style={{ color: condition?.color }}>{condition?.label}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-dark-text-muted">Category</p>
                                    <p className="text-sm font-semibold text-dark-text mt-0.5">{categoryIcon[product.category]} {product.category.replace('-', ' ')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-sm font-semibold text-dark-text mb-2">Description</h3>
                            <p className="text-sm text-dark-text-secondary leading-relaxed">{product.description}</p>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-3 glass rounded-xl p-4">
                            <MapPin size={20} className="text-brand-accent" />
                            <div>
                                <p className="text-sm font-medium text-dark-text">{product.university}</p>
                                <p className="text-xs text-dark-text-secondary">{product.pickupLocation}</p>
                            </div>
                        </div>

                        {/* Seller Info */}
                        <div className="glass rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-dark-text mb-3">Seller</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold">
                                    {product.seller?.name?.charAt(0)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-dark-text">{product.seller?.name}</p>
                                        {product.seller?.isVerifiedStudent && (
                                            <ShieldCheck size={14} className="text-brand-accent" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <div className="flex items-center gap-1">
                                            <Star size={12} className="text-brand-gold fill-brand-gold" />
                                            <span className="text-xs text-dark-text-secondary">{product.seller?.rating} ({product.seller?.totalRatings} reviews)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <Link
                            href={`/checkout?product=${product.id}`}
                            className="btn-primary w-full justify-center py-3.5 text-base bg-gradient-to-r from-brand-primary to-brand-accent hover:opacity-90"
                        >
                            <CreditCard size={20} /> Buy Now — {formatPrice(product.sellingPrice)}
                        </Link>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/chat" className="btn-secondary flex-1 justify-center py-3.5 text-base border-brand-primary/30 text-brand-primary hover:bg-brand-primary/10">
                                <MessageCircle size={20} /> Chat with Seller
                            </Link>
                            <button
                                onClick={() => setShowOfferModal(true)}
                                className="btn-accent flex-1 justify-center py-3.5 text-base"
                            >
                                <Tag size={20} /> Make Offer
                            </button>
                        </div>

                        {/* Secondary Actions */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setWishlisted(!wishlisted)}
                                className={`btn-secondary flex-1 justify-center py-2.5 ${wishlisted ? 'bg-brand-secondary/10 border-brand-secondary/30 text-brand-secondary' : ''}`}
                            >
                                <Heart size={16} className={wishlisted ? 'fill-brand-secondary' : ''} />
                                {wishlisted ? 'Wishlisted' : 'Wishlist'}
                            </button>
                            <button className="btn-secondary flex-1 justify-center py-2.5">
                                <Share2 size={16} /> Share
                            </button>
                            <button className="btn-secondary py-2.5 text-brand-secondary border-brand-secondary/20 hover:bg-brand-secondary/10">
                                <Flag size={16} />
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-xs text-dark-text-muted">
                            <span className="flex items-center gap-1"><Eye size={12} /> {product.views} views</span>
                            <span className="flex items-center gap-1"><Heart size={12} /> {product.wishlistCount} wishlisted</span>
                            <span className="flex items-center gap-1"><Clock size={12} /> Listed {timeAgo(product.createdAt)}</span>
                        </div>
                    </div>
                </div>

                {/* Similar Products */}
                {similarProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-2xl font-bold text-dark-text mb-6">Similar Items</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {similarProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Offer Modal */}
            {showOfferModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
                    <div className="glass rounded-3xl p-8 w-full max-w-md animate-slide-up">
                        <h3 className="text-xl font-bold text-dark-text mb-2">Make an Offer</h3>
                        <p className="text-sm text-dark-text-secondary mb-6">
                            Listed at <span className="font-semibold text-brand-primary">{formatPrice(product.sellingPrice)}</span>
                        </p>
                        <div className="relative mb-4">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted font-medium">₹</span>
                            <input
                                type="number"
                                placeholder="Enter your offer"
                                value={offerAmount}
                                onChange={(e) => setOfferAmount(e.target.value)}
                                className="input-field pl-8 text-lg font-semibold"
                                autoFocus
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowOfferModal(false)}
                                className="btn-secondary flex-1 justify-center"
                            >
                                Cancel
                            </button>
                            <button className="btn-primary flex-1 justify-center">
                                <Send size={16} /> Send Offer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 lg:hidden glass border-t border-dark-border p-3 z-40">
                <div className="flex gap-2 max-w-7xl mx-auto">
                    <Link href={`/checkout?product=${product.id}`} className="btn-primary flex-1 justify-center py-3 bg-gradient-to-r from-brand-primary to-brand-accent">
                        <CreditCard size={18} /> Buy Now
                    </Link>
                    <Link href="/chat" className="btn-secondary py-3 px-3">
                        <MessageCircle size={18} />
                    </Link>
                    <button onClick={() => setShowOfferModal(true)} className="btn-accent py-3 px-3">
                        <Tag size={18} />
                    </button>
                    <button
                        onClick={() => setWishlisted(!wishlisted)}
                        className="p-3 rounded-xl bg-dark-card border border-dark-border"
                    >
                        <Heart size={18} className={wishlisted ? 'text-brand-secondary fill-brand-secondary' : 'text-dark-text-secondary'} />
                    </button>
                </div>
            </div>

            <Footer />
        </main>
    );
}
