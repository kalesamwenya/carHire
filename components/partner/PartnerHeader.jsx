'use client';

import { FaBars, FaHandshake, FaExclamationTriangle, FaClock, FaTimesCircle } from 'react-icons/fa';
import Link from 'next/link';

export default function PartnerHeader({ setIsOpen, kycStatus }) {
    
    // Logic to define what banner to show
    const getKycBanner = () => {
        switch (kycStatus) {
            case 'pending':
                return (
                    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2 flex items-center justify-center gap-2 text-amber-700 text-xs font-medium">
                        <FaClock className="animate-pulse" />
                        Verification in progress. You can browse, but listing cars is disabled until approved.
                    </div>
                );
            case 'rejected':
                return (
                    <div className="bg-red-50 border-b border-red-100 px-4 py-2 flex items-center justify-center gap-2 text-red-700 text-xs font-medium">
                        <FaTimesCircle />
                        Documents rejected. <Link href="/partner/settings" className="underline font-bold">Please re-upload clear NRC images.</Link>
                    </div>
                );
            case null:
            case '':
                return (
                    <div className="bg-blue-50 border-b border-blue-100 px-4 py-2 flex items-center justify-center gap-2 text-blue-700 text-xs font-medium">
                        <FaExclamationTriangle />
                        Action Required: <Link href="/partner/settings" className="underline font-bold">Upload your NRC to start earning.</Link>
                    </div>
                );
            default:
                return null; // Don't show anything if 'verified'
        }
    };

    return (
        <header className="flex flex-col shrink-0">
            {/* Dynamic KYC Banner */}
            {getKycBanner()}

            {/* Main Header Row */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
                <span className="font-bold text-gray-900 flex items-center gap-2">
                    <FaHandshake className="text-green-600" /> 
                    <span className="hidden sm:inline">Partner Dashboard</span>
                </span>
                
                <button
                    onClick={() => setIsOpen(true)}
                    className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                    <FaBars size={24} />
                </button>
            </div>
        </header>
    );
}