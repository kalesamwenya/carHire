'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
    FaCloudUploadAlt, FaCar, FaCogs, FaGasPump, FaChair, 
    FaMoneyBillWave, FaCalendarAlt, FaLock, FaCheckCircle, FaSpinner, FaTimes 
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function AddCarPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [checkingStatus, setCheckingStatus] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    
    // IMAGE STATES - Updated for multiple images
    const [images, setImages] = useState([]); 
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    // REAL-TIME STATUS CHECK (From our previous step)
    useEffect(() => {
        const verifyPartnerStatus = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(`${Public_Api}/partners/get-kyc-status.php?user_id=${session.user.id}`);
                const data = await res.json();
                if (data.success && data.kyc_status === 'verified') {
                    setIsVerified(true);
                    update({ ...session, user: { ...session.user, kyc_status: 'verified' } });
                }
            } catch (error) { console.error(error); } finally { setCheckingStatus(false); }
        };
        verifyPartnerStatus();
    }, [session, update]);

    // Handle Multi-Image Selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 6) {
            toast.error("Maximum 6 images allowed");
            return;
        }
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImages([...images, ...files]);
        setPreviews([...previews, ...newPreviews]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setPreviews(previews.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isVerified) return;
        if (images.length === 0) {
            toast.error("Please upload at least one vehicle image.");
            return;
        }

        setLoading(true);
        const formData = new FormData(e.target);
        formData.append('partner_id', session.user.id);
        
        // Append all images to the images[] array for PHP
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
            } else {
                toast.error(data.message || "Failed to list vehicle");
            }
        } catch (error) {
            toast.error("Connection error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (checkingStatus) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
                <p className="text-gray-500 font-medium">Verifying your status...</p>
            </div>
        );
    }

    return (
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            <Toaster position="top-center" />

            {/* KYC LOCK OVERLAY (Your original design) */}
            {!isVerified && (
                <div className="absolute inset-0 z-50 bg-gray-50/60 backdrop-blur-[3px] flex items-start justify-center pt-20">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl border border-amber-100 max-w-md text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaLock size={30} />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">Verification Required</h2>
                        <p className="text-gray-500 mt-2 mb-6 text-sm">
                            Complete your profile to unlock vehicle listings for **Emit Photography**.
                        </p>
                        <button 
                            onClick={() => window.location.href = '/partner/kyc'}
                            className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all shadow-md"
                        >
                            Go to Kyc
                        </button>
                    </div>
                </div>
            )}

            <div className={`mb-8 ${!isVerified ? 'opacity-30' : ''}`}>
                <h1 className="text-2xl font-bold text-gray-900">List a New Vehicle</h1>
                <p className="text-gray-500 mt-1 text-sm">Fill in the details below to add your car to the CityDrive fleet.</p>
            </div>

            <form 
                onSubmit={handleSubmit} 
                className={`grid grid-cols-1 lg:grid-cols-3 gap-8 items-start transition-opacity duration-500 ${!isVerified ? 'opacity-30 pointer-events-none' : ''}`}
            >
                {/* LEFT COLUMN */}
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
                                <input name="year" type="number" placeholder="2022" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><FaMoneyBillWave className="text-gray-400"/> Daily Rate (ZMW)</label>
                                <input name="daily_rate" type="number" placeholder="600" className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" required />
                            </div>
                            {/* NEW FIELDS */}
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
                                <input name="seats" type="number" defaultValue={5} className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Updated for Multi-Image Preview */}
                <div className="lg:col-span-1 lg:sticky lg:top-6 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <FaCloudUploadAlt className="text-green-600" /> Photos (Up to 6)
                        </h3>

                        <input 
                            type="file" 
                            multiple
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={handleImageChange} 
                        />

                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {previews.map((src, index) => (
                                <div key={index} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={src} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <FaTimes size={10} />
                                    </button>
                                </div>
                            ))}
                            {previews.length < 6 && (
                                <div 
                                    onClick={() => fileInputRef.current.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                                >
                                    <FaCloudUploadAlt className="text-gray-400 mb-1" size={20} />
                                    <span className="text-[10px] font-bold text-gray-500">Add Image</span>
                                </div>
                            )}
                        </div>
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