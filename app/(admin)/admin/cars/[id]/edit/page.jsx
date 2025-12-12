'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCar, FaInfoCircle, FaSave } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditCarPage({ params }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Mock Existing Data
    const [formData, setFormData] = useState({
        name: 'Toyota Hilux 2.8 GD-6',
        plate: 'ABZ 1234',
        category: 'suv',
        price: '120',
        status: 'available',
        transmission: 'automatic',
        fuel: 'diesel',
        seats: 5,
        description: 'Leather seats, 4x4 capability, Tow bar included.',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API Update
        setTimeout(() => {
            toast.success("Changes saved!");
            setLoading(false);
            router.push(`/admin/cars/${params.id}`);
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <Toaster position="top-center" />

            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/cars/${params.id}`} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-colors">
                    <FaArrowLeft />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit Vehicle</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Basic Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaCar className="text-green-600" /> Vehicle Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Name</label>
                            <input name="name" value={formData.name} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">License Plate</label>
                            <input name="plate" value={formData.plate} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 cursor-not-allowed" disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Daily Rate ($)</label>
                            <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Status</label>
                            <select name="status" value={formData.status} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none">
                                <option value="available">Available</option>
                                <option value="rented">Rented</option>
                                <option value="maintenance">Maintenance</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Specs */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <FaInfoCircle className="text-blue-600" /> Specifications
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Transmission</label>
                            <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none">
                                <option value="automatic">Automatic</option>
                                <option value="manual">Manual</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Fuel Type</label>
                            <select name="fuel" value={formData.fuel} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none">
                                <option value="diesel">Diesel</option>
                                <option value="petrol">Petrol</option>
                            </select>
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={`/admin/cars/${params.id}`} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Updating...' : <><FaSave /> Update Vehicle</>}
                    </button>
                </div>

            </form>
        </div>
    );
}