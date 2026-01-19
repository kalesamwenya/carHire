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

        const verifyAccount = async () => {
            try {
                // Calling your PHP backend
                const response = await axios.get(`https://api.citydrivehire.com/users/verify.php`, {
                    params: { token, email }
                });

                setStatus("success");
                setMessage(response.data.message || "Account verified successfully!");
                toast.success("Verification complete!");

                // Auto-redirect to signin after 3 seconds
                setTimeout(() => {
                    router.push(`/auth/signin?verified=true&email=${encodeURIComponent(email)}`);
                }, 3000);

            } catch (err) {
                setStatus("error");
                setMessage(err.response?.data?.message || "Link expired or invalid.");
            }
        };

        verifyAccount();
    }, [searchParams, router]);

    const BrandingContent = () => (
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
                Almost <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-800">
                    There.
                </span>
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed">
                Confirming your details so you can get behind the wheel.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex overflow-hidden relative">
            <Toaster position="top-center" />
            
            {/* Left Side Branding (Hidden on mobile for this specific page) */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-center items-center px-12 border-r border-gray-100 relative">
                <BrandingContent />
            </div>

            {/* Right Side Interaction */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 lg:p-12 relative">
                <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-green-700 transition-colors group">
                    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
                        <FaArrowLeft className="text-xs" />
                    </div>
                    <span>Return Home</span>
                </Link>

                <div className="w-full max-w-[400px]">
                    <AuthShell title="Account Verification" subtitle="Finalizing your registration">
                        <div className="mt-8 flex flex-col items-center text-center">
                            
                            {status === "loading" && (
                                <div className="space-y-4 animate-in fade-in duration-500">
                                    <FaSpinner className="text-5xl text-green-600 animate-spin mx-auto" />
                                    <p className="text-gray-600 font-medium">{message}</p>
                                </div>
                            )}

                            {status === "success" && (
                                <div className="space-y-4 animate-in zoom-in duration-500">
                                    <FaCheckCircle className="text-6xl text-green-600 mx-auto" />
                                    <h3 className="text-xl font-bold text-slate-900">Email Verified!</h3>
                                    <p className="text-gray-600">{message}</p>
                                    <p className="text-sm text-gray-400 italic pt-4">Redirecting you to sign in...</p>
                                    <Link href="/auth/signin" className="block w-full py-3 bg-green-600 text-white rounded-lg font-medium mt-6">
                                        Sign In Now
                                    </Link>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="space-y-4 animate-in shake duration-500">
                                    <FaExclamationTriangle className="text-6xl text-red-500 mx-auto" />
                                    <h3 className="text-xl font-bold text-slate-900">Verification Failed</h3>
                                    <p className="text-red-600 bg-red-50 p-3 rounded-lg text-sm">{message}</p>
                                    <Link href="/auth/signup" className="block w-full py-3 border border-gray-200 text-gray-700 rounded-lg font-medium mt-6 hover:bg-gray-50 transition-all">
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

// Wrapping in Suspense because of useSearchParams
export default function VerifyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><FaSpinner className="animate-spin text-green-600 text-3xl" /></div>}>
            <VerifyContent />
        </Suspense>
    );
}