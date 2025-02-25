"use client";

import { useEffect, useState } from "react";
import { PiggyBank, FileText, CheckCircle, ArrowRight, MessageCircle, Shield, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";

type FinanceService = {
  id: string;
  name: string;
  category: 'loan' | 'document';
  description: string;
  created_at: string;
};

const testimonials = [
  {
    name: "Vikram Malhotra",
    outcome: "Home Loan Approved",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "The loan consultancy team made the entire process smooth and hassle-free. They helped me get the best interest rates.",
    rating: 5
  },
  {
    name: "Ananya Sharma",
    outcome: "Business Loan Success",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "Thanks to their expertise, I got my business loan approved quickly. Their guidance throughout the process was invaluable.",
    rating: 5
  },
  {
    name: "Rajesh Kumar",
    outcome: "GST Registration Complete",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "The team helped me with GST registration and filing. Their knowledge of compliance requirements is excellent.",
    rating: 5
  }
];

const features = [
  {
    icon: Shield,
    title: "Secure Processing",
    description: "Safe and confidential handling of your information"
  },
  {
    icon: Clock,
    title: "Quick Processing",
    description: "Fast-track processing for eligible applications"
  },
  {
    icon: FileText,
    title: "Documentation Support",
    description: "Complete assistance with paperwork and verification"
  }
];

export default function PrashilFinancePage() {
  const [services, setServices] = useState<FinanceService[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      const { data, error } = await supabase
        .from('finance_services')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching services:', error);
        return;
      }

      setServices(data || []);
    };

    fetchData();
  }, []);

  const handleContactClick = (service: FinanceService) => {
    const phoneNumber = service.category === 'loan' ? '917621071739' : '917061214923';
    const message = encodeURIComponent(
      `Hi, I am interested in the ${service.name} service. Could you please provide more information?`
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  const handleApply = async (service: FinanceService) => {
    if (!user) {
      router.push('/auth/sign-in');
      return;
    }
    router.push('/dashboard/applications');
  };

  const loanServices = services.filter(s => s.category === 'loan');
  const documentServices = services.filter(s => s.category === 'document');

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-primary/10 to-primary/5">
        <div className="container px-4 text-center">
          <PiggyBank className="h-16 w-16 mx-auto mb-6 text-primary" />
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Prashil Finance
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Comprehensive financial solutions, including home loans, mortgage loans, education loans, and government-sponsored schemes. We also assist with essential documents like GST, PAN Card, and Aadhaar Card.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
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

      {/* Services Tabs */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <Tabs defaultValue="loan" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="loan">Loan Services</TabsTrigger>
              <TabsTrigger value="document">Document Services</TabsTrigger>
            </TabsList>

            <TabsContent value="loan" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {loanServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
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
            </TabsContent>

            <TabsContent value="document" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {documentServices.map((service) => (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{service.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4">{service.description}</p>
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
            </TabsContent>
          </Tabs>
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