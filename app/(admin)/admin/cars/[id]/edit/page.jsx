'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCar, FaInfoCircle, FaSave, FaSpinner } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditCarPage({ params: paramsPromise }) {
    const router = useRouter();
    const params = use(paramsPromise); // Unwrap params in Next.js 15+
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        plate_number: '',
        price_per_day: '',
        available: 1,
        transmission: '',
        fuel: '',
        seats: '',
        description: '',
        color: '',
        featured: 0
    });

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    // 1. Fetch current data to populate the form
    useEffect(() => {
        async function fetchVehicle() {
            try {
                const res = await fetch(`${BASE_API}/admin/get_car_details.php?id=${id}`);
                const json = await res.json();
                if (json.success) {
                    setFormData(json.car);
                } else {
                    toast.error("Vehicle not found");
                }
            } catch (error) {
                toast.error("Failed to load vehicle data");
            } finally {
                setLoading(false);
            }
        }
        if (id) fetchVehicle();
    }, [id]);

    // 2. Handle Update Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        
        try {
            const res = await fetch(`${BASE_API}/admin/update_car.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, id: id }),
            });
            
            const result = await res.json();
            if (result.success) {
                toast.success("Vehicle updated successfully!");
                router.push(`/admin/cars/${id}`);
                router.refresh(); // Refresh server components
            } else {
                toast.error(result.message || "Update failed");
            }
        } catch (error) {
            toast.error("Network error. Try again.");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64 text-green-600">
            <FaSpinner className="animate-spin text-2xl" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <Toaster position="top-center" />

            <div className="flex items-center gap-4 mb-8">
                <Link href={`/admin/cars/${id}`} className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-colors">
                    <FaArrowLeft />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit {formData.name}</h1>
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
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">License Plate</label>
                            <input name="plate_number" value={formData.plate_number} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-gray-50 cursor-not-allowed text-gray-500" disabled />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Daily Rate (K)</label>
                            <input name="price_per_day" type="number" value={formData.price_per_day} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Availability Status</label>
                            <select name="available" value={formData.available} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white outline-none">
                                <option value={1}>Available for Hire</option>
                                <option value={0}>Unavailable / Maintenance</option>
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
                                <option value="electric">Electric</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Color</label>
                            <input name="color" value={formData.color} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none" />
                        </div>
                        <div className="col-span-1 md:col-span-3">
                            <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full border border-gray-300 rounded-lg p-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"></textarea>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Link href={`/admin/cars/${id}`} className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-bold hover:bg-gray-50">
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center gap-2 disabled:opacity-70 transition-all"
                    >
                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />} 
                        {saving ? 'Saving...' : 'Update Vehicle'}
                    </button>
                </div>

            </form>
        </div>
    );
}