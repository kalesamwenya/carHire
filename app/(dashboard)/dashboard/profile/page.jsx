'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
    FaUser, FaEnvelope, FaIdCard, FaPhone, 
    FaInfoCircle, FaStar, FaAward, FaRoute, 
    FaCheckCircle, FaExclamationCircle, FaGem,
    FaCrown, FaLeaf, FaBolt, FaShieldAlt 
} from 'react-icons/fa';

 const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

const api = axios.create({
    baseURL: BASE_API,
    timeout: 15000,
});

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated' && session?.user?.id) { 
            fetchUserData(); 
        } else if (status !== 'loading') { 
            setLoading(false); 
        }
    }, [session, status]);

    const fetchUserData = async () => {
        try {
            const res = await api.get('/users/profile.php', { params: { user_id: session.user.id } });
            setUser(res.data);
        } catch (e) { 
            console.error("Failed to load profile");
        } finally { 
            setLoading(false); 
        }
    };

    if (loading) return <div className="p-12 text-center animate-pulse text-gray-400 font-bold uppercase tracking-widest">Loading Dashboard...</div>;

    return (
        <div className="max-w-8xl mx-auto px-4 py-8 relative">
            
            {/* Header Section */}
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
                    <p className="text-gray-500">View your performance at Emit Photography</p>
                </div>
                <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Account ID</p>
                    <p className="text-sm font-mono font-bold text-gray-900">
                        #ED-{String(session?.user?.id || '00000').slice(-5)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Profile Card & Loyalty */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-32 h-32 bg-gray-900 text-white rounded-full flex items-center justify-center text-5xl font-bold shadow-lg overflow-hidden mb-4 border-4 border-white">
                            {user?.image ? (
                                <img src={`http://api.citydrivehire/${user.image}`} className="w-full h-full object-cover" alt="Profile" />
                            ) : (
                                user?.name?.[0]
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
                        <div className="flex items-center gap-1 mt-1 text-orange-500">
                            <FaStar size={12} />
                            <span className="text-sm font-black">{user?.rating || '5.0'} Rating</span>
                        </div>
                        <span className="px-4 py-1.5 bg-gray-900 text-white rounded-full text-[10px] font-black mt-4 uppercase tracking-widest">
                            {user?.membership_tier || 'Silver Member'}
                        </span>
                    </div>

                    {/* Loyalty Card */}
                    <div className="bg-green-600 rounded-3xl p-6 text-white shadow-lg shadow-green-100 relative overflow-hidden">
                        <FaGem className="absolute -right-4 -bottom-4 text-green-500 text-8xl opacity-20 rotate-12" />
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-black uppercase tracking-tighter">Loyalty Points</span>
                                <FaAward className="text-green-200" />
                            </div>
                            <p className="text-3xl font-black">{user?.points || '1,250'}</p>
                            <p className="text-xs text-green-100 mt-1 italic">350 points until Gold status</p>
                            <div className="w-full bg-green-800/40 h-1.5 rounded-full mt-4 overflow-hidden">
                                <div className="bg-white h-full" style={{ width: '70%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Performance & Achievements */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Stats Grid */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Drive Performance</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                            <StatBox label="Total Trips" value={user?.total_trips || '24'} icon={<FaRoute />} />
                            <StatBox label="Safety Score" value="100%" icon={<FaCheckCircle className="text-green-500" />} />
                            <StatBox label="Global Rank" value="#12" icon={<FaStar className="text-orange-400" />} />
                        </div>
                    </div>

                    {/* Achievements Section */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Unlocked Badges</h3>
                        <div className="flex flex-wrap gap-8">
                            <Badge icon={<FaShieldAlt className="text-blue-500" />} label="Safe Pro" active={true} />
                            <Badge icon={<FaBolt className="text-yellow-500" />} label="Quick Setup" active={true} />
                            <Badge icon={<FaLeaf className="text-green-500" />} label="Eco User" active={true} />
                            <Badge icon={<FaCrown className="text-orange-400" />} label="Top Tier" active={false} />
                        </div>
                    </div>

                    {/* Contact Details (Read Only) */}
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <section className="space-y-6">
                                <DetailItem label="Email Address" value={user?.email} icon={<FaEnvelope />} />
                                <DetailItem label="Phone Number" value={user?.phone || 'Not provided'} icon={<FaPhone />} />
                            </section>
                            <section className="space-y-6">
                                <DetailItem label="Identity Status" value={user?.driver_license || 'Verified'} icon={<FaIdCard />} />
                                <DetailItem label="Current Location" value={user?.location || 'Zambia'} icon={<FaInfoCircle />} />
                            </section>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Sub-components
function StatBox({ label, value, icon }) {
    return (
        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-center sm:text-left">
            <div className="text-gray-400 mb-2 flex justify-center sm:justify-start">{icon}</div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</p>
        </div>
    );
}

function Badge({ icon, label, active }) {
    return (
        <div className={`flex flex-col items-center gap-2 ${active ? 'opacity-100' : 'opacity-20 grayscale'}`}>
            <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-xl shadow-inner">
                {icon}
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-gray-500">{label}</span>
        </div>
    );
}

function DetailItem({ label, value, icon }) {
    return (
        <div className="flex items-start gap-4">
            <div className="text-gray-300 mt-1">{icon}</div>
            <div>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
                <p className="text-sm text-gray-900 font-bold">{value}</p>
            </div>
        </div>
    );
}