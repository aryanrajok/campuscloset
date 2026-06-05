'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ShoppingBag, Heart, MessageCircle, Package,
    Clock
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import { mockProducts } from '@/lib/data';
import { useAuthStore } from '@/store';

type Tab = 'wishlist' | 'chats' | 'offers' | 'history';

export default function BuyerDashboard() {
    const { user } = useAuthStore();
    const [activeTab, setActiveTab] = useState<Tab>('wishlist');

    const wishlistItems = mockProducts.slice(0, 4);
    const chatHistory = [
        { id: '1', sellerName: 'Arjun Mehta', product: 'Raymond Navy Blue Suit', lastMessage: 'Is it still available?', time: '2h ago', unread: 2 },
        { id: '2', sellerName: 'Priya Sharma', product: 'Allen Solly Formal Shirt', lastMessage: 'Can you do ₹500?', time: '1d ago', unread: 0 },
        { id: '3', sellerName: 'Rohan Gupta', product: 'Woodland Formal Shoes', lastMessage: 'Sure, let\'s meet at gate 3', time: '3d ago', unread: 0 },
    ];

    const tabs: { value: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { value: 'wishlist', label: 'Wishlist', icon: <Heart size={18} />, count: wishlistItems.length },
        { value: 'chats', label: 'My Chats', icon: <MessageCircle size={18} />, count: 2 },
        { value: 'offers', label: 'My Offers', icon: <Package size={18} />, count: 1 },
        { value: 'history', label: 'Purchase History', icon: <Clock size={18} /> },
    ];

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text">
                            Buyer Dashboard
                        </h1>
                        <p className="text-dark-text-secondary mt-1">
                            Welcome, <span className="text-brand-accent font-medium">{user?.name || 'Buyer'}</span> 🛍️
                        </p>
                    </div>
                    <Link href="/marketplace" className="btn-primary">
                        <ShoppingBag size={18} /> Browse Marketplace
                    </Link>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { icon: <Heart size={20} />, label: 'Wishlisted', value: '4', color: '#FF6B6B' },
                        { icon: <MessageCircle size={20} />, label: 'Active Chats', value: '3', color: '#6C63FF' },
                        { icon: <Package size={20} />, label: 'Offers Made', value: '1', color: '#4ECDC4' },
                        { icon: <ShoppingBag size={20} />, label: 'Purchased', value: '0', color: '#FFD93D' },
                    ].map((stat, i) => (
                        <div key={i} className="glass rounded-2xl p-4 hover:border-brand-primary/20 transition-all">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-2" style={{ background: `${stat.color}15`, color: stat.color }}>
                                {stat.icon}
                            </div>
                            <p className="text-xl font-bold text-dark-text">{stat.value}</p>
                            <p className="text-xs text-dark-text-muted">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-dark-surface rounded-2xl p-1.5 mb-8 overflow-x-auto border border-dark-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value
                                    ? 'bg-brand-accent text-white shadow-lg shadow-brand-accent/25'
                                    : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-card'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count !== undefined && (
                                <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-[10px] font-bold flex items-center justify-center">
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Wishlist */}
                {activeTab === 'wishlist' && (
                    <div className="animate-fade-in">
                        {wishlistItems.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                                {wishlistItems.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <Heart size={48} className="text-dark-text-muted mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-dark-text mb-2">Your wishlist is empty</h3>
                                <p className="text-dark-text-secondary mb-6">Find something you love in the marketplace</p>
                                <Link href="/marketplace" className="btn-primary">
                                    <ShoppingBag size={18} /> Browse Items
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Chats */}
                {activeTab === 'chats' && (
                    <div className="space-y-3 animate-fade-in">
                        {chatHistory.map((chat) => (
                            <Link
                                key={chat.id}
                                href="/chat"
                                className="glass rounded-xl p-4 flex items-center gap-4 hover:border-brand-primary/20 transition-all block"
                            >
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white font-bold text-sm shrink-0">
                                    {chat.sellerName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-dark-text truncate">{chat.sellerName}</p>
                                        <span className="text-xs text-dark-text-muted">{chat.time}</span>
                                    </div>
                                    <p className="text-xs text-dark-text-muted">{chat.product}</p>
                                    <p className="text-sm text-dark-text-secondary truncate mt-0.5">{chat.lastMessage}</p>
                                </div>
                                {chat.unread > 0 && (
                                    <span className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white">
                                        {chat.unread}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Offers */}
                {activeTab === 'offers' && (
                    <div className="animate-fade-in">
                        <div className="glass rounded-xl p-4 flex items-center gap-4 hover:border-brand-primary/20 transition-all">
                            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-stone-900 to-neutral-900 flex items-center justify-center text-3xl shrink-0">
                                👞
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-dark-text">Woodland Black Formal Shoes</p>
                                <p className="text-sm text-dark-text-secondary">Your offer: <span className="text-brand-accent font-semibold">₹1,000</span></p>
                                <p className="text-xs text-dark-text-muted mt-1">Listed at ₹1,200 · Sent 2 days ago</p>
                            </div>
                            <span className="badge badge-good">Pending</span>
                        </div>
                    </div>
                )}

                {/* Purchase History */}
                {activeTab === 'history' && (
                    <div className="text-center py-20 animate-fade-in">
                        <ShoppingBag size={48} className="text-dark-text-muted mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-dark-text mb-2">No purchases yet</h3>
                        <p className="text-dark-text-secondary mb-6">Complete your first purchase to see it here</p>
                        <Link href="/marketplace" className="btn-primary">
                            <ShoppingBag size={18} /> Start Shopping
                        </Link>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
