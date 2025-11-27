// app/error.jsx
'use client';

import { useEffect } from 'react';
import ErrorCard from '../components/ErrorCard';

export default function GlobalError({ error, reset }) {
    useEffect(() => {
        console.error('Unhandled error:', error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <ErrorCard
                title="Something went wrong"
                message="We hit an unexpected error. You can try again or return to the homepage."
                actions={
                    <>
                        <button onClick={() => reset()} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Try again</button>
                        <button onClick={() => window.location.reload()} className="px-4 py-2 border rounded-md">Reload</button>
                    </>
                }
            />
        </main>
    );
}
