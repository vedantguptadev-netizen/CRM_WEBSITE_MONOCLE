"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "@/components/MobileHeader";
import MobileSidebar from "@/components/MobileSidebar";

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

/**
 * ResponsiveLayout Component
 * Manages the layout for desktop, tablet, and mobile screens
 * - Desktop (md and up): Fixed left sidebar + main content
 * - Mobile (below md): Top header with hamburger menu + slide-in sidebar drawer
 */
export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLoginPage = pathname === "/crm/login";

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile and login page */}
      {!isLoginPage && (
        <div className="hidden md:block">
          <Sidebar />
        </div>
      )}

      {/* Mobile Header - Hidden on desktop and login page */}
      {!isLoginPage && (
        <MobileHeader isOpen={mobileMenuOpen} onToggle={toggleMobileMenu} />
      )}

      {/* Mobile Sidebar - Hidden on desktop and login page */}
      {!isLoginPage && (
        <MobileSidebar isOpen={mobileMenuOpen} onClose={closeMobileMenu} />
      )}

      {/* Main Content Area */}
      <main
        className={`flex-1 overflow-auto bg-gray-50 transition-all duration-300 ${
          // Desktop: margin-left for fixed sidebar (only if not login page)
          !isLoginPage ? "md:ml-60" : ""
        } ${
          // Mobile: top padding for header (only if not login page)
          !isLoginPage ? "pt-16 md:pt-0" : ""
        }`}
      >
        {/* Content Wrapper with Responsive Padding */}
        <div className={`${isLoginPage ? "" : "p-6 sm:p-8 md:p-12"}`}>
          {children}
        </div>
      </main>
    </>
  );
}
