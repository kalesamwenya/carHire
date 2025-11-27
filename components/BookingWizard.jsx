"use client"

import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast'; // Added Toaster for notifications
import { 
    FaSpinner, FaCar, FaCalendarAlt, FaUser, FaPhone, 
    FaIdCard, FaCheckCircle, FaChevronLeft, FaChevronRight, FaCheck 
} from 'react-icons/fa';

// --- SUB-COMPONENT: Progress Bar ---
function ProgressIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Vehicle' },
        { id: 2, label: 'Details' },
        { id: 3, label: 'Review' },
        { id: 4, label: 'Done' }
    ];

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
                {/* Background Track */}
                <div className="absolute left-0 top-3.5 sm:top-5 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                {/* Active Progress */}
                <div 
                    className="absolute left-0 top-3.5 sm:top-5 h-1 bg-green-600 -z-10 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div 
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 sm:border-4 transition-all duration-300 z-10 ${
                                    isCompleted 
                                        ? 'bg-green-600 border-green-600 text-white' 
                                        : isActive 
                                            ? 'bg-white border-green-600 text-green-700 shadow-md scale-110' 
                                            : 'bg-white border-gray-200 text-gray-400'
                                }`}
                            >
                                {isCompleted ? <FaCheck className="w-3 h-3" /> : <span className="text-xs font-bold">{step.id}</span>}
                            </div>
                            <span className={`mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-colors ${
                                isActive ? 'text-green-700' : 'text-gray-400'
                            }`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// --- MAIN WIZARD LOGIC ---
function BookingWizardContent() {
    const searchParams = useSearchParams();
    const initialCarId = searchParams.get('carId');

    // Data State
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Wizard State
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);

    // Form State
    const [form, setForm] = useState({
        name: '',
        phone: '',
        license: '',
        from: '',
        to: ''
    });

    // 1. Fetch Cars on Mount
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await fetch('/api/cars');
                if (!res.ok) throw new Error('Failed to fetch cars');
                const data = await res.json();
                setCars(data);
                
                // Auto-select if ID is present in URL
                if (initialCarId && data.length > 0) {
                    const found = data.find(c => String(c.id) === String(initialCarId));
                    if (found) setSelectedCar(found);
                }
            } catch (err) {
                console.error(err);
                toast.error("Could not load vehicles. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [initialCarId]);

    // 2. Calculations
    const pricing = useMemo(() => {
        if (!selectedCar || !form.from || !form.to) return { days: 0, total: 0 };
        
        const start = new Date(form.from);
        const end = new Date(form.to);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        
        // Ensure at least 1 day counts if dates are valid, else 0
        const days = diffDays >= 0 ? Math.max(1, diffDays) : 0; 
        
        return { 
            days, 
            total: days * selectedCar.price,
            isValid: diffDays >= 0
        };
    }, [selectedCar, form.from, form.to]);

    // 3. Navigation Handlers
    const handleNext = () => {
        if (step === 1) {
            if (!selectedCar) return toast.error('Please select a car');
            if (!selectedCar.available) return toast.error('This car is currently unavailable');
            setStep(2);
        } 
        else if (step === 2) {
            const { name, phone, license, from, to } = form;
            if (!name || !phone || !license || !from || !to) return toast.error('Please fill in all fields');
            if (!pricing.isValid) return toast.error('Drop-off date cannot be before pickup');
            setStep(3);
        }
    };

    const submitBooking = async () => {
        setIsSubmitting(true);
        try {
            const payload = { 
                car_id: selectedCar.id, 
                ...form, 
                total_price: pricing.total, 
                duration_days: pricing.days 
            };

            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Booking failed');

            setBookingResult(json);
            setStep(4);
            toast.success('Booking Successful!');
        } catch (error) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper to get today's date for min attribute
    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto my-8 animate-fade-in-up">
            
            {/* Header */}
            <div className="bg-gray-50 px-6 pt-8 pb-4 border-b border-gray-100">
                <ProgressIndicator currentStep={step} />
            </div>

            <div className="p-6 lg:p-10 min-h-[400px]">
                
                {/* STEP 1: Select Car */}
                {step === 1 && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaCar className="text-green-600" /> Choose Your Ride
                        </h2>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                                <FaSpinner className="animate-spin text-4xl mb-3 text-green-600" />
                                <p>Loading fleet...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cars.map(c => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => setSelectedCar(c)}
                                        className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            selectedCar?.id === c.id 
                                                ? 'border-green-600 bg-green-50 ring-1 ring-green-600 shadow-md' 
                                                : 'border-gray-100 hover:border-green-300 hover:shadow-sm'
                                        }`}
                                    >
                                        {/* Status Badge */}
                                        <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full ${
                                            c.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {c.available ? 'Available' : 'Booked'}
                                        </div>

                                        {/* Selection Checkmark */}
                                        {selectedCar?.id === c.id && (
                                            <div className="absolute -top-2 -right-2 bg-green-600 text-white rounded-full p-1 shadow-lg z-10">
                                                <FaCheck size={12} />
                                            </div>
                                        )}

                                        {/* Car Image Placeholder */}
                                        <div className="h-28 bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                                            {c.image ? (
                                                <img src={c.image} alt={c.name} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <FaCar size={32} />
                                                </div>
                                            )}
                                        </div>

                                        <h3 className="font-bold text-gray-900">{c.name}</h3>
                                        <div className="flex justify-between items-end mt-1">
                                            <span className="text-xs text-gray-500">{c.type}</span>
                                            <span className="text-green-700 font-bold">ZMW {c.price}<span className="text-xs font-normal text-gray-400">/day</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* STEP 2: Details Form */}
                {step === 2 && (
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FaIdCard className="text-green-600" /> Rental Details
                        </h2>

                        <div className="space-y-5">
                            {/* Personal Info Group */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Driver Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="relative">
                                        <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                                        <input 
                                            value={form.name}
                                            onChange={e => setForm({...form, name: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="Full Name"
                                        />
                                    </div>
                                    <div className="relative">
                                        <FaPhone className="absolute left-3 top-3.5 text-gray-400" />
                                        <input 
                                            value={form.phone}
                                            onChange={e => setForm({...form, phone: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="Phone Number"
                                        />
                                    </div>
                                    <div className="relative md:col-span-2">
                                        <FaIdCard className="absolute left-3 top-3.5 text-gray-400" />
                                        <input 
                                            value={form.license}
                                            onChange={e => setForm({...form, license: e.target.value})}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                                            placeholder="Driver's License Number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Trip Info Group */}
                            <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Trip Dates</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 ml-1">Pickup</label>
                                        <div className="relative">
                                            <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                                            <input 
                                                type="date"
                                                min={todayStr}
                                                value={form.from}
                                                onChange={e => setForm({...form, from: e.target.value})}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-semibold text-gray-500 ml-1">Return</label>
                                        <div className="relative">
                                            <FaCalendarAlt className="absolute left-3 top-3.5 text-gray-400" />
                                            <input 
                                                type="date"
                                                min={form.from || todayStr}
                                                value={form.to}
                                                onChange={e => setForm({...form, to: e.target.value})}
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 3: Review */}
                {step === 3 && (
                    <div className="max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Pay</h2>
                        
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Header Summary */}
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-500">Selected Vehicle</p>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedCar?.name}</h3>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Rate</p>
                                    <p className="font-medium text-green-700">ZMW {selectedCar?.price}<span className="text-xs text-gray-400">/day</span></p>
                                </div>
                            </div>

                            {/* Line Items */}
                            <div className="p-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Pickup Date</span>
                                    <span className="font-medium">{form.from}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Return Date</span>
                                    <span className="font-medium">{form.to}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Duration</span>
                                    <span className="font-medium">{pricing.days} Days</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Driver</span>
                                    <span className="font-medium">{form.name}</span>
                                </div>

                                <div className="border-t border-dashed border-gray-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-900">Total Due</span>
                                    <span className="font-extrabold text-2xl text-green-700">ZMW {pricing.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* STEP 4: Success */}
                {step === 4 && bookingResult && (
                    <div className="text-center py-10 animate-fade-in">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-6 animate-bounce-short">
                            <FaCheckCircle className="text-5xl" />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                        <div className="bg-gray-50 inline-block px-8 py-4 rounded-xl border border-gray-200 mb-8 text-left">
                            <p className="text-sm text-gray-500 mb-1">Booking Reference</p>
                            <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">{bookingResult.booking_id}</p>
                        </div>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Thank you, {form.name}. Your vehicle has been secured. We've sent a confirmation SMS to <span className="font-medium">{form.phone}</span>.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="/dashboard" className="px-8 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md transition-transform hover:-translate-y-0.5">
                                View Dashboard
                            </a>
                            <a href="/" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50 transition-colors">
                                Return Home
                            </a>
                        </div>
                    </div>
                )}

                {/* --- NAVIGATION FOOTER --- */}
                {step < 4 && (
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button 
                            onClick={() => setStep(step - 1)} 
                            disabled={step === 1 || isSubmitting}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium transition-colors ${
                                step === 1 
                                    ? 'text-gray-300 cursor-not-allowed' 
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                        >
                            <FaChevronLeft className="text-sm" /> Back
                        </button>

                        {step === 3 ? (
                            <button 
                                onClick={submitBooking}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg hover:bg-green-700 hover:shadow-green-200 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <><FaSpinner className="animate-spin" /> Processing...</> : 'Confirm & Pay'}
                            </button>
                        ) : (
                            <button 
                                onClick={handleNext}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold shadow-md hover:bg-green-700 hover:shadow-lg transition-all"
                            >
                                Next Step <FaChevronRight className="text-sm" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function BookingPage() {
    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                {/* Page Title */}
                <div className="mb-10 text-center animate-fade-in">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Complete Your Reservation
                    </h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-xl mx-auto">
                        Secure your vehicle in 3 simple steps. No credit card required for reservation.
                    </p>
                </div>
                
                {/* Suspense Boundary for Search Params */}
                <Suspense fallback={
                    <div className="h-96 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
                        <FaSpinner className="animate-spin text-green-600 text-4xl mb-4" />
                        <p className="text-gray-500">Initializing booking engine...</p>
                    </div>
                }>
                    <BookingWizardContent />
                </Suspense>
            </div>
        </main>
    );
}