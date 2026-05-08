'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { 
    FaDownload, 
    FaFileInvoice, 
    FaSearch, 
    FaCheckCircle, 
    FaClock, 
    FaChartLine, 
    FaArrowUp, 
    FaTimes,
    FaSortAmountDown,
    FaExclamationCircle
} from 'react-icons/fa';
import { 
    BarChart, 
    Bar, 
    XAxis, 
    Tooltip, 
    ResponsiveContainer, 
    Cell, 
    YAxis 
} from 'recharts';
import CityDriveLoader from '@/components/CityDriveLoader';

export default function InvoicesPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [viewMode, setViewMode] = useState('paid'); // 'paid' or 'total'
    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'value'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                // Now fetching from the updated aggregated endpoint
                const res = await axios.get(`${BASE_API}/admin/get_financials.php`);
                setRecords(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) { 
                console.error("Fetch error:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchFinancials();
    }, []);

    // 1. Summary Totals - Accurate calculation of collected vs booked
    const stats = useMemo(() => {
        const paid = records.reduce((sum, r) => sum + (Number(r.amount_paid) || 0), 0);
        const total = records.reduce((sum, r) => sum + (Number(r.booking_total) || 0), 0);
        return { paid, pending: Math.max(0, total - paid), total };
    }, [records]);

    // 2. Monthly Revenue Distribution Logic
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((m, index) => {
            const amount = records
                .filter(r => {
                    const rawDate = r.active_date || r.created_at;
                    if (typeof rawDate !== 'string') return false; 
                    const date = new Date(rawDate.replace(' ', 'T'));
                    return !isNaN(date.getTime()) && date.getMonth() === index;
                })
                .reduce((sum, r) => {
                    const val = viewMode === 'paid' ? (Number(r.amount_paid) || 0) : (Number(r.booking_total) || 0);
                    return sum + val;
                }, 0);
            return { month: m, amount, index };
        });
    }, [records, viewMode]);

    // 3. Simple Forecast (Growth Factor: 15%)
    const forecast = useMemo(() => {
        const currentMonthIndex = new Date().getMonth();
        const recentData = chartData.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);
        const avg = recentData.reduce((a, b) => a + b.amount, 0) / (recentData.length || 1);
        return Math.round(avg * 1.15); 
    }, [chartData]);

    // 4. Filtering and Sorting Logic
    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = 
                r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                r.display_id?.toString().includes(searchTerm) ||
                r.car_name?.toLowerCase().includes(searchTerm.toLowerCase());
            
            const rawDate = r.active_date || r.created_at;
            let matchesMonth = true;
            
            if (selectedMonth !== null) {
                const date = new Date(rawDate.replace(' ', 'T'));
                matchesMonth = !isNaN(date.getTime()) && date.getMonth() === selectedMonth;
            }
            return matchesSearch && matchesMonth;
        }).sort((a, b) => {
            if (sortBy === 'value') return Number(b.booking_total) - Number(a.booking_total);
            const dateA = new Date((a.created_at || '').replace(' ', 'T'));
            const dateB = new Date((b.created_at || '').replace(' ', 'T'));
            return dateB - dateA;
        });
    }, [records, searchTerm, selectedMonth, sortBy]);

    const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) return <CityDriveLoader message="Syncing financial data..."/>;

    return (
        <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Collected (ZMW)</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.paid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Outstanding</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.pending.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pipeline Value</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.total.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl shadow-lg text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Target Forecast</p>
                    <p className="text-2xl font-black mt-1">K{forecast.toLocaleString()}</p>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-black uppercase text-slate-900 tracking-tight">Revenue Insights</h2>
                        {selectedMonth !== null && (
                            <button onClick={() => setSelectedMonth(null)} className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full flex items-center gap-1 uppercase">
                                <FaTimes /> Clear Filter
                            </button>
                        )}
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => { setViewMode('paid'); setSelectedMonth(null); }} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'paid' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'}`}>ACTUAL CASH</button>
                        <button onClick={() => { setViewMode('total'); setSelectedMonth(null); }} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'total' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}>TOTAL BOOKED</button>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <Tooltip 
                                cursor={{fill: '#f8fafc'}} 
                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                                formatter={(value) => [`K${value.toLocaleString()}`, viewMode === 'paid' ? 'Collected' : 'Booked']}
                            />
                            <Bar dataKey="amount" onClick={(d) => setSelectedMonth(selectedMonth === d.index ? null : d.index)}>
                                {chartData.map((entry, index) => (
                                    <Cell 
                                        key={index} 
                                        cursor="pointer" 
                                        fill={selectedMonth === index ? '#10b981' : (viewMode === 'paid' ? '#10b981' : '#0f172a')} 
                                        fillOpacity={entry.amount > 0 ? 1 : 0.1} 
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Filter Controls */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" placeholder="Search by customer name, vehicle, or INV ID..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm font-medium"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex bg-white border border-gray-100 rounded-2xl px-4 items-center gap-2 shadow-sm">
                    <FaSortAmountDown className="text-slate-400" />
                    <select 
                        className="py-4 text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="value">Sort: Highest Value</option>
                    </select>
                </div>
            </div>

            {/* Invoice List */}
            <div className="grid gap-3">
                {paginatedRecords.length > 0 ? paginatedRecords.map((inv) => (
                    <div key={inv.main_id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all group">
                        <div className="flex items-center gap-5">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                                inv.payment_status === 'Verified' ? 'bg-emerald-50 text-emerald-500' : 
                                inv.payment_status === 'Partial' ? 'bg-amber-50 text-amber-500' : 'bg-slate-100 text-slate-400'
                            }`}>
                                <FaFileInvoice size={22} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 tracking-tight text-sm">INV-{inv.display_id}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.customer_name} • <span className="text-slate-500">{inv.car_name || 'Vehicle'}</span></p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="font-black text-xl text-slate-900">K{Number(inv.booking_total).toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    {inv.payment_status === 'Verified' ? (
                                        <>
                                            <FaCheckCircle className="text-emerald-500" size={10} />
                                            <span className="text-[9px] font-black uppercase text-emerald-500">Full Payment</span>
                                        </>
                                    ) : inv.payment_status === 'Partial' ? (
                                        <>
                                            <FaExclamationCircle className="text-amber-500" size={10} />
                                            <span className="text-[9px] font-black uppercase text-amber-500">Partial: K{Number(inv.amount_paid).toLocaleString()}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaClock className="text-slate-400" size={10} />
                                            <span className="text-[9px] font-black uppercase text-slate-400">No Payment</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <button 
    onClick={() => {
        // We use inv.main_id (e.g., 35) to ensure the PHP script finds the record directly
        const invoiceUrl = `${BASE_API}/admin/generate_invoice.php?id=${inv.main_id}&booking_id=${inv.display_id}`;
        window.open(invoiceUrl, '_blank');
    }}
    title="Download Official Invoice"
    className="h-12 w-12 border border-gray-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm"
>
    <FaDownload size={16} />
</button>
                        </div>
                    </div>
                )) : (
                    <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center">
                        <p className="text-slate-400 font-bold text-sm">No records found for the current selection.</p>
                    </div>
                )}
            </div>

            {/* Pagination Controls */}
            {filteredRecords.length > itemsPerPage && (
                <div className="flex justify-center gap-2 pt-4">
                    {[...Array(Math.ceil(filteredRecords.length / itemsPerPage))].map((_, i) => (
                        <button 
                            key={i} 
                            onClick={() => { setCurrentPage(i + 1); window.scrollTo({top: 0, behavior: 'smooth'}); }}
                            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${currentPage === i + 1 ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border text-gray-400 hover:bg-gray-50'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}