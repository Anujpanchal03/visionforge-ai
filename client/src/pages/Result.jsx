import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { assets, stylePresets, aspectRatioOptions } from '../assets/assets';
import { toast } from 'react-toastify';

const PROMPT_SUGGESTIONS = [
    "A realistic golden retriever sitting on a wooden chair in a sunny kitchen",
    "Futuristic cyberpunk cyber-samurai standing in neon rain, Tokyo alleyway, 8k",
    "Whimsical cozy treehouse village at twilight with glowing lanterns, fantasy art",
    "Detailed macro photograph of a crystal butterfly resting on a dew-covered rose",
    "Minimalist architectural modern villa with infinity pool overlooking calm ocean"
];

const LOADING_STAGES = [
    { title: 'Analyzing Prompt Semantics', desc: 'Preserving core subjects, actions, and environment...' },
    { title: 'Applying Negative Filters', desc: 'Suppressing artifacts, blur, and unwanted distortions...' },
    { title: 'Synthesizing AI Image', desc: 'Diffusing pixel layers with high-resolution attention...' },
    { title: 'Refining Textures & Lighting', desc: 'Enhancing contrast, depth of field, and micro-details...' },
    { title: 'Finalizing Lossless Render', desc: 'Preparing final canvas...' }
];

const Result = () => {
    const [prompt, setPrompt] = useState('');
    const [negativePrompt, setNegativePrompt] = useState('blurry, low quality, distorted, malformed, duplicate objects, extra limbs, bad anatomy, deformed face, text, watermark');
    const [showNegative, setShowNegative] = useState(false);
    const [style, setStyle] = useState('Realistic');
    const [aspectRatio, setAspectRatio] = useState('1:1');
    const [loading, setLoading] = useState(false);
    const [loadingStageIndex, setLoadingStageIndex] = useState(0);
    const [image, setImage] = useState(assets.sample_img_1);
    const [isImageGenerated, setIsImageGenerated] = useState(false);
    const [currentGenId, setCurrentGenId] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const { generateImage, credit, user, setShowLogin, toggleFavoriteItem } = useContext(AppContext);

    // Multi-stage loading animator
    useEffect(() => {
        let interval = null;
        if (loading) {
            setLoadingStageIndex(0);
            interval = setInterval(() => {
                setLoadingStageIndex((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
            }, 2600);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [loading]);

    const handleGenerate = async (e) => {
        if (e) e.preventDefault();

        if (!user) {
            setShowLogin(true);
            toast.info('Please sign in to generate images');
            return;
        }

        if (!prompt.trim()) {
            toast.warning('Please describe the image you want to create.');
            return;
        }

        if (credit < 1) {
            toast.error("You don't have enough credits. Please add credits to continue.");
            return;
        }

        setLoading(true);
        setIsFavorite(false);

        try {
            const result = await generateImage({
                prompt: prompt.trim(),
                style,
                negativePrompt: showNegative ? negativePrompt : undefined,
                aspectRatio
            });

            if (result && result.resultImage) {
                setImage(result.resultImage);
                setIsImageGenerated(true);
                if (result.generation?.id) {
                    setCurrentGenId(result.generation.id);
                }
            }
        } catch (err) {
            console.error('Generation execution error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPrompt = () => {
        navigator.clipboard.writeText(prompt);
        toast.success('Prompt copied to clipboard!');
    };

    const handleToggleFavorite = async () => {
        if (currentGenId) {
            await toggleFavoriteItem(currentGenId);
            setIsFavorite(!isFavorite);
            toast.success(isFavorite ? 'Removed from favorites' : 'Saved to favorites');
        } else {
            setIsFavorite(!isFavorite);
        }
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = image;
        link.download = `VisionForge_${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Downloading lossless PNG...');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Studio Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
                        <span>Creation Studio</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            v2.0 Adherence Engine
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Compose prompts with granular style modifiers, negative suppression, and instant generation.
                    </p>
                </div>

                {/* Credit Balance & Cost Pill */}
                <div className="flex items-center gap-3 self-start md:self-auto">
                    <div className="px-4 py-2 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-[11px] font-semibold uppercase text-slate-400">Available Credits</p>
                            <p className="text-base font-extrabold text-slate-900">{credit} Credits</p>
                        </div>
                        <div className="h-8 w-px bg-slate-200" />
                        <div>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
                                Cost: 1 Credit
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Studio Grid */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Controls Column (Form) */}
                <div className="lg:col-span-5 space-y-6">
                    <form onSubmit={handleGenerate} className="space-y-6">
                        
                        {/* Prompt Input Box */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <span>Prompt</span>
                                    <span className="text-rose-500">*</span>
                                </label>
                                <span className={`text-xs font-medium ${prompt.length > 900 ? 'text-amber-600 font-bold' : 'text-slate-400'}`}>
                                    {prompt.length}/1000
                                </span>
                            </div>

                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                maxLength={1000}
                                rows={4}
                                placeholder="Describe exactly what you want to create... (e.g. A realistic golden retriever sitting on a wooden chair in a sunny kitchen)"
                                className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all resize-none text-slate-800 leading-relaxed placeholder:text-slate-400"
                            />

                            {/* Prompt Inspiration Chips */}
                            <div className="space-y-2 pt-1">
                                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Quick Prompt Starters:
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {PROMPT_SUGGESTIONS.slice(0, 3).map((item, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setPrompt(item)}
                                            className="text-left text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors line-clamp-1 max-w-full"
                                        >
                                            ⚡ {item}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Style Presets Selector */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                                Rendering Style
                            </label>
                            <div className="grid grid-cols-3 gap-2.5">
                                {stylePresets.map((s) => (
                                    <button
                                        key={s.id}
                                        type="button"
                                        onClick={() => setStyle(s.id)}
                                        className={`p-3 rounded-2xl border text-left transition-all ${
                                            style === s.id
                                                ? 'border-indigo-600 bg-indigo-50/80 ring-2 ring-indigo-500/20 shadow-sm'
                                                : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/70 hover:border-slate-300'
                                        }`}
                                    >
                                        <div className="text-lg">{s.icon}</div>
                                        <p className="text-xs font-bold text-slate-900 mt-1">{s.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Aspect Ratio Selector */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block">
                                Aspect Ratio
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                {aspectRatioOptions.map((ar) => (
                                    <button
                                        key={ar.id}
                                        type="button"
                                        onClick={() => setAspectRatio(ar.id)}
                                        className={`py-2.5 px-3 rounded-xl border text-center transition-all ${
                                            aspectRatio === ar.id
                                                ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-bold shadow-sm'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-100/70'
                                        }`}
                                    >
                                        <span className="text-xs">{ar.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Negative Prompt Collapsible */}
                        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm space-y-3">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                                    <span>Negative Filters (Anti-Distortion)</span>
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setShowNegative(!showNegative)}
                                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                                >
                                    {showNegative ? 'Use Defaults' : 'Customize'}
                                </button>
                            </div>

                            {showNegative ? (
                                <textarea
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                    rows={2}
                                    placeholder="Distorted objects, extra fingers, text, watermark..."
                                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50/50 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/30 text-slate-700 resize-none"
                                />
                            ) : (
                                <p className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    🛡️ Default negative filters active: suppresses blur, extra limbs, bad anatomy, and watermarks automatically.
                                </p>
                            )}
                        </div>

                        {/* Submit Action Button */}
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="w-full py-4 rounded-2xl bg-slate-900 text-white font-bold text-base shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.99] transition-all disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {loading ? (
                                <>
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    <span>Forging Image...</span>
                                </>
                            ) : (
                                <>
                                    <span>Generate Image</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-300 border border-slate-700">
                                        1 Credit
                                    </span>
                                    <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">→</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Right Preview Column (Canvas & Actions) */}
                <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-sm">
                        
                        {/* Canvas Frame */}
                        <div className="relative w-full aspect-square bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center shadow-inner group">
                            
                            {/* Loading State Overlay */}
                            {loading ? (
                                <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center text-white z-20">
                                    <div className="relative w-20 h-20 mb-6">
                                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping"></div>
                                        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-purple-500 border-b-transparent border-l-transparent animate-spin"></div>
                                        <div className="absolute inset-2 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-xl">
                                            ✨
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-white mb-1">
                                        {LOADING_STAGES[loadingStageIndex].title}
                                    </h3>
                                    <p className="text-xs text-slate-400 max-w-sm">
                                        {LOADING_STAGES[loadingStageIndex].desc}
                                    </p>

                                    {/* Progress Step Dots */}
                                    <div className="flex items-center gap-1.5 mt-6">
                                        {LOADING_STAGES.map((_, idx) => (
                                            <div
                                                key={idx}
                                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                                    idx <= loadingStageIndex
                                                        ? 'w-6 bg-gradient-to-r from-indigo-500 to-purple-500'
                                                        : 'w-2 bg-slate-800'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ) : null}

                            {/* Rendered Image */}
                            <img
                                src={image}
                                alt="Generated AI Visual"
                                className="w-full h-full object-contain cursor-pointer transition-transform duration-300"
                                onClick={() => setLightboxOpen(true)}
                            />

                            {/* Hover Quick Action Bar */}
                            {!loading && isImageGenerated && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={handleToggleFavorite}
                                        className={`p-2.5 rounded-full backdrop-blur-md shadow-lg transition-all ${
                                            isFavorite
                                                ? 'bg-rose-500 text-white'
                                                : 'bg-black/60 text-white hover:bg-black/80'
                                        }`}
                                        title={isFavorite ? 'Remove Favorite' : 'Save as Favorite'}
                                    >
                                        <svg className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => setLightboxOpen(true)}
                                        className="p-2.5 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-md shadow-lg transition-all"
                                        title="View Fullscreen"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons & Meta */}
                        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                                    Style: {style}
                                </span>
                                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700">
                                    Ratio: {aspectRatio}
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleCopyPrompt}
                                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                                >
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>Copy Prompt</span>
                                </button>

                                <button
                                    onClick={handleDownload}
                                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-colors flex items-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                    <span>Download PNG</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fullscreen Lightbox Modal */}
            <AnimatePresence>
                {lightboxOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setLightboxOpen(false)}
                    >
                        <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => setLightboxOpen(false)}
                                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white text-sm font-semibold flex items-center gap-1"
                            >
                                ✕ Close
                            </button>
                            <img
                                src={image}
                                alt="High Resolution AI Preview"
                                className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                            />
                            <div className="mt-4 flex items-center gap-4">
                                <button
                                    onClick={handleDownload}
                                    className="px-6 py-2.5 rounded-full bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 shadow-lg"
                                >
                                    Download High-Res PNG
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Result;