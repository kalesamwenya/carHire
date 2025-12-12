'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaSearch, FaQuestion, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

// --- DATA ---
const faqData = [
    { id: 1, category: 'General', q: 'What documents do I need to rent from City Drive?', a: 'You will need a valid Driver’s License (held for at least 2 years), a National ID or Passport, and a valid credit/debit card for the security deposit. International renters must provide a valid Passport.' },
    { id: 2, category: 'General', q: 'Is there a mileage limit?', a: 'Standard rentals come with 200km free per day. Unlimited mileage packages are available for an additional fee during the booking process.' },
    { id: 3, category: 'Booking', q: 'Can I modify my booking after confirmation?', a: 'Yes, you can modify your booking up to 24 hours before the pickup time via your dashboard or by calling our support team.' },
    { id: 4, category: 'Booking', q: 'What is the cancellation policy?', a: 'Cancellations made 48 hours before pickup are fully refundable. Cancellations within 48 hours incur a 20% administration fee.' },
    { id: 5, category: 'Insurance', q: 'Is insurance included in the price?', a: 'Basic comprehensive insurance is included. However, there is an excess fee in case of damage. You can purchase an Excess Waiver to reduce this liability.' },
    { id: 6, category: 'Payment', q: 'Do you accept cash payments?', a: 'We prefer card or mobile money payments for security reasons, but cash is accepted at our head office for the rental fee (not for the deposit).' },
    { id: 7, category: 'Vehicles', q: 'Are your cars automatic or manual?', a: 'Our fleet includes both automatic and manual transmission vehicles. You can specify your preference using the filters when searching.' },
];

const categories = ['All', 'General', 'Booking', 'Insurance', 'Payment', 'Vehicles'];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [openId, setOpenId] = useState(null);

    const toggleFAQ = (id) => {
        setOpenId(openId === id ? null : id);
    };

    const filteredFAQs = faqData.filter((item) => {
        const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
        const matchesSearch = item.q.toLowerCase().includes(searchQuery.toLowerCase()) || item.a.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="bg-gray-50 min-h-screen pb-20">
            <Toaster position="top-center" />

            {/* 1. HERO SECTION */}
            <div className="bg-slate-900 py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>

                {/* Floating Background Icons */}
                <motion.div animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity }} className="absolute top-10 left-10 text-slate-800 text-7xl opacity-50"><FaQuestion/></motion.div>
                <motion.div animate={{ y: [0, 30, 0], rotate: [0, -15, 0] }} transition={{ duration: 7, repeat: Infinity }} className="absolute bottom-10 right-20 text-slate-800 text-8xl opacity-50"><FaQuestion/></motion.div>

                <div className="max-w-3xl mx-auto text-center relative z-10 text-white">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className="text-5xl font-bold mb-6"
                    >
                        Frequently Asked Questions
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}
                        className="text-slate-300 mb-10 text-lg"
                    >
                        Everything you need to know about renting with City Drive Hire.
                    </motion.p>

                    {/* Glassmorphism Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}
                        className="relative max-w-xl mx-auto group"
                    >
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors z-10" />
                        <input
                            type="text"
                            placeholder="Search for answers (e.g. insurance)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-transparent bg-white/10 backdrop-blur-md text-white placeholder:text-slate-400 focus:bg-white/20 focus:border-green-500 outline-none shadow-lg text-lg transition-all"
                        />
                    </motion.div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-16 relative z-20 -mt-10">

                {/* 2. LIQUID CATEGORY TABS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-3 rounded-[2rem] shadow-xl flex flex-wrap gap-1 justify-center mb-10 border border-gray-100"
                >
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`relative px-6 py-3 rounded-full text-sm font-bold transition-colors z-10 ${
                                activeCategory === cat ? 'text-white' : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {activeCategory === cat && (
                                <motion.span
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-green-600 rounded-full -z-10 shadow-md"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            {cat}
                        </button>
                    ))}
                </motion.div>

                {/* 3. ANIMATED FAQ LIST */}
                <motion.div layout className="space-y-4">
                    <AnimatePresence mode='popLayout'>
                        {filteredFAQs.length > 0 ? (
                            filteredFAQs.map((faq, i) => (
                                <motion.div
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={faq.id}
                                    className={`border rounded-2xl overflow-hidden bg-white transition-all duration-300 ${openId === faq.id ? 'border-green-500 shadow-md ring-1 ring-green-100' : 'border-gray-200 hover:border-green-300 hover:shadow-sm'}`}
                                >
                                    <button
                                        onClick={() => toggleFAQ(faq.id)}
                                        className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                    >
                                        <span className={`font-bold text-lg transition-colors ${openId === faq.id ? 'text-green-700' : 'text-slate-800'}`}>
                                            {faq.q}
                                        </span>
                                        <div className={`p-3 rounded-full transition-all duration-300 ${openId === faq.id ? 'bg-green-100 text-green-600 rotate-180' : 'bg-gray-100 text-gray-500 rotate-0'}`}>
                                            {openId === faq.id ? <FaMinus size={14} /> : <FaPlus size={14} />}
                                        </div>
                                    </button>

                                    <AnimatePresence>
                                        {openId === faq.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                            >
                                                <div className="px-6 pb-8 text-slate-600 leading-relaxed border-t border-gray-100 pt-4 bg-green-50/20 text-lg">
                                                    {faq.a}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="text-center py-16"
                            >
                                <p className="text-slate-500 font-medium text-lg">No results found for "{searchQuery}"</p>
                                <button onClick={() => setSearchQuery('')} className="text-green-600 font-bold hover:underline mt-2">Clear Search</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* CTA SECTION */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-24 bg-slate-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl"
                >
                    {/* Background decoration */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-green-500/20 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
                        <p className="text-slate-300 mb-10 max-w-lg mx-auto text-lg">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                        <Link href="/contact" className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-full font-bold hover:bg-green-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform">
                            Get in Touch <FaArrowRight />
                        </Link>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}