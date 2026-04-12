"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Home,
  Heart,
  Users,
  Building2,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: GraduationCap,
      category: "Education",
      title: "Study Permits & Student Visas",
      description:
        "Complete support for international students seeking to study in Canada, from application to arrival.",
      services: [
        "Study permit applications",
        "University admission assistance",
        "Student Direct Stream (SDS)",
        "Post-graduation work permits",
        "Study permit extensions",
        "Co-op work permits",
      ],
      ideal:
        "International students, education consultants, university applicants",
    },
    {
      icon: Briefcase,
      category: "Employment",
      title: "Work Permits & Employment",
      description:
        "Navigate the Canadian work permit system with expert guidance for temporary and permanent employment.",
      services: [
        "Employer-specific work permits",
        "Open work permits",
        "LMIA applications & support",
        "Intra-company transfers",
        "NAFTA work permits",
        "International Experience Canada (IEC)",
      ],
      ideal: "Skilled workers, employers, international professionals",
    },
    {
      icon: Home,
      category: "Permanent Residence",
      title: "Permanent Residence Programs",
      description:
        "Achieve your goal of Canadian permanent residency through multiple immigration pathways.",
      services: [
        "Express Entry (FSW, CEC, FST)",
        "Provincial Nominee Programs (PNP)",
        "Atlantic Immigration Program",
        "Rural and Northern Immigration Pilot",
        "Canadian Experience Class",
        "Federal Skilled Worker Program",
      ],
      ideal: "Skilled workers, experienced professionals, regional candidates",
    },
    {
      icon: Heart,
      category: "Family",
      title: "Family Sponsorship",
      description:
        "Reunite with your loved ones through Canadian family sponsorship immigration programs.",
      services: [
        "Spousal & common-law sponsorship",
        "Dependent children sponsorship",
        "Parent & grandparent sponsorship",
        "Super visa applications",
        "Adoption cases",
        "Family class applications",
      ],
      ideal: "Canadian citizens, permanent residents, families",
    },
    {
      icon: Building2,
      category: "Business",
      title: "Business & Investor Immigration",
      description:
        "Immigration solutions for entrepreneurs and investors looking to establish or expand in Canada.",
      services: [
        "Start-up Visa Program",
        "Self-Employed Persons Program",
        "Provincial business programs",
        "Entrepreneur streams",
        "Work permit to PR pathways",
        "Business succession planning",
      ],
      ideal: "Entrepreneurs, investors, business owners",
    },
    {
      icon: Users,
      category: "Corporate",
      title: "Corporate Immigration Services",
      description:
        "Comprehensive immigration solutions for businesses bringing international talent to Canada.",
      services: [
        "Global Talent Stream",
        "LMIA consultation & strategy",
        "Compliance & documentation",
        "Employee relocation support",
        "Immigration policy development",
        "Work permit renewals",
      ],
      ideal: "Employers, HR departments, corporations",
    },
    {
      icon: FileText,
      category: "Additional Services",
      title: "Citizenship & Other Services",
      description:
        "Additional immigration services including citizenship applications and visitor extensions.",
      services: [
        "Citizenship applications",
        "Visitor visa extensions",
        "Temporary resident permits",
        "Restoration of status",
        "Immigration appeals",
        "Document preparation & review",
      ],
      ideal: "Permanent residents, visitors, all applicants",
    },
  ];

  const process = [
    {
      step: "01",
      title: "Initial Consultation",
      description:
        "Free assessment of your immigration goals and eligibility for various programs.",
    },
    {
      step: "02",
      title: "Strategy Development",
      description:
        "Personalized immigration plan tailored to your unique situation and timeline.",
    },
    {
      step: "03",
      title: "Application Preparation",
      description:
        "Comprehensive document collection, review, and application preparation.",
    },
    {
      step: "04",
      title: "Submission & Follow-up",
      description:
        "Application submission and ongoing communication with immigration authorities.",
    },
    {
      step: "05",
      title: "Success & Settlement",
      description:
        "Post-approval support and guidance for your successful settlement in Canada.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              Our Services
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Comprehensive Immigration Solutions
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Expert guidance across all Canadian immigration pathways. From
              study permits to permanent residence, we're here to help you
              succeed.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:gap-10">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="overflow-hidden border border-gray-100 shadow-md transition-shadow hover:shadow-lg"
                >
                  <div className="grid lg:grid-cols-3">
                    <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 text-white lg:p-10">
                      <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-white/10 backdrop-blur">
                        <Icon className="h-7 w-7" />
                      </div>
                      <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-200">
                        {service.category}
                      </div>
                      <h3 className="mb-3 text-2xl font-bold">
                        {service.title}
                      </h3>
                      <p className="text-sm text-red-100">
                        {service.description}
                      </p>
                    </div>

                    <div className="lg:col-span-2">
                      <CardContent className="p-8 lg:p-10">
                        <div className="mb-6">
                          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-900">
                            What We Offer
                          </h4>
                          <div className="grid gap-3 sm:grid-cols-2">
                            {service.services.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                                <span className="text-sm text-gray-700">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t pt-6">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                                Ideal For
                              </div>
                              <div className="text-sm text-gray-700">
                                {service.ideal}
                              </div>
                            </div>
                            <Button
                              asChild
                              size="sm"
                              className="bg-red-600 text-white hover:bg-red-700"
                            >
                              <Link href="/contact">
                                Get Started
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              Our Process
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              How We Work With You
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              A transparent, step-by-step approach to your immigration success.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-5">
            {process.map((item, index) => (
              <div key={index} className="relative">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-red-600 to-red-700 text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600">{item.description}</p>
                {index < process.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full -translate-y-1/2 bg-red-200 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Not Sure Which Service You Need?
          </h2>
          <p className="mb-8 text-base text-gray-600">
            Book a free consultation and we'll help you identify the best
            immigration pathway for your goals.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-red-600 text-white hover:bg-red-700"
          >
            <Link href="/contact">
              Schedule Free Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
