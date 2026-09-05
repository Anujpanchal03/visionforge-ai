import React from 'react';
import { assets, testimonialsData } from '../assets/assets';
import { motion } from 'framer-motion';

const Testimonials = () => {
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
                    Trusted by Creators
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
                    What Artists & Developers Are Saying
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-3">
                    Discover how VisionForge AI empowers designers, developers, and studios worldwide.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {testimonialsData.map((testimonial, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                        <div>
                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {Array(testimonial.stars).fill('').map((_, sIndex) => (
                                    <img key={sIndex} src={assets.rating_star} alt="Star" className="w-4 h-4" />
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm leading-relaxed italic">
                                "{testimonial.text}"
                            </p>
                        </div>

                        <div className="flex items-center gap-3.5 mt-8 pt-6 border-t border-slate-100">
                            <img src={testimonial.image} alt={testimonial.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                            <div>
                                <h4 className="text-sm font-bold text-slate-900">{testimonial.name}</h4>
                                <p className="text-xs text-slate-400">{testimonial.role}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.section>
    );
};

export default Testimonials;