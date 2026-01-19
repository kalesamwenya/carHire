'use client';

import { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaStar } from 'react-icons/fa';
import SearchModal from './SearchModal';

// Ensure this matches your local WAMP server URL
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

export default function HeroSection() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [location, setLocation] = useState('');
    const [pickup, setPickup] = useState('');
    const [dropoff, setDropoff] = useState('');
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = async (e) => {
        // 1. Prevent the default form submission (stops the redirect/reload)
        e?.preventDefault();

        // 2. Validation
        if (!pickup || !dropoff) {
            alert("Please select both Pickup and Dropoff dates.");
            return;
        }

        setIsSearching(true);

        try {
            // 3. Fetch from your availability-check.php
            const response = await fetch(
                `${API_BASE}/cars/availability-check.php?pickup=${pickup}&dropoff=${dropoff}&location=${location}`
            );
            const result = await response.json();

            if (result.success) {
                setSearchResults(result.data);
                // 4. Trigger the Modal instead of router.push
                setIsModalOpen(true);
                document.body.style.overflow = 'hidden'; // Stop background scrolling
            } else {
                alert(result.message || "Failed to fetch availability.");
            }
        } catch (err) {
            console.error("Search failed:", err);
            alert("Connection to server failed.");
        } finally {
            setIsSearching(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // Re-enable background scrolling
    };

    return (
        <>
            <section className="relative bg-white overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-28">
                {/* Background Blobs (keeping your design) */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-green-50 blur-3xl opacity-70 z-0"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 rounded-full bg-blue-50 blur-3xl opacity-70 z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    
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
                            Premium fleet, transparent daily rates, and flexible pickup options across Zambia.
                        </p>

                        {/* Form handles the action */}
                        <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 relative">
                            <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
                                <div className="lg:col-span-4 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-green-600">
                                        <FaMapMarkerAlt />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Pickup Location"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-green-500 outline-none transition-all text-sm font-medium"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                </div>

                                <div className="lg:col-span-3 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaCalendarAlt />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        value={pickup}
                                        onChange={(e) => setPickup(e.target.value)}
                                    />
                                </div>

                                <div className="lg:col-span-3 relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                        <FaCalendarAlt />
                                    </div>
                                    <input
                                        type="date"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm"
                                        value={dropoff}
                                        onChange={(e) => setDropoff(e.target.value)}
                                    />
                                </div>

                                <div className="lg:col-span-2">
                                    <button 
                                        type="submit" 
                                        disabled={isSearching}
                                        className="w-full h-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 py-3 lg:py-0"
                                    >
                                        <FaSearch />
                                        <span>{isSearching ? '...' : 'Search'}</span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right side Image (as per your design) */}
                    <div className="relative mt-12 lg:mt-0">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                alt="Luxury SUV"
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>
            
            {/* The Modal triggers here */}
            <SearchModal
                isOpen={isModalOpen}
                onClose={closeModal}
                results={searchResults}
                pickup={pickup}
                dropoff={dropoff}
            />
        </>
    );
}