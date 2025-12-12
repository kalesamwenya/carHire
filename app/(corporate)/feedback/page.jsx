'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaUserCircle, FaPaperPlane, FaCheckCircle, FaQuoteRight } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    // Mock Data with Verification Status
    const reviews = [
        { id: 1, name: 'John Doe', rating: 5, date: '2 days ago', verified: true, text: 'The Hilux was in perfect condition for our trip to Livingstone. Highly recommend!' },
        { id: 2, name: 'Jane Smith', rating: 4, date: '1 week ago', verified: true, text: 'Great experience, though pickup took a little longer than expected.' },
        { id: 3, name: 'Peter B.', rating: 5, date: '2 weeks ago', verified: false, text: 'Best rates I found in Lusaka. Will definitely come back.' },
        { id: 4, name: 'Sarah L.', rating: 5, date: '3 weeks ago', verified: true, text: 'Customer support was amazing when we had a flat tire. They sent help immediately.' },
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return toast.error("Please rate us first!");
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            toast.success("Feedback submitted!");
            setRating(0);
            e.target.reset();
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <Toaster position="top-center" />

            {/* HERO SECTION */}
            <div className="bg-slate-900 text-white py-20 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                {/* Ambient Blobs */}
                <motion.div animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-green-600/20 rounded-full blur-[80px] pointer-events-none" />
                <motion.div animate={{ scale: [1, 1.3, 1], x: [0, -50, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl font-bold mb-4">Client Feedback</h1>
                    <p className="text-slate-400 text-lg">Trusted by over 1,200 travelers across Zambia.</p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-12 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN: DASHBOARD & FORM --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 1. INTERESTING FEATURE: Rating Dashboard */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center"
                        >
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Overall Rating</p>
                            <div className="flex justify-center items-end gap-2 mb-4">
                                <span className="text-6xl font-extrabold text-slate-900">4.8</span>
                                <span className="text-xl text-slate-400 mb-2">/5</span>
                            </div>
                            <div className="flex justify-center text-yellow-400 text-xl mb-6 gap-1">
                                <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-yellow-400/50" />
                            </div>

                            {/* Rating Breakdown Bars */}
                            <div className="space-y-3 text-xs">
                                {[
                                    { stars: 5, pct: '80%' },
                                    { stars: 4, pct: '15%' },
                                    { stars: 3, pct: '3%' },
                                    { stars: 2, pct: '1%' },
                                    { stars: 1, pct: '1%' },
                                ].map((row) => (
                                    <div key={row.stars} className="flex items-center gap-3">
                                        <span className="w-3 font-bold text-slate-600 flex gap-1">{row.stars} <span className="text-gray-300">★</span></span>
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                whileInView={{ width: row.pct }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                                className="h-full bg-yellow-400 rounded-full"
                                            ></motion.div>
                                        </div>
                                        <span className="w-8 text-right text-slate-400 font-medium">{row.pct}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Submit Review Form */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
                            <h3 className="font-bold text-slate-900 mb-1 text-lg">Leave a Review</h3>
                            <p className="text-slate-500 text-sm mb-6">Share your experience with us.</p>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Interactive Stars */}
                                <div className="flex justify-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            className={`text-2xl cursor-pointer transition-transform hover:scale-110 ${i + 1 <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                            onClick={() => setRating(i + 1)}
                                            onMouseEnter={() => setHover(i + 1)}
                                            onMouseLeave={() => setHover(0)}
                                        />
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase ml-1">Your Name</label>
                                    <input required type="text" placeholder="John Doe" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none transition-all" />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase ml-1">Experience</label>
                                    <textarea required rows="4" placeholder="How was your trip?" className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none resize-none transition-all"></textarea>
                                </div>

                                <button
                                    disabled={submitting}
                                    className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl text-sm hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 shadow-lg"
                                >
                                    {submitting ? 'Posting...' : <><FaPaperPlane /> Post Review</>}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: REVIEWS FEED --- */}
                    <div className="lg:col-span-2 space-y-6 lg:mt-12">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-slate-900">Recent Reviews</h3>
                            <select className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-slate-600 outline-none cursor-pointer hover:border-gray-300">
                                <option>Newest First</option>
                                <option>Highest Rated</option>
                                <option>Lowest Rated</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {reviews.map((review, i) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    key={review.id}
                                    whileHover={{ y: -5 }}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative group"
                                >
                                    {/* Quote Icon Overlay */}
                                    <FaQuoteRight className="absolute top-6 right-6 text-slate-100 text-4xl group-hover:text-green-50 transition-colors" />

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-50 text-green-600 rounded-full flex items-center justify-center text-xl shadow-inner">
                                                <FaUserCircle />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-bold text-slate-900 text-sm">{review.name}</p>
                                                    {/* 2. INTERESTING FEATURE: Verification Badge */}
                                                    {review.verified && (
                                                        <span className="bg-green-50 text-green-700 text-[10px] px-2 py-0.5 rounded-full border border-green-100 flex items-center gap-1 font-bold">
                                                            <FaCheckCircle size={10} /> Verified
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-400 mt-0.5">{review.date}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex text-yellow-400 text-xs mb-3 gap-0.5 relative z-10">
                                        {[...Array(5)].map((_, starI) => (
                                            <FaStar key={starI} className={starI < review.rating ? "text-yellow-400" : "text-gray-200"} />
                                        ))}
                                    </div>

                                    <p className="text-slate-600 text-sm leading-relaxed relative z-10">"{review.text}"</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center pt-10">
                            <button className="px-10 py-3 bg-white border border-slate-300 rounded-full text-slate-600 font-bold hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm">
                                Load More Reviews
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}