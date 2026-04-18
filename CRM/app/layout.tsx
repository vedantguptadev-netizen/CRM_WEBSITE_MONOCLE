import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://monocleimmigration.com"),
  title: {
    template: "%s | Monocle Immigration",
    default:
      "Monocle Immigration — Licensed Immigration Consultants in Calgary & Brandon",
  },
  description:
    "Licensed RCIC immigration consultants helping you study, work, and settle in Canada. Offices in Calgary, AB and Brandon, MB. Book a free consultation today.",
  openGraph: {
    type: "website",
    locale: "en_CA",
    siteName: "Monocle Immigration",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
