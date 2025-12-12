import CorporateHeader from '@/components/corporate/CorporateHeader';
import Footer from '@/components/Footer'; // Reusing the main footer is usually good for consistency

export const metadata = {
    title: 'About Emit Car Hire | Corporate',
    description: 'Our mission, vision, and values.',
};

export default function CorporateLayout({ children }) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <CorporateHeader />
            <main>
                {children}
            </main>
            <Footer />
        </div>
    );
}