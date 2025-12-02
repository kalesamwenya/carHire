'use client';

import { useState } from 'react';
import { FaCloudUploadAlt, FaCar, FaCogs, FaGasPump, FaChair, FaMoneyBillWave, FaCalendarAlt } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API Call
        setTimeout(() => {
            setLoading(false);
            toast.success("Vehicle listed successfully!");
            // router.push('/partner/fleet');
        }, 1500);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Toaster position="top-center" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">List a New Vehicle</h1>
                <p className="text-gray-500 mt-1">Add details about your car to start earning.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* LEFT COLUMN: Inputs */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Card 1: Basic Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCar className="text-green-600" /> Vehicle Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Make (Brand)</label>
                                <input type="text" placeholder="e.g. Toyota" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                <input type="text" placeholder="e.g. RAV4" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-gray-400"/> Year</label>
                                <input type="number" placeholder="2022" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FaMoneyBillWave className="text-gray-400"/> Daily Rate (ZMW)</label>
                                <input type="number" placeholder="600" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-shadow" required />
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Specs */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCogs className="text-green-600" /> Technical Specs
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">Transmission</label>
                                <div className="relative">
                                    <FaCogs className="absolute left-3 top-3 text-gray-400" />
                                    <select className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                        <option>Automatic</option>
                                        <option>Manual</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">Fuel Type</label>
                                <div className="relative">
                                    <FaGasPump className="absolute left-3 top-3 text-gray-400" />
                                    <select className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                        <option>Petrol</option>
                                        <option>Diesel</option>
                                        <option>Hybrid</option>
                                        <option>Electric</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">Seats</label>
                                <div className="relative">
                                    <FaChair className="absolute left-3 top-3 text-gray-400" />
                                    <input type="number" defaultValue={5} className="w-full pl-9 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Only Submit (Hidden on desktop to preserve sidebar flow) */}
                    <div className="lg:hidden flex gap-3">
                        <button type="button" className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 shadow-sm transition-colors disabled:opacity-70"
                        >
                            {loading ? 'Listing...' : 'List Vehicle'}
                        </button>
                    </div>
                </div>

                {/* RIGHT COLUMN: Images (Sticky) */}
                <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaCloudUploadAlt className="text-green-600" /> Photos
                        </h3>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer group bg-gray-50/50">
                            <div className="mx-auto w-14 h-14 bg-white border border-gray-200 group-hover:border-green-300 rounded-full flex items-center justify-center mb-3 text-gray-400 group-hover:text-green-600 transition-all shadow-sm">
                                <FaCloudUploadAlt size={28} />
                            </div>
                            <p className="text-sm font-medium text-gray-900">Upload Main Image</p>
                            <p className="text-xs text-gray-500 mt-1 mb-4">PNG, JPG (max 5MB)</p>
                            <button type="button" className="text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-md font-medium text-gray-700 hover:bg-gray-50">
                                Browse Files
                            </button>
                            <input type="file" className="hidden" />
                        </div>

                        {/* Gallery Preview Placeholders */}
                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:border-green-400 cursor-pointer transition-colors">
                                    <span className="text-xs">+</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop Submit Actions */}
                    <div className="hidden lg:flex flex-col gap-3">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-6 py-3.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
                        >
                            {loading ? 'Processing...' : 'List Vehicle Now'}
                        </button>
                        <button type="button" className="w-full px-6 py-3.5 border border-gray-300 text-gray-600 font-medium rounded-xl hover:bg-gray-100 transition-colors">
                            Save as Draft
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
}