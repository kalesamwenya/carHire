'use client';

import { FaArrowUp, FaChartBar, FaCalendarDay } from 'react-icons/fa';

export default function ReportsPage() {
    // Mock Data for a CSS Bar Chart
    const revenueData = [40, 70, 45, 90, 60, 85, 100];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Performance Reports</h1>
                    <p className="text-sm text-gray-500">Analytics for Oct 2025</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 shadow-sm">
                    <FaCalendarDay /> Last 7 Days
                </button>
            </div>

            {/* REVENUE CHART SECTION */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                    <FaChartBar className="text-green-600" /> Weekly Revenue
                </h3>

                {/* CSS Only Bar Chart */}
                <div className="flex items-end justify-between h-64 gap-2 sm:gap-4">
                    {revenueData.map((height, idx) => (
                        <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                            <div className="text-xs font-bold text-green-700 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                ${height * 10}
                            </div>
                            <div
                                style={{ height: `${height}%` }}
                                className="w-full bg-green-100 rounded-t-lg group-hover:bg-green-500 transition-all duration-300 relative"
                            ></div>
                            <span className="text-xs text-gray-400 mt-2 font-medium">{labels[idx]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECONDARY METRICS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-gray-500 text-sm font-bold uppercase mb-2">Total Bookings</h4>
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-extrabold text-gray-900">142</span>
                        <span className="text-green-600 text-sm font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                    <FaArrowUp className="mr-1" /> 12%
                </span>
                    </div>
                    <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 w-[70%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">70% from New Customers</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="text-gray-500 text-sm font-bold uppercase mb-2">Fleet Utilization</h4>
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-extrabold text-gray-900">85%</span>
                        <span className="text-green-600 text-sm font-bold flex items-center bg-green-50 px-2 py-0.5 rounded-full">
                    <FaArrowUp className="mr-1" /> 5%
                </span>
                    </div>
                    <div className="mt-4 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 w-[85%]"></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">17/20 Cars currently rented</p>
                </div>
            </div>
        </div>
    );
}