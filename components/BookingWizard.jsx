'use client';

import axios from "axios";
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { 
    FaSpinner, FaCar, FaCalendarAlt, FaUser, FaPhone, 
    FaIdCard, FaCheckCircle, FaChevronLeft, FaChevronRight, FaCheck, FaInfoCircle, FaMoneyBillWave, FaTag 
} from 'react-icons/fa';
import { useSession } from "next-auth/react";

// --- CONSTANTS ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
const DEFAULT_MIN_DAYS = 2;
const PROMO_STORAGE_KEY = 'citydrive_active_promo';

// --- PROMO UTILITIES ---
/**
 * Checks localStorage for a promo code and ensures it hasn't expired.
 */
const getValidStoredPromo = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(PROMO_STORAGE_KEY);
    if (!stored) return null;

    try {
        const { code, expiresAt } = JSON.parse(stored);
        // Check if current time is less than expiry timestamp
        if (new Date().getTime() < expiresAt) {
            return code;
        } else {
            localStorage.removeItem(PROMO_STORAGE_KEY); // Self-clean
            return null;
        }
    } catch (e) {
        return null;
    }
};

/**
 * Persists a code with a 24-hour expiry timestamp
 */
const savePromoToLocal = (code) => {
    const expiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 Hours
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify({ code, expiresAt: expiry }));
};

// --- UTILITY: Generate IDs ---
const generateBookingIds = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return {
        bookingId: `BK-${timestamp}`,
        refCode: `REF-${randomStr}`
    };
};

function ProgressIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Vehicle' },
        { id: 2, label: 'Specs' },
        { id: 3, label: 'Details' },
        { id: 4, label: 'Confirm' },
        { id: 5, label: 'Done' }
    ];

    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between relative max-w-2xl mx-auto px-4">
                <div className="absolute left-0 top-3.5 sm:top-5 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
                <div 
                    className="absolute left-0 top-3.5 sm:top-5 h-1 bg-green-600 -z-10 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((step) => {
                    const isCompleted = step.id < currentStep;
                    const isActive = step.id === currentStep;

                    return (
                        <div key={step.id} className="flex flex-col items-center group">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 sm:border-4 transition-all duration-300 z-10 ${
                                    isCompleted ? 'bg-green-600 border-green-600 text-white' 
                                    : isActive ? 'bg-white border-green-600 text-green-700 shadow-md scale-110' 
                                    : 'bg-white border-gray-200 text-gray-400'
                                }`}>
                                {isCompleted ? <FaCheck className="w-3 h-3" /> : <span className="text-xs font-bold">{step.id}</span>}
                            </div>
                            <span className={`mt-2 text-[10px] sm:text-xs font-semibold uppercase tracking-wide transition-colors ${isActive ? 'text-green-700' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default function BookingWizard() {
    return (
        <Suspense fallback={<div className="flex justify-center p-20"><FaSpinner className="animate-spin text-green-600 text-4xl" /></div>}>
            <BookingWizardContent />
        </Suspense>
    );
}

function BookingWizardContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCarId = searchParams.get('carId');

    const [visitorId, setVisitorId] = useState(null);
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [bookingResult, setBookingResult] = useState(null);
    const [showReserveModal, setShowReserveModal] = useState(false);
    const [generatedIds, setGeneratedIds] = useState({ bookingId: '', refCode: '' });
    
    // Promo State
    const [promoCode, setPromoCode] = useState("");

    const [form, setForm] = useState({
        name: '', phone: '', license: '', from: '', to: '', email: '' 
    });

  

    useEffect(() => {
        if (session?.user) {
            setForm(prev => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || ''
            }));
        }
    }, [session]);

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const res = await axios.get(`${API_BASE}/cars/get-cars.php`);
                const carsList = res.data.cars || res.data.data || res.data;
                setCars(carsList);
                
                if (initialCarId && Array.isArray(carsList)) {
                    const found = carsList.find(c => String(c.id) === String(initialCarId));
                    if (found) {
                        setSelectedCar(found);
                        setStep(2);
                    }
                }
            } catch (err) {
                toast.error("Vehicle fleet could not be reached.");
            } finally {
                setLoading(false);
            }
        };
        fetchCars();
    }, [initialCarId]);

   const pricing = useMemo(() => {
    // Default empty state
    const defaultState = { 
        days: 0, subtotal: 0, discount: 0, total: 0, 
        isValid: false, meetsMinimum: false, minDays: DEFAULT_MIN_DAYS,
        promoError: null 
    };

    if (!selectedCar || !form.from || !form.to) return defaultState;

    // 1. Calculate Duration
    const start = new Date(form.from);
    const end = new Date(form.to);
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const days = diffDays > 0 ? diffDays : 0;

    // 2. Calculate Subtotal
    const dailyRate = Number(selectedCar.price) || 0;
    const subtotal = days * dailyRate;
    const minDaysRequired = Number(selectedCar.min_booking_days) || DEFAULT_MIN_DAYS;

    // 3. Dynamic Promo Logic
    let discount = 0;
    let promoError = null;

    if (promoCode.trim()) {
        const stored = localStorage.getItem('citydrive_active_promo');
        
        if (stored) {
            try {
                const promo = JSON.parse(stored);
                const isCorrectCode = promoCode.trim().toUpperCase() === promo.code.toUpperCase();
                const isNotExpired = new Date().getTime() < promo.expiresAt;
                const meetsSpend = subtotal >= promo.minSpend;

                if (isCorrectCode && isNotExpired) {
                    if (meetsSpend) {
                        // Apply the percentage stored in the promo object
                        discount = subtotal * (promo.discount / 100);
                    } else {
                        promoError = `Min spend K${promo.minSpend} required for this code.`;
                    }
                }
            } catch (e) {
                console.error("Promo parsing error", e);
            }
        } else if (promoCode.trim().toUpperCase() === "CITY2026") {
            // Fallback for hardcoded default if no localStorage exists
            discount = subtotal * 0.10;
        }
    }

    return {
        days,
        subtotal,
        discount,
        total: subtotal - discount,
        isValid: diffDays > 0,
        meetsMinimum: days >= minDaysRequired,
        minDays: minDaysRequired,
        promoError // You can use this to show a small warning text in the UI
    };
}, [selectedCar, form.from, form.to, promoCode]);

