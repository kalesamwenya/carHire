'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { FaBell } from 'react-icons/fa';

export default function NotificationsDropdown({
    isOpen,
    onToggle
}) {

    const API_URL =
        process.env.NEXT_PUBLIC_API_URL ||
        "https://api.citydrivehire.com";

    const [notifications, setNotifications] = useState([]);
    const [unread, setUnread] = useState(0);
    const [loading, setLoading] = useState(false);

    /**
     * TRACK PREVIOUS COUNT
     * Used for sound effect
     */
    const previousUnreadRef = useRef(0);

    /**
     * AUDIO REF
     */
    const audioRef = useRef(null);

    /**
     * FETCH NOTIFICATIONS
     */
    const fetchNotifications = async (silent = false) => {

        try {

            if (!silent) {
                setLoading(true);
            }

            const res = await fetch(
                `${API_URL}/admin/get_notifications.php`,
                {
                    cache: 'no-store'
                }
            );

            const data = await res.json();

            if (data.success) {

                const newUnread = data.unread || 0;

                /**
                 * PLAY SOUND
                 * ONLY IF NEW NOTIFICATION ARRIVES
                 */
                if (
                    previousUnreadRef.current > 0 &&
                    newUnread > previousUnreadRef.current
                ) {

                    if (audioRef.current) {

                        audioRef.current.currentTime = 0;

                        audioRef.current.play().catch(() => {
                            console.log('Autoplay blocked');
                        });
                    }
                }

                previousUnreadRef.current = newUnread;

                setNotifications(data.data || []);
                setUnread(newUnread);
            }

        } catch (err) {

            console.error(err);

        } finally {

            if (!silent) {
                setLoading(false);
            }
        }
    };

    /**
     * INITIAL FETCH
     */
    useEffect(() => {

        fetchNotifications();

    }, []);

    /**
     * FETCH WHEN OPENED
     */
    useEffect(() => {

        if (isOpen) {
            fetchNotifications(true);
        }

    }, [isOpen]);

    /**
     * POLLING
     * EVERY 10 SECONDS
     */
    useEffect(() => {

        const interval = setInterval(() => {

            fetchNotifications(true);

        }, 10000);

        return () => clearInterval(interval);

    }, []);

    return (
        <div className="relative">

            {/* NOTIFICATION SOUND */}
            <audio
                ref={audioRef}
                preload="auto"
            >
                <source
                    src="/sound/universfield-new-notification-022-370046.mp3"
                    type="audio/mpeg"
                />
            </audio>

            {/* BELL BUTTON */}
            <button
                onClick={onToggle}
                className={`p-2 transition-all duration-300 relative ${
                    isOpen
                        ? 'text-green-600 bg-green-50 rounded-xl'
                        : 'text-gray-500 hover:text-green-600'
                }`}
            >

                <FaBell
                    className={`text-lg transition-transform duration-300 ${
                        unread > 0
                            ? 'animate-pulse'
                            : ''
                    }`}
                />

                {unread > 0 && (
                    <>
                        {/* RED DOT */}
                        <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>

                        {/* COUNT */}
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {unread > 99 ? '99+' : unread}
                        </span>
                    </>
                )}
            </button>

            {/* DROPDOWN */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden">

                    {/* HEADER */}
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-green-50 to-white">
                        <div>
                            <h3 className="font-bold text-sm text-gray-800">
                                Notifications
                            </h3>

                            <p className="text-[11px] text-gray-400 mt-0.5">
                                Live updates enabled
                            </p>
                        </div>

                        <span className="text-xs text-green-600 font-semibold bg-green-50 px-2 py-1 rounded-full">
                            {unread} New
                        </span>
                    </div>

                    {/* LIST */}
                    <div className="max-h-96 overflow-y-auto">

                        {loading ? (

                            <div className="p-6 text-center text-sm text-gray-400">
                                Loading notifications...
                            </div>

                        ) : notifications.length === 0 ? (

                            <div className="p-6 text-center text-sm text-gray-400">
                                No notifications found
                            </div>

                        ) : (

                            notifications.map((notif) => (

                                <div
                                    key={notif.id}
                                    className={`px-5 py-4 border-b border-gray-50 flex gap-3 transition-all hover:bg-gray-50 ${
                                        notif.is_read == 0
                                            ? 'bg-green-50/40'
                                            : ''
                                    }`}
                                >

                                    {/* STATUS DOT */}
                                    <div
                                        className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${
                                            notif.type === 'alert'
                                                ? 'bg-red-500'
                                                : notif.type === 'success'
                                                ? 'bg-green-500'
                                                : 'bg-blue-500'
                                        }`}
                                    ></div>

                                    {/* CONTENT */}
                                    <div className="flex-1 min-w-0">

                                        <div className="flex justify-between items-start gap-3">

                                            <div>

                                                <p className="text-sm font-semibold text-gray-800 leading-tight">
                                                    {notif.title}
                                                </p>

                                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                                    {notif.message}
                                                </p>

                                            </div>

                                            <span className="text-[10px] text-gray-400 whitespace-nowrap">
                                                {new Date(
                                                    notif.created_at
                                                ).toLocaleDateString()}
                                            </span>

                                        </div>

                                    </div>

                                </div>
                            ))
                        )}

                    </div>

                    {/* FOOTER */}
                    <div className="px-4 py-3 border-t border-gray-100 text-center bg-gray-50">
                        <Link
                            href="/admin/notifications"
                            className="text-xs font-bold text-green-600 hover:underline"
                        >
                            View All Notifications
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
}