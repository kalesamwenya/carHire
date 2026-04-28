'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    FaArrowLeft, FaCar, FaInfoCircle, FaImage, FaSave, 
    FaUpload, FaMoneyBillWave, FaTag, FaTrash, FaRoad, FaStar, FaSpinner 
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditCarPage({ params: paramsPromise }) {
    const router = useRouter();
    const params = use(paramsPromise);
    const id = params?.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // IMAGE STATES
    const [selectedFiles, setSelectedFiles] = useState([]); // New uploads
    const [previews, setPreviews] = useState([]); // New upload previews
    const [existingImages, setExistingImages] = useState([]); // Images already on server
    const [featuredIndex, setFeaturedIndex] = useState(0); 

    const [formData, setFormData] = useState({
        name: '',
        make: '',
        model: '',
        plate_number: '',
        category: 'suv',
        daily_rate: '',
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        seats: 5,
        mileage: '',
        description: '',
        color: '',
        partner_id: '', 
        latitude: '',
        longitude: ''
    });

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    // 1. Load Existing Data
    useEffect(() => {
        async function fetchVehicle() {
            try {
                const res = await fetch(`${BASE_API}/admin/get_car_details.php?id=${id}`);
                const json = await res.json();
                if (json.success) {
                    setFormData(json.car);
                    // Set existing images from server
                    setExistingImages(json.car.images || []); 
                    setFeaturedIndex(json.car.featured_image_index || 0);
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
    }, [id, BASE_API]);

    // Clean up previews
    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (selectedFiles.length + existingImages.length + files.length > 8) {
            toast.error("Limit: 8 images total.");
            return;
        }
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
    };

    const removeNewImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index));
        // Reset featured index if it was pointing to the deleted image
        if (featuredIndex >= index) setFeaturedIndex(0);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setSaving(true);

        const data = new FormData();
        data.append('id', id);

        // Append all text fields
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('featured_image_index', featuredIndex);
        
        // Tell backend which existing images we kept
        data.append('existing_images', JSON.stringify(existingImages));

        // Append new images
        selectedFiles.forEach((file) => {
            data.append('images[]', file);
        });

        try {
            const res = await fetch(`${BASE_API}/partners/update-car.php`, {
                method: 'POST',
                body: data,
            });

            const result = await res.json();
            if (result.status === "success" || result.success) {
                toast.success("Vehicle updated successfully!");
                setTimeout(() => router.push('/admin/cars'), 1500);
            } else {
                toast.error(result.message || "Update failed");
            }
        } catch (error) {
            toast.error("Network error. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen text-green-600">
            <FaSpinner className="animate-spin text-3xl" />
        </div>
    );

    return (
        <div className="max-w-8xl mx-auto pb-10 px-4">
            <Toaster position="top-center" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-colors">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Edit Vehicle</h1>
                        <p className="text-sm text-gray-500">Modifying: {formData.name}</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={saving}
                    className="w-full md:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all"
                >
                    {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                    {saving ? 'Updating...' : 'Update Vehicle'}
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
                                <input name="name" value={formData.name} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Make</label>
                                <input name="make" value={formData.make} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Model</label>
                                <input name="model" value={formData.model} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">License Plate</label>
                                <input name="plate_number" value={formData.plate_number} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none uppercase font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-3 top-3.5 text-gray-400" />
                                    <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm bg-white focus:ring-2 focus:ring-green-500 outline-none">
                                         <option value="suv">SUV / 4x4</option>
                                        <option value="sedan">Sedan</option>
                                        <option value="hatchback">Hatchback</option>
                                        <option value="luxury">Luxury / Executive</option>
                                        <option value="bus">Bus / Van</option>
                                        <option value="van">Cargo Van</option>
                                        <option value="pickup">Pickup Truck</option>
                                        <option value="convertible">Convertible</option>
                                        <option value="compact">Compact / Small</option>
                                        <option value="electric">Electric Vehicle</option>
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
                                <select name="transmission" value={formData.transmission} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Fuel Type</label>
                                <select name="fuel_type" value={formData.fuel_type} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-white outline-none">
                                    <option value="Diesel">Diesel</option>
                                    <option value="Petrol">Petrol</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Mileage (km)</label>
                                <div className="relative">
                                    <FaRoad className="absolute left-3 top-3.5 text-gray-400" />
                                    <input name="mileage" type="number" value={formData.mileage} onChange={handleChange} className="w-full border border-gray-300 rounded-lg p-3 pl-10 text-sm outline-none" />
                                </div>
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full border border-gray-300 rounded-lg p-3 text-sm outline-none resize-none" placeholder="Enter vehicle features..."></textarea>
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
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Daily Rate (ZMW)</label>
                        <div className="relative">
                            <span className="absolute left-3 top-3 text-gray-500 font-bold">K</span>
                            <input name="daily_rate" value={formData.daily_rate} type="number" onChange={handleChange} required className="w-full border border-gray-300 rounded-lg p-3 pl-8 text-sm outline-none font-bold text-lg" />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaImage className="text-purple-600" /> Manage Images
                        </h2>

                        <label className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer bg-gray-50 mb-4">
                            <FaUpload className="text-xl mb-2 text-purple-600" />
                            <span className="text-xs font-bold text-center">Add More Photos</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>

                        <div className="grid grid-cols-3 gap-2">
                            {/* Existing Images */}
                            {existingImages.map((src, index) => (
                                <div key={`old-${index}`} className={`relative aspect-square rounded-lg overflow-hidden border-2 ${featuredIndex === index ? 'border-green-500' : 'border-gray-100'}`}>
                                    <img src={src} className="w-full h-full object-cover" alt="Existing" />
                                    <button type="button" onClick={() => removeExistingImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><FaTrash size={8} /></button>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/40 text-[8px] text-white text-center py-0.5 font-bold">CURRENT</div>
                                </div>
                            ))}

                            {/* New Previews */}
                            {previews.map((src, index) => (
                                <div key={`new-${index}`} className="relative aspect-square rounded-lg overflow-hidden border-2 border-blue-400">
                                    <img src={src} className="w-full h-full object-cover" alt="New" />
                                    <button type="button" onClick={() => removeNewImage(index)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full"><FaTrash size={8} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}