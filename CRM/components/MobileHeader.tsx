"use client";

import React from "react";
import { Menu, X } from "lucide-react";
import { appConfig } from "@/lib/appConfig";

interface MobileHeaderProps {
  isOpen: boolean;
  onToggle: () => void;
}

/**
 * MobileHeader Component
 * Displays a mobile-friendly header with hamburger menu on small screens
 */
export default function MobileHeader({ isOpen, onToggle }: MobileHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-40 md:hidden">
      {/* Logo/Company Name */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
          <span className="text-sm font-bold text-red-600">V</span>
        </div>
        <div className="flex flex-col">
          <p className="text-xs font-bold text-gray-900">
            {appConfig.companyName}
          </p>
          <p className="text-xs text-gray-500">CRM</p>
        </div>
      </div>

      {/* Hamburger Menu Button */}
      <button
        onClick={onToggle}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-gray-600" />
        ) : (
          <Menu className="w-5 h-5 text-gray-600" />
        )}
      </button>
    </header>
  );
}
