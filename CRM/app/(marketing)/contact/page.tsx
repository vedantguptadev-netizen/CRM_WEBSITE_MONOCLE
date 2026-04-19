import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us — Book a Free Immigration Consultation",
  description:
    "Get in touch with Monocle Immigration. Book a consultation via Calendly, call (403) 991-3189, or visit our offices in Calgary, AB or Brandon, MB.",
  alternates: {
    canonical: "https://monocleimmigration.com/contact",
  },
  openGraph: {
    title: "Contact Monocle Immigration — Calgary & Brandon Offices",
    description:
      "Book your free immigration consultation today. Two convenient office locations across Canada.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What services does Monocle Immigration offer?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Monocle Immigration provides expert consultancy services for individuals and businesses looking to navigate the Canadian immigration system. We assist with work permits, study permits, family sponsorship, Express Entry, provincial nominee programs, and more.",
      },
    },
    {
      "@type": "Question",
      name: "Who is eligible for Canadian immigration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Eligibility depends on the immigration program. Generally, factors such as age, education, work experience, language proficiency, and adaptability are considered. We assess your unique profile to determine the best pathway for you.",
      },
    },
    {
      "@type": "Question",
      name: "What is Express Entry, and how does it work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Express Entry is a points-based immigration system used to manage applications for three federal economic programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. Candidates are ranked based on a Comprehensive Ranking System (CRS) score.",
      },
    },
    {
      "@type": "Question",
      name: "How long does the immigration process take?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Processing times vary depending on the program and individual circumstances. For example, Express Entry applications are typically processed within six months, while family sponsorship may take longer. We provide estimated timelines during your consultation.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need a job offer to immigrate to Canada?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Not always. While a valid job offer can boost your application, many immigration pathways, such as Express Entry and certain provincial nominee programs, do not require one. We'll help you identify the best option for your situation.",
      },
    },
    {
      "@type": "Question",
      name: "Can Monocle Immigration help with study permits?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes! We assist students with the entire process, from selecting a Designated Learning Institution (DLI) to preparing and submitting study permit applications. We also help with post-graduation work permits (PGWP).",
      },
    },
    {
      "@type": "Question",
      name: "Is Monocle Immigration a licensed consultancy?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes, Monocle Immigration is operated by licensed Regulated Canadian Immigration Consultants (RCICs) who are members of the College of Immigration and Citizenship Consultants (CICC). Your case is handled by qualified professionals.",
      },
    },
    {
      "@type": "Question",
      name: "How do I get started with Monocle Immigration?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Getting started is easy! Simply book a consultation through our website or contact us via phone or email. We'll schedule a meeting to discuss your goals and create a personalized immigration plan.",
      },
    },
  ],
};

export default function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ContactClient />
    </>
  );
}
