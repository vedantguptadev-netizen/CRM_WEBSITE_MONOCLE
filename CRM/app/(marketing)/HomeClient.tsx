"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Briefcase,
  Home as HomeIcon,
  Heart,
  CheckCircle,
  ArrowRight,
  Shield,
  Users,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function Home() {
  // Testimonial slider component
  function TestimonialSlider() {
    const testimonials: Array<{ name: string; text: string }> = [
      {
        name: "Mehakpreet Singh",
        text: "I always suggest everyone to choose Monocle Immigration for their best career and future. Nobody can guide us and take care of our profile like Rupinder ma'am during unmanageable circumstances. Rupinder filled us with hope and encouraged us to continue so we will be able to reach our desired goals. I am able to get the extension only due to her guidance.",
      },
      {
        name: "Shilpa Kattekola",
        text: "With my critical case, Rupinder was so calm and detail-oriented. She gave me the right advice at every turning point of my PR journey. 497 days was nothing but painful — if not for Rupinder I would have quit Canada. I have referred her to at least 5 people already, all of them very happy to have found a genuine consultant.",
      },
      {
        name: "Ximena G.",
        text: "Rupinder was great! Our company hired a foreign worker using the LMIA process and everything went according to plan, exactly how she explained it would be. Very communicative and patient in answering all our questions. Any delays were on the government side — Rupinder was on top of everything. Would recommend her to anyone.",
      },
      {
        name: "Nikunj Rabari",
        text: "I had an amazing experience with Monocle Immigration for my open work permit application. They processed my application in just one day, which was truly impressive! A special thanks to Rupinder for the excellent support and guidance throughout. The team was professional, efficient, and very helpful. Highly recommend.",
      },
      {
        name: "Asaba Richard",
        text: "She helped me with my work permit and extension, which I thought could never happen while I was still in the country on a visitor's visa. She made the whole process seamless and efficient. Rupinder and her team were extremely responsive throughout. She truly cares about her clients and goes above and beyond to ensure their success.",
      },
      {
        name: "Rupal Patel",
        text: "Extremely good service. I had gotten a refusal for my son's study permit and was worried. Ms. Rupinder helped produce a proper application and I just got it in 6 weeks — unbelievable! Because of the study permit my son could start university on time. I truly suggest anyone to be assisted by Monocle Immigration Services.",
      },
    ];

    const total = testimonials.length;
    const [index, setIndex] = useState(0);
    const prev = () => setIndex((i) => (i - 1 + total) % total);
    const next = () => setIndex((i) => (i + 1) % total);
    const secondIndex = (index + 1) % total;

    const avatarColors = [
      "bg-red-100 text-red-700",
      "bg-blue-100 text-blue-700",
      "bg-emerald-100 text-emerald-700",
      "bg-violet-100 text-violet-700",
      "bg-amber-100 text-amber-700",
      "bg-teal-100 text-teal-700",
    ];

    function getInitials(name: string): string {
      const parts = name.trim().split(" ");
      if (parts.length >= 2)
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      return parts[0].slice(0, 2).toUpperCase();
    }

    function renderCard(t: { name: string; text: string }, colorClass: string) {
      return (
        <div className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-md ring-1 ring-gray-100 sm:p-8">
          <div className="mb-4 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className="h-4 w-4 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.538 1.118l-3.388-2.462a1 1 0 00-1.175 0l-3.388 2.462c-.783.57-1.838-.197-1.538-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.045 9.402c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.975z" />
              </svg>
            ))}
          </div>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-700 line-clamp-5 sm:text-base">
            &ldquo;{t.text}&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${colorClass}`}
            >
              {getInitials(t.name)}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {t.name}
              </div>
              <div className="text-xs text-gray-400">
                Monocle Immigration Client
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div className="grid gap-6 md:grid-cols-2">
          {renderCard(
            testimonials[index],
            avatarColors[index % avatarColors.length],
          )}
          <div className="hidden md:block">
            {renderCard(
              testimonials[secondIndex],
              avatarColors[secondIndex % avatarColors.length],
            )}
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            aria-label="Previous testimonials"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index
                    ? "w-6 bg-red-600"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            aria-label="Next testimonials"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }
  const services = [
    {
      icon: GraduationCap,
      title: "Study Permits",
      description:
        "Navigate the student visa process with expert guidance for international students.",
      features: [
        "University applications",
        "Study permit processing",
        "Post-graduation work permits",
      ],
    },
    {
      icon: Briefcase,
      title: "Work Permits",
      description:
        "Secure your Canadian work permit through employer-specific or open work permits.",
      features: [
        "LMIA support",
        "Intra-company transfers",
        "Open work permits",
      ],
    },
    {
      icon: HomeIcon,
      title: "Permanent Residence",
      description:
        "Achieve your dream of Canadian permanent residency through various pathways.",
      features: [
        "Express Entry",
        "Provincial Nominee Programs",
        "Canadian Experience Class",
      ],
    },
    {
      icon: Heart,
      title: "Family Sponsorship",
      description:
        "Reunite with your loved ones in Canada through family sponsorship programs.",
      features: [
        "Spousal sponsorship",
        "Parent & grandparent sponsorship",
        "Dependent children",
      ],
    },
  ];

  const whyChooseUs = [
    {
      icon: Shield,
      title: "RCIC Regulated",
      description:
        "Licensed and regulated by the College of Immigration and Citizenship Consultants.",
    },
    {
      icon: Users,
      title: "Personalized Service",
      description:
        "Tailored immigration strategies designed for your unique situation and goals.",
    },
    {
      icon: Clock,
      title: "Proven Track Record",
      description:
        "A consistent track record of successful applications across a wide range of immigration pathways.",
    },
  ];

  const team = [
    {
      name: "Rupinder Bhatti",
      role: "Founder & Licensed RCIC",
      bio: "Licensed immigration consultant helping individuals and families navigate study permits, PR pathways, family sponsorship, and long-term settlement in Canada.",
      specialties: [
        "Express Entry",
        "Family Sponsorship",
        "Provincial Nominees",
      ],
      languages: ["English", "Punjabi", "Hindi"],
      location: "Calgary, AB",
      img: "/rupinder.webp",
    },
    {
      name: "Gurpreet Bhatti",
      role: "Immigration Assistant",
      bio: "Supports clients through document preparation, application steps, and clear communication to help make every immigration journey smoother and stress-free.",
      specialties: ["Work Permits", "Client Support", "Documentation"],
      languages: ["English", "Punjabi", "Hindi"],
      location: "Calgary, AB",
      img: "/images/guri.png",
    },
    {
      name: "Majadur Rahman",
      role: "Administrative Assistant",
      bio: "Assists clients with case coordination, timelines, and day-to-day support while ensuring each file stays organized and on track.",
      specialties: [
        "Case Coordination",
        "Application Support",
        "Client Liaison",
      ],
      languages: ["Bangla", "Hindi", "Urdu", "English"],
      location: "Brandon, MB",
      img: "/images/Rehman.png",
    },
    {
      name: "Varnika Pawar",
      role: "Admin Assistant",
      bio: "Provides friendly client support, handles enquiries efficiently, and helps create a smooth and welcoming experience throughout the process.",
      specialties: ["Client Support", "Enquiries", "Office Assistance"],
      languages: ["English", "Hindi"],
      location: "Calgary, AB",
      img: "/images/varnika.png",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <Badge className="mb-5 w-fit bg-red-100 text-red-700 text-sm font-medium shadow-sm sm:mb-6">
                RCIC Regulated • Calgary &amp; Brandon Offices
              </Badge>
              <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                Your Trusted Path to
                <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Canadian Immigration
                </span>
              </h1>
              <p className="mb-8 max-w-lg text-base text-gray-600 sm:text-xl">
                Expert guidance from licensed immigration consultants to help
                you study, work, and live in Canada. Navigate complex
                immigration processes with confidence and clarity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 shadow-md"
                >
                  <a
                    href="https://calendly.com/monocle_immigration"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Book Consultation
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-gray-300 hover:border-gray-400"
                >
                  <Link href="/services">
                    Explore Services
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              {/* Trust signals */}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2">
                {[
                  "Licensed RCIC",
                  "Calgary & Brandon Offices",
                  "Study, Work & PR Support",
                  "Personalized Guidance",
                ].map((signal) => (
                  <span
                    key={signal}
                    className="flex items-center gap-1.5 text-sm text-gray-500"
                  >
                    <CheckCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
                    {signal}
                  </span>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative h-full min-h-[300px] overflow-hidden rounded-2xl shadow-2xl ring-1 ring-black/5">
                <Image
                  src="/images/calgary-hero.jpg"
                  alt="Calgary skyline with Calgary Tower"
                  width={1536}
                  height={1024}
                  priority
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />
                {/* Subtle warm overlay to blend with site theme */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-black/25 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Our Services
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Comprehensive Immigration Solutions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              From initial consultation to successful visa approval, we guide
              you through every step of your Canadian immigration journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
            {services.slice(0, 4).map((service, index) => {
              const Icon = service.icon;
              return (
                <Card
                  key={index}
                  className="border-0 shadow-lg transition-all hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-600 to-red-700">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4 text-gray-600">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline">
              <Link href="/services">
                View All Services
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Questions?
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Find answers to common questions about Canadian immigration.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-4">
            {[
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
                a: "Not always. While a valid job offer can boost your application, many immigration pathways, such as Express Entry and certain provincial nominee programs, do not require one. We'll help you identify the best option for your situation.",
              },
              {
                q: "Can Monocle Immigration help with study permits?",
                a: "Yes! We assist students with the entire process, from selecting a Designated Learning Institution (DLI) to preparing and submitting study permit applications. We also help with post-graduation work permits (PGWP).",
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.q}
                </h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button
              asChild
              size="lg"
              className="bg-red-600 text-white hover:bg-red-700"
            >
              <Link href="/contact#faq">
                View More FAQs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Why Choose Us
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Your Success Is Our Priority
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              We combine regulatory expertise, personalized service, and a
              proven track record to deliver exceptional results.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                    <Icon className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Meet the Team
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              Meet the Team Behind Your Journey
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Work with real people who care about your success and guide you
              through every step of your Canadian immigration journey.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex gap-5 rounded-2xl bg-white p-5 shadow-md ring-1 ring-gray-100 transition-shadow hover:shadow-lg"
              >
                {/* Photo */}
                <div className="shrink-0">
                  {member.img ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl ring-2 ring-red-50">
                      <Image
                        src={member.img}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 ring-2 ring-red-100">
                      <Users className="h-8 w-8 text-red-300" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-col">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">
                    {member.name}
                  </h3>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-600">
                    {member.role}
                  </p>
                  <p className="mb-3 text-sm leading-relaxed text-gray-600">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.slice(0, 2).map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-gray-400">
                    {member.languages.join(" • ")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="scroll-mt-24 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Real experiences from clients we&apos;ve guided through their
              Canadian immigration journey.
            </p>
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-red-600 to-red-700 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Ready to Start Your Journey?
            </h2>
            <p className="mb-8 text-lg text-red-100">
              Book your consultation today and let us help you achieve your
              Canadian immigration goals.
            </p>
            <Button asChild size="lg" variant="secondary">
              <a
                href="https://calendly.com/monocle_immigration"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>

            {/* Social divider */}
            <div className="mx-auto mt-12 flex max-w-xs items-center gap-4">
              <div className="h-px flex-1 bg-red-400/50" />
              <span className="text-xs font-medium uppercase tracking-widest text-red-200">
                Follow Us
              </span>
              <div className="h-px flex-1 bg-red-400/50" />
            </div>

            <div className="mt-5 flex items-center justify-center gap-3">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/monocle.img/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Monocle Immigration on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white hover:text-red-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://www.facebook.com/profile.php?id=61567351096994"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Monocle Immigration on Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white hover:text-red-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/monocleimmigration/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Monocle Immigration on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white hover:text-red-600"
              >
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>

              {/* X / Twitter */}
              <a
                href="https://x.com/monocle_imm"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Monocle Immigration on X (Twitter)"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/80 transition-all hover:bg-white hover:text-red-600"
              >
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 300 300"
                  aria-hidden="true"
                >
                  <path d="M178.57 127.15L290.27 0h-26.46l-97.03 110.38L89.34 0H0l117.13 166.93L0 300.25h26.46l102.4-116.59 81.8 116.59h89.34M36.01 19.54H76.66l187.13 262.13h-40.66" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
