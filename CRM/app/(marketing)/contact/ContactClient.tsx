"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";

const branches = [
  {
    name: "Calgary Office",
    addressLines: [
      "Core Shopping Centre, SW",
      "421 7 Ave SW 30th FL",
      "Calgary, AB T2P 4K9",
    ],
    hours: ["Monday – Friday: 9:00 AM – 5:00 PM", "Saturday – Sunday: Closed"],
    mapsUrl: "https://maps.app.goo.gl/MSAKnSFqWpSakWQE7",
  },
  {
    name: "Brandon Office",
    addressLines: ["Unit 205 244-10th Street", "Brandon, MB R7A 4E8"],
    hours: ["Monday – Friday: 9:00 AM – 5:00 PM", "Saturday – Sunday: Closed"],
    mapsUrl:
      "https://maps.google.com/?q=Unit+205+244-10th+Street+Brandon+MB+R7A+4E8",
  },
];

const faqs = [
  {
    q: "What services does Monocle Immigration offer?",
    a: "Monocle Immigration provides expert consultancy services for individuals and businesses looking to navigate the Canadian immigration system. We assist with work permits, study permits, family sponsorship, Express Entry, provincial nominee programs, and more.",
  },
  {
    q: "Who is eligible for Canadian immigration?",
    a: "Eligibility depends on the immigration program. Generally, factors such as age, education, work experience, language proficiency, and adaptability are considered. We assess your unique profile to determine the best pathway for you.",
  },
  {
    q: "What is Express Entry, and how does it work?",
    a: "Express Entry is a points-based immigration system used to manage applications for three federal economic programs: the Federal Skilled Worker Program, the Federal Skilled Trades Program, and the Canadian Experience Class. Candidates are ranked based on a Comprehensive Ranking System (CRS) score.",
  },
  {
    q: "How long does the immigration process take?",
    a: "Processing times vary depending on the program and individual circumstances. For example, Express Entry applications are typically processed within six months, while family sponsorship may take longer. We provide estimated timelines during your consultation.",
  },
  {
    q: "Do I need a job offer to immigrate to Canada?",
    a: "Not always. While a valid job offer can boost your application, many immigration pathways, such as Express Entry and certain provincial nominee programs, do not require one. We\u2019ll help you identify the best option for your situation.",
  },
  {
    q: "Can Monocle Immigration help with study permits?",
    a: "Yes! We assist students with the entire process, from selecting a Designated Learning Institution (DLI) to preparing and submitting study permit applications. We also help with post-graduation work permits (PGWP).",
  },
  {
    q: "What is the Provincial Nominee Program (PNP)?",
    a: "PNP allows Canadian provinces and territories to nominate individuals who wish to settle in a specific province. Each province has its own criteria and streams, and a nomination can significantly boost your CRS score for Express Entry.",
  },
  {
    q: "How much does it cost to use your services?",
    a: "Costs vary based on the complexity of your case and the services required. We offer transparent pricing and will provide a detailed breakdown during your consultation. Government filing fees are separate and determined by IRCC.",
  },
  {
    q: "Can you help if my application was previously refused?",
    a: "Absolutely. We specialize in reviewing refused applications, identifying the reasons for refusal, and crafting a strong resubmission strategy. Our goal is to address all concerns raised by IRCC.",
  },
  {
    q: "What documents are typically required for an immigration application?",
    a: "Common documents include a valid passport, language test results (e.g., IELTS or TEF), educational credential assessments (ECA), proof of work experience, police clearance certificates, and medical exam results. Specific requirements vary by program.",
  },
  {
    q: "Is Monocle Immigration a licensed consultancy?",
    a: "Yes, Monocle Immigration is operated by licensed Regulated Canadian Immigration Consultants (RCICs) who are members of the College of Immigration and Citizenship Consultants (CICC). Your case is handled by qualified professionals.",
  },
  {
    q: "Can I immigrate to Canada as a business owner or entrepreneur?",
    a: "Yes, Canada offers programs such as the Start-Up Visa Program and various provincial entrepreneur streams. We evaluate your business background and help you find the right program to establish or expand your business in Canada.",
  },
  {
    q: "What happens during the initial consultation?",
    a: "During the consultation, we review your personal and professional background, discuss your immigration goals, assess your eligibility, and recommend the most suitable immigration pathway. You\u2019ll also receive a clear outline of the next steps.",
  },
  {
    q: "Can Monocle Immigration assist with family sponsorship?",
    a: "Yes, we help Canadian citizens and permanent residents sponsor their spouses, common-law partners, dependent children, parents, and grandparents. We guide you through every step of the sponsorship process.",
  },
  {
    q: "How do I get started with Monocle Immigration?",
    a: "Getting started is easy! Simply book a consultation through our website or contact us via phone or email. We\u2019ll schedule a meeting to discuss your goals and create a personalized immigration plan.",
  },
  {
    q: "Do you offer virtual consultations?",
    a: "Yes, we offer virtual consultations via video call or phone for clients who cannot visit our offices in person. Our goal is to make the immigration process accessible no matter where you are.",
  },
];

