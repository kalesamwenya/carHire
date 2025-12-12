'use client';

import { motion, useInView } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    FaGlobeAfrica, FaHandshake, FaUsers, FaCheckCircle,
    FaCarSide, FaArrowRight, FaQuoteLeft, FaTrophy, FaRoad
} from 'react-icons/fa';

// --- ANIMATION VARIANTS ---
const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.2 }
    }
};

// --- COUNTER COMPONENT ---
const Counter = ({ from, to, duration = 2 }) => {
    const [count, setCount] = useState(from);
    const nodeRef = useRef(null);
    const isInView = useInView(nodeRef, { once: true });

    useEffect(() => {
        if (isInView) {
            let start = from;
            const end = to;
            const range = end - start;
            let current = start;
            const increment = end > start ? 1 : -1;
            const stepTime = Math.abs(Math.floor(duration * 1000 / range));

            const timer = setInterval(() => {
                current += increment;
                setCount(current);
                if (current == end) clearInterval(timer);
            }, stepTime);
            return () => clearInterval(timer);
        }
    }, [isInView, from, to, duration]);

    return <span ref={nodeRef}>{count}</span>;
};

export default function AboutPage() {
    return (
        <div className="overflow-x-hidden bg-white">

            {/* 1. HERO SECTION WITH BLOBS */}
            <section className="relative min-h-[90vh] flex items-center bg-slate-900 text-white overflow-hidden pb-20">
                {/* Animated Background Blobs */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[100px] pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], x: [0, -50, 0] }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
                />

                {/* Grid Pattern Overlay */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="max-w-4xl"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-green-400 font-bold text-sm mb-6">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            Premium Mobility Solutions
                        </motion.div>

                        <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
                            Moving Zambia <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                                Forward.
                            </span>
                        </motion.h1>

                        <motion.p variants={fadeInUp} className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
                            City Drive Hire isn't just about renting cars. We bridge the gap between ambition and destination with a fleet designed for reliability, comfort, and style.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                            <Link href="/contact" className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
                                Partner With Us <FaArrowRight />
                            </Link>
                            <Link href="/cars" className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/20 rounded-full font-bold transition-all backdrop-blur-md">
                                View Fleet
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 2. LIVE STATS STRIP (Overlapping) */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-20 -mt-24 mx-4 lg:mx-auto max-w-6xl"
            >
                <div className="bg-green-600 text-white py-12 rounded-[2.5rem] shadow-2xl flex flex-wrap justify-around items-center gap-8 text-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
                    <div className="p-4">
                        <p className="text-5xl font-extrabold mb-1"><Counter from={0} to={50} />+</p>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80">Premium Vehicles</p>
                    </div>
                    <div className="w-px h-16 bg-white/20 hidden md:block"></div>
                    <div className="p-4">
                        <p className="text-5xl font-extrabold mb-1"><Counter from={0} to={120} />k</p>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80">Kilometers Driven</p>
                    </div>
                    <div className="w-px h-16 bg-white/20 hidden md:block"></div>
                    <div className="p-4">
                        <p className="text-5xl font-extrabold mb-1"><Counter from={0} to={5} />.0</p>
                        <p className="text-sm font-bold uppercase tracking-wider opacity-80">Star Rating</p>
                    </div>
                </div>
            </motion.div>

            {/* 3. VISION & MISSION CARDS */}
            <section className="py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-green-500 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <FaGlobeAfrica />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
                            <p className="text-slate-600 leading-relaxed">
                                To be the undisputed leader in Southern African mobility, setting the standard for safety, innovation, and customer care.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-blue-500 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <FaHandshake />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
                            <p className="text-slate-600 leading-relaxed">
                                To empower every journey by providing impeccably maintained vehicles and 24/7 support that our clients can trust.
                            </p>
                        </motion.div>

                        <motion.div variants={fadeInUp} className="bg-white p-8 rounded-3xl shadow-xl border-b-4 border-purple-500 hover:-translate-y-2 transition-transform duration-300">
                            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
                                <FaUsers />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Core Values</h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-600"><FaCheckCircle className="text-green-500"/> Integrity & Transparency</li>
                                <li className="flex items-center gap-3 text-slate-600"><FaCheckCircle className="text-green-500"/> Safety First</li>
                                <li className="flex items-center gap-3 text-slate-600"><FaCheckCircle className="text-green-500"/> Customer Obsession</li>
                            </ul>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* 4. OUR STORY / TIMELINE */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h4 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4">Our History</h4>
                        <h2 className="text-4xl font-bold text-slate-900">The Road We Traveled</h2>
                    </div>

                    <div className="relative border-l-4 border-slate-100 ml-4 md:ml-1/2 space-y-12">
                        {[
                            { year: '2020', title: 'The Beginning', text: 'Started with just 3 cars in a small garage in Lusaka, fueled by a passion for service.' },
                            { year: '2022', title: 'Corporate Expansion', text: 'Partnered with major mining firms for logistics support, expanding our fleet to 20 vehicles.' },
                            { year: '2024', title: 'Tech Integration', text: 'Launched our digital booking platform to streamline the customer experience.' },
                            { year: '2025', title: 'National Coverage', text: 'Opened branches in Livingstone and Kitwe to serve tourists and businesses countrywide.' }
                        ].map((item, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="relative pl-8 md:pl-0"
                            >
                                {/* Timeline Dot */}
                                <div className="absolute -left-[11px] top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-md z-10"></div>
                                {/* Card */}
                                <div className={`bg-slate-50 p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow max-w-lg ${index % 2 !== 0 ? 'md:ml-auto md:mr-8' : 'md:mr-auto md:ml-8'}`}>
                                    <span className="text-green-600 font-extrabold text-xl">{item.year}</span>
                                    <h3 className="text-xl font-bold text-slate-900 mt-1 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. CORPORATE STORY SECTION (Abstract Graphic) */}
            <section className="py-24 overflow-hidden bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

                    {/* Abstract Graphic Area */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1 relative"
                    >
                        <div className="relative w-full h-[500px] bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-slate-100">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <FaCarSide className="text-[12rem] text-slate-100" />
                            </div>
                            {/* Animated Overlay Shapes */}
                            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-10 right-10 w-24 h-24 bg-green-500/20 rounded-full blur-xl"></motion.div>
                            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute bottom-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></motion.div>

                            {/* Glass Card Overlay */}
                            <div className="absolute bottom-8 right-8 bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/50 max-w-xs">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-3 bg-green-100 text-green-600 rounded-lg"><FaTrophy /></div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Award Winning</p>
                                        <p className="text-sm font-bold text-slate-900">Best SME 2024</p>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Recognized for excellence in Zambian transport logistics.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        className="flex-1"
                    >
                        <h4 className="text-green-600 font-bold uppercase tracking-widest text-sm mb-4">Who We Are</h4>
                        <h2 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">Redefining Car Rental in Zambia.</h2>
                        <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                            Established in Lusaka, <strong>City Drive Hire</strong> started with a simple belief: that renting a car should be seamless, transparent, and dignified. We have grown from a small fleet to a comprehensive logistics partner for international NGOs, corporate executives, and leisure travelers.
                        </p>
                        <div className="p-6 bg-white border-l-4 border-green-500 rounded-r-xl shadow-sm">
                            <p className="text-xl italic text-slate-800 font-medium">"We don't just rent cars; we enable opportunities."</p>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 6. MEET THE LEADERSHIP */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">Driven by Passion</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Michael Zulu', role: 'Founder & CEO' },
                            { name: 'Sarah Phiri', role: 'Head of Operations' },
                            { name: 'James Banda', role: 'Fleet Manager' },
                        ].map((person, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                whileHover={{ y: -10 }}
                                className="bg-slate-50 p-8 rounded-[2rem] border border-gray-100 text-center group hover:bg-white hover:shadow-xl transition-all"
                            >
                                <div className="w-32 h-32 mx-auto bg-slate-200 rounded-full mb-6 flex items-center justify-center text-slate-400 overflow-hidden relative">
                                    <FaUsers className="text-4xl" />
                                    {/* Image placeholder overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                <h3 className="text-xl font-bold text-slate-900">{person.name}</h3>
                                <p className="text-green-600 font-medium text-sm mb-4">{person.role}</p>
                                <p className="text-slate-500 text-sm">Dedicated to ensuring your journey is smooth and safe.</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. TESTIMONIALS */}
            <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <FaQuoteLeft className="text-5xl text-green-500 mx-auto mb-8 opacity-50" />
                    <h2 className="text-4xl font-bold mb-12">Trusted by Professionals</h2>

                    <div className="grid md:grid-cols-2 gap-8 text-left">
                        {[
                            { quote: "The most professional service I have experienced in Lusaka. The car was spotless.", name: "Sarah Jenkins", role: "CEO, Mining Corp" },
                            { quote: "Transparent pricing and great support when we needed to extend our trip.", name: "Michael Mbewe", role: "Entrepreneur" }
                        ].map((t, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-sm"
                            >
                                <p className="text-lg text-slate-300 italic mb-6">"{t.quote}"</p>
                                <div>
                                    <p className="font-bold text-white">{t.name}</p>
                                    <p className="text-sm text-green-400">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}