// Add this inside your BookingWizardContent component
useEffect(() => {
    const stored = localStorage.getItem('citydrive_active_promo');
    if (stored) {
        try {
            const promo = JSON.parse(stored);
            const now = new Date().getTime();

            // 1. Check if the promo is still valid (time-wise)
            if (now < promo.expiresAt) {
                
                // 2. Check if the current subtotal meets the minimum spend
                // We use pricing.subtotal which is already calculated in your useMemo
                if (pricing.subtotal >= promo.minSpend) {
                    setPromoCode(promo.code);
                    // No need to manually set discount here, 
                    // your 'pricing' useMemo will pick up the promoCode change
                }
            } else {
                // Remove it if it has expired
                localStorage.removeItem('citydrive_active_promo');
            }
        } catch (e) {
            console.error("Error parsing stored promo", e);
        }
    }
}, [pricing.subtotal]); // This triggers whenever the price changes (dates or car choice)

    // Handle Promo Input and Persistence
    const handlePromoChange = (val) => {
        const code = val.toUpperCase();
        setPromoCode(code);
        
        // If it matches valid code, save to local storage immediately
        if (code === "CITY2026") {
            savePromoToLocal(code);
            toast.success("Promo code applied!");
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!selectedCar) return toast.error('Please select a car');
            if (String(selectedCar.available) === "0") {
                setShowReserveModal(true);
                return;
            }
            setStep(2);
        } else if (step === 2) {
            setStep(3);
        } else if (step === 3) {
            const { name, phone, license, from, to, email } = form;
            if (!name || !phone || !license || !from || !to || !email) return toast.error('Please fill in all fields');
            if (!pricing.isValid) return toast.error('Check your dates.');
            if (!pricing.meetsMinimum) return toast.error(`Minimum hire is ${pricing.minDays} days.`);
            
            setGeneratedIds(generateBookingIds());
            setStep(4);
        }
    };

    const submitBooking = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        const loadingToast = toast.loading("Finalizing your reservation...");

        try {
            const customerEmail = form.email || session?.user?.email;
            if (!customerEmail) throw new Error("Email address is required for your receipt.");

            const formData = new FormData();
            formData.append("car_id", selectedCar.id);
            formData.append("user_id", session?.user?.id || "guest"); 
            formData.append("name", form.name);
            formData.append("email", customerEmail);
            formData.append("phone", form.phone);
            formData.append("license", form.license);
            formData.append("from", form.from);
            formData.append("to", form.to);
            formData.append("total_price", pricing.total);
            formData.append("promo_code", promoCode); 
            formData.append("discount_amount", pricing.discount);
            formData.append("booking_id", generatedIds.bookingId);
            formData.append("reference_code", generatedIds.refCode);
            formData.append("visitor_id", visitorId);
            formData.append("payment_status", "pending_cash"); 

            const res = await axios.post(`${API_BASE}/bookings/save-booking.php`, formData);
            if (!res.data?.success) throw new Error(res.data?.message || "Booking failed");

            setBookingResult({
                booking_id: generatedIds.bookingId,
                total_due: pricing.total
            });
            
            setStep(5);
            toast.success("Reserved! Please visit our office for payment.", { id: loadingToast });
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.message || "Server error";
            toast.error(errorMsg, { id: loadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    const resolveImg = (car) => {
        const path = car?.image_url || car?.image || "";
        if (path.startsWith('http')) return path;
        return `${API_BASE}/${path.replace(/^\/+/, "")}`;
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden max-w-4xl mx-auto my-8">
            <Toaster position="top-center" />
            
            {showReserveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCalendarAlt className="text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-3">Vehicle Booked</h3>
                            <p className="text-black mb-8">
                                <span className="font-bold">{selectedCar?.name}</span> is currently unavailable. 
                            </p>
                            <div className="flex flex-col gap-3">
                                <button onClick={() => setShowReserveModal(false)} className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold">Inquire for Next Slot</button>
                                <button onClick={() => {setShowReserveModal(false); setSelectedCar(null); setStep(1);}} className="w-full py-4 bg-gray-50 text-black rounded-2xl font-semibold">Choose Different Car</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-gray-50 px-6 pt-8 pb-4 border-b border-gray-100">
                <ProgressIndicator currentStep={step} />
            </div>

            <div className="p-6 lg:p-10 min-h-[500px]">
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <FaCar className="text-green-600" /> Choose Your Ride
                        </h2>
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-20 text-black">
                                <FaSpinner className="animate-spin text-4xl mb-3 text-green-600" />
                                <p>Syncing fleet data...</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {cars.map(c => (
                                    <div 
                                        key={c.id} 
                                        onClick={() => setSelectedCar(c)}
                                        className={`group relative p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                                            selectedCar?.id === c.id ? 'border-green-600 bg-green-50 ring-1 ring-green-600' : 'border-gray-100 hover:border-green-300'
                                        }`}
                                    >
                                        <div className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 ${String(c.available) !== "0" ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {String(c.available) !== "0" ? 'Available' : 'Booked'}
                                        </div>
                                        <div className="h-28 bg-gray-100 rounded-lg mb-4 overflow-hidden relative">
                                            <img src={resolveImg(c)} alt={c.name} className="w-full h-full object-cover" onError={(e) => e.target.src = '/placeholder-car.png'} />
                                        </div>
                                        <h3 className="font-bold text-black text-sm">{c.name}</h3>
                                        <div className="flex justify-between items-end mt-1">
                                            <span className="text-[10px] text-black uppercase font-semibold">{c.type}</span>
                                            <span className="text-green-700 font-bold text-sm">ZMW {Number(c.price).toLocaleString()}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {step === 2 && selectedCar && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <FaInfoCircle className="text-blue-600" /> Vehicle Specifications
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 md:flex">
                            <div className="md:w-1/2 h-64 md:h-auto relative bg-gray-100">
                                <img src={resolveImg(selectedCar)} alt={selectedCar.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="md:w-1/2 p-6">
                                <h2 className="text-2xl font-bold text-black">{selectedCar.name}</h2>
                                <p className="text-blue-600 font-bold text-xl mb-4">ZMW {Number(selectedCar.price).toLocaleString()}/day</p>
                                <div className="grid grid-cols-2 gap-4 mb-6 text-black text-sm">
                                    <div>⚙️ {selectedCar.transmission || 'Manual'}</div>
                                    <div>⛽ {selectedCar.fuel || 'Petrol'}</div>
                                    <div>👥 {selectedCar.seats || 5} Seats</div>
                                    <div>🗓️ Min. {selectedCar.min_booking_days || DEFAULT_MIN_DAYS} Days</div>
                                </div>
                                <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg">Confirm & Continue</button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <FaIdCard className="text-green-600" /> Rental Details
                        </h2>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="Full Name" />
                                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="Phone Number" />
                                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full md:col-span-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="Email Address (For Receipt)" />
                                <input value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="w-full md:col-span-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="License / ID Number" />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-black uppercase">Pickup Date</label>
                                    <input type="date" min={todayStr} value={form.from} onChange={e => setForm({...form, from: e.target.value})} className="p-3 border border-gray-200 rounded-lg text-black font-medium" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-[10px] font-bold text-black uppercase">Drop-off Date</label>
                                    <input type="date" min={form.from || todayStr} value={form.to} onChange={e => setForm({...form, to: e.target.value})} className="p-3 border border-gray-200 rounded-lg text-black font-medium" />
                                </div>
                            </div>

                            {/* UPDATED PROMO CODE SECTION WITH PERSISTENCE */}
                            <div className="mt-4 p-4 bg-green-50 border border-green-100 rounded-2xl transition-all">
                                <label className="flex items-center gap-2 text-[10px] font-black text-green-700 uppercase mb-2">
                                    <FaTag /> Promo Code
                                </label>
                                <div className="flex gap-2">
                                    <input 
                                        value={promoCode} 
                                        onChange={e => handlePromoChange(e.target.value)} 
                                        className={`flex-1 p-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-bold uppercase transition-colors ${
                                            pricing.discount > 0 ? 'border-green-500 bg-white' : 'border-green-200'
                                        }`} 
                                        placeholder="Enter code" 
                                    />
                                    {pricing.discount > 0 && (
                                        <div className="flex items-center px-3 bg-green-600 text-white text-[10px] font-bold rounded-lg animate-pulse">
                                            SAVED 10%
                                        </div>
                                    )}
                                </div>
                                {pricing.discount > 0 && (
                                    <p className="mt-2 text-[9px] text-green-600 font-bold italic">
                                        * Valid code recovered from your session.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-black">Confirm Booking</h2>
                            <p className="text-black font-medium">Ref: {generatedIds.bookingId}</p>
                            {pricing.discount > 0 && (
                                <div className="inline-block mt-2 px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">
                                    Promotion Applied: 10% Discount
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <div className="md:col-span-2">
                                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-black uppercase mb-4">Price Breakdown</p>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-xs text-gray-500">
                                            <span>Subtotal ({pricing.days} Days)</span>
                                            <span className="font-bold">K{pricing.subtotal.toLocaleString()}</span>
                                        </div>
                                        
                                        {pricing.discount > 0 && (
                                            <div className="flex justify-between text-xs text-green-600 font-bold italic">
                                                <span>Promo Discount</span>
                                                <span>-K{pricing.discount.toLocaleString()}</span>
                                            </div>
                                        )}

                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex justify-between items-center">
                                                <span className="font-black text-black text-sm uppercase">Total Due</span>
                                                <span className="font-black text-green-600 text-xl">K{pricing.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8">
                                <div className="flex flex-col items-center text-center gap-4 mb-8">
                                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                                        <FaMoneyBillWave size={30} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-black">Pay at Office</h4>
                                        <p className="text-xs text-gray-500">Book now and settle the payment in cash or via card at our physical branch upon vehicle collection.</p>
                                    </div>
                                </div>

                                <button onClick={submitBooking} disabled={isSubmitting} className="w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 transition-all bg-green-600 hover:bg-green-700">
                                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Confirm Reservation</>}
                                </button>
                                <p className="text-center text-[9px] text-black mt-6 font-bold uppercase">System Verified Security</p>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="text-center py-10 animate-in zoom-in max-w-md mx-auto">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-5xl" />
                        </div>
                        <h2 className="text-3xl font-black text-black mb-2">Reservation Secured</h2>
                        <p className="text-black mb-8 font-medium">Please bring ZMW {bookingResult?.total_due?.toLocaleString()} to our office to finalize the process.</p>

                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 mb-8 text-left">
                            <div className="flex justify-between">
                                <span className="text-[10px] font-black uppercase text-black">Booking ID</span>
                                <span className="text-xs font-bold font-mono text-black">{bookingResult?.booking_id}</span>
                            </div>
                        </div>
                        <button onClick={() => router.push('/')} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Return Home</button>
                    </div>
                )}

                {step < 5 && (
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button onClick={() => setStep(step - 1)} disabled={step === 1 || isSubmitting} className="flex items-center gap-2 px-5 py-2 font-bold text-sm text-black disabled:opacity-20">
                            <FaChevronLeft size={10} /> Back
                        </button>
                        {step < 4 && (
                            <button onClick={handleNext} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg">
                                Next Step <FaChevronRight size={10} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}