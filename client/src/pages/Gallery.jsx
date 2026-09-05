import React, { useContext, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Gallery = () => {
    const { history, loadingHistory, loadHistory, user, deleteHistoryItem, toggleFavoriteItem, setShowLogin } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFavorites, setFilterFavorites] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            loadHistory();
        }
    }, [user, loadHistory]);

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl text-indigo-600 mb-4 shadow-sm">
                    🖼️
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Personal Generation Gallery</h2>
                <p className="text-slate-500 mt-2 max-w-md mx-auto">
                    Sign in to view, download, favorite, and manage your private AI image creations.
                </p>
                <button
                    onClick={() => setShowLogin(true)}
                    className="mt-6 px-8 py-3.5 rounded-2xl bg-slate-900 text-white font-semibold text-sm shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition-all"
                >
                    Sign In to View Gallery
                </button>
            </div>
        );
    }

    const filteredItems = history.filter((item) => {
        const matchesSearch = item.prompt?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.style?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFav = filterFavorites ? item.isFavorite : true;
        return matchesSearch && matchesFav;
    });

    const handleDownload = (item) => {
        const link = document.createElement('a');
        link.href = item.resultImage;
        link.download = `VisionForge_${item._id || Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success('Downloading image...');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
            {/* Gallery Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-slate-200/80">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2.5">
                        <span>Creation Gallery</span>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                            {history.length} Creations
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Your private collection of high-resolution AI generated images.
                    </p>
                </div>

                {/* Search & Favorites Filter Bar */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative min-w-[240px]">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by prompt or style..."
                            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-slate-800"
                        />
                    </div>

                    <button
                        onClick={() => setFilterFavorites(!filterFavorites)}
                        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-1.5 ${
                            filterFavorites
                                ? 'bg-rose-50 border-rose-200 text-rose-600'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <span>{filterFavorites ? '❤️ Favorites' : '🤍 Favorites Only'}</span>
                    </button>

                    <button
                        onClick={() => navigate('/result')}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                        <span>✨ New Image</span>
                    </button>
                </div>
            </div>

            {/* Gallery Grid / Loading / Empty State */}
            {loadingHistory ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="text-sm">Loading your creations...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-slate-200/80 shadow-sm mt-8 p-8">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl text-indigo-600 mb-4">
                        🎨
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">
                        {searchTerm || filterFavorites ? 'No matching images found' : 'No generated images yet'}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
                        {searchTerm || filterFavorites
                            ? 'Try clearing your search filters to see all creations.'
                            : 'Bring your vision to life! Create your first image with your free credits.'}
                    </p>
                    <button
                        onClick={() => navigate('/result')}
                        className="mt-6 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
                    >
                        Create an Image Now
                    </button>
                </div>
            ) : (
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredItems.map((item) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="group relative bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                        >
                            {/* Image Canvas */}
                            <div
                                className="relative aspect-square bg-slate-950 overflow-hidden cursor-pointer"
                                onClick={() => setSelectedImage(item)}
                            >
                                <img
                                    src={item.resultImage}
                                    alt={item.prompt}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />

                                {/* Favorite Badge on Corner */}
                                {item.isFavorite && (
                                    <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold flex items-center gap-1">
                                        ❤️ Favorite
                                    </div>
                                )}

                                {/* Style Tag */}
                                <div className="absolute top-2.5 right-2.5 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
                                    {item.style || 'Realistic'}
                                </div>
                            </div>

                            {/* Card Details & Actions */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                                <div>
                                    <p className="text-xs text-slate-800 font-medium line-clamp-2" title={item.prompt}>
                                        {item.prompt}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-1">
                                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleFavoriteItem(item._id)}
                                            className={`p-1.5 rounded-lg transition-colors ${
                                                item.isFavorite
                                                    ? 'text-rose-500 hover:bg-rose-50'
                                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                            }`}
                                            title="Favorite"
                                        >
                                            <svg className="w-4 h-4" fill={item.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => deleteHistoryItem(item._id)}
                                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                                            title="Delete Image"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleDownload(item)}
                                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-semibold transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <span>Download</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Lightbox Fullscreen Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div
                            className="relative max-w-4xl w-full bg-slate-900 rounded-3xl p-6 text-white border border-slate-800 shadow-2xl flex flex-col items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
                            >
                                ✕ Close
                            </button>

                            <img
                                src={selectedImage.resultImage}
                                alt={selectedImage.prompt}
                                className="max-h-[60vh] object-contain rounded-xl"
                            />

                            <div className="w-full mt-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-left">
                                <p className="text-xs font-semibold text-slate-400 uppercase">Prompt</p>
                                <p className="text-sm font-medium text-slate-200 mt-0.5">{selectedImage.prompt}</p>
                                
                                {selectedImage.style && (
                                    <p className="text-xs text-indigo-400 mt-2">
                                        Style: <span className="font-semibold text-white">{selectedImage.style}</span> • Ratio: {selectedImage.aspectRatio || '1:1'}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    onClick={() => handleDownload(selectedImage)}
                                    className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 shadow-md transition-colors"
                                >
                                    Download Lossless PNG
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Gallery;
