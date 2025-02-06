"use client";

import { BookOpen, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";

const services = [{ title: "Education Counselling" }];

const features = [
  "Career path guidance",
  "College admission counselling",
  "Course selection assistance",
  "Personality assessment",
  "Industry insights",
  "Interview preparation"
];

const testimonials = [
  {
    name: "Sneha Reddy",
    outcome: "Admitted to Stanford University",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    quote: "The counsellors helped me understand my strengths and guided me towards the perfect course. Their support during the application process was invaluable.",
    rating: 5
  },
  {
    name: "Arjun Mehta",
    outcome: "Secured Full Scholarship",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "Thanks to their guidance, I not only got into my dream university but also secured a full scholarship. The counsellors know exactly what universities look for.",
    rating: 5
  },
  {
    name: "Zara Khan",
    outcome: "Career Transition Success",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "The career counselling sessions helped me make an informed decision about my career switch. Their industry insights were eye-opening.",
    rating: 5
  }
];

const successMetrics = [
  { number: "98%", label: "Admission Success Rate" },
  { number: "2000+", label: "Students Counselled" },
  { number: "500+", label: "University Partnerships" },
  { number: "₹50Cr+", label: "Scholarships Secured" }
];

const counsellingProcess = [
  {
    title: "Initial Assessment",
    description: "Comprehensive evaluation of academic background, interests, and goals"
  },
  {
    title: "Career Mapping",
    description: "Detailed analysis of suitable career paths and opportunities"
  },
  {
    title: "University Selection",
    description: "Shortlisting universities based on preferences and eligibility"
  },
  {
    title: "Application Support",
    description: "End-to-end assistance with application process and documents"
  },
  {
    title: "Interview Preparation",
    description: "Mock interviews and preparation sessions"
  },
  {
    title: "Post-Admission Support",
    description: "Guidance for visa process and pre-departure briefing"
  }
];

export default function EducationCounselling() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Education Counselling
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional counselling for career path and academic decisions
          </p>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {successMetrics.map((metric) => (
              <div key={metric.label} className="text-center">
                <p className="text-4xl font-bold text-primary mb-2">{metric.number}</p>
                <p className="text-muted-foreground">{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div key={feature} className="flex items-start space-x-3">
                <CheckCircle className="h-6 w-6 text-primary shrink-0" />
                <p className="text-lg">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Counselling Process */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Counselling Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {counsellingProcess.map((step, index) => (
              <Card key={step.title} className="relative">
                <CardContent className="pt-6">
                  <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">{index + 1}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
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
                  <div className="flex justify-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-primary fill-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.outcome}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button size="lg">
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm services={services} />
          </div>
        </div>
      </section>
    </main>
  );
}