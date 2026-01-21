'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    FaCar, FaUserFriends, FaGasPump, FaWrench, 
    FaExclamationTriangle, FaCheckCircle, FaTools 
} from 'react-icons/fa';
import CityDriveLoader from '@/components/CityDriveLoader';

export default function StatisticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Replace with your actual local API URL
                const res = await axios.get(`${BASE_API}/reports/get_fleet_stats.php`);
                setStats(res.data);
            } catch (err) {
                console.error("Stats Fetch Error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <CityDriveLoader message="Gathering Fleet Intelligence"/>;
    
    // ERROR PROTECTION: Fallback to empty arrays if data is missing
    const categories = stats?.categories || [];
    const healthData = stats?.vehicleHealth || [];
    const demo = stats?.demo || { local: 0, int: 0, corp: 0 };
    const metrics = stats?.metrics || { dist: 0, fuel: 0, eff: 0, topCar: 'N/A' };

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            <h1 className="text-2xl font-bold text-gray-800">Fleet & User Statistics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* FLEET COMPOSITION */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaCar className="text-gray-400" /> Fleet Composition
                    </h3>
                    <div className="space-y-5">
                        {categories.length > 0 ? categories.map((cat) => (
                            <div key={cat.name}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                    <span className="text-gray-500">{cat.count} vehicles ({cat.percentage}%)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        style={{ width: `${cat.percentage}%` }} 
                                        className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                                    ></div>
                                </div>
                            </div>
                        )) : <p className="text-gray-400 italic text-sm">No category data available</p>}
                    </div>
                </div>

                {/* USER DEMOGRAPHICS */}
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaUserFriends className="text-gray-400" /> Customer Demographics
                    </h3>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-8 py-4">
                        <div className="relative w-40 h-40 rounded-full shadow-inner"
                             style={{ background: `conic-gradient(#3b82f6 0% ${demo.local}%, #ec4899 ${demo.local}% ${demo.local + demo.int}%, #fbbf24 ${demo.local + demo.int}% 100%)` }}>
                            <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                                <span className="text-3xl font-bold text-gray-800">{((stats?.totalUsers || 0) / 1000).toFixed(1)}k</span>
                                <span className="text-xs text-gray-400 uppercase font-bold">Users</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <LegendItem color="bg-blue-500" label="Local" val={demo.local} />
                            <LegendItem color="bg-pink-500" label="International" val={demo.int} />
                            <LegendItem color="bg-yellow-400" label="Corporate" val={demo.corp} />
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: VEHICLE HEALTH SECTION */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaWrench className="text-gray-400" /> Maintenance Watchlist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {healthData.map((car, idx) => (
                        <div key={idx} className={`p-4 rounded-lg border flex flex-col justify-between ${car.status === 'Critical' ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-500">{car.plate}</p>
                                    <p className="font-bold text-gray-800">{car.model}</p>
                                </div>
                                {car.status === 'Critical' ? <FaExclamationTriangle className="text-red-500" /> : <FaCheckCircle className="text-green-500" />}
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] font-bold text-gray-500 mb-1">
                                    <span>SERVICE IN</span>
                                    <span>{car.kmLeft} KM</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-1.5 overflow-hidden">
                                    <div 
                                        style={{ width: `${car.health}%` }} 
                                        className={`h-full ${car.status === 'Critical' ? 'bg-red-500' : 'bg-green-500'}`}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center p-4 text-gray-400 hover:bg-gray-50 transition-colors">
                        <FaTools className="mb-2" />
                        <span className="text-xs font-bold uppercase">Schedule All</span>
                    </button>
                </div>
            </div>

            {/* FUEL & METRICS */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                    <StatBox label="Total Distance" val={metrics.dist} unit="km" />
                    <StatBox label="Fuel Consumed" val={metrics.fuel} unit="L" />
                    <StatBox label="Avg. Efficiency" val={metrics.eff} unit="km/L" />
                    <div className="py-2">
                        <p className="text-xs text-gray-400 font-bold uppercase mb-1">Peak Utilization</p>
                        <p className="text-lg font-bold text-blue-600">{metrics.topCar}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LegendItem({ color, label, val }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <div className={`w-3 h-3 ${color} rounded-full`}></div>
            <span className="text-gray-600 font-medium">{label} ({val}%)</span>
        </div>
    );
}

function StatBox({ label, val, unit }) {
    return (
        <div className="py-2">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">{label}</p>
            <p className="text-2xl font-extrabold text-gray-900">{val.toLocaleString()} <span className="text-sm font-normal text-gray-400">{unit}</span></p>
        </div>
    );
}