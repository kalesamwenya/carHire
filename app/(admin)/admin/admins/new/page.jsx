"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserShield, FaArrowLeft, FaCheck, FaEnvelope, FaLock } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import axios from 'axios';

export default function AddAdminPage() {
    const router = useRouter();
    const [role, setRole] = useState('support');
    const [busy, setBusy] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: ''
    });

      const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email) {
            return toast.error("Please fill in all fields");
        }

        setBusy(true);
        try {
            // API call to create the admin user
            const response = await axios.post(`${BASE_API}/admin/add-member.php`, {
                name: form.name,
                email: form.email.trim().toLowerCase(),
                role: role
            });

            toast.success("Invitation sent successfully!");
            setTimeout(() => router.push('/admin/admins'), 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add team member");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="max-w-8xl mx-auto">
            <Toaster position="top-right" />
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/admins" className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-slate-900 transition-colors">
                    <FaArrowLeft />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add Team Member</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 mb-2">Account Details</h2>
                    <p className="text-sm text-gray-500">The new member will receive an email to set their password.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaUserShield />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({...form, name: e.target.value})}
                                    placeholder="e.g. Jane Doe" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none" 
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <FaEnvelope />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    placeholder="e.g. jane@emit.com" 
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">Access Level</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Super Admin */}
                            <div
                                onClick={() => setRole('super_admin')}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${role === 'super_admin' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-gray-200 hover:border-purple-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <FaLock className={role === 'super_admin' ? 'text-purple-600' : 'text-gray-400'} />
                                    {role === 'super_admin' && <FaCheck className="text-purple-600" />}
                                </div>
                                <h3 className="font-bold text-sm text-gray-900">Super Admin</h3>
                                <p className="text-xs text-gray-500 mt-1">Full access to settings, payments, and team management.</p>
                            </div>

                            {/* Fleet Manager */}
                            <div
                                onClick={() => setRole('fleet_manager')}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${role === 'fleet_manager' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <FaUserShield className={role === 'fleet_manager' ? 'text-blue-600' : 'text-gray-400'} />
                                    {role === 'fleet_manager' && <FaCheck className="text-blue-600" />}
                                </div>
                                <h3 className="font-bold text-sm text-gray-900">Fleet Manager</h3>
                                <p className="text-xs text-gray-500 mt-1">Can manage vehicles, bookings, and maintenance logs.</p>
                            </div>

                            {/* Support */}
                            <div
                                onClick={() => setRole('support')}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${role === 'support' ? 'border-green-500 bg-green-50 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-200'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <FaUserShield className={role === 'support' ? 'text-green-600' : 'text-gray-400'} />
                                    {role === 'support' && <FaCheck className="text-green-600" />}
                                </div>
                                <h3 className="font-bold text-sm text-gray-900">Support</h3>
                                <p className="text-xs text-gray-500 mt-1">View-only access to users and bookings for assistance.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <Link href="/admin/admins" className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-bold hover:bg-gray-50">
                            Cancel
                        </Link>
                        <button 
                            type="submit"
                            disabled={busy}
                            className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-md disabled:opacity-50 transition-all"
                        >
                            {busy ? "Processing..." : "Send Invitation"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}