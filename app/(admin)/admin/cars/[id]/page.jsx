'use client';

import Link from 'next/link';
import { FaEdit, FaTrash, FaArrowLeft, FaGasPump, FaCogs, FaUsers, FaCalendarAlt, FaHistory } from 'react-icons/fa';

export default function CarDetailsPage({ params }) {
    // const { id } = params;

    // Mock Data
    const car = {
        id: '1',
        name: 'Toyota Hilux 2.8 GD-6',
        plate: 'ABZ 1234',
        category: 'SUV / 4x4',
        status: 'Available',
        price: 120,
        image: '/images/hilux.jpg', // Placeholder
        specs: { fuel: 'Diesel', transmission: 'Automatic', seats: 5, mileage: '45,000 km' }
    };

    return (
        <div className="space-y-6">

            {/* Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{car.name}</h1>
                        <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">{car.plate}</span>
                            <span className="text-green-600 bg-green-50 px-2 py-0.5 rounded font-bold border border-green-100">{car.status}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/admin/cars/${car.id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-bold">
                        <FaEdit /> Edit
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-bold">
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT: Image & Key Specs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Hero Image Area */}
                    <div className="h-64 bg-gray-200 rounded-xl overflow-hidden flex items-center justify-center relative group">
                        <span className="text-gray-400 font-bold text-lg">Vehicle Image Placeholder</span>
                        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-lg text-sm font-bold">
                            ${car.price} / day
                        </div>
                    </div>

                    {/* Spec Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaGasPump className="text-blue-500 mx-auto text-xl mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Fuel</p>
                            <p className="font-bold text-gray-800">{car.specs.fuel}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaCogs className="text-gray-500 mx-auto text-xl mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Gearbox</p>
                            <p className="font-bold text-gray-800">{car.specs.transmission}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaUsers className="text-purple-500 mx-auto text-xl mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Seats</p>
                            <p className="font-bold text-gray-800">{car.specs.seats} Persons</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaHistory className="text-green-500 mx-auto text-xl mb-2" />
                            <p className="text-xs text-gray-400 uppercase font-bold">Mileage</p>
                            <p className="font-bold text-gray-800">{car.specs.mileage}</p>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Status & History */}
                <div className="space-y-6">

                    {/* Quick Stats */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Total Trips</span>
                                <span className="font-bold text-gray-900">45</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Total Revenue</span>
                                <span className="font-bold text-green-600">$5,400</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Next Service</span>
                                <span className="font-bold text-orange-600">in 5,000 km</span>
                            </div>
                        </div>
                    </div>

                    {/* Recent Trips */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" /> Recent Trips
                        </h3>
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center gap-3 text-sm">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs font-bold">
                                        #
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">John Doe</p>
                                        <p className="text-xs text-gray-400">Oct 12 - Oct 15</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50">View All History</button>
                    </div>

                </div>
            </div>
        </div>
    );
}