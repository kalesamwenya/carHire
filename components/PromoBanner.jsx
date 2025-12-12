'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show banner after 3 seconds of browsing
        const timer = setTimeout(() => {
            // Optional: Check sessionStorage so it doesn't show every single refresh
            const hasSeenPromo = sessionStorage.getItem('seenPromo');
            if (!hasSeenPromo) {
                setIsVisible(true);
            }
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        // Save to session storage so it doesn't pop up again this session
        sessionStorage.setItem('seenPromo', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-8 md:bottom-8 z-50 max-w-lg w-full"
                >
                    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex relative">

                        {/* Decorative Gradient Background */}
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-20"></div>
                        <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-24 h-24 bg-blue-500 rounded-full blur-2xl opacity-20"></div>

                        {/* Icon Section */}
                        <div className="bg-green-600 w-14 flex items-center justify-center shrink-0">
                            <FaTag className="text-white text-xl animate-pulse" />
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex-1 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        Get 15% Off Your First Trip!
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Use code <span className="text-green-400 font-mono font-bold text-sm mx-1">EMIT2025</span> at checkout.
                                    </p>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-slate-500 hover:text-white transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <Link
                                    href="/search"
                                    onClick={handleClose}
                                    className="flex-1 bg-white text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center flex items-center justify-center gap-2"
                                >
                                    Claim Offer <FaArrowRight />
                                </Link>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2.5 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                                >
                                    No Thanks
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}