import { redirect } from 'next/navigation';
import PartnerLayoutClient from '../../components/partner/PartnerLayoutClient';

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

export default async function PartnerLayout({ children }) {
    const user = await getUser();

    if (!user) {
        redirect('/signin');
    }

    // In a real app, verify user.role === 'partner' here

    return (
        <PartnerLayoutClient user={user}>
            {children}
        </PartnerLayoutClient>
    );
}