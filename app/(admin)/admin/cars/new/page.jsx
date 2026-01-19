'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaArrowLeft, FaCar, FaInfoCircle, FaImage, FaSave, FaUpload, FaMoneyBillWave, FaTag, FaTrash, FaRoad } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);

    const [formData, setFormData] = useState({
        name: '',           // Added for the 'name' column
        make: '',
        model: '',
        plate_number: '',
        category: 'suv',
        daily_rate: '',
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        seats: 5,
        mileage: '',        // Added for the 'mileage' column
        description: '',
        color: '',
        partner_id: '',     // Set to empty string for Admin (PHP will convert to NULL)
        latitude: '',       // Placeholder for location
        longitude: ''       // Placeholder for location
    });

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        if (selectedFiles.length === 0) return toast.error("Please upload at least one image.");

        setLoading(true);
        const data = new FormData();

        // Append text fields
        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        // Append images
        selectedFiles.forEach((file) => {
            data.append('images[]', file);
        });

        try {
            const res = await fetch(`${BASE_API}/partners/save-car.php`, {
                method: 'POST',
                body: data,
            });

            const result = await res.json();

            if (result.status === "success") {
                toast.success(result.message);
                setTimeout(() => router.push('/admin/cars'), 2000);
            } else {
                toast.error(result.message || "Failed to save vehicle.");
            }
        } catch (error) {
            toast.error("Connection error. Check if your API is running.");
            console.error(error);
        } finally {
            setLoading(false);
        }
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
                        <p className="text-sm text-gray-500">Fleet management for Emit Photography</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center gap-2 disabled:opacity-70"
                >
                    {loading ? 'Processing...' : <><FaSave /> Save Vehicle</>}
                </button>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* --- LEFT COLUMN --- */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <FaCar className="text-green-600" /> Vehicle Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Display Name</label>
                                <input name="name" onChange={handleChange} required placeholder="Example: Luxury Toyota Hilux 2024" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Make</label>
                                <input name="make" onChange={handleChange} required placeholder="Toyota" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label>
                                <input name="model" onChange={handleChange} required placeholder="Hilux" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Plate</label>
                                <input name="plate_number" onChange={handleChange} required placeholder="ABC 1234" className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono" />
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

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                            <FaInfoCircle className="text-blue-600" /> Technical Specs
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Transmission</label>
                                <select name="transmission" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuel Type</label>
                                <select name="fuel_type" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                    <option value="Diesel">Diesel</option>
                                    <option value="Petrol">Petrol</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mileage (km)</label>
                                <div className="relative">
                                    <FaRoad className="absolute left-3 top-3.5 text-gray-400" />
                                    <input name="mileage" type="number" onChange={handleChange} placeholder="0" className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Seats</label>
                                <input name="seats" type="number" defaultValue="5" onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Color</label>
                                <input name="color" onChange={handleChange} placeholder="White" className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none" />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                <textarea name="description" onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none resize-none" placeholder="Enter vehicle features..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-600" /> Pricing
                        </h2>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Daily Rate ($)</label>
                            <div className="relative">
                                <span className="absolute left-3 top-3 text-gray-500 font-bold">$</span>
                                <input name="daily_rate" type="number" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 pl-8 text-sm outline-none font-bold text-lg" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaImage className="text-purple-600" /> Images
                        </h2>

                        <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50">
                            <FaUpload className="text-xl mb-2 text-purple-600" />
                            <span className="text-xs font-bold">Add Photos</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>

                        <div className="grid grid-cols-3 gap-2 mt-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTrash className="text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}