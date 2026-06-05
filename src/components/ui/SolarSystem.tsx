'use client';

import { useEffect, useState } from 'react';

const orbitingItems = [
    { emoji: '🤵', label: 'Suit', color: '#6C63FF', radius: 120, duration: 20, size: 44 },
    { emoji: '👖', label: 'Pant', color: '#4ECDC4', radius: 120, duration: 20, size: 38, delay: -7 },
    { emoji: '👞', label: 'Shoes', color: '#FF6B6B', radius: 120, duration: 20, size: 38, delay: -14 },
    { emoji: '👔', label: 'Tie', color: '#FFD93D', radius: 170, duration: 28, size: 36 },
    { emoji: '👕', label: 'Shirt', color: '#FF8A5C', radius: 170, duration: 28, size: 40, delay: -9 },
    { emoji: '🧥', label: 'Blazer', color: '#A78BFA', radius: 170, duration: 28, size: 40, delay: -18 },
    { emoji: '📦', label: 'Combo', color: '#34D399', radius: 220, duration: 36, size: 36, delay: -12 },
    { emoji: '🎓', label: 'Student', color: '#60A5FA', radius: 220, duration: 36, size: 42, delay: -24 },
];

const PARTICLE_STYLES = [
    { width: 5, height: 5, top: '25%', left: '30%', duration: 4.5, delay: 0.5 },
    { width: 4, height: 4, top: '65%', left: '20%', duration: 5.2, delay: 1.2 },
    { width: 6, height: 6, top: '45%', left: '75%', duration: 3.8, delay: 2.1 },
    { width: 3, height: 3, top: '75%', left: '60%', duration: 6.1, delay: 0.8 },
    { width: 5, height: 5, top: '35%', left: '50%', duration: 4.9, delay: 1.7 },
    { width: 4, height: 4, top: '55%', left: '40%', duration: 5.5, delay: 2.5 },
];


export default function SolarSystem() {
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setTimeout(() => setMounted(true), 0); }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-[400px] h-[400px] md:w-[480px] md:h-[480px]">
            {/* Orbit rings */}
            {[120, 170, 220].map((radius) => (
                <div
                    key={radius}
                    className="absolute rounded-full border border-dashed"
                    style={{
                        width: radius * 2,
                        height: radius * 2,
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        borderColor: 'rgba(108, 99, 255, 0.12)',
                    }}
                />
            ))}

            {/* Orbiting items */}
            {orbitingItems.map((item, idx) => (
                <div
                    key={idx}
                    className="absolute"
                    style={{
                        top: '50%',
                        left: '50%',
                        width: 0,
                        height: 0,
                        animation: `orbit ${item.duration}s linear infinite`,
                        animationDelay: `${item.delay || 0}s`,
                        // CSS custom property for orbit radius
                        ['--orbit-radius' as string]: `${item.radius}px`,
                    }}
                >
                    <div
                        className="flex flex-col items-center gap-0.5 cursor-default group"
                        style={{
                            marginLeft: -item.size / 2,
                            marginTop: -item.size / 2,
                        }}
                    >
                        <div
                            className="rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-125"
                            style={{
                                width: item.size,
                                height: item.size,
                                background: `linear-gradient(135deg, ${item.color}33, ${item.color}11)`,
                                border: `1px solid ${item.color}44`,
                                boxShadow: `0 4px 20px ${item.color}22`,
                            }}
                        >
                            <span className="text-lg">{item.emoji}</span>
                        </div>
                        <span
                            className="text-[9px] font-semibold tracking-wide opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ color: item.color }}
                        >
                            {item.label}
                        </span>
                    </div>
                </div>
            ))}

            {/* Center — Logo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="relative">
                    {/* Glow */}
                    <div className="absolute inset-0 rounded-2xl bg-brand-primary/30 blur-2xl scale-150" />
                    {/* Logo box */}
                    <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-accent to-brand-secondary flex items-center justify-center shadow-2xl">
                        <span className="text-3xl font-black text-white">CC</span>
                    </div>
                    <p className="text-center mt-2 text-[10px] text-dark-text-muted font-medium tracking-widest uppercase">CampusCloset</p>
                </div>
            </div>

            {/* Subtle particle effects */}
            {PARTICLE_STYLES.map((particle, i) => (
                <div
                    key={`particle-${i}`}
                    className="absolute rounded-full bg-brand-primary/20"
                    style={{
                        width: particle.width,
                        height: particle.height,
                        top: particle.top,
                        left: particle.left,
                        animation: `float ${particle.duration}s ease-in-out infinite`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
        </div>
    );
}
