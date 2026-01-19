"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaArrowLeft, FaGem, FaPaperPlane } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import AuthShell from "@/components/auth/AuthShell";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [busy, setBusy] = useState(false);
    const [mounted, setMounted] = useState(false);

    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";;

    useEffect(() => { setMounted(true); }, []);

    async function onSubmit(e) {
        e.preventDefault();
        if (!email) return toast.error("Please enter your email");
        
        setBusy(true);
        try {
            await axios.post(`${BASE_API}/users/request-reset.php`, { email });
            toast.success("Reset link sent! Please check your inbox.");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong.");
        } finally {
            setBusy(false);
        }
    }

    const BrandingContent = () => (
        <div className={`relative z-10 max-w-md text-left transition-all duration-1000 ${mounted ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
            <div className="flex items-center gap-3 mb-6 text-green-700">
                <FaGem className="text-2xl animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">Account Recovery</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                Get Back <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    On Track.
                </span>
            </h1>
            <p className="text-gray-600 text-lg">
                Enter your email and we'll send you a link to reset your secure access.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
            <Toaster position="top-center" />
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative">
                <BrandingContent />
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative">
                <Link href="/auth/signin" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 group">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center">
                        <FaArrowLeft className="text-xs group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                    <span>Back to Sign In</span>
                </Link>

                <div className="w-full max-w-[400px]">
                    <AuthShell title="Forgot Password" subtitle="No worries, it happens to the best of us.">
                        <form onSubmit={onSubmit} className="space-y-6 mt-8">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-gray-900">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-green-600 focus:ring-green-50 outline-none focus:ring-4 transition-all"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <button type="submit" disabled={busy} className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center justify-center gap-2 transition-all">
                                {busy ? "Sending..." : <><FaPaperPlane className="text-xs" /> Send Reset Link</>}
                            </button>
                        </form>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}