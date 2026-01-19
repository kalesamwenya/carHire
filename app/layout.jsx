// app/layout.jsx
import NextAuthProvider from "@/components/providers/NextAuthProvider";
import './globals.css';
import VisitorTracker from "@/components/VisitorTracker";

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-800">
        <main className="min-h-screen">
            <NextAuthProvider>
                <VisitorTracker/>
                {children}
            </NextAuthProvider>
        </main>
        </body>
        </html>
    );
}
