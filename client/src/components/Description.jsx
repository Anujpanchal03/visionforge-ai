import React from 'react';
import { assets } from '../assets/assets';
import { motion } from 'framer-motion';

const Description = () => {
    return (
        <motion.section
            className="my-24 py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100">
                    Engineered for Precision
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                    Prompt Adherence That Actually Listens
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-3">
                    Unlike standard generative models that drift or invent unrelated elements, VisionForge AI locks into your subjects, lighting, and composition.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm">
                <div className="relative group overflow-hidden rounded-2xl aspect-[4/3] bg-slate-950 shadow-md">
                    <img
                        src={assets.sample_img_1}
                        alt="VisionForge High Fidelity Render"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-3 left-3 right-3 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md text-white border border-slate-700/60">
                        <p className="text-[11px] font-mono text-indigo-300">Prompt:</p>
                        <p className="text-xs font-medium line-clamp-2 mt-0.5">
                            "A realistic golden retriever sitting on a wooden chair in a sunny kitchen, natural light, 8k"
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 rounded-lg bg-indigo-100 text-indigo-700 font-bold items-center justify-center text-xs">1</span>
                            <h3 className="text-lg font-bold text-slate-900">Deterministic Prompt Decomposition</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                            Our preprocessing engine separates subjects, environments, actions, and styles to ensure the core subject always receives dominant attention weight.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 rounded-lg bg-purple-100 text-purple-700 font-bold items-center justify-center text-xs">2</span>
                            <h3 className="text-lg font-bold text-slate-900">Automated Negative Filtering</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                            Negative prompts automatically suppress blur, anatomy issues, and artifacts without accidentally stripping keywords you explicitly asked for.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 rounded-lg bg-pink-100 text-pink-700 font-bold items-center justify-center text-xs">3</span>
                            <h3 className="text-lg font-bold text-slate-900">Guaranteed Safe Credit Deduction</h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 pl-8 leading-relaxed">
                            Backend atomic transactions ensure that credits are only decremented upon successful, verified image production.
                        </p>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default Description;