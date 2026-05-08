'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { FaPlus, FaTag, FaClock, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

// Use an environment variable with a fallback to your local dev environment
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.citydrivehire.com';

export default function AdminPromotions() {
    const [promos, setPromos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        code: '',
        discount: 10,
        min_spend: 0,
        expiry_date: ''
    });

    // 1. Load all promotions using Axios
    const fetchPromos = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/promotion/get_all_promos.php`);
            if (response.data.success) {
                setPromos(response.data.promos || []);
            }
        } catch (error) {
            console.error("Fetch error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPromos(); }, []);

    // 2. Toggle Activation
    const toggleStatus = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/promotion/toggle_promo.php`, { id });
            if (response.data.success) {
                fetchPromos();
            }
        } catch (error) {
            alert(error.response?.data?.message || "Failed to update status");
        }
    };

    // 3. Create New Promo
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/promotion/create_promo.php`, formData);
            if (response.data.success) {
                setFormData({ code: '', discount: 10, min_spend: 0, expiry_date: '' });
                fetchPromos();
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            alert("Error creating promotion. Check console for details.");
        }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen font-sans">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Campaign Management</h1>
                        <p className="text-slate-500 text-sm">Create and activate marketing promo codes for CityDrive.</p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Live System</span>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* CREATE FORM */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 h-fit sticky top-8">
                        <h3 className="font-bold text-slate-800 mb-5 flex items-center gap-2">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <FaPlus className="text-green-600 text-sm" />
                            </div>
                            New Promotion
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Promo Code</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. CITYDRIVE20"
                                    className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-slate-900 outline-none transition-all font-mono font-bold uppercase"
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    required 
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Discount %</label>
                                    <input type="number" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" 
                                        value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Min Spend (K)</label>
                                    <input type="number" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold" 
                                        value={formData.min_spend} onChange={(e) => setFormData({...formData, min_spend: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Expiry Date</label>
                                <input type="date" className="w-full mt-1 p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-600" 
                                    value={formData.expiry_date} onChange={(e) => setFormData({...formData, expiry_date: e.target.value})} />
                            </div>
                            <button className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transform active:scale-[0.98] transition-all shadow-lg shadow-slate-200">
                                Create Promotion
                            </button>
                        </form>
                    </div>

                    {/* LIST TABLE */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                        {loading ? (
                            <div className="p-20 text-center text-slate-400 font-medium">Loading promotions...</div>
                        ) : promos.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="inline-block p-4 bg-slate-50 rounded-full mb-4">
                                    <FaTag className="text-slate-300 text-3xl" />
                                </div>
                                <h4 className="text-slate-900 font-bold">No active campaigns</h4>
                                <p className="text-slate-500 text-sm">Create your first promo code to see it here.</p>
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Details</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Value</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {promos.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="p-5">
                                                <div className="font-mono font-bold text-slate-900">{p.code}</div>
                                                <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1 font-bold">
                                                    <FaClock /> {p.expiry_date || 'NO EXPIRY'}
                                                </div>
                                            </td>
                                            <td className="p-5">
                                                <div className="text-sm font-bold text-slate-700">{p.discount_percent}% OFF</div>
                                                <div className="text-[10px] text-slate-400 font-bold">MIN K{p.min_spend}</div>
                                            </td>
                                            <td className="p-5">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                                                    {p.is_active ? <FaCheckCircle /> : <FaExclamationTriangle />}
                                                    {p.is_active ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-5 text-right">
                                                <button 
                                                    onClick={() => toggleStatus(p.id)}
                                                    className={`text-[11px] font-black uppercase tracking-widest px-5 py-2 rounded-xl transition-all ${p.is_active ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100'}`}
                                                >
                                                    {p.is_active ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}