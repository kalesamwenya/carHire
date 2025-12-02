'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import AuthInput from '../../../components/auth/AuthInput';

export default function SignUpPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (form.password.length < 6) {
            return toast.error("Password must be at least 6 characters");
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    password: form.password
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Registration failed');
            }

            toast.success("Account created! Please sign in.");
            setTimeout(() => router.push('/signin'), 2000);

        } catch (error) {
            toast.error(error.message);
        } finally {
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
                    Create your account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/auth/signin" className="font-medium text-green-600 hover:text-green-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>

                        <AuthInput
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({...form, name: e.target.value})}
                            icon={FaUser}
                        />

                        <AuthInput
                            label="Email address"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({...form, email: e.target.value})}
                            icon={FaEnvelope}
                        />

                        <AuthInput
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({...form, password: e.target.value})}
                            icon={FaLock}
                        />

                        <AuthInput
                            label="Confirm Password"
                            type="password"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={(e) => setForm({...form, confirmPassword: e.target.value})}
                            icon={FaLock}
                        />

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors disabled:opacity-70"
                            >
                                {loading ? <FaSpinner className="animate-spin h-5 w-5" /> : 'Create Account'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-xs text-gray-500">
                        By creating an account, you agree to our{' '}
                        <a href="/terms" className="text-green-600 hover:underline">Terms of Service</a> and{' '}
                        <a href="/privacy" className="text-green-600 hover:underline">Privacy Policy</a>.
                    </div>
                </div>
            </div>
        </main>
    );
}