export default function Contact() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);

  const visibleFaqs = showAllFaqs ? faqs : faqs.slice(0, 6);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              Contact Us
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Let&apos;s Start Your Journey
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Get in touch with Monocle Immigration for a consultation. Our
              licensed immigration consultants are ready to help you achieve
              your Canadian immigration goals.
            </p>
          </div>
        </div>
      </section>

      {/* Book Consultation & Contact Info */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
            {/* Booking Card */}
            <div className="lg:col-span-2">
              <Card className="border border-gray-100 shadow-md">
                <CardContent className="p-8 lg:p-10">
                  <div className="mb-6">
                    <h2 className="mb-2 text-2xl font-bold text-gray-900">
                      Book Your Consultation
                    </h2>
                    <p className="text-gray-600">
                      Schedule a consultation with one of our licensed
                      immigration consultants. We&apos;ll assess your
                      eligibility and discuss the best pathway for you.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="rounded-lg border border-red-100 bg-red-50/50 p-6 text-center">
                      <Calendar className="mx-auto mb-3 h-10 w-10 text-red-600" />
                      <h3 className="mb-2 text-lg font-semibold text-gray-900">
                        Schedule Online
                      </h3>
                      <p className="mb-4 text-sm text-gray-600">
                        Pick a time that works for you — in-person or virtual.
                      </p>
                      <Button
                        asChild
                        size="lg"
                        className="bg-red-600 text-white hover:bg-red-700"
                      >
                        <a
                          href="https://calendly.com/monocle_immigration"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Book on Calendly
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <a
                        href="tel:+14039913189"
                        className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                          <Phone className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Call Us
                          </p>
                          <p className="text-sm text-gray-600">
                            (403) 991-3189
                          </p>
                        </div>
                      </a>
                      <a
                        href="mailto:info@monocleimmigration.com"
                        className="flex items-center gap-3 rounded-lg border border-gray-100 p-4 transition-shadow hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                          <Mail className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            Email Us
                          </p>
                          <p className="text-sm text-gray-600">
                            info@monocleimmigration.com
                          </p>
                        </div>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div>
              <Card className="border border-gray-100 shadow-sm">
                <CardContent className="p-6 sm:p-8">
                  <h3 className="mb-6 text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>

                  <div className="space-y-5">
                    <a
                      href="tel:+14039913189"
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                        <Phone className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Phone
                        </p>
                        <p className="text-sm text-gray-900 group-hover:text-red-600">
                          (403) 991-3189
                        </p>
                      </div>
                    </a>

                    <a
                      href="mailto:info@monocleimmigration.com"
                      className="flex items-center gap-3 group"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                        <Mail className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Email
                        </p>
                        <p className="text-sm text-gray-900 group-hover:text-red-600">
                          info@monocleimmigration.com
                        </p>
                      </div>
                    </a>

                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                        <Clock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500">
                          Business Hours
                        </p>
                        <p className="text-sm text-gray-900">
                          Mon – Fri: 9:00 AM – 5:00 PM
                        </p>
                        <p className="text-sm text-gray-500">
                          Sat – Sun: Closed
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-gray-100 pt-5">
                      <p className="mb-3 text-xs font-medium text-gray-500">
                        Follow Us
                      </p>
                      <div className="flex items-center gap-3">
                        <a
                          href="https://www.linkedin.com/company/monocleimmigration/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a
                          href="https://x.com/monocle_imm"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Twitter / X"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                          </svg>
                        </a>
                        <a
                          href="https://www.instagram.com/monocle.img/"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                          </svg>
                        </a>
                        <a
                          href="https://www.facebook.com/profile.php?id=61567351096994"
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Facebook"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              Our Offices
            </Badge>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">Visit Us</h2>
            <p className="text-gray-600">
              Two convenient locations to serve you across Canada.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {branches.map((branch) => (
              <Card
                key={branch.name}
                className="border border-gray-100 shadow-md"
              >
                <CardContent className="p-6 sm:p-8">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">
                    {branch.name}
                  </h3>
                  <div className="mb-4 space-y-1">
                    {branch.addressLines.map((line, i) => (
                      <p key={i} className="text-sm text-gray-600">
                        {line}
                      </p>
                    ))}
                  </div>
                  <div className="mb-5 space-y-1">
                    {branch.hours.map((h, i) => (
                      <p key={i} className="text-sm text-gray-500">
                        <Clock className="mr-1.5 inline h-3.5 w-3.5" />
                        {h}
                      </p>
                    ))}
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-700 hover:bg-red-50"
                  >
                    <a
                      href={branch.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Get Directions
                      <ExternalLink className="ml-2 h-3.5 w-3.5" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="scroll-mt-24 bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              FAQ
            </Badge>
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {visibleFaqs.map((faq, index) => (
              <Card key={index} className="border border-gray-100 shadow-sm">
                <CardContent className="p-0">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <h3 className="pr-4 font-semibold text-gray-900">
                      {faq.q}
                    </h3>
                    <span className="shrink-0 text-xl text-gray-400">
                      {openFaq === index ? "\u2212" : "+"}
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="border-t border-gray-100 px-6 pb-6 pt-4">
                      <p className="text-sm leading-relaxed text-gray-600">
                        {faq.a}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {faqs.length > 6 && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={() => {
                  setShowAllFaqs(!showAllFaqs);
                  if (showAllFaqs) setOpenFaq(null);
                }}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                {showAllFaqs
                  ? "Show Less Questions"
                  : `Show More Questions (${faqs.length - 6})`}
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
