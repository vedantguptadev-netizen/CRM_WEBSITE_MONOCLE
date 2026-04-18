"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";

export default function Home() {
  // Animated Counter component
  function AnimatedCounter({
    value,
    suffix = "",
    className = "",
  }: {
    value: number;
    suffix?: string;
    className?: string;
  }) {
    const [count, setCount] = useState<number>(0);
    useEffect(() => {
      let start = 0;
      const end = value as number;
      if (start === end) return;
      let duration = 1200;
      let increment = end / (duration / 16);
      let raf: number;
      function animate() {
        start += increment;
        if (start < end) {
          setCount(Math.floor(start));
          raf = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      }
      animate();
      return () => cancelAnimationFrame(raf);
    }, [value]);
    return (
      <span className={className}>
        {count}
        {suffix}
      </span>
    );
  }

  // Testimonial slider component
  function TestimonialSlider() {
    const testimonials: Array<{
      text: string;
      name: string;
      role: string;
      img: string;
    }> = [
      {
        text: "Pathway Immigration made the process so easy and stress-free. I am now living my dream in Canada!",
        name: "Priya S.",
        role: "Permanent Resident",
        img: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      {
        text: "The consultants were knowledgeable and always available. Highly recommend for anyone seeking Canadian immigration!",
        name: "Carlos M.",
        role: "Work Permit Holder",
        img: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      {
        text: "Thanks to Pathway Immigration, my family is together in Canada. The team was supportive every step of the way.",
        name: "Fatima A.",
        role: "Family Sponsorship",
        img: "https://randomuser.me/api/portraits/women/68.jpg",
      },
    ];
    const [active, setActive] = useState<number>(0);
    useEffect(() => {
      const timer = setInterval(() => {
        setActive((prev: number) => (prev + 1) % testimonials.length);
      }, 5000);
      return () => clearInterval(timer);
    }, [testimonials.length]);
    return (
      <div className="relative mx-auto max-w-2xl">
        {testimonials.map((t, idx) => (
          <div
            key={idx}
            className={`rounded-xl bg-white p-5 shadow-lg transition-opacity duration-700 sm:p-8 ${active === idx ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}`}
          >
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, starIdx) => (
                <svg
                  key={starIdx}
                  className="h-5 w-5 text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.975a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.388 2.462a1 1 0 00-.364 1.118l1.286 3.975c.3.921-.755 1.688-1.538 1.118l-3.388-2.462a1 1 0 00-1.175 0l-3.388 2.462c-.783.57-1.838-.197-1.538-1.118l1.286-3.975a1 1 0 00-.364-1.118L2.045 9.402c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.975z" />
                </svg>
              ))}
            </div>
            <p className="mb-6 text-lg text-gray-700">"{t.text}"</p>
            <div className="flex items-center gap-4">
              <img
                src={t.img}
                alt={t.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="font-semibold text-gray-900">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-6 flex justify-center gap-2">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={`h-2 w-2 rounded-full ${active === idx ? "bg-red-600" : "bg-gray-300"}`}
              onClick={() => setActive(idx)}
              aria-label={`Show testimonial ${idx + 1}`}
            />
          ))}
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
        "Successfully helped over 1,000 clients achieve their Canadian immigration goals.",
    },
  ];

  const stats = [
    { number: 98, suffix: "%", label: "Success Rate" },
    { number: 1000, suffix: "+", label: "Clients Served" },
    { number: 15, suffix: "+", label: "Years Experience" },
    { number: 50, suffix: "+", label: "Countries" },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-red-50 via-white to-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <Badge className="mb-6 w-fit bg-red-100 text-red-700 text-sm shadow-sm animate-fade-in sm:mb-8 sm:text-base">
                RCIC Regulated • Trusted Immigration Partner
              </Badge>
              <h1 className="mb-8 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl animate-slide-up">
                Your Trusted Path to
                <span className="block bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
                  Canadian Immigration
                </span>
              </h1>
              <p className="mb-10 text-base text-gray-700 sm:text-xl animate-fade-in">
                Expert guidance from licensed immigration consultants to help
                you study, work, and live in Canada. Navigate complex
                immigration processes with confidence and clarity.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto animate-bounce"
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
                  className="w-full sm:w-auto animate-fade-in"
                >
                  <Link href="/services">Explore Services</Link>
                </Button>
              </div>
            </div>
            <div className="relative sm:pb-8">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1758691736975-9f7f643d178e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkaXZlcnNlJTIwdGVhbSUyMG9mZmljZXxlbnwxfHx8fDE3NzEwOTc5NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional immigration consultants"
                  className="h-full w-full object-cover"
                />
                {/* Overlay for better contrast */}
                <div className="absolute inset-0 bg-black/20 pointer-events-none rounded-2xl" />
              </div>
              {/* Floating Stats Card */}
              <div className="relative -mt-4 mx-auto w-fit rounded-xl bg-white p-5 shadow-xl sm:absolute sm:-bottom-6 sm:-left-6 sm:mt-0 sm:mx-0 sm:p-6 lg:p-8 animate-slide-up">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-gray-900">
                      98%
                    </div>
                    <div className="text-base text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <AnimatedCounter
                  value={stat.number}
                  suffix={stat.suffix}
                  className="text-3xl font-bold text-red-600 sm:text-4xl"
                />
                <div className="mt-2 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
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
            {services.map((service, index) => {
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

      {/* Meet the Team Section */}
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

      {/* Testimonials Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-red-100 text-red-700 hover:bg-red-100">
              Testimonials
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-gray-600">
              Hear from people who successfully immigrated with our help.
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
              Book your free consultation today and let us help you achieve your
              Canadian immigration goals.
            </p>
            <Button asChild size="lg" variant="secondary">
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
        </div>
      </section>
    </div>
  );
}
