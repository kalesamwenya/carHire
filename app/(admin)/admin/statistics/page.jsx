'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
    FaCar,
    FaUserFriends,
    FaGasPump,
    FaWrench,
    FaExclamationTriangle,
    FaCheckCircle,
    FaTools,
    FaGlobeAfrica,
    FaChartPie,
    FaRoad,
    FaShieldAlt,
    FaSyncAlt,
} from 'react-icons/fa';

import CityDriveLoader from '@/components/CityDriveLoader';

export default function StatisticsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_API =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://api.citydrivehire.com';

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${BASE_API}/reports/get_fleet_stats.php`
            );

            let response = res.data;

            // HANDLE STRINGIFIED JSON
            if (typeof response === 'string') {
                response = JSON.parse(response);
            }

            setStats(response);
        } catch (err) {
            console.error('Stats Fetch Error', err);

            setStats({
                success: false,
                categories: [],
                vehicleHealth: [],
                demo: {
                    local: 0,
                    int: 0,
                    corp: 0,
                },
                metrics: {
                    dist: 0,
                    fuel: 0,
                    eff: 0,
                    topCar: 'N/A',
                },
                totalFleet: 0,
                totalUsers: 0,
            });
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <CityDriveLoader message="Gathering Fleet Intelligence" />
        );
    }

    // FALLBACKS
    const categories = Array.isArray(stats?.categories)
        ? stats.categories
        : [];

    const healthData = Array.isArray(stats?.vehicleHealth)
        ? stats.vehicleHealth
        : [];

    const demo = stats?.demo || {
        local: 0,
        int: 0,
        corp: 0,
    };

    const metrics = stats?.metrics || {
        dist: 0,
        fuel: 0,
        eff: 0,
        topCar: 'N/A',
    };

    const totalFleet = Number(stats?.totalFleet || 0);
    const totalUsers = Number(stats?.totalUsers || 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700 pb-12">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">
                        Fleet & User Statistics
                    </h1>

                    <p className="text-gray-500 mt-1 text-sm">
                        Live operational insights for City Drive Hire
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="bg-green-50 border border-green-100 px-4 py-2 rounded-xl">
                        <p className="text-[10px] uppercase font-bold text-green-600">
                            Total Fleet
                        </p>

                        <p className="text-xl font-black text-green-700">
                            {totalFleet.toLocaleString()}
                        </p>
                    </div>

                    <div className="bg-blue-50 border border-blue-100 px-4 py-2 rounded-xl">
                        <p className="text-[10px] uppercase font-bold text-blue-600">
                            Customers
                        </p>

                        <p className="text-xl font-black text-blue-700">
                            {totalUsers.toLocaleString()}
                        </p>
                    </div>

                    <button
                        onClick={fetchStats}
                        className="h-full flex items-center gap-2 bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <FaSyncAlt />
                        Refresh
                    </button>
                </div>
            </div>

            {/* TOP METRICS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    icon={<FaRoad />}
                    title="Total Distance"
                    value={metrics.dist}
                    unit="km"
                    color="blue"
                />

                <MetricCard
                    icon={<FaGasPump />}
                    title="Fuel Consumed"
                    value={metrics.fuel}
                    unit="L"
                    color="orange"
                />

                <MetricCard
                    icon={<FaShieldAlt />}
                    title="Efficiency"
                    value={metrics.eff}
                    unit="km/L"
                    color="green"
                />

                <MetricCard
                    icon={<FaCar />}
                    title="Top Vehicle"
                    value={metrics.topCar}
                    unit=""
                    color="purple"
                    isText
                />
            </div>

            {/* MAIN GRID */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* LEFT SIDE */}
                <div className="xl:col-span-2 space-y-8">
                    {/* FLEET COMPOSITION */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FaChartPie className="text-blue-500" />
                                Fleet Composition
                            </h3>

                            <span className="text-xs text-gray-400 uppercase font-bold">
                                Vehicle Categories
                            </span>
                        </div>

                        <div className="space-y-5">
                            {categories.length > 0 ? (
                                categories.map((cat, index) => (
                                    <div key={index}>
                                        <div className="flex justify-between mb-2">
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {cat?.name || 'Unknown'}
                                                </p>

                                                <p className="text-xs text-gray-400">
                                                    {Number(
                                                        cat?.count || 0
                                                    ).toLocaleString()}{' '}
                                                    Vehicles
                                                </p>
                                            </div>

                                            <span className="text-sm font-black text-gray-700">
                                                {Number(
                                                    cat?.percentage || 0
                                                )}%
                                            </span>
                                        </div>

                                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                            <div
                                                className={`${
                                                    cat?.color ||
                                                    'bg-blue-500'
                                                } h-full rounded-full transition-all duration-1000`}
                                                style={{
                                                    width: `${Number(
                                                        cat?.percentage || 0
                                                    )}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <FaCar className="mx-auto text-4xl text-gray-200 mb-3" />

                                    <p className="text-gray-400 italic text-sm">
                                        No category data available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* MAINTENANCE WATCHLIST */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FaWrench className="text-orange-500" />
                                Maintenance Watchlist
                            </h3>

                            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-all">
                                <FaTools />
                                Schedule Service
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {healthData.length > 0 ? (
                                healthData.map((car, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-5 rounded-2xl border transition-all ${
                                            car?.status === 'Critical'
                                                ? 'bg-red-50 border-red-100'
                                                : 'bg-green-50 border-green-100'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                                    {car?.plate || 'N/A'}
                                                </p>

                                                <h4 className="font-bold text-gray-900 mt-1">
                                                    {car?.model || 'Unknown'}
                                                </h4>
                                            </div>

                                            {car?.status === 'Critical' ? (
                                                <FaExclamationTriangle className="text-red-500 text-lg" />
                                            ) : (
                                                <FaCheckCircle className="text-green-500 text-lg" />
                                            )}
                                        </div>

                                        <div className="mt-5">
                                            <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2">
                                                <span>Service Remaining</span>

                                                <span>
                                                    {Number(
                                                        car?.kmLeft || 0
                                                    ).toLocaleString()}{' '}
                                                    KM
                                                </span>
                                            </div>

                                            <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                                                <div
                                                    style={{
                                                        width: `${Number(
                                                            car?.health || 0
                                                        )}%`,
                                                    }}
                                                    className={`h-full transition-all duration-1000 ${
                                                        car?.status ===
                                                        'Critical'
                                                            ? 'bg-red-500'
                                                            : 'bg-green-500'
                                                    }`}
                                                />
                                            </div>

                                            <div className="mt-3 flex items-center justify-between">
                                                <span
                                                    className={`text-[10px] uppercase font-black px-2 py-1 rounded-full ${
                                                        car?.status ===
                                                        'Critical'
                                                            ? 'bg-red-100 text-red-600'
                                                            : 'bg-green-100 text-green-700'
                                                    }`}
                                                >
                                                    {car?.status || 'Healthy'}
                                                </span>

                                                <span className="text-xs text-gray-500">
                                                    {Number(
                                                        car?.health || 0
                                                    )}
                                                    % Health
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="col-span-full text-center py-10">
                                    <FaWrench className="mx-auto text-4xl text-gray-200 mb-3" />

                                    <p className="text-gray-400 italic text-sm">
                                        No maintenance data available
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="space-y-8">
                    {/* DEMOGRAPHICS */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FaUserFriends className="text-pink-500" />
                                Customer Demographics
                            </h3>

                            <FaGlobeAfrica className="text-gray-300 text-xl" />
                        </div>

                        <div className="flex justify-center mb-8">
                            <div
                                className="relative w-52 h-52 rounded-full shadow-inner"
                                style={{
                                    background: `conic-gradient(
                                        #3b82f6 0% ${demo.local}%,
                                        #ec4899 ${demo.local}% ${
                                        demo.local + demo.int
                                    }%,
                                        #fbbf24 ${
                                            demo.local + demo.int
                                        }% 100%
                                    )`,
                                }}
                            >
                                <div className="absolute inset-5 bg-white rounded-full flex flex-col items-center justify-center shadow-sm">
                                    <span className="text-4xl font-black text-gray-900">
                                        {totalUsers.toLocaleString()}
                                    </span>

                                    <span className="text-xs uppercase tracking-widest text-gray-400 font-bold">
                                        Active Users
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <LegendItem
                                color="bg-blue-500"
                                label="Local"
                                val={demo.local}
                            />

                            <LegendItem
                                color="bg-pink-500"
                                label="International"
                                val={demo.int}
                            />

                            <LegendItem
                                color="bg-yellow-400"
                                label="Corporate"
                                val={demo.corp}
                            />
                        </div>
                    </div>

                    {/* QUICK INSIGHTS */}
                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-2xl shadow-lg text-white">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg">
                                Fleet Intelligence
                            </h3>

                            <FaCar className="text-3xl text-white/20" />
                        </div>

                        <div className="space-y-5">
                            <InsightItem
                                label="Most Utilized Vehicle"
                                value={metrics.topCar}
                            />

                            <InsightItem
                                label="Fleet Efficiency"
                                value={`${metrics.eff} km/L`}
                            />

                            <InsightItem
                                label="Operational Distance"
                                value={`${Number(
                                    metrics.dist || 0
                                ).toLocaleString()} km`}
                            />

                            <InsightItem
                                label="Fuel Consumption"
                                value={`${Number(
                                    metrics.fuel || 0
                                ).toLocaleString()} L`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    icon,
    title,
    value,
    unit,
    color,
    isText = false,
}) {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 border-blue-100',
        orange: 'bg-orange-50 text-orange-600 border-orange-100',
        green: 'bg-green-50 text-green-600 border-green-100',
        purple: 'bg-purple-50 text-purple-600 border-purple-100',
    };

    return (
        <div
            className={`p-6 rounded-2xl border shadow-sm ${
                colorMap[color] || colorMap.blue
            }`}
        >
            <div className="flex items-center justify-between mb-5">
                <div className="text-2xl">{icon}</div>

                <span className="text-[10px] uppercase font-black tracking-widest opacity-70">
                    Live
                </span>
            </div>

            <p className="text-xs uppercase font-black tracking-widest opacity-70 mb-2">
                {title}
            </p>

            <h3
                className={`font-black ${
                    isText ? 'text-2xl break-words' : 'text-4xl'
                }`}
            >
                {isText
                    ? value || 'N/A'
                    : Number(value || 0).toLocaleString()}

                {!isText && (
                    <span className="text-base font-bold ml-1">
                        {unit}
                    </span>
                )}
            </h3>
        </div>
    );
}

function LegendItem({ color, label, val }) {
    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`} />

                <span className="font-medium text-gray-700">
                    {label}
                </span>
            </div>

            <span className="font-black text-gray-900">
                {Number(val || 0)}%
            </span>
        </div>
    );
}

function InsightItem({ label, value }) {
    return (
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-sm text-slate-400">
                {label}
            </span>

            <span className="font-bold text-white text-right">
                {value || 'N/A'}
            </span>
        </div>
    );
}