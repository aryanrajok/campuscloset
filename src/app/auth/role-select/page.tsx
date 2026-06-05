'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Store, ShoppingBag, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function RoleSelectPage() {
    const router = useRouter();
    const { user, setRole } = useAuthStore();
    const [selected, setSelected] = useState<'seller' | 'buyer' | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleContinue = () => {
        if (!selected) return;
        setIsLoading(true);
        setRole(selected);
        setTimeout(() => {
            router.push(selected === 'seller' ? '/dashboard/seller' : '/marketplace');
        }, 600);
    };

    const roles = [
        {
            value: 'seller' as const,
            title: 'Register as Merchant',
            subtitle: 'Seller',
            icon: <Store size={32} />,
            color: '#6C63FF',
            description: 'List your placement wear, reach buyers across campuses, and earn from items you no longer need.',
            perks: ['Free listings', 'Chat with buyers', 'Set your own price', 'UPI payments'],
            emoji: '🏪',
        },
        {
            value: 'buyer' as const,
            title: 'Register as Customer',
            subtitle: 'Buyer',
            icon: <ShoppingBag size={32} />,
            color: '#4ECDC4',
            description: 'Discover premium formals from seniors at massive discounts. Save big on placement season.',
            perks: ['Browse 1000+ items', 'Chat with sellers', 'Make offers', 'Wishlist items'],
            emoji: '🛍️',
        },
    ];

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden px-4 py-12">
            <div className="hero-gradient-orb w-[400px] h-[400px] bg-brand-primary/15 -top-20 left-1/4" />
            <div className="hero-gradient-orb w-[300px] h-[300px] bg-brand-accent/10 bottom-10 right-1/4" />

            <div className="relative w-full max-w-2xl">
                <div className="text-center mb-10 animate-slide-up">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                    </Link>

                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-gold/10 border border-brand-gold/20 text-brand-gold text-sm font-medium mb-4">
                        <Sparkles size={14} />
                        Welcome, {user?.name || 'Student'}!
                    </div>

                    <h1 className="text-3xl font-bold text-dark-text">How would you like to start?</h1>
                    <p className="text-dark-text-secondary mt-2">Choose your role to get started. You can switch anytime later.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                    {roles.map((role) => (
                        <button
                            key={role.value}
                            onClick={() => setSelected(role.value)}
                            className={`relative text-left glass rounded-3xl p-8 transition-all duration-300 group ${selected === role.value
                                    ? 'border-2 scale-[1.02]'
                                    : 'border border-dark-border hover:border-dark-card-hover'
                                }`}
                            style={{
                                borderColor: selected === role.value ? role.color : undefined,
                                boxShadow: selected === role.value ? `0 0 30px ${role.color}22` : undefined,
                            }}
                        >
                            {/* Selected check */}
                            {selected === role.value && (
                                <div
                                    className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center"
                                    style={{ background: role.color }}
                                >
                                    <CheckCircle2 size={18} className="text-white" />
                                </div>
                            )}

                            {/* Icon */}
                            <div
                                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                                style={{ background: `${role.color}15`, color: role.color }}
                            >
                                {role.icon}
                            </div>

                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{role.emoji}</span>
                                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: role.color }}>
                                    {role.subtitle}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-dark-text mb-2">{role.title}</h3>
                            <p className="text-sm text-dark-text-secondary leading-relaxed mb-5">{role.description}</p>

                            <ul className="space-y-2">
                                {role.perks.map((perk) => (
                                    <li key={perk} className="flex items-center gap-2 text-sm text-dark-text-muted">
                                        <CheckCircle2 size={14} style={{ color: role.color }} />
                                        {perk}
                                    </li>
                                ))}
                            </ul>
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <button
                        onClick={handleContinue}
                        disabled={!selected || isLoading}
                        className="btn-primary px-10 py-3.5 text-base disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                Continue as {selected === 'seller' ? 'Seller' : selected === 'buyer' ? 'Buyer' : '...'}
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                    <p className="text-xs text-dark-text-muted mt-3">
                        You can always switch roles from your profile settings
                    </p>
                </div>
            </div>
        </div>
    );
}
