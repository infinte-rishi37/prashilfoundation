import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What services does Prashil Foundation offer?",
    answer: "We offer education coaching, education counselling, and loan consultancy services to help students achieve their academic and career goals."
  },
  {
    question: "How can I apply for education coaching?",
    answer: "You can apply for education coaching by creating an account, browsing our available courses, and submitting an application through our website."
  },
  {
    question: "What types of loans do you provide consultation for?",
    answer: "We provide consultation for education loans, including both domestic and international study programs. Our experts help you understand different loan options and guide you through the application process."
  },
  {
    question: "Do you offer online counselling sessions?",
    answer: "Yes, we offer both online and in-person counselling sessions. You can choose the format that works best for you when scheduling a session."
  },
  {
    question: "How long does the application process take?",
    answer: "The application process typically takes 2-3 business days. We'll keep you updated on the status of your application through your dashboard."
  }
];

export default function FAQ() {
  return (
    <section className="py-20 bg-secondary/5">
      <div className="container px-4">
        <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
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