"use client";

import { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
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

      {/* Courses Section */}
      <section className="py-20 bg-secondary/5">
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
      <section className="py-20">
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
      <section className="py-20 bg-secondary/5">
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