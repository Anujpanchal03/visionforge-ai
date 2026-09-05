import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const GenerateBtn = () => {
    const { user, setShowLogin } = useContext(AppContext);
    const navigate = useNavigate();

    const onClickHandler = () => {
        if (user) {
            navigate('/result');
            window.scrollTo(0, 0);
        } else {
            setShowLogin(true);
            window.scrollTo(0, 0);
        }
    };

    return (
        <motion.section
            className="my-24 py-16 px-4 text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            <div className="relative p-10 sm:p-16 rounded-3xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white shadow-2xl overflow-hidden border border-slate-800">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none" />

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    <span className="px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold uppercase tracking-wider">
                        Ready to Create?
                    </span>
                    <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
                        Experience the precision of VisionForge AI.
                    </h2>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        Start with 50 free credits right away. No upfront payment required. Describe your vision and watch the magic unfold.
                    </p>

                    <div className="pt-4">
                        <button
                            onClick={onClickHandler}
                            className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-base shadow-xl hover:bg-slate-100 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2.5"
                        >
                            <span>Create Your Image</span>
                            <span className="text-amber-500 font-bold">⚡</span>
                        </button>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};

export default GenerateBtn;