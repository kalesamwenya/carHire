'use client';

import { FaArrowUp, FaArrowDown, FaChartLine, FaPercentage, FaDesktop, FaMobileAlt } from 'react-icons/fa';

export default function AnalyticsPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Business Analytics</h1>
                    <p className="text-sm text-gray-500">Financial performance and conversion metrics.</p>
                </div>
                <select className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm shadow-sm outline-none">
                    <option>This Year</option>
                    <option>Last Year</option>
                </select>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl text-blue-500"><FaChartLine /></div>
                    <p className="text-gray-500 text-xs font-bold uppercase">Net Profit</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">$42,500</h3>
                    <span className="text-green-600 text-xs font-bold flex items-center mt-2"><FaArrowUp className="mr-1"/> 15% vs last year</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase">Conversion Rate</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">3.2%</h3>
                    <span className="text-red-500 text-xs font-bold flex items-center mt-2"><FaArrowDown className="mr-1"/> 0.4% vs last month</span>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-xs font-bold uppercase">Avg. Booking Value</p>
                    <h3 className="text-3xl font-extrabold text-gray-900 mt-1">$185.00</h3>
                    <span className="text-green-600 text-xs font-bold flex items-center mt-2"><FaArrowUp className="mr-1"/> $12 vs last month</span>
                </div>
            </div>

            {/* REVENUE VS EXPENSES CHART (CSS Grid Simulation) */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-6">Income vs Expenses (2025)</h3>

                <div className="relative h-64 flex items-end justify-between gap-4 sm:gap-8 px-2">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                        {[...Array(5)].map((_, i) => <div key={i} className="w-full border-t border-gray-100"></div>)}
                    </div>

                    {/* Bars */}
                    {[
                        { m: 'Jan', in: 40, ex: 20 }, { m: 'Feb', in: 55, ex: 25 },
                        { m: 'Mar', in: 45, ex: 30 }, { m: 'Apr', in: 70, ex: 35 },
                        { m: 'May', in: 60, ex: 25 }, { m: 'Jun', in: 85, ex: 40 },
                        { m: 'Jul', in: 95, ex: 45 }, { m: 'Aug', in: 80, ex: 30 },
                    ].map((data, idx) => (
                        <div key={idx} className="flex-1 flex gap-1 justify-center h-full items-end z-10 group cursor-pointer">
                            {/* Income Bar */}
                            <div style={{ height: `${data.in}%` }} className="w-3 sm:w-6 bg-blue-600 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all relative">
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">${data.in}k</div>
                            </div>
                            {/* Expense Bar */}
                            <div style={{ height: `${data.ex}%` }} className="w-3 sm:w-6 bg-red-400 rounded-t-sm opacity-80 group-hover:opacity-100 transition-all"></div>
                        </div>
                    ))}
                </div>
                <div className="flex justify-between px-2 mt-4 text-xs font-bold text-gray-400 uppercase">
                    <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                </div>
                <div className="flex justify-center gap-6 mt-6">
                    <div className="flex items-center text-xs font-bold text-gray-600"><div className="w-3 h-3 bg-blue-600 mr-2 rounded-sm"></div> Income</div>
                    <div className="flex items-center text-xs font-bold text-gray-600"><div className="w-3 h-3 bg-red-400 mr-2 rounded-sm"></div> Expenses</div>
                </div>
            </div>

            {/* DEVICE BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4">Booking Source</h3>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="flex items-center gap-2"><FaMobileAlt /> Mobile App</span>
                                <span className="font-bold">65%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[65%]"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="flex items-center gap-2"><FaDesktop /> Desktop Website</span>
                                <span className="font-bold">25%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[25%]"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="flex items-center gap-2">Walk-in / Phone</span>
                                <span className="font-bold">10%</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gray-400 w-[10%]"></div></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl shadow-md text-white">
                    <h3 className="font-bold mb-2">AI Insights</h3>
                    <p className="text-slate-300 text-sm mb-6">Based on your recent data, we recommend increasing fleet size for "Economy" cars.</p>

                    <div className="bg-white/10 p-4 rounded-lg mb-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-bold uppercase text-slate-400">Demand Projection</span>
                            <span className="text-green-400 text-xs font-bold">+12% Next Month</span>
                        </div>
                        <div className="text-2xl font-bold">High Demand</div>
                    </div>

                    <button className="w-full py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition-colors">
                        View Detailed Report
                    </button>
                </div>
            </div>
        </div>
    );
}