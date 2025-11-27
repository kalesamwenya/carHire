// components/CarCard.jsx
'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FaGasPump, FaCogs, FaCarSide, FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function CarCard({ car, onCompare }) {
    // Fallback if data is missing
    if (!car) return null;

    return (
        <article className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
            
            {/* Image Container with Overlay Badge */}
            <div className="relative h-56 w-full bg-gray-100 overflow-hidden">
                {/* Badge: Category */}
                <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm uppercase tracking-wider">
                    {car.type || 'Sedan'}
                </div>

                {/* Badge: Availability Status */}
                <div className={`absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm flex items-center gap-1 ${
                    car.available ? 'bg-green-600' : 'bg-gray-500'
                }`}>
                    {car.available ? (
                        <><FaCheckCircle /> Available</>
                    ) : (
                        <><FaTimesCircle /> Booked</>
                    )}
                </div>

                {/* Next.js Image Optimization */}
                {car.image ? (
                    <Image 
                        src={car.image} 
                        alt={car.name} 
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-200">
                        <FaCarSide className="text-4xl" />
                    </div>
                )}
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-grow">
                
                {/* Title & Price */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-green-700 transition-colors">
                            {car.name}
                        </h3>
                        <p className="text-sm text-gray-500">or similar</p>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-green-700">
                            ZMW {car.price}
                        </div>
                        <div className="text-xs text-gray-400 font-medium">per day</div>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm text-gray-600 mb-6 bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <FaCogs className="text-green-600" />
                        <span>{car.transmission || 'Auto'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaGasPump className="text-green-600" />
                        <span>{car.fuel || 'Petrol'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaUsers className="text-green-600" />
                        <span>{car.seats || 5} Seats</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaCarSide className="text-green-600" />
                        <span>{car.doors || 4} Doors</span>
                    </div>
                </div>

                {/* Actions Footer */}
                <div className="mt-auto flex gap-3">
                    <button 
                        onClick={onCompare} 
                        className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors text-sm"
                    >
                        Compare
                    </button>
                    
                    {car.available ? (
                        <Link 
                            href={`/booking?carId=${car.id}`} 
                            className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all text-center text-sm"
                        >
                            Book Now
                        </Link>
                    ) : (
                        <button 
                            disabled 
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-400 rounded-lg font-bold cursor-not-allowed text-sm"
                        >
                            Unavailable
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}