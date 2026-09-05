import React from 'react';
import { stepsData } from '../assets/assets';
import { motion } from 'framer-motion';

const Steps = () => {
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
                    Simple Workflow
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                    How VisionForge AI Works
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-3">
                    From raw text idea to high-resolution masterpiece in three frictionless steps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stepsData.map((item, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
                                <img width={28} src={item.icon} alt="" className="opacity-80" />
                            </div>
                            <div className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                                Step 0{index + 1}
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default Steps;