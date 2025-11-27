// app/not-authorized/page.jsx
'use client';

import ErrorCard from '../../components/ErrorCard';
import { FaLock } from 'react-icons/fa';
import { signIn } from 'next-auth/react';

export default function NotAuthorized() {
    const icon = <FaLock className="text-red-600 w-6 h-6" />;

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <ErrorCard
                icon={icon}
                title="Access denied"
                message="You don’t have permission to view this page. Sign in with an authorized account or contact support."
                actions={
                    <>
                        <button onClick={() => signIn()} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Sign in</button>
                        <a href="/" className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100">Return home</a>
                    </>
                }
            />
        </main>
    );
}
