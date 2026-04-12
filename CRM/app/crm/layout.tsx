import type { Metadata } from "next";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Immigration CRM",
  description: "CRM Dashboard for Immigration Services",
};

export default function CRMLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <ClientLayout>{children}</ClientLayout>
    </div>
  );
}
