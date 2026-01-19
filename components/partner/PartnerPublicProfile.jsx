'use client';
import { FaPhone, FaMapMarkerAlt, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

export default function PartnerPublicProfile({ data }) {
    return (
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cover Header */}
            <div className="h-48 bg-gradient-to-r from-emerald-600 to-green-500 relative">
                <div className="absolute -bottom-12 left-8">
                    <img 
                        src={data.avatar_url ? `http://api.citydrivehire.local/${data.avatar_url}` : '/default-avatar.png'} 
                        className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover bg-gray-100"
                        alt={data.businessName}
                    />
                </div>
            </div>

            <div className="pt-16 pb-10 px-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            {data.businessName || 'Unnamed Business'}
                            {data.kyc_status === 'verified' && <FaCheckCircle className="text-blue-500 text-xl" title="Verified Partner" />}
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <FaMapMarkerAlt /> {data.city || 'Zambia'}
                        </p>
                    </div>
                    <a href={`tel:${data.phone}`} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-green-700 transition-all">
                        <FaPhone /> Contact Partner
                    </a>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">About Us</h3>
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {data.bio || "No description provided yet."}
                    </p>
                </div>

                <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                        <p className="text-xs text-gray-400 uppercase font-bold">Partner Since</p>
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                            <FaCalendarAlt className="text-green-500" /> 2026
                        </p>
                    </div>
                    {/* Add more stats here later, like total hires or rating */}
                </div>
            </div>
        </div>
    );
}