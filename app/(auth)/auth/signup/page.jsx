"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaCarSide, FaUser, FaBriefcase, FaEnvelope, FaLock, FaGlobeAmericas } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios"; 
import AuthInput from '@/components/auth/AuthInput';
import AuthShell from '@/components/auth/AuthShell';

export default function SignUpPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "customer",
        residency: "Local" 
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

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    async function onSubmit(e) {
        e.preventDefault();
        if (!validate()) return;
        setBusy(true);
        setMessage("");

        try {
            const response = await axios.post(`${BASE_API}/users/register.php`, {
                name: form.name,
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: form.role,
                residency: form.role === 'customer' ? form.residency : 'Corporate' 
            });

            toast.success("Welcome! Check your email to verify and login.", {
                duration: 6000,
                icon: '✉️',
            });

            setTimeout(() => {
                router.push('/auth/signin?message=please_verify');
            }, 2500);

        } catch (err) {
            const errorText = err.response?.data?.message || "Something went wrong. Please try again.";
            setMessage(errorText);
            toast.error(errorText);
        } finally {
            setBusy(false);
        }
    }

    const BrandingContent = ({ isMobile }) => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            {/* BRAND LOGO */}
            <div className="flex items-center gap-3 mb-8 group">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-slate-900 text-green-500 group-hover:scale-105 transition-all">
                    <FaCarSide className="text-2xl" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight leading-none text-slate-900">
                        City<span className="text-green-600">Drive</span>
                    </h1>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">
                        Car Hire
                    </p>
                </div>
            </div>

            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Start Your <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    Adventure.
                </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed mb-8 italic">
                "Your journey deserves more than just a ride; it deserves the ultimate driving experience."
            </p>

            {/* LINE LOADER */}
            <div className={`flex flex-col gap-4 mt-10 transition-all duration-700 ${
                introFinished ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'
            }`}>
                <div className="flex items-center justify-between w-64">
                    <span className="text-[10px] uppercase tracking-[0.3em] text-green-700 font-black animate-pulse">
                        Initializing Portal
                    </span>
                </div>
                <div className="h-[2px] bg-slate-100 rounded-full overflow-hidden w-64 relative">
                    <div 
                        className={`absolute top-0 left-0 h-full bg-green-600 transition-all duration-[2800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                            startLoader ? 'w-full' : 'w-0'
                        }`}
                    />
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden relative">
            <Toaster position="top-center" />
            
            {/* Mobile Intro Overlay */}
            <div className={`lg:hidden absolute inset-0 z-50 w-full h-full bg-white flex flex-col justify-center items-center px-12 transition-transform duration-1000 ease-in-out ${introFinished ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}>
                <BrandingContent isMobile={true} />
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative overflow-hidden">
                <BrandingContent isMobile={false} />
            </div>

            {/* Form Side */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative z-0 bg-white">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700 transition-colors group z-20">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>

                <div className={`w-full max-w-[440px] transition-all duration-1000 delay-300 ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 lg:opacity-100 lg:translate-y-0'}`}>
                    <AuthShell title="Create Account" subtitle="Select your account type to get started.">
                        <form onSubmit={onSubmit} className="space-y-4 mt-6">
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button type="button" onClick={() => setField('role', 'customer')} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'customer' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600 shadow-sm' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-400'}`}>
                                    <FaUser className="mb-2 text-lg" />
                                    <span className="font-bold text-[10px] uppercase tracking-wider">Customer</span>
                                </button>
                                <button type="button" onClick={() => setField('role', 'partner')} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'partner' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600 shadow-sm' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-400'}`}>
                                    <FaBriefcase className="mb-2 text-lg" />
                                    <span className="font-bold text-[10px] uppercase tracking-wider">Partner</span>
                                </button>
                            </div>

                            <AuthInput className="text-black" label="Full Name" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="John Doe" icon={FaUser} error={errors.name} />
                            <AuthInput className="text-black" label="Email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" icon={FaEnvelope} error={errors.email} />
                            
                            {form.role === 'customer' && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Residency Status</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                                            <FaGlobeAmericas />
                                        </div>
                                        <select 
                                            value={form.residency} 
                                            onChange={(e) => setField("residency", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm text-black appearance-none"
                                        >
                                            <option value="Local">Local Resident</option>
                                            <option value="International">International Tourist</option>
                                            <option value="Corporate">Corporate Individual</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AuthInput className="text-black" label="Password" type={show ? "text" : "password"} value={form.password} onChange={(e) => setField("password", e.target.value)} placeholder="••••••••" icon={FaLock} error={errors.password} />
                                <AuthInput className="text-black" label="Confirm" type={show ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} placeholder="••••••••" icon={FaLock} error={errors.confirmPassword} />
                            </div>

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShow(!show)} className="text-[10px] uppercase tracking-wider text-gray-400 hover:text-green-700 font-bold transition-colors">
                                    {show ? "Hide Passwords" : "Show Passwords"}
                                </button>
                            </div>

                            {message && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 text-center font-bold animate-pulse">{message}</div>}

                            <button type="submit" disabled={busy} className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 mt-2">
                                {busy ? "Creating Account..." : "Join CityDrive"}
                            </button>

                            <div className="text-center pt-2">
                                <p className="text-sm text-gray-500">Already have an account? <Link href="/auth/signin" className="font-bold text-green-700 hover:underline">Sign In</Link></p>
                            </div>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}