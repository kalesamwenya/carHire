'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
    FaEdit, FaTrash, FaArrowLeft, FaGasPump, FaCogs, 
    FaUsers, FaCalendarAlt, FaHistory, FaSpinner, FaCar,
    FaTimes, FaSave, FaExclamationTriangle
} from 'react-icons/fa';

export default function CarDetailsPage() {
    const params = useParams();
    const id = params?.id;

    const [data, setData] = useState({ car: null, bookings: [], service_logs: [], stats: {} });
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [formData, setFormData] = useState({
        service_type: '',
        service_date: new Date().toISOString().split('T')[0],
        cost: '',
        mileage: '',
        notes: ''
    });

    // Single useEffect to fetch all data via the updated PHP API
    useEffect(() => {
        async function fetchAllDetails() {
            if (!id) return;
            try {
                const res = await fetch(`http://api.citydrivehire.local/admin/get_car_details.php?id=${id}`);
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
        }
        fetchAllDetails();
    }, [id]);

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://api.citydrivehire.com/admin/add_service_log.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, car_id: id }),
            });
            const result = await res.json();
            if (result.success) {
                setIsModalOpen(false);
                window.location.reload(); 
            }
        } catch (error) {
            console.error("Error saving service log:", error);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-purple-600">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    );

    const { car, bookings, service_logs, stats } = data;
    if (!car) return <div className="p-10 text-center">Vehicle not found.</div>;

    return (
        <div className="space-y-6 max-w-6xl mx-auto pb-10">
            
            {/* 1. MAINTENANCE ALERT BANNER */}
            {stats.is_overdue && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-center justify-between shadow-sm animate-pulse">
                    <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full text-red-600">
                            <FaExclamationTriangle />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-red-800">Maintenance Overdue</h4>
                            <p className="text-xs text-red-600">
                                Last service: <b>{stats.last_service_date}</b>. Please schedule maintenance for this vehicle.
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-red-700 transition-colors"
                    >
                        Log Service Now
                    </button>
                </div>
            )}

            {/* 2. Header with Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-all">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{car.name}</h1>
                        <div className="flex items-center gap-3 text-sm mt-1">
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-mono">{car.plate_number}</span>
                            <span className={`px-2 py-0.5 rounded font-bold border ${
                                car.available == 1 
                                ? "text-green-600 bg-green-50 border-green-100" 
                                : "text-red-600 bg-red-50 border-red-100"
                            }`}>
                                {car.available == 1 ? "Available" : "Rented / Unavailable"}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Link href={`/admin/cars/${id}/edit`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm font-bold shadow-sm">
                        <FaEdit /> Edit
                    </Link>
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg hover:bg-red-100 text-sm font-bold shadow-sm transition-colors">
                        <FaTrash /> Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: Vehicle Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="h-80 bg-slate-100 rounded-2xl overflow-hidden flex items-center justify-center relative group shadow-inner border border-gray-100">
                        {car.image_url ? (
                            <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
                        ) : (
                            <FaCar className="text-gray-300 text-6xl" />
                        )}
                        <div className="absolute bottom-6 right-6 bg-slate-900/90 text-white px-4 py-2 rounded-xl text-lg font-black shadow-lg">
                            K{car.price_per_day} <span className="text-xs font-normal text-slate-400">/ day</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaGasPump className="text-blue-500 mx-auto text-xl mb-2" />
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Fuel</p>
                            <p className="font-bold text-gray-800 capitalize">{car.fuel || 'N/A'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaCogs className="text-slate-500 mx-auto text-xl mb-2" />
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Gearbox</p>
                            <p className="font-bold text-gray-800 capitalize">{car.transmission || 'Manual'}</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaUsers className="text-purple-500 mx-auto text-xl mb-2" />
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Capacity</p>
                            <p className="font-bold text-gray-800">{car.seats || 5} Seats</p>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm text-center">
                            <FaHistory className="text-green-500 mx-auto text-xl mb-2" />
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Color</p>
                            <p className="font-bold text-gray-800 capitalize">{car.color || 'Standard'}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-2">About this Vehicle</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            {car.description || "No description provided for this vehicle."}
                        </p>
                    </div>

                    {/* SERVICE LOG TABLE */}
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                <FaCogs className="text-gray-400" /> Maintenance & Service Log
                            </h3>
                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="bg-slate-900 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors"
                            >
                                + Add Entry
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 uppercase font-bold">
                                    <tr>
                                        <th className="px-4 py-2">Date</th>
                                        <th className="px-4 py-2">Service Type</th>
                                        <th className="px-4 py-2">Mileage</th>
                                        <th className="px-4 py-2 text-right">Cost</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {service_logs.length > 0 ? service_logs.map((log) => (
                                        <tr key={log.id}>
                                            <td className="px-4 py-3">{new Date(log.service_date).toLocaleDateString()}</td>
                                            <td className="px-4 py-3 font-medium text-gray-900">{log.service_type}</td>
                                            <td className="px-4 py-3">{log.mileage_at_service?.toLocaleString()} km</td>
                                            <td className="px-4 py-3 text-right font-bold text-gray-800">K{log.cost}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-400 italic">No service records found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Sidebar Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4">Performance</h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Total Trips</span>
                                <span className="font-bold text-gray-900">{stats.total_trips || 0}</span>
                            </div>
                            <div className="flex justify-between items-center pb-2 border-b border-gray-50">
                                <span className="text-sm text-gray-600">Life-time Revenue</span>
                                <span className="font-bold text-green-600">K{stats.total_revenue?.toLocaleString() || 0}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Health Status</span>
                                <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                                    stats.is_overdue ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                                }`}>
                                    {stats.is_overdue ? 'Urgent Service' : 'Good Condition'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaCalendarAlt className="text-gray-400" /> Booking Activities
                        </h3>
                        <div className="space-y-4">
                            {bookings.length > 0 ? bookings.slice(0, 5).map((book) => (
                                <div key={book.id} className="flex items-start gap-3 text-sm pb-3 border-b border-gray-50 last:border-0">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-[10px] font-bold shrink-0">
                                        {book.user_name.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <p className="font-bold text-gray-800 truncate">{book.user_name}</p>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold capitalize ${
                                                book.status === 'completed' ? 'bg-blue-50 text-blue-600' : 
                                                book.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                            }`}>
                                                {book.status}
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-gray-400">
                                            {new Date(book.pickup_date).toLocaleDateString()} - {new Date(book.return_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-xs text-gray-400 py-4 italic">No rental history found.</p>
                            )}
                        </div>
                        {bookings.length > 5 && (
                            <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                                View Full History ({bookings.length})
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* SERVICE ENTRY MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-50 p-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-gray-800">New Service Record</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>

                        <form onSubmit={handleAddService} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Service Type</label>
                                <input 
                                    required
                                    type="text" 
                                    placeholder="e.g. Oil Change"
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-slate-200"
                                    onChange={(e) => setFormData({...formData, service_type: e.target.value})}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Date</label>
                                    <input 
                                        type="date" 
                                        value={formData.service_date}
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                        onChange={(e) => setFormData({...formData, service_date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Cost (K)</label>
                                    <input 
                                        required
                                        type="number" 
                                        placeholder="0.00"
                                        className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                        onChange={(e) => setFormData({...formData, cost: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Mileage (km)</label>
                                <input 
                                    type="number" 
                                    placeholder="Current odometer"
                                    className="w-full p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                                    onChange={(e) => setFormData({...formData, mileage: e.target.value})}
                                />
                            </div>

                            <button 
                                type="submit"
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-200"
                            >
                                <FaSave /> Save Record
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}