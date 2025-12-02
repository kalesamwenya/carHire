'use client';

import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { FaUser, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, FaBell, FaLock, FaShieldAlt, FaTrash, FaSave } from 'react-icons/fa';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [avatar, setAvatar] = useState(null);

    // Mock user data state
    const [profile, setProfile] = useState({
        fullName: 'Kaleb Mwenya',
        email: 'kaleb@example.com',
        phone: '0972338115',
        address: 'Lusaka, Zambia'
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        promos: true
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(URL.createObjectURL(file));
            toast.success("Profile photo updated");
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success("Changes saved successfully");
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-fade-in">
            <Toaster position="top-center" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>

            <form onSubmit={handleSave} className="space-y-8">

                {/* 1. Profile Visuals Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Cover Photo */}
                    <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900 relative"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
                            {/* Profile Picture Upload */}
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-md">
                                    {avatar ? (
                                        <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUser className="text-gray-300 text-4xl" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md border border-gray-200 cursor-pointer hover:bg-gray-50 text-gray-600 transition-colors">
                                    <FaCamera size={14} />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* Save Button (Top) */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>

                        {/* Personal Info Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <div className="relative">
                                    <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.fullName}
                                        onChange={e => setProfile({...profile, fullName: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={e => setProfile({...profile, email: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={e => setProfile({...profile, phone: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={profile.address}
                                        onChange={e => setProfile({...profile, address: e.target.value})}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 2. Notifications Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaBell className="text-orange-500" /> Preferences
                        </h3>
                        <div className="space-y-4">
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Booking Confirmations</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.email}
                                    onChange={e => setNotifications({...notifications, email: e.target.checked})}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">SMS Alerts</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.sms}
                                    onChange={e => setNotifications({...notifications, sms: e.target.checked})}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                            </label>
                            <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                <span className="text-sm font-medium text-gray-700">Promotional Offers</span>
                                <input
                                    type="checkbox"
                                    checked={notifications.promos}
                                    onChange={e => setNotifications({...notifications, promos: e.target.checked})}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                            </label>
                        </div>
                    </div>

                    {/* 3. Security Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaShieldAlt className="text-blue-600" /> Security
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <button type="button" className="w-full py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors border border-gray-200">
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="bg-red-50 rounded-2xl border border-red-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                            <FaTrash /> Delete Account
                        </h3>
                        <p className="text-red-600/80 text-sm mt-1">Permanently delete your account and booking history. This action cannot be undone.</p>
                    </div>
                    <button type="button" className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        Delete Account
                    </button>
                </div>

            </form>
        </div>
    );
}