'use client';

import { useState, useEffect } from 'react';
import { FaCheck, FaTimes, FaEye, FaInbox, FaSpinner } from 'react-icons/fa';
import { toast, Toaster } from 'react-hot-toast';
import CityDriveLoader from '@/components/CityDriveLoader';

export default function AdminKYC() {
    const [partners, setPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [loading, setLoading] = useState(true);

    const Public_Api = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
    const Base_Url = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";// Base URL for images

   
  useEffect(() => {
    fetch(`${Public_Api}/admin/get-pending-kyc.php`)
        .then(res => res.json())
        .then(data => {
            // This now matches the { success: true, data: [...] } structure
            if (data.success) {
                setPartners(data.data);
            } else {
                setPartners([]);
            }
        })
        .catch(() => {
            toast.error("Could not load verification requests");
            setPartners([]);
        })
        .finally(() => setLoading(false));
}, []);

    const updateStatus = async (userId, status) => {
        try {
            const res = await fetch(`${Public_Api}/admin/update-kyc-status.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, status })
            });
            const result = await res.json();
            
            if (result.success) {
                toast.success(`Partner ${status} successfully`);
                setPartners(partners.filter(p => p.id !== userId));
                setSelectedPartner(null);
            } else {
                toast.error(result.message || "Update failed");
            }
        } catch (error) {
            toast.error("Network error occurred");
        }
    };

    if (loading) return <CityDriveLoader message="sycing kyc data"/>;

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <h1 className="text-2xl font-bold text-slate-900">Pending KYC Verifications</h1>
            
            {partners.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-20 text-center">
                    <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaInbox size={30} />
                    </div>
                    <h3 className="text-slate-900 font-bold text-lg">All caught up!</h3>
                    <p className="text-slate-500">There are no pending KYC requests at the moment.</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="p-4 font-semibold text-slate-700">Partner Details</th>
                                <th className="p-4 font-semibold text-slate-700">NRC Number</th>
                                <th className="p-4 font-semibold text-slate-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partners.map(partner => (
                                <tr key={partner.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="p-4">
                                        <div className="font-bold text-slate-900">{partner.business_name || partner.name}</div>
                                        <div className="text-sm text-slate-500">{partner.email}</div>
                                    </td>
                                    <td className="p-4 text-slate-600 font-mono text-sm">{partner.id_number}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => setSelectedPartner(partner)}
                                            className="text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg inline-flex items-center gap-2 font-medium transition-all"
                                        >
                                            <FaEye /> Review NRC
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Review Modal */}
            {selectedPartner && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto p-8 shadow-2xl">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Review Identity</h2>
                                <p className="text-slate-500">Comparing NRC for {selectedPartner.name}</p>
                            </div>
                            <button onClick={() => setSelectedPartner(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-900 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                            <div className="space-y-3">
                                <p className="font-bold text-slate-700 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-100 rounded-full text-[10px] flex items-center justify-center">1</span>
                                    NRC Front View
                                </p>
                                <div className="aspect-[1.6/1] bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden flex items-center justify-center group">
                                    <img 
                                        src={`${Base_Url}/${selectedPartner.id_front_path}`} 
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                                        alt="Front" 
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <p className="font-bold text-slate-700 flex items-center gap-2">
                                    <span className="w-6 h-6 bg-slate-100 rounded-full text-[10px] flex items-center justify-center">2</span>
                                    NRC Back View
                                </p>
                                <div className="aspect-[1.6/1] bg-slate-50 rounded-2xl border-2 border-slate-100 overflow-hidden flex items-center justify-center">
                                    <img 
                                        src={`${Base_Url}/${selectedPartner.id_back_path}`} 
                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-500" 
                                        alt="Back" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <button 
                                onClick={() => updateStatus(selectedPartner.id, 'verified')}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-green-200 transition-all active:scale-95"
                            >
                                <FaCheck /> Verify & Approve Partner
                            </button>
                            <button 
                                onClick={() => updateStatus(selectedPartner.id, 'rejected')}
                                className="flex-1 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                                <FaTimes /> Decline Application
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}