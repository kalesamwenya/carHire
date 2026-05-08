'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaCheck, FaTrash, FaClock, FaUser, FaQuoteLeft } from 'react-icons/fa';
import CityDriveLoader from '@/components/CityDriveLoader';
import Toast from '@/components/Toast';

export default function ManageFeedback() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending'); // 'pending' or 'all'
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE}/admin/manage_feedback.php`);
            setReviews(res.data.data || []);
        } catch (err) {
            showToast("Failed to load reviews", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        if (action === 'delete' && !confirm("Delete this review permanently?")) return;

        try {
            await axios.post(`${API_BASE}/admin/manage_feedback.php`, { id, action });
            showToast(`Review ${action === 'approve' ? 'Approved' : 'Deleted'} successfully`);
            
            // Optimistic Update
            if (action === 'delete') {
                setReviews(prev => prev.filter(r => r.id !== id));
            } else {
                setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'approved' } : r));
            }
        } catch (err) {
            showToast("Action failed", "error");
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
    };

    const filteredReviews = filter === 'pending' 
        ? reviews.filter(r => r.status === 'pending') 
        : reviews;

    if (loading) return <CityDriveLoader message="curating client stories..." />;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <AnimatePresence>
                {toast.show && (
                    <Toast 
                        message={toast.message} 
                        type={toast.type} 
                        onClose={() => setToast({ ...toast, show: false })} 
                    />
                )}
            </AnimatePresence>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Client Testimonials</h1>
                    <p className="text-gray-500">Manage public reviews and quality feedback.</p>
                </div>

                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${filter === 'pending' ? 'bg-white shadow-sm text-green-600' : 'text-gray-500'}`}
                    >
                        PENDING ({reviews.filter(r => r.status === 'pending').length})
                    </button>
                    <button 
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${filter === 'all' ? 'bg-white shadow-sm text-slate-900' : 'text-gray-500'}`}
                    >
                        ALL REVIEWS
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode='popLayout'>
                    {filteredReviews.map((review) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={review.id}
                            className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                            {/* Status Badge */}
                            <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                review.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                                {review.status}
                            </div>

                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
                                    <FaUser size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{review.user_name}</h3>
                                    <div className="flex text-amber-400 gap-0.5 mt-1">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} size={12} className={i < review.rating ? "fill-current" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <FaQuoteLeft className="absolute -top-2 -left-2 text-gray-50 opacity-50 text-4xl -z-10" />
                                <p className="text-gray-600 text-sm leading-relaxed italic mb-6">
                                    "{review.feedback_text}"
                                </p>
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-tighter">
                                    <FaClock /> {new Date(review.created_at).toLocaleDateString()} • {review.booking_id}
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleAction(review.id, 'delete')}
                                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash size={14} />
                                    </button>
                                    
                                    {review.status === 'pending' && (
                                        <button 
                                            onClick={() => handleAction(review.id, 'approve')}
                                            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-green-700 shadow-lg shadow-green-100 transition-all"
                                        >
                                            <FaCheck size={10} /> APPROVE
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {filteredReviews.length === 0 && (
                <div className="text-center py-20">
                    <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                        <FaQuoteLeft size={30} />
                    </div>
                    <p className="text-gray-400 font-medium">No reviews found in this category.</p>
                </div>
            )}
        </div>
    );
}