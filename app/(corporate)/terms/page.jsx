'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGavel, FaFileContract, FaExclamationTriangle, FaCheckCircle, FaBan, FaCalendarTimes, FaCreditCard, FaCarCrash } from 'react-icons/fa';
import { FadeInUp } from '@/components/ui/MotionWrappers'; // Assuming you have this from previous steps

export default function TermsPage() {
    const [activeSection, setActiveSection] = useState('agreement');

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['agreement', 'requirements', 'use', 'cancellations', 'insurance'];
            const scrollPosition = window.scrollY + 200;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element && element.offsetTop <= scrollPosition) {
                    setActiveSection(section);
                }
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({
                top: element.offsetTop - 120,
                behavior: 'smooth'
            });
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-20">

            {/* HERO SECTION */}
            <div className="bg-slate-900 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                {/* Abstract Blobs */}
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[80px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 text-green-400 text-3xl shadow-lg">
                            <FaGavel />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms & Conditions</h1>
                        <p className="text-slate-400">Please read these terms carefully before booking. <br/>Last updated: <span className="text-white font-mono">December 12, 2025</span></p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* --- LEFT: STICKY NAVIGATION --- */}
                    <div className="lg:w-1/4 hidden lg:block">
                        <div className="sticky top-28 space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-4">Contents</p>
                            {[
                                { id: 'agreement', label: '1. Agreement to Terms' },
                                { id: 'requirements', label: '2. Rental Requirements' },
                                { id: 'use', label: '3. Vehicle Usage' },
                                { id: 'cancellations', label: '4. Cancellations' },
                                { id: 'insurance', label: '5. Insurance & Liability' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => scrollTo(item.id)}
                                    className={`block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-all ${
                                        activeSection === item.id
                                            ? 'bg-white text-green-600 shadow-md border-l-4 border-green-600'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT: CONTENT --- */}
                    <div className="lg:w-3/4 space-y-12">

                        {/* 1. Agreement */}
                        <FadeInUp id="agreement" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">01</span>
                                Agreement to Terms
                            </h2>
                            <p className="text-slate-600 leading-relaxed">
                                By accessing or using the City Drive Hire website and services, you agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you ("the Renter") and City Drive Hire ("the Company").
                            </p>
                            <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3">
                                <FaFileContract className="mt-1 text-lg shrink-0" />
                                <p>We reserve the right to update these terms at any time. Continued use of our service following any changes indicates your acceptance of the new terms.</p>
                            </div>
                        </FadeInUp>

                        {/* 2. Requirements */}
                        <FadeInUp id="requirements" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">02</span>
                                Rental Requirements
                            </h2>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500"/> Age Limit</h3>
                                    <p className="text-sm text-slate-500">Renters must be at least 21 years of age. Young driver surcharges may apply for those under 25.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500"/> License</h3>
                                    <p className="text-sm text-slate-500">A valid Driver’s License held for a minimum of 2 years is mandatory. International licenses are accepted.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500"/> Identification</h3>
                                    <p className="text-sm text-slate-500">A National ID (for residents) or valid Passport (for international visitors) is required at pickup.</p>
                                </div>
                                <div className="p-4 border border-gray-100 rounded-xl hover:border-green-200 transition-colors">
                                    <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-2"><FaCheckCircle className="text-green-500"/> Payment</h3>
                                    <p className="text-sm text-slate-500">A valid credit card in the renter's name is required for the security deposit hold.</p>
                                </div>
                            </div>
                        </FadeInUp>

                        {/* 3. Vehicle Use */}
                        <FadeInUp id="use" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">03</span>
                                Vehicle Usage
                            </h2>
                            <p className="text-slate-600 mb-6">Our vehicles are maintained to the highest standards. To keep them that way, the following restrictions apply:</p>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-slate-700"><FaBan className="text-red-500"/> No smoking inside the vehicle.</li>
                                <li className="flex items-center gap-3 text-slate-700"><FaBan className="text-red-500"/> No off-road driving (unless booking a specific 4x4 class).</li>
                                <li className="flex items-center gap-3 text-slate-700"><FaBan className="text-red-500"/> No transporting hazardous materials or livestock.</li>
                            </ul>

                            <div className="bg-red-50 border-l-4 border-red-500 p-5 rounded-r-xl">
                                <p className="text-red-800 font-bold flex items-center gap-2 mb-1">
                                    <FaExclamationTriangle /> Strict Liability
                                </p>
                                <p className="text-red-700 text-sm leading-relaxed">
                                    The renter is fully liable for any traffic violations, parking fines, or towing fees incurred during the rental period. The company reserves the right to charge the renter's card for these costs plus an admin fee.
                                </p>
                            </div>
                        </FadeInUp>

                        {/* 4. Cancellations */}
                        <FadeInUp id="cancellations" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">04</span>
                                Cancellations & Refunds
                            </h2>

                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1 bg-green-50 p-6 rounded-2xl border border-green-100">
                                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-sm">
                                        <FaCheckCircle />
                                    </div>
                                    <h3 className="font-bold text-green-900 mb-2">48+ Hours Before</h3>
                                    <p className="text-sm text-green-800">Cancellations made more than 48 hours prior to the pickup time are eligible for a <span className="font-bold">100% refund</span>.</p>
                                </div>
                                <div className="flex-1 bg-orange-50 p-6 rounded-2xl border border-orange-100">
                                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-orange-600 mb-4 shadow-sm">
                                        <FaCalendarTimes />
                                    </div>
                                    <h3 className="font-bold text-orange-900 mb-2">Within 48 Hours</h3>
                                    <p className="text-sm text-orange-800">Cancellations made within 48 hours of pickup will incur a <span className="font-bold">20% administration fee</span>.</p>
                                </div>
                                <div className="flex-1 bg-gray-50 p-6 rounded-2xl border border-gray-200">
                                    <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center text-gray-600 mb-4 shadow-sm">
                                        <FaBan />
                                    </div>
                                    <h3 className="font-bold text-gray-900 mb-2">No Show</h3>
                                    <p className="text-sm text-gray-600">If the renter fails to pick up the vehicle at the scheduled time, <span className="font-bold">no refund</span> will be issued.</p>
                                </div>
                            </div>
                        </FadeInUp>

                        {/* 5. Insurance */}
                        <FadeInUp id="insurance" className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 scroll-mt-32">
                            <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="bg-slate-100 text-slate-600 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold">05</span>
                                Insurance & Liability
                            </h2>
                            <p className="text-slate-600 mb-6">
                                All City Drive vehicles come with standard Comprehensive Insurance. However, in the event of an accident where the renter is at fault, an excess fee applies.
                            </p>

                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-gray-200">
                                <FaCarCrash className="text-3xl text-slate-400" />
                                <div>
                                    <p className="font-bold text-slate-900">Excess Waiver (Optional)</p>
                                    <p className="text-sm text-slate-500">Renters may purchase an Excess Waiver to reduce their liability to zero in case of accidental damage.</p>
                                </div>
                            </div>
                        </FadeInUp>

                    </div>
                </div>
            </div>
        </div>
    );
}