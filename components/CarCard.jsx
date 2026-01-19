'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaGasPump, FaCogs, FaUsers, FaCheckCircle, FaChevronRight, FaPlus } from 'react-icons/fa';

export default function CarCard({ car, onCompare, isComparing }) {
    if (!car) return null;

    // Use the image URL provided by the server component (which already prepends the API domain)
    // Fallback to a local placeholder if nothing is found
    const thumbnail = car.image || '/placeholder-car.png';

    return (
        <article className="group relative bg-white rounded-[2.5rem] p-4 transition-all duration-500 hover:shadow-[0_22px_50px_-12px_rgba(0,0,0,0.05)] border border-transparent hover:border-gray-100">
            
            {/* Image Section */}
            <div className="relative h-64 w-full rounded-[2rem] overflow-hidden bg-[#F8F9FB]">
                <Image 
                    src={thumbnail} 
                    alt={car.name} 
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={false}
                />

                {/* Floating Compare Button */}
                <button 
                    onClick={(e) => { e.preventDefault(); onCompare(); }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md shadow-sm z-20 ${
                        isComparing 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/80 text-gray-400 hover:bg-white hover:text-blue-600'
                    }`}
                >
                    {isComparing ? <FaCheckCircle size={16} /> : <FaPlus size={16} />}
                </button>

                {/* Availability Badge */}
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-sm z-20">
                    <span className={`w-2 h-2 rounded-full animate-pulse ${car.available ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-700">
                        {car.available ? 'Available' : 'Booked'}
                    </span>
                </div>
            </div>

            {/* Content Body */}
            <div className="px-3 pt-6 pb-2">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 tracking-tight mb-1">
                            {car.name}
                        </h3>
                        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
                            {car.type || car.category || 'Executive'}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-black text-gray-900">ZMW {Number(car.price).toLocaleString()}</p>
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tighter">per day</p>
                    </div>
                </div>

                {/* Specs */}
                <div className="flex items-center justify-between py-4 mb-6">
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <FaCogs className="text-gray-300" size={14} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{car.transmission}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-100" />
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <FaGasPump className="text-gray-300" size={14} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{car.fuel}</span>
                    </div>
                    <div className="w-[1px] h-4 bg-gray-100" />
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <FaUsers className="text-gray-300" size={14} />
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{car.seats} Seats</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link 
                    href={`/cars/${car.id}`}
                    className="group/btn relative w-full h-14 bg-green-600 hover:bg-black text-white rounded-2xl flex items-center justify-center font-bold text-xs uppercase tracking-widest transition-all duration-300 overflow-hidden"
                >
                    <span className="relative z-10">Explore Vehicle</span>
                    <FaChevronRight className="absolute right-6 opacity-0 -translate-x-4 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all duration-300" />
                </Link>
            </div>
        </article>
    );
}