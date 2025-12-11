export const metadata = {
    title: 'Admin Login | Emit',
};

export default function AdminAuthLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            {children}
        </div>
    );
}