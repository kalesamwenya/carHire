"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function RoleGuard({ children, allowedRoles = [] }) {
    const [authorized, setAuthorized] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAccess = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                toast.error("Please sign in to access this page");
                router.push("/auth/signin");
                return;
            }

            try {
                // Verify token and get user role from PHP
                const res = await axios.get("http://api.citydrivehire.local/users/me", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const userRole = res.data.user.role; // 'user', 'partner', or 'admin'

                if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                    toast.error("Access Denied: Unauthorized role.");
                    // Redirect based on what they actually are
                    if (userRole === 'partner') router.push("/dashboard/partner");
                    else if (userRole === 'admin') router.push("/dashboard/admin");
                    else router.push("/dashboard/customer");
                } else {
                    setAuthorized(true);
                }
            } catch (err) {
                localStorage.removeItem("token");
                router.push("/auth/signin");
            }
        };

        checkAccess();
    }, [allowedRoles, router]);

    if (!authorized) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
            </div>
        );
    }

    return children;
}