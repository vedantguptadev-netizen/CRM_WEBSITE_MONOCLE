import React from "react";
import Image from "next/image";
import { appConfig } from "@/lib/appConfig";

/**
 * SidebarHeader Component
 * Displays the app logo, company name, and subtitle in a modern SaaS style
 */
export default function SidebarHeader() {
  return (
    <div className="px-6 py-6 border-b border-gray-200 space-y-4">
      {/* Logo and Company Name Container */}
      <div className="flex items-center gap-3">
        {/* Logo */}
        <Image
          src="/images/logo.png"
          alt={appConfig.companyName}
          width={36}
          height={36}
          priority
          className="h-9 w-9 rounded-full object-contain"
        />

        {/* Company Name + Subtitle */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-gray-900 leading-tight truncate">
            {appConfig.companyName}
          </h2>
          <p className="text-xs font-medium text-gray-500 mt-0.5">
            CRM Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
