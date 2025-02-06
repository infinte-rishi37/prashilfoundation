"use client";

import { PiggyBank, CheckCircle, ArrowRight, Star, Shield, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";
import Image from "next/image";

const services = [{ title: "Loan Consultancy" }];

const features = [
  "Education loan guidance",
  "Documentation assistance",
  "Bank liaison support",
  "Interest rate comparison",
  "Repayment planning",
  "Financial counselling"
];

const testimonials = [
  {
    name: "Vikram Malhotra",
    outcome: "Secured ₹40L Education Loan",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "The loan consultancy team made the entire process smooth and hassle-free. They helped me get the best interest rates for my studies abroad.",
    rating: 5
  },
  {
    name: "Ananya Sharma",
    outcome: "Collateral-Free Loan Approved",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "Thanks to their expertise, I got a collateral-free education loan for my MBA. Their guidance throughout the process was invaluable.",
    rating: 5
  },
  {
    name: "Rajesh Kumar",
    outcome: "Quick Loan Approval",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "The team's relationships with banks helped fast-track my loan approval. Their financial planning advice was extremely helpful.",
    rating: 5
  }
];

const successMetrics = [
  { number: "₹100Cr+", label: "Loans Facilitated" },
  { number: "1500+", label: "Students Supported" },
  { number: "25+", label: "Bank Partnerships" },
  { number: "97%", label: "Approval Rate" }
];

const loanTypes = [
  {
    title: "Merit-Based Loans",
    description: "Special rates for academically excellent students",
    icon: Star
  },
  {
    title: "Collateral-Free Loans",
    description: "Options available up to ₹40 lakhs without security",
    icon: Shield
  },
  {
    title: "Quick Approval Loans",
    description: "Fast-track processing for urgent requirements",
    icon: Clock
  },
  {
    title: "Study Abroad Loans",
    description: "Comprehensive coverage for international education",
    icon: FileText
  }
];

export default function LoanConsultancy() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <PiggyBank className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Loan Consultancy
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive financial guidance for education loans
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

      {/* Loan Types */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Types of Loans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loanTypes.map((type) => (
              <Card key={type.title} className="text-center">
                <CardHeader>
                  <type.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                  <CardTitle className="mb-2">{type.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{type.description}</p>
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
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Process</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Initial Consultation",
                  description: "Understanding your requirements and financial situation"
                },
                {
                  step: "2",
                  title: "Documentation Review",
                  description: "Assisting with necessary paperwork and verification"
                },
                {
                  step: "3",
                  title: "Bank Selection",
                  description: "Comparing options and choosing the best lender"
                },
                {
                  step: "4",
                  title: "Application Processing",
                  description: "Submitting application and following up"
                },
                {
                  step: "5",
                  title: "Loan Disbursement",
                  description: "Ensuring smooth fund transfer and documentation"
                }
              ].map((step) => (
                <div key={step.step} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-foreground font-bold">{step.step}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20">
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