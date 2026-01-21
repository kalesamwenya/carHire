'use client';

import CityDriveLoader from '@/components/CityDriveLoader';
import { useState, useEffect } from 'react';
import { FaTools, FaCheckCircle, FaExclamationTriangle, FaSpinner, FaHistory } from 'react-icons/fa';

export default function MaintenancePage() {
    const [data, setData] = useState({ logs: [], overdue_count: 0, overdue_list: [] });
    const [loading, setLoading] = useState(true);

     const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";


    useEffect(() => {
        async function fetchMaintenance() {
            try {
                const res = await fetch(`${BASE_API}/admin/get_all_maintenance.php`);
                const json = await res.json();
                if (json.success) setData(json);
            } catch (error) {
                console.error("Failed to load maintenance data");
            } finally {
                setLoading(false);
            }
        }
        fetchMaintenance();
    }, []);

    if (loading) return <CityDriveLoader message="sycing maintaince data"/>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Fleet Health & Maintenance</h1>
                    <p className="text-sm text-gray-500">Track service history and upcoming requirements.</p>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 flex items-center gap-2 transition-all shadow-lg shadow-slate-200">
                    <FaTools /> Log Fleet Service
                </button>
            </div>

            {/* Health Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Fleet Status</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-black text-gray-800">Healthy</h3>
                        <FaCheckCircle className="text-green-500 text-3xl" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm ring-1 ring-red-50">
                    <p className="text-xs font-bold text-red-400 uppercase tracking-wider mb-1">Overdue Service</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-black text-red-600">{data.overdue_count} Vehicles</h3>
                        <FaExclamationTriangle className="text-red-500 text-3xl animate-pulse" />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Last 30 Days Spend</p>
                    <div className="flex items-end justify-between">
                        <h3 className="text-2xl font-black text-gray-800">
                            K{data.logs.reduce((acc, log) => acc + (parseFloat(log.cost) || 0), 0).toLocaleString()}
                        </h3>
                        <div className="bg-slate-100 p-2 rounded-lg"><FaHistory className="text-slate-400" /></div>
                    </div>
                </div>
            </div>

            {/* Main Log Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="font-bold text-gray-700 text-sm">Recent Service Logs</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-white uppercase font-bold text-gray-400 text-[10px] border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Vehicle</th>
                                <th className="px-6 py-4">Service Performed</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Mileage</th>
                                <th className="px-6 py-4 text-right">Cost</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {data.logs.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900">{item.car_name}</div>
                                        <div className="text-[10px] font-mono text-gray-400">{item.plate_number}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                                            {item.service_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(item.service_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{item.mileage_at_service?.toLocaleString()} km</td>
                                    <td className="px-6 py-4 text-right font-black text-gray-900">K{item.cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {data.logs.length === 0 && (
                    <div className="p-20 text-center text-gray-400 italic">No maintenance records found.</div>
                )}
            </div>
        </div>
    );
}