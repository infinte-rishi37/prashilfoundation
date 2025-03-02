import { 
  Building, 
  Users, 
  Target, 
  Award, 
  GraduationCap, 
  Trophy, 
  Star, 
  Heart,
  BookOpen,
  PiggyBank 
} from "lucide-react";
import Image from "next/image";
import { Yatra_One } from "next/font/google";

const yatra = Yatra_One({
  weight: ['400'],
  subsets: ['latin', 'devanagari'],
  preload: true,
  display: 'swap',
  fallback: ['system-ui', 'serif']
});

const team = [
  {
    name: "Dr. Pragya Singh",
    role: "Visionary",
    image: "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//founder1%20pic.jpg",
    bio: "Visionary educator with NET qualification and PhD. Faculty member on various online platforms."
  }
  // ,{
  //   name: "Mr. Sushil Singh",
  //   role: "Co-Founder",
  //   image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  //   bio: "Dynamic leader with B.E. and MBA, extensive experience in banking."
  // }
];

const services = [
  {
    title: "Prashil Educare",
    description: "Expert coaching for STET, CTET, Hindi NET/JRF, BPSSC, and other competitive exams. We also offer training for IELTS, GRE, TOEFL, English speaking, and personality development.",
    icon: GraduationCap
  },
  {
    title: "Prashil EduGuide",
    description: "Career counseling using advanced human and AI-based methods, helping students choose the right career path and secure admissions in India and abroad.",
    icon: BookOpen
  },
  {
    title: "Prashil Finance",
    description: "Comprehensive financial solutions, including home loans, mortgage loans, education loans, and government-sponsored schemes. We also assist with essential documents like GST, PAN Card, and Aadhaar Card.",
    icon: PiggyBank
  }
];

const values = [
  {
    title: "Holistic Approach",
    description: "We address education, career, and finance under one roof.",
    icon: Building
  },
  {
    title: "Innovative Solutions",
    description: "From advanced counselling tools to streamlined financial services, we leverage technology for your benefit.",
    icon: Target
  },
  {
    title: "Personalized Guidance",
    description: "Every dream is unique, and so is our approach to helping you achieve it.",
    icon: Users
  },
  {
    title: "Trusted Expertise",
    description: "Backed by qualified professionals with years of experience in their fields.",
    icon: Award
  }
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
            We at Prashil Foundation, we believe in the power of wisdom and opportunity to transform lives. We are more than an organization—we are a movement dedicated to empowering individuals to unlock their full potential. Through our three innovative branches, we provide end-to-end solutions in education, career guidance, and financial services, making us your trusted partner in every step of your journey to success.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground">
                To ignite potential, simplify success, and create a world where every individual has the tools and guidance to thrive. At Prashil Foundation, we're not just building careers—we're building futures.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
              <p className="text-lg text-muted-foreground">
                "To be the guiding light that transforms dreams into reality, one step at a time."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.title} className="text-center">
                <service.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">The Visionaries Behind the Vision</h2>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-8 max-w-4xl mx-auto">
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

      {/* Values Section */}
      <section className="py-20 bg-secondary/5">
        <div className="container px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Prashil Foundation?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <value.icon className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Slogans Section */}
      {/* <section className="py-20">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our English Slogan</h2>
              <p className="text-xl font-medium text-primary mb-4">"Where Wisdom Meets Opportunity"</p>
              <p className="text-muted-foreground">
                At Prashil Foundation, we bridge the gap between knowledge and opportunity. Wisdom is the foundation of growth, and opportunity is the catalyst for success. Together, they create a path to a brighter future.
              </p>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Our Sanskrit Slogan</h2>
              <p className={`${yatra.className} text-2xl text-primary mb-4`}>श्रद्धावान् लभते ज्ञानम्</p>
              <p className="italic mb-2">(Shraddhavan Labhate Gyanam)</p>
              <p className="text-muted-foreground">
                This timeless Sanskrit phrase means, "With dedication and faith, one attains knowledge." It reflects our belief that with the right guidance, effort, and trust, every individual can achieve their dreams.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Join Us Section */}
      <section className="py-20">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Us on This Journey</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your dreams are our mission. Let's embark on this journey together. Prashil Foundation—where wisdom meets opportunity, and dedication leads to knowledge.
          </p>
          <p className={`${yatra.className} text-2xl text-primary`}>श्रद्धावान् लभते ज्ञानम्</p>
          <p className="italic text-muted-foreground">(With dedication and faith, one attains knowledge.)</p>
        </div>
      </section>
    </main>
  );
}