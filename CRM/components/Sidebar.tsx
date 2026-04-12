"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Briefcase, LogOut } from "lucide-react";
import SidebarHeader from "@/components/SidebarHeader";
import { appConfig } from "@/lib/appConfig";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/crm/dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    activeIcon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    label: "Enquiries",
    href: "/crm/enquiries",
    icon: <FileText className="w-5 h-5" />,
    activeIcon: <FileText className="w-5 h-5" />,
  },
  {
    label: "Applications",
    href: "/crm/applications",
    icon: <Briefcase className="w-5 h-5" />,
    activeIcon: <Briefcase className="w-5 h-5" />,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isActive = (href: string) => {
    if (href === "/crm/dashboard") return pathname === "/crm/dashboard";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await logout();
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-200 flex flex-col">
      {/* Sidebar Header */}
      <SidebarHeader />

      {/* Navigation Items */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 relative ${
                    active
                      ? "bg-red-50 text-red-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${active ? "before:absolute before:left-0 before:top-1 before:bottom-1 before:w-[3px] before:bg-red-600 before:rounded-r-full" : ""}`}
                >
                  <span
                    className={`flex-shrink-0 transition-colors duration-200 ${
                      active
                        ? "text-red-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  >
                    {active ? item.activeIcon : item.icon}
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Section */}
      <div className="mt-auto border-t border-gray-100">
        {/* Logout Button */}
        <div className="px-3 py-4">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-200 text-sm font-medium"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-200" />
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>

        {/* Company Info */}
        <div className="px-4 pb-4">
          <div className="rounded-lg bg-gray-50 px-3 py-2.5 text-center">
            <p className="text-xs text-gray-500 font-medium">
              {appConfig.companyName} CRM
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5">
              v{appConfig.version}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
