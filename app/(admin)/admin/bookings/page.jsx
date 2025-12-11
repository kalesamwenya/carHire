import { FaCheck, FaTimes } from 'react-icons/fa';

// Mock Data
const bookings = [
    { id: 101, user: 'Sarah M.', car: 'Toyota Hilux', dates: 'Oct 12 - Oct 15', total: 360, status: 'Pending' },
    { id: 102, user: 'Mike T.', car: 'Suzuki Swift', dates: 'Oct 14 - Oct 20', total: 270, status: 'Confirmed' },
    { id: 103, user: 'Emit P.', car: 'BMW X5', dates: 'Nov 01 - Nov 03', total: 500, status: 'Cancelled' },
];

export default function BookingsPage() {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Booking Requests</h2>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Booking ID</th>
                        <th className="px-6 py-3">Customer</th>
                        <th className="px-6 py-3">Vehicle</th>
                        <th className="px-6 py-3">Dates</th>
                        <th className="px-6 py-3">Total</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs">#{booking.id}</td>
                            <td className="px-6 py-4 font-medium text-gray-900">{booking.user}</td>
                            <td className="px-6 py-4">{booking.car}</td>
                            <td className="px-6 py-4 text-gray-500">{booking.dates}</td>
                            <td className="px-6 py-4 font-bold">${booking.total}</td>
                            <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                          booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-gray-100 text-gray-500'
                  }`}>
                    {booking.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-2">
                                {booking.status === 'Pending' && (
                                    <>
                                        <button className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100" title="Approve">
                                            <FaCheck />
                                        </button>
                                        <button className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100" title="Reject">
                                            <FaTimes />
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}