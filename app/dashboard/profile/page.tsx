"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    console.log(user.user_metadata);
    setAvatar(user.user_metadata.avatar_url);
    setAvatar(user.user_metadata.avatar_url);
    setName(user.user_metadata.full_name);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }

    if (data) {
      setValue("username", data.username);
      setValue("email", data.email);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [setValue]);

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from("users")
        .update({
          username: data.username,
          email: data.email,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });

      // Refresh data
      router.refresh();
      fetchProfile(); // Add this function to refetch data
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {avatar !== "" && (<Avatar className="h-20 w-20">
                <img 
                  src = {avatar}
                />
            </Avatar>)}
            {name != "" && (<div className="space-y-2">
              {name}
            </div>)}
            <div className="space-y-2">
              <Input
                placeholder="Username"
                {...register("username")}
                className={errors.username ? "border-destructive" : ""}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                {...register("email")}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}