'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane, FaClock, FaQuestionCircle, FaCircle } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);

    // 1. INTERESTING FEATURE: Real-time Status Logic
    useEffect(() => {
        const hour = new Date().getHours();
        const day = new Date().getDay();
        // Assume open Mon-Sat (1-6), 8am - 5pm (8-17)
        const isOpen = day !== 0 && hour >= 8 && hour < 17;
        setIsOnline(isOpen);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            toast.success("Message sent successfully!");
            e.target.reset();
        }, 2000);
    };

    return (
        <div className="bg-white min-h-screen">
            <Toaster position="top-center" />

            {/* HERO SECTION */}
            <div className="bg-slate-900 text-white pt-24 pb-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                {/* Background Blobs (Matched from About Page) */}
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-[100px] pointer-events-none" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                    className="relative z-10"
                >
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Have a question about a booking, partnership, or our fleet? Our team is ready to assist you.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 mb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN: INFO & STATUS --- */}
                    <div className="lg:col-span-1 space-y-6">

                        {/* 2. INTERESTING FEATURE: Live Status Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
                            className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between"
                        >
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Status</p>
                                <p className={`font-bold text-lg ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
                                    {isOnline ? 'Support Online' : 'Currently Closed'}
                                </p>
                            </div>
                            <div className="relative">
                                <div className={`w-4 h-4 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                {isOnline && <div className="absolute inset-0 w-4 h-4 bg-green-500 rounded-full animate-ping opacity-75"></div>}
                            </div>
                        </motion.div>

                        {/* Contact Details Panel */}
                        <div className="bg-slate-50 p-10 rounded-3xl border border-gray-100 h-fit">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Info</h2>

                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <FaPhoneAlt />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">Phone Support</p>
                                        <a href="tel:0972338115" className="text-lg text-slate-600 hover:text-green-600 transition-colors">0972 338 115</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">Email Us</p>
                                        <a href="mailto:info@citydrive.com" className="text-lg text-slate-600 hover:text-blue-600 transition-colors">info@citydrive.com</a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white text-purple-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">Head Office</p>
                                        <p className="text-slate-600">123 Independence Ave,<br/>Lusaka, Zambia</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 pt-8 border-t border-gray-200">
                                <div className="flex items-center gap-2 mb-2 text-slate-900 font-bold">
                                    <FaClock className="text-slate-400" /> Office Hours
                                </div>
                                <div className="space-y-1 text-sm text-slate-600">
                                    <div className="flex justify-between"><span>Mon - Fri</span><span className="font-medium">08:00 - 17:00</span></div>
                                    <div className="flex justify-between"><span>Sat</span><span className="font-medium">09:00 - 13:00</span></div>
                                </div>
                            </div>

                            <a href="https://wa.me/260972338115" target="_blank" className="mt-8 flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200/50">
                                <FaWhatsapp className="text-2xl" /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN: FORM & FAQ --- */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Main Contact Form */}
                        <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
                            <p className="text-slate-500 mb-8">We usually reply within 2 hours during working time.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Your Name</label>
                                        <input required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <input required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Subject</label>
                                    <select className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-slate-600">
                                        <option>General Inquiry</option>
                                        <option>Booking Assistance</option>
                                        <option>Corporate Partnership</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Message</label>
                                    <textarea required rows="5" placeholder="How can we help you?" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg"
                                >
                                    {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                                </button>
                            </form>
                        </div>

                        {/* 3. INTERESTING FEATURE: Quick Answers (Deflects simple queries) */}
                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                                <FaQuestionCircle className="text-slate-400"/> Before you ask...
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {[
                                    { q: "Do you accept cash?", a: "Only at the head office for rentals, not deposits." },
                                    { q: "Is fuel included?", a: "Cars are provided full-to-full. Fuel is not included in the rate." },
                                    { q: "Can I cross borders?", a: "Cross-border travel requires prior written authorization and fees." },
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <p className="font-bold text-slate-800 text-sm mb-2">{item.q}</p>
                                        <p className="text-slate-600 text-xs leading-relaxed">{item.a}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}