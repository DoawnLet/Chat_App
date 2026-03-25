"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X, Home, Search, MessageCircle, Bell } from "lucide-react";
import TaskSearch from "./Search";
import DropMenu from "./DropMenu";
import Notification from "./Notification";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  const navigationItems = [
    { name: "Trang chủ", href: "/", icon: Home, current: pathname === "/" },
    {
      name: "Tìm kiếm",
      href: "/search",
      icon: Search,
      current: pathname === "/search",
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="w-full px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between max-w-full">
            {/* Left Side - Logo and Search */}
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 transition-colors hover:text-primary"
              >
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-xs sm:text-sm">
                  C
                </div>
                <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
                  ChimeApp
                </span>
              </Link>

              {/* Search - Desktop */}
              <div className="hidden lg:block">
                <TaskSearch />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4 sm:w-4 sm:h-4" />
                  <span className="hidden xl:block">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
              {/* Notification */}
              <Notification />

              {/* User Menu */}
              <DropMenu />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 sm:h-9 sm:w-9"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border mt-3 sm:mt-4">
              <div className="space-y-1 py-3 sm:py-4">
                {/* Mobile Search */}
                <div className="px-3 pb-3 lg:hidden">
                  <TaskSearch />
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-lg transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium text-sm sm:text-base">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
