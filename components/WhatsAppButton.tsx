"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClick = (type: 'Domestic' | 'Abroad') => {
    const phoneNumber = type === 'Domestic' ? '917621071739' : '917061214923';
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
  };

  return isVisible ? (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact Us on WhatsApp</DialogTitle>
          <DialogDescription>
            Choose your preferred contact option below
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <Button onClick={() => handleClick('Domestic')} className="w-full">
            Domestic
          </Button>
          <Button onClick={() => handleClick('Abroad')} className="w-full">
            Abroad
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  ) : null;
}