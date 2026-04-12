"use client";

import { AuthProvider } from "@/lib/auth-context";
import ResponsiveLayout from "@/components/ResponsiveLayout";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="flex h-screen flex-col md:flex-row">
        <ResponsiveLayout>{children}</ResponsiveLayout>
      </div>
    </AuthProvider>
  );
}
