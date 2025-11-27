// components/Testimonials.jsx
import { FaStar, FaQuoteLeft, FaUserCircle } from 'react-icons/fa';

export default function Testimonials({ items } = {}) {
    
    // Improved default data with ratings and localized context
    const testimonials = items ?? [
        { 
            name: 'Chipo Zulu', 
            role: 'Local Resident', 
            text: 'I needed a car for a weekend trip to Livingstone. The RAV4 was in excellent condition and handled the road perfectly. Highly recommended!', 
            rating: 5,
            initials: 'CZ'
        },
        { 
            name: 'Sarah Jenkins', 
            role: 'Business Traveler', 
            text: 'The airport pickup in Lusaka was seamless. The driver was waiting for me, and the car was clean and fueled. Great service.', 
            rating: 5,
            initials: 'SJ'
        },
        { 
            name: 'Michael Banda', 
            role: 'Family Vacation', 
            text: 'Transparent pricing with no hidden costs. We rented a van for our family reunion and it was very spacious and affordable.', 
            rating: 4,
            initials: 'MB'
        }
    ];

    return (
        <section className="bg-gray-50 py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Trusted by drivers across Zambia
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        Don't just take our word for it. Here is what our community has to say about their journey with us.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <div 
                            key={index} 
                            className="relative bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full"
                        >
                            {/* Decorative Quote Icon (Background) */}
                            <div className="absolute top-4 right-6 text-green-100 text-6xl opacity-50 font-serif leading-none select-none">
                                <FaQuoteLeft />
                            </div>

                            {/* Star Rating */}
                            <div className="flex gap-1 text-yellow-400 mb-6 relative z-10">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar 
                                        key={i} 
                                        className={i < t.rating ? "fill-current" : "text-gray-200"} 
                                    />
                                ))}
                            </div>

                            {/* Review Text */}
                            <blockquote className="flex-grow text-gray-700 leading-relaxed relative z-10">
                                "{t.text}"
                            </blockquote>

                            {/* User Info (Footer) */}
                            <div className="mt-8 flex items-center gap-4 relative z-10 pt-6 border-t border-gray-100">
                                {/* Avatar Placeholder */}
                                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                                    {t.initials}
                                </div>
                                
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-sm text-gray-500">{t.role}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}