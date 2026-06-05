'use client';

import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown, Grid3X3, LayoutList, Sparkles } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import { mockProducts } from '@/lib/data';
import { useProductStore } from '@/store';
import { CATEGORIES, CONDITIONS, COLORS, UNIVERSITIES, Product, ProductCategory, ProductCondition } from '@/types';

export default function MarketplacePage() {
    const { filteredProducts, filters, setProducts, setFilters, clearFilters, userListings } = useProductStore();
    const [showFilters, setShowFilters] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [mounted, setMounted] = useState(false);

    // Wait for client-side mount (ensures Zustand has hydrated from localStorage)
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        // Try to fetch from real database API
        const fetchProducts = async () => {
            try {
                const res = await fetch('/api/products');
                const data = await res.json();
                if (data.success && data.products.length > 0) {
                    // Merge DB products with any local-only listings
                    const dbIds = new Set(data.products.map((p: Product) => p.id));
                    const localOnly = userListings.filter(p => !dbIds.has(p.id) && p.status === 'active');
                    setProducts([...localOnly, ...data.products]);
                    return;
                }
            } catch {
                console.log('API not available, using local data');
            }

            // Fallback: merge mock products with user-listed products (localStorage)
            const userListingIds = new Set(userListings.map(p => p.id));
            const mocksWithoutDuplicates = mockProducts.filter(p => !userListingIds.has(p.id));
            const allProducts = [...userListings.filter(p => p.status === 'active'), ...mocksWithoutDuplicates];
            setProducts(allProducts);
        };

        fetchProducts();
    }, [mounted, setProducts, userListings]);

    const handleSearch = (val: string) => {
        setSearchValue(val);
        setFilters({ search: val });
    };

    const activeFiltersCount = Object.values(filters).filter((v) => v !== undefined && v !== '').length;

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text flex items-center gap-2">
                            Marketplace
                            <Sparkles size={24} className="text-brand-gold" />
                        </h1>
                        <p className="text-dark-text-secondary mt-1">
                            {filteredProducts.length} items available
                        </p>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search by name, brand..."
                                value={searchValue}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="input-field pl-10 pr-4 py-2.5 text-sm"
                            />
                        </div>

                        {/* Filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`relative btn-secondary py-2.5 ${showFilters ? 'bg-brand-primary/10 border-brand-primary/40' : ''}`}
                        >
                            <SlidersHorizontal size={18} />
                            <span className="hidden sm:inline">Filters</span>
                            {activeFiltersCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-brand-secondary rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* View toggle */}
                        <div className="hidden sm:flex items-center gap-1 bg-dark-card rounded-xl p-1 border border-dark-border">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-brand-primary/20 text-brand-primary' : 'text-dark-text-muted hover:text-dark-text'}`}
                            >
                                <Grid3X3 size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-brand-primary/20 text-brand-primary' : 'text-dark-text-muted hover:text-dark-text'}`}
                            >
                                <LayoutList size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="glass rounded-2xl p-6 mb-8 animate-slide-up">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-semibold text-dark-text">Filter Results</h3>
                            <button onClick={clearFilters} className="text-xs text-brand-secondary hover:text-brand-secondary/80 transition-colors flex items-center gap-1">
                                <X size={12} /> Clear All
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {/* Category */}
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">Category</label>
                                <div className="relative">
                                    <select
                                        value={filters.category || ''}
                                        onChange={(e) => setFilters({ category: e.target.value as ProductCategory || undefined })}
                                        className="input-field py-2 text-sm appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="">All</option>
                                        {CATEGORIES.map((c) => (
                                            <option key={c.value} value={c.value}>{c.icon} {c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted pointer-events-none" />
                                </div>
                            </div>

                            {/* Condition */}
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">Condition</label>
                                <div className="relative">
                                    <select
                                        value={filters.condition || ''}
                                        onChange={(e) => setFilters({ condition: e.target.value as ProductCondition || undefined })}
                                        className="input-field py-2 text-sm appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="">All</option>
                                        {CONDITIONS.map((c) => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted pointer-events-none" />
                                </div>
                            </div>

                            {/* Color */}
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">Color</label>
                                <div className="relative">
                                    <select
                                        value={filters.color || ''}
                                        onChange={(e) => setFilters({ color: e.target.value || undefined })}
                                        className="input-field py-2 text-sm appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="">All</option>
                                        {COLORS.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted pointer-events-none" />
                                </div>
                            </div>

                            {/* University */}
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">University</label>
                                <div className="relative">
                                    <select
                                        value={filters.university || ''}
                                        onChange={(e) => setFilters({ university: e.target.value || undefined })}
                                        className="input-field py-2 text-sm appearance-none cursor-pointer pr-8"
                                    >
                                        <option value="">All</option>
                                        {UNIVERSITIES.map((u) => (
                                            <option key={u} value={u}>{u}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted pointer-events-none" />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">Min Price</label>
                                <input
                                    type="number"
                                    placeholder="₹ Min"
                                    value={filters.priceMin || ''}
                                    onChange={(e) => setFilters({ priceMin: e.target.value ? Number(e.target.value) : undefined })}
                                    className="input-field py-2 text-sm"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-dark-text-muted mb-1.5 block">Max Price</label>
                                <input
                                    type="number"
                                    placeholder="₹ Max"
                                    value={filters.priceMax || ''}
                                    onChange={(e) => setFilters({ priceMax: e.target.value ? Number(e.target.value) : undefined })}
                                    className="input-field py-2 text-sm"
                                />
                            </div>
                        </div>

                        {/* Sort */}
                        <div className="mt-4 pt-4 border-t border-dark-border">
                            <label className="text-xs text-dark-text-muted mb-2 block">Sort By</label>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: 'newest', label: '🆕 Newest' },
                                    { value: 'price-asc', label: '💰 Price: Low to High' },
                                    { value: 'price-desc', label: '💎 Price: High to Low' },
                                    { value: 'best-condition', label: '✨ Best Condition' },
                                ].map((sort) => (
                                    <button
                                        key={sort.value}
                                        onClick={() => setFilters({ sortBy: sort.value as 'newest' | 'price-asc' | 'price-desc' | 'best-condition' })}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filters.sortBy === sort.value
                                            ? 'bg-brand-primary/20 text-brand-primary border border-brand-primary/30'
                                            : 'bg-dark-card text-dark-text-secondary border border-dark-border hover:border-dark-card-hover'
                                            }`}
                                    >
                                        {sort.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length > 0 ? (
                    <div className={`stagger-children ${viewMode === 'grid'
                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                        : 'flex flex-col gap-4'
                        }`}>
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-dark-text mb-2">No items found</h3>
                        <p className="text-dark-text-secondary mb-6">Try adjusting your filters or search terms</p>
                        <button onClick={clearFilters} className="btn-primary">
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
