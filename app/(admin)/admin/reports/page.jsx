'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown, FaChartBar, FaCalendarDay, FaCircle, FaTrophy } from 'react-icons/fa';

export default function ReportsPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${BASE_API}/reports/get_performance.php`);
                setData(res.data);
            } catch (err) {
                console.error("Failed to load reports");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-400 font-medium animate-pulse">Analyzing Fleet Performance...</p>
        </div>
    );

    // Safeguard against missing data
    if (!data || !data.revenue) return <div className="p-10 text-center text-red-500 bg-red-50 rounded-xl border border-red-100">Database connection error or no data found.</div>;

    const maxRevenue = Math.max(...data.revenue, 1);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-10">
            {/* HEADER */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Performance Reports</h1>
                    <p className="text-sm text-gray-500 font-medium">
                        Analytics for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md uppercase tracking-wider">
                        <FaCircle className="text-[6px] animate-pulse" /> Live Data
                    </span>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 shadow-sm transition-all">
                        <FaCalendarDay /> Last 7 Days
                    </button>
                </div>
            </div>

            {/* REVENUE CHART SECTION */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-100 transition-colors">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <FaChartBar className="text-green-600" /> Weekly Revenue
                    </h3>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase font-bold">Total this week</p>
                        <p className="text-xl font-black text-gray-900">
                            K{(data?.currentTotal || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-end justify-between h-64 gap-2 sm:gap-4 px-2">
                    {data.revenue.map((val, idx) => {
                        const heightPercentage = (val / maxRevenue) * 100;
                        return (
                            <div key={idx} className="flex-1 flex flex-col justify-end items-center group relative">
                                <div className="absolute -top-8 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-10 whitespace-nowrap font-bold">
                                    K{(val || 0).toLocaleString()}
                                </div>
                                <div
                                    style={{ height: `${heightPercentage}%` }}
                                    className={`w-full rounded-t-lg transition-all duration-1000 ease-out relative group-hover:brightness-110 
                                        ${val === maxRevenue && val > 0 ? 'bg-green-600 shadow-[0_0_15px_rgba(22,163,74,0.3)]' : 'bg-green-100 group-hover:bg-green-500'}`}
                                ></div>
                                <span className="text-[10px] text-gray-400 mt-3 font-bold uppercase tracking-tighter">
                                    {data.labels?.[idx] || '--'}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* Total Bookings Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                    <h4 className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-2">Total Bookings</h4>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black text-slate-900">{data.totalBookings || 0}</span>
                        <div className={`flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${(data.growth || 0) >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                            {(data.growth || 0) >= 0 ? <FaArrowUp /> : <FaArrowDown />} 
                            {Math.abs(data.growth || 0)}%
                        </div>
                    </div>
                    <div className="mt-6 h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: '100%' }}></div>
                    </div>
                </div>

                {/* Utilization Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
                    <h4 className="text-gray-400 text-[11px] font-black uppercase tracking-widest mb-2">Fleet Utilization</h4>
                    <div className="flex items-baseline gap-4">
                        <span className="text-5xl font-black text-slate-900">{data.utilization || 0}%</span>
                        <span className="text-slate-400 text-xs font-bold bg-slate-50 px-2 py-1 rounded-md uppercase tracking-tight">
                            {data.rentedCount || 0} Active
                        </span>
                    </div>
                    <div className="mt-6 h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                        <div 
                            className={`h-full rounded-full transition-all duration-1000 ${(data.utilization || 0) > 80 ? 'bg-orange-500' : 'bg-purple-600'}`} 
                            style={{ width: `${data.utilization || 0}%` }}
                        ></div>
                    </div>
                </div>

                {/* NEW: Top Earning Car Card */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700 group hover:shadow-xl transition-all lg:col-span-1 md:col-span-2">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="text-slate-400 text-[11px] font-black uppercase tracking-widest">Weekly MVP</h4>
                        <FaTrophy className="text-yellow-500 text-xl" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-white text-2xl font-black truncate">
                            {data.topCar || "No Data"}
                        </p>
                        <p className="text-green-400 font-bold text-lg">
                            K{(data.topCarRevenue || 0).toLocaleString()}
                        </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <p className="text-[10px] text-slate-500 font-bold uppercase">Highest Revenue Generator</p>
                    </div>
                </div>

            </div>
        </div>
    );
}