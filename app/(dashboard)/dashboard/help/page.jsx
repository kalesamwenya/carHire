'use client';

import { useState } from 'react';
import {
    FaLifeRing,
    FaPaperPlane,
    FaWhatsapp,
    FaPhoneAlt,
    FaEnvelope,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';

export default function CustomerSupportPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        booking_id: '',
        subject: '',
        priority: 'Medium',
        message: ''
    });

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState({ type: null, message: '' });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: null, message: '' });

        try {
            const res = await fetch(`${API_URL}/support/create_ticket.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (data.success) {
                setStatus({ 
                    type: 'success', 
                    message: `Ticket #${data.ticket_id} created. We'll be in touch soon!` 
                });
                setForm({
                    name: '', email: '', phone: '',
                    booking_id: '', subject: '',
                    priority: 'Medium', message: ''
                });
            } else {
                throw new Error(data.message || "Failed to submit ticket");
            }
        } catch (error) {
            setStatus({ type: 'error', message: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FBFBFC] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* GRID LAYOUT */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* LEFT COLUMN: INFO */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-10">
                            <div className="inline-flex p-4 bg-green-600 text-white rounded-3xl shadow-xl shadow-green-100 mb-8 text-2xl">
                                <FaLifeRing />
                            </div>
                            <h1 className="text-5xl font-black text-gray-900 leading-tight mb-6">
                                How can we <span className="text-green-600">help?</span>
                            </h1>
                            <p className="text-gray-500 text-lg font-medium mb-10">
                                Have a question about your booking or need technical assistance? Our team is available 24/7.
                            </p>

                            {/* QUICK LINKS */}
                            <div className="space-y-4">
                                <a href="https://wa.me/0972338115" className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                    <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center text-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
                                        <FaWhatsapp />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</p>
                                        <p className="font-bold text-gray-900">+260 972 338 115</p>
                                    </div>
                                </a>

                                <div className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-gray-100 shadow-sm group">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl">
                                        <FaEnvelope />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Us</p>
                                        <p className="font-bold text-gray-900">support@citydrivehire.com</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FORM */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-[40px] shadow-sm border border-gray-100 p-10 lg:p-14">
                            
                            {status.type && (
                                <div className={`mb-10 p-6 rounded-3xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300 ${
                                    status.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' : 'bg-red-50 text-red-800 border border-red-100'
                                }`}>
                                    {status.type === 'success' ? <FaCheckCircle className="text-2xl shrink-0" /> : <FaExclamationCircle className="text-2xl shrink-0" />}
                                    <p className="font-bold">{status.message}</p>
                                </div>
                            )}

                            <div className="space-y-8">
                                {/* NAME & EMAIL */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                                        <input 
                                            type="text" name="name" value={form.name} onChange={handleChange} required
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                        <input 
                                            type="email" name="email" value={form.email} onChange={handleChange} required
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                {/* PHONE & BOOKING ID */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                                        <input 
                                            type="text" name="phone" value={form.phone} onChange={handleChange}
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800"
                                            placeholder="+260..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Booking ID (Optional)</label>
                                        <input 
                                            type="text" name="booking_id" value={form.booking_id} onChange={handleChange}
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800"
                                            placeholder="CD-8829"
                                        />
                                    </div>
                                </div>

                                {/* SUBJECT & PRIORITY */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Subject</label>
                                        <input 
                                            type="text" name="subject" value={form.subject} onChange={handleChange} required
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800"
                                            placeholder="How do I..."
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Priority</label>
                                        <select 
                                            name="priority" value={form.priority} onChange={handleChange}
                                            className="w-full h-14 px-6 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-bold text-gray-800 appearance-none"
                                        >
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                        </select>
                                    </div>
                                </div>

                                {/* MESSAGE */}
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Message</label>
                                    <textarea 
                                        rows={5} name="message" value={form.message} onChange={handleChange} required
                                        className="w-full p-6 rounded-3xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all font-medium text-gray-800 resize-none"
                                        placeholder="Tell us exactly what happened..."
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full h-16 rounded-2xl bg-gray-900 hover:bg-black text-white font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl shadow-gray-200 disabled:opacity-70 disabled:cursor-not-allowed group"
                                >
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Processing...
                                        </span>
                                    ) : (
                                        <>
                                            Submit Ticket
                                            <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}