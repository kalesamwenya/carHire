'use client';

import { useState, useEffect, useRef } from 'react';

export default function BaseDropdown({ trigger, children, align = 'right' }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Element */}
            <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
                {trigger}
            </div>

            {/* Dropdown Content */}
            {isOpen && (
                <div className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 z-50 animate-in fade-in zoom-in-95 duration-200`}>
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        {/* We pass a close function to children if they need to close the menu on click */}
                        {typeof children === 'function' ? children(() => setIsOpen(false)) : children}
                    </div>
                </div>
            )}
        </div>
    );
}