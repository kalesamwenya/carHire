'use client';

import { FaGem } from "react-icons/fa";

export default function AuthShell({ title, subtitle, children }) {
    return (
        <div className="w-full">
            <div className="text-center mb-8">
                {/* Mobile-only Logo (since desktop has the sidebar) */}
                <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {title}
                </h2>
                <p className="mt-2 text-sm text-gray-500">
                    {subtitle}
                </p>
            </div>

            {children}
        </div>
    );
}