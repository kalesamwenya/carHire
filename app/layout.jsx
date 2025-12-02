// app/layout.jsx
import './globals.css';

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-800">
        <main className="min-h-screen">
            {children}
        </main>
        </body>
        </html>
    );
}
