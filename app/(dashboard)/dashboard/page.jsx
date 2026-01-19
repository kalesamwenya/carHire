'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { 
    FaCar, FaHistory, FaCalendarAlt, FaSearch, 
    FaCheckCircle, FaWallet, FaCogs, FaSpinner 
} from 'react-icons/fa';

export default function EmitCommandCenter() {
    const { data: session, status } = useSession();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

     const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    // --- 1. Consolidated Fetch Function ---
    const fetchBookings = useCallback(async () => {
        if (!session?.user?.id) return;
        
        try {
            const baseUrl = `${BASE_API}/http://api.citydrivehire.local/bookings/me.php`;
            const res = await fetch(`${baseUrl}?user_id=${session.user.id}`, {
                cache: 'no-store'
            });
            
            if (res.ok) {
                const data = await res.json();
                setBookings(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    // --- 2. Single Effect for Auth & Initial Load ---
    useEffect(() => {
        if (status === 'authenticated') {
            fetchBookings();
        } else if (status === 'unauthenticated') {
            setLoading(false);
        }
    }, [status, fetchBookings]);

    // --- 3. Data Intelligence (Calculated from Triple-Join Data) ---
    const stats = useMemo(() => {
        const active = bookings.filter(b => 
            ['active', 'confirmed', 'upcoming'].includes(b.booking_status?.toLowerCase())
        );
        
        const completed = bookings.filter(b => b.booking_status?.toLowerCase() === 'completed');
        
        const totalSpent = bookings.reduce((acc, curr) => {
            // Using amount_paid from the payments table join
            return acc + (Number(curr.amount_paid) || 0);
        }, 0);
        
        const utility = bookings.reduce((acc, b) => {
            if (b.car_name) {
                acc[b.car_name] = (acc[b.car_name] || 0) + 1;
            }
            return acc;
        }, {});

        return { active, completed, totalSpent, utility };
    }, [bookings]);

    const filteredHistory = bookings
        .filter(b => b.car_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 10);

    // --- 4. Render Logic ---
    if (loading || status === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8F9FA]">
                <FaSpinner className="animate-spin text-green-500 text-4xl mb-4" />
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Syncing Emit Photography Fleet...</p>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return <div className="p-20 text-center font-black uppercase text-gray-400">Please sign in to view dashboard</div>;
    }

    return (
        <div className="max-w-8xl mx-auto p-4 md:p-6 space-y-8 bg-[#F8F9FA] min-h-screen font-sans animate-in fade-in duration-700">
            
            {/* TIER 1: HEADER */}
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">Dashboard Center</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Logistics for <span className="text-gray-900 font-bold">{session.user.name}</span></p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
                    <div className="pl-4 pr-2 text-right">
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Total Investment</p>
                        <p className="text-xl font-black text-gray-900 leading-none">K{stats.totalSpent.toLocaleString()}</p>
                    </div>
                    <div className="h-10 w-[1px] bg-gray-100" />
                    <div className="bg-gray-900 text-white p-3 rounded-xl">
                        <FaWallet />
                    </div>
                </div>
            </header>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <QuickStat label="Active Fleet" value={stats.active.length} icon={<FaCar />} trend="Live Now" color="bg-green-500" />
                <QuickStat label="Total Trips" value={stats.completed.length} icon={<FaCheckCircle />} trend="Lifetime" color="bg-blue-500" />
                <QuickStat label="Utilized Models" value={Object.keys(stats.utility).length} icon={<FaCogs />} trend="Fleet Variety" color="bg-purple-500" />
                <QuickStat label="Pending" value={bookings.filter(b => b.booking_status?.toLowerCase() === 'pending').length} icon={<FaHistory />} trend="In Review" color="bg-orange-500" />
            </div>

            {/* TIER 2: ANALYTICS & CURRENT SESSION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="font-black text-xl text-gray-900 tracking-tight">Fleet Utility</h3>
                    </div>
                    <div className="space-y-6">
                        {Object.entries(stats.utility).length > 0 ? (
                            Object.entries(stats.utility).sort((a,b) => b[1] - a[1]).slice(0, 3).map(([name, count]) => (
                                <div key={name} className="group">
                                    <div className="flex justify-between mb-2 text-[11px] font-black uppercase">
                                        <span>{name}</span>
                                        <span className="text-green-600">{count} Trips</span>
                                    </div>
                                    <div className="h-3 bg-gray-50 rounded-full overflow-hidden border">
                                        <div 
                                            className="h-full bg-gray-900 group-hover:bg-green-500 transition-all duration-700" 
                                            style={{ width: `${(count / bookings.length) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))
                        ) : <EmptyState message="No utility data available" />}
                    </div>
                </div>

                <div className="bg-green-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
                    <div className="relative z-10">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Current Session</p>
                        {stats.active[0] ? (
                            <>
                                <h4 className="text-2xl font-black mb-2">{stats.active[0].car_name}</h4>
                                <p className="text-sm font-bold opacity-90 mb-6 flex items-center gap-2">
                                    <FaCalendarAlt /> Ends {new Date(stats.active[0].return_date).toLocaleDateString()}
                                </p>
                                <div className="space-y-2">
                                    <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-1 rounded-md block w-fit">
                                        Plate: {stats.active[0].plate_number}
                                    </span>
                                    <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-1 rounded-md block w-fit">
                                        Color: {stats.active[0].color}
                                    </span>
                                </div>
                            </>
                        ) : <p className="font-bold">No active sessions.</p>}
                    </div>
                    <FaCar className="absolute -bottom-6 -right-6 text-white/10 text-[120px] -rotate-12" />
                </div>
            </div>

            {/* TIER 3: OPERATIONS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section>
                    <h3 className="text-xl font-black text-gray-900 flex items-center gap-3 mb-6 px-2">
                        <FaCalendarAlt className="text-green-500" /> Upcoming Fleet
                    </h3>
                    <div className="space-y-4">
                        {stats.active.length > 1 ? (
                            stats.active.slice(1).map(booking => (
                                <ActivityRow key={booking.internal_id} booking={booking} type="upcoming" />
                            ))
                        ) : <EmptyState message="No future bookings scheduled" />}
                    </div>
                </section>

                <section>
                    <div className="flex items-center justify-between mb-6 px-2">
                        <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                            <FaHistory className="text-gray-400" /> Recent Activity
                        </h3>
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xs" />
                            <input 
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search History..." 
                                className="pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 w-40"
                            />
                        </div>
                    </div>
                    <div className="bg-white rounded-[2rem] border border-gray-100 overflow-hidden shadow-sm">
                        {filteredHistory.map((booking, idx) => (
                            <ActivityRow 
                                key={booking.internal_id} 
                                booking={booking} 
                                type="history" 
                                isLast={idx === filteredHistory.length - 1} 
                            />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

// --- Helper Components ---
function QuickStat({ label, value, icon, trend, color }) {
    return (
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-white`}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest">{label}</p>
                <p className="text-[9px] font-bold text-green-600 uppercase tracking-tighter mt-1">{trend}</p>
            </div>
        </div>
    );
}

function ActivityRow({ booking, type, isLast }) {
    const isUpcoming = type === 'upcoming';
    return (
        <div className={`flex items-center justify-between p-5 bg-white ${isLast ? '' : 'border-b border-gray-50'}`}>
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUpcoming ? 'bg-green-50 text-green-600' : 'bg-gray-50 text-gray-400'}`}>
                    <FaCar size={16} />
                </div>
                <div>
                    <h5 className="font-black text-gray-900 text-sm">{booking.car_name}</h5>
                    <p className="text-[9px] font-bold text-gray-400 uppercase">REF: {booking.booking_id}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-black text-gray-900 text-sm italic">K{Number(booking.quoted_price).toLocaleString()}</p>
                <p className="text-[9px] font-bold text-gray-400 uppercase">{new Date(booking.pickup_date).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

function EmptyState({ message }) {
    return (
        <div className="py-12 text-center bg-white border-2 border-dashed border-gray-100 rounded-[2rem]">
            <p className="text-[10px] font-black uppercase text-gray-300 tracking-widest">{message}</p>
        </div>
    );
}