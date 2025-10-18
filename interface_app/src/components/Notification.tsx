"use client";

import React, { useEffect, useRef, useState } from "react";
import { Bell, Eye } from "lucide-react";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle notification item click
  const handleNotificationClick = (notificationId?: string) => {
    setIsOpen(false);
    // Add your navigation logic here
    console.log("Clicked notification:", notificationId);
  };

  // Sample notification data
  const notifications = [
    {
      id: "1",
      type: "message",
      avatar: "JL",
      title: "New message from Jese Leos",
      content: "Hey, what's up? All set for the presentation?",
      time: "a few moments ago",
      unread: true,
      bgColor: "bg-blue-500",
    },
    {
      id: "2",
      type: "follow",
      avatar: "JM",
      title: "Joseph Mcfall and 5 others started following you",
      content: "",
      time: "10 minutes ago",
      unread: true,
      bgColor: "bg-gray-500",
    },
    {
      id: "3",
      type: "like",
      avatar: "BG",
      title: "Bonnie Green and 141 others love your story",
      content: "See it and view more stories",
      time: "44 minutes ago",
      unread: true,
      bgColor: "bg-red-500",
    },
    {
      id: "4",
      type: "comment",
      avatar: "LL",
      title: "Leslie Livingston mentioned you in a comment",
      content: "what do you say?",
      time: "1 hour ago",
      unread: false,
      bgColor: "bg-green-500",
    },
    {
      id: "5",
      type: "video",
      avatar: "RB",
      title: "Robert Brown posted a new video",
      content: "Glassmorphism - learn how to implement the new design trend",
      time: "3 hours ago",
      unread: false,
      bgColor: "bg-purple-500",
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={toggleDropdown}
        className="relative inline-flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        type="button"
        title="Notifications"
        // aria-expanded={isOpen}
        // aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-medium rounded-full flex items-center justify-center border-2 border-background">
            {unreadCount > 9 ? "9+" : unreadCount}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-semibold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No notifications yet
                </p>
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id)}
                  className={`w-full flex items-start px-4 py-3 hover:bg-accent transition-colors text-left border-l-4 ${
                    notification.unread
                      ? "border-l-primary bg-accent/50"
                      : "border-l-transparent"
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {notification.avatar}
                      </span>
                    </div>
                    {notification.unread && (
                      <div
                        className={`absolute -top-1 -right-1 w-3 h-3 ${notification.bgColor} border-2 border-background rounded-full`}
                      ></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="ml-3 flex-1 min-w-0">
                    <p
                      className={`text-sm ${
                        notification.unread
                          ? "font-medium text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {notification.title}
                    </p>
                    {notification.content && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {notification.content}
                      </p>
                    )}
                    <p className="text-xs text-primary mt-1">
                      {notification.time}
                    </p>
                  </div>

                  {/* Unread indicator */}
                  {notification.unread && (
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  )}
                </button>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-border">
              <button
                onClick={() => handleNotificationClick("view-all")}
                className="w-full px-4 py-3 text-sm font-medium text-center text-primary hover:bg-accent transition-colors rounded-b-lg flex items-center justify-center"
              >
                <Eye className="w-4 h-4 mr-2" />
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notification;
