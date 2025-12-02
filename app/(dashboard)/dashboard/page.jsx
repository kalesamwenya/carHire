import Link from 'next/link';
import { redirect } from 'next/navigation';
import { FaCar, FaHistory, FaCalendarAlt, FaCreditCard } from 'react-icons/fa';

// Force dynamic rendering to skip build-time fetching
export const dynamic = 'force-dynamic';

async function getDashboardData() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
        // We only need bookings here for stats/lists.
        // User profile data is likely handled by the layout or not needed in the main view anymore.
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
        redirect('/auth/signin');
    }

    const { user, bookings } = data;

    const upcoming = bookings.filter(b => b.status === 'upcoming');
    const past = bookings.filter(b => b.status === 'completed');
    const totalSpent = past.reduce((acc, curr) => acc + (Number(curr.total) || 0), 0);

    return (
        <div className="space-y-8 animate-fade-in">

            {/* Page Title Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
                    <p className="text-gray-500 mt-1">Welcome back, {user.name || 'Driver'}</p>
                </div>
                <Link href="/cars" className="bg-green-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-green-700 shadow-sm transition-colors text-sm">
                    Book a New Car
                </Link>
            </div>

            {/* Stats Grid - Now Full Width */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

            {/* Upcoming Bookings Section */}
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
                    <div className="p-8 text-center text-gray-500 bg-gray-50/50">
                        <p>No upcoming trips scheduled.</p>
                        <Link href="/cars" className="text-green-600 text-sm font-medium hover:underline mt-2 inline-block">
                            Start a new booking
                        </Link>
                    </div>
                )}
            </section>

            {/* Recent History Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <FaHistory className="text-gray-400" /> Recent History
                    </h3>
                </div>

                {past.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {past.slice(0, 3).map(booking => ( // Only showing recent 3 here
                            <BookingRow key={booking.booking_id} booking={booking} />
                        ))}
                        {past.length > 3 && (
                            <div className="p-3 text-center border-t border-gray-50">
                                <Link href="/dashboard/bookings" className="text-sm text-gray-500 hover:text-green-700 font-medium">
                                    View all history
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="p-8 text-center text-gray-500 bg-gray-50/50">
                        No rental history yet.
                    </div>
                )}
            </section>
        </div>
    );
}

// --- SUB COMPONENTS ---

function StatCard({ label, value, icon, color }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 transition-transform hover:-translate-y-1 duration-300">
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
        <div className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center text-gray-400">
                    <FaCar />
                </div>
                <div>
                    <h4 className="font-bold text-gray-900 text-base">
                        {booking.car_name || `Vehicle #${booking.car_id}`}
                    </h4>
                    <div className="text-sm text-gray-500 mt-1 flex flex-col sm:flex-row sm:gap-4">
                        <span className="font-medium">{booking.from} <span className="text-gray-300 mx-1">→</span> {booking.to}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pl-16 sm:pl-0">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                    isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                }`}>
                    {booking.status}
                </span>
                <div className="text-right min-w-[80px]">
                    <p className="font-bold text-green-700 text-base">ZMW {booking.total}</p>
                </div>
            </div>
        </div>
    );
}