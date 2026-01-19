'use client';

import { useState, useEffect } from 'react';
import { FaWallet, FaDownload, FaArrowUp, FaArrowDown, FaSpinner } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import axios from 'axios';

export default function EarningsPage() {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const partnerId = 1; // Replace with dynamic Auth ID

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com"

    useEffect(() => {
        const fetchFinancialData = async () => {
            try {
                const res = await axios.get(`${BASE_API}/partners/get-earnings.php?user_id=${partnerId}`);
                if (res.data.success) {
                    setCars(res.data.data);
                }
            } catch (err) {
                console.error("Database connection error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFinancialData();
    }, [partnerId]);

    const totalEarnings = cars.reduce((acc, car) => acc + car.earnings, 0);
    const totalExpenses = cars.reduce((acc, car) => acc + car.expenses, 0);
    const netProfit = totalEarnings - totalExpenses;

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <FaSpinner className="animate-spin text-green-600 text-3xl" />
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                    <FaDownload /> Export Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-green-700 mt-2">ZMW {totalEarnings.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Expenses</p>
                    <h3 className="text-2xl font-bold text-red-600 mt-2">ZMW {totalExpenses.toLocaleString()}</h3>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 bg-gray-900 text-white">
                    <p className="text-sm text-gray-300 font-medium">Net Profit</p>
                    <h3 className="text-2xl font-bold mt-2">ZMW {netProfit.toLocaleString()}</h3>
                </div>
            </div>

            {/* NEW: Visual Analytics Section */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-900 mb-6">Revenue Performance by Vehicle</h3>
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={cars}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6b7280', fontSize: 12}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fill: '#6b7280', fontSize: 12}}
                            />
                            <Tooltip 
                                cursor={{fill: '#f9fafb'}}
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                            />
                            <Bar dataKey="earnings" radius={[6, 6, 0, 0]} barSize={40}>
                                {cars.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#15803d' : '#22c55e'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Per Vehicle Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Detailed Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3">Vehicle</th>
                                <th className="px-6 py-3">Plate No.</th>
                                <th className="px-6 py-3 text-center">Trips</th>
                                <th className="px-6 py-3 text-right">Revenue</th>
                                <th className="px-6 py-3 text-right">Net Profit</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cars.map((car) => (
                                <tr key={car.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{car.name}</td>
                                    <td className="px-6 py-4 text-gray-500 font-mono">{car.plate}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-bold">{car.trips}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-green-700">ZMW {car.earnings.toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-900">ZMW {(car.earnings - car.expenses).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}