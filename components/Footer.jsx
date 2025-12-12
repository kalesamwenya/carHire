'use client';

import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaPaperPlane, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navigation = [
        { name: 'Browse Fleet', href: '/cars' },
        { name: 'About Us', href: '/about' },
        { name: 'Corporate Services', href: '/contact' },
        { name: 'User Reviews', href: '/feedback' },
    ];

    const legal = [
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Cookie Policy', href: '/privacy' },
    ];

    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-6">

                {/* Top Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

                    {/* 1. Brand Section */}
                    <div className="space-y-6">
                        <Link href="/" className="inline-block group">
                            <h1 className="text-2xl font-bold text-white tracking-tight">
                                City<span className="text-green-500">Drive</span>
                            </h1>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Hire</p>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">
                            Zambia's premier car rental service. We provide reliable, high-quality vehicles for corporate, leisure, and adventure travel.
                        </p>
                        <div className="flex gap-4">
                            <SocialIcon icon={<FaFacebook />} href="#" />
                            <SocialIcon icon={<FaTwitter />} href="#" />
                            <SocialIcon icon={<FaInstagram />} href="#" />
                            <SocialIcon icon={<FaLinkedin />} href="#" />
                        </div>
                    </div>

                    {/* 2. Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Explore</h4>
                        <ul className="space-y-3 text-sm">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="hover:text-green-500 transition-colors flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 bg-slate-700 rounded-full group-hover:bg-green-500 transition-colors"></span>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 3. Contact Info */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Contact</h4>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-green-500 shrink-0" />
                                <span>123 Independence Ave,<br />Lusaka, Zambia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-green-500 shrink-0" />
                                <a href="tel:0972338115" className="hover:text-white transition-colors">
                                    0972 338 115
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-green-500 shrink-0" />
                                <a href="mailto:info@citydrive.com" className="hover:text-white transition-colors">
                                    info@citydrive.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* 4. Newsletter */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Newsletter</h4>
                        <p className="text-xs text-slate-400 mb-4">Subscribe for latest offers and fleet updates.</p>
                        <form className="relative">
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-slate-800 text-white text-sm rounded-lg pl-4 pr-12 py-3 border border-slate-700 focus:border-green-500 outline-none transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
                                <FaPaperPlane className="text-xs" />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-800 my-8"></div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© {currentYear} City Drive Hire. All rights reserved.</p>

                    <div className="flex gap-6">
                        {legal.map((item) => (
                            <Link key={item.name} href={item.href} className="hover:text-white transition-colors">
                                {item.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Helper Component for Social Icons
function SocialIcon({ icon, href }) {
    return (
        <a
            href={href}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-green-600 hover:text-white transition-all duration-300 border border-slate-700 hover:border-green-600"
        >
            {icon}
        </a>
    );
}