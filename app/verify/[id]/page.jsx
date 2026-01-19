'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
    FaCheckCircle, FaGasPump, FaCogs, FaDownload, FaTimes, 
    FaPhoneAlt, FaWhatsapp, FaShieldAlt, FaMapMarkerAlt, FaHashtag, FaCarSide 
} from 'react-icons/fa';
import axios from 'axios';
import { generateBookingReceipt } from '@/utils/generateBookingReceipt';

export default function VerifyBooking() {
    const router = useRouter();
    const params = useParams();
    const bookingIdFromUrl = params?.id;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        if (!bookingIdFromUrl || bookingIdFromUrl === 'undefined') return;

        const fetchBooking = async () => {
            try {
                const res = await axios.get(`${BASE_API}/bookings/get-booking.php?id=${bookingIdFromUrl}`);
                setBooking(res.data);
            } catch (err) {
                console.error("Verification Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingIdFromUrl]);

    const handleDownload = async () => {
        if (!booking) return;
        await generateBookingReceipt({
            tx_ref: booking.transaction_code || booking.reference_code, 
            amount: booking.total_price,
            customer: {
                name: booking.customer_name || booking.name, 
                phone: booking.customer_phone || booking.phone,
                license: booking.license_number || booking.license,
                email: booking.customer_email
            },
            car: {
                name: booking.car_name,
                transmission: booking.transmission
            },
            dates: {
                from: booking.pickup_date,
                to: booking.return_date
            },
            booking_id: booking.booking_id
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="relative flex items-center justify-center mb-6">
                <div className="w-20 h-20 border-4 border-slate-200 rounded-2xl"></div>
                <div className="absolute w-20 h-20 border-4 border-green-600 border-t-transparent rounded-2xl animate-spin"></div>
                <FaCarSide className="absolute text-slate-900 text-2xl" />
            </div>
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-[0.3em] animate-pulse">Verifying Authenticity</h2>
        </div>
    );

    if (!booking) return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-100">
                <FaTimes size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Record Not Found</h2>
            <p className="text-slate-400 mt-2 mb-8 font-bold text-xs uppercase tracking-widest">Reference: {bookingIdFromUrl}</p>
            <button onClick={() => router.push('/')} className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em]">Return to Fleet</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900 relative">
            
            {/* BRAND HEADER (Matches PHP Invoice) */}
            <div className="bg-slate-900 pt-16 pb-32 px-6">
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg">
                            <FaCarSide className="text-green-600 text-lg" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tighter text-white">City<span className="text-green-500">Drive</span></h1>
                            <p className="text-[7px] uppercase tracking-[0.4em] font-bold text-slate-400">Premium Car Hire</p>
                        </div>
                    </div>
                    <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-xl mx-auto -mt-20 px-4">
                <div className="bg-white rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-white relative">
                    
                    {/* STATUS STRIP */}
                    <div className="bg-green-600 py-3 text-center">
                        <p className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                            <FaShieldAlt className="animate-pulse" /> Officially Verified Booking
                        </p>
                    </div>

                    <div className="p-8">
                        {/* VEHICLE INFO */}
                        <div className="text-center mb-8">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Booking Reference</p>
                            <div className="inline-block bg-slate-50 px-6 py-2 rounded-xl border border-slate-100 mb-6">
                                <span className="font-mono font-black text-lg tracking-[0.1em] text-slate-900">{booking.reference_code}</span>
                            </div>
                            
                            <img 
                                src={`/${booking.image_url}`} 
                                className="w-full h-56 object-cover rounded-[2.5rem] shadow-2xl mb-6 border-4 border-slate-50" 
                                alt={booking.car_name} 
                            />
                            
                            <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase">{booking.car_name}</h2>
                            <p className="text-xs font-bold text-slate-400 italic uppercase mt-1">{booking.color} • {booking.plate_number}</p>
                        </div>

                        {/* SPECS */}
                        <div className="grid grid-cols-2 gap-4 mb-10">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-600 shadow-sm"><FaCogs /></div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Gearbox</p>
                                    <p className="text-xs font-black uppercase">{booking.transmission}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-green-600 shadow-sm"><FaGasPump /></div>
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Fuel Policy</p>
                                    <p className="text-xs font-black uppercase">Level Match</p>
                                </div>
                            </div>
                        </div>

                        {/* DATES */}
                        <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-[2rem] overflow-hidden mb-10 border border-slate-100">
                            <div className="p-6 bg-white text-center">
                                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest mb-1">Pick-up</p>
                                <p className="text-sm font-black text-slate-900">{new Date(booking.pickup_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                            <div className="p-6 bg-white text-center">
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Return</p>
                                <p className="text-sm font-black text-slate-900">{new Date(booking.return_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>

                        {/* PRICE BOX */}
                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white text-center shadow-2xl shadow-slate-300 relative overflow-hidden">
                             <div className="absolute -right-4 -bottom-4 opacity-5 rotate-12">
                                <FaCarSide size={120} />
                             </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-3">Total Amount Paid</p>
                            <p className="text-5xl font-black tracking-tighter mb-8 italic">K{parseFloat(booking.total_price).toLocaleString()}</p>
                            
                            <button 
                                onClick={handleDownload}
                                className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-green-500 transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-green-900/40"
                            >
                                <FaDownload /> Download Digital Receipt
                            </button>
                        </div>
                    </div>

                    {/* RENTAL POLICY (Matches Invoice) */}
                    <div className="px-8 pb-10 border-t border-slate-50 pt-8">
                        <h4 className="text-[9px] font-black text-slate-900 uppercase tracking-[0.2em] mb-4 text-center">Rental Agreement Summary</h4>
                        <div className="space-y-3 text-[9px] text-slate-400 font-bold uppercase text-center opacity-70">
                            <p>01. Return with same fuel level as provided.</p>
                            <p>02. Renter is liable for traffic violations.</p>
                            <p>03. Late returns (2hr+) incur full day charge.</p>
                        </div>
                    </div>
                </div>
                
                {/* FOOTER CONTACTS */}
                <div className="mt-10 flex flex-col items-center">
                    <div className="flex gap-4 w-full max-w-xs mb-8">
                        <a href="tel:0972338115" className="flex-1 flex flex-col items-center gap-2 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-green-400 transition-all">
                            <FaPhoneAlt size={12} className="text-green-600" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Call Support</span>
                        </a>
                        <a href="https://wa.me/260972338115" className="flex-1 flex flex-col items-center gap-2 py-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:border-green-400 transition-all">
                            <FaWhatsapp size={16} className="text-[#25D366]" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">WhatsApp</span>
                        </a>
                    </div>
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                        CityDrive Hire • Lusaka, Zambia
                    </p>
                </div>
            </div>
        </div>
    );
}