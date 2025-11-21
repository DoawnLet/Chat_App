"use client";

import React from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  title: string;
  type: "direct" | "group";
  lastMessage?: string;
  lastMessageAt?: string;
}

interface ChatListProps {
  conversations: Conversation[];
}

export function ChatList({ conversations }: ChatListProps) {
  return (
    <div className="overflow-y-auto">
      {conversations.map((conv) => (
        <Link
          key={conv.id}
          href={`/chat/${conv.id}`}
          className="block p-4 hover:bg-gray-100 border-b border-gray-200"
        >
          <div className="font-semibold">{conv.title}</div>
          <div className="text-sm text-gray-600 truncate">
            {conv.lastMessage}
          </div>
          <div className="text-xs text-gray-500">
            {conv.lastMessageAt
              ? new Date(conv.lastMessageAt).toLocaleString("vi-VN")
              : ""}
          </div>
        </Link>
      ))}
    </div>
  );
}
