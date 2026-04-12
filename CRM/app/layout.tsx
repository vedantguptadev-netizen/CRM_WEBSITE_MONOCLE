import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Immigration CRM",
  description: "CRM Dashboard for Immigration Services",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
