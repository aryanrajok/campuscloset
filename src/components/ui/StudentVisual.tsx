'use client';

import { useState, useEffect } from 'react';

// SVG illustration of a student listing a product — relatable campus vibe
export default function StudentVisual() {
    const [hovered, setHovered] = useState(false);
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setMounted(true), 0);
        return () => clearTimeout(timer);
    }, []);
    if (!mounted) return null;

    return (
        <div
            className="relative w-full max-w-[380px] mx-auto select-none"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-brand-primary/10 blur-3xl" />

            <svg viewBox="0 0 400 440" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                {/* Background Card / Phone mockup */}
                <rect x="110" y="30" width="180" height="320" rx="24" fill="#1a1a2e" stroke="#6C63FF" strokeWidth="2" opacity="0.8" />
                <rect x="120" y="50" width="160" height="280" rx="12" fill="#12121a" />

                {/* Phone Screen Content — Product listing */}
                <rect x="130" y="60" width="140" height="90" rx="8" fill="url(#suitGrad)" />
                <text x="200" y="105" textAnchor="middle" fill="white" fontSize="28" opacity="0.4">🤵</text>

                {/* Product Info on phone */}
                <rect x="130" y="158" width="90" height="8" rx="4" fill="#6C63FF" opacity="0.6" />
                <rect x="130" y="172" width="60" height="6" rx="3" fill="#4ECDC4" opacity="0.4" />

                {/* Price tag */}
                <rect x="130" y="188" width="50" height="16" rx="8" fill="#10B981" opacity="0.2" />
                <text x="155" y="200" textAnchor="middle" fill="#10B981" fontSize="9" fontWeight="bold">₹3,200</text>

                {/* Sell button on phone */}
                <rect x="130" y="215" width="140" height="28" rx="8" fill="url(#btnGrad)" />
                <text x="200" y="233" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">LIST FOR SALE</text>

                {/* Blue tick / verified */}
                <circle cx="250" y="165" r="6" fill="#3B82F6" />
                <text x="250" y="168" textAnchor="middle" fill="white" fontSize="8">✓</text>

                {/* ============= STUDENT FIGURE (LEFT) — Seller ============= */}
                {/* Head */}
                <circle cx="70" cy="180" r="28" fill="#F5D0B0" />
                {/* Hair */}
                <path d="M42 175 Q45 145 70 140 Q95 145 98 175" fill="#2D1B00" />
                {/* Eyes */}
                <circle cx="60" cy="178" r="3" fill="#1a1a2e" />
                <circle cx="80" cy="178" r="3" fill="#1a1a2e" />
                {/* Smile */}
                <path d="M60 190 Q 70 198 80 190" stroke="#C4956A" strokeWidth="2" fill="none" />
                {/* Body — College T-shirt */}
                <rect x="42" y="208" width="56" height="70" rx="8" fill="#6C63FF" />
                <text x="70" y="248" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">CAMPUS</text>
                {/* Arms */}
                <rect x="24" y="212" width="18" height="50" rx="8" fill="#F5D0B0" />
                <rect x="98" y="212" width="18" height="50" rx="8" fill="#F5D0B0" />
                {/* Seller is holding/showing the blazer */}
                <path d="M104 230 L130 200" stroke="#F5D0B0" strokeWidth="6" strokeLinecap="round" />
                {/* Blazer in hand */}
                <rect x="120" y="190" width="30" height="35" rx="4" fill="#2a2a3e" stroke="#4ECDC4" strokeWidth="1"
                    className={`transition-transform duration-500 origin-center ${hovered ? 'translate-y-[-4px]' : ''}`}
                />
                <text x="135" y="212" textAnchor="middle" fill="#4ECDC4" fontSize="14" opacity="0.5">🧥</text>
                {/* Legs — Jeans */}
                <rect x="46" y="278" width="20" height="55" rx="6" fill="#3B5998" />
                <rect x="74" y="278" width="20" height="55" rx="6" fill="#3B5998" />
                {/* Shoes */}
                <rect x="42" y="328" width="28" height="10" rx="5" fill="#1a1a2e" />
                <rect x="70" y="328" width="28" height="10" rx="5" fill="#1a1a2e" />

                {/* ============= STUDENT FIGURE (RIGHT) — Buyer ============= */}
                {/* Head */}
                <circle cx="330" cy="180" r="28" fill="#E8C49A" />
                {/* Hair */}
                <path d="M302 175 Q305 145 330 140 Q355 145 358 175" fill="#1a0a00" />
                {/* Glasses */}
                <circle cx="320" cy="178" r="8" fill="none" stroke="#666" strokeWidth="1.5" />
                <circle cx="340" cy="178" r="8" fill="none" stroke="#666" strokeWidth="1.5" />
                <line x1="328" y1="178" x2="332" y2="178" stroke="#666" strokeWidth="1.5" />
                {/* Eyes */}
                <circle cx="320" cy="178" r="2.5" fill="#1a1a2e" />
                <circle cx="340" cy="178" r="2.5" fill="#1a1a2e" />
                {/* Smile */}
                <path d="M320 190 Q 330 198 340 190" stroke="#C4956A" strokeWidth="2" fill="none" />
                {/* Body — wearing suit (already has one) */}
                <rect x="302" y="208" width="56" height="70" rx="8" fill="#1a1a2e" />
                {/* Tie */}
                <polygon points="330,210 325,240 330,245 335,240" fill="#FF6B6B" />
                {/* Arms */}
                <rect x="284" y="212" width="18" height="50" rx="8" fill="#E8C49A" />
                <rect x="358" y="212" width="18" height="50" rx="8" fill="#E8C49A" />
                {/* Pointing at phone */}
                <path d="M296 240 L275 220" stroke="#E8C49A" strokeWidth="6" strokeLinecap="round" />
                {/* Legs — Formal */}
                <rect x="306" y="278" width="20" height="55" rx="6" fill="#1a1a2e" />
                <rect x="334" y="278" width="20" height="55" rx="6" fill="#1a1a2e" />
                {/* Shoes */}
                <rect x="302" y="328" width="28" height="10" rx="5" fill="#0a0a0f" />
                <rect x="330" y="328" width="28" height="10" rx="5" fill="#0a0a0f" />

                {/* Speech Bubble — Seller */}
                <rect x="20" y="120" width="100" height="36" rx="12" fill="#1a1a2e" stroke="#6C63FF" strokeWidth="1" />
                <polygon points="80,156 90,166 100,156" fill="#1a1a2e" stroke="#6C63FF" strokeWidth="1" />
                <text x="70" y="140" textAnchor="middle" fill="#e8e8f0" fontSize="8" fontWeight="600">&quot;Selling my suit!&quot;</text>

                {/* Speech Bubble — Buyer */}
                <rect x="280" y="120" width="110" height="36" rx="12" fill="#1a1a2e" stroke="#4ECDC4" strokeWidth="1" />
                <polygon points="310,156 300,166 290,156" fill="#1a1a2e" stroke="#4ECDC4" strokeWidth="1" />
                <text x="335" y="140" textAnchor="middle" fill="#e8e8f0" fontSize="8" fontWeight="600">&quot;Great deal! 🤩&quot;</text>

                {/* Arrow indicating transaction */}
                <path d="M115 250 Q 200 310 285 250" stroke="#FFD93D" strokeWidth="2" strokeDasharray="6 4" fill="none" opacity="0.5" />
                <polygon points="280,248 290,252 284,256" fill="#FFD93D" opacity="0.5" />

                {/* Caption */}
                <text x="200" y="380" textAnchor="middle" fill="#9999b0" fontSize="11" fontWeight="500">Student ↔ Student Resale</text>
                <text x="200" y="400" textAnchor="middle" fill="#6C63FF" fontSize="13" fontWeight="700">Save up to 60% on formals!</text>

                {/* Floating icons */}
                <text x="160" y="25" fontSize="16" opacity="0.3" className="animate-float">💼</text>
                <text x="250" y="18" fontSize="14" opacity="0.2" className="animate-float" style={{ animationDelay: '1s' }}>✨</text>
                <text x="350" y="100" fontSize="12" opacity="0.2" className="animate-float" style={{ animationDelay: '2s' }}>🎯</text>

                <defs>
                    <linearGradient id="suitGrad" x1="130" y1="60" x2="270" y2="150" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#1a1a4e" />
                        <stop offset="100%" stopColor="#2a2a6e" />
                    </linearGradient>
                    <linearGradient id="btnGrad" x1="130" y1="215" x2="270" y2="243" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#6C63FF" />
                        <stop offset="100%" stopColor="#4ECDC4" />
                    </linearGradient>
                </defs>
            </svg>

            {/* Label */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-xl">
                <p className="text-xs text-dark-text-secondary text-center">
                    <span className="text-brand-primary font-semibold">Senior</span> sells →{' '}
                    <span className="text-brand-accent font-semibold">Junior</span> saves
                </p>
            </div>
        </div>
    );
}
