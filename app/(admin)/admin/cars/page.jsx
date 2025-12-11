import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

// Mock Data
const cars = [
    { id: 1, name: 'Toyota Hilux 4x4', category: 'SUV', price: 120, status: 'Available', plate: 'ABZ 1234' },
    { id: 2, name: 'Mercedes C-Class', category: 'Luxury', price: 180, status: 'Rented', plate: 'LUS 9988' },
    { id: 3, name: 'Suzuki Swift', category: 'Economy', price: 45, status: 'Maintenance', plate: 'KAB 5521' },
];

export default function CarsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
                <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                    <FaPlus /> Add Vehicle
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500">
                    <tr>
                        <th className="px-6 py-3">Vehicle Name</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">License Plate</th>
                        <th className="px-6 py-3">Daily Rate</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {cars.map((car) => (
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-gray-900">{car.name}</td>
                            <td className="px-6 py-4">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{car.category}</span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{car.plate}</td>
                            <td className="px-6 py-4 font-bold text-green-600">${car.price}</td>
                            <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      car.status === 'Available' ? 'bg-green-100 text-green-700' :
                          car.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                              'bg-red-100 text-red-700'
                  }`}>
                    {car.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end gap-3">
                                <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
                                <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}