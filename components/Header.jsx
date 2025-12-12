'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaUser, FaCarSide, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
    const [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // 1. Detect Scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 2. Logic: Transparent only on Home Page AND not scrolled AND menu closed
    const isHome = pathname === '/';
    const isTransparent = isHome && !scrolled && !open;

    // Height Logic
    const headerHeight = isHome && !scrolled ? 'h-24' : 'h-20';

    const navLinks = [
        { name: 'Browse Fleet', href: '/cars' },
        { name: 'Book', href: '/booking' },
    ];

    return (
        <header
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ease-in-out ${
                isTransparent
                    ? 'bg-transparent' // Transparent background
                    : 'bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm' // White glass background
            }`}
        >
            <div className={`max-w-7xl mx-auto px-6 flex items-center justify-between transition-all duration-300 ${headerHeight}`}>

                {/* 1. BRAND LOGO */}
                <Link href="/" className="flex items-center gap-3 group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all ${
                        isTransparent ? 'bg-slate-900 text-green-500' : 'bg-slate-900 text-green-500'
                    }`}>
                        <FaCarSide className="text-xl" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight leading-none text-slate-900">
                            City<span className="text-green-600">Drive</span>
                        </h1>
                        <p className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                            Hire
                        </p>
                    </div>
                </Link>

                {/* 2. DESKTOP NAVIGATION */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className={`flex gap-1 p-1 rounded-full border transition-all ${
                        isTransparent
                            ? 'bg-white/40 border-white/50 backdrop-blur-sm shadow-sm' // Subtle background for menu on hero
                            : 'bg-gray-100/50 border-gray-200/50'
                    }`}>
                        {navLinks.map((link) => {
                            const isActive = pathname === link.href;
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                                        isActive
                                            ? 'bg-white text-green-600 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Auth Actions */}
                    <div className="pl-6 border-l border-gray-200">
                        {status === 'loading' ? (
                            <div className="w-28 h-10 bg-gray-100/50 rounded-full animate-pulse"></div>
                        ) : session ? (
                            // LOGGED IN STATE
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/dashboard"
                                    className="flex items-center gap-3 pl-1 pr-4 py-1.5 rounded-full border border-gray-200 bg-white hover:border-green-300 transition-all group shadow-sm"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-bold shadow-md">
                                        {session.user?.name?.[0] || <FaUser />}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold leading-none text-slate-900">
                                            {session.user?.name?.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] text-green-600 font-bold uppercase tracking-wide group-hover:underline">
                                            Dashboard
                                        </span>
                                    </div>
                                </Link>
                            </div>
                        ) : (
                            // LOGGED OUT STATE
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-bold px-3 py-2 transition-colors text-slate-600 hover:text-green-700"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-slate-900 text-white hover:bg-slate-800"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* 3. MOBILE MENU TOGGLE */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden p-2 rounded-xl transition-colors text-slate-600 hover:bg-gray-100"
                >
                    {open ? <FaTimes size={24} /> : <FaBars size={24} />}
                </button>
            </div>

            {/* 4. MOBILE DROPDOWN */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white overflow-hidden shadow-xl"
                    >
                        <div className="p-6 space-y-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    onClick={() => setOpen(false)}
                                    className={`block text-lg font-medium p-2 rounded-lg ${
                                        pathname === link.href ? 'bg-green-50 text-green-700' : 'text-slate-600'
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            <hr className="border-gray-100 my-2" />

                            {session ? (
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                        <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold">
                                            {session.user?.name?.[0]}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{session.user?.name}</p>
                                            <p className="text-xs text-slate-500">{session.user?.email}</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/dashboard"
                                        onClick={() => setOpen(false)}
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white rounded-xl font-bold"
                                    >
                                        <FaTachometerAlt /> Go to Dashboard
                                    </Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="flex items-center justify-center gap-2 w-full py-3 border border-red-200 text-red-600 rounded-xl font-bold"
                                    >
                                        <FaSignOutAlt /> Sign Out
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-4 pt-2">
                                    <Link
                                        href="/auth/signin"
                                        onClick={() => setOpen(false)}
                                        className="py-3 text-center border border-gray-200 text-slate-700 rounded-xl font-bold hover:bg-gray-50"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/auth/signup"
                                        onClick={() => setOpen(false)}
                                        className="py-3 text-center bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}