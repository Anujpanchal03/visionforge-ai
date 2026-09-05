import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Navbar = () => {
    const { setShowLogin, user, credit, logout } = useContext(AppContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setMobileMenuOpen(false);
        setDropdownOpen(false);
    }, [location.pathname]);

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 border-b border-slate-200/80 transition-all">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
                
                {/* Logo & Brand */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 flex items-center gap-1.5">
                            VisionForge
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200/60">
                                AI
                            </span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium -mt-1 hidden sm:block">
                            Precision Image Studio
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation Links */}
                <nav className="hidden md:flex items-center gap-1 lg:gap-2">
                    <Link
                        to="/"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive('/')
                                ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/result"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive('/result')
                                ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                    >
                        Generate
                    </Link>
                    <Link
                        to="/gallery"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive('/gallery')
                                ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                    >
                        Gallery
                    </Link>
                    {user && (
                        <Link
                            to="/dashboard"
                            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                                isActive('/dashboard')
                                    ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                            }`}
                        >
                            Dashboard
                        </Link>
                    )}
                    <Link
                        to="/buy"
                        className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                            isActive('/buy')
                                ? 'text-indigo-600 bg-indigo-50/80 font-semibold'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                        }`}
                    >
                        Pricing
                    </Link>
                </nav>

                {/* Right Side: Auth / User Profile */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-3">
                            {/* Credits Live Badge */}
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/80 text-amber-900 shadow-sm hover:shadow hover:scale-[1.02] transition-all"
                                title="Click to view Credit Dashboard"
                            >
                                <span className="flex h-2 w-2 relative">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                </span>
                                <span className="text-xs sm:text-sm font-bold text-slate-800">
                                    {credit} <span className="font-normal text-slate-500">Credits</span>
                                </span>
                            </button>

                            {/* User Profile Menu */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-full bg-slate-100 hover:bg-slate-200/80 transition-colors border border-slate-200 text-sm font-medium text-slate-700"
                                >
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                                    </div>
                                    <span className="max-w-[100px] truncate hidden sm:inline">{user.name}</span>
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                                        <div className="px-4 py-3 border-b border-slate-100">
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email || 'Free Member'}</p>
                                            <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-semibold">
                                                ⚡ {credit} credits available
                                            </div>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                to="/result"
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
                                            >
                                                <span>✨</span> Generate Image
                                            </Link>
                                            <Link
                                                to="/gallery"
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
                                            >
                                                <span>🖼️</span> My Gallery
                                            </Link>
                                            <Link
                                                to="/dashboard"
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
                                            >
                                                <span>📊</span> Credit Dashboard
                                            </Link>
                                            <Link
                                                to="/buy"
                                                className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-600 transition-colors"
                                            >
                                                <span>💎</span> Buy More Credits
                                            </Link>
                                        </div>

                                        <div className="pt-1 border-t border-slate-100">
                                            <button
                                                onClick={logout}
                                                className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                                            >
                                                <span>🚪</span> Sign Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <button
                                onClick={() => setShowLogin(true)}
                                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => setShowLogin(true)}
                                className="relative group overflow-hidden rounded-full p-px font-semibold text-xs sm:text-sm shadow-md"
                            >
                                <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"></span>
                                <span className="relative flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-slate-900 text-white group-hover:bg-slate-800 transition-colors">
                                    <span>Get 50 Free Credits</span>
                                    <span className="text-amber-400">⚡</span>
                                </span>
                            </button>
                        </div>
                    )}

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {mobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-150">
                    <Link
                        to="/"
                        className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                            isActive('/') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
                        }`}
                    >
                        🏠 Home
                    </Link>
                    <Link
                        to="/result"
                        className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                            isActive('/result') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
                        }`}
                    >
                        ✨ Generate
                    </Link>
                    <Link
                        to="/gallery"
                        className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                            isActive('/gallery') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
                        }`}
                    >
                        🖼️ Gallery
                    </Link>
                    {user && (
                        <Link
                            to="/dashboard"
                            className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                                isActive('/dashboard') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
                            }`}
                        >
                            📊 Dashboard ({credit} Credits)
                        </Link>
                    )}
                    <Link
                        to="/buy"
                        className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                            isActive('/buy') ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
                        }`}
                    >
                        💎 Pricing & Credits
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Navbar;