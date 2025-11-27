'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function HeroSection() {
    const router = useRouter();
    const [location, setLocation] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');

    const handleSearch = (e) => {
        e?.preventDefault();
        const params = new URLSearchParams({ location, pickup, dropoff }).toString();
        router.push(`/cars?${params}`);
    };

    return (
        <section className="relative bg-white overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
            {/* Background Blob Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-50 blur-3xl opacity-70 z-0"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-70 z-0"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                
                {/* Left Content */}
                <div className="max-w-2xl">
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6">
                        <FaCheckCircle className="text-green-600" />
                        <span>Trusted by 5,000+ happy clients</span>
                    </div>
                    
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mb-6">
                        Drive your adventure <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-teal-600">
                            without limits.
                        </span>
                    </h1>
                    
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
                        Premium fleet, transparent daily rates, and flexible pickup options across Zambia. Your journey starts with the turn of a key.
                    </p>

                    {/* Modern Search Component */}
                    <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 relative">
                        <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                            
                            {/* Location Input */}
                            <div className="lg:col-span-4 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600">
                                    <FaMapMarkerAlt />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Pickup Location"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-800"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>

                            {/* Pickup Date */}
                            <div className="lg:col-span-3 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600">
                                    <FaCalendarAlt />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-600"
                                    value={pickup}
                                    onChange={(e) => setPickup(e.target.value)}
                                />
                            </div>

                            {/* Dropoff Date */}
                            <div className="lg:col-span-3 relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600">
                                    <FaCalendarAlt />
                                </div>
                                <input
                                    type="date"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm font-medium text-gray-600"
                                    value={dropoff}
                                    onChange={(e) => setDropoff(e.target.value)}
                                />
                            </div>

                            {/* Submit Button */}
                            <div className="lg:col-span-2">
                                <button type="submit" className="w-full h-full bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-green-200 flex items-center justify-center gap-2 py-3 lg:py-0">
                                    <FaSearch />
                                    <span className="lg:hidden">Search</span>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-sm font-medium text-gray-500">
                        <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500" /> No Hidden Fees</span>
                        <span className="flex items-center gap-1"><FaCheckCircle className="text-green-500" /> Free Cancellation</span>
                    </div>
                </div>

                {/* Right Image Area */}
                <div className="relative mt-12 lg:mt-0">
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                        <img
                            src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                            alt="Luxury SUV on the road"
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        
                        {/* Glassmorphism Floating Card */}
                        <div className="absolute bottom-6 left-6 right-6 backdrop-blur-md bg-white/80 border border-white/50 p-4 rounded-2xl shadow-lg flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-gray-900">Range Rover Sport</h3>
                                <div className="flex text-yellow-500 text-xs mt-1">
                                    <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
                                    <span className="text-gray-500 ml-1">(42 reviews)</span>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-500">Daily rate</p>
                                <p className="text-green-700 font-bold text-lg">ZMW 2,500</p>
                            </div>
                        </div>
                    </div>

                    {/* Decorative Element behind image */}
                    <div className="absolute -z-10 top-10 -right-10 w-24 h-24 bg-yellow-100 rounded-full blur-xl"></div>
                </div>

            </div>
        </section>
    );
}