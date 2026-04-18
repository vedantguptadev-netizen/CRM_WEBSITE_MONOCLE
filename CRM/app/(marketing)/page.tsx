import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Immigration Consultant in Calgary & Brandon — Free Consultation",
  description:
    "Monocle Immigration is a licensed RCIC firm helping clients with Express Entry, study permits, work permits, family sponsorship, and PR applications. Offices in Calgary and Brandon.",
  openGraph: {
    title: "Monocle Immigration — Your Trusted Path to Canadian Immigration",
    description:
      "Expert guidance from licensed immigration consultants. 98% success rate. Book your free consultation today.",
  },
};

export default function HomePage() {
  return <HomeClient />;
}
