'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    FaSearch,
    FaCheck,
    FaReply,
    FaExclamationCircle,
    FaSpinner,
    FaTimes,
    FaUserCircle,
    FaTicketAlt,
    FaClock,
    FaCircle
} from 'react-icons/fa';

export default function HelpDeskPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [sendingReply, setSendingReply] = useState(false);
    const [replies, setReplies] = useState([]);
    const [loadingReplies, setLoadingReplies] = useState(false);

    const fetchTickets = async () => {
        try {
            const res = await fetch(`${API_URL}/support/get_tickets.php`);
            const data = await res.json();
            if (data.success) setTickets(data.data || []);
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const fetchReplies = async (ticketId) => {
        if (!ticketId) return;
        setLoadingReplies(true);
        try {
            const res = await fetch(`${API_URL}/support/get_ticket_replies.php?ticket_id=${ticketId}`);
            const data = await res.json();
            if (data.success) setReplies(data.data || []);
        } catch (err) { console.error(err); } 
        finally { setLoadingReplies(false); }
    };

    useEffect(() => {
        fetchTickets();
        const interval = setInterval(fetchTickets, 15000);
        return () => clearInterval(interval);
    }, []);

    const filteredTickets = useMemo(() => {
        return tickets.filter((t) => {
            const matchesSearch = 
                t.ticket_id?.toLowerCase().includes(search.toLowerCase()) ||
                t.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
                t.subject?.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === 'all' || t.status?.toLowerCase() === statusFilter.toLowerCase();
            return matchesSearch && matchesStatus;
        });
    }, [tickets, search, statusFilter]);

    const updateTicketStatus = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/support/update_ticket_status.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            const data = await res.json();
            if (data.success) {
                fetchTickets();
                if (selectedTicket) setSelectedTicket(prev => ({ ...prev, status }));
            }
        } catch (err) { console.error(err); }
    };

    const sendReply = async () => {
        if (!replyMessage.trim()) return;
        setSendingReply(true);
        try {
            const res = await fetch(`${API_URL}/support/reply_ticket.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticket_id: selectedTicket.ticket_id,
                    email: selectedTicket.customer_email,
                    subject: selectedTicket.subject,
                    message: replyMessage,
                    customer_name: selectedTicket.customer_name
                })
            });
            const data = await res.json();
            if (data.success) {
                setReplyMessage('');
                fetchReplies(selectedTicket.ticket_id);
            }
        } catch (err) { console.error(err); } 
        finally { setSendingReply(false); }
    };

    const getPriorityColor = (p) => {
        if (p === 'High') return 'bg-red-50 text-red-600 border-red-100';
        if (p === 'Medium') return 'bg-amber-50 text-amber-600 border-amber-100';
        return 'bg-blue-50 text-blue-600 border-blue-100';
    };

    return (
        <div className="max-w-8xl mx-auto px-4 py-10">
            {/* HEADER & STATS */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Help Desk</h1>
                    <p className="text-gray-500 font-medium">Manage and resolve customer support inquiries.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white border-2 border-red-50 p-4 rounded-3xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center text-xl">
                            <FaExclamationCircle />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Urgent</p>
                            <p className="text-2xl font-black text-gray-900">{tickets.filter(t => t.priority === 'High').length}</p>
                        </div>
                    </div>
                    <div className="bg-white border-2 border-blue-50 p-4 rounded-3xl shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center text-xl">
                            <FaTicketAlt />
                        </div>
                        <div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Open</p>
                            <p className="text-2xl font-black text-gray-900">{tickets.filter(t => t.status === 'Open').length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTER */}
            <div className="flex flex-wrap gap-4 mb-8">
                <div className="relative flex-1 min-w-[300px]">
                    <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        value={search} onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by ID, Customer, or Subject..."
                        className="w-full h-14 pl-14 pr-6 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-green-500 font-medium"
                    />
                </div>
                <select 
                    value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-14 px-6 rounded-2xl border-none bg-white shadow-sm font-bold text-gray-700 focus:ring-2 focus:ring-green-500"
                >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="closed">Closed</option>
                </select>
            </div>

            {/* TICKETS LIST */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center"><FaSpinner className="animate-spin text-3xl text-green-600 mx-auto" /></div>
                ) : filteredTickets.length === 0 ? (
                    <div className="py-20 bg-white rounded-[40px] text-center border-2 border-dashed border-gray-100 font-bold text-gray-400">
                        No tickets found matching your criteria.
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div 
                            key={ticket.ticket_id}
                            onClick={() => { setSelectedTicket(ticket); fetchReplies(ticket.ticket_id); }}
                            className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row md:items-center gap-6"
                        >
                            <div className="flex items-center gap-4 min-w-[140px]">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 font-mono font-bold">
                                    #{ticket.ticket_id.slice(-4)}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-400 uppercase tracking-tighter">Priority</p>
                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                        {ticket.priority}
                                    </span>
                                </div>
                            </div>

                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 group-hover:text-green-600 transition-colors">{ticket.subject}</h3>
                                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 font-medium">
                                    <FaUserCircle className="text-gray-300" /> {ticket.customer_name}
                                    <FaCircle className="text-[4px] text-gray-300" />
                                    <FaClock className="text-gray-300" /> {new Date(ticket.created_at).toLocaleDateString()}
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6">
                                <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest ${
                                    ticket.status === 'Open' ? 'bg-green-100 text-green-700' : 
                                    ticket.status === 'Closed' ? 'bg-gray-100 text-gray-500' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {ticket.status}
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-all">
                                    <FaReply />
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* CONVERSATION MODAL */}
            {selectedTicket && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-md bg-gray-900/30">
                    <div className="bg-white w-full max-w-4xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* MODAL HEADER */}
                        <div className="p-8 border-b flex justify-between items-center bg-gray-50/50">
                            <div>
                                <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.2em]">Ticket Conversation</span>
                                <h2 className="text-2xl font-black text-gray-900 leading-tight mt-1">{selectedTicket.subject}</h2>
                            </div>
                            <button onClick={() => setSelectedTicket(null)} className="p-4 bg-white rounded-2xl shadow-sm hover:bg-red-50 hover:text-red-500 transition-all">
                                <FaTimes />
                            </button>
                        </div>

                        {/* MESSAGES AREA */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-white">
                            {/* CUSTOMER ORIGINAL MESSAGE */}
                            <div className="flex gap-4 max-w-[85%]">
                                <div className="w-10 h-10 shrink-0 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                    {selectedTicket.customer_name.charAt(0)}
                                </div>
                                <div className="bg-blue-50/50 p-6 rounded-3xl rounded-tl-none">
                                    <p className="text-xs font-black text-blue-600 uppercase mb-2">{selectedTicket.customer_name}</p>
                                    <p className="text-gray-700 font-medium leading-relaxed">{selectedTicket.message}</p>
                                </div>
                            </div>

                            {/* REPLIES */}
                            {loadingReplies ? (
                                <div className="text-center"><FaSpinner className="animate-spin text-gray-200" /></div>
                            ) : (
                                replies.map(r => (
                                    <div key={r.id} className={`flex gap-4 max-w-[85%] ${r.sender_type === 'admin' ? 'ml-auto flex-row-reverse' : ''}`}>
                                        <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold ${
                                            r.sender_type === 'admin' ? 'bg-gray-900 text-white' : 'bg-blue-600 text-white'
                                        }`}>
                                            {r.sender_type === 'admin' ? 'A' : 'C'}
                                        </div>
                                        <div className={`p-6 rounded-3xl ${
                                            r.sender_type === 'admin' ? 'bg-gray-900 text-white rounded-tr-none' : 'bg-blue-50/50 text-gray-700 rounded-tl-none'
                                        }`}>
                                            <p className={`text-[10px] font-black uppercase mb-2 ${r.sender_type === 'admin' ? 'text-gray-400' : 'text-blue-600'}`}>
                                                {r.sender_type === 'admin' ? 'CityDrive Support' : selectedTicket.customer_name}
                                            </p>
                                            <p className="font-medium leading-relaxed">{r.message}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* REPLY BOX & STATUS CONTROL */}
                        <div className="p-8 bg-gray-50 border-t">
                            <div className="flex items-center gap-4 mb-4">
                                <p className="text-xs font-black text-gray-400 uppercase">Change Status:</p>
                                {['Open', 'In Progress', 'Closed'].map(s => (
                                    <button 
                                        key={s} 
                                        onClick={() => updateTicketStatus(selectedTicket.ticket_id, s)}
                                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                                            selectedTicket.status === s ? 'bg-green-600 text-white shadow-lg' : 'bg-white text-gray-400 border border-gray-100 hover:border-green-200'
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                            <div className="relative">
                                <textarea 
                                    value={replyMessage} onChange={(e) => setReplyMessage(e.target.value)}
                                    placeholder="Type your response to the customer..."
                                    className="w-full h-32 p-6 rounded-[28px] border-none shadow-inner bg-white focus:ring-2 focus:ring-green-500 font-medium resize-none"
                                />
                                <button 
                                    onClick={sendReply} disabled={sendingReply || !replyMessage.trim()}
                                    className="absolute bottom-4 right-4 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-xl shadow-green-100 flex items-center gap-2 disabled:opacity-50 transition-all"
                                >
                                    {sendingReply ? <FaSpinner className="animate-spin" /> : <><FaReply /> Send Reply</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}