'use client';

import { useState } from 'react';
import { useSession } from "next-auth/react";
import { 
    FaShieldAlt, FaCog, FaBell, FaGlobe, FaSave, 
    FaCheckCircle, FaLock, FaEnvelope, FaExclamationTriangle,
    FaTimes, FaSpinner 
} from 'react-icons/fa';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';

export default function SettingsPage() {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);
    
    // Password Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pwdData, setPwdData] = useState({ current: '', new: '', confirm: '' });
    const [pwdLoading, setPwdLoading] = useState(false);
    const [strength, setStrength] = useState({ score: 0, label: '', color: 'bg-gray-200' });

    // Strength Checker Logic
    const getStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
        let score = 0;
        if (pass.length >= 8) score++;
        if (/[A-Z]/.test(pass)) score++;
        if (/[0-9]/.test(pass)) score++;
        if (/[^A-Za-z0-9]/.test(pass)) score++;

        const levels = [
            { label: 'Very Weak', color: 'bg-red-500' },
            { label: 'Weak', color: 'bg-orange-500' },
            { label: 'Fair', color: 'bg-yellow-500' },
            { label: 'Strong', color: 'bg-green-500' },
            { label: 'Excellent', color: 'bg-emerald-600' }
        ];
        return { score, ...levels[score] };
    };

    // Handle Password Update (API Call)
    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (pwdData.new !== pwdData.confirm) return toast.error("Passwords do not match");
        if (strength.score < 2) return toast.error("Password is too weak");
        if (!session?.user?.id) return toast.error("User session not found");

        setPwdLoading(true);
        try {
            const res = await axios.post('https://api.citydrivehire.com/auth/update-password.php', {
                currentPassword: pwdData.current,
                newPassword: pwdData.new,
                user_id: session.user.id
            });
            toast.success(res.data.message || "Password updated!");
            setIsModalOpen(false);
            setPwdData({ current: '', new: '', confirm: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setPwdLoading(false);
        }
    };

    // Handle General Settings Save
    const handleSaveGeneral = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success("General settings updated!");
        }, 800);
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <FaCog /> },
        { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
        { id: 'alerts', label: 'Fleet Alerts', icon: <FaBell /> },
    ];

    return (
        <div className="max-w-8xl mx-auto pb-10">
            <Toaster position="top-right" />
            
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900">System Settings</h1>
                    <p className="text-gray-500 mt-1">Manage your City Drive Hire fleet preferences and security.</p>
                </div>
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
                                : 'text-gray-500 hover:bg-white hover:text-gray-800 border border-transparent'
                            }`}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between min-h-[500px]">
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
                                        <select className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none bg-white">
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
                                    <button 
                                        onClick={() => setIsModalOpen(true)}
                                        className="bg-white border border-gray-300 px-5 py-2 rounded-lg font-bold text-sm hover:bg-gray-100 transition-all shadow-sm"
                                    >
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
                                        { label: 'Offline Status', desc: 'Alert me if a GPS tracker loses signal' }
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-4 hover:bg-gray-50 rounded-xl transition-all">
                                            <div>
                                                <p className="font-bold text-gray-900 text-sm">{item.label}</p>
                                                <p className="text-xs text-gray-500">{item.desc}</p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 1} />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer Actions (Shows for General/Alerts) */}
                    {activeTab !== 'security' && (
                        <div className="bg-gray-50 px-8 py-5 flex justify-end gap-3 border-t border-gray-100 mt-auto">
                            <button className="px-6 py-2.5 rounded-xl font-bold text-gray-500 hover:text-gray-800 transition-all">
                                Discard
                            </button>
                            <button 
                                onClick={handleSaveGeneral}
                                disabled={isSaving}
                                className="flex items-center gap-2 bg-green-600 text-white px-8 py-2.5 rounded-xl font-bold hover:bg-green-700 shadow-lg shadow-green-100 transition-all disabled:opacity-50"
                            >
                                {isSaving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* PASSWORD UPDATE MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                <FaShieldAlt className="text-green-600" /> Update Password
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <FaTimes />
                            </button>
                        </div>
                        
                        <form onSubmit={handlePasswordUpdate} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Password</label>
                                <input 
                                    type="password" required
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={pwdData.current}
                                    onChange={(e) => setPwdData({...pwdData, current: e.target.value})}
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">New Password</label>
                                <input 
                                    type="password" required minLength={8}
                                    className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                                    value={pwdData.new}
                                    onChange={(e) => {
                                        setPwdData({...pwdData, new: e.target.value});
                                        setStrength(getStrength(e.target.value));
                                    }}
                                />
                                {pwdData.new && (
                                    <div className="pt-2">
                                        <div className="flex justify-between items-center mb-1.5">
                                            <span className="text-[10px] font-black uppercase text-gray-400">Strength</span>
                                            <span className={`text-[10px] font-bold uppercase ${strength.color.replace('bg-', 'text-')}`}>
                                                {strength.label}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div 
                                                className={`h-full transition-all duration-500 ease-out ${strength.color}`}
                                                style={{ width: `${(strength.score + 1) * 20}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Confirm New Password</label>
                                <input 
                                    type="password" required
                                    className={`w-full border rounded-xl p-3 text-sm outline-none transition-all ${
                                        pwdData.confirm && pwdData.new !== pwdData.confirm 
                                        ? 'border-red-300 focus:ring-red-500' 
                                        : 'border-gray-200 focus:ring-green-500'
                                    }`}
                                    value={pwdData.confirm}
                                    onChange={(e) => setPwdData({...pwdData, confirm: e.target.value})}
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl font-bold text-gray-500 bg-gray-50 border border-gray-100">
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={pwdLoading || strength.score < 2}
                                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition-all"
                                >
                                    {pwdLoading ? <FaSpinner className="animate-spin" /> : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}