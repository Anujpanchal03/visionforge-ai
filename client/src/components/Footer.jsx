import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-slate-200/80 bg-white/60 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
                
                {/* Brand & Tagline */}
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-sm">
                            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                        </div>
                        <span className="text-lg font-extrabold tracking-tight text-slate-900">
                            VisionForge <span className="text-xs text-indigo-600 font-bold">AI</span>
                        </span>
                    </Link>
                    <span className="text-xs text-slate-400 hidden sm:inline">|</span>
                    <p className="text-xs text-slate-500">
                        Create exactly what you imagine. All rights reserved &copy; {new Date().getFullYear()}.
                    </p>
                </div>

                {/* Footer Navigation Links */}
                <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
                    <Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link>
                    <Link to="/result" className="hover:text-indigo-600 transition-colors">Generate</Link>
                    <Link to="/gallery" className="hover:text-indigo-600 transition-colors">Gallery</Link>
                    <Link to="/buy" className="hover:text-indigo-600 transition-colors">Pricing</Link>
                </div>

                {/* Social Icons */}
                <div className="flex items-center gap-3">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <img width={16} src={assets.twitter_icon} alt="Twitter" className="opacity-70 hover:opacity-100" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <img width={16} src={assets.instagram_icon} alt="Instagram" className="opacity-70 hover:opacity-100" />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                        <img width={16} src={assets.facebook_icon} alt="Facebook" className="opacity-70 hover:opacity-100" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;