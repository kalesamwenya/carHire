'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toast, Toaster } from 'react-hot-toast';
import { 
    FaUser, FaCamera, FaEnvelope, FaPhone, FaMapMarkerAlt, 
    FaBell, FaLock, FaShieldAlt, FaTrash, FaSave, FaIdCard, FaTimes 
} from 'react-icons/fa';

const api = axios.create({
    baseURL: 'https://api.citydrivehire.com',
    timeout: 15000,
});

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    
    // State for image handling
    const [avatar, setAvatar] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Profile State
    const [profile, setProfile] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        driver_license: '',
        bio: ''
    });

    // Security State
    const [passwords, setPasswords] = useState({ current: '', new: '' });
    const [twoFactor, setTwoFactor] = useState(false);

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        promos: true
    });

    // Load actual user data on mount
    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) {
            fetchUserData();
        }
    }, [session, status]);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/users/profile.php', {
                params: { user_id: session.user.id }
            });
            const data = res.data;
            setProfile({
                fullName: data.name || '',
                email: data.email || '',
                phone: data.phone || '',
                address: data.location || '',
                driver_license: data.driver_license || '',
                bio: data.bio || ''
            });
            setAvatar(data.image || null);
        } catch (e) {
            toast.error("Failed to load settings");
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image too large (Max 2MB)");
                return;
            }
            setSelectedFile(file);
            setAvatar(URL.createObjectURL(file));
            toast.success("Preview updated. Click 'Save' to upload.");
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('user_id', session.user.id);
        data.append('name', profile.fullName);
        data.append('phone', profile.phone);
        data.append('location', profile.address);
        data.append('driver_license', profile.driver_license);
        data.append('bio', profile.bio);
        
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            const res = await api.post('/users/profile-update.php', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success("Profile updated successfully");
                setSelectedFile(null);
            }
        } catch (e) {
            toast.error("Update failed. Check connection.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (!passwords.new || !passwords.current) {
            return toast.error("Please fill in both password fields");
        }
        setIsLoading(true);
        try {
            const res = await api.post('/users/password-update.php', {
                user_id: session.user.id,
                current_password: passwords.current,
                new_password: passwords.new
            });
            if (res.data.success) {
                toast.success("Password changed successfully!");
                setPasswords({ current: '', new: '' });
                setIsPasswordModalOpen(false);
            } else {
                toast.error(res.data.message || "Failed to update password");
            }
        } catch (e) {
            toast.error("Error updating password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto pb-12 animate-fade-in px-4 relative">
            <Toaster position="top-center" />

            <h1 className="text-3xl font-bold text-gray-900 mb-8 mt-8">Account Settings</h1>

            <form onSubmit={handleSave} className="space-y-8">

                {/* 1. Profile Visuals Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-gray-700 to-gray-900 relative"></div>

                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 mb-6">
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

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
                            >
                                {isLoading ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormInput label="Full Name" icon={<FaUser />} value={profile.fullName} 
                                onChange={v => setProfile({...profile, fullName: v})} />
                            
                            <FormInput label="Email Address" icon={<FaEnvelope />} value={profile.email} disabled={true} />
                            
                            <FormInput label="Phone Number" icon={<FaPhone />} value={profile.phone} 
                                onChange={v => setProfile({...profile, phone: v})} />
                            
                            <FormInput label="Location" icon={<FaMapMarkerAlt />} value={profile.address} 
                                onChange={v => setProfile({...profile, address: v})} />

                            <FormInput label="License Number" icon={<FaIdCard />} value={profile.driver_license} 
                                onChange={v => setProfile({...profile, driver_license: v})} />
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
                            <ToggleButton label="Booking Confirmations" checked={notifications.email} 
                                onChange={v => setNotifications({...notifications, email: v})} />
                            <ToggleButton label="SMS Alerts" checked={notifications.sms} 
                                onChange={v => setNotifications({...notifications, sms: v})} />
                            <ToggleButton label="Promotional Offers" checked={notifications.promos} 
                                onChange={v => setNotifications({...notifications, promos: v})} />
                        </div>
                    </div>

                    {/* 3. Security Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaShieldAlt className="text-blue-600" /> Security
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <div>
                                    <p className="text-sm font-bold text-gray-700">Password</p>
                                    <p className="text-xs text-gray-400">••••••••••••</p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-50 shadow-sm transition-all"
                                >
                                    Update
                                </button>
                            </div>

                            <div className="pt-2">
                                <ToggleButton 
                                    label="Two-Factor Auth" 
                                    checked={twoFactor} 
                                    onChange={v => setTwoFactor(v)} 
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. Danger Zone */}
                <div className="bg-red-50 rounded-2xl border border-red-100 p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-bold text-red-700 flex items-center gap-2">
                            <FaTrash /> Delete Account
                        </h3>
                        <p className="text-red-600/80 text-sm mt-1">Permanently delete your account and booking history.</p>
                    </div>
                    <button type="button" className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-600 hover:text-white transition-all shadow-sm">
                        Delete Account
                    </button>
                </div>
            </form>

            {/* Password Change Modal */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">Update Password</h2>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <div className="p-8 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        value={passwords.current}
                                        onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                <div className="relative">
                                    <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all"
                                        value={passwords.new}
                                        onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setIsPasswordModalOpen(false)}
                                    className="flex-1 py-3 text-gray-500 font-semibold hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="button"
                                    onClick={handlePasswordUpdate}
                                    disabled={isLoading}
                                    className="flex-[2] py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg disabled:opacity-70"
                                >
                                    {isLoading ? 'Updating...' : 'Save Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper components
function FormInput({ label, icon, value, onChange, disabled = false }) {
    return (
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">{icon}</span>
                <input
                    type="text"
                    value={value}
                    disabled={disabled}
                    onChange={e => onChange?.(e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all ${disabled ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50'}`}
                />
            </div>
        </div>
    );
}

function ToggleButton({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
            <span className="text-sm font-medium text-gray-700">{label}</span>
            <input
                type="checkbox"
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
        </label>
    );
}