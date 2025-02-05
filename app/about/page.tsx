import { Building, Users, Target, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-secondary/20 via-background to-primary/20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              About Prashil Foundation
            </h1>
            <p className="text-xl text-muted-foreground">
              Empowering futures through education and guidance since 2020
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To provide accessible, quality education and financial guidance to students,
                helping them achieve their academic and career goals through personalized
                support and innovative solutions.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                To be the leading educational foundation that transforms lives through
                holistic development, creating opportunities for students to excel in
                their chosen paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Building,
                title: "Excellence",
                description: "Striving for the highest standards in education and service"
              },
              {
                icon: Users,
                title: "Inclusivity",
                description: "Creating opportunities for students from all backgrounds"
              },
              {
                icon: Target,
                title: "Innovation",
                description: "Embracing new methods and technologies in education"
              },
              {
                icon: Award,
                title: "Integrity",
                description: "Maintaining transparency and ethical practices"
              }
            ].map((value) => (
              <div key={value.title} className="text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "John Doe",
                role: "Founder & CEO",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              },
              {
                name: "Jane Smith",
                role: "Education Director",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
              },
              {
                name: "Mike Johnson",
                role: "Financial Advisor",
                image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
              }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="relative w-48 h-48 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}