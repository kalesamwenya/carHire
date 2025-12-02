import { FaWallet, FaDownload, FaArrowUp, FaArrowDown } from 'react-icons/fa';

export default function EarningsPage() {
    // Mock Financial Data
    const cars = [
        { id: 1, name: 'Toyota RAV4', plate: 'ABC 123', trips: 12, earnings: 4500, expenses: 500 },
        { id: 2, name: 'Ford Ranger', plate: 'XYZ 999', trips: 8, earnings: 6200, expenses: 1200 },
        { id: 3, name: 'Honda Fit', plate: 'LUS 555', trips: 20, earnings: 3800, expenses: 300 },
    ];

    const totalEarnings = cars.reduce((acc, car) => acc + car.earnings, 0);
    const totalExpenses = cars.reduce((acc, car) => acc + car.expenses, 0);
    const netProfit = totalEarnings - totalExpenses;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
                    <FaDownload /> Export Report
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-green-700 mt-2">ZMW {totalEarnings.toLocaleString()}</h3>
                    <div className="mt-2 flex items-center text-xs text-green-600 bg-green-50 w-fit px-2 py-1 rounded">
                        <FaArrowUp className="mr-1" /> +15% this month
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm text-gray-500 font-medium">Expenses</p>
                    <h3 className="text-2xl font-bold text-red-600 mt-2">ZMW {totalExpenses.toLocaleString()}</h3>
                    <div className="mt-2 flex items-center text-xs text-red-600 bg-red-50 w-fit px-2 py-1 rounded">
                        <FaArrowDown className="mr-1" /> -2% this month
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
                    <p className="text-sm text-gray-300 font-medium">Net Profit</p>
                    <h3 className="text-2xl font-bold mt-2">ZMW {netProfit.toLocaleString()}</h3>
                    <p className="text-xs text-gray-400 mt-2">After platform fees</p>
                </div>
            </div>

            {/* Per Vehicle Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Earnings by Vehicle</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3">Vehicle</th>
                            <th className="px-6 py-3">Plate No.</th>
                            <th className="px-6 py-3 text-center">Trips</th>
                            <th className="px-6 py-3 text-right">Revenue</th>
                            <th className="px-6 py-3 text-right">Expenses</th>
                            <th className="px-6 py-3 text-right">Net</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                        {cars.map((car) => (
                            <tr key={car.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{car.name}</td>
                                <td className="px-6 py-4 text-gray-500">{car.plate}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-bold">{car.trips}</span>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-green-700">+{car.earnings.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right text-red-500">-{car.expenses.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right font-bold text-gray-900">{(car.earnings - car.expenses).toLocaleString()}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}