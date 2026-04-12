import axios from 'axios';

const BASE_API = process.env.NEXT_PUBLIC_API_URL || "https://api.citydrivehire.com";

export async function fetchChatMessages(senderId, recipientId) {
  const res = await axios.get(`${BASE_API}/messages/chat.php`, {
    params: { sender_id: senderId, recipient_id: recipientId },
  });
  if (res.data.success) return res.data.data;
  return [];
}

export async function sendChatMessage(senderId, recipientId, body) {
  await axios.post(`${BASE_API}/messages/chat.php`, {
    sender_id: senderId,
    recipient_id: recipientId,
    body,
  });
}
