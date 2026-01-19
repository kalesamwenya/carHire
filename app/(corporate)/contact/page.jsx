'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane, FaClock, FaQuestionCircle, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function ContactPage() {
    const [loading, setLoading] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    
    // Custom Alert State
    const [alert, setAlert] = useState({ show: false, type: 'success', message: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
    });

    useEffect(() => {
        const hour = new Date().getHours();
        const day = new Date().getDay();
        const isOpen = day !== 0 && hour >= 8 && hour < 17;
        setIsOnline(isOpen);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showAlert = (type, message) => {
        setAlert({ show: true, type, message });
        // Auto-hide after 5 seconds
        setTimeout(() => setAlert({ ...alert, show: false }), 5000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch('https://api.citydrivehire.com/support/contact_messages.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (result.success) {
                showAlert('success', "Message sent! We'll get back to you shortly.");
                setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
            } else {
                showAlert('error', result.message || "Failed to send message.");
            }
        } catch (error) {
            showAlert('error', "Network error. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white min-h-screen relative">
            
            {/* --- CUSTOM ALERT COMPONENT --- */}
            <AnimatePresence>
                {alert.show && (
                    <motion.div 
                        initial={{ opacity: 0, y: -50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        className="fixed top-10 left-0 right-0 z-[100] flex justify-center px-6 pointer-events-none"
                    >
                        <div className={`pointer-events-auto flex items-center gap-4 px-6 py-4 rounded-2xl shadow-2xl border ${
                            alert.type === 'success' 
                            ? 'bg-white border-green-100 text-slate-800' 
                            : 'bg-red-50 border-red-100 text-red-800'
                        }`}>
                            <div className={`text-2xl ${alert.type === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                {alert.type === 'success' ? <FaCheckCircle /> : <FaExclamationTriangle />}
                            </div>
                            <div>
                                <p className="font-bold text-sm uppercase tracking-tight">
                                    {alert.type === 'success' ? 'Success' : 'Attention'}
                                </p>
                                <p className="text-sm opacity-80">{alert.message}</p>
                            </div>
                            <button 
                                onClick={() => setAlert({ ...alert, show: false })}
                                className="ml-4 text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* HERO SECTION */}
            <div className="bg-slate-900 text-white pt-24 pb-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-0 w-96 h-96 bg-green-600/20 rounded-full blur-[100px] pointer-events-none" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">Get in Touch</h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Have a question about a booking, partnership, or our fleet? Our team is ready to assist you.
                    </p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 mb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN --- */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between">
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

                        <div className="bg-slate-50 p-10 rounded-3xl border border-gray-100 h-fit">
                            <h2 className="text-2xl font-bold text-slate-900 mb-8">Contact Info</h2>
                            <div className="space-y-8">
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white text-green-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-green-600 group-hover:text-white transition-colors"><FaPhoneAlt /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">Phone Support</p>
                                        <a href="tel:0972338115" className="text-lg text-slate-600 hover:text-green-600">0972 338 115</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 group">
                                    <div className="w-12 h-12 bg-white text-blue-600 rounded-2xl flex items-center justify-center text-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-colors"><FaEnvelope /></div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm uppercase tracking-wide">Email Us</p>
                                        <a href="mailto:info@citydrive.com" className="text-lg text-slate-600 hover:text-blue-600">info@citydrive.com</a>
                                    </div>
                                </div>
                            </div>
                            
                            <a href="https://wa.me/260972338115" target="_blank" rel="noreferrer" className="mt-12 flex items-center justify-center gap-2 w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-green-200/50">
                                <FaWhatsapp className="text-2xl" /> Chat on WhatsApp
                            </a>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (FORM) --- */}
                    <div className="lg:col-span-2 space-y-10">
                        <div className="bg-white p-8 lg:p-12 rounded-[2.5rem] shadow-2xl border border-gray-100">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Send a Message</h2>
                            <p className="text-slate-500 mb-8">We usually reply within 2 hours during working time.</p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Your Name</label>
                                        <input name="name" value={formData.name} onChange={handleChange} required type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Email Address</label>
                                        <input name="email" value={formData.email} onChange={handleChange} required type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Message</label>
                                    <textarea name="message" value={formData.message} onChange={handleChange} required rows="5" placeholder="How can we help you?" className="w-full bg-slate-50 border border-transparent rounded-xl px-4 py-3 focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"></textarea>
                                </div>
                                <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white py-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg">
                                    {loading ? 'Sending...' : <><FaPaperPlane /> Send Message</>}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}