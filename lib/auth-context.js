// lib/useAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export function useAuth(requiredRole = null) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function checkAuth() {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/auth/signin');
                return;
            }

            try {
                const res = await axios.get('https://api.citydrivehire.com/users/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userData = res.data.user;
                setUser(userData);

                // Role-Based Access Control (RBAC)
                if (requiredRole && userData.role !== requiredRole) {
                    // If a customer tries to enter /partner-dashboard
                    router.push(userData.role === 'partner' ? '/dashboard/partner' : '/dashboard/customer');
                }

            } catch (err) {
                localStorage.removeItem('token');
                router.push('/auth/signin');
            } finally {
                setLoading(false);
            }
        }

        checkAuth();
    }, [requiredRole, router]);

    return { user, loading };
}