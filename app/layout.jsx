import NextAuthProvider from "@/components/providers/NextAuthProvider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; 
import './globals.css';
import VisitorTracker from "@/components/VisitorTracker";

export default async function RootLayout({ children }) {
    // Fetch the session on the server
    const session = await getServerSession(authOptions);

    return (
        <html lang="en">
            <body className="bg-gray-50 text-gray-800">
                <main className="min-h-screen">
                    {/* Inject the session here */}
                    <NextAuthProvider session={session}>
                        <VisitorTracker />
                        {children}
                    </NextAuthProvider>
                </main>
            </body>
        </html>
    );
}