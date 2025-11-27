import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import CarCard from '../components/CarCard';

// Fetch data directly in the Server Component
async function getFeaturedCars() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/cars?limit=3&featured=true`, { 
            cache: 'no-store' // Ensure fresh data, or use 'force-cache' with revalidation
        });
        
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch featured cars:", error);
        return [];
    }
}

export default async function HomePage() {
    const featuredCars = await getFeaturedCars();

    return (
        <main className="bg-white min-h-screen">
            
            {/* 1. Hero Section (Search & Impact) */}
            <HeroSection />

            {/* 2. Brand Logos / Trust Bar (Optional visual separator) */}
            <div className="border-b border-gray-100 bg-gray-50/50 py-8">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">
                        Trusted by companies like
                    </p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos - replace with SVGs or Images */}
                        <span className="text-xl font-bold text-gray-600">TravelCo</span>
                        <span className="text-xl font-bold text-gray-600">ZambiaTours</span>
                        <span className="text-xl font-bold text-gray-600">SafariX</span>
                        <span className="text-xl font-bold text-gray-600">CorpDrive</span>
                    </div>
                </div>
            </div>

            {/* 3. Popular Fleet Section */}
            <section className="py-20 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Popular Rentals</h2>
                        <p className="mt-2 text-gray-600 max-w-lg">
                            Our most booked vehicles this month. Reliable, fuel-efficient, and ready for the road.
                        </p>
                    </div>
                    <Link 
                        href="/cars" 
                        className="group flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors"
                    >
                        View Full Fleet <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {featuredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {featuredCars.map((car) => (
                            // We don't pass onCompare here since it's the home page. 
                            // The CarCard will render the button but clicking it won't do anything, 
                            // or we can wrap this in a Client Component if we really need Compare functionality here.
                            <CarCard key={car.id} car={car} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">Our fleet is currently being updated. Check back soon!</p>
                    </div>
                )}
            </section>

            {/* 4. Features Section */}
            <Features 
                title="Experience the Difference"
                subtitle="We don't just rent cars; we provide the freedom to explore Zambia with confidence."
            />

            {/* 5. How It Works (Steps) */}
            <section className="bg-gray-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold">Rent in 3 Easy Steps</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
                        {/* Connecting Line (Desktop) */}
                        <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-gray-700 -z-0"></div>

                        {/* Step 1 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-8 border-gray-800 shadow-xl">
                                1
                            </div>
                            <h3 className="text-xl font-bold mb-2">Book Online</h3>
                            <p className="text-gray-400">Choose your car, dates, and pickup location using our simple search tool.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-8 border-gray-700 shadow-xl">
                                2
                            </div>
                            <h3 className="text-xl font-bold mb-2">Pick Up</h3>
                            <p className="text-gray-400">Meet us at the airport or our Lusaka office. We'll hand over the keys in minutes.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-6 border-8 border-gray-700 shadow-xl">
                                3
                            </div>
                            <h3 className="text-xl font-bold mb-2">Drive Away</h3>
                            <p className="text-gray-400">Enjoy your trip! Our 24/7 support team is just a phone call away if you need us.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. Testimonials */}
            <Testimonials />

            {/* 7. Final CTA */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto bg-green-700 rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for your next adventure?</h2>
                        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
                            Don't wait until the last minute. Secure your vehicle today and get the best rates for your trip.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link 
                                href="/cars" 
                                className="px-8 py-4 bg-white text-green-800 font-bold rounded-xl hover:bg-green-50 transition-colors shadow-lg"
                            >
                                Browse Available Cars
                            </Link>
                            <Link 
                                href="/contact" 
                                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}