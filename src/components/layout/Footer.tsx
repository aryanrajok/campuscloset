'use client';

import Link from 'next/link';
import { Heart, Github, Twitter, Instagram, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    return (
        <footer className="relative mt-20 border-t border-dark-border bg-dark-surface">
            {/* Decorative gradient */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                                <span className="text-white font-bold text-lg">C</span>
                            </div>
                            <div>
                                <span className="text-xl font-bold gradient-text">Campus</span>
                                <span className="text-xl font-bold text-dark-text">Closet</span>
                            </div>
                        </div>
                        <p className="text-dark-text-secondary text-sm leading-relaxed mb-6">
                            India&apos;s first peer-to-peer marketplace for student placement wear.
                            Buy, sell, and save on premium formal attire within your campus.
                        </p>
                        <div className="flex items-center gap-3">
                            {[Twitter, Instagram, Github, Mail].map((Icon, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className="w-9 h-9 rounded-lg bg-dark-card flex items-center justify-center text-dark-text-muted hover:text-brand-primary hover:bg-dark-card-hover transition-all"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Grid */}
                    <div>
                        <h4 className="text-sm font-semibold text-dark-text uppercase tracking-wider mb-4">Marketplace</h4>
                        <ul className="space-y-3">
                            {['Browse All', 'Suits & Blazers', 'Formal Shirts', 'Trousers', 'Shoes', 'Ties', 'Combos'].map((item) => (
                                <li key={item}>
                                    <Link href="/marketplace" className="text-sm text-dark-text-secondary hover:text-brand-primary transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-dark-text uppercase tracking-wider mb-4">Sellers</h4>
                        <ul className="space-y-3">
                            {['Start Selling', 'Pricing Guide', 'Seller Dashboard', 'Photography Tips', 'Top Sellers'].map((item) => (
                                <li key={item}>
                                    <Link href="/dashboard/seller" className="text-sm text-dark-text-secondary hover:text-brand-primary transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold text-dark-text uppercase tracking-wider mb-4">Support</h4>
                        <ul className="space-y-3">
                            {['Help Center', 'Safety Tips', 'Report an Issue', 'Contact Us', 'Terms of Service', 'Privacy Policy'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-sm text-dark-text-secondary hover:text-brand-primary transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-dark-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-dark-text-muted flex items-center gap-1">
                        © 2026 CampusCloset. Made with <Heart size={14} className="text-brand-secondary fill-brand-secondary" /> for students
                    </p>

                    <button
                        onClick={scrollToTop}
                        className="p-2 rounded-xl bg-dark-card hover:bg-dark-card-hover text-dark-text-secondary hover:text-brand-primary transition-all"
                    >
                        <ArrowUp size={18} />
                    </button>
                </div>
            </div>
        </footer>
    );
}
