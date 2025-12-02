import { redirect } from 'next/navigation';
import DashboardLayoutClient from '../../components/dashboard/DashboardLayoutClient';
import '../globals.css'
// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function getUser() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    try {
        const res = await fetch(`${baseUrl}/api/users?me=true`, { cache: 'no-store' });
        if (!res.ok) return null;
        return await res.json();
    } catch (e) {
        return null;
    }
}

export default async function DashboardLayout({ children }) {
    const user = await getUser();

    if (!user) {
        redirect('/signin');
    }

    return (
        <DashboardLayoutClient user={user}>
            {children}
        </DashboardLayoutClient>
    );
}