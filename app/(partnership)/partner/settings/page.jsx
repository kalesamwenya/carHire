'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { FaCamera, FaUser, FaBuilding, FaCreditCard, FaMapMarkerAlt, FaIdBadge, FaSave, FaPhone, FaInfoCircle, FaEye, FaTimes, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

export default function PartnerSettings() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [showPreview, setShowPreview] = useState(false); // State for Preview Modal
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);

    const [formData, setFormData] = useState({
        businessName: '',
        phone: '',
        bio: '',
        taxId: '',
        idNumber: '',
        addressLine1: '',
        city: '',
        bankName: 'Zambia National Commercial Bank',
        accountNumber: '',
        kyc_status: null // Track status for the badge
    });

    const Public_Api = "https://api.citydrivehire.com";

    useEffect(() => {
        if (session?.user?.id) {
            fetch(`${Public_Api}/partners/get-settings.php?user_id=${session.user.id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success && data.data) {
                        setFormData({
                            businessName: data.data.business_name || '',
                            phone: data.data.phone || '',
                            bio: data.data.bio || '',
                            taxId: data.data.tax_id || '',
                            idNumber: data.data.id_number || '',
                            addressLine1: data.data.address_line1 || '',
                            city: data.data.city || '',
                            bankName: data.data.bank_name || 'Zambia National Commercial Bank',
                            accountNumber: data.data.account_number || '',
                            kyc_status: data.data.kyc_status
                        });
                        if (data.data.avatar_url) setAvatarPreview(`${Public_Api}/${data.data.avatar_url}`);
                    }
                });
        }
    }, [session]);

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('user_id', session.user.id);
        data.append('business_name', formData.businessName);
        data.append('phone', formData.phone);
        data.append('bio', formData.bio);
        data.append('tax_id', formData.taxId);
        data.append('id_number', formData.idNumber);
        data.append('address_line1', formData.addressLine1);
        data.append('city', formData.city);
        data.append('bank_name', formData.bankName);
        data.append('account_number', formData.accountNumber);
        
        if (avatarFile) data.append('avatar', avatarFile);

        try {
            const res = await fetch(`${Public_Api}/partners/update-settings.php`, {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.success) {
                toast.success("Settings updated!");
                update(); 
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Failed to save settings");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto pb-12 animate-fade-in">
            <Toaster position="top-center" />
            
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 mt-1">Manage Emit Photography profile and payouts.</p>
                </div>
                <button 
                    onClick={() => setShowPreview(true)}
                    className="flex items-center gap-2 bg-white border border-gray-300 px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                >
                    <FaEye className="text-green-600" /> Preview Public Profile
                </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-green-700 to-emerald-500" />
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} className="w-full h-full object-cover" alt="Avatar" />
                                    ) : (
                                        <FaUser className="text-gray-300 text-4xl" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
                                    <FaCamera size={14} className="text-gray-600" />
                                    <input type="file" className="hidden" onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) { 
                                            setAvatarFile(file); 
                                            setAvatarPreview(URL.createObjectURL(file)); 
                                        }
                                    }} />
                                </label>
                            </div>
                            <button type="submit" disabled={isLoading} className="bg-green-600 hover:bg-green-700 text-white px-8 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-100 disabled:opacity-50">
                                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                                <div className="relative">
                                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="text" value={formData.businessName} onChange={(e) => setFormData({...formData, businessName: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Phone</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                                </div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Bio</label>
                                <div className="relative">
                                    <FaInfoCircle className="absolute left-3 top-3.5 text-gray-400" />
                                    <textarea rows="3" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" placeholder="Tell customers about Emit Photography..." />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">TPIN / Tax ID</label>
                                <input type="text" value={formData.taxId} onChange={(e) => setFormData({...formData, taxId: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">NRC / ID Number</label>
                                <div className="relative">
                                    <FaIdBadge className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="text" value={formData.idNumber} onChange={(e) => setFormData({...formData, idNumber: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                                <input type="text" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                                    <input type="text" value={formData.addressLine1} onChange={(e) => setFormData({...formData, addressLine1: e.target.value})} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-green-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Banking Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaCreditCard className="text-green-600" /> Payout Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                            <select value={formData.bankName} onChange={(e) => setFormData({...formData, bankName: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                                <option>Zambia National Commercial Bank</option>
                                <option>Standard Chartered</option>
                                <option>Absa Bank Zambia</option>
                                <option>FNB Zambia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                            <input type="text" value={formData.accountNumber} onChange={(e) => setFormData({...formData, accountNumber: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" />
                        </div>
                    </div>
                </div>
            </form>

            {/* PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-50 rounded-3xl shadow-2xl">
                        <button 
                            onClick={() => setShowPreview(false)}
                            className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-md p-2 rounded-full hover:bg-white text-gray-800 transition-all shadow-md"
                        >
                            <FaTimes size={20} />
                        </button>

                        <div className="bg-white overflow-hidden">
                            {/* Public Profile Header */}
                            <div className="h-48 bg-gradient-to-r from-green-700 to-emerald-500 relative">
                                <div className="absolute -bottom-12 left-8">
                                    <div className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white">
                                        {avatarPreview ? (
                                            <img src={avatarPreview} className="w-full h-full object-cover" alt="Profile" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100"><FaUser className="text-gray-300 text-5xl" /></div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-16 pb-10 px-8">
                                <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                            {formData.businessName || 'Your Business Name'}
                                            {formData.kyc_status === 'verified' && <FaCheckCircle className="text-blue-500" title="Verified" />}
                                        </h1>
                                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                                            <FaMapMarkerAlt className="text-green-600" /> {formData.city || 'Location'}, Zambia
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                                            <FaPhone /> {formData.phone || 'No phone set'}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 underline decoration-green-500 decoration-4 underline-offset-4">About Us</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap italic">
                                        {formData.bio || "Write something in your bio to help customers find you!"}
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-xs text-gray-400 uppercase font-black">Member Since</p>
                                        <p className="font-semibold text-gray-700 flex items-center gap-2 mt-1">
                                            <FaCalendarAlt className="text-green-500" /> 2026
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}