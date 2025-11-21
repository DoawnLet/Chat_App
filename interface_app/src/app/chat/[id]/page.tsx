"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export default function ChatRoomPage() {
  const params = useParams();
  const conversationId = params.id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // TODO: Fetch messages for this conversation
    // Mock data
    setMessages([
      {
        id: "1",
        sender: "User A",
        content: "Hello!",
        timestamp: "2025-11-19T10:00:00Z",
      },
      {
        id: "2",
        sender: "You",
        content: "Hi there!",
        timestamp: "2025-11-19T10:01:00Z",
      },
    ]);
  }, [conversationId]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // TODO: Send message via API
    const message: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Chat header */}
      <div className="p-4 border-b border-gray-300 bg-white">
        <h2 className="text-lg font-semibold">Đối thoại {conversationId}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg ${
                msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <div className="text-sm">{msg.content}</div>
              <div className="text-xs opacity-75 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString("vi-VN")}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="p-4 border-t border-gray-300 bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder="Nhập tin nhắn..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
