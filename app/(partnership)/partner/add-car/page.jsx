'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    FaCloudUploadAlt, FaCar, FaCogs, FaMoneyBillWave, 
    FaCalendarAlt, FaCheckCircle, FaTimes, FaStar 
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    
    // IMAGE STATES
    const [images, setImages] = useState([]); 
    const [previews, setPreviews] = useState([]);
    const [coverIndex, setCoverIndex] = useState(0); // Index of the cover photo
    const fileInputRef = useRef(null);

    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    // Memory Cleanup: Revoke object URLs when previews change or component unmounts
    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        
        if (images.length + files.length > 6) {
            toast.error("Maximum 6 images allowed");
            return;
        }

        const newPreviews = files.map(file => URL.createObjectURL(file));
        
        // If this is the first set of images being uploaded, default cover to the first one
        if (images.length === 0 && files.length > 0) {
            setCoverIndex(0);
        }

        setImages(prev => [...prev, ...files]);
        setPreviews(prev => [...prev, ...newPreviews]);
        
        // Clear input value so the same file can be re-selected if deleted
        e.target.value = null;
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedPreviews = previews.filter((_, i) => i !== index);

        setImages(updatedImages);
        setPreviews(updatedPreviews);

        // Adjust coverIndex logic
        if (index === coverIndex) {
            setCoverIndex(0); // Reset to first image if cover was deleted
        } else if (index < coverIndex) {
            setCoverIndex(prev => prev - 1); // Shift index back if an earlier image was removed
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!session) {
            toast.error("Please sign in to list a vehicle.");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one vehicle image.");
            return;
        }

        setLoading(true);
        const formData = new FormData(e.currentTarget);
        
        // Append IDs and logic
        formData.append('partner_id', session.user.id);
        formData.append('cover_index', coverIndex); // Tells PHP which image in the array is the cover
        
        images.forEach((file) => {
            formData.append('images[]', file);
        });

        try {
            const res = await fetch(`${Public_Api}/partners/save-car.php`, {
                method: 'POST',
                body: formData,
            });
            
            const data = await res.json();

            if (data.status === 'success') {
                toast.success("Vehicle listed successfully!");
                e.target.reset();
                setImages([]);
                setPreviews([]);
                setCoverIndex(0);
            } else {
                toast.error(data.message || "Failed to list vehicle");
            }
        } catch (error) {
            toast.error("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Toaster position="top-center" />

            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">List a New Vehicle</h1>
                <p className="text-gray-500 mt-1 text-sm">Fill in the details below to add your car to the CityDrive fleet.</p>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* LEFT COLUMN: FORM FIELDS */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCar className="text-green-600" /> Vehicle Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Make (Brand)</label>
                                <input name="make" type="text" placeholder="e.g. Toyota" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                <input name="model" type="text" placeholder="e.g. RAV4" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FaCalendarAlt className="text-gray-400"/> Year</label>
                                <input name="year" type="number" min="1990" max={new Date().getFullYear() + 1} placeholder="2022" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FaMoneyBillWave className="text-gray-400"/> Daily Rate (ZMW)</label>
                                <input name="daily_rate" type="number" min="1" placeholder="600" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                                <input name="color" type="text" placeholder="e.g. Pearl White" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Number Plate</label>
                                <input name="plate_number" type="text" placeholder="e.g. ABC 1234" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                            </div>
                        </div>
                        <div className="mt-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea name="description" rows="3" placeholder="Tell us about the car..." className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"></textarea>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCogs className="text-green-600" /> Technical Specs
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Transmission</label>
                                <select name="transmission" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fuel Type</label>
                                <select name="fuel_type" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                    <option value="Petrol">Petrol</option>
                                    <option value="Diesel">Diesel</option>
                                    <option value="Hybrid">Hybrid</option>
                                    <option value="Electric">Electric</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Seats</label>
                                <input name="seats" type="number" min="1" defaultValue={5} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: PHOTO UPLOAD & SUBMIT */}
                <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <FaCloudUploadAlt className="text-green-600" /> Photos
                            </h3>
                            <span className="text-xs text-gray-400 font-medium">{images.length}/6</span>
                        </div>

                        <input 
                            type="file" 
                            multiple
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                        />

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {previews.map((src, index) => (
                                <div 
                                    key={src} 
                                    onClick={() => setCoverIndex(index)}
                                    className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all cursor-pointer group ${
                                        coverIndex === index ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100 hover:border-gray-300'
                                    }`}
                                >
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    
                                    {/* Cover Badge */}
                                    <div className={`absolute top-1 left-1 px-1.5 py-0.5 rounded flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider ${
                                        coverIndex === index ? 'bg-green-600 text-white' : 'bg-black/40 text-white opacity-0 group-hover:opacity-100'
                                    }`}>
                                        <FaStar size={8} /> {coverIndex === index ? 'Cover' : 'Set Cover'}
                                    </div>

                                    {/* Delete Button */}
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation(); // Don't trigger cover change when deleting
                                            removeImage(index);
                                        }}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                            
                            {previews.length < 6 && (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-green-400 transition-all"
                                >
                                    <FaCloudUploadAlt className="text-gray-400 mb-1" size={20} />
                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Add Photo</span>
                                </div>
                            )}
                        </div>
                        <p className="text-[10px] text-gray-400 italic">Tip: Click an image to set it as the main cover photo.</p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-6 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-md hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? 'Processing...' : <><FaCheckCircle /> List Vehicle Now</>}
                    </button>
                </div>
            </form>
        </div>
    );
}