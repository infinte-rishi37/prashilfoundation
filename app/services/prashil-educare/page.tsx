"use client";

import { useEffect, useState } from 'react';
import { GraduationCap, CheckCircle, ArrowRight, Star, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase, type Course } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

export default function PrashilEducarePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        return;
      }

      setCourses(data || []);
    };

    fetchData();
  }, []);

  const handleContactClick = (course: Course) => {
    const phoneNumber = course.type === 'Domestic' ? '911234567890' : '917061214923';
    const message = encodeURIComponent(
      `Hi, I am interested in the course ${course.name} which is ${course.type}. Could you please provide more information?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleApply = async (courseId: string) => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    const { error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        course_id: courseId,
        status: 'pending'
      });

    if (error) {
      console.error('Error creating application:', error);
      return;
    }

    router.push('/dashboard/applications');
  };

  const filteredCourses = courses.filter(course => 
    modeFilter === "all" || course.mode === modeFilter
  );

  const domesticCourses = filteredCourses.filter(course => course.type === 'Domestic');
  const abroadCourses = filteredCourses.filter(course => course.type === 'Abroad');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prashil Educare
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

          <div className="max-w-xs mx-auto mb-8">
            <Select value={modeFilter} onValueChange={setModeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="Online">Online</SelectItem>
                <SelectItem value="Offline">Offline</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Domestic Courses */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold mb-6">Domestic Courses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {domesticCourses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                    <CardDescription>
                      Starts: {new Date(course.start_date).toLocaleDateString()}
                      <br />
                      Mode: {course.mode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg font-semibold">₹{course.fees.toLocaleString()}</p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={() => handleContactClick(course)}
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </Button>
                      {user && (
                        <Button 
                          onClick={() => handleApply(course.id)}
                          className="flex items-center justify-center gap-2"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Apply Now
                        </Button>
                      )}
                    </div>
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
                    <CardDescription>
                      Starts: {new Date(course.start_date).toLocaleDateString()}
                      <br />
                      Mode: {course.mode}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-lg font-semibold">₹{course.fees.toLocaleString()}</p>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={() => handleContactClick(course)}
                        variant="outline"
                        className="flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Chat on WhatsApp
                      </Button>
                      {user && (
                        <Button 
                          onClick={() => handleApply(course.id)}
                          className="flex items-center justify-center gap-2"
                        >
                          <ArrowRight className="h-4 w-4" />
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
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
                  <p className="text-sm text-primary">{testimonial.course}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}