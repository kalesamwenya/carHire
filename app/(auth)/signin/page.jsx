'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import AuthInput from '@/components/auth/AuthInput';

export default function SignInPage() {
    const router = useRouter();
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
                toast.error("Invalid email or password");
                setLoading(false);
            } else {
                toast.success("Welcome back!");
                // Force a hard redirect to ensure session cookies are recognized by the server
                window.location.href = '/dashboard';
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <Toaster position="top-center" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Link href="/" className="flex justify-center text-3xl font-bold text-green-700 mb-6">
                    CarHire
                </Link>
                <h2 className="text-center text-3xl font-extrabold text-gray-900">
                    Sign in to your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Or{' '}
                    <Link href="/auth/signup" className="font-medium text-green-600 hover:text-green-500">
                        create a new account
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <AuthInput
                            label="Email address"
                            type="email"
                            placeholder="kaleb@example.com" // Updated placeholder to match default user
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            icon={FaEnvelope}
                        />

                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="password" // Updated placeholder
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            icon={FaLock}
                        />

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-green-600 hover:text-green-500">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
                            >
                                {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
}