'use client';

import { useEffect, useRef, useState } from 'react';
import {
    FaBell,
    FaSpinner,
    FaTimes,
    FaCar,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';

import Link from 'next/link';
import axios from 'axios';
import { useSession } from 'next-auth/react';

const BASE_API =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.citydrivehire.com";

export default function NotificationDropdown({ isOpen, onClick }) {

    const { data: session } = useSession();

    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);

    // MODAL
    const [selectedNotification, setSelectedNotification] = useState(null);

    // store previous unread count
    const prevUnreadRef = useRef(0);

    // sound reference
    const soundRef = useRef(null);

    // =========================
    // INIT SOUND
    // =========================
    useEffect(() => {
        soundRef.current = new Audio(
            '/sound/universfield-new-notification-022-370046.mp3'
        );

        soundRef.current.volume = 0.7;
    }, []);

    // =========================
    // ICONS
    // =========================
    const getIcon = (type) => {

        switch (type) {

            case 'booking':
                return <FaCar />;

            case 'alert':
                return <FaExclamationCircle />;

            case 'success':
                return <FaCheckCircle />;

            default:
                return <FaBell />;
        }
    };

    // =========================
    // COLORS
    // =========================
    const getColor = (type) => {

        switch (type) {

            case 'booking':
                return 'bg-green-100 text-green-600';

            case 'alert':
                return 'bg-red-100 text-red-600';

            case 'success':
                return 'bg-blue-100 text-blue-600';

            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    // =========================
    // MARK SINGLE AS READ
    // =========================
    const markAsRead = async (id) => {

        try {

            await axios.post(
                `${BASE_API}/admin/read_notification.php`,
                { id }
            );

            setNotifications(prev =>
                prev.map(n =>
                    n.id === id
                        ? { ...n, is_read: 1 }
                        : n
                )
            );

            setUnread(prev => Math.max(prev - 1, 0));

        } catch (err) {

            console.error(
                "Mark read error:",
                err.response?.data || err.message
            );
        }
    };

    // =========================
    // OPEN MODAL
    // =========================
    const openNotification = async (notification) => {

        setSelectedNotification(notification);

        if (notification.is_read == 0) {
            await markAsRead(notification.id);
        }
    };

    // =========================
    // FETCH NOTIFICATIONS
    // =========================
    const fetchNotifications = async (silent = false) => {

        if (!session?.user?.id) return;

        try {

            if (!silent) setLoading(true);

            const res = await axios.get(
                `${BASE_API}/admin/get-partner-notifications.php?partner_id=${session.user.id}`
            );

            if (res.data.success) {

                const newUnread = res.data.unread || 0;

                setNotifications(res.data.data || []);
                setUnread(newUnread);

                // =========================
                // SOUND TRIGGER
                // =========================
                if (
                    prevUnreadRef.current !== 0 &&
                    newUnread > prevUnreadRef.current
                ) {
                    soundRef.current?.play().catch(() => {});
                }

                prevUnreadRef.current = newUnread;
            }

        } catch (err) {

            console.error(
                "Notification error:",
                err.response?.data || err.message
            );

        } finally {

            if (!silent) setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        fetchNotifications(false);
    }, [session?.user?.id]);

    // =========================
    // POLLING
    // =========================
    useEffect(() => {

        if (!session?.user?.id) return;

        const interval = setInterval(() => {
            fetchNotifications(true);
        }, 15000);

        return () => clearInterval(interval);

    }, [session?.user?.id]);

    return (
        <>
            <div className="relative">

                {/* =========================
                    BELL BUTTON
                ========================= */}
                <button
                    onClick={onClick}
                    className={`p-2 rounded-full transition-all relative ${
                        isOpen
                            ? 'bg-green-50 text-green-600'
                            : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                    }`}
                >
                    <FaBell size={18} />

                    {/* BADGE */}
                    {unread > 0 && (
                        <span className="absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 text-[10px] bg-rose-500 text-white rounded-full flex items-center justify-center font-bold">
                            {unread}
                        </span>
                    )}
                </button>

                {/* =========================
                    DROPDOWN
                ========================= */}
                {isOpen && (
                    <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">

                        {/* HEADER */}
                        <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-bold text-gray-900">
                                Notifications
                            </h3>

                            <button
                                onClick={() => fetchNotifications(false)}
                                className="text-[10px] text-green-600 font-bold uppercase hover:underline"
                            >
                                Refresh
                            </button>
                        </div>

                        {/* LIST */}
                        <div className="max-h-[320px] overflow-y-auto">

                            {loading ? (

                                <div className="p-6 text-center text-gray-400 flex justify-center">
                                    <FaSpinner className="animate-spin" />
                                </div>

                            ) : notifications.length > 0 ? (

                                notifications.map(n => (

                                    <div
                                        key={n.id}
                                        onClick={() => openNotification(n)}
                                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                                            n.is_read == 0
                                                ? 'bg-green-50/50'
                                                : 'bg-white'
                                        }`}
                                    >

                                        {/* ICON */}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${getColor(n.type)}`}>
                                            {getIcon(n.type)}
                                        </div>

                                        {/* CONTENT */}
                                        <div className="flex-1 min-w-0">

                                            <div className="flex items-start justify-between gap-2">

                                                <p className={`text-sm font-semibold truncate ${
                                                    n.is_read == 0
                                                        ? 'text-gray-900'
                                                        : 'text-gray-700'
                                                }`}>
                                                    {n.title}
                                                </p>

                                                {n.is_read == 0 && (
                                                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1 shrink-0"></div>
                                                )}
                                            </div>

                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                                {n.message}
                                            </p>

                                            <p className="text-[10px] text-gray-400 mt-2">
                                                {new Date(n.created_at).toLocaleString()}
                                            </p>

                                        </div>
                                    </div>
                                ))

                            ) : (

                                <div className="p-8 text-center text-gray-400 text-sm">
                                    No new notifications
                                </div>

                            )}

                        </div>

                        {/* FOOTER */}
                        <Link
                            href="/partner/notifications"
                            className="block p-3 text-center text-xs font-bold text-gray-500 hover:bg-gray-50 bg-gray-50/30"
                        >
                            View All Activity
                        </Link>

                    </div>
                )}
            </div>

            {/* =========================
                READ MODAL
            ========================= */}
            {selectedNotification && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">

                    {/* BACKDROP */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setSelectedNotification(null)}
                    />

                    {/* MODAL */}
                    <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* HEADER */}
                        <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4">

                            <div className="flex gap-4">

                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${getColor(selectedNotification.type)}`}>
                                    {getIcon(selectedNotification.type)}
                                </div>

                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">
                                        {selectedNotification.title}
                                    </h2>

                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(selectedNotification.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6">

                            <p className="text-gray-700 leading-relaxed text-sm">
                                {selectedNotification.message}
                            </p>

                        </div>

                        {/* FOOTER */}
                        <div className="px-6 pb-6 flex justify-end">
                            <button
                                onClick={() => setSelectedNotification(null)}
                                className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}