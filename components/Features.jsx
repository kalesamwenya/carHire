// components/Features.jsx
import { FaCar, FaWallet, FaHeadset, FaShieldAlt } from 'react-icons/fa';

export default function Features({ title, subtitle, items } = {}) {
    
    // Default content if no props are passed
    const defaultTitle = "Why Choose CarHire?";
    const defaultSubtitle = "We make renting a car simple, fast, and transparent. Here is what sets us apart from the competition.";
    
    const defaultFeatures = [
        {
            title: 'Wide Selection',
            description: 'From economy sedans to luxury SUVs and spacious vans. We have the perfect vehicle for any occasion.',
            icon: <FaCar className="w-6 h-6" />
        },
        {
            title: 'Transparent Pricing',
            description: 'No hidden fees or surprise charges at the counter. What you see on the booking page is what you pay.',
            icon: <FaWallet className="w-6 h-6" />
        },
        {
            title: '24/7 Support',
            description: 'Real humans are ready to help you anytime via phone, chat, or email. Roadside assistance included.',
            icon: <FaHeadset className="w-6 h-6" />
        },
        {
            title: 'Fully Insured',
            description: 'Drive with total peace of mind knowing all our vehicles come with comprehensive insurance coverage.',
            icon: <FaShieldAlt className="w-6 h-6" />
        }
    ];

    const displayFeatures = items || defaultFeatures;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {title || defaultTitle}
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">
                        {subtitle || defaultSubtitle}
                    </p>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {displayFeatures.map((feature, index) => (
                        <div 
                            key={index} 
                            className="group relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
                        >
                            <div className="inline-flex items-center justify-center p-3 bg-green-50 text-green-700 rounded-xl mb-5 group-hover:bg-green-600 group-hover:text-white transition-colors duration-300">
                                {feature.icon}
                            </div>
                            
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {feature.title}
                            </h3>
                            
                            <p className="text-sm text-gray-500 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}