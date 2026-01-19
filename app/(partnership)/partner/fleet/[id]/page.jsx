'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
    FaArrowLeft, FaChartLine, FaCalendarCheck, 
    FaMoneyBillWave, FaInfoCircle, FaHistory,
    FaChevronLeft, FaChevronRight, FaCar, FaGasPump, FaCogs, FaUsers
} from 'react-icons/fa';

export default function VehicleDetailsPage() {
    const { id } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImg, setActiveImg] = useState(0);

    const Public_Api = "https://api.citydrivehire.com";

    const getFullImagePath = (path) => {
    if (!path) return '';
    // Remove leading slash from path if it exists to prevent double slashes
    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${Public_Api}/${cleanPath}`;
};

    useEffect(() => {
        const fetchDetails = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(
                    `${Public_Api}/partners/get-vehicle-details.php?vehicle_id=${id}&user_id=${session.user.id}`
                );
                const result = await res.json();
                if (result.success) {
                    setData(result.data);
                }
            } catch (error) {
                console.error("Error fetching vehicle data");
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, session]);

    if (loading) return <div className="p-20 text-center text-gray-400 animate-pulse">Accessing Emit Photography Records...</div>;
    if (!data) return <div className="p-20 text-center">Vehicle data unavailable.</div>;

    const { info, history } = data;
    const images = info.image_list || [];

    const slideNext = () => setActiveImg((prev) => (prev + 1) % images.length);
    const slidePrev = () => setActiveImg((prev) => (prev - 1 + images.length) % images.length);

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-green-600 mb-3 transition-all">
                        <FaArrowLeft /> Back to Fleet
                    </button>
                    <h1 className="text-4xl font-extrabold text-gray-900">{info.name}</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-sm font-mono border uppercase">{info.plate_number}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-sm">{info.type}</span>
                    </div>
                </div>
                <div className={`px-6 py-2 rounded-full font-bold text-sm shadow-sm border ${
                    info.available == 1 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'
                }`}>
                    {info.available == 1 ? '● AVAILABLE' : '● CURRENTLY BOOKED'}
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatBox 
    label="Total Earnings" 
    value={`ZMW ${Number(info.total_revenue).toLocaleString()}`} 
    icon={<FaMoneyBillWave />} 
    color="text-green-600" 
/>
                <StatBox label="Trips Completed" value={info.total_bookings} icon={<FaCalendarCheck />} color="text-blue-600" />
                <StatBox label="Daily Pricing" value={`ZMW ${info.price_per_day}`} icon={<FaChartLine />} color="text-purple-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Carousel & Features */}
                <div className="lg:col-span-5 space-y-8">
                    {/* Carousel Container */}
<div className="bg-white p-2 rounded-3xl shadow-xl border border-gray-100">
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 group">
        {images && images.length > 0 ? (
            <>
                <img 
                    src={`${Public_Api}/public/${images[activeImg].replace(/^\//, '')}`} 
                    className="w-full h-full object-cover" 
                    alt="Vehicle Gallery" 
                    onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x450?text=Image+Not+Found';
                    }}
                />
                {images.length > 1 && (
                    <>
                        <button onClick={slidePrev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><FaChevronLeft /></button>
                        <button onClick={slideNext} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg"><FaChevronRight /></button>
                    </>
                )}
            </>
        ) : (
            <div className="h-full flex items-center justify-center text-gray-400 font-medium">
                No images available for this vehicle
            </div>
        )}
    </div>
    
    {/* Thumbnails */}
    <div className="flex gap-2 p-3 overflow-x-auto">
        {images && images.map((img, idx) => (
            <button 
                key={idx} 
                onClick={() => setActiveImg(idx)}
                className={`min-w-[70px] h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === activeImg ? 'border-green-500' : 'border-transparent opacity-40'}`}
            >
                <img src={`${Public_Api}/public/${img.replace(/^\//, '')}`} className="w-full h-full object-cover" />
            </button>
        ))}
    </div>
</div>

                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2 text-lg"><FaInfoCircle className="text-gray-400" /> Details</h3>
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <Feature label="Transmission" value={info.transmission} icon={<FaCogs />} />
                            <Feature label="Fuel" value={info.fuel} icon={<FaGasPump />} />
                            <Feature label="Capacity" value={`${info.seats} Seats`} icon={<FaUsers />} />
                            <Feature label="Color" value={info.color} />
                        </div>
                    </div>
                </div>

                {/* Right: Booking History */}
                <div className="lg:col-span-7">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2"><FaHistory className="text-gray-400" /> Rental History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-[11px] font-bold text-gray-400 uppercase bg-gray-50/50">
                                        <th className="px-8 py-4 text-left">Client</th>
                                        <th className="px-8 py-4 text-left">Duration</th>
                                        <th className="px-8 py-4 text-left">Total</th>
                                        <th className="px-8 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {history.map((b) => (
                                        <tr key={b.booking_id} className="text-sm hover:bg-gray-50/50 transition-colors">
                                            <td className="px-8 py-5 font-bold text-gray-900">{b.customer_name}</td>
                                            <td className="px-8 py-5 text-gray-500">
                                                <div>{b.pickup_date}</div>
                                                <div className="text-[11px] opacity-60">to {b.return_date}</div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <div className="font-bold text-gray-900">ZMW {parseFloat(b.total_price).toLocaleString()}</div>
                                                <div className="text-[10px] text-green-600 font-bold">{b.payment_status}</div>
                                            </td>
                                            <td className="px-8 py-5 text-right">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                    b.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {history.length === 0 && (
                                        <tr><td colSpan="4" className="py-20 text-center text-gray-400 italic">No bookings found for this vehicle.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatBox({ label, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`text-2xl ${color} bg-gray-50 w-12 h-12 flex items-center justify-center rounded-2xl`}>{icon}</div>
            <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
                <p className={`text-2xl font-black text-gray-900`}>{value}</p>
            </div>
        </div>
    );
}

function Feature({ label, value, icon }) {
    return (
        <div className="flex items-center gap-3">
            <div className="text-gray-300 text-lg">{icon}</div>
            <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase">{label}</p>
                <p className="text-sm font-bold text-gray-800">{value}</p>
            </div>
        </div>
    );
}