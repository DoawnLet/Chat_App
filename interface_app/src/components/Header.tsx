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
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between max-w-full">
            {/* Left Side - Logo and Search */}
            <div className="flex items-center space-x-6">
              {/* Logo */}
              <Link
                href="/"
                className="flex items-center space-x-2 transition-colors hover:text-primary"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                  C
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent hidden sm:block">
                  ChimeApp
                </span>
              </Link>

              {/* Search - Desktop */}
              <div className="hidden sm:block">
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
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="hidden lg:block">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Notification */}
              <Notification />

              {/* User Menu */}
              <DropMenu />

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileMenu}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border mt-4">
              <div className="space-y-1 py-4">
                {/* Mobile Search */}
                <div className="px-3 pb-3 sm:hidden">
                  <TaskSearch />
                </div>

                {navigationItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-3 rounded-lg transition-colors",
                      item.current
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
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
