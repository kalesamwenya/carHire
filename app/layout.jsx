// app/layout.jsx
import './globals.css';
import Providers from '../lib/Providers';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata = {
    title: 'CarHire',
    description: 'Reliable car rentals in Zambia'
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-800">
        <Providers>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </Providers>
        </body>
        </html>
    );
}
