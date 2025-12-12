'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCar, FaInfoCircle, FaImage, FaSave, FaUpload, FaMoneyBillWave, FaTag } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        plate: '',
        category: 'suv',
        price: '',
        status: 'available',
        transmission: 'automatic',
        fuel: 'diesel',
        seats: 5,
        description: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success("Vehicle added successfully!");
            setLoading(false);
            setTimeout(() => router.push('/admin/cars'), 1500);
        }, 1500);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-7xl mx-auto pb-10">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
                        <p className="text-sm text-gray-500">Create a new fleet entry</p>
                    </div>
                </div>
                {/* Desktop Save Button (Quick Access) */}
                <div className="hidden lg:block">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center gap-2 disabled:opacity-70"
                    >
                        {loading ? 'Saving...' : <><FaSave /> Save Vehicle</>}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                {/* GRID SYSTEM: 3 Columns Total (2 for Content, 1 for Media/Actions) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* --- LEFT COLUMN (Content) --- */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Section 1: Basic Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <FaCar className="text-green-600" /> Vehicle Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Vehicle Name</label>
                                    <input name="name" onChange={handleChange} required placeholder="e.g. Toyota Hilux 2.8 GD-6" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Plate</label>
                                    <input name="plate" onChange={handleChange} required placeholder="e.g. ABC 1234" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                    <div className="relative">
                                        <FaTag className="absolute left-3 top-3.5 text-gray-400" />
                                        <select name="category" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none">
                                            <option value="suv">SUV / 4x4</option>
                                            <option value="sedan">Sedan</option>
                                            <option value="luxury">Luxury</option>
                                            <option value="bus">Bus / Van</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Specs */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                                <FaInfoCircle className="text-blue-600" /> Technical Specs
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transmission</label>
                                    <select name="transmission" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                        <option value="automatic">Automatic</option>
                                        <option value="manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuel Type</label>
                                    <select name="fuel" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                        <option value="diesel">Diesel</option>
                                        <option value="petrol">Petrol</option>
                                        <option value="hybrid">Hybrid</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Seats</label>
                                    <input name="seats" type="number" onChange={handleChange} defaultValue={5} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none" />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                    <textarea name="description" onChange={handleChange} rows="4" placeholder="Additional features, mileage limits, etc..." className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none resize-none"></textarea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- RIGHT COLUMN (Media & Pricing) --- */}
                    <div className="space-y-8">

                        {/* Pricing Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaMoneyBillWave className="text-green-600" /> Pricing
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Daily Rate ($)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500 font-bold">$</span>
                                        <input name="price" type="number" onChange={handleChange} required placeholder="0.00" className="w-full border border-gray-300 rounded-lg p-3 pl-8 text-sm focus:ring-2 focus:ring-green-500 outline-none font-bold text-lg" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                                    <select name="status" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                        <option value="available">Available</option>
                                        <option value="rented">Rented</option>
                                        <option value="maintenance">Maintenance</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Media Upload Card */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaImage className="text-purple-600" /> Vehicle Images
                            </h2>

                            {/* Main Image Dropzone */}
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-gray-400 transition-colors cursor-pointer aspect-video bg-gray-50">
                                <div className="p-4 bg-white rounded-full shadow-sm mb-3">
                                    <FaUpload className="text-2xl text-purple-600" />
                                </div>
                                <p className="text-sm font-bold text-gray-700">Upload Cover Image</p>
                                <p className="text-xs text-gray-400 mt-1 text-center">SVG, PNG, JPG<br/>(Max 2MB)</p>
                            </div>

                            {/* Gallery Grid (Small placeholders) */}
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-square border border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center cursor-pointer hover:bg-gray-100">
                                        <span className="text-2xl text-gray-300">+</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Mobile Submit (Hidden on Desktop) */}
                        <div className="lg:hidden">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {loading ? 'Saving...' : <><FaSave /> Save Vehicle</>}
                            </button>
                        </div>
                    </div>

                </div>
            </form>
        </div>
    );
}