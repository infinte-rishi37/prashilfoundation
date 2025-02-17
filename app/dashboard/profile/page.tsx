"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  full_name: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Address is required"),
  employment_type: z.enum(["salaried", "business", "self_employed"], {
    required_error: "Employment type is required",
  }),
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
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
  });

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    
    setAvatar(user.user_metadata.avatar_url || "");
    setAvatar(user.user_metadata.avatar_url || "");
    setName(user.user_metadata.full_name || "");

    const [userData, profileData] = await Promise.all([
      supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single(),
      supabase
        .from("user_profiles")
        .select("*")
        .eq("id", user.id)
        .single()
    ]);

    if (userData.data) {
      setValue("username", userData.data.username);
      setValue("email", userData.data.email);
    }

    if (profileData.data) {
      setValue("full_name", profileData.data.full_name || name);
      setValue("address", profileData.data.address);
      setValue("employment_type", profileData.data.employment_type);
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

      const [userUpdate, profileUpdate] = await Promise.all([
        supabase
          .from("users")
          .update({
            username: data.username,
            email: data.email,
          })
          .eq("id", user.id),
        supabase
          .from("user_profiles")
          .upsert({
            id: user.id,
            full_name: data.full_name || name,
            address: data.address,
            employment_type: data.employment_type
          })
      ]);

      if (userUpdate.error) throw userUpdate.error;
      if (profileUpdate.error) throw profileUpdate.error;

      toast({
        title: "Success!",
        description: "Your profile has been updated.",
      });

      router.refresh();
      fetchProfile();
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
    fetchProfile();
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {avatar && (
              <Avatar className="h-20 w-20">
                <img src={avatar} alt="Profile" />
              </Avatar>
            )}
            
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

            <div className="space-y-2">
              <Input
                placeholder="Full Name"
                {...register("full_name")}
                className={errors.full_name ? "border-destructive" : ""}
              />
              {errors.full_name && (
                <p className="text-sm text-destructive">{errors.full_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Input
                placeholder="Address"
                {...register("address")}
                className={errors.address ? "border-destructive" : ""}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Select
                onValueChange={(value) => setValue("employment_type", value as any)}
                value={watch("employment_type") || ""}
              >
                <SelectTrigger className={errors.employment_type ? "border-destructive" : ""}>
                  <SelectValue placeholder="Employment Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="salaried">Salaried</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                </SelectContent>
              </Select>
              {errors.employment_type && (
                <p className="text-sm text-destructive">{errors.employment_type.message}</p>
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