'use client';

import { useState } from 'react';
import { FaPaperPlane, FaSearch, FaCircle } from 'react-icons/fa';

// Mock Conversations
const conversations = [
    { id: 1, user: 'Alice Walker', lastMsg: 'Is the car available for extension?', time: '10:45 AM', active: true, unread: 2 },
    { id: 2, user: 'Bob Builder', lastMsg: 'Thanks for the service!', time: 'Yesterday', active: false, unread: 0 },
    { id: 3, user: 'Sarah Connor', lastMsg: 'I need to change my pickup location.', time: 'Yesterday', active: false, unread: 0 },
];

export default function MessagesPage() {
    const [selectedChat, setSelectedChat] = useState(conversations[0]);

    return (
        <div className="h-[calc(100vh-8rem)] bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row">

            {/* SIDEBAR: CONVERSATION LIST */}
            <div className="w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/50">
                <div className="p-4 border-b border-gray-100">
                    <h2 className="font-bold text-gray-800 mb-2">Messages</h2>
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-gray-400 text-xs" />
                        <input type="text" placeholder="Search..." className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs outline-none focus:border-green-500" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {conversations.map((chat) => (
                        <div
                            key={chat.id}
                            onClick={() => setSelectedChat(chat)}
                            className={`p-4 cursor-pointer hover:bg-white transition-colors border-b border-gray-100/50 ${selectedChat.id === chat.id ? 'bg-white border-l-4 border-l-green-600 shadow-sm' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className="font-bold text-sm text-gray-800">{chat.user}</span>
                                <span className="text-[10px] text-gray-400">{chat.time}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-500 truncate w-4/5">{chat.lastMsg}</p>
                                {chat.unread > 0 && (
                                    <span className="bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{chat.unread}</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MAIN: CHAT AREA */}
            <div className="flex-1 flex flex-col">

                {/* Chat Header */}
                <div className="h-16 border-b border-gray-100 flex items-center justify-between px-6 bg-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
                            {selectedChat.user.charAt(0)}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{selectedChat.user}</h3>
                            <p className="text-xs text-green-600 flex items-center gap-1">
                                <FaCircle className="text-[6px]" /> Online
                            </p>
                        </div>
                    </div>
                    <button className="text-xs text-gray-400 hover:text-gray-600 border px-3 py-1 rounded">View Profile</button>
                </div>

                {/* Chat History */}
                <div className="flex-1 p-6 overflow-y-auto bg-gray-50 space-y-4">
                    {/* Message from User */}
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm max-w-sm text-sm">
                            Hello, I would like to extend my rental by 2 days. Is that possible?
                        </div>
                    </div>

                    {/* Message from Admin (You) */}
                    <div className="flex justify-end">
                        <div className="bg-slate-900 text-white py-2 px-4 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-sm max-w-sm text-sm">
                            Hi Alice! Yes, the vehicle is available. The extra cost will be $120. Should I proceed?
                        </div>
                    </div>

                    {/* Message from User */}
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-tl-xl rounded-tr-xl rounded-br-xl shadow-sm max-w-sm text-sm">
                            Yes please. Charge it to my card on file.
                        </div>
                    </div>
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type your message..."
                            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                        <button className="bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition-colors">
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}