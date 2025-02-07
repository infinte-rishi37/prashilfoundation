"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard') || pathname?.startsWith('/admin');

  return (
    <>
      <Header />
      <main className={`flex-1 ${!isDashboard ? "mt-20" : ""}`}>
        {children}
      </main>
      {!isDashboard && (
        <>
          <Footer />
          <WhatsAppButton />
        </>
      )}
    </>
  );
}