'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Search, Bell, MessageCircle, Menu, X,
    ShoppingBag, Store, LogOut, ChevronDown, Heart, Settings, Shield
} from 'lucide-react';
import { useAuthStore, useNotificationStore, useUIStore } from '@/store';

export default function Navbar() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuthStore();
    const { unreadCount } = useNotificationStore();
    const { mobileMenuOpen, toggleMobileMenu } = useUIStore();
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { href: '/marketplace', label: 'Marketplace', icon: <ShoppingBag size={18} /> },
        { href: '/dashboard/seller', label: 'Sell', icon: <Store size={18} /> },
    ];

    const isActive = (href: string) => pathname?.startsWith(href);

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                    ? 'glass py-2'
                    : 'bg-transparent py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold gradient-text">Campus</span>
                            <span className="text-xl font-bold text-dark-text">Closet</span>
                        </div>
                    </Link>

                    {/* Search Bar — Desktop */}
                    <div className={`hidden md:flex items-center transition-all duration-300 ${searchFocused ? 'flex-1 max-w-xl mx-8' : 'w-80 mx-4'
                        }`}>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search suits, blazers, shoes..."
                                className="input-field pl-10 pr-4 py-2.5 text-sm"
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                        </div>
                    </div>

                    {/* Nav Links — Desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${isActive(link.href)
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-card'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center gap-2">
                        {/* Notifications */}
                        {isAuthenticated && (
                            <>
                                <Link href="/chat" className="relative p-2 rounded-xl text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all">
                                    <MessageCircle size={20} />
                                    <span className="notification-dot" />
                                </Link>
                                <button className="relative p-2 rounded-xl text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all">
                                    <Bell size={20} />
                                    {unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-secondary rounded-full text-[10px] font-bold flex items-center justify-center text-white">
                                            {unreadCount}
                                        </span>
                                    )}
                                </button>
                            </>
                        )}

                        {/* Profile / Auth */}
                        {isAuthenticated && user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setProfileOpen(!profileOpen)}
                                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-dark-card transition-all"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <span className="hidden lg:block text-sm text-dark-text-secondary">{user.name?.split(' ')[0]}</span>
                                    <ChevronDown size={14} className={`text-dark-text-muted transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Profile Dropdown */}
                                {profileOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-64 glass rounded-2xl overflow-hidden animate-slide-up">
                                        <div className="p-4 border-b border-dark-border">
                                            <p className="font-semibold text-dark-text">{user.name}</p>
                                            <p className="text-sm text-dark-text-secondary">{user.email}</p>
                                            <span className="badge badge-new mt-2 text-[10px]">{user.role?.toUpperCase()}</span>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/dashboard/seller" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all" onClick={() => setProfileOpen(false)}>
                                                <Store size={16} /> Seller Dashboard
                                            </Link>
                                            <Link href="/dashboard/buyer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all" onClick={() => setProfileOpen(false)}>
                                                <ShoppingBag size={16} /> My Purchases
                                            </Link>
                                            <Link href="/dashboard/buyer" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all" onClick={() => setProfileOpen(false)}>
                                                <Heart size={16} /> Wishlist
                                            </Link>
                                            <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all" onClick={() => setProfileOpen(false)}>
                                                <Shield size={16} /> Admin Panel
                                            </Link>
                                            <Link href="/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all" onClick={() => setProfileOpen(false)}>
                                                <Settings size={16} /> Settings
                                            </Link>
                                        </div>
                                        <div className="p-2 border-t border-dark-border">
                                            <button
                                                onClick={() => { logout(); setProfileOpen(false); }}
                                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-brand-secondary hover:bg-brand-secondary/10 w-full transition-all"
                                            >
                                                <LogOut size={16} /> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link href="/auth/login" className="btn-secondary text-sm py-2 px-4">
                                    Sign In
                                </Link>
                                <Link href="/auth/register" className="btn-primary text-sm py-2 px-4 hidden sm:flex">
                                    Join Free
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={toggleMobileMenu}
                            className="md:hidden p-2 rounded-xl text-dark-text-secondary hover:text-dark-text hover:bg-dark-card transition-all"
                        >
                            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden glass border-t border-dark-border animate-slide-up">
                    {/* Mobile Search */}
                    <div className="p-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" size={18} />
                            <input
                                type="text"
                                placeholder="Search suits, blazers, shoes..."
                                className="input-field pl-10 py-2.5 text-sm"
                            />
                        </div>
                    </div>
                    <div className="px-4 pb-4 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={toggleMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.href)
                                        ? 'bg-brand-primary/20 text-brand-primary'
                                        : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-card'
                                    }`}
                            >
                                {link.icon}
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
