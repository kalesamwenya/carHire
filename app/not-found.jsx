// app/not-found.jsx
import ErrorCard from '../components/ErrorCard';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <ErrorCard
                title="Page not found"
                message="The page you’re looking for doesn’t exist or has been moved. Try returning home or browse our cars."
                actions={
                    <>
                        <a href="/" className="inline-flex items-center px-5 py-3 bg-green-600 text-white rounded-md hover:bg-green-700">Go home</a>
                        <a href="/cars" className="inline-flex items-center px-5 py-3 border rounded-md text-gray-700 hover:bg-gray-100">Browse cars</a>
                    </>
                }
            />
        </main>
    );
}
