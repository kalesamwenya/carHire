'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
    FaEdit, FaTrash, FaArrowLeft, FaGasPump, FaCogs, 
    FaUsers, FaCalendarAlt, FaHistory, FaSpinner, FaCar,
    FaTimes, FaSave, FaExclamationTriangle, FaCheckCircle
} from 'react-icons/fa';

export default function CarDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [data, setData] = useState({ car: null, bookings: [], service_logs: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        service_type: '',
        service_date: new Date().toISOString().split('T')[0],
        cost: '',
        mileage: '',
        notes: ''
    });

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const fetchAllDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await fetch(`${BASE_API}/admin/get_car_details.php?id=${id}`);
            const json = await res.json();
            if (json.success) {
                setData({
                    car: json.car,
                    bookings: json.bookings,
                    service_logs: json.service_logs,
                    stats: json.stats
                });
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [id, BASE_API]);

    useEffect(() => {
        fetchAllDetails();
    }, [fetchAllDetails]);

    const handleAddService = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${BASE_API}/admin/add_service_log.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, car_id: id }),
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                // Refresh data without reloading the whole browser
                fetchAllDetails(); 
                setFormData({ ...formData, service_type: '', cost: '', mileage: '' });
            }
        } catch (error) {
            alert("Failed to save service log.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this vehicle? This action cannot be undone.")) {
            // Logic for delete API call here
            alert("Delete functionality triggered");
        }
    };

    if (loading && !data.car) return (
        <div className="flex flex-col justify-center items-center h-screen text-slate-600 gap-4">
            <FaSpinner className="animate-spin text-4xl text-blue-600" />
            <p className="text-sm font-medium animate-pulse">Loading vehicle metrics...</p>
        </div>
    );

    const { car, bookings, service_logs, stats } = data;
    if (!car) return <div className="p-10 text-center">Vehicle not found.</div>;

    return (
        <div className="space-y-6 max-w-8xl mx-auto pb-10 px-4">
            
            {/* 1. MAINTENANCE ALERT BANNER */}
            {stats.is_overdue && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between shadow-sm border border-amber-100">
                    <div className="flex items-center gap-3">
                        <div className="bg-amber-100 p-2 rounded-full text-amber-600">
                            <FaExclamationTriangle className="animate-bounce" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-amber-800">Maintenance Overdue</h4>
                            <p className="text-xs text-amber-700">
                                Last service was on <b>{stats.last_service_date}</b>. Schedule maintenance soon to ensure safety.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="hidden md:block bg-amber-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-700 transition-colors shadow-sm"
                    >
                        Log Service
                    </button>
                </div>
            )}

            {/* 2. Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{car.name}</h1>
                        <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-mono text-xs border border-slate-200">{car.plate_number}</span>
                            <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                car.available == 1 
                                ? "text-green-600 bg-green-50 border-green-100" 
                                : "text-amber-600 bg-amber-50 border-amber-100"
                            }`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${car.available == 1 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                                {car.available == 1 ? "Available" : "Rented"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Link href={`/admin/cars/${id}/edit`} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-bold shadow-sm">
                        <FaEdit /> Edit
                    </Link>
                    <button 
                        onClick={handleDelete}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-red-100 text-red-500 rounded-lg hover:bg-red-50 text-sm font-bold shadow-sm transition-colors"
                    >
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Vehicle Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-96 bg-slate-200 rounded-3xl overflow-hidden flex items-center justify-center relative shadow-inner border-4 border-white">
                        {car.featured_image ? (
                            <img src={BASE_API + car.featured_image} alt={car.name} className="w-full h-full object-cover" />
                        ) : (
                            <FaCar className="text-slate-400 text-8xl" />
                        )}
                        <div className="absolute top-6 left-6">
                             <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-slate-500 shadow-sm uppercase tracking-tighter">
                                Daily Rate
                             </div>
                        </div>
                        <div className="absolute bottom-6 right-6 bg-blue-600 text-white px-6 py-3 rounded-2xl text-2xl font-black shadow-2xl border-2 border-white/20">
                            K{Number(car.price_per_day).toLocaleString()} <span className="text-xs font-medium opacity-80">/ day</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { label: 'Fuel', value: car.fuel, icon: <FaGasPump />, color: 'text-blue-500' },
                            { label: 'Gearbox', value: car.transmission, icon: <FaCogs />, color: 'text-slate-500' },
                            { label: 'Capacity', value: `${car.seats || 5} Seats`, icon: <FaUsers />, color: 'text-purple-500' },
                            { label: 'Color', value: car.color, icon: <FaHistory />, color: 'text-emerald-500' },
                        ].map((spec, i) => (
                            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm transition-transform hover:scale-[1.02]">
                                <div className={`${spec.color} text-lg mb-2`}>{spec.icon}</div>
                                <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest">{spec.label}</p>
                                <p className="font-bold text-slate-800 capitalize">{spec.value || 'N/A'}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                        <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2 uppercase text-xs tracking-widest">
                            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
                            About this Vehicle
                        </h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            {car.description || "No detailed description provided for this vehicle. Ensure all features are listed for better customer conversion."}
                        </p>
                    </div>

                    {/* SERVICE LOG TABLE */}
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
                                <FaCogs className="text-slate-400" /> Maintenance Log
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-slate-900 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-600 transition-all flex items-center gap-2"
                            >
                                <span>+</span> Log Service
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-slate-400 uppercase text-[10px] font-black">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Service Type</th>
                                        <th className="px-6 py-4">Mileage</th>
                                        <th className="px-6 py-4 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {service_logs.length > 0 ? service_logs.map((log) => (
                                        <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium">{new Date(log.service_date).toLocaleDateString('en-GB')}</td>
                                            <td className="px-6 py-4">
                                                <span className="bg-slate-100 px-2 py-1 rounded text-xs font-bold text-slate-700">{log.service_type}</span>
                                            </td>
                                            <td className="px-6 py-4">{Number(log.mileage_at_service)?.toLocaleString()} km</td>
                                            <td className="px-6 py-4 text-right font-black text-slate-900">K{log.cost}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-6 py-12 text-center text-slate-400 italic text-sm">No service records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <h3 className="font-bold text-slate-400 text-xs uppercase tracking-widest mb-6">Revenue Performance</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-3xl font-black text-white">K{Number(stats.total_revenue || 0).toLocaleString()}</p>
                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Total Life-time Earnings</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                    <p className="text-xl font-bold">{stats.total_trips || 0}</p>
                                    <p className="text-[9px] text-slate-500 uppercase font-black">Trips</p>
                                </div>
                                <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
                                    <p className={`text-xl font-bold ${stats.is_overdue ? 'text-rose-400' : 'text-emerald-400'}`}>
                                        {stats.is_overdue ? '⚠' : 'OK'}
                                    </p>
                                    <p className="text-[9px] text-slate-500 uppercase font-black">Health</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2 uppercase text-xs tracking-widest">
                            <FaCalendarAlt className="text-blue-500" /> Recent Bookings
                        </h3>
                        <div className="space-y-5">
                            {bookings.length > 0 ? bookings.slice(0, 5).map((book) => (
                                <div key={book.id} className="group flex items-start gap-3 pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-black shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                        {book.user_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-slate-800 truncate text-sm">{book.user_name}</p>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                                                book.status === 'completed' ? 'bg-blue-50 text-blue-600' : 
                                                book.status === 'cancelled' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                            }`}>
                                                {book.status}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {new Date(book.pickup_date).toLocaleDateString()} — {new Date(book.return_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center py-6">
                                    <p className="text-xs text-slate-400 italic">No bookings recorded yet.</p>
                                </div>
                            )}
                        </div>
                        {bookings.length > 5 && (
                            <button className="w-full mt-6 py-3 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-all">
                                View Full History ({bookings.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* SERVICE ENTRY MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="bg-slate-50 p-6 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-black text-slate-800 uppercase text-sm tracking-widest">New Service Record</h3>
                                <p className="text-xs text-slate-400 mt-1">Add maintenance details for {car.name}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-slate-600 shadow-sm">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddService} className="p-8 space-y-5">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Service Type</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Full Engine Service"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.service_date}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        onChange={(e) => setFormData({...formData, service_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Cost (ZMW)</label>
                                    <input 
                                        required
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Current Mileage (km)</label>
                                <input 
                                    type="number" 
                                    placeholder="Enter odometer reading"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
                                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-200 uppercase text-xs tracking-widest"
                            >
                                {submitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {submitting ? "Saving..." : "Commit Record"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}