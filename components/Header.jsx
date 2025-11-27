'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    // Centralized links configuration
    const navLinks = [
        { name: 'Cars', href: '/cars' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' },
    ];

    return (
        // Added sticky top-0 and z-50 to keep header visible on scroll
        <header className="sticky top-0 z-50 bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-xl font-bold text-green-700 tracking-tight">
                    CarHire
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex gap-8 items-center text-sm font-medium">
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
                    
                    {/* CTA Button separated from standard links */}
                    <Link 
                        href="/dashboard" 
                        className="px-4 py-2 bg-green-700 text-white rounded-md text-sm hover:bg-green-800 transition-colors shadow-sm"
                    >
                        Dashboard
                    </Link>
                </nav>

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
                        <Link 
                            href="/dashboard" 
                            onClick={() => setOpen(false)}
                            className="block text-center px-4 py-2 bg-green-700 text-white rounded text-sm hover:bg-green-800"
                        >
                            Dashboard
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}