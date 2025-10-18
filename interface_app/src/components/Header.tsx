"use client";

import React from "react";
import DropMenu from "./DropMenu";
import TaskSearch from "./Search";
import Link from "next/link";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import Notification from "./Notification";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

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
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  ChimeApp
                </span>
              </Link>

              {/* Search - Desktop */}
              <div className="hidden sm:block">
                <TaskSearch />
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary text-primary"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                About
              </Link>
              <Link
                href="/services"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Services
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                Contact
              </Link>
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
            <div className="md:hidden">
              <div className="space-y-1 pb-4 pt-2">
                {/* Mobile Search */}
                <div className="px-3 pb-3 sm:hidden">
                  <TaskSearch />
                </div>

                <Link
                  href="/"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-primary rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/services"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Services
                </Link>
                <Link
                  href="/pricing"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Pricing
                </Link>
                <Link
                  href="/contact"
                  className="block px-3 py-2 text-sm font-medium transition-colors hover:text-primary text-muted-foreground rounded-md hover:bg-accent"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Header;
