import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
