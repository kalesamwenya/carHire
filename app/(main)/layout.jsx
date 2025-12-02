// app/layout.jsx
import '../globals.css';
import Providers from '../../lib/Providers';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

export const metadata = {
    title: 'CarHire',
    description: 'Reliable car rentals in Zambia'
};

export default function MainLayout({ children }) {
    return (
        <Providers>
            <Header />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
        </Providers>
    );
}
