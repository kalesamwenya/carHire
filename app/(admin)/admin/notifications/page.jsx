'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    FaBell,
    FaCheckCircle,
    FaExclamationTriangle,
    FaInfoCircle,
    FaCalendarCheck,
    FaTimes,
    FaSearch,
    FaFilter
} from 'react-icons/fa';

export default function NotificationsPage() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const res = await fetch(`${API_URL}/admin/get_notifications.php`);
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data || []);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // Initial Fetch + Polling
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 10000);
        return () => clearInterval(interval);
    }, []);

    const filters = [
        { key: 'all', label: 'All' },
        { key: 'unread', label: 'Unread' },
        { key: 'booking', label: 'Bookings' },
        { key: 'success', label: 'Payments' },
        { key: 'alert', label: 'Alerts' },
        { key: 'info', label: 'Info' }
    ];

    const filteredNotifications = useMemo(() => {
        let data = [...notifications];

        if (activeFilter !== 'all') {
            if (activeFilter === 'unread') {
                data = data.filter((item) => item.is_read == 0);
            } else {
                data = data.filter((item) => item.type === activeFilter);
            }
        }

        if (search.trim()) {
            const query = search.toLowerCase();
            data = data.filter((item) => 
                item.title.toLowerCase().includes(query) || 
                item.message.toLowerCase().includes(query)
            );
        }

        return data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }, [notifications, activeFilter, search]);

    const markAllAsRead = async () => {
        try {
            await fetch(`${API_URL}/admin/mark_notifications_read.php`, { method: 'POST' });
            fetchNotifications();
        } catch (error) {
            console.error(error);
        }
    };

    const openNotification = async (notif) => {
        setSelectedNotification(notif);
        setIsModalOpen(true);

        if (notif.is_read == 0) {
            try {
                await fetch(`${API_URL}/admin/read_notification.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: notif.id })
                });
                setNotifications(prev => 
                    prev.map(item => item.id === notif.id ? { ...item, is_read: 1 } : item)
                );
            } catch (err) {
                console.error(err);
            }
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'alert': return <FaExclamationTriangle />;
            case 'success': return <FaCheckCircle />;
            case 'booking': return <FaCalendarCheck />;
            default: return <FaInfoCircle />;
        }
    };

    const getIconStyles = (type) => {
        switch (type) {
            case 'alert': return 'bg-red-100 text-red-600';
            case 'success': return 'bg-green-100 text-green-600';
            case 'booking': return 'bg-purple-100 text-purple-600';
            default: return 'bg-blue-100 text-blue-600';
        }
    };

    return (
        <div className="max-w-8xl mx-auto px-4 py-8">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                        <div className="p-3 bg-green-600 text-white rounded-2xl shadow-lg shadow-green-200">
                            <FaBell className="text-2xl" />
                        </div>
                        Notifications
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">Manage system alerts and real-time activities.</p>
                </div>
                <button 
                    onClick={markAllAsRead}
                    className="px-6 py-3 bg-white border-2 border-gray-100 text-gray-900 rounded-2xl font-bold hover:bg-gray-50 transition-all text-sm shadow-sm"
                >
                    Mark all as read
                </button>
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex justify-between items-center mb-8 max-sm:flex-col max-sm:gap-4">
                <div className="relative">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-14 pl-12 pr-4 rounded-2xl border-none bg-white shadow-sm focus:ring-2 focus:ring-green-500 font-medium text-gray-700"
                    />
                </div>
                <div className="flex flex-wrap gap-2">
                    {filters.map((f) => (
                        <button
                            key={f.key}
                            onClick={() => setActiveFilter(f.key)}
                            className={`px-5 py-3 rounded-2xl text-sm font-bold transition-all flex items-center gap-2 ${
                                activeFilter === f.key 
                                ? 'bg-gray-900 text-white shadow-xl scale-105' 
                                : 'bg-white text-gray-500 hover:bg-gray-50 shadow-sm'
                            }`}
                        >
                            {f.label}
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${activeFilter === f.key ? 'bg-white/20' : 'bg-gray-100'}`}>
                                {f.key === 'all' ? notifications.length : notifications.filter(n => f.key === 'unread' ? n.is_read == 0 : n.type === f.key).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* LIST */}
            <div className="space-y-4">
                {loading ? (
                    <div className="py-20 text-center text-gray-400 font-medium">Updating feed...</div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="py-20 bg-white rounded-3xl text-center border-2 border-dashed border-gray-100">
                        <p className="text-gray-400 font-bold">No notifications found.</p>
                    </div>
                ) : (
                    filteredNotifications.map((notif) => (
                        <button
                            key={notif.id}
                            onClick={() => openNotification(notif)}
                            className={`w-full text-left p-6 rounded-3xl border-2 transition-all flex gap-6 items-center group ${
                                notif.is_read == 0 ? 'bg-white border-green-200 shadow-md' : 'bg-gray-50/50 border-transparent opacity-80 hover:opacity-100'
                            }`}
                        >
                            <div className={`p-4 rounded-2xl shrink-0 transition-transform group-hover:scale-110 ${getIconStyles(notif.type)}`}>
                                {getIcon(notif.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="font-bold text-gray-900">{notif.title}</h3>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 line-clamp-1">{notif.message}</p>
                            </div>
                        </button>
                    ))
                )}
            </div>

            {/* DETAIL MODAL */}
            {isModalOpen && selectedNotification && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-md bg-gray-900/20">
                    <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div className={`p-5 rounded-3xl ${getIconStyles(selectedNotification.type)}`}>
                                    {getIcon(selectedNotification.type)}
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-400">
                                    <FaTimes />
                                </button>
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 mb-2">{selectedNotification.title}</h2>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-6">
                                {new Date(selectedNotification.created_at).toLocaleString()}
                            </p>
                            <div className="bg-gray-50 rounded-3xl p-6 text-gray-700 leading-relaxed font-medium">
                                {selectedNotification.message}
                            </div>
                        </div>
                        <div className="p-8 pt-0">
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="w-full py-4 bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
                            >
                                Dismiss
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}