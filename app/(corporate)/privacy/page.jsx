'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaShieldAlt, FaUserSecret, FaDatabase, FaCookieBite,
    FaServer, FaLock, FaHandHoldingHeart, FaEnvelope
} from 'react-icons/fa';
import { FadeInUp } from '@/components/ui/MotionWrappers';

export default function PrivacyPage() {
    const [activeSection, setActiveSection] = useState('intro');

    // Scroll Spy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['intro', 'collect', 'use', 'sharing', 'security', 'cookies'];
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
            <div className="bg-slate-900 text-white py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                {/* Abstract Blobs */}
                <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[80px]" />
                <motion.div animate={{ scale: [1, 1.3, 1], x: [0, 50, 0] }} transition={{ duration: 15, repeat: Infinity }} className="absolute bottom-0 right-0 w-96 h-96 bg-green-600/10 rounded-full blur-[80px]" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 text-green-400 text-4xl shadow-2xl">
                            <FaUserSecret />
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">Privacy Policy</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Your trust is our priority. We are committed to transparency in how we collect, use, and protect your data.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="flex flex-col lg:flex-row gap-12">

                    {/* --- LEFT: STICKY NAVIGATION --- */}
                    <div className="lg:w-1/4 hidden lg:block">
                        <div className="sticky top-28 space-y-1">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pl-4">Table of Contents</p>
                            {[
                                { id: 'intro', label: '1. Introduction' },
                                { id: 'collect', label: '2. Information We Collect' },
                                { id: 'use', label: '3. How We Use Data' },
                                { id: 'sharing', label: '4. Data Sharing' },
                                { id: 'security', label: '5. Security Measures' },
                                { id: 'cookies', label: '6. Cookies & Tracking' },
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
                    <div className="lg:w-3/4 space-y-16">

                        {/* 1. Introduction */}
                        <FadeInUp id="intro" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">1. Introduction</h2>
                            <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                At <strong>City Drive Hire</strong>, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-xl">
                                <p className="text-blue-800 font-medium">Last Updated: December 12, 2025</p>
                            </div>
                        </FadeInUp>

                        {/* 2. Information We Collect */}
                        <FadeInUp id="collect" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-slate-900 mb-8">2. Information We Collect</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center text-xl mb-4"><FaDatabase /></div>
                                    <h3 className="font-bold text-slate-900 mb-2">Identity Data</h3>
                                    <p className="text-slate-600 text-sm">First name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center text-xl mb-4"><FaEnvelope /></div>
                                    <h3 className="font-bold text-slate-900 mb-2">Contact Data</h3>
                                    <p className="text-slate-600 text-sm">Billing address, delivery address, email address and telephone numbers.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center text-xl mb-4"><FaServer /></div>
                                    <h3 className="font-bold text-slate-900 mb-2">Technical Data</h3>
                                    <p className="text-slate-600 text-sm">Internet Protocol (IP) address, your login data, browser type and version, time zone setting and location.</p>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center text-xl mb-4"><FaHandHoldingHeart /></div>
                                    <h3 className="font-bold text-slate-900 mb-2">Transaction Data</h3>
                                    <p className="text-slate-600 text-sm">Details about payments to and from you and other details of vehicles and services you have purchased from us.</p>
                                </div>
                            </div>
                        </FadeInUp>

                        {/* 3. How We Use Data */}
                        <FadeInUp id="use" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">3. How We Use Your Data</h2>
                            <p className="text-slate-600 mb-6">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
                            <ul className="space-y-4">
                                {[
                                    "To process and deliver your vehicle rental.",
                                    "To manage our relationship with you (e.g., asking for a review).",
                                    "To enable you to partake in a prize draw, competition or complete a survey.",
                                    "To administer and protect our business and this website.",
                                    "To use data analytics to improve our website, services, marketing and experiences."
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs mt-0.5 font-bold shrink-0">✓</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </FadeInUp>

                        {/* 4. Data Sharing */}
                        <FadeInUp id="sharing" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">4. Data Sharing</h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We may share your personal data with the parties set out below for the purposes set out in the table above.
                            </p>
                            <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200 space-y-4">
                                <div className="flex items-start gap-4">
                                    <FaShieldAlt className="text-slate-400 text-xl mt-1"/>
                                    <div>
                                        <h4 className="font-bold text-slate-900">External Third Parties</h4>
                                        <p className="text-sm text-slate-600">Service providers acting as processors who provide IT and system administration services.</p>
                                    </div>
                                </div>
                                <div className="w-full h-px bg-gray-200"></div>
                                <div className="flex items-start gap-4">
                                    <FaShieldAlt className="text-slate-400 text-xl mt-1"/>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Legal Requirements</h4>
                                        <p className="text-sm text-slate-600">Professional advisers including lawyers, bankers, auditors and insurers who provide consultancy, banking, legal, insurance and accounting services.</p>
                                    </div>
                                </div>
                            </div>
                        </FadeInUp>

                        {/* 5. Security */}
                        <FadeInUp id="security" className="scroll-mt-32">
                            <div className="bg-slate-900 text-white p-10 rounded-3xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 rounded-full blur-[60px] pointer-events-none"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-white/10 rounded-xl"><FaLock className="text-2xl text-green-400" /></div>
                                        <h2 className="text-3xl font-bold">5. Data Security</h2>
                                    </div>
                                    <p className="text-slate-300 leading-relaxed mb-6">
                                        We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorized way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                                    </p>
                                    <p className="text-slate-300 text-sm italic">
                                        They will only process your personal data on our instructions and they are subject to a duty of confidentiality.
                                    </p>
                                </div>
                            </div>
                        </FadeInUp>

                        {/* 6. Cookies */}
                        <FadeInUp id="cookies" className="scroll-mt-32">
                            <h2 className="text-3xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                6. Cookies Policy <FaCookieBite className="text-amber-500" />
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. If you disable or refuse cookies, please note that some parts of this website may become inaccessible or not function properly.
                            </p>
                        </FadeInUp>

                    </div>
                </div>
            </div>
        </div>
    );
}