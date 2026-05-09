'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
    FaCheckCircle,
    FaGasPump,
    FaCogs,
    FaDownload,
    FaTimes,
    FaPhoneAlt,
    FaWhatsapp,
    FaShieldAlt,
    FaCarSide,
    FaUser,
    FaIdCard,
    FaEnvelope,
    FaCalendarAlt,
    FaMoneyBill
} from 'react-icons/fa';
import axios from 'axios';
import { generateBookingReceipt } from '@/utils/generateBookingReceipt';

export default function VerifyBooking() {
    const router = useRouter();
    const params = useParams();
    const bookingIdFromUrl = params?.id;

    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    const BASE_API =
        process.env.NEXT_PUBLIC_API_URL ||
        'https://api.citydrivehire.com';

   useEffect(() => {
    if (!bookingIdFromUrl || bookingIdFromUrl === 'undefined') return;

    const fetchBooking = async () => {
        try {
            setLoading(true);

            const res = await axios.get(
                `${BASE_API}/bookings/get-booking.php?id=${bookingIdFromUrl}`
            );

            const responseData = res.data;

            // Check if success is true and if the nested data object exists
            if (responseData.success && responseData.data) {
                // Set ONLY the inner data object to your state
                setBooking(responseData.data); 
            } else {
                setBooking(null);
            }
        } catch (err) {
            console.error('Verification Error:', err);
            setBooking(null);
        } finally {
            setLoading(false);
        }
    };

    fetchBooking();
}, [bookingIdFromUrl, BASE_API]);
    const handleDownload = async () => {
        if (!booking) return;

        await generateBookingReceipt({
            tx_ref:
                booking.transaction_code ||
                booking.reference_code ||
                booking.booking_id,

            amount: booking.total_price || 0,

            customer: {
                name: booking.customer_name || 'Customer',
                phone: booking.customer_phone || 'N/A',
                license: booking.license_number || 'N/A',
                email: booking.customer_email || 'N/A'
            },

            car: {
                name: booking.car_name,
                transmission: booking.transmission || 'Automatic'
            },

            dates: {
                from: booking.pickup_date,
                to: booking.return_date
            },

            booking_id: booking.booking_id
        });
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center animate-pulse">
                    <FaCarSide className="text-3xl mx-auto mb-4 text-slate-800" />
                    <p className="text-xs font-black uppercase tracking-[0.3em]">
                        Verifying Booking
                    </p>
                </div>
            </div>
        );
    }

    // ================= NOT FOUND =================
    if (!booking) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
                <FaTimes className="text-red-500 text-4xl mb-4" />
                <h2 className="text-xl font-black">Booking Not Found</h2>
                <p className="text-xs text-gray-400 mt-2">
                    Reference: {bookingIdFromUrl}
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="mt-6 px-6 py-3 bg-black text-white rounded-xl text-xs font-bold uppercase"
                >
                    Go Home
                </button>
            </div>
        );
    }

    const imageUrl = booking.image_url
        ? booking.image_url.startsWith('http')
            ? booking.image_url
            : `${BASE_API}/${booking.image_url}`
        : null;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">

            {/* HEADER */}
            <div className="bg-slate-900 pt-14 pb-28 px-6 text-white">
                <div className="max-w-xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <FaCarSide className="text-green-500 text-xl" />
                        <div>
                            <h1 className="font-black text-lg">
                                CityDrive
                            </h1>
                            <p className="text-[8px] uppercase tracking-widest text-gray-400">
                                Verification Portal
                            </p>
                        </div>
                    </div>

                    <button onClick={() => router.push('/')}>
                        <FaTimes />
                    </button>
                </div>
            </div>

            {/* CARD */}
            <div className="max-w-xl mx-auto -mt-20 px-4">

                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden">

                    {/* VERIFIED BAR */}
                    <div className="bg-green-600 text-white text-center py-3">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] flex justify-center items-center gap-2">
                            <FaShieldAlt /> Verified Booking
                        </p>
                    </div>

                    <div className="p-6">

                        {/* CAR INFO */}
                        <div className="text-center mb-6">
                            <p className="text-[10px] text-gray-400 uppercase font-black">
                                Booking Ref
                            </p>

                            <h3 className="font-mono font-black text-lg mb-3">
                                {booking.reference_code}
                            </h3>

                            {imageUrl && (
                                <img
                                    src={imageUrl}
                                    className="w-full h-52 object-cover rounded-2xl mb-4"
                                    alt={booking.car_name}
                                />
                            )}

                            <h2 className="text-2xl font-black uppercase">
                                {booking.car_name}
                            </h2>
                        </div>

                        {/* CAR SPECS */}
                        <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <FaCogs className="text-green-600 mb-1" />
                                {booking.transmission}
                            </div>

                            <div className="p-3 bg-gray-50 rounded-xl">
                                <FaGasPump className="text-green-600 mb-1" />
                                {booking.fuel || 'Fuel Included'}
                            </div>
                        </div>

                        {/* CUSTOMER DETAILS */}
                        <div className="bg-gray-50 p-4 rounded-2xl mb-6 space-y-2 text-xs">
                            <p className="font-black uppercase text-[10px] text-gray-400">
                                Customer Details
                            </p>

                            <div className="flex items-center gap-2">
                                <FaUser /> {booking.customer_name || 'N/A'}
                            </div>

                            <div className="flex items-center gap-2">
                                <FaPhoneAlt /> {booking.customer_phone || 'N/A'}
                            </div>

                            <div className="flex items-center gap-2">
                                <FaEnvelope /> {booking.customer_email || 'N/A'}
                            </div>

                            <div className="flex items-center gap-2">
                                <FaIdCard /> {booking.license_number || 'N/A'}
                            </div>
                        </div>

                        {/* DATES */}
                        <div className="flex justify-between text-xs mb-6">
                            <div>
                                <p className="text-gray-400 uppercase">Pickup</p>
                                <p className="font-black">
                                    {booking.pickup_date}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-400 uppercase">Return</p>
                                <p className="font-black">
                                    {booking.return_date}
                                </p>
                            </div>
                        </div>

                        {/* PRICE */}
                        <div className="bg-slate-900 text-white p-6 rounded-2xl text-center">
                            <p className="text-[10px] uppercase tracking-widest">
                                Total Paid
                            </p>

                            <h3 className="text-3xl font-black mt-1">
                                K{Number(booking.total_price || 0).toLocaleString()}
                            </h3>

                            <button
                                onClick={handleDownload}
                                className="mt-5 w-full bg-green-600 py-3 rounded-xl text-xs font-black uppercase flex items-center justify-center gap-2"
                            >
                                <FaDownload /> Download Receipt
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}