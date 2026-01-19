'use client';

import { useState } from 'react';
import { 
    FaShieldAlt, FaCog, FaBell, FaGlobe, FaSave, 
    FaCheckCircle, FaLock, FaEnvelope, FaExclamationTriangle 
} from 'react-icons/fa';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setShowToast(true);
            setTimeout(() => setShowToast(false), 3000);
        }, 800);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <FaCog /> },
        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
        { id: 'alerts', label: 'Fleet Alerts', icon: <FaBell /> },
    ];

    return (
        <div className="max-w-8xl mx-auto pb-10">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">System Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your Emit Photography fleet preferences and security.</p>
                </div>
                
                {showToast && (
                    <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 animate-bounce">
                        <FaCheckCircle /> <span className="text-sm font-bold">Changes saved successfully!</span>
                    </div>
                )}
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full md:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm ${
                                activeTab === tab.id 
                                ? 'bg-green-600 text-white shadow-lg shadow-green-200' 
                                : 'text-gray-500 hover:bg-white hover:text-gray-800'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        {activeTab === 'general' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaGlobe className="text-green-600" /> General Configuration
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Business Name</label>
                                        <input type="text" defaultValue="Emit Photography" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Support Email</label>
                                        <input type="email" defaultValue="admin@emit.com" className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">System Currency</label>
                                        <select className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white cursor-pointer">
                                            <option value="ZMW">ZMW (K) - Zambian Kwacha</option>
                                            <option value="USD">USD ($) - US Dollar</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">Timezone</label>
                                        <select className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
                                            <option>Lusaka (GMT+2)</option>
                                            <option>Johannesburg (GMT+2)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaLock className="text-green-600" /> Security Controls
                                </h2>
                                <div className="p-6 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div>
                                        <p className="font-bold text-gray-900">Administrative Password</p>
                                        <p className="text-sm text-gray-500">Update the master password for the fleet dashboard.</p>
                                    </div>
                                    <button className="bg-white border border-gray-300 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all shadow-sm">
                                        Change Password
                                    </button>
                                </div>
                                <div className="flex items-center gap-4 p-4 text-amber-700 bg-amber-50 rounded-xl border border-amber-100 text-sm">
                                    <FaExclamationTriangle className="text-xl shrink-0" />
                                    <p>Multi-factor authentication is currently disabled. We recommend enabling it to protect your vehicle GPS data.</p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'alerts' && (
                            <div className="space-y-6 animate-in fade-in duration-500">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <FaBell className="text-green-600" /> Fleet Notifications
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Overspeeding Alerts', desc: 'Notify when a vehicle exceeds 100km/h' },
                                        { label: 'Geofence Exit', desc: 'Notify if a car leaves the Lusaka province boundary' },
                                        { label: 'Offline Status', desc: 'Alert me if a GPS tracker loses signal for >15 mins' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 1} />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3 border-t border-gray-100">
                        <button className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all">
                            Discard
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all disabled:opacity-50"
                        >
                            {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}