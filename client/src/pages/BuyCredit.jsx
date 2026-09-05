import React, { useContext, useState } from 'react';
import { assets, plans } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { motion } from 'framer-motion';

const BuyCredit = () => {
    const { backendUrl, loadCreditsData, user, token, setShowLogin, credit } = useContext(AppContext);
    const [loadingPlan, setLoadingPlan] = useState(null);
    const navigate = useNavigate();

    const initRazorpay = async (order) => {
        const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!razorpayKey || razorpayKey.includes('-----')) {
            toast.info('Razorpay is in test mode. Configure VITE_RAZORPAY_KEY_ID in .env for live transactions.');
            return;
        }

        const options = {
            key: razorpayKey,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'VisionForge AI Credits',
            description: 'Credit Package Purchase',
            order_id: order.id,
            receipt: order.receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(`${backendUrl}/api/user/verify-razor`, response, {
                        headers: { token }
                    });
                    if (data.success) {
                        loadCreditsData();
                        toast.success('Credits successfully added to your account!');
                        navigate('/dashboard');
                    }
                } catch (error) {
                    toast.error(error.message || 'Payment verification failed');
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const handleRazorpay = async (planId) => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        setLoadingPlan(planId);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/pay-razor`,
                { planId },
                { headers: { token } }
            );
            if (data.success && data.order) {
                initRazorpay(data.order);
            } else {
                toast.info(data.message || 'Payment gateway setup required');
            }
        } catch (error) {
            toast.info(error.response?.data?.message || 'Payment gateway is currently in demo mode');
        } finally {
            setLoadingPlan(null);
        }
    };

    const handleStripe = async (planId) => {
        if (!user) {
            setShowLogin(true);
            return;
        }
        setLoadingPlan(planId);
        try {
            const { data } = await axios.post(
                `${backendUrl}/api/user/pay-stripe`,
                { planId },
                { headers: { token } }
            );
            if (data.success && data.session_url) {
                window.location.replace(data.session_url);
            } else {
                toast.info(data.message || 'Stripe payment gateway configuration required');
            }
        } catch (error) {
            toast.info(error.response?.data?.message || 'Stripe gateway is currently in demo mode');
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700">
                    <span>⚡ Transparent Compute Pricing</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Simple, transparent credit plans
                </h1>
                <p className="text-base sm:text-lg text-slate-600">
                    Every new user receives <span className="font-bold text-indigo-600">50 Free Credits</span>. Scale up as your creative pipeline grows.
                </p>

                {user && (
                    <div className="pt-2 inline-flex items-center gap-2 px-4 py-1 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">
                        Your Current Balance: <span className="font-bold text-indigo-600">{credit} Credits</span>
                    </div>
                )}
            </div>

            {/* Pricing Cards Grid */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {plans.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                            item.popular
                                ? 'bg-gradient-to-b from-slate-900 to-indigo-950 text-white shadow-xl shadow-indigo-950/20 ring-2 ring-indigo-500 scale-[1.02]'
                                : item.isFree
                                ? 'bg-gradient-to-b from-indigo-50/70 to-white text-slate-900 border-2 border-indigo-200/90 shadow-sm'
                                : 'bg-white text-slate-900 border border-slate-200/80 shadow-sm hover:shadow-lg'
                        }`}
                    >
                        {/* Popular / Starter Tag */}
                        {item.popular && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                                Most Popular
                            </div>
                        )}
                        {item.isFree && (
                            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-emerald-600 text-white text-[11px] font-extrabold tracking-wider uppercase shadow-md">
                                Included Free
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">{item.id}</h3>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                                    item.popular ? 'bg-indigo-500/30 text-indigo-200' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    {item.credits} Credits
                                </span>
                            </div>

                            <p className={`text-xs mt-2 ${item.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                                {item.desc}
                            </p>

                            <div className="mt-6 flex items-baseline gap-1">
                                <span className="text-4xl font-extrabold">
                                    {item.price === 0 ? 'Free' : `$${item.price}`}
                                </span>
                                {item.price > 0 && (
                                    <span className={`text-xs ${item.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                                        / one-time
                                    </span>
                                )}
                            </div>

                            {/* Features list */}
                            <ul className="mt-8 space-y-3 text-xs">
                                {item.features?.map((feat, fidx) => (
                                    <li key={fidx} className="flex items-center gap-2.5">
                                        <span className={`font-bold ${item.popular ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                            ✓
                                        </span>
                                        <span className={item.popular ? 'text-slate-200' : 'text-slate-600'}>
                                            {feat}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action CTA */}
                        <div className="mt-8 pt-6 border-t border-slate-100/20">
                            {item.isFree ? (
                                <button
                                    onClick={() => (user ? navigate('/result') : setShowLogin(true))}
                                    className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition-colors shadow-sm"
                                >
                                    {user ? 'Start Generating' : 'Claim 50 Free Credits'}
                                </button>
                            ) : (
                                <div className="space-y-2">
                                    <button
                                        onClick={() => handleStripe(item.id)}
                                        disabled={loadingPlan === item.id}
                                        className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                            item.popular
                                                ? 'bg-white text-slate-900 border-white hover:bg-slate-100 shadow-md'
                                                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                                        }`}
                                    >
                                        <img src={assets.stripe_logo} alt="Stripe" className="h-3.5 object-contain invert brightness-0" />
                                        <span>Pay with Stripe</span>
                                    </button>

                                    <button
                                        onClick={() => handleRazorpay(item.id)}
                                        disabled={loadingPlan === item.id}
                                        className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                                            item.popular
                                                ? 'bg-slate-800/80 text-white border-slate-700 hover:bg-slate-800'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                                        }`}
                                    >
                                        <img src={assets.razorpay_logo} alt="Razorpay" className="h-3.5 object-contain" />
                                        <span>Razorpay (UPI / Card)</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Guarantee Note */}
            <div className="mt-16 text-center text-xs text-slate-500 max-w-xl mx-auto">
                <p>🔒 100% Credit Security: If an image generation request fails or errors out, your credits are immediately preserved and never deducted.</p>
            </div>
        </div>
    );
};

export default BuyCredit;