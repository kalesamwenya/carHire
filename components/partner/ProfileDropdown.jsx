import BaseDropdown from "./BaseDropdown";

export default function ProfileDropdown() {
    const Trigger = (
        <div className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-100">
            <div className="w-8 h-8 bg-slate-200 rounded-full" />
            <FaChevronDown size={10} className="text-gray-400" />
        </div>
    );

    return (
        <BaseDropdown trigger={Trigger}>
            {(close) => (
                <div className="w-56 py-2">
                    <button onClick={close} className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center gap-2">
                        <FaCog /> Settings
                    </button>
                    <button onClick={close} className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2">
                        <FaSignOutAlt /> Sign Out
                    </button>
                </div>
            )}
        </BaseDropdown>
    );
}