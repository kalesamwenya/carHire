'use client';

import Link from 'next/link';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

// Mock Data
const cars = [
    { id: 1, name: 'Toyota Hilux 4x4', category: 'SUV', price: 120, status: 'Available', plate: 'ABZ 1234' },
    { id: 2, name: 'Mercedes C-Class', category: 'Luxury', price: 180, status: 'Rented', plate: 'LUS 9988' },
    { id: 3, name: 'Suzuki Swift', category: 'Economy', price: 45, status: 'Maintenance', plate: 'KAB 5521' },
];

export default function CarsPage() {
    return (
        <div>
            {/* PAGE HEADER */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Fleet Management</h2>
                    <p className="text-sm text-gray-500">Manage your vehicle inventory.</p>
                </div>

                {/* 1. LINK TO ADD NEW CAR */}
                <Link
                    href="/admin/cars/new"
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
                >
                    <FaPlus /> Add Vehicle
                </Link>
            </div>

            {/* TABLE */}
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
                        <tr key={car.id} className="hover:bg-gray-50 transition-colors group">

                            {/* 2. LINK TO VIEW DETAILS (Clicking Name) */}
                            <td className="px-6 py-4">
                                <Link
                                    href={`/admin/cars/${car.id}`}
                                    className="font-bold text-gray-900 hover:text-green-600 transition-colors"
                                >
                                    {car.name}
                                </Link>
                            </td>

                            <td className="px-6 py-4">
                                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium uppercase tracking-wide">
                                    {car.category}
                                </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs">{car.plate}</td>
                            <td className="px-6 py-4 font-bold text-gray-700">${car.price}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    car.status === 'Available' ? 'bg-green-100 text-green-700' :
                                        car.status === 'Rented' ? 'bg-blue-100 text-blue-700' :
                                            'bg-red-100 text-red-700'
                                }`}>
                                    {car.status}
                                </span>
                            </td>

                            {/* ACTIONS COLUMN */}
                            <td className="px-6 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                    {/* View Button (Icon) */}
                                    <Link
                                        href={`/admin/cars/${car.id}`}
                                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </Link>

                                    {/* 3. LINK TO EDIT PAGE */}
                                    <Link
                                        href={`/admin/cars/${car.id}/edit`}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Vehicle"
                                    >
                                        <FaEdit />
                                    </Link>

                                    {/* Delete Button (Action) */}
                                    <button
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Vehicle"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}