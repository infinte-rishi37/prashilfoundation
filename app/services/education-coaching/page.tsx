"use client";

import { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import Image from "next/image";
import { supabase, type Course } from '@/lib/supabase';

const services = [{ title: "Education Coaching" }];

const features = [
  "Personalized learning plans",
  "Expert subject matter tutors",
  "Regular progress tracking",
  "Practice tests and assessments",
  "Study material and resources",
  "Flexible scheduling options"
];

const testimonials = [
  {
    name: "Rahul Kumar",
    course: "IIT-JEE Preparation",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "The personalized coaching helped me secure a rank in the top 1000 in JEE Advanced. The mentors were always available for doubt clearing.",
    rating: 5
  },
  {
    name: "Priya Singh",
    course: "NEET Preparation",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "Thanks to Prashil Foundation's coaching, I got admission into one of the top medical colleges. The study material and mock tests were excellent.",
    rating: 5
  },
  {
    name: "Amit Patel",
    course: "CAT Preparation",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "The coaching program helped me score 99.5 percentile in CAT. The strategy sessions were particularly helpful.",
    rating: 5
  }
];

const successMetrics = [
  { number: "95%", label: "Success Rate" },
  { number: "1000+", label: "Students Coached" },
  { number: "50+", label: "Expert Mentors" },
  { number: "100%", label: "Satisfaction Rate" }
];

const collegePlans = [
  {
    name: "Basic Plan",
    price: 999,
    features: [
      "Basic student profiling",
      "Course recommendations",
      "Basic analytics dashboard",
      "Email support"
    ]
  },
  {
    name: "Premium Plan",
    price: 2999,
    features: [
      "Advanced student profiling",
      "Personalized course recommendations",
      "Advanced analytics dashboard",
      "Priority support",
      "Performance tracking",
      "Regular reports"
    ]
  },
  {
    name: "Enterprise Plan",
    price: 4999,
    features: [
      "Complete student profiling",
      "AI-powered recommendations",
      "Real-time analytics",
      "24/7 dedicated support",
      "Custom reporting",
      "API access",
      "White-label options"
    ]
  }
];

export default function EducationCoaching() {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      setCourses(data);
    };

    fetchCourses();
  }, []);

  const handleContactClick = (course: Course) => {
    const phoneNumber = course.type === 'Domestic' ? '911234567890' : '917061214923';
    const message = encodeURIComponent(
      `Hi, I am interested in the course ${course.name} which is ${course.type}. Could you please provide more information?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const domesticCourses = courses.filter(course => course.type === 'Domestic');
  const abroadCourses = courses.filter(course => course.type === 'Abroad');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Education Coaching
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Expert guidance for academic excellence and skill development
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

      {/* Testimonials Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Student Success Stories</h2>
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
                  <p className="text-sm text-primary">{testimonial.course}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Courses</h2>
          
          {/* Domestic Courses */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Domestic Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domesticCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>Starts: {new Date(course.start_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold mb-4">₹{course.fees.toLocaleString()}</p>
                    <Button 
                      onClick={() => handleContactClick(course)}
                      className="w-full"
                    >
                      Contact via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Abroad Courses */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Study Abroad</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {abroadCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>Starts: {new Date(course.start_date).toLocaleDateString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-semibold mb-4">₹{course.fees.toLocaleString()}</p>
                    <Button 
                      onClick={() => handleContactClick(course)}
                      className="w-full"
                    >
                      Contact via WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* College Plans Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">College Partnership Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {collegePlans.map((plan) => (
              <Card key={plan.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    <span className="text-2xl font-bold">₹{plan.price}</span>/month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-primary mr-2" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full mt-6">Get Started</Button>
                </CardContent>
              </Card>
            ))}
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

      <WhatsAppButton />
    </main>
  );
}