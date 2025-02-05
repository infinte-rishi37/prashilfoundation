import { PiggyBank, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactForm from "@/components/ContactForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const services = [{ title: "Loan Consultancy" }];

const features = [
  "Education loan guidance",
  "Documentation assistance",
  "Bank liaison support",
  "Interest rate comparison",
  "Repayment planning",
  "Financial counselling"
];

export default function LoanConsultancy() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
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
          <div className="mt-12 text-center">
            <Button size="lg">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-2xl mx-auto">
            <ContactForm services={services} />
          </div>
        </div>
      </section>

      <WhatsAppButton />
      <Footer />
    </main>
  );
}