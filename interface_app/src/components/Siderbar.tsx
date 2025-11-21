"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  MessageCircle,
  User,
  Bookmark,
  Settings,
  TrendingUp,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Siderbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navigationItems = [
    {
      name: "Trang chủ",
      href: "/",
      icon: Home,
      current: pathname === "/",
    },
    {
      name: "Tìm kiếm",
      href: "/search",
      icon: Search,
      current: pathname === "/search",
    },
    {
      name: "Xu hướng",
      href: "/trending",
      icon: TrendingUp,
      current: pathname === "/trending",
    },
    {
      name: "Tin nhắn",
      href: "/chat",
      icon: MessageCircle,
      current: pathname.startsWith("/chat"),
    },
    {
      name: "Thông báo",
      href: "/notifications",
      icon: Bell,
      current: pathname === "/notifications",
    },
  ];

  const userItems = [
    {
      name: "Hồ sơ",
      href: "/profile",
      icon: User,
      current: pathname === "/profile",
    },
    {
      name: "Đã lưu",
      href: "/bookmarks",
      icon: Bookmark,
      current: pathname === "/bookmarks",
    },
    {
      name: "Bạn bè",
      href: "/friends",
      icon: Users,
      current: pathname === "/friends",
    },
    {
      name: "Cài đặt",
      href: "/settings",
      icon: Settings,
      current: pathname === "/settings",
    },
  ];

  return (
    <aside
      className={cn(
        "sticky top-16 left-0 z-30 bg-card border-r border-border transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className="flex justify-end p-3">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  item.current
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    item.current
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-border" />

          {/* User Section */}
          <div className="space-y-1">
            {!isCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Tài khoản
              </h3>
            )}
            {userItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  item.current
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  isCollapsed && "justify-center px-2"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    item.current
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                />
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-3 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              © 2025 ChimeApp
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Siderbar;
