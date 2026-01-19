'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { 
    FaMapMarkerAlt, FaCalendarAlt, FaDownload, 
    FaCar, FaSearch, FaCalendarDay, FaTimes,
    FaGasPump, FaCogs, FaUsers, FaShieldAlt, FaReceipt, FaCheckCircle
} from 'react-icons/fa';
// Import the utility we created
import { generateBookingReceipt } from '@/utils/generateBookingReceipt';

 const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

const api = axios.create({
    baseURL: BASE_API,
    timeout: 15000,
});

export default function BookingsMasterPage() {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);
    
    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) { fetchBookings(); }
        else if (status !== 'loading') { setLoading(false); }
    }, [session, status]);

    const fetchBookings = async () => {
        try {
            const res = await api.get('/bookings/me.php', { params: { user_id: session.user.id } });
            setBookings(Array.isArray(res.data) ? res.data : []);
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // TRIGGER RECEIPT GENERATION
    const handleDownloadReceipt = async (e, b) => {
        e.stopPropagation();
        try {
            await generateBookingReceipt({
                tx_ref: b.transaction_code || `TXN-${b.booking_id}`,
                amount: b.total_price,
                customer: {
                    name: session?.user?.name || "Customer",
                    phone: b.customer_phone || "N/A",
                    license: b.license_number || "Verified",
                    email: session?.user?.email
                },
                car: {
                    name: b.car_name,
                    transmission: b.transmission || "Automatic"
                },
                dates: {
                    from: b.pickup_date,
                    to: b.return_date
                },
                booking_id: b.booking_id
            });
        } catch (err) {
            alert("Error generating PDF. Please try again.");
        }
    };

    const filteredBookings = useMemo(() => {
        return bookings.filter(b => {
            const matchesSearch = b.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) || String(b.booking_id).includes(searchTerm);
            const matchesStatus = filterStatus === 'All' || b.status === filterStatus;
            return matchesSearch && matchesStatus;
        });
    }, [bookings, searchTerm, filterStatus]);

    if (loading) return <div className="p-20 text-center animate-pulse text-gray-400 font-black text-xs uppercase tracking-widest">Accessing Emit Photography Vault...</div>;

    return (
        <div className="max-w-8xl mx-auto py-10 px-4 font-sans">
            {/* BRANDED HEADER */}
            <header className="mb-10 space-y-6">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Emit Logistics</p>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Booking Vault</h1>
                    </div>
                </div>
                
                <div className="bg-white p-4 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-50 flex flex-col xl:flex-row gap-4">
                    <div className="relative flex-1">
                        <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" />
                        <input 
                            type="text" placeholder="Search vehicle or ID..." 
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-[1.5rem] border-none text-sm font-bold focus:ring-2 focus:ring-green-500/20"
                            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex bg-gray-50 p-1.5 rounded-[1.5rem] overflow-x-auto no-scrollbar">
                        {['All', 'Upcoming', 'Completed', 'Pending'].map((s) => (
                            <button key={s} onClick={() => setFilterStatus(s)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400'}`}>{s}</button>
                        ))}
                    </div>
                </div>
            </header>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBookings.map((booking) => (
                    <div 
                        key={booking.booking_id} 
                        onClick={() => setSelectedBooking(booking)}
                        className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden"
                    >
                        <div className="h-44 bg-gray-50 flex items-center justify-center relative">
                            <span className={`absolute top-6 left-6 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                {booking.status}
                            </span>
                            <FaCar className="text-gray-200 text-7xl group-hover:scale-110 transition-transform duration-700" />
                        </div>

                        <div className="p-8">
                            <h3 className="text-xl font-black text-gray-900 mb-1">{booking.car_name}</h3>
                            <p className="text-xs font-bold text-gray-400 mb-4 flex items-center gap-2">
                                <FaCalendarAlt size={10}/> {booking.pickup_date}
                            </p>
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <p className="text-lg font-black text-gray-900">K{Number(booking.total_price).toLocaleString()}</p>
                                <div className="p-2 bg-gray-50 rounded-lg text-gray-400 group-hover:text-green-600 transition-colors">
                                    <FaReceipt />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* PROFESSIONAL PAYMENT/RECEIPT MODAL */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-md" onClick={() => setSelectedBooking(null)}></div>
                    
                    <div className="relative bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                        <button onClick={() => setSelectedBooking(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors z-20">
                            <FaTimes size={20} />
                        </button>

                        <div className="grid grid-cols-1 md:grid-cols-2">
                            {/* Visual Summary Side */}
                            <div className="bg-green-600 p-12 text-white flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                        <FaCheckCircle size={24} />
                                    </div>
                                    <h2 className="text-3xl font-black leading-tight">Booking<br/>Verified</h2>
                                    <p className="mt-4 text-green-100 font-mono text-xs uppercase tracking-widest">ID: {selectedBooking.booking_id}</p>
                                </div>
                                
                                <div className="space-y-4 pt-10">
                                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-3 rounded-2xl">
                                        <FaCogs className="text-green-200" /> {selectedBooking.transmission || 'Automatic'}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm font-bold bg-white/10 p-3 rounded-2xl">
                                        <FaShieldAlt className="text-green-200" /> Full Coverage
                                    </div>
                                </div>
                            </div>

                            {/* Payment Details Side */}
                            <div className="p-10 bg-white">
                                <div className="mb-8">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Total Paid</p>
                                    <h3 className="text-4xl font-black text-gray-900">K{Number(selectedBooking.total_price).toLocaleString()}</h3>
                                    <p className="text-[10px] text-green-600 font-bold mt-1 italic">Payment successfully settled via Mobile Money</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><FaCalendarAlt size={14}/></div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Duration</p>
                                            <p className="text-xs font-bold text-gray-800">{selectedBooking.pickup_date} to {selectedBooking.return_date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"><FaMapMarkerAlt size={14}/></div>
                                        <div>
                                            <p className="text-[9px] font-black text-gray-400 uppercase">Pickup Location</p>
                                            <p className="text-xs font-bold text-gray-800">City Drive Hub, Lusaka</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12">
                                    {selectedBooking.status === 'Completed' || selectedBooking.status === 'Upcoming' ? (
                                        <button 
                                            onClick={(e) => handleDownloadReceipt(e, selectedBooking)}
                                            className="w-full bg-gray-900 text-white py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3 active:scale-95"
                                        >
                                            <FaDownload className="animate-pulse" /> Get Digital Receipt
                                        </button>
                                    ) : (
                                        <div className="p-4 bg-orange-50 rounded-2xl border border-orange-100 text-center">
                                            <p className="text-[10px] font-bold text-orange-700 uppercase">Payment Pending</p>
                                        </div>
                                    )}
                                    <p className="text-center text-[9px] text-gray-400 mt-6 font-medium">Managed by Emit Photography & Logistics</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}