import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import PopularRentalsClient from './PopularRentalsClient';

async function getFeaturedCars() {
    // Note: Update this to your production domain when you go live
    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com"; 
    
    try {
        const res = await fetch(`${Public_Api}/cars/get-cars.php`, { cache: 'no-store' });
        if (!res.ok) return [];
        
        const rawCars = await res.json();
        
        // Take top 3 and fix image paths
        return rawCars.slice(0, 3).map(car => {
            let fullImageUrl = null;
            
            if (car.image) {
                // Remove leading slash if it exists to avoid // in URL
                const cleanImagePath = car.image.startsWith('/') ? car.image.substring(1) : car.image;
                fullImageUrl = `${Public_Api}/${cleanImagePath}`;
            }

            return {
                ...car,
                image: fullImageUrl
            };
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        return [];
    }
}

export default async function PopularRentals() {
    const featuredCars = await getFeaturedCars();

    return (
       <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Popular Rentals</h2>
                    <p className="mt-2 text-gray-600 max-w-lg">
                        Explore the Emit Photography fleet favorites. Reliable, fuel-efficient, and ready for the road.
                    </p>
                </div>
                <Link href="/cars" className="group flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors">
                    View Full Fleet <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <PopularRentalsClient initialCars={featuredCars} />
        </section>
    );
}