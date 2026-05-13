'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import {
    FaCar,
    FaCheckCircle,
    FaExclamationCircle,
    FaBell,
    FaSpinner
} from 'react-icons/fa';
import CityDriveLoader from '@/components/CityDriveLoader';

const BASE_API =
    process.env.NEXT_PUBLIC_API_URL ||
    "https://api.citydrivehire.com";

export default function NotificationsPage() {

    const { data: session } = useSession();

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const partnerId = session?.user?.id;

    // =========================
    // FETCH NOTIFICATIONS
    // =========================
    useEffect(() => {

        if (!partnerId) return;

        const fetchNotifications = async () => {

            try {

                setLoading(true);

                const res = await axios.get(
                    `${BASE_API}/partners/get-partner-notifications.php?partner_id=${partnerId}`
                );

                if (res.data.success) {
                    setNotifications(res.data.data || []);
                }

            } catch (err) {

                console.error(
                    "Notification error:",
                    err.response?.data || err.message
                );

            } finally {

                setLoading(false);
            }
        };

        // initial fetch
        fetchNotifications();

        // silent polling
        const interval = setInterval(fetchNotifications, 30000);

        return () => clearInterval(interval);

    }, [partnerId]);

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

        } catch (err) {

            console.error(
                "Mark read error:",
                err.response?.data || err.message
            );
        }
    };

    // =========================
    // MARK ALL AS READ
    // =========================
    const markAllAsRead = async () => {

        try {

            await axios.post(
                `${BASE_API}/admin/mark_notifications_read.php`
            );

            setNotifications(prev =>
                prev.map(n => ({
                    ...n,
                    is_read: 1
                }))
            );

        } catch (err) {

            console.error(
                "Mark all read error:",
                err.response?.data || err.message
            );
        }
    };

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

    return (
        <div className="max-w-4xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Notifications
                </h1>

                <button
                    onClick={markAllAsRead}
                    className="text-sm text-green-600 font-medium hover:underline"
                >
                    Mark all as read
                </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">

                {loading ? (

                    <CityDriveLoader message="Loading your notifications..." />

                ) : notifications.length > 0 ? (

                    notifications.map((note) => (

                        <div
                            key={note.id}
                            onClick={() => {
                                if (note.is_read == 0) {
                                    markAsRead(note.id);
                                }
                            }}
                            className={`p-4 rounded-xl border transition-all cursor-pointer flex gap-4 ${
                                note.is_read == 1
                                    ? 'bg-white border-gray-200'
                                    : 'bg-green-50 border-green-200 shadow-sm'
                            }`}
                        >

                            {/* ICON */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getColor(note.type)}`}>
                                {getIcon(note.type)}
                            </div>

                            {/* CONTENT */}
                            <div className="flex-1">

                                <div className="flex justify-between items-start gap-4">

                                    <h4 className={`font-semibold ${
                                        note.is_read == 1
                                            ? 'text-gray-900'
                                            : 'text-green-900'
                                    }`}>
                                        {note.title}
                                    </h4>

                                    <span className="text-[11px] text-gray-400 whitespace-nowrap">
                                        {new Date(note.created_at).toLocaleString()}
                                    </span>

                                </div>

                                <p className={`text-sm mt-1 leading-relaxed ${
                                    note.is_read == 1
                                        ? 'text-gray-600'
                                        : 'text-gray-700'
                                }`}>
                                    {note.message}
                                </p>

                            </div>

                            {/* UNREAD DOT */}
                            {note.is_read == 0 && (
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 shrink-0"></div>
                            )}

                        </div>
                    ))

                ) : (

                    <div className="text-center py-10 text-gray-400 text-sm">
                        No notifications yet
                    </div>

                )}

            </div>
        </div>
    );
}