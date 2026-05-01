"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { FaArrowLeft, FaCarSide, FaCheckCircle, FaExclamationTriangle, FaSpinner } from "react-icons/fa";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import AuthShell from '@/components/auth/AuthShell';

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [status, setStatus] = useState("loading"); // loading, success, error
    const [message, setMessage] = useState("Verifying your account...");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const token = searchParams.get('token');
        const email = searchParams.get('email');

        if (!token || !email) {
            setStatus("error");
            setMessage("Invalid verification link. Please check your email again.");
            return;
        }

        const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

        const verifyAccount = async () => {
            try {
                const response = await axios.get(`${BASE_API}/users/verify.php`, {
                    params: { token, email },
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                setStatus("success");
                setMessage(response.data.message || "Account verified successfully!");
                toast.success("Verification complete!");

                setTimeout(() => {
                    router.push(`/auth/signin?verified=true&email=${encodeURIComponent(email)}`);
                }, 3000);

            } catch (err) {
                setStatus("error");
                const errorMsg = err.response?.data?.message || "Link expired or invalid.";
                setMessage(errorMsg);
                toast.error(errorMsg);
            }
        };

        verifyAccount();
    }, [searchParams, router]);

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
                Almost <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    There.
                </span>
            </h1>

            <p className="text-gray-500 text-lg leading-relaxed italic">
                "Confirming your details so you can get behind the wheel."
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
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-700 transition-colors group z-20">
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </Link>

                <div className="w-full max-w-[440px]">
                    <AuthShell title="Account Verification" subtitle="Finalizing your registration">
                        <div className="mt-8 flex flex-col items-center text-center">
                            
                            {status === "loading" && (
                                <div className="space-y-6 animate-in fade-in duration-500">
                                    <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto">
                                        <FaSpinner className="text-3xl text-green-600 animate-spin" />
                                    </div>
                                    <p className="text-black font-bold uppercase tracking-widest text-xs">{message}</p>
                                </div>
                            )}

                            {status === "success" && (
                                <div className="space-y-6 animate-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                        <FaCheckCircle className="text-4xl text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Email Verified!</h3>
                                        <p className="text-gray-500 mt-2 text-sm">{message}</p>
                                    </div>
                                    <div className="pt-4">
                                        <p className="text-[10px] text-green-700 font-bold uppercase tracking-widest animate-pulse mb-6">Redirecting you to sign in...</p>
                                        <Link href="/auth/signin" className="block w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold shadow-xl active:scale-[0.98] transition-all">
                                            Sign In Now
                                        </Link>
                                    </div>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="space-y-6 animate-in shake duration-500">
                                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
                                        <FaExclamationTriangle className="text-4xl text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Verification Failed</h3>
                                        <div className="mt-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                                            <p className="text-red-600 text-sm font-medium">{message}</p>
                                        </div>
                                    </div>
                                    <Link href="/auth/signup" className="block w-full py-4 border-2 border-slate-100 text-slate-900 rounded-xl font-bold hover:bg-slate-50 transition-all shadow-sm">
                                        Try Registering Again
                                    </Link>
                                </div>
                            )}

                        </div>
                    </AuthShell>
                </div>
            </div>
        </div>
    );
}

export default function VerifyPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-white">
                <FaSpinner className="animate-spin text-green-600 text-3xl" />
            </div>
        }>
            <VerifyContent />
        </Suspense>
    );
}