'use client';

import { useState, useEffect } from 'react';
import { FaChartBar, FaChartLine, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

export default function AnalyticsPage() {
    const [data, setData] = useState({ revenue: [], utilization: [] });
    const [loading, setLoading] = useState(true);
    const partnerId = 1; // Replace with dynamic auth id

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get(`${BASE_API}/partners/get-analytics.php?user_id=${partnerId}`);
                if (res.data.success) {
                    setData({
                        revenue: res.data.revenue,
                        utilization: res.data.utilization
                    });
                }
            } catch (err) {
                console.error("Analytics fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [partnerId]);

    // Calculate max revenue to scale the CSS bars
    const maxRev = Math.max(...data.revenue.map(r => r.total), 1);

    if (loading) return (
        <div className="flex h-96 items-center justify-center text-green-600 font-bold">
            <FaSpinner className="animate-spin mr-2" /> Analyzing Fleet Performance...
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Monthly Revenue Chart (CSS Driven) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
                        <FaChartBar className="text-blue-600" /> Monthly Revenue (ZMW)
                    </h3>

                    <div className="h-64 flex items-end justify-between gap-2 px-2">
                        {data.revenue.map((item, idx) => {
                            const height = (item.total / maxRev) * 100;
                            return (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                    <div className="relative w-full bg-gray-50 rounded-t-lg h-full flex items-end overflow-hidden">
                                        <div
                                            className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-700 rounded-t-lg relative group-hover:shadow-lg"
                                            style={{ height: `${height}%` }}
                                        >
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                ZMW {Number(item.total).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">{item.month}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Vehicle Utilization */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaChartLine className="text-green-600" /> Vehicle Utilization
                    </h3>
                    <div className="space-y-6">
                        {data.utilization.map((vehicle, idx) => (
                            <div key={idx}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-gray-700">{vehicle.name}</span>
                                    <span className={`font-bold ${vehicle.percentage > 70 ? 'text-green-700' : 'text-yellow-600'}`}>
                                        {vehicle.percentage}%
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-1000 rounded-full ${vehicle.percentage > 70 ? 'bg-green-500' : 'bg-yellow-500'}`} 
                                        style={{ width: `${vehicle.percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-[10px] text-gray-400 font-medium italic">
                        *Based on 30-day rental cycles.
                    </p>
                </div>
            </div>
        </div>
    );
}