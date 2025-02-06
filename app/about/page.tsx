import { Building, Users, Target, Award, GraduationCap, Trophy, Star, Heart } from "lucide-react";
import Image from "next/image";

const team = [
  {
    name: "John Doe",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
    bio: "20+ years of experience in education consulting"
  },
  {
    name: "Jane Smith",
    role: "Education Director",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    bio: "Former university professor with expertise in career guidance"
  },
  {
    name: "Mike Johnson",
    role: "Financial Advisor",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
    bio: "Specialist in education loans and financial planning"
  },
  {
    name: "Sarah Wilson",
    role: "Student Counselor",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    bio: "Certified counselor with focus on student well-being"
  }
];

const milestones = [
  {
    year: "2020",
    title: "Foundation Established",
    description: "Started with a vision to transform education guidance"
  },
  {
    year: "2021",
    title: "1000+ Students Guided",
    description: "Reached our first major milestone in student support"
  },
  {
    year: "2022",
    title: "Digital Platform Launch",
    description: "Expanded our reach through online services"
  },
  {
    year: "2023",
    title: "International Partnerships",
    description: "Established connections with global institutions"
  }
];

const stats = [
  { number: "5000+", label: "Students Guided" },
  { number: "95%", label: "Success Rate" },
  { number: "100+", label: "Partner Institutions" },
  { number: "10+", label: "Years Experience" }
];

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

      {/* Values */}
      <section className="py-20">
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

      {/* Milestones */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Journey</h2>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-24 pt-1">
                    <p className="text-xl font-bold text-primary">{milestone.year}</p>
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
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
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Education Excellence</h3>
              <p className="text-muted-foreground">
                Helping students achieve their academic goals through personalized guidance
              </p>
            </div>
            <div className="text-center">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Career Success</h3>
              <p className="text-muted-foreground">
                Supporting students in their journey towards rewarding careers
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-bold mb-2">Community Building</h3>
              <p className="text-muted-foreground">
                Creating a supportive network of students, educators, and institutions
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}