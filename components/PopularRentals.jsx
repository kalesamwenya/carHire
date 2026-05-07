import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { Suspense } from 'react';
import PopularRentalsClient from './PopularRentalsClient';

// --- SKELETON COMPONENT ---
function RentalSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
                    <div className="h-64 bg-gray-200 w-full" /> {/* Image Area */}
                    <div className="p-6 space-y-4">
                        <div className="flex justify-between">
                            <div className="h-6 bg-gray-200 rounded w-1/2" />
                            <div className="h-6 bg-gray-200 rounded w-1/4" />
                        </div>
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-full" />
                            <div className="h-4 bg-gray-200 rounded w-5/6" />
                        </div>
                        <div className="pt-4 flex gap-4">
                            <div className="h-10 bg-gray-200 rounded-xl flex-1" />
                            <div className="h-10 bg-gray-200 rounded-xl w-1/4" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

// --- DATA FETCHING COMPONENT ---
async function PopularRentalsContent() {
    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com"; 
    
    try {
        const res = await fetch(`${Public_Api}/cars/get-cars.php`, { cache: 'no-store' });
        if (!res.ok) return <p className="text-center text-gray-500">Fleet temporarily unavailable.</p>;
        
        const rawCars = await res.json();
        const featuredCars = rawCars.slice(0, 3).map(car => {
            let fullImageUrl = null;
            if (car.image) {
                const cleanImagePath = car.image.startsWith('/') ? car.image.substring(1) : car.image;
                fullImageUrl = `${Public_Api}/${cleanImagePath}`;
            }
            return { ...car, image: fullImageUrl };
        });

        return <PopularRentalsClient initialCars={featuredCars} />;
    } catch (error) {
        console.error("Fetch Error:", error);
        return <p className="text-center text-gray-500">Error loading rentals.</p>;
    }
}

// --- MAIN EXPORT ---
export default function PopularRentals() {
    return (
        <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Popular Rentals</h2>
                    <p className="mt-2 text-gray-600 max-w-lg">
                        Explore the City Drive fleet favorites. Reliable, fuel-efficient, and ready for the road.
                    </p>
                </div>
                <Link href="/cars" className="group flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors">
                    View Full Fleet <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {/* Suspense handles the loading state while the async data component resolves */}
            <Suspense fallback={<RentalSkeleton />}>
                <PopularRentalsContent />
            </Suspense>
        </section>
    );
}