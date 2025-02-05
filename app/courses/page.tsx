"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase, type Course } from '@/lib/supabase';
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CoursesPage() {
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
      <Header />
      
      <div className="container px-4 py-24">
        <h1 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          Our Courses
        </h1>

        {/* Domestic Courses */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Domestic Courses</h2>
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
        </section>

        {/* Abroad Courses */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Study Abroad</h2>
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
        </section>
      </div>

      <Footer />
    </main>
  );
}