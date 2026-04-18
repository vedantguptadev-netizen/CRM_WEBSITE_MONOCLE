import type { Metadata } from "next";
import AboutClient from "./AboutClient";

export const metadata: Metadata = {
  title: "About Us — Licensed RCIC Immigration Consultant",
  description:
    "Learn about Monocle Immigration, led by Rupinder Bhatti (RCIC). 15+ years of experience, 98% success rate, serving clients from 50+ countries. Offices in Calgary, AB and Brandon, MB.",
  alternates: {
    canonical: "https://monocleimmigration.com/about",
  },
  openGraph: {
    title: "About Monocle Immigration — Licensed & Regulated Professionals",
    description:
      "Meet our team of licensed RCIC immigration consultants with 15+ years of experience and a 98% success rate.",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
