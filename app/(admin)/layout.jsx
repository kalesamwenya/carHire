import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
// You can create a specific AdminLayoutClient similar to your others
import AdminLayoutClient from "@/components/admin/AdminLayoutClient"; 

export default async function AdminLayout({ children }) {
    const session = await getServerSession(authOptions);

    // 1. Check if session exists
    if (!session) {
        redirect('/auth/signin');
    }

    // 2. Strict Admin Check
    // Note: Use 'admin' or 'super_admin' depending on your PHP database values
    if (session.user.role !== 'admin' && session.user.role !== 'super_admin') {
        // If they are a partner, send them to /partner, otherwise /dashboard
        const redirectPath = session.user.role === 'partner' ? '/partner' : '/dashboard';
        redirect(redirectPath);
    }

    return (
        <AdminLayoutClient user={session.user}>
            {children}
        </AdminLayoutClient>
    );
}