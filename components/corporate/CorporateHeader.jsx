'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCarSide, FaArrowRight, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function CorporateHeader() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // 1. Define the pages where you want transparency
    const transparentRoutes = ['/about', '/feedback', '/contact', '/faq', '/terms', '/privacy'];

    // 2. Check if the current pathname exists in that array
    const isTransparentRoute = transparentRoutes.includes(pathname);

    // 2. Handle Scroll Effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 3. Final Logic
    const isTransparent = isTransparentRoute && !scrolled && !isOpen;

    // Height Logic: Taller when transparent (hero mode), shorter when sticky
    const headerHeight = isTransparent ? 'h-24' : 'h-20';

    const links = [
        { name: 'About', href: '/about' },
        { name: 'Reviews', href: '/feedback' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
                isTransparent
                    ? 'bg-transparent border-transparent'
                    : 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
            }`}
        >
            <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${headerHeight}`}>

                {/* LOGO */}
                <Link href="/" className="flex items-center gap-3 group z-50">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all ${
                        isTransparent ? 'bg-white text-slate-900' : 'bg-slate-900 text-green-500'
                    }`}>
                        <FaCarSide className="text-xl" />
                    </div>
                    <div>
                        <h1 className={`text-xl font-bold tracking-tight leading-none transition-colors ${
                            isTransparent ? 'text-white' : 'text-slate-900'
                        }`}>
                            City<span className={isTransparent ? 'text-green-400' : 'text-green-600'}>Drive</span>
                        </h1>
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${
                            isTransparent ? 'text-white/70' : 'text-slate-500'
                        }`}>
                            Hire
                        </p>
                    </div>
                </Link>

                {/* DESKTOP NAVIGATION */}
                <nav className="hidden md:flex items-center gap-8">
                    {links.map(link => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`text-sm font-medium transition-colors ${
                                pathname === link.href
                                    ? 'text-green-500 font-bold'
                                    : isTransparent
                                        ? 'text-white/90 hover:text-white'
                                        : 'text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>

                {/* ACTIONS (Desktop CTA + Mobile Toggle) */}
                <div className="flex items-center gap-4">

                    {/* Desktop CTA */}
                    <Link
                        href="/"
                        className={`hidden md:flex px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg items-center gap-2 ${
                            isTransparent
                                ? 'bg-white text-slate-900 hover:bg-green-50'
                                : 'bg-slate-900 text-white hover:bg-slate-800'
                        }`}
                    >
                        Book a Ride <FaArrowRight />
                    </Link>

                    {/* Mobile Hamburger Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`md:hidden p-2 text-2xl transition-colors z-50 rounded-xl ${
                            isTransparent && !isOpen
                                ? 'text-white hover:bg-white/10'
                                : 'text-slate-900 hover:bg-gray-100'
                        }`}
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
            </div>

            {/* MOBILE MENU DROPDOWN */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden shadow-xl"
                    >
                        <div className="p-6 space-y-4">
                            {links.map(link => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-lg font-medium p-2 rounded-lg ${
                                        pathname === link.href ? 'text-green-600 bg-green-50' : 'text-slate-600'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-gray-100 my-2" />
                            <Link
                                href="/"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg"
                            >
                                Book a Ride <FaArrowRight />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </header>
    );
}