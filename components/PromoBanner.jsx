'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaTag, FaArrowRight } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

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
                    setPromoData(data.promo);
                    
                    // Show banner after 3 seconds if not seen in this session
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
    }, [API_URL]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('seenPromo', 'true');
    };

    const handleClaim = () => {
        // --- UPDATED STORAGE LOGIC ---
        // We store the full context so the Booking Page doesn't have to fetch it again
        const promoPayload = {
            code: promoData.code,
            discount: parseFloat(promoData.discount),
            minSpend: parseFloat(promoData.min_spend || promoData.minSpend),
            // Set expiry: Use server expiry if provided, otherwise default to 24hrs from now
            expiresAt: promoData.expiry_date 
                ? new Date(promoData.expiry_date).getTime() 
                : new Date().getTime() + (24 * 60 * 60 * 1000) 
        };

        localStorage.setItem('citydrive_active_promo', JSON.stringify(promoPayload));
        
        handleClose();
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
                        {/* Side Bar Decoration */}
                        <div className="bg-green-600 w-14 flex items-center justify-center shrink-0">
                            <FaTag className="text-white text-xl animate-pulse" />
                        </div>

                        <div className="p-5 flex-1 relative z-10">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-white font-bold text-lg leading-tight">
                                        Save {promoData.discount}% on your next rental!
                                    </h3>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Valid for bookings over <span className="text-white font-bold text-sm">K{promoData.min_spend || promoData.minSpend}</span>
                                    </p>
                                </div>
                                <button onClick={handleClose} className="text-slate-500 hover:text-white transition-colors p-1">
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <div className="mt-4 flex items-center gap-3">
                                <button
                                    onClick={handleClaim}
                                    className="flex-1 bg-white text-slate-900 text-xs font-bold py-3 px-4 rounded-xl hover:bg-green-50 transition-all text-center flex items-center justify-center gap-2 group"
                                >
                                    Claim & Book Now 
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}