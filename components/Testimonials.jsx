'use client';

import { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaSpinner, FaPlus } from 'react-icons/fa';
import axios from 'axios';

// --- SKELETON COMPONENT ---
const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex gap-1 mb-6">
            {[...Array(5)].map((_, i) => <div key={i} className="h-4 w-4 bg-gray-200 rounded-full" />)}
        </div>
        <div className="space-y-3 mb-8">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
        </div>
        <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
            <div className="h-12 w-12 rounded-full bg-gray-200" />
            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-20" />
                <div className="h-3 bg-gray-200 rounded w-16" />
            </div>
        </div>
    </div>
);

export default function Testimonials({ items: initialItems } = {}) {
    const [testimonials, setTestimonials] = useState(initialItems || []);
    const [loading, setLoading] = useState(!initialItems);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        if (!initialItems) {
            fetchTestimonials();
        }
    }, [initialItems]);

    const fetchTestimonials = async () => {
        try {
            const res = await axios.get(`${API_BASE}/feedback/get-approved.php`);
            setTestimonials(res.data || []);
        } catch (err) {
            console.error("Fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        
        try {
            await axios.post(`${API_BASE}/feedback/submit.php`, formData);
            alert("Feedback sent! It will appear once approved by the Emit team.");
            setIsModalOpen(false);
        } catch (err) {
            alert("Error submitting feedback. Check your Booking ID.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="bg-gray-50 py-16 lg:py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by drivers across Zambia
                    </h2>
                    <p className="mt-4 text-gray-600">Real experiences from our City Drive community.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                        [...Array(3)].map((_, i) => <SkeletonCard key={i} />)
                    ) : testimonials.length > 0 ? (
                        testimonials.map((t, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
                                <div className="flex gap-1 text-yellow-400 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < t.rating ? "fill-current" : "text-gray-200"} />
                                    ))}
                                </div>
                                <blockquote className="flex-grow text-gray-700 italic">"{t.text}"</blockquote>
                                <div className="mt-8 flex items-center gap-4 pt-6 border-t border-gray-100">
                                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm">{t.name}</div>
                                        <div className="text-xs text-gray-500">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full py-12 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-500 mb-4">No reviews yet. Be the first to share your journey!</p>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 transition"
                            >
                                <FaPlus /> Write a Review
                            </button>
                        </div>
                    )}
                </div>

                {/* --- FEEDBACK MODAL --- */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Share Your Experience</h3>
                            <p className="text-sm text-gray-500 mb-6">Your feedback helps us maintain the best fleet in Lusaka.</p>
                            
                            <form onSubmit={handleFormSubmit} className="space-y-4">
                                <input name="booking_id" required placeholder="Booking ID (e.g. BK-123456)" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" />
                                <div className="grid grid-cols-2 gap-4">
                                    <input name="name" required placeholder="Your Name" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" />
                                    <select name="rating" className="p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black font-medium">
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                </div>
                                <textarea name="text" required placeholder="Tell us about the vehicle and service..." rows="4" className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-green-500 text-black font-medium"></textarea>
                                
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 font-bold text-gray-500 hover:bg-gray-50 rounded-xl transition">Cancel</button>
                                    <button type="submit" disabled={submitting} className="flex-1 py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
                                        {submitting ? <FaSpinner className="animate-spin" /> : 'Submit Feedback'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}