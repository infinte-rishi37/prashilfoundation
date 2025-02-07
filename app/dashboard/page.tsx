"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { FileText, Mail, User, GraduationCap, BookOpen, PiggyBank } from "lucide-react";

type DashboardStats = {
  totalApplications: number;
  incompleteApplications: number;
  unreadMessages: number;
  enrollments: {
    educare: number;
    eduguide: number;
    finance: number;
  };
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalApplications: 0,
    incompleteApplications: 0,
    unreadMessages: 0,
    enrollments: {
      educare: 0,
      eduguide: 0,
      finance: 0
    }
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [
        applications,
        messages,
        educareEnrollments,
        eduguideEnrollments,
        financeEnrollments
      ] = await Promise.all([
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("messages")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_read", false),
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .eq("service_type", "educare")
          .eq("status", "approved"),
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .eq("service_type", "eduguide")
          .eq("status", "approved"),
        supabase
          .from("applications")
          .select("*")
          .eq("user_id", user.id)
          .eq("service_type", "finance")
          .eq("status", "approved")
      ]);

      setStats({
        totalApplications: applications.data?.length || 0,
        incompleteApplications: applications.data?.filter(a => a.status !== "approved").length || 0,
        unreadMessages: messages.data?.length || 0,
        enrollments: {
          educare: educareEnrollments.data?.length || 0,
          eduguide: eduguideEnrollments.data?.length || 0,
          finance: financeEnrollments.data?.length || 0
        }
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Incomplete Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incompleteApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Educare Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrollments.educare}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">EduGuide Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrollments.eduguide}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Finance Enrollments</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.enrollments.finance}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}