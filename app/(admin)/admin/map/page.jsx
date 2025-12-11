'use client';

import { FaMapMarkerAlt, FaCarSide } from 'react-icons/fa';

export default function MapPage() {
    // Mock positions for visual demo
    const vehicles = [
        { id: 1, name: 'Toyota Hilux', lat: 'top-1/4', long: 'left-1/3', status: 'moving' },
        { id: 2, name: 'BMW X5', lat: 'bottom-1/3', long: 'right-1/4', status: 'stopped' },
        { id: 3, name: 'Suzuki Swift', lat: 'top-1/2', long: 'left-1/2', status: 'moving' },
    ];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            <div className="mb-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Live Fleet Tracking</h1>
                <div className="flex gap-2">
                    <span className="flex items-center text-xs text-gray-600"><div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> Moving</span>
                    <span className="flex items-center text-xs text-gray-600"><div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div> Stopped</span>
                </div>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full flex-1 bg-blue-50 rounded-xl overflow-hidden border border-blue-100 shadow-inner group">
                {/* Abstract Map Background Grid */}
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')] opacity-30"></div>
                <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 pointer-events-none">
                    {[...Array(72)].map((_, i) => (
                        <div key={i} className="border-r border-b border-blue-200/20"></div>
                    ))}
                </div>

                {/* Vehicle Pins */}
                {vehicles.map((v) => (
                    <div
                        key={v.id}
                        className={`absolute ${v.lat} ${v.long} transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer group-hover:scale-105 transition-transform`}
                    >
                        <div className={`p-2 rounded-full border-2 border-white shadow-lg ${v.status === 'moving' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                            <FaCarSide />
                        </div>
                        <div className="mt-1 px-2 py-0.5 bg-white/90 backdrop-blur text-xs font-bold rounded shadow text-gray-800 whitespace-nowrap">
                            {v.name}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}