'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate auth
        setTimeout(() => {
            setUser({
                id: 'user-1',
                name: 'Arjun Mehta',
                email: email || 'arjun@iitd.ac.in',
                role: undefined, // No role yet → will redirect to role selection
                university: 'IIT Delhi',
                isVerifiedStudent: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setIsLoading(false);
            router.push('/auth/role-select');
        }, 1200);
    };

    const handleGoogleLogin = () => {
        setIsLoading(true);
        setTimeout(() => {
            setUser({
                id: 'user-1',
                name: 'Arjun Mehta',
                email: 'arjun.mehta@iitd.ac.in',
                avatar: '',
                role: undefined,
                university: 'IIT Delhi',
                isVerifiedStudent: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
            setIsLoading(false);
            router.push('/auth/role-select');
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center relative overflow-hidden px-4">
            {/* Background accents */}
            <div className="hero-gradient-orb w-[400px] h-[400px] bg-brand-primary/15 -top-20 -left-20" />
            <div className="hero-gradient-orb w-[300px] h-[300px] bg-brand-accent/10 bottom-10 right-10" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8 animate-slide-up">
                    <Link href="/" className="inline-flex items-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold text-dark-text mt-4">Welcome Back</h1>
                    <p className="text-dark-text-secondary mt-1.5">Sign in to your CampusCloset account</p>
                </div>

                <div className="glass rounded-3xl p-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-semibold py-3 px-4 rounded-xl hover:bg-gray-100 transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
                        Continue with Google
                    </button>

                    {/* Divider */}
                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-dark-border" />
                        <span className="text-xs text-dark-text-muted uppercase tracking-wider">or</span>
                        <div className="flex-1 h-px bg-dark-border" />
                    </div>

                    {/* Email Login */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="text-sm text-dark-text-secondary mb-1.5 block">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" size={18} />
                                <input
                                    type="email"
                                    placeholder="your.name@college.ac.in"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field pl-10"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-dark-text-secondary mb-1.5 block">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text-muted" size={18} />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="input-field pl-10 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text-muted hover:text-dark-text transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-dark-text-secondary cursor-pointer">
                                <input type="checkbox" className="w-4 h-4 rounded bg-dark-card border-dark-border text-brand-primary" />
                                Remember me
                            </label>
                            <a href="#" className="text-brand-primary hover:text-brand-primary/80 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn-primary w-full justify-center py-3 text-base disabled:opacity-60"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-dark-text-secondary mt-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-brand-primary font-semibold hover:text-brand-primary/80 transition-colors">
                        Create one free <Sparkles size={14} className="inline" />
                    </Link>
                </p>
            </div>
        </div>
    );
}
