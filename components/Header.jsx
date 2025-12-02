'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useSession } from 'next-auth/react';

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const { data: session, status } = useSession();

    // Centralized links configuration
    const navLinks = [
        { name: 'Cars', href: '/cars' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        // Added sticky top-0 and z-50 to keep header visible on scroll
        <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-green-700 tracking-tight flex items-center gap-2">
                    CarHire
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <nav className="flex gap-6 text-sm font-medium">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`transition-colors duration-200 ${
                                    pathname === link.href
                                        ? 'text-green-700'
                                        : 'text-gray-600 hover:text-green-700'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Actions (Desktop) */}
                    <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                        {status === 'loading' ? (
                            <div className="w-24 h-8 bg-gray-100 rounded animate-pulse"></div>
                        ) : session ? (
                            <Link
                                href="/dashboard"
                                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full border border-gray-200 hover:border-green-600 hover:bg-green-50 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">
                                    {session.user?.name?.[0] || <FaUser size={12} />}
                                </div>
                                <span className="text-sm font-medium text-gray-700 group-hover:text-green-800">
                                    {session.user?.name?.split(' ')[0] || 'Dashboard'}
                                </span>
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href="/auth/signin"
                                    className="text-sm font-medium text-gray-600 hover:text-green-700 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/auth/signup"
                                    className="px-4 py-2 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800 transition-colors shadow-sm"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden p-2 text-gray-600 rounded hover:bg-gray-100 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {open ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {open && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white border-b shadow-lg z-40">
                    <div className="px-6 py-4 flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setOpen(false)}
                                className={`block text-sm font-medium ${
                                    pathname === link.href
                                        ? 'text-green-700'
                                        : 'text-gray-600'
                                }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <hr className="border-gray-100" />

                        {/* Mobile Auth Actions */}
                        {session ? (
                            <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg"
                            >
                                <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold">
                                    {session.user?.name?.[0] || 'U'}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{session.user?.name}</p>
                                    <p className="text-xs text-green-600">Go to Dashboard</p>
                                </div>
                            </Link>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link
                                    href="/signin"
                                    onClick={() => setOpen(false)}
                                    className="block text-center px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/signup"
                                    onClick={() => setOpen(false)}
                                    className="block text-center px-4 py-2.5 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}