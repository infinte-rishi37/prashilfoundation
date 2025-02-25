"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, PiggyBank, ArrowRight, Users, Trophy, Star, Target, Heart } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import FAQ from "@/components/FAQ";
import { Yatra_One } from "next/font/google";

const logo = "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//logo.png";

const yatra = Yatra_One({
  weight: ['400'],
  subsets: ['latin', 'devanagari'],
  preload: true,
  display: 'swap',
  variable: '--font-yatra',
  fallback: ['system-ui', 'serif']
});

const services = [
  {
    title: "Prashil Educare",
    description: "Expert coaching for STET, CTET, Hindi NET/JRF, BPSSC, and other competitive exams. We also offer training for IELTS, GRE, TOEFL, English speaking, and personality development.",
    icon: GraduationCap,
    email: "educare@prashilfoundation.com",
    href: "/services/prashil-educare"
  },
  {
    title: "Prashil EduGuide",
    description: "Career counseling using advanced human and AI-based methods, helping students choose the right career path and secure admissions in India and abroad.",
    icon: BookOpen,
    email: "eduguide@prashilfoundation.com",
    href: "/services/prashil-eduguide"
  },
  {
    title: "Prashil Finance",
    description: "Comprehensive financial solutions, including home loans, mortgage loans, education loans, and government-sponsored schemes. We also assist with essential documents like GST, PAN Card, and Aadhaar Card.",
    icon: PiggyBank,
    email: "finance@prashilfoundation.com",
    href: "/services/prashil-finance"
  }
] as const;

const stats = [
  { number: "5000+", label: "Students Guided" },
  { number: "95%", label: "Success Rate" },
  { number: "100+", label: "Partner Institutions" },
  { number: "10+", label: "Years Experience" }
];

const features = [
  {
    icon: Target,
    title: "Holistic Approach",
    description: "Comprehensive solutions covering education, career, and finance under one roof"
  },
  {
    icon: Users,
    title: "Expert Guidance",
    description: "Qualified professionals with years of experience in their respective fields"
  },
  {
    icon: Trophy,
    title: "Proven Track Record",
    description: "Consistent success in helping students achieve their goals"
  },
  {
    icon: Heart,
    title: "Student-First Approach",
    description: "Personalized attention and care for every individual's unique needs"
  }
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Engineering Student",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "Prashil Foundation helped me secure admission in my dream college. Their guidance was invaluable!"
  },
  {
    name: "Priya Patel",
    role: "Medical Student",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "The counselling services helped me choose the right career path. I'm now pursuing my passion!"
  },
  {
    name: "Amit Kumar",
    role: "MBA Graduate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "Their loan consultancy made my foreign education dreams come true. Highly recommended!"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/20 py-20">
        <div className="container text-center">
          <Image
            src={logo}
            alt="Prashil Foundation Logo"
            width={250}
            height={250}
            style={{objectFit: 'cover'}}
            className="mx-auto mb-8"
          />
          <h1 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Where Wisdom Meets Opportunity
          </h1>
          <p className={`${yatra.className} text-3xl md:text-4xl mb-8 text-muted-foreground`}>
            श्रद्धावान् लभते ज्ञानम्
          </p>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            At Prashil Foundation, we bridge the gap between knowledge and opportunity, empowering individuals to unlock their full potential through comprehensive education, career guidance, and financial support.
          </p>
          <Link href="/auth/sign-up">
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{stat.number}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card key={service.title} className="transition-all hover:shadow-lg border-primary/20">
                  <CardHeader>
                    <Icon className="h-12 w-12 mb-4 text-primary" />
                    <CardTitle className="text-secondary">{service.title}</CardTitle>
                    <CardDescription>{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href={service.href}>
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/10">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardContent className="pt-6">
                  <feature.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm services={services.map(s => ({ title: s.title }))} />
          </div>
        </div>
      </section>
    </main>
  );
}