'use client';

import { FaTimes, FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaCalendarAlt, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function SearchModal({ isOpen, onClose, results, pickup, dropoff }) {
    if (!isOpen) return null;

    const API_BASE = "http://api.citydrivehire.local";

    return (
        <div className="fixed inset-0 z-[100] bg-white overflow-y-auto animate-in fade-in zoom-in duration-300">
            {/* Header Area */}
            <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900">Available Fleet</h2>
                        <p className="text-sm text-gray-500 font-medium">
                            Showing results for <span className="text-green-600">{pickup}</span> to <span className="text-green-600">{dropoff}</span>
                        </p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-3 bg-gray-50 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-all shadow-sm"
                    >
                        <FaTimes size={24} />
                    </button>
                </div>
            </div>

            {/* Results Grid */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {results.map((car) => (
                        <div key={car.id} className={`group relative rounded-3xl border transition-all duration-300 ${
                            car.is_available 
                            ? 'bg-white border-gray-100 hover:shadow-2xl hover:shadow-green-100' 
                            : 'bg-gray-50 border-gray-200 opacity-80'
                        }`}>
                            
                            {/* Car Image */}
                            <div className="relative h-56 rounded-t-3xl overflow-hidden">
                                {car.image ? (
                                    <Image 
                                        src={`${API_BASE}/public/${car.image.replace(/^\/+/, "")}`} 
                                        alt={car.name} 
                                        fill 
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                                )}
                                
                                {/* Status Badge */}
                                <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${
                                    car.is_available ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                                }`}>
                                    {car.is_available ? 'Ready to Drive' : 'Currently Rented'}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{car.name}</h3>
                                <p className="text-green-600 font-black text-lg mb-4">
                                    ZMW {car.price} <span className="text-gray-400 text-xs font-normal">/ day</span>
                                </p>

                                <div className="flex items-center gap-4 py-4 border-t border-gray-50 mb-6">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <FaCogs className="text-green-500" /> {car.transmission}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <FaGasPump className="text-green-500" /> {car.fuel}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <FaUsers className="text-green-500" /> {car.seats} Seats
                                    </div>
                                </div>

                                {car.is_available ? (
                                    <Link 
                                        href={`/booking?carId=${car.id}&pickup=${pickup}&dropoff=${dropoff}`}
                                        className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all"
                                    >
                                        Book Now <FaArrowRight />
                                    </Link>
                                ) : (
                                    <div className="space-y-3">
                                        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                                            <FaCalendarAlt /> Available after {car.available_after}
                                        </div>
                                        <Link 
                                            href={`/reserve?carId=${car.id}&after=${car.available_after}`}
                                            className="flex items-center justify-center w-full border-2 border-gray-900 text-gray-900 py-3.5 rounded-2xl font-bold hover:bg-gray-900 hover:text-white transition-all"
                                        >
                                            Reserve for Later
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}