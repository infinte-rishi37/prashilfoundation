import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, PiggyBank, ArrowRight } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Logo from "@/app/public/images/logo.png";

const services = [
  {
    title: "Education Coaching",
    description: "Expert guidance for academic excellence and skill development",
    icon: GraduationCap,
    email: "coaching@prashilfoundation.com",
    href: "/services/education-coaching"
  },
  {
    title: "Education Counselling",
    description: "Professional counselling for career path and academic decisions",
    icon: BookOpen,
    email: "counselling@prashilfoundation.com",
    href: "/services/education-counselling"
  },
  {
    title: "Loan Consultancy",
    description: "Comprehensive financial guidance for education loans",
    icon: PiggyBank,
    email: "loans@prashilfoundation.com",
    href: "/services/loan-consultancy"
  }
] as const;

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/20">
        <div className="container px-4 text-center">
          <Image
            src={Logo}
            alt="Prashil Foundation Logo"
            width={150}
            height={150}
            className="mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Where Wisdom Meets Opportunity
          </h1>
          <p className="yatra-one-regular text-3xl md:text-4xl mb-8 text-muted-foreground">
            श्रद्धावान् लभते ज्ञानम् 
            <span className="block text-lg mt-2">Knowledge Comes to Those Who Seek with Faith</span>
          </p>
          <Button size="lg" className="mr-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">Our Services</h2>
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

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm services={services.map(s => ({ title: s.title }))} />
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}