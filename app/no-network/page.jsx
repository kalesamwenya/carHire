// app/no-network/page.jsx
'use client';

import { useEffect, useState } from 'react';
import ErrorCard from '../../components/ErrorCard';
import { FaWifi, FaRedo } from 'react-icons/fa';

export default function NoNetwork() {
    const [online, setOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

    useEffect(() => {
        const onOnline = () => setOnline(true);
        const onOffline = () => setOnline(false);
        window.addEventListener('online', onOnline);
        window.addEventListener('offline', onOffline);
        return () => {
            window.removeEventListener('online', onOnline);
            window.removeEventListener('offline', onOffline);
        };
    }, []);

    if (online) {
        if (typeof window !== 'undefined') window.location.replace('/');
        return null;
    }

    const icon = <FaWifi className="text-blue-600 w-6 h-6" />;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white p-6">
            <ErrorCard
                icon={icon}
                title="No internet connection"
                message="Your device appears to be offline. Check your connection and try again."
                actions={
                    <>
                        <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <FaRedo /> Retry
                        </button>
                        <a href="/" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Go home</a>
                    </>
                }
            />
        </main>
    );
}
