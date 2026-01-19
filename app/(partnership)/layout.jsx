import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PartnerLayoutClient from '../../components/partner/PartnerLayoutClient';

export const dynamic = 'force-dynamic';

export default async function PartnerLayout({ children }) {
    // 1. Get the session from NextAuth
    const session = await getServerSession(authOptions);

    // 2. If no session, or role is not partner, redirect
    if (!session || session.user.role !== 'partner') {
        // We redirect to sign-in with an error message
        redirect('/auth/signin?error=AccessDenied');
    }

    // 3. Pass the session user to the Client Layout
    return (
        <PartnerLayoutClient user={session.user}>
            {children}
        </PartnerLayoutClient>
    );
}