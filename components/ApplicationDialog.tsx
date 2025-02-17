"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { ServiceType } from "@/lib/types";
import { useRouter } from "next/navigation";

type ApplicationDialogProps = {
  serviceId: string;
  serviceType: ServiceType;
  name: string;
  children: React.ReactNode;
};

export default function ApplicationDialog({
  serviceId,
  serviceType,
  name,
  children
}: ApplicationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleApply = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Check if user profile exists for finance services
      if (serviceType === 'finance') {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (!profile) {
          toast({
            title: "Profile Required",
            description: "Please complete your profile before applying for financial services.",
            variant: "destructive",
          });
          router.push('/dashboard/profile');
          return;
        }
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          service_type: serviceType,
          service_id: serviceId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Application submitted successfully.",
      });

      router.refresh();
      setIsConfirmOpen(false);
      setIsOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply for {name}</DialogTitle>
          <DialogDescription>
            Would you like to apply for this service? You can track your application status in your dashboard.
            {serviceType === 'finance' && (
              <p className="mt-2 text-sm text-muted-foreground">
                Note: You need to complete your profile with employment details before applying for financial services.
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
          <AlertDialogTrigger asChild>
            <Button className="w-full">Continue</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Application</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to apply for {name}? This will create a new application that you can track in your dashboard.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleApply} disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Application"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DialogContent>
    </Dialog>
  );
}