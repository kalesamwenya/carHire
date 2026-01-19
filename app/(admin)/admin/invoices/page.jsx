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
    FaSortAmountDown
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

export default function InvoicesPage() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [viewMode, setViewMode] = useState('paid'); // 'paid' or 'total'
    const [sortBy, setSortBy] = useState('newest'); // 'newest' or 'value'
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        const fetchFinancials = async () => {
            try {
                const res = await axios.get('https://api.citydrivehire.com/admin/get_financials.php');
                setRecords(Array.isArray(res.data.data) ? res.data.data : []);
            } catch (err) { 
                console.error("Fetch error:", err); 
            } finally { 
                setLoading(false); 
            }
        };
        fetchFinancials();
    }, []);

    // 1. Summary Totals
    const stats = useMemo(() => {
        const paid = records.reduce((sum, r) => sum + (Number(r.amount_paid) || 0), 0);
        const total = records.reduce((sum, r) => sum + (Number(r.booking_total) || 0), 0);
        return { paid, pending: total - paid, total };
    }, [records]);

    // 2. Safe Chart Logic (Restored Total Booked Toggle)
    const chartData = useMemo(() => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return months.map((m, index) => {
            const amount = records
                .filter(r => {
                    const rawDate = r.active_date || r.paid_at || r.created_at;
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

    // 3. Forecast Logic
    const forecast = useMemo(() => {
        const currentMonthIndex = new Date().getMonth();
        const recentData = chartData.slice(Math.max(0, currentMonthIndex - 2), currentMonthIndex + 1);
        const avg = recentData.reduce((a, b) => a + b.amount, 0) / (recentData.length || 1);
        return Math.round(avg * 1.15); 
    }, [chartData]);

    // 4. RESTORED: Filter & Sort Logic
    const filteredRecords = useMemo(() => {
        return records.filter(r => {
            const matchesSearch = r.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                  r.display_id?.toString().includes(searchTerm);
            
            const rawDate = r.active_date || r.paid_at || r.created_at;
            let matchesMonth = true;
            
            if (selectedMonth !== null) {
                if (typeof rawDate !== 'string') {
                    matchesMonth = false;
                } else {
                    const date = new Date(rawDate.replace(' ', 'T'));
                    matchesMonth = !isNaN(date.getTime()) && date.getMonth() === selectedMonth;
                }
            }
            return matchesSearch && matchesMonth;
        }).sort((a, b) => {
            if (sortBy === 'value') {
                return Number(b.booking_total) - Number(a.booking_total);
            }
            // Default: Newest first
            const dateA = new Date((a.created_at || '').replace(' ', 'T'));
            const dateB = new Date((b.created_at || '').replace(' ', 'T'));
            return dateB - dateA;
        });
    }, [records, searchTerm, selectedMonth, sortBy]);

    const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
        {/* Sleek Minimalist Spinner */}
        <div className="relative w-16 h-16">
            {/* Outer Ring */}
            <div className="absolute inset-0 border-4 border-green-100 rounded-full"></div>
            {/* Animated Brand Ring */}
            <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin"></div>
        </div>

        {/* Company Branding */}
        <div className="mt-8 text-center">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter">
                CITYDRIVE <span className="text-green-600">HIRE</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1 animate-pulse">
                Fetching Financials
            </p>
        </div>

        {/* Subtle Progress Bar */}
        <div className="mt-6 w-48 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-green-700 w-1/3 rounded-full animate-[loading_1.5s_infinite_ease-in-out]"></div>
        </div>

        <style jsx>{`
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(200%); }
            }
        `}</style>
    </div>
);
    return (
        <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
            
            {/* KPI Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Cash Collected</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.paid.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-orange-400 uppercase tracking-widest">Outstanding</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.pending.toLocaleString()}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Value</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">K{stats.total.toLocaleString()}</p>
                </div>
                <div className="bg-slate-900 p-5 rounded-2xl shadow-lg text-white">
                    <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Next Month Goal</p>
                    <p className="text-2xl font-black mt-1">K{forecast.toLocaleString()}</p>
                </div>
            </div>

            {/* Graph with RESTORED Toggle */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
                    <div className="flex items-center gap-3">
                        <h2 className="text-sm font-black uppercase text-slate-900 tracking-tight">Revenue Insights</h2>
                        {selectedMonth !== null && (
                            <button onClick={() => setSelectedMonth(null)} className="px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black rounded-full flex items-center gap-1 uppercase">
                                <FaTimes /> Reset
                            </button>
                        )}
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl">
                        <button onClick={() => setViewMode('paid')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'paid' ? 'bg-emerald-500 text-white shadow-md' : 'text-slate-400'}`}>PAID CASH</button>
                        <button onClick={() => setViewMode('total')} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all ${viewMode === 'total' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400'}`}>TOTAL BOOKED</button>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 11, fontWeight: 'bold'}} />
                            <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', fontWeight: 'bold'}} />
                            <Bar dataKey="amount" onClick={(d) => setSelectedMonth(selectedMonth === d.index ? null : d.index)}>
                                {chartData.map((entry, index) => (
                                    <Cell key={index} cursor="pointer" fill={selectedMonth === index ? '#10b981' : (viewMode === 'paid' ? '#10b981' : '#0f172a')} fillOpacity={entry.amount > 0 ? 1 : 0.1} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* RESTORED: Search + Sort Row */}
            <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" placeholder="Search customer, car or invoice ID..."
                        className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    />
                </div>
                <div className="flex bg-white border border-gray-100 rounded-2xl px-4 items-center gap-2 shadow-sm">
                    <FaSortAmountDown className="text-slate-400" />
                    <select 
                        className="py-4 text-[10px] font-black uppercase outline-none bg-transparent cursor-pointer"
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="newest">Sort: Newest</option>
                        <option value="value">Sort: Highest Value</option>
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="grid gap-3">
                {paginatedRecords.map((inv) => (
                    <div key={inv.main_id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between hover:shadow-md transition-all">
                        <div className="flex items-center gap-5">
                            <div className={`h-12 w-12 rounded-2xl flex items-center justify-center ${inv.payment_status === 'Verified' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-400'}`}>
                                <FaFileInvoice size={22} />
                            </div>
                            <div>
                                <p className="font-black text-slate-900 tracking-tight text-sm">INV-{inv.display_id}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">{inv.customer_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <p className="font-black text-xl text-slate-900">K{Number(inv.booking_total).toLocaleString()}</p>
                                <div className="flex items-center justify-end gap-1 mt-1">
                                    {inv.payment_status === 'Verified' ? <FaCheckCircle className="text-emerald-500" size={10} /> : <FaClock className="text-orange-400" size={10} />}
                                    <span className={`text-[9px] font-black uppercase ${inv.payment_status === 'Verified' ? 'text-emerald-500' : 'text-orange-400'}`}>{inv.payment_status || 'Pending'}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => window.open(`http://api.citydrivehire.local/admin/generate_invoice.php?id=INV-${inv.main_id}`, '_blank')}
                                className="h-12 w-12 border border-gray-100 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all shadow-sm"
                            >
                                <FaDownload size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
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
        </div>
    );
}