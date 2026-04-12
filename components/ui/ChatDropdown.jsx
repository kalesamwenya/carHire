import { FaComments } from "react-icons/fa";
import Link from "next/link";

export default function ChatDropdown({ unreadCount = 0 }) {
  return (
    <div className="relative group">
      <Link href="/chat" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 transition-all">
        <FaComments className="text-green-600 text-xl" />
        <span className="hidden md:inline font-semibold text-green-700">Chat</span>
        {unreadCount > 0 && (
          <span className="ml-1 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold animate-bounce">
            {unreadCount}
          </span>
        )}
      </Link>
    </div>
  );
}
