import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

import Siderbar from "@/components/Siderbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chat App",
  description: "Create by @MinMin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Header - Full width at top */}
        <Header />

        {/* Main container with sidebar and content */}
        <div className="flex">
          {/* Sidebar - Between header and footer */}
          <Siderbar />

          {/* Main content area */}
          <main className="flex-1 min-h-[calc(100vh-8rem)]">
            <div className="p-4 md:p-6 lg:p-8">{children}</div>
          </main>
        </div>

        {/* Footer - Full width at bottom */}
        <Footer />
      </body>
    </html>
  );
}
