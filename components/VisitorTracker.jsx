'use client';

import { useEffect, useRef } from 'react';
import axios from 'axios';
import { useSession } from "next-auth/react";

export default function VisitorTracker() {
    const { data: session, status } = useSession();
    const hasTracked = useRef(false);

    useEffect(() => {
        // Wait until session status is determined (either authenticated or unauthenticated)
        if (status === "loading") return;
        
        // Prevent duplicate execution per session/login change
        if (hasTracked.current) return;
        hasTracked.current = true;

        const trackVisitor = async () => {
            try {
                const today = new Date().toDateString();
                const lastTracked = localStorage.getItem('city_drive_last_tracked');
                const isLoggedIn = !!session?.user?.email;

                // If tracked today and NOT a new login, skip
                if (lastTracked === today && !isLoggedIn) return;

                // 1. Visitor ID logic
                let visitorId = localStorage.getItem('city_drive_v_id');
                if (!visitorId) {
                    visitorId = `v-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 10)}`;
                    localStorage.setItem('city_drive_v_id', visitorId);
                }

                // 2. Metadata Helpers
                const ua = navigator.userAgent;
                const getOS = () => {
                    if (ua.includes("Windows")) return "Windows";
                    if (ua.includes("Mac")) return "MacOS";
                    if (ua.includes("Android")) return "Android";
                    if (ua.includes("iPhone")) return "iOS";
                    return "Linux/Other";
                };

                // 3. IP Fetch (External)
                const getIP = async () => {
                    try {
                        const res = await axios.get('https://api.ipify.org?format=json', { timeout: 3000 });
                        return res.data.ip;
                    } catch { return '0.0.0.0'; }
                };
                const ip = await getIP();

                // 4. Send Logic
                const sendPayload = async (lat = 0, lng = 0) => {
                    const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";
                    
                    try {
                        const res = await axios.post(`${BASE_API}/reports/log_detailed_visit.php`, {
                            visitor_id: visitorId,
                            email: session?.user?.email || null,
                            device: /Mobi|Android/i.test(ua) ? "Mobile" : "Desktop",
                            os: getOS(),
                            platform: navigator.platform,
                            ip_address: ip,
                            lat,
                            lng
                        });

                        if (res.data?.status === "tracked" || res.data?.status === "skipped") {
                            localStorage.setItem('city_drive_last_tracked', today);
                        }
                    } catch (err) {
                        // Better error logging to see the actual server response
                        console.warn("Tracking subtle failure:", err.response?.data || err.message);
                    }
                };

                // 5. Geolocation Execution
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                        (pos) => sendPayload(pos.coords.latitude, pos.coords.longitude),
                        () => sendPayload(0, 0),
                        { timeout: 5000 }
                    );
                } else {
                    sendPayload(0, 0);
                }

            } catch (e) {
                console.error("Tracker system crash:", e);
            }
        };

        trackVisitor();
    }, [status, session?.user?.email]); // Re-run when session status changes

    return null;
}