"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaArrowLeft, FaGem } from "react-icons/fa";
import { toast, Toaster } from 'react-hot-toast';
import AuthInput from '@/components/auth/AuthInput'; // Use this for fields
import AuthShell from '@/components/auth/AuthShell'; // Use this for the wrapper

export default function SignInPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [show, setShow] = useState(false); // Toggle password visibility
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});

    // Animation States
    const [mounted, setMounted] = useState(false);
    const [startLoader, setStartLoader] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    useEffect(() => {
        setMounted(true);

        // 1. Wait 100ms before starting the bar (ensures it starts at 0%)
        const loaderTimer = setTimeout(() => setStartLoader(true), 100);

        // 2. Wait 3s before finishing the intro
        const finishTimer = setTimeout(() => setIntroFinished(true), 3000);

        return () => {
            clearTimeout(loaderTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    function setField(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
        setErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e = {};
        if (!form.email.trim()) e.email = "Email is required";
        if (!form.password) e.password = "Password is required";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setBusy(true);

        try {
            const result = await signIn('credentials', {
                redirect: false,
                email: form.email,
                password: form.password,
            });

            if (result?.error) {
                toast.error("Invalid email or password");
            } else {
                toast.success("Welcome back!");
                window.location.href = '/dashboard';
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    // --- SHARED BRANDING COMPONENT ---
    const BrandingContent = ({ isMobile }) => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-6 text-green-700">
                <FaGem className="text-2xl animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Emit Car Hire</span>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Drive the <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    Extraordinary.
                </span>
            </h1>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                "No hidden fees. Just the open road and premium service."
            </p>

            {/* Mobile Loader Bar */}
            {isMobile && (
                <div className="flex flex-col gap-2 lg:hidden">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden w-32">
                        <div className={`h-full bg-green-600 rounded-full transition-all duration-[2900ms] ease-out ${startLoader ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <span className="text-xs text-green-700 font-medium">Loading secure login...</span>
                </div>
            )}

            {!isMobile && (
                <div className="flex gap-4">
                    <div className="w-12 h-1 bg-green-600 rounded-full"></div>
                    <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                    <div className="w-4 h-1 bg-gray-300 rounded-full"></div>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
            <Toaster position="top-center" />

            {/* 1. MOBILE SPLASH */}
            <div className={`lg:hidden absolute inset-0 z-50 w-full h-full bg-gray-50 flex flex-col justify-center items-center px-12 transition-transform duration-1000 ease-in-out ${introFinished ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}>
                <div className={`absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <div className={`absolute -bottom-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <BrandingContent isMobile={true} />
            </div>

            {/* 2. DESKTOP SIDEBAR */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative overflow-hidden">
                <div className={`absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <div className={`absolute -bottom-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <BrandingContent isMobile={false} />
            </div>

            {/* 3. FORM */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative z-0">

                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors group z-20">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-300 transition-colors shadow-sm">
                        <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Return Home</span>
                </Link>

                <div className={`w-full max-w-[400px] transition-all duration-1000 delay-300 ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 lg:opacity-100 lg:translate-y-0'}`}>
                    <AuthShell title="Welcome Back" subtitle="Sign in to manage your bookings.">
                        <form onSubmit={onSubmit} className="space-y-6 mt-8">

                            {/* Email Field */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-900">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setField("email", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-green-600 focus:ring-green-50'} bg-white text-sm outline-none focus:ring-4 transition-all duration-200 shadow-sm`}
                                    placeholder="kaleb@example.com"
                                />
                                {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-medium text-gray-900">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs text-gray-500 hover:text-green-700 font-medium hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => setField("password", e.target.value)}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:border-green-600 focus:ring-green-50'} bg-white text-sm outline-none focus:ring-4 transition-all duration-200 shadow-sm pr-12`}
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow((s) => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400 hover:text-green-700 uppercase tracking-wider"
                                    >
                                        {show ? "Hide" : "Show"}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={busy}
                                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {busy ? "Authenticating..." : "Sign In to Dashboard"}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-500">
                                    Don't have an account?{' '}
                                    <Link href="/auth/signup" className="font-semibold text-green-700 hover:underline">
                                        Join for free
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}