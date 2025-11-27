"use client"

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import BookingWizard from '../../components/BookingWizard';
import { FaSpinner, FaCar } from 'react-icons/fa';

// SEO Metadata (Note: in a 'use client' file, metadata works differently, 
// but for a simple client page, we usually keep it simple or move metadata to a layout.
// For now, we focus on the functional wrapper).

// We wrap the search params logic in a component to support Suspense
// This is required by Next.js when using useSearchParams in a page to avoid de-opting static generation
function BookingFormWrapper() {
    const searchParams = useSearchParams();
    const carId = searchParams.get('carId');

    return (
        <BookingWizard initialCarId={carId} />
    );
}

export default function BookingPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-8 text-center animate-fade-in">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4 shadow-sm">
                        <FaCar size={28} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Complete Your Reservation</h1>
                    <p className="mt-2 text-gray-600 max-w-lg mx-auto">
                        You're just a few steps away from the road. Review your selection and secure your vehicle below.
                    </p>
                </div>
                
                {/* Wizard Container with Loading State */}
                <Suspense fallback={
                    <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
                        <p className="text-gray-500 font-medium">Loading booking options...</p>
                    </div>
                }>
                    <BookingFormWrapper />
                </Suspense>
            </div>
        </main>
    );
}