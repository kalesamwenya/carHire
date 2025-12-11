'use client';

import { FaCar, FaUserFriends, FaGasPump } from 'react-icons/fa';

export default function StatisticsPage() {

    const carCategories = [
        { name: 'SUVs & 4x4', count: 8, total: 20, color: 'bg-green-500' },
        { name: 'Luxury Sedans', count: 4, total: 20, color: 'bg-purple-500' },
        { name: 'Economy', count: 6, total: 20, color: 'bg-blue-500' },
        { name: 'Vans / Bus', count: 2, total: 20, color: 'bg-orange-500' },
    ];

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Fleet & User Statistics</h1>

            {/* TOP ROW: CATEGORY DISTRIBUTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* FLEET COMPOSITION CARD */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaCar className="text-gray-400" /> Fleet Composition
                    </h3>
                    <div className="space-y-5">
                        {carCategories.map((cat) => {
                            const percentage = (cat.count / cat.total) * 100;
                            return (
                                <div key={cat.name}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="font-medium text-gray-700">{cat.name}</span>
                                        <span className="text-gray-500">{cat.count} vehicles ({percentage}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                        <div style={{ width: `${percentage}%` }} className={`h-full ${cat.color} rounded-full`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-sm text-gray-500">Total Fleet Size</span>
                        <span className="text-2xl font-bold text-gray-900">20</span>
                    </div>
                </div>

                {/* USER DEMOGRAPHICS CARD */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaUserFriends className="text-gray-400" /> Customer Demographics
                    </h3>

                    <div className="flex items-center justify-center gap-8 py-4">
                        {/* Circle Chart Simulation using Conic Gradient */}
                        <div className="relative w-40 h-40 rounded-full"
                             style={{ background: 'conic-gradient(#3b82f6 0% 55%, #ec4899 55% 85%, #fbbf24 85% 100%)' }}>
                            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                                <span className="text-3xl font-bold text-gray-800">1.2k</span>
                                <span className="text-xs text-gray-400 uppercase font-bold">Users</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                <span className="text-gray-600">Local Residents (55%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                                <span className="text-gray-600">International Tourists (30%)</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                <span className="text-gray-600">Corporate Partners (15%)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* BOTTOM ROW: FUEL & MILEAGE */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaGasPump className="text-gray-400" /> Fuel & Mileage Stats
                    </h3>
                    <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">October 2025</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <div className="py-2">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Total Distance</p>
                        <p className="text-2xl font-extrabold text-gray-900">12,450 <span className="text-sm font-normal text-gray-400">km</span></p>
                    </div>
                    <div className="py-2">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Fuel Consumed</p>
                        <p className="text-2xl font-extrabold text-gray-900">1,850 <span className="text-sm font-normal text-gray-400">L</span></p>
                    </div>
                    <div className="py-2">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Avg. Cost / km</p>
                        <p className="text-2xl font-extrabold text-gray-900">$0.45</p>
                    </div>
                    <div className="py-2">
                        <p className="text-xs text-gray-500 font-bold uppercase mb-1">Most Driven</p>
                        <p className="text-lg font-bold text-green-600">Toyota Hilux</p>
                        <p className="text-xs text-gray-400">ABZ 1234</p>
                    </div>
                </div>
            </div>

        </div>
    );
}