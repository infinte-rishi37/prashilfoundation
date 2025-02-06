import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, BookOpen, PiggyBank, ArrowRight, Users, Trophy, Star } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import WhatsAppButton from "@/components/WhatsAppButton";
import FAQ from "@/components/FAQ";
import { Yatra_One } from "next/font/google";

const logo = "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//logo.png";

const yatra = Yatra_One({
  weight: ['400'],
  subsets: ['latin', 'devanagari'],
  preload: true,
  display: 'swap',
  fallback: ['system-ui', 'serif']
});

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

const stats = [
  { number: "5000+", label: "Students Guided" },
  { number: "95%", label: "Success Rate" },
  { number: "100+", label: "Partner Institutions" },
  { number: "10+", label: "Years Experience" }
];

const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Engineering Student",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    quote: "Prashil Foundation helped me secure admission in my dream college. Their guidance was invaluable!"
  },
  {
    name: "Priya Patel",
    role: "Medical Student",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    quote: "The counselling services helped me choose the right career path. I'm now pursuing my passion!"
  },
  {
    name: "Amit Kumar",
    role: "MBA Graduate",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    quote: "Their loan consultancy made my foreign education dreams come true. Highly recommended!"
  }
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/20 py-9">
        <div className="container text-center">
          <Image
            src={logo}
            alt="Prashil Foundation Logo"
            width={250}
            height={250}
            style={{objectFit: 'cover'}}
            className="mx-auto mb-8"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Where Wisdom Meets Opportunity
          </h1>
          <p className={`${yatra.className} text-3xl md:text-4xl mb-8 text-muted-foreground`}>
            श्रद्धावान् लभते ज्ञानम् 
            <span className="block text-lg mt-2">Knowledge Comes to Those Who Seek with Faith</span>
          </p>
          <Button size="lg" className="mr-4 bg-primary text-primary-foreground hover:bg-primary/90">
            Get Started <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-secondary/5">
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

      {/* Services Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Our Services
          </h2>
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

      {/* Why Choose Us Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Expert Guidance</h3>
              <p className="text-muted-foreground">Experienced mentors dedicated to your success</p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Proven Track Record</h3>
              <p className="text-muted-foreground">Consistent success in student placements</p>
            </div>
            <div className="text-center">
              <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Personalized Approach</h3>
              <p className="text-muted-foreground">Tailored solutions for every student</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
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
                  <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Contact Form Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
            Contact Us
          </h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm services={services.map(s => ({ title: s.title }))} />
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </main>
  );
}