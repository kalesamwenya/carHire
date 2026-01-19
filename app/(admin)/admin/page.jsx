import Link from 'next/link';
import axios from 'axios';
import { 
    FaCarSide, FaUsers, FaFileInvoiceDollar, FaChartLine, 
    FaExclamationTriangle, FaClock, FaCheckCircle 
} from 'react-icons/fa';
import ForecastChart from '@/components/ForecastChart';

// Force dynamic to ensure we see real-time booking updates
export const dynamic = 'force-dynamic';

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

async function getAdminDashboardData() {
    try {
        const response = await axios.get(`${BASE_API}/admin/dashboard_data.php`, { timeout: 5000 });
        // Using the .data.data pattern from your single PHP endpoint
        return response.data.data || { cars: [], users: [], bookings: [], reviews: [] };
    } catch (e) {
        console.error("Dashboard Fetch Error:", e.message);
        return { cars: [], users: [], bookings: [], reviews: [] };
    }
}

export default async function AdminDashboard() {
    const data = await getAdminDashboardData();
    
    // Destructure for cleaner access
    const { cars = [], users = [], bookings = [], reviews = [] } = data;

    // Derived Logic
    const activeBookings = bookings.filter(b => b.status === 'active' || b.status === 'confirmed').length;
    const maintenanceCars = cars.filter(c => c.status === 'maintenance' || c.status === 'unavailable');
    const totalRevenue = bookings.reduce((acc, curr) => acc + (Number(curr.total_price) || 0), 0);
    const partnerCount = users.filter(u => u.role === 'partner').length;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Control Tower</h1>
                    <p className="text-slate-500 font-medium">Emit Photography Business Suite</p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">System Status</p>
                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                        <FaCheckCircle /> Online
                    </div>
                </div>
            </header>

            {/* Urgent Maintenance Alert */}
            {maintenanceCars.length > 0 && (
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <FaExclamationTriangle className="text-amber-600 text-xl" />
                        <div>
                            <p className="font-bold text-amber-900">Fleet Attention Required</p>
                            <p className="text-sm text-amber-700">{maintenanceCars.length} vehicles are currently offline.</p>
                        </div>
                    </div>
                    <Link href="/admin/maintenance" className="text-sm font-bold text-amber-700 hover:underline">
                        Manage Fleet →
                    </Link>
                </div>
            )}

            {/* Primary Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard 
                    title="Available Fleet" 
                    value={cars.length - maintenanceCars.length} 
                    subtext={`of ${cars.length} total vehicles`}
                    icon={<FaCarSide />} 
                    color="bg-blue-600" 
                    href="/admin/fleet"
                />
                <MetricCard 
                    title="Live Bookings" 
                    value={activeBookings} 
                    subtext="Currently on the road"
                    icon={<FaClock />} 
                    color="bg-indigo-600" 
                    href="/admin/bookings"
                />
                <MetricCard 
                    title="Total Revenue" 
                    value={`K${(totalRevenue / 1000).toFixed(1)}K`} 
                    subtext="Gross earnings to date"
                    icon={<FaFileInvoiceDollar />} 
                    color="bg-emerald-600" 
                    href="/admin/analytics"
                />
                <MetricCard 
                    title="Active Partners" 
                    value={partnerCount} 
                    subtext="Verified service providers"
                    icon={<FaUsers />} 
                    color="bg-orange-500" 
                    href="/admin/users"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Visualization */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-slate-800">7-Day Revenue Forecast</h3>
                        <FaChartLine className="text-slate-300 text-xl" />
                    </div>
                    <ForecastChart bookings={bookings} />
                </div>

                {/* Quick Action Panel */}
                <div className="space-y-6">
                    <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-2xl">
                        <h3 className="text-lg font-bold mb-6">Management Links</h3>
                        <div className="grid gap-3">
                            <ActionBtn href="/admin/fleet" label="Fleet Inventory" />
                            <ActionBtn href="/admin/bookings" label="Booking Logs" />
                            <ActionBtn href="/admin/maintenance" label="Maintenance" />
                            <ActionBtn href="/admin/reports" label="Export Reports" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h3>
                        <div className="space-y-4">
                            <StatRow label="Avg Booking Value" value={`K${(totalRevenue / (bookings.length || 1)).toFixed(0)}`} />
                            <StatRow label="Fleet Utilization" value={`${Math.round(((cars.length - maintenanceCars.length) / (cars.length || 1)) * 100)}%`} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Internal Helper Components ---

function MetricCard({ title, value, subtext, icon, color, href }) {
    return (
        <Link href={href} className="group bg-white rounded-3xl p-6 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center text-white text-xl mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
            </div>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{title}</p>
            <p className="text-3xl font-black text-slate-900 mt-1">{value}</p>
            <p className="text-xs text-slate-500 mt-2 font-medium">{subtext}</p>
        </Link>
    );
}

function ActionBtn({ href, label }) {
    return (
        <Link href={href} className="flex items-center justify-between w-full p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
            <span className="font-semibold text-sm">{label}</span>
            <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
        </Link>
    );
}

function StatRow({ label, value }) {
    return (
        <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500 font-medium">{label}</span>
            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}