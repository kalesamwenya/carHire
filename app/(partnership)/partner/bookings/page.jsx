'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { FaCheck, FaTimes, FaCalendarAlt, FaUser, FaCar } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function BookingRequestsPage() {
    const { data: session } = useSession();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

     const Public_Api = "https://api.citydrivehire.com";

    const fetchRequests = async () => {
        try {
            const res = await fetch(`${Public_Api}/partner/manage-booking.php?user_id=${session.user.id}`);
            const result = await res.json();
            if (result.success) setRequests(result.data);
        } catch (error) {
            toast.error("Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { if (session?.user?.id) fetchRequests(); }, [session]);

    const handleAction = async (id, status) => {
        try {
            const res = await fetch(`${Public_Api}/partner/manage-booking.php`, {
                method: 'POST',
                body: JSON.stringify({ booking_id: id, status })
            });
            const result = await res.json();
            if (result.success) {
                toast.success(`Booking ${status}`);
                fetchRequests(); // Refresh list
            }
        } catch (error) {
            toast.error("Action failed");
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>
            
            <div className="space-y-4">
                {requests.map((req) => (
                    <div key={req.id} className="bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center"><FaCar /></div>
                                <div>
                                    <p className="text-sm font-bold">{req.car_name}</p>
                                    <p className="text-xs text-gray-500">{req.plate_number}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center"><FaUser /></div>
                                <div>
                                    <p className="text-sm font-bold">{req.customer_name}</p>
                                    <p className="text-xs text-gray-500">{req.customer_email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center"><FaCalendarAlt /></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-700">{req.start_date} → {req.end_date}</p>
                                    <p className="text-xs font-bold text-green-600">ZMW {req.total_price}</p>
                                </div>
                            </div>
                        </div>

                        {req.status === 'Pending' ? (
                            <div className="flex gap-2 w-full md:w-auto">
                                <button onClick={() => handleAction(req.id, 'Confirmed')} className="flex-1 md:flex-none px-4 py-2 bg-green-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-all"><FaCheck /> Accept</button>
                                <button onClick={() => handleAction(req.id, 'Cancelled')} className="flex-1 md:flex-none px-4 py-2 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"><FaTimes /> Decline</button>
                            </div>
                        ) : (
                            <span className={`px-4 py-2 rounded-lg text-sm font-bold ${req.status === 'Confirmed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {req.status}
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}