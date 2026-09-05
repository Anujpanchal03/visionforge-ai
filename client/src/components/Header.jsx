import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets, stylePresets } from '../assets/assets';

const Header = () => {
    const { user, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const handleCreateClick = () => {
        if (user) {
            navigate('/result');
        } else {
            setShowLogin(true);
        }
    };

    const handleGalleryClick = () => {
        navigate('/gallery');
    };

    return (
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden">
            {/* Background Glow Spheres */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-indigo-300/30 via-purple-300/30 to-pink-300/30 blur-3xl rounded-full pointer-events-none -z-10" />

            <div className="max-w-5xl mx-auto px-4 text-center">
                {/* Free Credits Feature Pill */}
                <motion.div
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 shadow-sm text-xs sm:text-sm font-medium text-slate-700 mb-8"
                >
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-indigo-600 font-bold">New Account Bonus:</span>
                    <span>Get 50 Free Credits Instantly</span>
                    <span className="text-amber-500 font-bold">⚡</span>
                </motion.div>

                {/* Main Hero Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.12]"
                >
                    Create exactly what <br className="hidden sm:inline" />
                    <span className="text-gradient">you imagine.</span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                >
                    Turn your ideas into high-quality AI images with precise prompt control, deterministic semantic adherence, and negative filters.
                </motion.p>

                {/* Action CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <button
                        onClick={handleCreateClick}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 group"
                    >
                        <span>Create Image</span>
                        <svg className="w-5 h-5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>

                    <button
                        onClick={handleGalleryClick}
                        className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-slate-700 font-semibold text-base border border-slate-200/90 shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" strokeWidth="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" strokeWidth="2" />
                        </svg>
                        <span>Explore Gallery</span>
                    </button>
                </motion.div>

                {/* Style Quick Showcase Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-14 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-600"
                >
                    <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] mr-1">
                        Supported Styles:
                    </span>
                    {stylePresets.map((style) => (
                        <span
                            key={style.id}
                            className="px-3 py-1.5 rounded-xl bg-white/90 border border-slate-200 shadow-sm flex items-center gap-1.5 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                        >
                            <span>{style.icon}</span>
                            <span>{style.name}</span>
                        </span>
                    ))}
                </motion.div>

                {/* Visual Showcase Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5 }}
                    className="mt-16 p-3 sm:p-4 rounded-3xl bg-white/70 backdrop-blur-xl border border-slate-200/80 shadow-2xl shadow-slate-200/50"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div className="relative group overflow-hidden rounded-2xl aspect-square shadow-sm">
                            <img
                                src={assets.sample_img_1}
                                alt="Sample Realistic Render"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500 text-white">Realistic</span>
                                    <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">Golden retriever in sunny kitchen</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-2xl aspect-square shadow-sm">
                            <img
                                src={assets.sample_img_2}
                                alt="Sample Cinematic Portrait"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-purple-500 text-white">Cinematic</span>
                                    <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">Cyberpunk street portrait with neon depth</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-2xl aspect-square shadow-sm hidden sm:block">
                            <img
                                src={assets.sample_img_1}
                                alt="Sample 3D Character"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter hue-rotate-90"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500 text-white">3D Render</span>
                                    <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">Futuristic mech robot in high detail</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group overflow-hidden rounded-2xl aspect-square shadow-sm hidden md:block">
                            <img
                                src={assets.sample_img_2}
                                alt="Sample Anime Aesthetic"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter saturate-150"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-left">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500 text-white">Anime Art</span>
                                    <p className="text-xs text-white/90 font-medium mt-1 line-clamp-1">Ethereal fantasy castle at twilight</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Header;