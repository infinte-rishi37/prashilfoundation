"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

type FAQ = {
  id: string;
  question: string;
  answer: string;
  order: number;
};

type FAQProps = {
  section: 'home' | 'educare' | 'eduguide' | 'finance' | 'support';
};

export default function FAQ({ section }: FAQProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('section', section)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching FAQs:', error);
        return;
      }

      setFaqs(data || []);
      setIsLoading(false);
    };

    fetchFaqs();
  }, [section]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (faqs.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-secondary/5">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}