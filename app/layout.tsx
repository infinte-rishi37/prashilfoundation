import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const inter = Inter({ 
  subsets: ['latin'],
  preload: true,
  display: 'swap',
  fallback: ['system-ui', 'sans-serif']
});

export const metadata: Metadata = {
  title: 'Prashil Foundation - Education & Financial Services',
  description: 'Empowering futures through education coaching, counselling, and loan consultancy services. श्रद्धावान् लभते ज्ञानम्',
  keywords: 'education coaching, education counselling, loan consultancy, Prashil Foundation',
};

const logo = "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//logo.png";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDashboard = typeof window !== 'undefined' && (
    window.location.pathname.startsWith('/dashboard') ||
    window.location.pathname.startsWith('/admin')
  );

  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        {!isDashboard && <Header />}
        <div className={isDashboard ? "flex-1" : "flex-1 mt-20"}>
          {children}
        </div>
        {!isDashboard && <Footer />}
        {!isDashboard && <WhatsAppButton />}
        <Toaster />
      </body>
    </html>
  );
}