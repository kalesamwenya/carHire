'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaCamera, FaUser, FaBuilding, FaCreditCard, FaBell, FaLock, FaSave } from 'react-icons/fa';

export default function PartnerSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState(null); // State for profile preview

    // Form States with default values matching your request
    const [profile, setProfile] = useState({
        businessName: 'Emit Photography',
        contactName: 'Kaleb Mwenya',
        email: 'kaleb@emit.com',
        phone: '0972338115',
        bio: 'Professional photography and car rental services in Lusaka.'
    });

    const [bankDetails, setBankDetails] = useState({
        bankName: 'Zambia National Commercial Bank',
        accountNumber: '**** **** **** 8829',
        accountName: 'Emit Photography'
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setAvatar(url);
            toast.success("Profile picture updated!");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Settings saved successfully");
        }, 1000);
    };

    return (
        <div className="max-w-8xl mx-auto pb-12 animate-fade-in">
            <Toaster position="top-center" />

            {/* Header / Title */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your business profile, payout details, and preferences.</p>
            </div>

            <form onSubmit={handleSave} className="space-y-8">

                {/* 1. Profile Visuals Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cover Photo Area */}
                    <div className="h-32 bg-gradient-to-r from-green-700 to-emerald-500 relative"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            {/* Avatar Upload */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-md flex items-center justify-center">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="text-gray-300 text-4xl" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors text-gray-600">
                                    <FaCamera size={14} />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* Quick Save Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 shadow-sm transition-all flex items-center gap-2"
                            >
                                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                                <div className="relative">
                                    <FaBuilding className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.businessName}
                                        onChange={(e) => setProfile({...profile, businessName: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    value={profile.phone}
                                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Bio / Description</label>
                                <textarea
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                                    placeholder="Tell us about your business..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Payout & Banking */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <FaCreditCard className="text-green-600" /> Banking & Payouts
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                            <select
                                value={bankDetails.bankName}
                                onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option>Zambia National Commercial Bank</option>
                                <option>Standard Chartered</option>
                                <option>Absa Bank Zambia</option>
                                <option>FNB Zambia</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                            <input
                                type="text"
                                value={bankDetails.accountNumber}
                                onChange={(e) => setBankDetails({...bankDetails, accountNumber: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                            <input
                                type="text"
                                value={bankDetails.accountName}
                                onChange={(e) => setBankDetails({...bankDetails, accountName: e.target.value})}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Notifications & Security Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Notifications */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaBell className="text-blue-600" /> Notifications
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Booking Alerts</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Payout Confirmations</span>
                                <input type="checkbox" defaultChecked className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <span className="text-sm font-medium text-gray-700">Marketing Emails</span>
                                <input type="checkbox" className="w-5 h-5 text-green-600 rounded focus:ring-green-500 cursor-pointer" />
                            </div>
                        </div>
                    </div>

                    {/* Security */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaLock className="text-red-600" /> Security
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Change Password</label>
                                <input type="password" placeholder="New Password" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none" />
                            </div>
                            <button type="button" className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    );
}