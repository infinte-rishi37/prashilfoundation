"use client";

import { useEffect, useState } from "react";
import { BookOpen, CheckCircle, ArrowRight, Star, MessageCircle, Target, Users, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

type EduGuideService = {
  id: string;
  category: 'career_counselling' | 'college_admission';
  name: string;
  description: string;
  fee: number;
  min_students?: number;
  location?: string;
};

const features = [
  {
    icon: Target,
    title: "Career Assessment",
    description: "Advanced psychometric tools to identify your strengths and interests"
  },
  {
    icon: Users,
    title: "Expert Counsellors",
    description: "Experienced professionals to guide your career journey"
  },
  {
    icon: Lightbulb,
    title: "Personalized Guidance",
    description: "Tailored advice based on your unique profile and goals"
  }
];

const stats = [
  { number: "10K+", label: "Students Guided" },
  { number: "95%", label: "Success Rate" },
  { number: "50+", label: "Partner Universities" },
  { number: "100%", label: "Satisfaction Rate" }
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

  const handleContactClick = (service: EduGuideService) => {
    const phoneNumber = service.location === 'ABROAD' ? '917061214923' : '917621071739';
    const message = encodeURIComponent(
      `Hi, I am interested in the ${service.name} service. Could you please provide more information?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleApply = async (service: EduGuideService) => {
    if (!user) {
      router.push('/auth/sign-in');
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
          Career counseling using advanced human and AI-based methods, helping students choose the right career path and secure admissions in India and abroad.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
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

      {/* Features Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => handleContactClick(service)}
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                    {user && (
                      <Button 
                        onClick={() => handleApply(service)}
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
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={() => handleContactClick(service)}
                      variant="outline"
                      className="flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="h-4 w-4" />
                      Chat on WhatsApp
                    </Button>
                    {user && (
                      <Button 
                        onClick={() => handleApply(service)}
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
        </div>
      </section>
    </main>
  );
}