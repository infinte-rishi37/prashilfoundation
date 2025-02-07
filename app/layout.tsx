import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from "@/components/ui/toaster";
import RootLayoutClient from "@/components/RootLayoutClient";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col`}>
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
        <Toaster />
      </body>
    </html>
  );
}