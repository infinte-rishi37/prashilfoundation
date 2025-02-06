"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EduGuideService = {
  id: string;
  category: 'career_counselling' | 'college_admission';
  name: string;
  description: string;
  fee: number;
  min_students?: number;
  location?: string;
};

export default function PrashilEduGuidePage() {
  const [services, setServices] = useState<EduGuideService[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('eduguide_services')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    };

    fetchData();
  }, []);

  const handleApply = async (serviceId: string) => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }

    const { error } = await supabase
      .from('applications')
      .insert({
        user_id: user.id,
        course_id: serviceId,
        status: 'pending'
      });

    if (error) {
      console.error('Error creating application:', error);
      return;
    }

    router.push('/dashboard/applications');
  };

  const careerCounselling = services.filter(s => s.category === 'career_counselling');
  const collegeAdmission = services.filter(s => s.category === 'college_admission');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prashil EduGuide
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional counselling for career path and academic decisions
          </p>
        </div>
      </section>

      {/* Career Counselling Services */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Career Counselling Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {careerCounselling.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <p className="text-lg font-semibold mb-4">₹{service.fee.toLocaleString()}</p>
                  {service.min_students && (
                    <p className="text-sm text-muted-foreground mb-4">
                      Minimum {service.min_students} students required
                    </p>
                  )}
                  {user && (
                    <Button 
                      onClick={() => handleApply(service.id)}
                      className="w-full"
                    >
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* College Admission Services */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">College Admission Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {collegeAdmission.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{service.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <p className="text-lg font-semibold mb-4">₹{service.fee.toLocaleString()}</p>
                  {service.location && (
                    <p className="text-sm font-medium mb-4">
                      Location: {service.location}
                    </p>
                  )}
                  {user && (
                    <Button 
                      onClick={() => handleApply(service.id)}
                      className="w-full"
                    >
                      Apply Now
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}