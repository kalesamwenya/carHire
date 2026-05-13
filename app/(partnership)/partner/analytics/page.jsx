'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import {
    FaChartBar,
    FaChartLine,
    FaSpinner,
    FaCar,
    FaArrowUp
} from 'react-icons/fa';
import axios from 'axios';
import CityDriveLoader from '@/components/CityDriveLoader';

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

export default function AnalyticsPage() {
    const { data: session } = useSession();
    const [data, setData] = useState({ revenue: [], utilization: [] });
    const [stats, setStats] = useState({
        totalRevenue: 0,
        avgUtilization: 0,
        totalBookings: 0,
        activeVehicles: 0
    });
    const [loading, setLoading] = useState(true);

    const partnerId = session?.user?.id;

   useEffect(() => {
    if (!partnerId) return;

    const fetchAnalytics = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${BASE_API}/partners/get-analytics.php?partner_id=${partnerId}`,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.token}`
                    }
                }
            );

            if (res.data.success) {
                setData({
                    revenue: res.data.revenue || [],
                    utilization: res.data.utilization || []
                });

                setStats({
                    totalRevenue: Number(res.data.stats?.total_revenue || 0),
                    avgUtilization: Number(res.data.stats?.avg_utilization || 0),
                    totalBookings: Number(res.data.stats?.total_bookings || 0),
                    activeVehicles: Number(res.data.stats?.active_vehicles || 0)
                });
            }

        } catch (err) {
            console.error("Analytics fetch error", err);
        } finally {
            setLoading(false);
        }
    };

    fetchAnalytics();

}, [partnerId]); // ✅ FIXED


    // Use useMemo for calculation to prevent jitter on re-renders
    const maxRev = useMemo(() => {
        const values = data.revenue.map(r => Number(r.total));
        return Math.max(...values, 1);
    }, [data.revenue]);

    if (loading) {
        return (
            <CityDriveLoader message="Loading your performance analytics..." />
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* HEADER */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Performance Analytics</h1>
                <p className="text-gray-500 mt-1">Real-time insights for CityDrive Partners.</p>
            </div>

            {/* STATS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <StatCard title="Total Revenue" value={`ZMW ${stats.totalRevenue.toLocaleString()}`} icon={<FaChartBar />} color="green" />
                <StatCard title="Avg Utilization" value={`${stats.avgUtilization}%`} icon={<FaChartLine />} color="blue" />
                <StatCard title="Total Bookings" value={stats.totalBookings} icon={<FaArrowUp />} color="purple" />
                <StatCard title="Active Vehicles" value={stats.activeVehicles} icon={<FaCar />} color="orange" />
            </div>

            {/* CHARTS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* MONTHLY REVENUE GRAPH */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-8">
                        <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><FaChartBar size={14}/></div>
                        Monthly Revenue
                    </h3>

                    {data.revenue.length === 0 ? (
                        <div className="h-72 flex items-center justify-center text-sm text-gray-400 italic">No revenue trends available.</div>
                    ) : (
                        <div className="h-72 flex items-end justify-between gap-3 px-2">
                            {data.revenue.map((item, idx) => {
                                const heightPercentage = (Number(item.total) / maxRev) * 100;
                                return (
                                    <div key={idx} className="flex-1 flex flex-col items-center h-full group">
                                        <div className="relative w-full h-full flex items-end">
                                            {/* Tooltip */}
                                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[11px] py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl z-20 mb-2">
                                                ZMW {Number(item.total).toLocaleString()}
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                                            </div>

                                            {/* The Bar */}
                                            <div 
                                                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-md transition-all duration-1000 ease-out group-hover:from-blue-500 group-hover:to-blue-300 cursor-pointer relative"
                                                style={{ height: `${Math.max(heightPercentage, 5)}%` }} 
                                            />
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-bold uppercase mt-4 rotate-[-45deg] lg:rotate-0">
                                            {item.month.substring(0, 3)}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* UTILIZATION LIST */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-8 flex items-center gap-2">
                         <div className="p-2 bg-green-50 rounded-lg text-green-600"><FaChartLine size={14}/></div>
                        Vehicle Utilization
                    </h3>
                    <div className="space-y-6">
                        {data.utilization.map((vehicle, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-2 font-medium">
                                    <span className="text-gray-700">{vehicle.name}</span>
                                    <span className={vehicle.percentage > 70 ? 'text-green-600' : 'text-orange-500'}>
                                        {vehicle.percentage}%
                                    </span>
                                </div>
                                <div className="w-full h-2.5 bg-gray-100 rounded-full">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-1000 ${vehicle.percentage > 70 ? 'bg-green-500' : 'bg-orange-500'}`}
                                        style={{ width: `${vehicle.percentage}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-component for stats to keep main code clean
function StatCard({ title, value, icon, color }) {
    const colors = {
        green: "bg-green-50 text-green-600",
        blue: "bg-blue-50 text-blue-600",
        purple: "bg-purple-50 text-purple-600",
        orange: "bg-orange-50 text-orange-600"
    };
    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-green-200 transition-colors">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">{title}</p>
                    <h2 className="text-2xl font-black text-gray-900 mt-1">{value}</h2>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]}`}>
                    {icon}
                </div>
            </div>
        </div>
    );
}