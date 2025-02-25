"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import FAQ from "@/components/FAQ";

const supportSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportForm = z.infer<typeof supportSchema>;

export default function SupportPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
  });

  const onSubmit = async (data: SupportForm) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("messages")
        .insert({
          user_id: user.id,
          subject: data.subject,
          content: data.message,
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your support request has been submitted.",
      });
      reset();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit support request",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Support</h1>

      <FAQ section="support" />

      <Card>
        <CardHeader>
          <CardTitle>Contact Support</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Subject"
                {...register("subject")}
                className={errors.subject ? "border-destructive" : ""}
              />
              {errors.subject && (
                <p className="text-sm text-destructive">{errors.subject.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Message"
                {...register("message")}
                className={errors.message ? "border-destructive" : ""}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}