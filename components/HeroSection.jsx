'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaStar, FaArrowRight } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function HeroSection() {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams({ location, pickup, dropoff });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <section className="relative bg-white overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28">

            {/* 1. Background Ambient Blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-50 blur-3xl opacity-70 z-0 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-70 z-0 pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                {/* --- LEFT CONTENT --- */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-2xl"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        <FaCheckCircle />
                        <span>Trusted by 5,000+ Travelers</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-6">
                        Drive your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-500">
                            Adventure.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                        Premium fleet, transparent daily rates, and flexible pickup options across Zambia. Your journey starts with the turn of a key.
                    </p>

                    {/* SEARCH COMPONENT */}
                    <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-slate-200/50 border border-gray-100">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-2">

                            {/* Location Input */}
                            <div className="lg:col-span-4 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                                    <FaMapMarkerAlt />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-800 placeholder:font-normal"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            {/* Pickup Date */}
                            <div className="lg:col-span-3 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                                    <FaCalendarAlt />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-600 placeholder:font-normal"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                />
                            </div>

                            {/* Dropoff Date */}
                            <div className="lg:col-span-3 relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600 transition-colors">
                                    <FaCalendarAlt />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-bold text-slate-600 placeholder:font-normal"
                                    value={dropoff}
                                    onChange={(e) => setDropoff(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="lg:col-span-2">
                                <button type="submit" className="w-full h-full bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 py-4 lg:py-0 group">
                                    <FaSearch className="group-hover:scale-110 transition-transform" />
                                    <span className="lg:hidden">Search Cars</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500">
                        <span className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> No Hidden Fees</span>
                        <span className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> 24/7 Roadside Support</span>
                        <span className="flex items-center gap-2"><FaCheckCircle className="text-green-500" /> Free Cancellation</span>
                    </div>
                </motion.div>

                {/* --- RIGHT VISUAL --- */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="relative mt-12 lg:mt-0 hidden md:block"
                >
                    <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
                        {/* Placeholder for Car Image */}
                        <div className="aspect-[4/3] relative">
                            <img
                                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070" // High quality placeholder
                                alt="Luxury SUV"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>

                        {/* Floating Glass Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/90 border border-white/50 p-5 rounded-2xl shadow-lg flex items-center justify-between"
                        >
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg">Toyota Hilux 4x4</h3>
                                <div className="flex items-center text-yellow-500 text-xs mt-1 gap-1">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    <span className="text-slate-500 font-medium ml-1">(42 trips)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-slate-500">Starting from</p>
                                <p className="text-green-600 font-extrabold text-xl">ZMW 1,500<span className="text-xs text-slate-400 font-normal">/day</span></p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Decorative Elements */}
                    <div className="absolute -z-10 top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-green-500/20 rounded-full blur-2xl"></div>
                </motion.div>

            </div>
        </section>
    );
}