"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaStar, FaCarSide, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export default function RateBooking() {
    const { token } = useParams();
    const router = useRouter();
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return toast.error("Please select a star rating");
        setLoading(true);
        try {
            await axios.post("https://api.citydrivehire.com/bookings/rate.php", {
                token, rating, comment
            });
            toast.success("Feedback submitted!");
            setTimeout(() => router.push("/"), 2000);
        } catch (err) {
            toast.error("Failed to save rating.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster />
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCarSide size={30} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">How was your trip?</h1>
                <p className="text-gray-500 mb-8">Tap a star to rate your rental experience</p>

                {/* Star Rating System */}
                <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            className={`text-4xl transition-all ${star <= (hover || rating) ? "text-yellow-400 scale-110" : "text-gray-200"}`}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            onClick={() => setRating(star)}
                        >
                            <FaStar />
                        </button>
                    ))}
                </div>

                <textarea
                    className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-green-500 outline-none mb-6"
                    rows={4}
                    placeholder="Any specific feedback? (Optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                    {loading ? "Saving..." : <><FaPaperPlane /> Submit Feedback</>}
                </button>
            </div>
        </div>
    );
}