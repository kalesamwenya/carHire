import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaUser, FaCar, FaHistory, FaSignOutAlt, FaCalendarAlt, FaMapMarkerAlt, FaCreditCard } from 'react-icons/fa';

// Force dynamic rendering to skip build-time fetching
export const dynamic = 'force-dynamic';

async function getDashboardData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    try {
        const [userRes, bookingsRes] = await Promise.all([
            fetch(`${baseUrl}/api/users?me=true`, { cache: 'no-store' }),
            fetch(`${baseUrl}/api/bookings`, { cache: 'no-store' })
        ]);

        if (!userRes.ok) return null; 

        const user = await userRes.json();
        const bookings = await bookingsRes.json();

        return { user, bookings };
    } catch (e) {
        console.error("Dashboard Load Error:", e);
        return null;
    }
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (!data?.user) {
        redirect('/login');
    }

    const { user, bookings } = data;

    const upcoming = bookings.filter(b => b.status === 'upcoming');
    const past = bookings.filter(b => b.status === 'completed');
    const totalSpent = past.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    return (
        <main className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                        <p className="text-gray-500 mt-1">Welcome back, {user.name || 'Driver'}</p>
                    </div>
                    <Link href="/cars" className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 shadow-sm transition-colors">
                        Book a New Car
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    <aside className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
                            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                                {user.name ? user.name.charAt(0) : <FaUser />}
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                            <p className="text-gray-500 text-sm mb-6">{user.email}</p>
                            
                            <div className="border-t border-gray-100 pt-6 text-left space-y-3">
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FaCreditCard className="text-gray-400" />
                                    <span>License: {user.driver_license || 'Not Provided'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-600">
                                    <FaMapMarkerAlt className="text-gray-400" />
                                    <span>Lusaka, Zambia</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 flex items-center justify-center gap-2 text-red-600 font-medium py-2 rounded-lg hover:bg-red-50 transition-colors">
                                <FaSignOutAlt /> Sign Out
                            </button>
                        </div>
                    </aside>

                    <div className="lg:col-span-3 space-y-8">
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard 
                                label="Active Bookings" 
                                value={upcoming.length} 
                                icon={<FaCar />} 
                                color="bg-blue-50 text-blue-600" 
                            />
                            <StatCard 
                                label="Total Trips" 
                                value={past.length} 
                                icon={<FaHistory />} 
                                color="bg-purple-50 text-purple-600" 
                            />
                            <StatCard 
                                label="Total Spent" 
                                value={`ZMW ${totalSpent.toLocaleString()}`} 
                                icon={<FaCreditCard />} 
                                color="bg-green-50 text-green-600" 
                            />
                        </div>

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <FaCalendarAlt className="text-green-600" /> Upcoming Trips
                                </h3>
                            </div>
                            
                            {upcoming.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {upcoming.map(booking => (
                                        <BookingRow key={booking.booking_id} booking={booking} isUpcoming />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No upcoming trips scheduled.
                                </div>
                            )}
                        </section>

                        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <FaHistory className="text-gray-400" /> Rental History
                                </h3>
                            </div>
                            
                            {past.length > 0 ? (
                                <div className="divide-y divide-gray-50">
                                    {past.map(booking => (
                                        <BookingRow key={booking.booking_id} booking={booking} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    No rental history yet.
                                </div>
                            )}
                        </section>

                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${color}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 font-medium">{label}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function BookingRow({ booking, isUpcoming }) {
    return (
        <div className="p-6 hover:bg-gray-50 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                    <FaCar />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-lg">
                        {booking.car_name || `Vehicle #${booking.car_id}`}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1 space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">From:</span> {booking.from}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium">To:</span> {booking.to}
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    {booking.status}
                </span>
                <div className="text-right">
                    <p className="text-sm text-gray-400">Total</p>
                    <p className="font-bold text-green-700 text-lg">ZMW {booking.total}</p>
                </div>
            </div>
        </div>
    );
}