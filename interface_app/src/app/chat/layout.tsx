"use client";

import React, { useEffect, useState } from "react";
import { ChatList } from "@/components/chat/ChatList";

interface Conversation {
  id: string;
  title: string;
  type: "direct" | "group";
  lastMessage?: string;
  lastMessageAt?: string;
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    // TODO: Fetch conversations from API
    setConversations([
      {
        id: "1",
        title: "Chat với User A",
        type: "direct",
        lastMessage: "Hello!",
        lastMessageAt: "2025-11-19T10:00:00Z",
      },
      {
        id: "2",
        title: "Nhóm ABC",
        type: "group",
        lastMessage: "Meeting tomorrow",
        lastMessageAt: "2025-11-19T09:30:00Z",
      },
    ]);
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for chat list */}
      <div className="w-1/4 bg-white border-r border-gray-300">
        <div className="p-4 border-b border-gray-300">
          <h2 className="text-lg font-semibold">Đối thoại</h2>
        </div>
        <ChatList conversations={conversations} />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
