'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaTimes } from 'react-icons/fa';

export default function Toast({ message, type = 'success', onClose }) {
    const iconMap = {
        success: <FaCheckCircle className="text-green-500" />,
        error: <FaExclamationCircle className="text-red-500" />,
        info: <FaInfoCircle className="text-blue-500" />,
    };

    const colors = {
        success: 'border-green-100 bg-green-50 text-green-800',
        error: 'border-red-100 bg-red-50 text-red-800',
        info: 'border-blue-100 bg-blue-50 text-blue-800',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-[300] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${colors[type]} min-w-[300px]`}
        >
            <span className="text-xl">{iconMap[type]}</span>
            <p className="flex-1 font-bold text-sm">{message}</p>
            <button onClick={onClose} className="hover:opacity-70 transition-opacity">
                <FaTimes size={14} />
            </button>
        </motion.div>
    );
}