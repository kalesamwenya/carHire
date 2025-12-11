import { FaDollarSign, FaCar, FaClipboardCheck, FaArrowUp } from 'react-icons/fa';

// --- Components ---
const StatCard = ({ title, value, change, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-lg ${color}`}>
                <Icon className="text-white text-lg" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
      <span className="text-green-600 flex items-center font-medium">
        <FaArrowUp className="mr-1 text-xs" /> {change}
      </span>
            <span className="text-gray-400 ml-2">vs last month</span>
        </div>
    </div>
);

export default function DashboardPage() {
    return (
        <div className="space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Revenue"
                    value="$12,450"
                    change="12%"
                    icon={FaDollarSign}
                    color="bg-green-600"
                />
                <StatCard
                    title="Active Bookings"
                    value="24"
                    change="8%"
                    icon={FaClipboardCheck}
                    color="bg-blue-600"
                />
                <StatCard
                    title="Fleet Status"
                    value="15/20 Cars"
                    change="On Road"
                    icon={FaCar}
                    color="bg-purple-600"
                />
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="font-bold text-gray-800">Recent Bookings</h3>
                </div>
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Vehicle</th>
                        <th className="px-6 py-3">Date</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Amount</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {[1, 2, 3, 4].map((item) => (
                        <tr key={item} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">John Doe</td>
                            <td className="px-6 py-4">Toyota Hilux</td>
                            <td className="px-6 py-4">Oct 24, 2025</td>
                            <td className="px-6 py-4">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                    Completed
                  </span>
                            </td>
                            <td className="px-6 py-4 font-bold">$120.00</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}