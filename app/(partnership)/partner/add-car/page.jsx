'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
    FaArrowLeft, FaCar, FaInfoCircle, FaImage, FaSave, FaUpload, 
    FaMoneyBillWave, FaTag, FaTrash, FaRoad, FaStar, FaCalendarDay 
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [selectedCover, setSelectedCover] = useState(0);

    const [formData, setFormData] = useState({
        name: '',           
        make: '',
        model: '',
        plate_number: '',
        category: 'suv',
        daily_rate: '',
        min_days: 1,
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

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews(prev => [...prev, ...newPreviews]);
        
        if (selectedFiles.length === 0 && files.length > 0) {
            setSelectedCover(0);
        }
    };

    const removeImage = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
        if (selectedCover === index) {
            setSelectedCover(0);
        } else if (selectedCover > index) {
            setSelectedCover(prev => prev - 1);
        }
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

        Object.keys(formData).forEach(key => {
            data.append(key, formData[key]);
        });

        data.append('cover_index', selectedCover);

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
            toast.error("Connection error. Check your API.");
        } finally {
            setLoading(false);
        }
    };

    // Shared styling for all text inputs to ensure black text
    const inputStyle = "w-full border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none text-black bg-white";

    return (
        <div className="max-w-7xl mx-auto pb-10 px-4 mt-6">
            <Toaster position="top-center" />

            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin/cars" className="p-2.5 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-all shadow-sm">
                        <FaArrowLeft />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Add New Vehicle</h1>
                        <p className="text-sm text-gray-500 italic">Expand your photography and corporate fleet</p>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-lg font-bold hover:bg-slate-800 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 transition-all active:scale-95"
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Display Name</label>
                                <input name="name" onChange={handleChange} required placeholder="Example: Luxury Toyota Hilux 2024" className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Make</label>
                                <input name="make" onChange={handleChange} required placeholder="Toyota" className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Model</label>
                                <input name="model" onChange={handleChange} required placeholder="Hilux" className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">License Plate</label>
                                <input name="plate_number" onChange={handleChange} required placeholder="ABC 1234" className={`${inputStyle} uppercase font-mono`} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Category</label>
                                <div className="relative">
                                    <FaTag className="absolute left-3 top-3.5 text-gray-400" />
                                    <select 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleChange} 
                                        className={`${inputStyle} pl-10 appearance-none`}
                                    >
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
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Transmission</label>
                                <select name="transmission" onChange={handleChange} className={`${inputStyle} appearance-none`}>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Fuel Type</label>
                                <select name="fuel_type" onChange={handleChange} className={`${inputStyle} appearance-none`}>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Petrol">Petrol</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Mileage (km)</label>
                                <div className="relative">
                                    <FaRoad className="absolute left-3 top-3.5 text-gray-400" />
                                    <input name="mileage" type="number" onChange={handleChange} placeholder="0" className={`${inputStyle} pl-10`} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Seats</label>
                                <input name="seats" type="number" defaultValue="5" onChange={handleChange} className={inputStyle} />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Color</label>
                                <input name="color" onChange={handleChange} placeholder="White" className={inputStyle} />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Description</label>
                                <textarea name="description" onChange={handleChange} rows="4" className={`${inputStyle} resize-none`} placeholder="Enter vehicle features..."></textarea>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COLUMN --- */}
                <div className="space-y-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <FaMoneyBillWave className="text-green-600" /> Pricing & Terms
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Daily Rate (KMW)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-3 text-gray-800 font-bold">K</span>
                                    <input name="daily_rate" type="number" onChange={handleChange} required className={`${inputStyle} pl-8 font-bold text-lg`} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest">Min. Booking Days</label>
                                <div className="relative">
                                    <FaCalendarDay className="absolute left-3 top-3.5 text-gray-400" />
                                    <input name="min_days" type="number" min="1" defaultValue="1" onChange={handleChange} required className={`${inputStyle} pl-10 font-bold`} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <FaImage className="text-purple-600" /> Images
                        </h2>
                        <p className="text-[9px] text-gray-400 mb-4 uppercase font-bold tracking-widest">Click a photo to set as cover</p>

                        <label className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-purple-300 transition-all cursor-pointer bg-gray-50/50">
                            <FaUpload className="text-2xl mb-2 text-purple-600" />
                            <span className="text-xs font-bold text-gray-600">Upload Media</span>
                            <input type="file" multiple accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>

                        <div className="grid grid-cols-3 gap-3 mt-6">
                            {previews.map((src, index) => (
                                <div 
                                    key={index} 
                                    onClick={() => setSelectedCover(index)}
                                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                        selectedCover === index ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100'
                                    }`}
                                >
                                    <img src={src} className="w-full h-full object-cover" alt="preview" />
                                    {selectedCover === index && (
                                        <div className="absolute top-1 left-1 bg-green-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm uppercase">
                                            <FaStar size={8} /> Cover
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                removeImage(index);
                                            }}
                                            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-xl transform scale-90 group-hover:scale-100 transition-transform"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}