'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt,
    FaSave, FaTimes, FaArrowLeft, FaShieldAlt
} from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';

export default function EditUserPage({ params }) {
    const router = useRouter();
    const { id } = params; // In real app, fetch user data using this ID

    // --- MOCK INITIAL STATE ---
    // In a real app, you would fetch this data inside useEffect
    const [formData, setFormData] = useState({
        name: 'Alice Walker',
        email: 'alice@example.com',
        phone: '+260 972 338 115',
        address: '123 Independence Ave, Lusaka',
        role: 'customer',
        status: 'active',
    });

    const [saving, setSaving] = useState(false);

    // Handle Input Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Simulate API Call
        setTimeout(() => {
            setSaving(false);
            toast.success("Profile updated successfully!");
            // Redirect back to user details after short delay
            setTimeout(() => router.push(`/admin/users/${id}`), 1000);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Toaster position="top-center" />

            {/* --- HEADER --- */}
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href={`/admin/users/${id}`}
                    className="p-2 bg-white border border-gray-200 rounded-lg text-gray-500 hover:text-green-600 hover:border-green-200 transition-colors"
                >
                    <FaArrowLeft />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Edit User Profile</h1>
                    <p className="text-sm text-gray-500">Update information for user #{id}</p>
                </div>
            </div>

            {/* --- FORM CONTAINER --- */}
            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

                {/* SECTION 1: Personal Information */}
                <div className="p-8 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaUser className="text-green-600" /> Personal Details
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaUser /></div>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaEnvelope /></div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaPhone /></div>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Physical Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaMapMarkerAlt /></div>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* SECTION 2: Account Settings */}
                <div className="p-8 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <FaShieldAlt className="text-blue-600" /> Account Settings
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Role Selector */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">User Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                            >
                                <option value="customer">Customer</option>
                                <option value="partner">Partner (Car Owner)</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        {/* Status Selector */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-700">Account Status</label>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold outline-none focus:ring-2 ${
                                    formData.status === 'active' ? 'text-green-700 bg-green-50 focus:ring-green-500' :
                                        formData.status === 'suspended' ? 'text-red-700 bg-red-50 focus:ring-red-500' :
                                            'text-gray-700 bg-white'
                                }`}
                            >
                                <option value="active">Active</option>
                                <option value="suspended">Suspended</option>
                                <option value="pending">Pending Approval</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* --- ACTIONS FOOTER --- */}
                <div className="px-8 py-6 bg-gray-50 border-t border-gray-200 flex items-center justify-end gap-4">
                    <Link
                        href={`/admin/users/${id}`}
                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-white hover:border-gray-400 transition-all flex items-center gap-2"
                    >
                        <FaTimes /> Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-2.5 rounded-lg bg-green-600 text-white font-bold hover:bg-green-700 shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {saving ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </div>

            </form>
        </div>
    );
}