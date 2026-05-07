'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaStar, FaSpinner, FaCheckCircle, FaCarSide, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

function SurveyContent() {
    const searchParams = useSearchParams();
    const prefillId = searchParams.get('booking_id');

    const [rating, setRating] = useState(5);
    const [hover, setHover] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const formData = new FormData(e.target);
        formData.append('rating', rating);
        formData.append('role', 'Verified Client');
        
        try {
            await axios.post(`${API_BASE}/feedback/submit.php`, formData);
            setSubmitted(true);
        } catch (err) {
            alert("Error submitting feedback. Please check your Booking ID.");
        } finally {
            setSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="max-w-md mx-auto text-center py-24 animate-in fade-in zoom-in duration-700">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 text-green-600 rounded-full mb-8 shadow-inner">
                    <FaCheckCircle size={48} />
                </div>
                <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Thank You!</h2>
                <p className="text-gray-600 leading-relaxed mb-10">
                    Your feedback has been recorded. We appreciate you choosing City Drive for your journey.
                </p>
                <button 
                    onClick={() => window.location.href = '/'}
                    className="w-full bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-black transition-all shadow-xl active:scale-95"
                >
                    Return to Home
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-700 rounded-full text-xs font-black tracking-widest mb-6">
                    <FaCarSide className="text-lg" /> QUALITY ASSESSMENT
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
                    Rate Your Experience
                </h1>
                <p className="text-gray-500 text-lg">
                    Help us drive excellence by sharing your thoughts.
                </p>
            </div>

            <form onSubmit={handleFormSubmit} className="bg-white rounded-[3rem] p-8 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-10">
                
                <div className="text-center py-4">
                    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-6">
                        Overall Satisfaction
                    </label>
                    <div className="flex justify-center gap-2">
                        {[...Array(5)].map((_, index) => {
                            const starValue = index + 1;
                            return (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setRating(starValue)}
                                    onMouseEnter={() => setHover(starValue)}
                                    onMouseLeave={() => setHover(0)}
                                    className="relative transition-all transform hover:scale-125 active:scale-90 duration-200"
                                >
                                    <FaStar
                                        size={48}
                                        className="transition-colors"
                                        color={starValue <= (hover || rating) ? "#fbbf24" : "#f3f4f6"}
                                    />
                                </button>
                            );
                        })}
                    </div>
                    <div className="mt-4 h-6">
                         <span className="text-sm font-black text-black transition-all uppercase tracking-wider">
                            {rating === 5 && "Excellent"}
                            {rating === 4 && "Very Good"}
                            {rating === 3 && "Average"}
                            {rating === 2 && "Poor"}
                            {rating === 1 && "Very Poor"}
                         </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-50">
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Booking ID</label>
                        <input 
                            name="booking_id" 
                            required 
                            defaultValue={prefillId || ""} 
                            placeholder="BK-7890" 
                            className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-black font-bold transition-all placeholder:text-black" 
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Full Name</label>
                        <input 
                            name="name" 
                            required 
                            placeholder="John Doe" 
                            className="w-full p-5 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-black font-bold transition-all placeholder:text-black" 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-gray-500 mb-3 ml-2">Your Comments</label>
                    <textarea 
                        name="text" 
                        required 
                        placeholder="What did you think of the vehicle condition and our service?" 
                        rows="5" 
                        className="w-full p-6 bg-gray-50 border-none rounded-[1.5rem] outline-none focus:ring-2 focus:ring-green-500 focus:bg-white text-black font-bold transition-all resize-none placeholder:text-black"
                    ></textarea>
                </div>

                <button 
                    type="submit" 
                    disabled={submitting} 
                    className="group w-full py-6 bg-green-600 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-green-200/50 hover:bg-green-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                    {submitting ? (
                        <FaSpinner className="animate-spin" />
                    ) : (
                        <>
                            <span>Submit Feedback</span>
                            <FaPaperPlane className="text-sm group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </>
                    )}
                </button>

                <p className="text-center text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">
                    Your feedback helps us maintain the finest fleet in Zambia.
                </p>
            </form>
        </div>
    );
}

export default function ReviewsPage() {
    return (
        <main className="bg-[#fcfcfc] min-h-screen py-16 px-6">
            <Suspense fallback={
                <div className="h-[70vh] flex items-center justify-center">
                    <FaSpinner className="text-green-600 animate-spin size-12" />
                </div>
            }>
                <SurveyContent />
            </Suspense>
        </main>
    );
}