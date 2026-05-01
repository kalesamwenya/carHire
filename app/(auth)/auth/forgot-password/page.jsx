"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaCarSide, FaPaperPlane, FaEnvelope } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [mounted, setMounted] = useState(false);

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    useEffect(() => { setMounted(true); }, []);

    async function onSubmit(e) {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");
        
        setBusy(true);
        try {
            await axios.post(`${BASE_API}/users/request-reset.php`, { email });
            toast.success("Reset link sent! Please check your inbox.", {
                duration: 5000,
                icon: '✉️',
            });
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setBusy(false);
        }
    }

    const BrandingContent = () => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ease-out ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
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
                Get Back <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    On Track.
                </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed italic">
                "Enter your email and we'll send you a link to reset your secure access."
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-white flex overflow-hidden relative">
            <Toaster position="top-center" />
            
            <div className="hidden lg:flex w-1/2 bg-slate-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative">
                <BrandingContent />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative bg-white">
                <Link href="/auth/signin" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700 group transition-colors z-20">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Sign In</span>
                </Link>

                <div className="w-full max-w-[440px]">
                    <AuthShell title="Forgot Password" subtitle="No worries, it happens to the best of us.">
                        <form onSubmit={onSubmit} className="space-y-6 mt-8">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors">
                                        <FaEnvelope />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all text-black text-sm"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={busy} 
                                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-xl active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                            >
                                {busy ? (
                                    "Sending Reset Link..."
                                ) : (
                                    <>
                                        <FaPaperPlane className="text-xs" /> 
                                        <span>Send Recovery Email</span>
                                    </>
                                )}
                            </button>
                            
                            <div className="text-center">
                                <p className="text-xs text-gray-400">
                                    Can't access your email? <button type="button" className="text-green-700 font-bold hover:underline">Contact Support</button>
                                </p>
                            </div>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}