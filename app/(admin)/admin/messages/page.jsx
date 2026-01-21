'use client';

import CityDriveLoader from '@/components/CityDriveLoader';
import { useState, useEffect } from 'react';
import { FaPaperPlane, FaSearch, FaCircle, FaUserCircle, FaTrash } from 'react-icons/fa';

export default function MessagesPage() {
    const [inquiries, setInquiries] = useState([]);
    const [selectedInquiry, setSelectedInquiry] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');


    const API_URL =  process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";



    // 1. FETCH REAL DATA FROM PHP
    // 1. FETCH REAL DATA FROM PHP
const fetchMessages = async () => {
    try {
        // Point this to your actual PHP script
        const res = await fetch(`${API_URL}/support/contact_messages.php`); 
        const result = await res.json();
        
        if (result.success && Array.isArray(result.data)) {
            setInquiries(result.data);
            if (result.data.length > 0) setSelectedInquiry(result.data[0]);
        }
    } catch (error) {
        console.error("Error fetching messages:", error);
    } finally {
        setLoading(false);
    }
};

// 3. DELETE MESSAGE (Fixed the URL)
const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
        // Added the PHP path to the delete request
        const res = await fetch(`${API_URL}/support/contact_messages.php?id=${id}`, { 
            method: 'DELETE' 
        });
        const result = await res.json();
        if (result.success) {
            setInquiries(prev => prev.filter(i => i.id !== id));
            setSelectedInquiry(null);
        }
    } catch (error) {
        console.error("Delete failed:", error);
    } finally {
            setPwdLoading(false);
    }
};

    useEffect(() => {
        fetchMessages();
    }, []);

    // 2. MARK AS READ (PUT)
    const handleSelectInquiry = async (item) => {
        setSelectedInquiry(item);
        
        if (item.status === 'unread') {
            try {
                const res = await fetch(`${API_URL}/support/contact_messages.php`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: item.id, status: 'read' }),
                });
                const result = await res.json();
                if (result.success) {
                    setInquiries(prev => prev.map(i => i.id === item.id ? { ...i, status: 'read' } : i));
                }
            } catch (error) {
                console.error("Status update failed:", error);
            }
        }
    };

    const filteredInquiries = inquiries.filter(i => 
        i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        i.message.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <CityDriveLoader message="sycing messages"/>;


    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

            {/* SIDEBAR: INQUIRY LIST */}
            <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-2">Inquiries ({inquiries.length})</h2>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                        <input 
                            type="text" 
                            placeholder="Search name or message..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-green-500" 
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {filteredInquiries.map((item) => (
                        <div
                            key={item.id}
                            onClick={() => handleSelectInquiry(item)}
                            className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-100/50 ${selectedInquiry?.id === item.id ? 'bg-white border-l-4 border-l-green-600 shadow-sm' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`text-sm ${item.status === 'unread' ? 'font-black text-gray-900' : 'font-bold text-gray-800'}`}>
                                    {item.name}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-xs text-gray-500 truncate w-full">{item.message}</p>
                            <div className="mt-2 flex gap-2">
                                <span className={`text-[9px] px-2 py-0.5 rounded-full uppercase font-bold ${item.status === 'unread' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN: VIEW AREA */}
            <div className="flex-1 flex flex-col bg-white">
                {selectedInquiry ? (
                    <>
                        {/* Header */}
                        <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center font-bold">
                                    {selectedInquiry.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{selectedInquiry.name}</h3>
                                    <p className="text-xs text-slate-500">{selectedInquiry.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                <button 
                                    onClick={() => handleDelete(selectedInquiry.id)}
                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete Message"
                                >
                                    <FaTrash size={14} />
                                </button>
                                <a href={`mailto:${selectedInquiry.email}`} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-all">
                                    Reply via Email
                                </a>
                            </div>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
                            <div className="max-w-2xl mx-auto space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                                    <p className="text-xs font-bold text-slate-400 uppercase mb-4">Subject: {selectedInquiry.subject}</p>
                                    <p className="text-slate-700 leading-relaxed italic">
                                        "{selectedInquiry.message}"
                                    </p>
                                </div>
                                <div className="text-center text-[11px] text-gray-400">
                                    Received on {new Date(selectedInquiry.created_at).toLocaleString()} from IP: {selectedInquiry.ip_address || 'Unknown'}
                                </div>
                            </div>
                        </div>

                        {/* Internal Note (Optional) */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    placeholder="Add an internal note about this client..."
                                    className="flex-1 border border-gray-200 rounded-lg px-4 py-2 text-sm outline-none focus:border-slate-500"
                                />
                                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">
                                    Save Note
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-slate-400">
                        Select an inquiry to view details
                    </div>
                )}
            </div>
        </div>
    );
}