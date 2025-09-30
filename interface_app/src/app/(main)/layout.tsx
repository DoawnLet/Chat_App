import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Siderbar from "@/components/Siderbar";
import React from "react";

const MainLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
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
    </>
  );
};

export default MainLayout;
