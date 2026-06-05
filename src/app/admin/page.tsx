'use client';

import { useState } from 'react';
import {
    Users, Package, Flag, BarChart3, Trash2, Eye,
    ShieldCheck, AlertTriangle, CheckCircle2, XCircle,
    DollarSign, Activity
} from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import { mockProducts, mockUsers, formatPrice } from '@/lib/data';
import { CONDITIONS } from '@/types';

type AdminTab = 'overview' | 'users' | 'listings' | 'reports';

export default function AdminPage() {
    const [activeTab, setActiveTab] = useState<AdminTab>('overview');
    const [listings, setListings] = useState(mockProducts);
    const [reports] = useState([
        { id: '1', reporter: 'Sneha Reddy', productTitle: 'Fake Brand Suit', reason: 'Counterfeit item', status: 'pending', date: '2026-02-25' },
        { id: '2', reporter: 'Anonymous', productTitle: 'Woodland Shoes', reason: 'Misleading condition', status: 'reviewed', date: '2026-02-22' },
        { id: '3', reporter: 'Priya Sharma', productTitle: 'User: suspicious_seller', reason: 'Scam account', status: 'resolved', date: '2026-02-18' },
    ]);

    const removeListing = (id: string) => {
        setListings(listings.filter(l => l.id !== id));
    };

    const stats = [
        { icon: <Users size={20} />, label: 'Total Users', value: '2,547', change: '+12%', color: '#6C63FF' },
        { icon: <Package size={20} />, label: 'Active Listings', value: '1,234', change: '+8%', color: '#4ECDC4' },
        { icon: <DollarSign size={20} />, label: 'Total GMV', value: '₹15.2L', change: '+23%', color: '#FFD93D' },
        { icon: <Flag size={20} />, label: 'Open Reports', value: '3', change: '-5%', color: '#FF6B6B' },
    ];

    const tabs: { value: AdminTab; label: string; icon: React.ReactNode }[] = [
        { value: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
        { value: 'users', label: 'Users', icon: <Users size={18} /> },
        { value: 'listings', label: 'Listings', icon: <Package size={18} /> },
        { value: 'reports', label: 'Reports', icon: <Flag size={18} /> },
    ];

    return (
        <main className="min-h-screen bg-dark-bg">
            <Navbar />

            <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-brand-secondary/15 flex items-center justify-center">
                        <ShieldCheck size={22} className="text-brand-secondary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-dark-text">Admin Panel</h1>
                        <p className="text-dark-text-secondary text-sm">Manage users, listings, and reports</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-dark-surface rounded-2xl p-1.5 mb-8 overflow-x-auto border border-dark-border">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.value
                                    ? 'bg-brand-secondary text-white shadow-lg shadow-brand-secondary/25'
                                    : 'text-dark-text-secondary hover:text-dark-text hover:bg-dark-card'
                                }`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Overview */}
                {activeTab === 'overview' && (
                    <div className="space-y-8 animate-fade-in">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {stats.map((stat, i) => (
                                <div key={i} className="glass rounded-2xl p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, color: stat.color }}>
                                            {stat.icon}
                                        </div>
                                        <span className={`text-xs font-semibold ${stat.change.startsWith('+') ? 'text-condition-new' : 'text-brand-secondary'}`}>
                                            {stat.change}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-bold text-dark-text">{stat.value}</p>
                                    <p className="text-xs text-dark-text-muted mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Activity */}
                        <div className="glass rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-dark-text mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-brand-primary" /> Platform Activity
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { text: 'New user registered: Amit Kumar (IIT Bombay)', time: '5m ago', type: 'user' },
                                    { text: 'Product listed: Charcoal Grey Blazer - ₹1,800', time: '12m ago', type: 'listing' },
                                    { text: 'Report filed: Counterfeit item', time: '1h ago', type: 'report' },
                                    { text: 'Product sold: Van Heusen Trouser - ₹950', time: '2h ago', type: 'sale' },
                                    { text: 'New user registered: Kavya Nair (NIT Trichy)', time: '3h ago', type: 'user' },
                                ].map((activity, i) => (
                                    <div key={i} className="flex items-center gap-3 py-2 border-b border-dark-border/50 last:border-0">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${activity.type === 'user' ? 'bg-brand-primary' :
                                                activity.type === 'listing' ? 'bg-brand-accent' :
                                                    activity.type === 'report' ? 'bg-brand-secondary' : 'bg-brand-gold'
                                            }`} />
                                        <p className="text-sm text-dark-text-secondary flex-1">{activity.text}</p>
                                        <span className="text-xs text-dark-text-muted shrink-0">{activity.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Users */}
                {activeTab === 'users' && (
                    <div className="animate-fade-in">
                        <div className="glass rounded-2xl overflow-hidden">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-dark-border">
                                        <th className="text-left p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider">User</th>
                                        <th className="text-left p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider hidden sm:table-cell">University</th>
                                        <th className="text-left p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider hidden md:table-cell">Role</th>
                                        <th className="text-left p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider hidden lg:table-cell">Rating</th>
                                        <th className="text-left p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Status</th>
                                        <th className="text-right p-4 text-xs font-semibold text-dark-text-muted uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockUsers.map((u) => (
                                        <tr key={u.id} className="border-b border-dark-border/50 hover:bg-dark-card/50 transition-all">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center text-white text-sm font-bold">
                                                        {u.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-dark-text text-sm">{u.name}</p>
                                                        <p className="text-xs text-dark-text-muted">{u.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-sm text-dark-text-secondary hidden sm:table-cell">{u.university}</td>
                                            <td className="p-4 hidden md:table-cell">
                                                <span className={`badge text-[10px] ${u.role === 'seller' ? 'badge-new' : 'badge-like-new'}`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-dark-text-secondary hidden lg:table-cell">
                                                ⭐ {u.rating} ({u.totalRatings})
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    {u.isVerifiedStudent && <ShieldCheck size={14} className="text-brand-accent" />}
                                                    <span className="text-xs text-condition-new font-medium">Active</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="p-1.5 rounded-lg text-dark-text-muted hover:text-dark-text hover:bg-dark-card transition-all">
                                                    <Eye size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Listings */}
                {activeTab === 'listings' && (
                    <div className="space-y-3 animate-fade-in">
                        {listings.map((listing) => (
                            <div key={listing.id} className="glass rounded-xl p-4 flex items-center gap-4 hover:border-brand-primary/20 transition-all">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-900 to-blue-900 flex items-center justify-center text-2xl shrink-0">
                                    {listing.category === 'suit' ? '🤵' : listing.category === 'pant' ? '👖' : listing.category === 'formal-shoes' ? '👞' : listing.category === 'tie' ? '👔' : listing.category === 'white-shirt' ? '👕' : listing.category === 'blazer' ? '🧥' : '📦'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-dark-text text-sm truncate">{listing.title}</p>
                                    <p className="text-xs text-dark-text-secondary">
                                        {listing.seller?.name} · {listing.university} · {formatPrice(listing.sellingPrice)}
                                    </p>
                                </div>
                                <span className={`badge badge-${listing.condition} text-[10px] hidden sm:inline-flex`}>
                                    {CONDITIONS.find(c => c.value === listing.condition)?.label}
                                </span>
                                <span className={`badge ${listing.status === 'active' ? 'badge-new' : 'badge-used'} text-[10px]`}>
                                    {listing.status}
                                </span>
                                <button
                                    onClick={() => removeListing(listing.id)}
                                    className="p-2 rounded-lg text-brand-secondary/60 hover:text-brand-secondary hover:bg-brand-secondary/10 transition-all"
                                    title="Remove listing"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Reports */}
                {activeTab === 'reports' && (
                    <div className="space-y-4 animate-fade-in">
                        {reports.map((report) => (
                            <div key={report.id} className="glass rounded-2xl p-5 hover:border-brand-secondary/20 transition-all">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <AlertTriangle size={16} className="text-brand-secondary" />
                                            <span className="font-semibold text-dark-text text-sm">{report.reason}</span>
                                        </div>
                                        <p className="text-xs text-dark-text-secondary">
                                            Reported: <span className="text-dark-text">{report.productTitle}</span> · By {report.reporter}
                                        </p>
                                        <p className="text-xs text-dark-text-muted mt-1">{report.date}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`badge text-[10px] ${report.status === 'pending' ? 'badge-good' :
                                                report.status === 'reviewed' ? 'badge-like-new' : 'badge-new'
                                            }`}>
                                            {report.status}
                                        </span>
                                        {report.status === 'pending' && (
                                            <div className="flex items-center gap-1">
                                                <button className="p-1.5 rounded-lg text-condition-new hover:bg-condition-new/10 transition-all" title="Approve">
                                                    <CheckCircle2 size={16} />
                                                </button>
                                                <button className="p-1.5 rounded-lg text-brand-secondary hover:bg-brand-secondary/10 transition-all" title="Reject">
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
