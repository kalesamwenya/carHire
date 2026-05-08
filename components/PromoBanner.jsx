'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation'; // Use Next.js router for redirection

export default function PromoBanner() {
    const [isVisible, setIsVisible] = useState(false);
    const [promoData, setPromoData] = useState(null);
    const router = useRouter();

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.citydrivehire.com';

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const response = await fetch(`${API_URL}/promotion/get_active_promo.php`);
                const data = await response.json();

                if (data.success) {
                    // Note: Your API returned 'discount', not 'discount_percent' based on previous updates
                    setPromoData(data.promo);
                    
                    const timer = setTimeout(() => {
                        const hasSeenPromo = sessionStorage.getItem('seenPromo');
                        if (!hasSeenPromo) {
                            setIsVisible(true);
                        }
                    }, 3000);
                    return () => clearTimeout(timer);
                }
            } catch (error) {
                console.error("Failed to fetch promo:", error);
            }
        };

        fetchPromo();
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('seenPromo', 'true');
    };

    const handleClaim = () => {
        // Save the promo code so the booking page can find it automatically
        localStorage.setItem('active_promo_code', promoData.code);
        
        handleClose();
        
        // Redirect to booking (or search if that's where your flow starts)
        router.push('/booking'); 
    };

    if (!promoData) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-8 md:bottom-8 z-50 max-w-lg w-full"
                >
                    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700 flex relative">
                        <div className="bg-green-600 w-14 flex items-center justify-center shrink-0">
                            <FaTag className="text-white text-xl animate-pulse" />
                        </div>

                        <div className="p-5 flex-1 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        Get {promoData.discount}% Off Your Trip!
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Applicable for rentals over <span className="text-white font-bold">K{promoData.minSpend}</span>.
                                    </p>
                                </div>
                                <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors">
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    onClick={handleClaim}
                                    className="flex-1 bg-white text-slate-900 text-xs font-bold py-2.5 px-4 rounded-lg hover:bg-gray-100 transition-colors text-center flex items-center justify-center gap-2"
                                >
                                    Claim Offer <FaArrowRight />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}