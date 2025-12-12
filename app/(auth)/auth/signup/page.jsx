"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCarSide, FaUser, FaBriefcase, FaEnvelope, FaLock } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import AuthInput from '@/components/auth/AuthInput';
import AuthShell from '@/components/auth/AuthShell';

export default function SignUpPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer"
    });

    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState("");

    // Animation States
    const [mounted, setMounted] = useState(false);
    const [startLoader, setStartLoader] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loaderTimer = setTimeout(() => setStartLoader(true), 100);
        const finishTimer = setTimeout(() => setIntroFinished(true), 3000);
        return () => {
            clearTimeout(loaderTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    function setField(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
        setMessage("");
        setErrors((e) => ({ ...e, [key]: undefined }));
    }

    function validate() {
        const e = {};
        if (!form.name.trim()) e.name = "Full Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        if (form.password.length < 6) e.password = "Password must be at least 6 characters";
        if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
        setErrors(e);
        return Object.keys(e).length === 0;
    }

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setBusy(true);
        setMessage("");

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    role: form.role
                })
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage(data.message || "Registration failed.");
            } else {
                toast.success(`Welcome, ${form.role === 'partner' ? 'Partner' : 'Traveler'}!`);
                setTimeout(() => router.push('/auth/signin'), 1500);
            }
        } catch (err) {
            setMessage("Something went wrong. Please try again.");
        } finally {
            setBusy(false);
        }
    }

    const BrandingContent = ({ isMobile }) => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>

            {/* NEW LOGO IMPLEMENTATION */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-green-500 shadow-lg">
                    <FaCarSide className="text-xl" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                        City<span className="text-green-600">Drive</span>
                    </h1>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Hire</p>
                </div>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Start Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    Adventure.
                </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
                "The journey of a thousand miles begins with a single step."
            </p>
            {isMobile && (
                <div className="flex flex-col gap-2 lg:hidden">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden w-32">
                        <div className={`h-full bg-green-600 rounded-full transition-all duration-[2900ms] ease-out ${startLoader ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <span className="text-xs text-green-700 font-medium">Setting up your experience...</span>
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

            {/* MOBILE SPLASH */}
            <div className={`lg:hidden absolute inset-0 z-50 w-full h-full bg-gray-50 flex flex-col justify-center items-center px-12 transition-transform duration-1000 ease-in-out ${introFinished ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}>
                <div className={`absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <div className={`absolute -bottom-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <BrandingContent isMobile={true} />
            </div>

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative overflow-hidden">
                <div className={`absolute -top-20 -left-20 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <div className={`absolute -bottom-20 -right-20 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 transition-all duration-[2000ms] delay-500 ${mounted ? 'scale-100' : 'scale-50'}`}></div>
                <BrandingContent isMobile={false} />
            </div>

            {/* FORM AREA */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative z-0">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors group z-20">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-green-300 transition-colors shadow-sm">
                        <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Return Home</span>
                </Link>

                <div className={`w-full max-w-[400px] transition-all duration-1000 delay-300 ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 lg:opacity-100 lg:translate-y-0'}`}>
                    <AuthShell title="Create Account" subtitle="Select your account type to get started.">
                        <form onSubmit={onSubmit} className="space-y-4 mt-6">

                            {/* Account Type Selector */}
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button
                                    type="button"
                                    onClick={() => setField('role', 'customer')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'customer' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <FaUser className="mb-2 text-lg" />
                                    <span className="font-bold text-xs uppercase tracking-wide">Customer</span>
                                    <span className="text-[10px] text-gray-400 mt-0.5">I want to rent</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setField('role', 'partner')}
                                    className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'partner' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <FaBriefcase className="mb-2 text-lg" />
                                    <span className="font-bold text-xs uppercase tracking-wide">Partner</span>
                                    <span className="text-[10px] text-gray-400 mt-0.5">I have a car</span>
                                </button>
                            </div>

                            {/* Name Field */}
                            <AuthInput
                                label="Full Name"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                placeholder="John Doe"
                                icon={FaUser}
                                error={errors.name}
                            />

                            {/* Email Field */}
                            <AuthInput
                                label="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setField("email", e.target.value)}
                                placeholder="name@example.com"
                                icon={FaEnvelope}
                                error={errors.email}
                            />

                            {/* Password Field */}
                            <AuthInput
                                label="Password"
                                type={show ? "text" : "password"}
                                value={form.password}
                                onChange={(e) => setField("password", e.target.value)}
                                placeholder="••••••••"
                                icon={FaLock}
                                error={errors.password}
                            />

                            {/* Confirm Field */}
                            <AuthInput
                                label="Confirm Password"
                                type={show ? "text" : "password"}
                                value={form.confirmPassword}
                                onChange={(e) => setField("confirmPassword", e.target.value)}
                                placeholder="••••••••"
                                icon={FaLock}
                                error={errors.confirmPassword}
                            />

                            {/* Show/Hide Toggle */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShow(!show)}
                                    className="text-xs text-gray-500 hover:text-green-700 font-medium"
                                >
                                    {show ? "Hide Passwords" : "Show Passwords"}
                                </button>
                            </div>

                            {message && <div className="p-4 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center animate-pulse">{message}</div>}

                            <button type="submit" disabled={busy} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2">
                                {busy ? "Creating Account..." : "Create Account"}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-500">Already have an account? <Link href="/auth/signin" className="font-semibold text-green-700 hover:underline">Sign In</Link></p>
                            </div>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}