import { Header } from "@/components/marketing/Header";
import { Footer } from "@/components/marketing/Footer";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://monocleimmigration.com",
  name: "Monocle Immigration",
  description:
    "Licensed RCIC immigration consultants helping individuals and families study, work, and settle in Canada.",
  url: "https://monocleimmigration.com",
  telephone: "+14039913189",
  email: "info@monocleimmigration.com",
  image: "https://monocleimmigration.com/Monocle_immigration_logo.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "421 7 Ave SW 30th FL",
    addressLocality: "Calgary",
    addressRegion: "AB",
    postalCode: "T2P 4K9",
    addressCountry: "CA",
  },
  location: [
    {
      "@type": "Place",
      name: "Monocle Immigration — Calgary Office",
      address: {
        "@type": "PostalAddress",
        streetAddress: "421 7 Ave SW 30th FL",
        addressLocality: "Calgary",
        addressRegion: "AB",
        postalCode: "T2P 4K9",
        addressCountry: "CA",
      },
    },
    {
      "@type": "Place",
      name: "Monocle Immigration — Brandon Office",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Unit 205 244-10th Street",
        addressLocality: "Brandon",
        addressRegion: "MB",
        postalCode: "R7A 4E8",
        addressCountry: "CA",
      },
    },
  ],
  areaServed: [
    { "@type": "City", name: "Calgary" },
    { "@type": "City", name: "Brandon" },
    { "@type": "AdministrativeArea", name: "Alberta" },
    { "@type": "AdministrativeArea", name: "Manitoba" },
    { "@type": "Country", name: "Canada" },
  ],
  openingHoursSpecification: {
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "09:00",
    closes: "17:00",
  },
  sameAs: [
    "https://www.linkedin.com/company/monocleimmigration/",
    "https://www.instagram.com/monocle.img/",
    "https://www.facebook.com/profile.php?id=61567351096994",
    "https://x.com/monocle_imm",
  ],
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
