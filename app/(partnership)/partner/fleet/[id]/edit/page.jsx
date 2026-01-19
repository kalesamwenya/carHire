'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { 
    FaCloudUploadAlt, FaCar, FaCogs, FaMoneyBillWave, 
    FaCheckCircle, FaArrowLeft, FaTrash, FaGasPump, FaUsers, FaPalette
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditCarPage() {
    const { data: session } = useSession();
    const { id } = useParams();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [existingImages, setExistingImages] = useState([]);
    const [newImageFiles, setNewImageFiles] = useState([]);
    const [carData, setCarData] = useState(null);
    const fileInputRef = useRef(null);

    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => {
        const fetchCarDetails = async () => {
            if (!session?.user?.id) return;
            try {
                const res = await fetch(`${Public_Api}/partners/get-vehicle-details.php?vehicle_id=${id}&user_id=${session.user.id}`);
                const result = await res.json();
                if (result.success) {
                    const car = result.data.info;
                    setCarData(car);
                    const imgs = typeof car.image_url === 'string' ? JSON.parse(car.image_url) : car.image_url;
                    setExistingImages(imgs || []);
                }
            } catch (error) {
                toast.error("Failed to load details");
            } finally {
                setFetching(false);
            }
        };
        fetchCarDetails();
    }, [id, session]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        setNewImageFiles(prev => [...prev, ...files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        formData.append('vehicle_id', id);
        formData.append('partner_id', session.user.id);
        formData.append('existing_images', JSON.stringify(existingImages));
        newImageFiles.forEach((file) => formData.append('images[]', file));

        try {
            const res = await fetch(`${Public_Api}/partners/update-car.php`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Updates Saved");
                router.push(`/partner/fleet/${id}`);
            }
        } catch (error) {
            toast.error("Connection error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="min-h-screen flex items-center justify-center bg-[#FBFBFE] text-gray-300 animate-pulse font-light tracking-widest uppercase text-sm">Synchronizing...</div>;

    return (
        <div className="min-h-screen bg-[#FBFBFE] pb-24">
            <Toaster position="top-right" />
            
            {/* Minimal Header */}
            <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30">
                <div className="max-w-6xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-full transition-all text-gray-400">
                            <FaArrowLeft size={14} />
                        </button>
                        <div>
                            <p className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1">Fleet Management</p>
                            <h1 className="text-2xl font-light text-gray-800 tracking-tight">{carData?.name}</h1>
                        </div>
                    </div>
                    <button 
                        form="edit-car-form"
                        type="submit" 
                        disabled={loading} 
                        className="bg-gray-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-xl shadow-gray-200 flex items-center gap-3 disabled:bg-gray-200"
                    >
                        {loading ? 'Processing...' : 'Update Vehicle'}
                    </button>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-6 py-12">
                <form id="edit-car-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Media Card */}
                    <div className="lg:col-span-12">
                        <section className="bg-white rounded-[2.5rem] shadow-sm p-10">
                            <div className="flex items-center justify-between mb-10">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Gallery</h3>
                                    <p className="text-sm text-gray-400">Manage the visual presentation of your vehicle.</p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => fileInputRef.current.click()}
                                    className="text-xs font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                                >
                                    + Add New Media
                                </button>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {existingImages.map((img, idx) => (
                                    <div key={idx} className="group relative aspect-[4/3] rounded-3xl overflow-hidden bg-gray-50">
                                        <img src={`${Public_Api}/public/${img.replace(/^\//, '')}`} className="w-full h-full object-cover" alt="fleet" />
                                        <div className="absolute inset-0 bg-white/60 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px] flex items-center justify-center">
                                            <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))} className="bg-white text-red-500 w-12 h-12 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform">
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {newImageFiles.map((file, idx) => (
                                    <div key={idx} className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-inner ring-2 ring-blue-100">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="new" />
                                        <div className="absolute top-3 left-3 bg-blue-500 text-[8px] text-white px-2 py-1 rounded-lg font-black uppercase tracking-tighter">Uploading</div>
                                    </div>
                                ))}
                                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileSelect} />
                            </div>
                        </section>
                    </div>

                    {/* Specification Grid */}
                    <div className="lg:col-span-8 space-y-8">
                        <section className="bg-white rounded-[2.5rem] shadow-sm p-10">
                            <h3 className="text-lg font-bold text-gray-900 mb-10 tracking-tight">Specifications</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                                <InputField label="Public Name" name="name" defaultValue={carData?.name} />
                                <InputField label="Price (ZMW / Day)" name="price_per_day" type="number" defaultValue={carData?.price_per_day} />
                                
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Transmission</label>
                                    <select name="transmission" defaultValue={carData?.transmission} className="w-full bg-gray-50/50 border-none rounded-2xl p-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-blue-500/10 transition-all outline-none appearance-none">
                                        <option value="Automatic">Automatic</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>

                                <InputField label="Fuel Type" name="fuel" defaultValue={carData?.fuel} />
                                <InputField label="Seating" name="seats" type="number" defaultValue={carData?.seats} />
                                <InputField label="Exterior Color" name="color" defaultValue={carData?.color} />
                            </div>
                        </section>
                    </div>

                    {/* Quick Info Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-blue-100 sticky top-32 overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-xl font-medium mb-2">Fleet Audit</h3>
                                <p className="text-blue-100 text-sm font-light mb-10">All changes made here will be audited and synced to the customer-facing Emit Photography mobile app.</p>
                                
                                <div className="space-y-6 mb-10">
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-60">Plate</span>
                                        <span className="font-mono bg-blue-500 px-3 py-1 rounded-lg">{carData?.plate_number}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="opacity-60">Visibility</span>
                                        <span className="font-bold">{carData?.available == 1 ? 'Live' : 'Hidden'}</span>
                                    </div>
                                </div>
                            </div>
                            {/* Decorative element */}
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
                        </div>
                    </div>

                </form>
            </main>
        </div>
    );
}

function InputField({ label, ...props }) {
    return (
        <div className="space-y-3">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                {label}
            </label>
            <input 
                {...props}
                className="w-full bg-gray-50/50 border-none rounded-2xl p-4 text-sm font-bold focus:bg-white focus:ring-4 focus:ring-blue-500/5 transition-all outline-none placeholder:text-gray-200"
            />
        </div>
    );
}