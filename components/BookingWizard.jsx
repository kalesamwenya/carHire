'use client';

import axios from "axios";
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { 
    FaSpinner, FaCar, FaCalendarAlt, FaUser, FaPhone, 
    FaIdCard, FaCheckCircle, FaChevronLeft, FaChevronRight, FaCheck, FaInfoCircle, FaHashtag 
} from 'react-icons/fa';
import { generateBookingReceipt } from "@/utils/generateBookingReceipt";
import { useSession } from 'next-auth/react';

// --- CONSTANTS ---
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
const DEFAULT_MIN_DAYS = 2; // Fallback if DB column is empty

// --- UTILITY: Generate IDs ---
const generateBookingIds = () => {
    const timestamp = Date.now().toString().slice(-6);
    const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
    return {
        bookingId: `BK-${timestamp}`,
        refCode: `REF-${randomStr}`
    };
};

// --- SUB-COMPONENT: Progress Bar ---
function ProgressIndicator({ currentStep }) {
    const steps = [
        { id: 1, label: 'Vehicle' },
        { id: 2, label: 'Specs' },
        { id: 3, label: 'Details' },
        { id: 4, label: 'Review' },
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

    const [paymentMethod, setPaymentMethod] = useState('momo');
    const [paymentForm, setPaymentForm] = useState({ phone: '', cardNumber: '', expiry: '', cvc: '' });
    const [generatedIds, setGeneratedIds] = useState({ bookingId: '', refCode: '' });

    const [form, setForm] = useState({
        name: '',
        phone: '',
        license: '',
        from: '',
        to: ''
    });

    const todayStr = new Date().toISOString().split('T')[0];

    useEffect(() => {
        setVisitorId(localStorage.getItem('visitor_id'));
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

    // --- DYNAMIC PRICING LOGIC ---
    const pricing = useMemo(() => {
        if (!selectedCar || !form.from || !form.to) return { days: 0, total: 0, isValid: false, meetsMinimum: false, minDays: DEFAULT_MIN_DAYS };
        
        const start = new Date(form.from);
        const end = new Date(form.to);
        const diffTime = end - start;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
        const days = diffDays > 0 ? diffDays : 0; 
        const dailyRate = Number(selectedCar.price) || 0;
        
        // Use min_booking_days from DB row
        const minDaysRequired = Number(selectedCar.min_booking_days) || DEFAULT_MIN_DAYS;
        
        return { 
            days, 
            total: days * dailyRate,
            isValid: diffDays > 0,
            meetsMinimum: days >= minDaysRequired,
            minDays: minDaysRequired
        };
    }, [selectedCar, form.from, form.to]);

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
            const { name, phone, license, from, to } = form;
            if (!name || !phone || !license || !from || !to) return toast.error('Please fill in all fields');
            if (!pricing.isValid) return toast.error('Check your dates. End date must be after start date.');
            
            // VALIDATE DYNAMIC MINIMUM
            if (!pricing.meetsMinimum) return toast.error(`For the ${selectedCar.name}, the minimum hire duration is ${pricing.minDays} days.`);
            
            setGeneratedIds(generateBookingIds());
            setStep(4);
        }
    };

    const submitBooking = async () => {
        if (isSubmitting) return;
        if (!session) return toast.error("Please sign in to complete your booking");

        setIsSubmitting(true);
        const loadingToast = toast.loading("Processing payment and reservation...");

        try {
            const formData = new FormData();
            formData.append("car_id", selectedCar.id);
            formData.append("user_id", session.user.id);
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("license", form.license);
            formData.append("from", form.from);
            formData.append("to", form.to);
            formData.append("total_price", pricing.total);
            formData.append("booking_id", generatedIds.bookingId);
            formData.append("reference_code", generatedIds.refCode);
            formData.append("visitor_id", visitorId);

            const res = await axios.post(`${API_BASE}/bookings/save-booking.php`, formData);

            if (!res.data?.success) throw new Error(res.data?.message || "Booking failed");

            await generateBookingReceipt({
                tx_ref: generatedIds.refCode,
                amount: pricing.total,
                customer: { ...form, email: session.user.email },
                car: selectedCar,
                dates: { from: form.from, to: form.to },
                booking_id: generatedIds.bookingId
            });

            setBookingResult({
                booking_id: generatedIds.bookingId,
                total_paid: pricing.total
            });
            
            setStep(5);
            toast.success("Confirmed! Your receipt is ready.", { id: loadingToast });
        } catch (err) {
            toast.error(err.message || "Server error", { id: loadingToast });
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
            
            {/* Modal for Booked Vehicles */}
            {showReserveModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FaCalendarAlt className="text-3xl" />
                            </div>
                            <h3 className="text-2xl font-bold text-black mb-3">Vehicle Booked</h3>
                            <p className="text-black mb-8">
                                <span className="font-bold">{selectedCar?.name}</span> is currently unavailable. 
                                Would you like to check the next available date or select another vehicle?
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
                {/* Step 1: Vehicle Selection */}
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

                {/* Step 2: Specs */}
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
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="text-black text-sm">⚙️ {selectedCar.transmission || 'Manual'}</div>
                                    <div className="text-black text-sm">⛽ {selectedCar.fuel || 'Petrol'}</div>
                                    <div className="text-black text-sm">👥 {selectedCar.seats || 5} Seats</div>
                                    <div className="text-black text-sm">🗓️ Min. {selectedCar.min_booking_days || DEFAULT_MIN_DAYS} Days</div>
                                </div>
                                <button onClick={handleNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition shadow-lg">Confirm & Continue</button>
                                <button onClick={() => setStep(1)} className="w-full mt-4 text-black text-sm hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                                    <FaChevronLeft size={10} /> Pick another car
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Details */}
                {step === 3 && (
                    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
                        <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-2">
                            <FaIdCard className="text-green-600" /> Rental Details
                        </h2>
                        <div className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="Full Name" />
                                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="Phone Number" />
                                <input value={form.license} onChange={e => setForm({...form, license: e.target.value})} className="w-full md:col-span-2 p-3 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-black font-medium" placeholder="License / ID Number" />
                            </div>
                            
                            {/* DYNAMIC MINIMUM NOTE */}
                            <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 mb-2">
                                <FaInfoCircle className="text-blue-600" />
                                <p className="text-xs text-black font-bold uppercase">Note: Minimum hire duration for this vehicle is {pricing.minDays} days</p>
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
                        </div>
                    </div>
                )}

                {/* Step 4: Finalize */}
                {step === 4 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-3xl mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-black text-black">Checkout</h2>
                            <p className="text-black font-medium tracking-tight">Booking Ref: {generatedIds.bookingId}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
                            <div className="md:col-span-2 space-y-4">
                                <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100">
                                    <p className="text-[10px] font-black text-black uppercase tracking-widest mb-4">Trip Summary</p>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200">
                                            <span className="text-xs font-bold text-black">{pricing.days} Days</span>
                                            <div className="flex gap-2">
                                                <button onClick={() => {
                                                    const d = new Date(form.to); d.setDate(d.getDate() - 1);
                                                    if (d >= new Date(form.from)) setForm({...form, to: d.toISOString().split('T')[0]});
                                                }} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md text-black">-</button>
                                                <button onClick={() => {
                                                    const d = new Date(form.to); d.setDate(d.getDate() + 1);
                                                    setForm({...form, to: d.toISOString().split('T')[0]});
                                                }} className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md text-black">+</button>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200">
                                            <div className="flex justify-between text-xs mb-2">
                                                <span className="text-black">Rate</span>
                                                <span className="font-bold text-black">K{Number(selectedCar?.price).toLocaleString()}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="font-black text-black">Total Due</span>
                                                <span className="font-black text-green-600 text-lg">K{pricing.total.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="md:col-span-3 bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl p-8">
                                <div className="flex gap-3 mb-8">
                                    <button onClick={() => setPaymentMethod('momo')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${paymentMethod === 'momo' ? 'border-green-600 bg-green-50' : 'border-gray-50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === 'momo' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}><FaPhone size={12} /></div>
                                        <span className="text-[10px] font-black uppercase text-black">Airtel/MTN</span>
                                    </button>
                                    <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50' : 'border-gray-50'}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}><FaIdCard size={12} /></div>
                                        <span className="text-[10px] font-black uppercase text-black">Visa/Master</span>
                                    </button>
                                </div>

                                {paymentMethod === 'momo' ? (
                                    <div className="animate-in slide-in-from-top-2">
                                        <label className="text-[10px] font-black text-black uppercase">Payment Phone</label>
                                        <div className="relative mt-1">
                                            <FaHashtag className="absolute left-4 top-1/2 -translate-y-1/2 text-black" />
                                            <input type="text" placeholder="097..." className="w-full pl-10 pr-4 py-4 bg-gray-50 rounded-2xl text-sm font-bold text-black outline-none ring-green-500 focus:ring-1" value={paymentForm.phone || form.phone} onChange={(e) => setPaymentForm({...paymentForm, phone: e.target.value})} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in slide-in-from-top-2">
                                        <input type="text" placeholder="Card Number" className="w-full p-4 bg-gray-50 rounded-2xl text-sm font-bold text-black outline-none" />
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="MM/YY" className="w-1/2 p-4 bg-gray-50 rounded-2xl text-sm font-bold text-black outline-none" />
                                            <input type="text" placeholder="CVC" className="w-1/2 p-4 bg-gray-50 rounded-2xl text-sm font-bold text-black outline-none" />
                                        </div>
                                    </div>
                                )}

                                <button onClick={submitBooking} disabled={isSubmitting} className={`w-full mt-10 py-5 rounded-2xl font-black text-xs uppercase tracking-widest text-white shadow-xl flex items-center justify-center gap-3 transition-all ${paymentMethod === 'momo' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isSubmitting ? <FaSpinner className="animate-spin" /> : <><FaCheckCircle /> Authorize K{pricing.total.toLocaleString()}</>}
                                </button>
                                <p className="text-center text-[9px] text-black mt-6 font-bold uppercase tracking-tighter">Verified by Emit Security Systems</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Success */}
                {step === 5 && (
                    <div className="text-center py-10 animate-in zoom-in max-w-md mx-auto">
                        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaCheckCircle className="text-5xl" />
                        </div>
                        <h2 className="text-3xl font-black text-black mb-2">Reservation Secured</h2>
                        <p className="text-black mb-8 font-medium">Payment of ZMW {bookingResult?.total_paid?.toLocaleString()} was authorized. Check your email for details.</p>

                        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-6 mb-8 text-left">
                            <div className="flex justify-between mb-4">
                                <span className="text-[10px] font-black uppercase text-black">Reference</span>
                                <span className="text-xs font-bold font-mono text-black">{bookingResult?.booking_id}</span>
                            </div>
                            <button onClick={() => window.print()} className="w-full py-3 bg-white border border-gray-200 text-black rounded-xl font-bold text-xs uppercase flex items-center justify-center gap-2">
                                <FaIdCard className="text-black" /> Print Receipt PDF
                            </button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button onClick={() => router.push('/dashboard')} className="w-full py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase shadow-lg">Manage My Trips</button>
                            <button onClick={() => router.push('/')} className="text-black text-xs font-bold uppercase">Return to Homepage</button>
                        </div>
                    </div>
                )}

                {/* Global Nav Buttons */}
                {step < 5 && (
                    <div className="mt-10 pt-6 border-t border-gray-100 flex justify-between items-center">
                        <button 
                            onClick={() => setStep(step - 1)} 
                            disabled={step === 1 || isSubmitting}
                            className="flex items-center gap-2 px-5 py-2 font-bold text-sm text-black disabled:opacity-20"
                        >
                            <FaChevronLeft size={10} /> Back
                        </button>
                        {step < 4 && (
                            <button 
                                onClick={handleNext}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-lg font-bold shadow-lg disabled:opacity-50"
                            >
                                Next Step <FaChevronRight size={10} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}