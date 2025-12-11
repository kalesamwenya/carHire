'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FaUserShield, FaArrowLeft, FaCheck, FaEnvelope, FaLock } from 'react-icons/fa';

export default function AddAdminPage() {
    const [role, setRole] = useState('support');

    return (
        <div className="max-w-3xl mx-auto">
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

                <form className="p-8 space-y-6">
                    {/* Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaUserShield /></div>
                                <input type="text" placeholder="e.g. Jane Doe" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400"><FaEnvelope /></div>
                                <input type="email" placeholder="e.g. jane@emit.com" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-slate-500 outline-none" />
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">Access Level</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Role Card 1 */}
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

                            {/* Role Card 2 */}
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

                            {/* Role Card 3 */}
                            <div
                                onClick={() => setRole('support')}
                                className={`cursor-pointer border rounded-xl p-4 transition-all ${role === 'support' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-gray-200 hover:border-green-200'}`}
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
                        <button className="px-6 py-2.5 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-md">
                            Send Invitation
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}