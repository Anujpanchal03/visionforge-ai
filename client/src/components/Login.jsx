import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Login = () => {
    const [state, setState] = useState('Sign Up'); // Default to Sign Up so new users see the 50 free credits!
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { backendUrl, setShowLogin, setToken, setUser, setCredit, loadCreditsData } = useContext(AppContext);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (state === 'Login') {
                const { data } = await axios.post(`${backendUrl}/api/user/login`, { email, password });
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    if (typeof data.credits === 'number') {
                        setCredit(data.credits);
                    }
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    toast.success(`Welcome back, ${data.user.name}!`);
                    loadCreditsData();
                } else {
                    toast.error(data.message || 'Login failed');
                }
            } else {
                if (password !== confirmPassword) {
                    toast.error('Passwords do not match');
                    setLoading(false);
                    return;
                }

                const { data } = await axios.post(`${backendUrl}/api/user/register`, {
                    name,
                    email,
                    password,
                    confirmPassword
                });

                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    setCredit(data.credits || 50);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                    toast.success(data.message || "Welcome to VisionForge AI — 50 free credits added!");
                    loadCreditsData();
                } else {
                    toast.error(data.message || 'Registration failed');
                }
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.message || 'Authentication error';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="fixed inset-0 z-50 backdrop-blur-md bg-slate-950/60 flex justify-center items-center p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 my-8"
            >
                {/* Close Button */}
                <button
                    onClick={() => setShowLogin(false)}
                    className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Brand Header */}
                <div className="text-center mb-6">
                    <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 mb-3">
                        <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {state === 'Login' ? 'Welcome Back' : 'Join VisionForge AI'}
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {state === 'Login'
                            ? 'Sign in to access your images and credits'
                            : 'Create an account and start generating with precision'}
                    </p>
                </div>

                {/* Free Credits Highlight Banner for New Users */}
                {state === 'Sign Up' && (
                    <div className="mb-6 p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80 flex items-center gap-3">
                        <span className="text-2xl">⚡</span>
                        <div>
                            <p className="text-xs font-bold text-indigo-900">50 Free Generation Credits</p>
                            <p className="text-[11px] text-indigo-700">Receive 50 credits automatically upon account creation.</p>
                        </div>
                    </div>
                )}

                {/* State Tabs */}
                <div className="flex rounded-xl bg-slate-100 p-1 mb-6">
                    <button
                        type="button"
                        onClick={() => setState('Login')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                            state === 'Login'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setState('Sign Up')}
                        className={`flex-1 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
                            state === 'Sign Up'
                                ? 'bg-white text-slate-900 shadow-sm'
                                : 'text-slate-500 hover:text-slate-900'
                        }`}
                    >
                        Create Account
                    </button>
                </div>

                <form onSubmit={onSubmitHandler} className="space-y-4">
                    {state === 'Sign Up' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <input
                                    onChange={(e) => setName(e.target.value)}
                                    value={name}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800"
                                    type="text"
                                    placeholder="Jane Doe"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </span>
                            <input
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800"
                                type="email"
                                placeholder="jane@example.com"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </span>
                            <input
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="••••••••"
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                            >
                                {showPassword ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {state === 'Sign Up' && (
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </span>
                                <input
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-slate-800"
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                <span>{state === 'Login' ? 'Signing In...' : 'Creating Account...'}</span>
                            </>
                        ) : (
                            <span>{state === 'Login' ? 'Sign In' : 'Claim 50 Free Credits'}</span>
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    {state === 'Login' ? (
                        <p className="text-xs text-slate-500">
                            Don't have an account?{' '}
                            <button
                                onClick={() => setState('Sign Up')}
                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Create an account for 50 free credits
                            </button>
                        </p>
                    ) : (
                        <p className="text-xs text-slate-500">
                            Already have an account?{' '}
                            <button
                                onClick={() => setState('Login')}
                                className="font-semibold text-indigo-600 hover:text-indigo-700"
                            >
                                Sign in here
                            </button>
                        </p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default Login;