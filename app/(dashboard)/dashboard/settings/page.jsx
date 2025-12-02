'use client';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);

    const handleSave = () => {
        toast.success("Settings saved successfully");
    };

    return (
        <div className="max-w-2xl">
            <Toaster position="top-center" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 divide-y divide-gray-100">

                {/* Notifications */}
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-medium text-gray-700">Email Notifications</p>
                            <p className="text-sm text-gray-500">Receive updates about your bookings and offers.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={notifications}
                                onChange={(e) => setNotifications(e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        </label>
                    </div>
                </div>

                {/* Password */}
                <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Security</h3>
                    <div className="space-y-4">
                        <input type="password" placeholder="Current Password" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <input type="password" placeholder="New Password" className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none" />
                        <button className="text-sm text-green-700 font-medium hover:underline">Change Password</button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="p-6 bg-gray-50 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}