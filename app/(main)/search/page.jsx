'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaTimes, FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaArrowRight, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import Link from 'next/link';
import CityDriveLoader from '@/components/CityDriveLoader';

// Component with the logic
function SearchContent() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get params from URL
  const location = searchParams.get('location') || 'Not Specified';
  const pickup = searchParams.get('pickup');
  const dropoff = searchParams.get('dropoff');

  // --- CONFIGURATION ---
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

  useEffect(() => {
    const fetchAvailability = async () => {
      if (!pickup || !dropoff) return;
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE}/cars/availability-check.php?pickup=${pickup}&dropoff=${dropoff}&location=${location}`
        );
        const data = await res.json();
        if (data.success) setResults(data.data);
      } catch (err) {
        console.error("Search fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [pickup, dropoff, location]);

  if (loading) {
    return <CityDriveLoader message="Searching available cars..." />;
  }

  return (
    <div className="min-h-screen bg-white mt-[5rem]">
      {/* Header matching your Modal Style */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
              <FaMapMarkerAlt className="text-green-600" /> Results for {location}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Dates: <span className="font-bold text-gray-800">{pickup}</span> to <span className="font-bold text-gray-800">{dropoff}</span>
            </p>
          </div>
          <Link href="/" className="p-3 bg-gray-50 hover:bg-red-50 rounded-full text-gray-400 hover:text-red-500 transition-all">
            <FaTimes size={24} />
          </Link>
        </div>
      </div>

      {/* Results Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {results.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-100">
                <FaCalendarAlt className="mx-auto text-4xl text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-400">No vehicles available for these dates.</h3>
                <Link href="/" className="text-green-600 font-bold mt-2 inline-block">Try different dates</Link>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {results.map((car) => {
                // FIXED: Robust Image Path Logic
                // This removes leading slashes and ensures public/ is only added if not present in the DB path
                const rawPath = car.image || car.image_url || "";
                const cleanPath = rawPath.replace(/^\/+/, "");
                const imageUrl = cleanPath.startsWith('/') 
                    ? `${API_BASE}/${cleanPath}` 
                    : `${API_BASE}/${cleanPath}`;

                return (
                    <div key={car.id} className="group border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 bg-white">
                        <div className="relative h-60 bg-gray-50 overflow-hidden">
                            <img 
                                src={imageUrl} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                                alt={car.name} 
                                onError={(e) => {
                                    e.target.src = "https://placehold.co/600x400/f3f4f6/374151?text=Vehicle+Image";
                                    e.target.onerror = null; 
                                }}
                            />
                            <div className={`absolute top-4 right-4 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest text-white shadow-lg ${car.is_available ? 'bg-green-600' : 'bg-red-500'}`}>
                                {car.is_available ? 'AVAILABLE' : 'BOOKED'}
                            </div>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-2xl font-black text-gray-900">{car.name}</h3>
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                    <FaImage size={14} />
                                </div>
                            </div>
                            <p className="text-green-700 text-lg font-black mb-6">ZMW {Number(car.price).toLocaleString()} <span className="text-gray-400 text-xs font-medium uppercase">/ day</span></p>
                            
                            <div className="grid grid-cols-3 gap-2 mb-8">
                                <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center gap-1">
                                    <FaCogs className="text-gray-400" />
                                    <span className="text-[9px] font-black uppercase text-gray-500">{car.transmission}</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center gap-1">
                                    <FaGasPump className="text-gray-400" />
                                    <span className="text-[9px] font-black uppercase text-gray-500">{car.fuel}</span>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-2xl flex flex-col items-center gap-1">
                                    <FaUsers className="text-gray-400" />
                                    <span className="text-[9px] font-black uppercase text-gray-500">{car.seats} Seats</span>
                                </div>
                            </div>

                            {car.is_available ? (
                                <Link href={`/booking?id=${car.id}&pickup=${pickup}&dropoff=${dropoff}`} className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-green-600 hover:shadow-xl transition-all active:scale-95">
                                    Book Now <FaArrowRight size={12} />
                                </Link>
                            ) : (
                                <Link href={`/reserve?id=${car.id}&after=${car.available_after}`} className="w-full block text-center border-2 border-gray-200 text-gray-400 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-gray-900 hover:text-gray-900 transition-all">
                                    Reserve for {car.available_after}
                                </Link>
                            )}
                        </div>
                    </div>
                );
            })}
            </div>
        )}
      </div>
      <p className="text-center pb-10 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
        Fleet managed by City Drive Hire • Support: 0972338115
      </p>
    </div>
  );
}

// Main Page Component with Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={
        <div className="h-screen flex items-center justify-center bg-white">
            <p className="font-black text-gray-200 animate-pulse"></p>
        </div>
    }>
      <SearchContent />
    </Suspense>
  );
}