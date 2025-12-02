import Link from 'next/link';
import Image from 'next/image';
import { FaGasPump, FaCogs, FaUsers, FaDoorOpen, FaCheckCircle, FaChevronLeft, FaSnowflake, FaBluetooth, FaMapMarkedAlt } from 'react-icons/fa';
import ErrorCard from '../../../../components/ErrorCard';

async function getCar(id) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        const res = await fetch(`${baseUrl}/api/cars/${id}`, { 
            cache: 'no-store' 
        });
        
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error("Failed to fetch car:", error);
        return null;
    }
}

export default async function CarDetail({ params }) {
    const { id } = params;
    const car = await getCar(id);

    if (!car) {
        return (
            <main className="min-h-screen bg-gray-50 pt-12 px-4">
                <ErrorCard 
                    type="warning" 
                    title="Vehicle Not Found" 
                    message="The car you are looking for has been removed or does not exist." 
                    actions={
                        <Link href="/cars" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                            Browse Fleet
                        </Link>
                    }
                />
            </main>
        );
    }

    // Mock features if not present in DB
    const features = car.features || ['Air Conditioning', 'Bluetooth', 'GPS Navigation', 'USB Port', 'Reverse Camera'];

    return (
        <main className="bg-gray-50 min-h-screen py-10 px-6">
            <div className="max-w-6xl mx-auto">
                
                {/* Breadcrumb / Back Navigation */}
                <div className="mb-6">
                    <Link href="/cars" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 transition-colors font-medium">
                        <FaChevronLeft className="text-sm" /> Back to Fleet
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
                    
                    {/* LEFT COLUMN: Images */}
                    <div className="space-y-4">
                        <div className="relative h-80 sm:h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 bg-white">
                            {car.image ? (
                                <Image 
                                    src={car.image} 
                                    alt={car.name} 
                                    fill 
                                    className="object-cover"
                                    priority
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                                    No Image Available
                                </div>
                            )}
                            
                            {/* Status Badge Overlay */}
                            <div className={`absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm ${
                                car.available ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
                            }`}>
                                {car.available ? 'Available Now' : 'Currently Booked'}
                            </div>
                        </div>

                        {/* Thumbnail Grid (Mocked for visual effect since we only have 1 image) */}
                        <div className="grid grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="relative h-24 rounded-lg overflow-hidden border border-gray-200 cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                                    {car.image && <Image src={car.image} alt="Detail" fill className="object-cover" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Details */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="border-b border-gray-100 pb-6 mb-6">
                            <h1 className="text-3xl font-extrabold text-gray-900">{car.name}</h1>
                            <div className="mt-2 flex items-center justify-between">
                                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full font-semibold uppercase">
                                    {car.type || 'Standard'}
                                </span>
                                <div className="text-right">
                                    <span className="text-3xl font-bold text-green-700">ZMW {car.price}</span>
                                    <span className="text-gray-500 text-sm ml-1">/ day</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {car.description || 'This vehicle is perfect for your next trip. Reliable, fuel-efficient, and comfortable for both city driving and long-distance journeys.'}
                        </p>

                        {/* Key Specs Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaGasPump className="text-green-600 text-xl" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Fuel Type</p>
                                    <p className="font-semibold text-gray-900">{car.fuel}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaCogs className="text-green-600 text-xl" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Transmission</p>
                                    <p className="font-semibold text-gray-900">{car.transmission}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaUsers className="text-green-600 text-xl" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Capacity</p>
                                    <p className="font-semibold text-gray-900">{car.seats} People</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                <FaDoorOpen className="text-green-600 text-xl" />
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Doors</p>
                                    <p className="font-semibold text-gray-900">4 Doors</p>
                                </div>
                            </div>
                        </div>

                        {/* Feature List */}
                        <div className="mb-8">
                            <h3 className="font-bold text-gray-900 mb-4">Key Features</h3>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
                                {features.map((feature, idx) => (
                                    <li key={idx} className="flex items-center gap-2">
                                        <FaCheckCircle className="text-green-500 flex-shrink-0" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-100">
                            {car.available ? (
                                <Link 
                                    href={`/booking?carId=${car.id}`} 
                                    className="flex-1 bg-green-600 text-white text-center py-4 rounded-xl font-bold hover:bg-green-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    Book Now
                                </Link>
                            ) : (
                                <button disabled className="flex-1 bg-gray-200 text-gray-500 py-4 rounded-xl font-bold cursor-not-allowed">
                                    Currently Unavailable
                                </button>
                            )}
                            <Link 
                                href="/contact" 
                                className="px-8 py-4 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors text-center"
                            >
                                Contact Support
                            </Link>
                        </div>
                        <p className="text-center text-xs text-gray-400 mt-4">
                            Free cancellation up to 24 hours before pickup.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}