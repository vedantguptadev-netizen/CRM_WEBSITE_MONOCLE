"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  Shield,
  Users,
  Globe,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function About() {
  const values = [
    {
      icon: Shield,
      title: "Integrity & Trust",
      description:
        "We operate with complete transparency and ethical standards, putting your interests first in every decision.",
    },
    {
      icon: Users,
      title: "Client-Centered Approach",
      description:
        "Your success is our success. We provide personalized attention and tailored solutions for each client.",
    },
    {
      icon: Award,
      title: "Excellence & Expertise",
      description:
        "Continuous professional development ensures we deliver cutting-edge immigration solutions.",
    },
    {
      icon: Globe,
      title: "Cultural Sensitivity",
      description:
        "We understand the unique challenges of international immigration and provide culturally aware support.",
    },
  ];

  const credentials = [
    "Licensed RCIC (Regulated Canadian Immigration Consultant)",
    "Member of College of Immigration and Citizenship Consultants",
    "15+ years of immigration law experience",
    "Multilingual support in 10+ languages",
    "Certified in Express Entry, PNP, and Family Sponsorship",
    "Active member of Canadian Immigration Lawyers Association",
  ];

  const achievements = [
    { number: "98%", label: "Application Success Rate" },
    { number: "1000+", label: "Successful Applications" },
    { number: "50+", label: "Countries Represented" },
    { number: "15+", label: "Years of Experience" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-red-50 via-white to-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              About Us
            </Badge>
            <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl">
              Your Trusted Immigration Partner
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Helping individuals and families achieve their Canadian
              immigration dreams through expert guidance, integrity, and proven
              results.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
                Our Story
              </Badge>
              <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
                About Monocle Immigration
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Monocle Immigration is a trusted agency led by Rupinder Bhatti, RCIC, and a member of ICCRC.
                </p>
                <p>
                  We assist individuals in coming to Canada on a temporary or permanent basis, offering services such as: Permanent Residence (Express Entry, PNP), Study & Work Permits, Business & Investor Visas, Canadian Citizenship & Family Sponsorship, Citizenship by Investment (Caribbean), Residency by Investment (Europe).
                </p>
                <p>
                  We provide expert guidance and personalised solutions to simplify your immigration journey.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-xl">
                <ImageWithFallback
                  src="/rupinder.webp"
                  alt="Rupinder Bhatti"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="border-y border-gray-100 bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {achievements.map((item, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-red-600 sm:text-5xl">
                  {item.number}
                </div>
                <div className="mt-2 text-sm text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-3 border-red-200 bg-red-50 text-red-700 shadow-none">
              Our Values
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              What We Stand For
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Our core values guide every decision we make and every client
              relationship we build.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <Card
                  key={index}
                  className="border border-gray-100 bg-white shadow-md transition-shadow hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 font-semibold text-gray-900">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Credentials Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white sm:text-4xl">
                Licensed & Regulated Professionals
              </h2>
              <p className="mb-8 text-lg text-red-100">
                Our team holds the highest credentials in Canadian immigration
                consulting, ensuring you receive expert, ethical, and effective
                representation.
              </p>
              <div className="rounded-lg bg-white/10 p-6 backdrop-blur">
                <div className="mb-2 flex items-center gap-2 text-white">
                  <Shield className="h-5 w-5" />
                  <span className="font-semibold">RCIC License #R706551</span>
                </div>
                <p className="text-sm text-red-100">
                  Regulated by the College of Immigration and Citizenship
                  Consultants (CICC)
                </p>
              </div>
            </div>

            <div>
              <div className="rounded-xl bg-white p-8 shadow-2xl">
                <h3 className="mb-6 text-xl font-semibold text-gray-900">
                  Credentials & Certifications
                </h3>
                <ul className="space-y-3">
                  {credentials.map((credential, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                      <span className="text-sm text-gray-700">
                        {credential}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            Ready to Work With Us?
          </h2>
          <p className="mb-8 text-base text-gray-600">
            Experience the difference of working with licensed, dedicated
            immigration professionals.
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
              Book Free Consultation
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
}
