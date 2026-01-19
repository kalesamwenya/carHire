'use client';

import { Suspense } from 'react';
import { Toaster } from 'react-hot-toast';
import { FaCar, FaSpinner } from 'react-icons/fa';
import BookingWizardContent from '../../../components/BookingWizard'; // Adjust path
import CityDriveLoader from '@/components/CityDriveLoader';

export default function BookingPage() {
    return (
        <main className="min-h-screen mt-[4rem] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                <div className="mb-8 text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                        <FaCar size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Reservation</h1>
                    <p className="mt-2 text-gray-600 max-w-lg mx-auto">
                        CityDriveHire: Secure your vehicle in just a few clicks.
                    </p>
                </div>
                
                <Suspense fallback={
                    <CityDriveLoader/>
                }>
                    <BookingWizardContent />
                </Suspense>
            </div>
        </main>
    );
}