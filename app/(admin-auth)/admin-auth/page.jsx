'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { toast, Toaster } from 'react-hot-toast';
import { FaLock, FaEnvelope, FaSpinner, FaGem } from 'react-icons/fa';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                toast.error("Invalid credentials");
                setLoading(false);
            } else {
                toast.success("Login successful");
                window.location.href = '/admin/dashboard';
            }
        } catch (error) {
            toast.error("An error occurred");
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden">
            <Toaster position="top-center" />

            {/* Minimal Header */}
            <div className="bg-slate-900 p-6 text-center">
                <div className="flex justify-center mb-3">
                    <FaGem className="text-3xl text-green-500" />
                </div>
                <h1 className="text-xl font-bold text-white">CityDriveHire</h1>
                <p className="text-slate-400 text-xs">Secure Staff Access</p>
            </div>

            {/* Simple Form */}
            <div className="p-8">
                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <FaEnvelope />
                            </span>
                            <input
                                type="email"
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                placeholder="admin@emit.com"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Password</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                                <FaLock />
                            </span>
                            <input
                                type="password"
                                required
                                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all"
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-900 text-white py-2.5 rounded-md font-bold text-sm hover:bg-slate-800 transition-colors flex justify-center items-center disabled:opacity-70"
                    >
                        {loading ? <FaSpinner className="animate-spin" /> : 'Sign In'}
                    </button>
                </form>
            </div>

            <div className="bg-gray-50 border-t border-gray-100 p-4 text-center">
                <a href="/" className="text-xs text-gray-500 hover:text-slate-900">
                    &larr; Back to Website
                </a>
            </div>
        </div>
    );
}