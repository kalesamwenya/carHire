// components/Benefits.jsx
import { FaWallet, FaCar, FaHeadset } from 'react-icons/fa';

export default function Benefits() {
    
    const benefits = [
        {
            title: 'Affordable Rates',
            description: 'Transparent pricing with absolutely no hidden fees or surprise charges.',
            icon: <FaWallet className="w-6 h-6" />
        },
        {
            title: 'Wide Selection',
            description: 'From compact sedans for city driving to spacious vans for family trips.',
            icon: <FaCar className="w-6 h-6" />
        },
        {
            title: '24/7 Support',
            description: 'Real human support via phone or chat whenever you need assistance.',
            icon: <FaHeadset className="w-6 h-6" />
        }
    ];

    return (
        <section className="py-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {benefits.map((benefit, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-300"
                    >
                        {/* Icon Bubble */}
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-4">
                            {benefit.icon}
                        </div>

                        {/* Text Content */}
                        <h4 className="text-lg font-bold text-gray-900 mb-2">
                            {benefit.title}
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {benefit.description}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}