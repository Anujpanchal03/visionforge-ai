import React, { useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { plans } from '../assets/assets';

const Dashboard = () => {
    const { user, credit, stats, history, loadCreditsData, loadHistory, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadCreditsData();
            loadHistory();
        }
    }, [user, loadCreditsData, loadHistory]);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl text-indigo-600 mb-4 shadow-sm">
                    📊
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Credit & Usage Dashboard</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Sign in to track your remaining credits, image generation analytics, and account balance.
                </p>
                <button
                    onClick={() => setShowLogin(true)}
                    className="mt-6 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                >
                    Sign In to View Dashboard
                </button>
            </div>
        );
    }

    const availableCredits = credit;
    const imagesGenerated = stats?.generatedCount || history.length || 0;
    const creditsUsed = stats?.creditsUsed || (imagesGenerated > 0 ? imagesGenerated : 0);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
            {/* Dashboard Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
                        <span>Account & Credits Dashboard</span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Welcome, <span className="font-semibold text-slate-800">{user.name}</span> ({user.email || 'Free Tier'})
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/buy')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20 hover:opacity-95 transition-all flex items-center gap-2"
                    >
                        <span>⚡ Add Credits</span>
                    </button>
                    <button
                        onClick={() => navigate('/result')}
                        className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-semibold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        <span>Create Image</span>
                    </button>
                </div>
            </div>

            {/* Metrics Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                {/* Available Credits Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="p-6 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 border border-indigo-100/90 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4 text-3xl opacity-20">⚡</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-indigo-700">Available Balance</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">{availableCredits}</span>
                        <span className="text-xs font-semibold text-slate-500">Credits</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Each standard image generation costs 1 credit.
                    </p>
                </motion.div>

                {/* Images Generated Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4 text-3xl opacity-20">🎨</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Images Generated</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">{imagesGenerated}</span>
                        <span className="text-xs font-semibold text-slate-500">Creations</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        All creations are stored securely in your private gallery.
                    </p>
                </motion.div>

                {/* Credits Used Card */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-sm relative overflow-hidden"
                >
                    <div className="absolute top-4 right-4 text-3xl opacity-20">📉</div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Credits Used</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-4xl font-extrabold text-slate-900">{creditsUsed}</span>
                        <span className="text-xs font-semibold text-slate-500">Consumed</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                        Zero credit charge if any generation attempt fails.
                    </p>
                </motion.div>
            </div>

            {/* Quick Upgrade Plans Banner */}
            <div className="p-8 rounded-3xl bg-slate-900 text-white shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2">
                    <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
                        Need More Compute?
                    </span>
                    <h3 className="text-2xl font-bold">Refill or Upgrade Your Credit Package</h3>
                    <p className="text-sm text-slate-400 max-w-xl">
                        Keep forging without interruption. Choose from flexible single credit refills or high-volume enterprise packs.
                    </p>
                </div>
                <button
                    onClick={() => navigate('/buy')}
                    className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-lg hover:scale-105 active:scale-95 transition-all self-start lg:self-auto"
                >
                    View Pricing Plans
                </button>
            </div>

            {/* Recent Creations Quick Grid */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-slate-900">Recent Creations</h2>
                    <button
                        onClick={() => navigate('/gallery')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                    >
                        View Full Gallery →
                    </button>
                </div>

                {history.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80">
                        <p className="text-sm text-slate-500">You haven't generated any images yet.</p>
                        <button
                            onClick={() => navigate('/result')}
                            className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
                        >
                            Generate your first image using your 50 free credits
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {history.slice(0, 6).map((item) => (
                            <div
                                key={item._id}
                                onClick={() => navigate('/gallery')}
                                className="group relative aspect-square bg-slate-950 rounded-xl overflow-hidden cursor-pointer border border-slate-200/80 shadow-sm"
                            >
                                <img
                                    src={item.resultImage}
                                    alt={item.prompt}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                                    <p className="text-[10px] text-white font-medium line-clamp-1">{item.prompt}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
