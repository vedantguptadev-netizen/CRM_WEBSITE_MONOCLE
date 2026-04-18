import type { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "Canadian Immigration Services — Study, Work & PR Permits",
  description:
    "Comprehensive immigration services including Express Entry, study permits, work permits, family sponsorship, business immigration, and citizenship applications. Licensed RCIC consultants in Calgary and Brandon.",
  openGraph: {
    title: "Our Immigration Services — Monocle Immigration",
    description:
      "From study permits to permanent residence — explore all Canadian immigration pathways with licensed RCIC consultants.",
  },
};

export default function ServicesPage() {
  return <ServicesClient />;
}
