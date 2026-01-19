'use client';

import axios from "axios";
import { Suspense, useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import { 
    FaCalendarCheck, FaClock, FaArrowLeft, FaShieldAlt, 
    FaUser, FaPhone, FaCheckCircle, FaSpinner, 
    FaCalendarAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import CityDriveLoader from '@/components/CityDriveLoader';

function ReserveContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const router = useRouter();
    
    const carId = searchParams.get('carId') || searchParams.get('id');
    const availableAfter = searchParams.get('after') || new Date().toISOString().split('T')[0]; 
    
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        endDate: ''
    });

    useEffect(() => {
        if (session?.user) {
            setForm(prev => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || '',
                phone: session.user.phone || '',
            }));
        }
    }, [session]);

    const pricing = useMemo(() => {
        if (!availableAfter || !form.endDate || !car?.price) return { days: 0, total: 0 };
        const start = new Date(availableAfter);
        const end = new Date(form.endDate);
        const diffDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
        return { 
            days: diffDays, 
            total: diffDays * parseFloat(car.price) 
        };
    }, [availableAfter, form.endDate, car]);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`https://api.citydrivehire.com/cars/get-cars.php`);
                const allCars = await res.json();
                const list = allCars.cars || allCars.data || allCars;
                const selectedCar = list.find(c => String(c.id) === String(carId));
                setCar(selectedCar);
            } catch (err) {
                toast.error("Error loading car details");
            } finally {
                setLoading(false);
            }
        };
        if (carId) fetchCar();
    }, [carId]);

    const handleReservation = async (e) => {
        e.preventDefault();
        if (!session?.user?.id) return toast.error("Login required to reserve");
        
        setIsSubmitting(true);
        const tempBookingId = `RES-${Date.now().toString().slice(-6)}`;

        try {
            const formData = new FormData();
            formData.append("car_id", carId);
            formData.append("user_id", session.user.id);
            formData.append("name", form.name);
            formData.append("phone", form.phone);
            formData.append("license", "N/A (Reserved)"); // Filler since PHP requires it
            formData.append("from", availableAfter); 
            formData.append("to", form.endDate);
            formData.append("total_price", pricing.total);
            formData.append("booking_id", tempBookingId);
            formData.append("reference_code", `REF-${tempBookingId}`);
            formData.append("payment_method", "Reservation");

            const res = await axios.post("https://api.citydrivehire.com/bookings/save-booking.php", formData);
            
            if (res.data.success) {
                setStep(2);
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Reservation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <CityDriveLoader message="Connecting to Fleet..." />;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <Toaster position="top-center" />
            <div className="max-w-5xl mx-auto">
                <Link href="/search" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-900 mb-10 font-black text-[10px] uppercase tracking-[0.2em]">
                    <FaArrowLeft /> Cancel & Return
                </Link>

                <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
                    {/* Left: Receipt Context */}
                    <div className="bg-gray-900 md:w-2/5 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 bg-amber-500 text-black text-[9px] font-black px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                                <FaClock /> Waitlist Active
                            </div>
                            <h1 className="text-4xl font-black mb-2 tracking-tighter">{car?.name}</h1>
                            <div className="flex items-center gap-2 text-gray-400 text-xs mb-10">
                                <FaCalendarAlt className="text-green-500" />
                                <span>Ready for pickup: <b>{availableAfter}</b></span>
                            </div>

                            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10">
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Daily Rate</span>
                                    <span className="text-xl font-black text-green-400">K{car?.price}</span>
                                </div>
                                <div className="space-y-3 pt-6 border-t border-white/10">
                                    <div className="flex justify-between text-xs font-bold">
                                        <span className="text-gray-400">Waitlist Duration:</span>
                                        <span>{pricing.days} Days</span>
                                    </div>
                                    <div className="flex justify-between text-2xl font-black pt-2">
                                        <span>Est. Total</span>
                                        <span className="text-green-400 underline decoration-green-400/30 underline-offset-8">K{pricing.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div className="p-12 md:w-3/5">
                        {step === 1 ? (
                            <form onSubmit={handleReservation} className="animate-in fade-in slide-in-from-right-8 duration-700">
                                <div className="mb-10">
                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Reserve Your Slot</h2>
                                    <p className="text-gray-400 text-sm font-medium">No license required for waitlist registration.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-green-600 uppercase tracking-widest">Return Date</label>
                                        <input 
                                            type="date" required min={availableAfter} value={form.endDate}
                                            onChange={(e) => setForm({...form, endDate: e.target.value})}
                                            className="w-full p-5 bg-gray-50 rounded-2xl focus:ring-2 focus:ring-black outline-none font-bold text-lg" 
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Full Name</label>
                                        <div className="relative">
                                            <FaUser className="absolute left-5 top-5 text-gray-300" />
                                            <input 
                                                type="text" required value={form.name}
                                                onChange={(e) => setForm({...form, name: e.target.value})}
                                                className="w-full p-5 pl-14 bg-gray-50 rounded-2xl outline-none font-bold" 
                                                placeholder="Enter name"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Contact Phone</label>
                                        <div className="relative">
                                            <FaPhone className="absolute left-5 top-5 text-gray-300" />
                                            <input 
                                                type="tel" required value={form.phone}
                                                onChange={(e) => setForm({...form, phone: e.target.value})}
                                                className="w-full p-5 pl-14 bg-gray-50 rounded-2xl outline-none font-bold" 
                                                placeholder="097..."
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        disabled={isSubmitting}
                                        className="w-full bg-black hover:bg-green-600 text-white font-black text-[11px] uppercase tracking-[0.3em] py-6 rounded-2xl shadow-2xl transition-all flex items-center justify-center gap-3"
                                    >
                                        {isSubmitting ? <FaSpinner className="animate-spin" /> : <><FaCalendarCheck size={16} /> Confirm Reservation</>}
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="text-center py-20 animate-in zoom-in duration-700">
                                <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <FaCheckCircle size={40} />
                                </div>
                                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">Reservation Secured</h2>
                                <p className="text-gray-500 font-medium mb-12">Emit Photography will contact you at <b>{form.phone}</b> to confirm availability.</p>
                                <button onClick={() => router.push('/')} className="px-12 py-5 bg-black text-white font-black text-[10px] uppercase tracking-widest rounded-2xl">Return Home</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function ReservePage() {
    return (
        <Suspense fallback={<CityDriveLoader message="CityDriveHire is waking up..." />}>
            <ReserveContent />
        </Suspense>
    );
}