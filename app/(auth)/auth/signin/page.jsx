"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaCarSide, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import AuthShell from "@/components/auth/AuthShell";

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [form, setForm] = useState({ email: "", password: "" });
    const [show, setShow] = useState(false);
    const [busy, setBusy] = useState(false);
    const [message, setMessage] = useState("");

    // Animation States
    const [mounted, setMounted] = useState(false);
    const [startLoader, setStartLoader] = useState(false);
    const [introFinished, setIntroFinished] = useState(false);

    useEffect(() => {
        setMounted(true);
        const loaderTimer = setTimeout(() => setStartLoader(true), 100);
        // Form reveals after the 3s loader finishes
        const finishTimer = setTimeout(() => setIntroFinished(true), 3000);

        return () => {
            clearTimeout(loaderTimer);
            clearTimeout(finishTimer);
        };
    }, []);

    async function onSubmit(e) {
        e.preventDefault();
        setBusy(true);
        const res = await signIn("credentials", {
            redirect: false,
            email: form.email.trim().toLowerCase(),
            password: form.password,
        });

        if (res?.ok) {
            window.location.href = '/dashboard';
        } else {
            setMessage(res?.error || "Invalid credentials");
            setBusy(false);
        }
    }

    const BrandingContent = ({ isMobile }) => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            
            {/* 1. BRAND LOGO INSERTED HERE */}
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
                Experience <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    Excellence.
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
        <span className="text-[10px] font-mono text-slate-400">
            {startLoader && !introFinished ? 'LOD-097' : 'READY'}
        </span>
    </div>
    
    <div className="h-[2px] bg-slate-100 rounded-full overflow-hidden w-64 relative">
        {/* Animated Progress Fill */}
        <div 
            className={`absolute top-0 left-0 h-full bg-green-600 shadow-[0_0_8px_rgba(22,163,74,0.5)] transition-all duration-[2800ms] ease-[cubic-bezier(0.65,0,0.35,1)] ${
                startLoader ? 'w-full' : 'w-0'
            }`}
        />
        
        {/* Subtle Shimmer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20 animate-[shimmer_2s_infinite] -translate-x-full" />
    </div>
</div>

{/* Add this to your globals.css or Tailwind config for the shimmer effect */}
<style jsx>{`
    @keyframes shimmer {
        100% { transform: translateX(300px); }
    }
`}</style>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden relative">
            <Toaster position="top-center" />

            {/* MOBILE INTRO OVERLAY */}
            <div className={`lg:hidden absolute inset-0 z-50 w-full h-full bg-white flex flex-col justify-center items-center px-12 transition-transform duration-1000 ease-in-out ${introFinished ? '-translate-y-full' : 'translate-y-0'}`}>
                <BrandingContent isMobile={true} />
            </div>

            {/* DESKTOP SIDEBAR */}
            <div className="hidden lg:flex w-1/2 bg-slate-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative">
                <BrandingContent isMobile={false} />
            </div>

            {/* LOGIN FORM SIDE */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white">
                
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700 transition-colors group z-20">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>

                <div className={`w-full max-w-[400px] transition-all duration-1000 ${introFinished ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <AuthShell title="Welcome Back" subtitle="Secure member login">
                        <form onSubmit={onSubmit} className="space-y-6 mt-8">
                            <div className="space-y-1.5">
                                <label className="text-sm font-bold text-gray-700">Email</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => setForm({...form, email: e.target.value})}
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-50 bg-gray-50 text-black text-sm outline-none transition-all"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm font-bold text-gray-700">Password</label>
                                </div>
                                <div className="relative">
                                    <input
                                        type={show ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) => setForm({...form, password: e.target.value})}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-600 focus:ring-4 focus:ring-green-50 bg-gray-50 text-black text-sm outline-none transition-all pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShow(!show)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-gray-400 hover:text-black uppercase"
                                    >
                                        {show ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {message && <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 text-center font-bold">{message}</div>}

                            <button type="submit" disabled={busy} className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-xl active:scale-[0.98] transition-all disabled:opacity-50">
                                {busy ? "Authenticating..." : "Sign In"}
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Need an account? <Link href="/auth/signup" className="font-bold text-green-600 hover:underline">Join CityDrive</Link>
                            </p>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-white" />}>
            <LoginContent />
        </Suspense>
    );
}