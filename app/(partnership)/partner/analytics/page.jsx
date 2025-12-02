import { FaChartBar, FaChartLine } from 'react-icons/fa';

export default function AnalyticsPage() {
    // We simulate charts using CSS bars since we can't install charting libraries here.
    const monthlyData = [45, 60, 75, 50, 80, 95]; // Percentages relative to max height

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-900">Performance Analytics</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* 1. Monthly Revenue Chart (Simulated) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            <FaChartBar className="text-blue-600" /> Monthly Revenue (Last 6 Months)
                        </h3>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 sm:gap-4 px-2">
                        {monthlyData.map((height, idx) => (
                            <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                                <div className="relative w-full bg-gray-100 rounded-t-lg h-full flex items-end overflow-hidden">
                                    <div
                                        className="w-full bg-blue-500 hover:bg-blue-600 transition-all duration-500 rounded-t-lg relative group-hover:shadow-lg"
                                        style={{ height: `${height}%` }}
                                    >
                                        {/* Tooltip */}
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                            ZMW {(height * 150).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-gray-500 font-medium">Month {idx + 1}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Vehicle Utilization */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaChartLine className="text-green-600" /> Vehicle Utilization
                    </h3>
                    <div className="space-y-6">
                        {/* Bar 1 */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Toyota RAV4</span>
                                <span className="font-bold text-green-700">85%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                        {/* Bar 2 */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Ford Ranger</span>
                                <span className="font-bold text-yellow-600">60%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-500 rounded-full" style={{ width: '60%' }}></div>
                            </div>
                        </div>
                        {/* Bar 3 */}
                        <div>
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-gray-700">Honda Fit</span>
                                <span className="font-bold text-blue-600">92%</span>
                            </div>
                            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                    </div>
                    <p className="mt-6 text-xs text-gray-400">
                        *Utilization is calculated based on days rented vs days available in the month.
                    </p>
                </div>
            </div>
        </div>
    );
}