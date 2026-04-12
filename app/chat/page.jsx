
"use client";
import dynamic from "next/dynamic";
const AdminPartnerChat = dynamic(() => import("@/components/ui/AdminPartnerChat"), { ssr: false });
import { fetchChatMessages, sendChatMessage } from '@/lib/chat';
import { useState } from 'react';

export default function ChatPage(props) {
  // Fallback demo users if not provided
  const user = props.user || { id: 1, name: 'Admin Demo', role: 'admin' };
  const recipient = props.recipient || { id: 2, name: 'Partner Demo', role: 'partner' };
  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Direct Chat</h1>
      <AdminPartnerChat
        user={user}
        recipient={recipient}
        fetchMessages={fetchChatMessages}
        sendMessage={sendChatMessage}
      />
    </div>
  );
}
