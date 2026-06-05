'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Search, ArrowRight, ShieldCheck, Star, TrendingUp,
  Users, Package, Sparkles, Zap, CheckCircle2, ChevronRight
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/marketplace/ProductCard';
import SolarSystem from '@/components/ui/SolarSystem';
import StudentVisual from '@/components/ui/StudentVisual';
import { mockProducts } from '@/lib/data';
import { useAuthStore } from '@/store';
import { CATEGORIES } from '@/types';

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const { setUser } = useAuthStore();

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    // Auto-login for demo
    setUser({
      id: 'user-1',
      name: 'Arjun Mehta',
      email: 'arjun.mehta@iitd.ac.in',
      role: 'seller',
      university: 'IIT Delhi',
      isVerifiedStudent: true,
      rating: 4.8,
      totalRatings: 12,
      createdAt: '2025-08-15T10:00:00Z',
      updatedAt: '2026-01-20T14:30:00Z',
    });
    return () => clearTimeout(timer);
  }, [setUser]);

  const stats = [
    { icon: <Users size={20} />, value: '2,500+', label: 'Active Students' },
    { icon: <Package size={20} />, value: '1,200+', label: 'Listings' },
    { icon: <Star size={20} />, value: '4.8/5', label: 'Avg Rating' },
    { icon: <TrendingUp size={20} />, value: '₹15L+', label: 'Saved by Students' },
  ];

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-dark-bg">
      <Navbar />

      {/* ============================================
          HERO SECTION
          ============================================ */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background decorative orbs */}
        <div className="hero-gradient-orb w-[500px] h-[500px] bg-brand-primary/20 -top-40 -left-40" />
        <div className="hero-gradient-orb w-[400px] h-[400px] bg-brand-accent/15 top-20 right-0" />
        <div className="hero-gradient-orb w-[300px] h-[300px] bg-brand-secondary/10 bottom-0 left-1/3" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left — Content */}
            <div className="animate-slide-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-6">
                <Sparkles size={14} />
                India&apos;s #1 Student Placement Wear Marketplace
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight">
                <span className="text-dark-text">Your Placement</span>
                <br />
                <span className="gradient-text">Outfit Awaits</span>
                <br />
                <span className="text-dark-text-secondary text-3xl sm:text-4xl lg:text-5xl font-bold">at Half the Price 🎯</span>
              </h1>

              <p className="text-dark-text-secondary text-lg mt-6 max-w-lg leading-relaxed">
                Graduating? Sell your formals. Starting placements? Get premium suits, blazers & shoes from seniors at <span className="text-brand-accent font-semibold">up to 60% off</span>.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 mt-8">
                <Link href="/marketplace" className="btn-primary text-base px-6 py-3.5 group">
                  Browse Marketplace
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard/seller" className="btn-secondary text-base px-6 py-3.5 group">
                  Start Selling
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Trust signals */}
              <div className="flex items-center gap-6 mt-8 text-sm text-dark-text-muted">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-brand-accent" />
                  <span>Verified Students</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap size={16} className="text-brand-gold" />
                  <span>Free to List</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-condition-new" />
                  <span>Safe Meetups</span>
                </div>
              </div>
            </div>

            {/* Right — Student Visual */}
            <div className="animate-slide-right flex justify-center">
              <StudentVisual />
            </div>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="glass rounded-2xl p-5 text-center hover:border-brand-primary/30 transition-all duration-300"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-3">
                  {stat.icon}
                </div>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-dark-text-muted mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          SOLAR SYSTEM — ROTATING PRODUCT VISUAL
          ============================================ */}
      <section className="relative py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Solar System */}
            <div className="flex justify-center order-2 lg:order-1">
              <SolarSystem />
            </div>

            {/* Content */}
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-text">
                Everything You Need for
                <span className="gradient-text block mt-1">Placement Season</span>
              </h2>
              <p className="text-dark-text-secondary mt-4 text-lg leading-relaxed">
                Premium formals from seniors who&apos;ve cracked top companies. Every item is quality-checked and priced for student budgets.
              </p>

              <div className="grid grid-cols-2 gap-3 mt-8">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.value}
                    href={`/marketplace?category=${cat.value}`}
                    className="flex items-center gap-3 p-3 rounded-xl bg-dark-card border border-dark-border hover:border-brand-primary/30 hover:bg-dark-card-hover transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                    <div>
                      <p className="text-sm font-medium text-dark-text group-hover:text-brand-primary transition-colors">{cat.label}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURED PRODUCTS
          ============================================ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-dark-text">
                Trending <span className="gradient-text">Now</span>
              </h2>
              <p className="text-dark-text-secondary mt-1">Latest listings from verified students</p>
            </div>
            <Link href="/marketplace" className="btn-secondary text-sm group">
              View All
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 stagger-children">
            {mockProducts.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          HOW IT WORKS
          ============================================ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-primary/[0.03] to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-dark-text mb-3">
              How <span className="gradient-text">CampusCloset</span> Works
            </h2>
            <p className="text-dark-text-secondary max-w-md mx-auto">
              Three simple steps to buy or sell placement wear within your campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Sign Up & Choose',
                desc: 'Register with your college email. Choose to buy or sell — switch anytime.',
                icon: <Users size={28} />,
                color: '#6C63FF',
              },
              {
                step: '02',
                title: 'List or Browse',
                desc: 'Sellers: snap photos & set your price. Buyers: filter, search & discover deals.',
                icon: <Search size={28} />,
                color: '#4ECDC4',
              },
              {
                step: '03',
                title: 'Meet & Exchange',
                desc: 'Chat with the other party, agree on details, and meet on campus for a safe exchange.',
                icon: <CheckCircle2 size={28} />,
                color: '#FFD93D',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="relative glass rounded-2xl p-8 text-center group hover:border-brand-primary/30 transition-all duration-300"
              >
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold" style={{ background: `${item.color}22`, color: item.color, border: `1px solid ${item.color}44` }}>
                  STEP {item.step}
                </div>
                <div
                  className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-5 mt-2 group-hover:scale-110 transition-transform"
                  style={{ background: `${item.color}15`, color: item.color }}
                >
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-dark-text mb-2">{item.title}</h3>
                <p className="text-dark-text-secondary text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION
          ============================================ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass rounded-3xl p-12 text-center overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-brand-accent/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">
                Ready to Save on
                <span className="gradient-text"> Placement Wear</span>?
              </h2>
              <p className="text-dark-text-secondary text-lg max-w-lg mx-auto mb-8">
                Join thousands of students already buying and selling formal wear within their campuses.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link href="/marketplace" className="btn-primary text-base px-8 py-3.5 group">
                  Start Shopping
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/dashboard/seller" className="btn-accent text-base px-8 py-3.5 group">
                  List Your Items
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
