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
            // Consistency: Sending residency for both, but defaulting to 'Corporate' for partners
            residency: form.role === 'customer' ? form.residency : 'Corporate' 
        }, {
            headers: { 'Content-Type': 'application/json' }
        });

        // 1. Success Feedback
        toast.success("Welcome! Check your email to verify and login.", {
            duration: 6000,
            icon: '✉️',
        });

        // 2. Clear local form/message
        setMessage("");

        // 3. Redirect to a 'Check Email' notice or Sign In page
        // We wait slightly longer (2.5s) so they can read the toast message
        setTimeout(() => {
            router.push('/auth/signin?message=please_verify');
        }, 2500);

    } catch (err) {
        // Handle the specific error message from your PHP (like "Email already registered")
        const errorText = err.response?.data?.message || "Something went wrong. Please try again.";
        setMessage(errorText);
        toast.error(errorText);
    } finally {
        setBusy(false);
    }
}
    const BrandingContent = ({ isMobile }) => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
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
            {isMobile ? (
                <div className="flex flex-col gap-2 lg:hidden">
                    <div className="h-1 bg-gray-200 rounded-full overflow-hidden w-32">
                        <div className={`h-full bg-green-600 rounded-full transition-all duration-[2900ms] ease-out ${startLoader ? 'w-full' : 'w-0'}`}></div>
                    </div>
                    <span className="text-xs text-green-700 font-medium">Setting up your experience...</span>
                </div>
            ) : (
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
            <div className={`lg:hidden absolute inset-0 z-50 w-full h-full bg-gray-50 flex flex-col justify-center items-center px-12 transition-transform duration-1000 ease-in-out ${introFinished ? '-translate-y-full pointer-events-none' : 'translate-y-0'}`}>
                <BrandingContent isMobile={true} />
            </div>
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative overflow-hidden">
                <BrandingContent isMobile={false} />
            </div>
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
                            <div className="grid grid-cols-2 gap-3 mb-2">
                                <button type="button" onClick={() => setField('role', 'customer')} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'customer' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`}>
                                    <FaUser className="mb-2 text-lg" />
                                    <span className="font-bold text-xs uppercase tracking-wide">Customer</span>
                                </button>
                                <button type="button" onClick={() => setField('role', 'partner')} className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-200 ${form.role === 'partner' ? 'border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600' : 'border-gray-200 hover:border-green-200 hover:bg-gray-50 text-gray-600'}`}>
                                    <FaBriefcase className="mb-2 text-lg" />
                                    <span className="font-bold text-xs uppercase tracking-wide">Partner</span>
                                </button>
                            </div>

                            <AuthInput label="Full Name" value={form.name} onChange={(e) => setField("name", e.target.value)} placeholder="John Doe" icon={FaUser} error={errors.name} />
                            <AuthInput label="Email" type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} placeholder="name@example.com" icon={FaEnvelope} error={errors.email} />
                            
                            {/* CONDITIONAL RESIDENCY: Only shows for Customers */}
                            {form.role === 'customer' && (
                                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Residency Status</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                                            <FaGlobeAmericas />
                                        </div>
                                        <select 
                                            value={form.residency} 
                                            onChange={(e) => setField("residency", e.target.value)}
                                            className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-sm appearance-none"
                                        >
                                            <option value="Local">Local Resident</option>
                                            <option value="International">International Tourist</option>
                                            <option value="Corporate">Corporate Individual</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            <AuthInput label="Password" type={show ? "text" : "password"} value={form.password} onChange={(e) => setField("password", e.target.value)} placeholder="••••••••" icon={FaLock} error={errors.password} />
                            <AuthInput label="Confirm Password" type={show ? "text" : "password"} value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} placeholder="••••••••" icon={FaLock} error={errors.confirmPassword} />

                            <div className="flex justify-end">
                                <button type="button" onClick={() => setShow(!show)} className="text-xs text-gray-500 hover:text-green-700 font-medium">{show ? "Hide Passwords" : "Show Passwords"}</button>
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