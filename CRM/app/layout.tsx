import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://monocleimmigration.com"),
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
  },
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
    images: [
      {
        url: "/Monocle_immigration_logo.png",
        width: 1200,
        height: 630,
        alt: "Monocle Immigration — Licensed RCIC Consultants",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/Monocle_immigration_logo.png"],
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
