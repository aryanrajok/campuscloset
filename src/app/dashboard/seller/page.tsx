'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Plus, Package, DollarSign, Eye, TrendingUp, MessageCircle,
    Edit, Trash2, CheckCircle2, MoreVertical,
    Image as ImageIcon, X, Save, Sparkles,
    BarChart3
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import SolarSystem from '@/components/ui/SolarSystem';
import StudentVisual from '@/components/ui/StudentVisual';
import { mockProducts, formatPrice, suggestPrice, timeAgo } from '@/lib/data';
import { useAuthStore, useProductStore } from '@/store';
import { CATEGORIES, CONDITIONS, COLORS, SIZES, UNIVERSITIES, Product, ProductCategory, ProductCondition } from '@/types';

type Tab = 'overview' | 'listings' | 'add' | 'analytics';

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const { userListings, addProduct, deleteProduct, updateProduct } = useProductStore();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [showDropdown, setShowDropdown] = useState<string | null>(null);

    // Combine mock data (for demo) with user-added listings
    const [myListings, setMyListings] = useState<Product[]>([]);

    // Add product form state
    const [form, setForm] = useState({
        title: '', category: '' as ProductCategory | '', brand: '', size: '',
        color: '', condition: '' as ProductCondition | '', originalPrice: '',
        sellingPrice: '', negotiable: false, description: '',
        university: user?.university || '', pickupLocation: '',
    });
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (files: FileList | null) => {
        if (!files) return;
        const remaining = 4 - imagePreviews.length;
        if (remaining <= 0) return;

        const newFiles = Array.from(files).slice(0, remaining);
        const validFiles = newFiles.filter(f => {
            if (!f.type.startsWith('image/')) return false;
            if (f.size > 5 * 1024 * 1024) return false; // 5MB limit
            return true;
        });

        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        handleImageUpload(e.dataTransfer.files);
    };

    useEffect(() => {
        // Merge mock products (for demo) with any user-created listings from the store
        const mockSeller = mockProducts.filter((p) => p.sellerId === 'user-1');
        const mockIds = new Set(mockSeller.map(p => p.id));
        // Avoid duplicating mock products that might already be in userListings
        const uniqueUserListings = userListings.filter(p => !mockIds.has(p.id));
        
        const timer = setTimeout(() => {
            setMyListings([...uniqueUserListings, ...mockSeller]);
        }, 0);
        return () => clearTimeout(timer);
    }, [userListings]);

    // Price suggestion (derived state calculated on-the-fly)
    const suggestedPrice = (form.originalPrice && form.condition)
        ? suggestPrice(Number(form.originalPrice), form.condition)
        : 0;
        
    const [isDraft, setIsDraft] = useState(false);

    const stats = [
        { icon: <Package size={20} />, label: 'Active Listings', value: myListings.filter((l) => l.status === 'active').length, color: '#6C63FF' },
        { icon: <Eye size={20} />, label: 'Total Views', value: myListings.reduce((s, l) => s + (l.views || 0), 0), color: '#4ECDC4' },
        { icon: <DollarSign size={20} />, label: 'Potential Earnings', value: formatPrice(myListings.reduce((s, l) => s + l.sellingPrice, 0)), color: '#FFD93D' },
        { icon: <MessageCircle size={20} />, label: 'Chat Messages', value: '24', color: '#FF6B6B' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            title: form.title,
            category: form.category as ProductCategory,
            brand: form.brand,
            size: form.size,
            color: form.color,
            condition: form.condition as ProductCondition,
            originalPrice: Number(form.originalPrice),
            sellingPrice: Number(form.sellingPrice),
            negotiable: form.negotiable,
            images: imagePreviews,
            university: form.university,
            pickupLocation: form.pickupLocation,
            description: form.description,
            status: isDraft ? 'draft' : 'active',
        };

        // Try to save to MongoDB API
        let savedProduct: Product | null = null;
        try {
            const res = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...productData,
                    sellerId: user?.id,
                    sellerName: user?.name,
                    sellerEmail: user?.email,
                }),
            });
            const data = await res.json();
            if (data.success) {
                savedProduct = {
                    ...data.product,
                    seller: data.product.seller || {
                        id: user?.id, name: user?.name, email: user?.email,
                        university: user?.university, isVerifiedStudent: user?.isVerifiedStudent,
                        rating: user?.rating || 0, totalRatings: user?.totalRatings || 0,
                    },
                } as Product;
                console.log('✅ Product saved to database:', savedProduct.id);
            }
        } catch {
            console.log('Database save failed, using localStorage only');
        }

        // Create product for local store
        const newProduct: Product = savedProduct || {
            id: `prod-new-${Date.now()}`,
            sellerId: user?.id || 'user-1',
            title: form.title,
            category: form.category as ProductCategory,
            brand: form.brand,
            size: form.size,
            color: form.color,
            condition: form.condition as ProductCondition,
            originalPrice: Number(form.originalPrice),
            sellingPrice: Number(form.sellingPrice),
            negotiable: form.negotiable,
            images: imagePreviews,
            university: form.university,
            pickupLocation: form.pickupLocation,
            description: form.description,
            status: isDraft ? 'draft' : 'active',
            views: 0,
            wishlistCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save to local Zustand store (persisted in localStorage) for immediate UI
        addProduct(newProduct);
        setActiveTab('listings');
        setForm({
            title: '', category: '', brand: '', size: '', color: '',
            condition: '', originalPrice: '', sellingPrice: '',
            negotiable: false, description: '',
            university: user?.university || '', pickupLocation: '',
        });
        setImagePreviews([]);
    };

    const handleDelete = (id: string) => {
        deleteProduct(id);
        // Also remove from local state for immediate UI feedback
        setMyListings(prev => prev.filter((l) => l.id !== id));
        setShowDropdown(null);
    };

    const handleMarkSold = (id: string) => {
        updateProduct(id, { status: 'sold' });
        setMyListings(prev => prev.map((l) => l.id === id ? { ...l, status: 'sold' as const } : l));
        setShowDropdown(null);
    };

    const tabs: { value: Tab; label: string; icon: React.ReactNode }[] = [
        { value: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
        { value: 'listings', label: 'My Listings', icon: <Package size={18} /> },
        { value: 'add', label: 'Add Product', icon: <Plus size={18} /> },
        { value: 'analytics', label: 'Analytics', icon: <TrendingUp size={18} /> },
    ];

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text">
                            Seller Dashboard
                        </h1>
                        <p className="text-dark-text-secondary mt-1">
                            Welcome back, <span className="text-brand-primary font-medium">{user?.name || 'Seller'}</span> 👋
                        </p>
                    </div>
                    <button
                        onClick={() => setActiveTab('add')}
                        className="btn-primary"
                    >
                        <Plus size={18} /> Add New Product
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-dark-surface rounded-2xl p-1.5 mb-8 overflow-x-auto border border-dark-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value
                                ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                                : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-card'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ===================== OVERVIEW TAB ===================== */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass rounded-2xl p-5 hover:border-brand-primary/20 transition-all">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <TrendingUp size={14} className="text-condition-new" />
                                    </div>
                                    <p className="text-2xl font-bold text-dark-text">{stat.value}</p>
                                    <p className="text-xs text-dark-text-muted mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Solar System + Student Visual (side by side like a dashboard showcase) */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center">
                                <h3 className="text-lg font-semibold text-dark-text mb-4 text-center">
                                    CampusCloset <span className="gradient-text">Ecosystem</span>
                                </h3>
                                <p className="text-sm text-dark-text-secondary text-center mb-6">
                                    Your products orbit around the CampusCloset universe
                                </p>
                                <SolarSystem />
                            </div>

                            <div className="glass rounded-3xl p-8 flex flex-col items-center justify-center">
                                <h3 className="text-lg font-semibold text-dark-text mb-4 text-center">
                                    How Students <span className="gradient-text">Connect</span>
                                </h3>
                                <p className="text-sm text-dark-text-secondary text-center mb-6">
                                    Sellers list → Buyers discover → Campus exchange
                                </p>
                                <StudentVisual />
                            </div>
                        </div>

                        {/* Recent Listings */}
                        <div>
                            <h3 className="text-lg font-semibold text-dark-text mb-4">Recent Listings</h3>
                            <div className="space-y-3">
                                {myListings.slice(0, 3).map((listing) => (
                                    <div key={listing.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:border-brand-primary/20 transition-all">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-2xl`}>
                                            {listing.category === 'suit' ? '🤵' : listing.category === 'pant' ? '👖' : listing.category === 'formal-shoes' ? '👞' : listing.category === 'tie' ? '👔' : listing.category === 'white-shirt' ? '👕' : listing.category === 'blazer' ? '🧥' : '📦'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-dark-text truncate">{listing.title}</p>
                                            <p className="text-sm text-dark-text-secondary">{formatPrice(listing.sellingPrice)} · {listing.views} views</p>
                                        </div>
                                        <span className={`badge ${listing.status === 'active' ? 'badge-new' : listing.status === 'sold' ? 'badge-like-new' : 'badge-used'}`}>
                                            {listing.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ===================== MY LISTINGS TAB ===================== */}
                {activeTab === 'listings' && (
                    <div className="animate-fade-in">
                        {myListings.length > 0 ? (
                            <div className="space-y-4">
                                {myListings.map((listing) => (
                                    <div key={listing.id} className="glass rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:border-brand-primary/20 transition-all">
                                        {/* Image placeholder */}
                                        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-3xl shrink-0">
                                            {listing.category === 'suit' ? '🤵' : listing.category === 'pant' ? '👖' : listing.category === 'formal-shoes' ? '👞' : listing.category === 'tie' ? '👔' : listing.category === 'white-shirt' ? '👕' : listing.category === 'blazer' ? '🧥' : '📦'}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-dark-text truncate">{listing.title}</h3>
                                            <div className="flex items-center gap-3 mt-1">
                                                <span className="text-sm font-medium gradient-text">{formatPrice(listing.sellingPrice)}</span>
                                                <span className="text-xs text-dark-text-muted line-through">{formatPrice(listing.originalPrice)}</span>
                                                <span className={`badge badge-${listing.condition} text-[10px]`}>
                                                    {CONDITIONS.find((c) => c.value === listing.condition)?.label}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-4 mt-2 text-xs text-dark-text-muted">
                                                <span className="flex items-center gap-1"><Eye size={12} /> {listing.views}</span>
                                                <span className="flex items-center gap-1">{listing.university}</span>
                                                <span>{timeAgo(listing.createdAt)}</span>
                                            </div>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center gap-3">
                                            <span className={`badge ${listing.status === 'active' ? 'badge-new' : listing.status === 'sold' ? 'badge-like-new' : listing.status === 'draft' ? 'badge-good' : 'badge-used'}`}>
                                                {listing.status}
                                            </span>

                                            {/* Actions dropdown */}
                                            <div className="relative">
                                                <button
                                                    onClick={() => setShowDropdown(showDropdown === listing.id ? null : listing.id)}
                                                    className="p-2 rounded-xl text-dark-text-muted hover:text-dark-text hover:bg-dark-card transition-all"
                                                >
                                                    <MoreVertical size={18} />
                                                </button>

                                                {showDropdown === listing.id && (
                                                    <div className="absolute right-0 top-full mt-1 w-48 glass rounded-xl overflow-hidden z-20 animate-slide-up">
                                                        <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all">
                                                            <Edit size={14} /> Edit Listing
                                                        </button>
                                                        <button
                                                            onClick={() => handleMarkSold(listing.id)}
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-condition-new hover:bg-condition-new/10 transition-all"
                                                        >
                                                            <CheckCircle2 size={14} /> Mark as Sold
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(listing.id)}
                                                            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-brand-secondary hover:bg-brand-secondary/10 transition-all"
                                                        >
                                                            <Trash2 size={14} /> Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Package size={48} className="text-dark-text-muted mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-dark-text mb-2">No listings yet</h3>
                                <p className="text-dark-text-secondary mb-6">Start by adding your first product</p>
                                <button onClick={() => setActiveTab('add')} className="btn-primary">
                                    <Plus size={18} /> Add Product
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* ===================== ADD PRODUCT TAB ===================== */}
                {activeTab === 'add' && (
                    <div className="max-w-3xl mx-auto animate-fade-in">
                        <div className="glass rounded-3xl p-8">
                            <h2 className="text-xl font-bold text-dark-text mb-1">List a New Item</h2>
                            <p className="text-sm text-dark-text-secondary mb-8">Fill in the details to list your formal wear</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="text-sm text-dark-text-secondary mb-1.5 block">Product Title *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Raymond Navy Blue Suit - Slim Fit"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="input-field"
                                        required
                                    />
                                </div>

                                {/* Category + Brand */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Category *</label>
                                        <select
                                            value={form.category}
                                            onChange={(e) => setForm({ ...form, category: e.target.value as ProductCategory, size: '' })}
                                            className="input-field appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select category</option>
                                            {CATEGORIES.map((c) => (
                                                <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Brand (optional)</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Raymond, Van Heusen"
                                            value={form.brand}
                                            onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                {/* Size + Color */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Size *</label>
                                        <select
                                            value={form.size}
                                            onChange={(e) => setForm({ ...form, size: e.target.value })}
                                            className="input-field appearance-none cursor-pointer"
                                            required
                                            disabled={!form.category}
                                        >
                                            <option value="">Select size</option>
                                            {form.category && SIZES[form.category as keyof typeof SIZES]?.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Color *</label>
                                        <select
                                            value={form.color}
                                            onChange={(e) => setForm({ ...form, color: e.target.value })}
                                            className="input-field appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select color</option>
                                            {COLORS.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Condition */}
                                <div>
                                    <label className="text-sm text-dark-text-secondary mb-1.5 block">Condition *</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {CONDITIONS.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                onClick={() => setForm({ ...form, condition: c.value })}
                                                className={`p-3 rounded-xl text-sm font-medium text-center transition-all border ${form.condition === c.value
                                                    ? 'scale-[1.02]'
                                                    : 'border-dark-border bg-dark-card hover:border-dark-card-hover'
                                                    }`}
                                                style={{
                                                    borderColor: form.condition === c.value ? c.color : undefined,
                                                    background: form.condition === c.value ? `${c.color}15` : undefined,
                                                    color: form.condition === c.value ? c.color : undefined,
                                                }}
                                            >
                                                {c.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Original Price (₹) *</label>
                                        <input
                                            type="number"
                                            placeholder="8500"
                                            value={form.originalPrice}
                                            onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 flex items-center gap-2">
                                            Selling Price (₹) *
                                            {suggestedPrice > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => setForm({ ...form, sellingPrice: String(suggestedPrice) })}
                                                    className="text-[10px] px-2 py-0.5 rounded-md bg-brand-accent/15 text-brand-accent border border-brand-accent/30 hover:bg-brand-accent/25 transition-all"
                                                >
                                                    <Sparkles size={10} className="inline mr-0.5" />
                                                    Suggested: ₹{suggestedPrice}
                                                </button>
                                            )}
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="3200"
                                            value={form.sellingPrice}
                                            onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Negotiable toggle */}
                                <div className="flex items-center gap-3">
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={form.negotiable}
                                            onChange={(e) => setForm({ ...form, negotiable: e.target.checked })}
                                            className="sr-only peer"
                                        />
                                        <div className="w-11 h-6 bg-dark-card rounded-full peer-checked:bg-brand-primary transition-all peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all border border-dark-border" />
                                    </label>
                                    <span className="text-sm text-dark-text-secondary">Price is negotiable</span>
                                </div>

                                {/* Images */}
                                <div>
                                    <label className="text-sm text-dark-text-secondary mb-1.5 block">Photos</label>
                                    {/* Hidden file input */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/webp,image/heic"
                                        multiple
                                        className="hidden"
                                        onChange={(e) => handleImageUpload(e.target.files)}
                                    />

                                    <div
                                        className={`grid grid-cols-4 gap-3 ${dragActive ? 'ring-2 ring-brand-primary/50 rounded-xl' : ''}`}
                                        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                                        onDragLeave={() => setDragActive(false)}
                                        onDrop={handleDrop}
                                    >
                                        {/* Uploaded image previews */}
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border-2 border-brand-primary/30">
                                                <img src={src} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-brand-secondary/90 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                                >
                                                    <X size={12} />
                                                </button>
                                                {i === 0 && (
                                                    <span className="absolute bottom-1 left-1 text-[8px] font-bold px-1.5 py-0.5 rounded bg-brand-primary/90 text-white">
                                                        COVER
                                                    </span>
                                                )}
                                            </div>
                                        ))}

                                        {/* Add photo button (if < 4) */}
                                        {imagePreviews.length < 4 && (
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className={`aspect-square rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-1 cursor-pointer ${dragActive
                                                    ? 'border-brand-primary bg-brand-primary/10'
                                                    : 'border-dark-border hover:border-brand-primary/40 bg-dark-card'
                                                    }`}
                                            >
                                                <ImageIcon size={20} className={dragActive ? 'text-brand-primary' : 'text-dark-text-muted'} />
                                                <span className={`text-[10px] ${dragActive ? 'text-brand-primary' : 'text-dark-text-muted'}`}>
                                                    {dragActive ? 'Drop here!' : 'Add Photo'}
                                                </span>
                                            </button>
                                        )}

                                        {/* Empty placeholder slots */}
                                        {Array.from({ length: Math.max(0, 3 - imagePreviews.length) }).map((_, i) => (
                                            <div
                                                key={`empty-${i}`}
                                                onClick={() => fileInputRef.current?.click()}
                                                className="aspect-square rounded-xl border border-dashed border-dark-border bg-dark-card/30 flex items-center justify-center cursor-pointer hover:bg-dark-card/50 transition-all"
                                            >
                                                <Plus size={16} className="text-dark-text-muted/30" />
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-[11px] text-dark-text-muted mt-1.5">
                                        📸 Upload up to 4 photos (JPEG, PNG, WebP · Max 5MB). Drag & drop or click to browse. Clear photos sell faster!
                                    </p>
                                </div>

                                {/* University + Pickup */}
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">University *</label>
                                        <select
                                            value={form.university}
                                            onChange={(e) => setForm({ ...form, university: e.target.value })}
                                            className="input-field appearance-none cursor-pointer"
                                            required
                                        >
                                            <option value="">Select university</option>
                                            {UNIVERSITIES.map((u) => (
                                                <option key={u} value={u}>{u}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-sm text-dark-text-secondary mb-1.5 block">Pickup Location *</label>
                                        <input
                                            type="text"
                                            placeholder="e.g., Hostel Block C"
                                            value={form.pickupLocation}
                                            onChange={(e) => setForm({ ...form, pickupLocation: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm text-dark-text-secondary mb-1.5 block">Description</label>
                                    <textarea
                                        placeholder="Describe your item — condition details, why you're selling, any defects..."
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        rows={4}
                                        className="input-field resize-none"
                                    />
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                                    <button type="submit" className="btn-primary flex-1 justify-center py-3.5 text-base">
                                        <Package size={18} /> Publish Listing
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setIsDraft(true); handleSubmit(new Event('submit') as unknown as React.FormEvent); }}
                                        className="btn-secondary flex-1 justify-center py-3.5 text-base"
                                    >
                                        <Save size={18} /> Save Draft
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* ===================== ANALYTICS TAB ===================== */}
                {activeTab === 'analytics' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="glass rounded-3xl p-8 text-center">
                            <BarChart3 size={48} className="text-brand-primary mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-dark-text mb-2">Analytics Dashboard</h3>
                            <p className="text-dark-text-secondary mb-4">Coming soon — Track your sales, views, and buyer engagement</p>

                            {/* Preview analytics cards */}
                            <div className="grid sm:grid-cols-3 gap-4 mt-8">
                                <div className="glass rounded-xl p-5">
                                    <p className="text-3xl font-bold gradient-text">548</p>
                                    <p className="text-sm text-dark-text-muted mt-1">Total Views This Month</p>
                                    <p className="text-xs text-condition-new mt-2">↑ 23% vs last month</p>
                                </div>
                                <div className="glass rounded-xl p-5">
                                    <p className="text-3xl font-bold gradient-text">12</p>
                                    <p className="text-sm text-dark-text-muted mt-1">Buyer Inquiries</p>
                                    <p className="text-xs text-condition-new mt-2">↑ 15% vs last month</p>
                                </div>
                                <div className="glass rounded-xl p-5">
                                    <p className="text-3xl font-bold gradient-text">₹4.5K</p>
                                    <p className="text-sm text-dark-text-muted mt-1">Revenue (if all sold)</p>
                                    <p className="text-xs text-brand-accent mt-2">3 items in pipeline</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
