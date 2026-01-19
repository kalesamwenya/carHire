'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaChevronLeft, FaCheck, FaMinus, FaSpinner } from 'react-icons/fa';

export default function ComparePage() {
    const searchParams = useSearchParams();
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const ids = searchParams.get('ids');
    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        if (!ids) {
            setLoading(false);
            return;
        }

        const fetchSelectedCars = async () => {
            try {
                const res = await fetch(`${Public_Api}/cars/get-cars-by-ids.php?ids=${ids}`);
                const data = await res.json();
                
                // Map images just like your other components
                const mappedData = data.map(car => ({
                    ...car,
                    displayImage: car.image_url 
                        ? `${Public_Api}/public/${JSON.parse(car.image_url)[0].replace(/^\//, '')}` 
                        : '/placeholder-car.png'
                }));
                
                setCars(mappedData);
            } catch (error) {
                console.error("Comparison fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSelectedCars();
    }, [ids]);

    if (loading) return (
        <div className="h-screen flex items-center justify-center">
            <FaSpinner className="animate-spin text-green-600 text-4xl" />
        </div>
    );

    if (cars.length === 0) return (
        <div className="h-screen flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">No cars selected for comparison</h2>
            <Link href="/cars" className="text-green-600 font-bold underline">Go back to fleet</Link>
        </div>
    );

    return (
        <main className="min-h-screen bg-white py-20 px-6">
            <div className="max-w-7xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <Link href="/cars" className="flex items-center gap-2 text-gray-500 hover:text-black">
                        <FaChevronLeft size={12} /> Back to Fleet
                    </Link>
                    <h1 className="text-3xl font-black italic uppercase tracking-tighter">Compare Fleet</h1>
                    <div className="hidden md:block text-sm font-bold text-gray-400">EMIT PHOTOGRAPHY & RENTALS</div>
                </header>

                

                <div className="overflow-x-auto rounded-3xl border border-gray-100 shadow-sm">
                    <table className="w-full min-w-[800px] text-left">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="p-6 text-gray-400 font-medium">Model Details</th>
                                {cars.map(car => (
                                    <th key={car.id} className="p-6">
                                        <div className="relative h-32 w-48 mb-4">
                                            <Image src={car.displayImage} alt={car.name} fill className="object-contain" />
                                        </div>
                                        <h3 className="text-lg font-bold">{car.name}</h3>
                                        <p className="text-green-600 font-black text-sm">ZMW {car.price_per_day}/day</p>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            <ComparisonRow label="Transmission" field="transmission" items={cars} />
                            <ComparisonRow label="Fuel Type" field="fuel" items={cars} />
                            <ComparisonRow label="Seats" field="seats" items={cars} suffix=" People" />
                            <ComparisonRow label="AC System" field="has_ac" items={cars} isCheck />
                            {/* Action Row */}
                            <tr>
                                <td className="p-6 font-bold text-gray-400 uppercase text-xs">Finalize</td>
                                {cars.map(car => (
                                    <td key={`book-${car.id}`} className="p-6">
                                        <Link 
                                            href={`/booking?carId=${car.id}`}
                                            className="inline-block px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-green-600 transition-all text-sm"
                                        >
                                            Rent This
                                        </Link>
                                    </td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

// Helper component for rows
function ComparisonRow({ label, field, items, isCheck, suffix = "" }) {
    return (
        <tr>
            <td className="p-6 text-sm font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">{label}</td>
            {items.map(item => (
                <td key={item.id} className="p-6 text-gray-900 font-medium">
                    {isCheck ? (
                        item[field] == 1 ? <FaCheck className="text-green-500" /> : <FaMinus className="text-gray-300" />
                    ) : (
                        `${item[field]}${suffix}`
                    )}
                </td>
            ))}
        </tr>
    );
}