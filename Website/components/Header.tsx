"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/contact#faq" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/Monocle_immigration_logo.png"
              alt="Monocle Immigration"
              width={128}
              height={128}
              className="h-32 w-32 rounded-lg object-contain"
            />
            <span className="text-xl font-semibold text-gray-900">
              Monocle Immigration
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex md:items-center md:gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-red-600 ${
                  pathname === link.path ||
                  (link.path === "/contact#faq" && pathname === "/contact")
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex md:items-center">
            <Button
              asChild
              size="sm"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <a
                href="https://calendly.com/monocle_immigration"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Consultation
              </a>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-200 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 hover:text-red-600 ${
                    pathname === link.path ||
                    (link.path === "/contact#faq" && pathname === "/contact")
                      ? "bg-red-50 text-red-600"
                      : "text-gray-700"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Button
                asChild
                className="w-full bg-red-600 text-white hover:bg-red-700"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                <a
                  href="https://calendly.com/monocle_immigration"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book Consultation
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
