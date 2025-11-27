// components/Footer.jsx
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const navigation = [
        { name: 'Browse Cars', href: '/cars' },
        { name: 'Book a Car', href: '/booking' },
        { name: 'My Dashboard', href: '/dashboard' },
        { name: 'About Us', href: '/about' },
    ];

    const legal = [
        { name: 'Terms & Conditions', href: '/terms' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'FAQ', href: '/faq' },
    ];

    return (
        <footer className="bg-gray-50 pt-16 pb-8 border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    
                    {/* Brand & Description */}
                    <div className="space-y-4">
                        <Link href="/" className="text-2xl font-bold text-green-700 block">
                            CarHire
                        </Link>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            Reliable, affordable car rentals for every journey. 
                            Experience freedom with our premium fleet and 24/7 support.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <SocialIcon icon={<FaFacebook />} href="#" />
                            <SocialIcon icon={<FaTwitter />} href="#" />
                            <SocialIcon icon={<FaInstagram />} href="#" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Quick Navigation</h4>
                        <ul className="space-y-2 text-sm">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-600 hover:text-green-700 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li className="flex items-start gap-3">
                                <FaMapMarkerAlt className="mt-1 text-green-700 flex-shrink-0" />
                                <span>123 Lusaka Road,<br />Lusaka, Zambia</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaPhoneAlt className="text-green-700 flex-shrink-0" />
                                <a href="tel:+260123456789" className="hover:text-green-700 transition-colors">
                                    +260 12 345 6789
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <FaEnvelope className="text-green-700 flex-shrink-0" />
                                <a href="mailto:support@carhire.example" className="hover:text-green-700 transition-colors">
                                    support@carhire.example
                                </a>
                            </li>
                            <li className="flex items-start gap-3">
                                <FaClock className="mt-1 text-green-700 flex-shrink-0" />
                                <span>
                                    <span className="font-medium text-gray-900">Mon - Sun:</span> 06:00 - 22:00
                                </span>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-gray-900 font-semibold mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            {legal.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} className="text-gray-600 hover:text-green-700 transition-colors">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
                    <p>© {currentYear} CarHire. All rights reserved.</p>
                    <p>Built with care in Lusaka</p>
                </div>
            </div>
        </footer>
    );
}

// Small helper component for social icons
function SocialIcon({ icon, href }) {
    return (
        <a 
            href={href} 
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-green-700 hover:text-white hover:border-green-700 transition-all duration-200"
            aria-label="Social Link"
        >
            {icon}
        </a>
    );
}