"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Mail, Users, Clock, GraduationCap, BookOpen, PiggyBank, CheckCircle, Bell } from "lucide-react";

type DashboardStats = {
  totalMessages: number;
  unrespondedMessages: number;
  totalUsers: number;
  recentMessages: number;
  pendingApplications: number;
  newApplications: number;
  newRegistrations: number;
  totalEnrollments: {
    educare: number;
    eduguide: number;
    finance: number;
  };
  successfulEnrollments: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unrespondedMessages: 0,
    totalUsers: 0,
    recentMessages: 0,
    pendingApplications: 0,
    newApplications: 0,
    newRegistrations: 0,
    totalEnrollments: {
      educare: 0,
      eduguide: 0,
      finance: 0
    },
    successfulEnrollments: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [
        messages,
        users,
        recentMessages,
        unrespondedMessages,
        pendingApplications,
        newApplications,
        newRegistrations,
        educareEnrollments,
        eduguideEnrollments,
        financeEnrollments,
        successfulEnrollments
      ] = await Promise.all([
        supabase.from("messages").select("*", { count: "exact" }),
        supabase.from("users").select("*", { count: "exact" }),
        supabase
          .from("messages")
          .select("*", { count: "exact" })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from("messages")
          .select("*", { count: "exact" })
          .is("admin_response", null),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .eq("status", "pending"),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from("users")
          .select("*", { count: "exact" })
          .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .eq("service_type", "educare"),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .eq("service_type", "eduguide"),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .eq("service_type", "finance"),
        supabase
          .from("applications")
          .select("*", { count: "exact" })
          .eq("status", "approved")
      ]);

      setStats({
        totalMessages: messages.count || 0,
        unrespondedMessages: unrespondedMessages.count || 0,
        totalUsers: users.count || 0,
        recentMessages: recentMessages.count || 0,
        pendingApplications: pendingApplications.count || 0,
        newApplications: newApplications.count || 0,
        newRegistrations: newRegistrations.count || 0,
        totalEnrollments: {
          educare: educareEnrollments.count || 0,
          eduguide: eduguideEnrollments.count || 0,
          finance: financeEnrollments.count || 0
        },
        successfulEnrollments: successfulEnrollments.count || 0
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingApplications}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unresponded Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unrespondedMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Successful Enrollments</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulEnrollments}</div>
          </CardContent>
        </Card>
      </div>

      {/* Enrollment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Educare Enrollments</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments.educare}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">EduGuide Enrollments</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments.eduguide}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Finance Enrollments</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnrollments.finance}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.newRegistrations > 0 && (
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">New User Registrations</p>
                    <p className="text-sm text-muted-foreground">In the last 24 hours</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{stats.newRegistrations}</span>
              </div>
            )}
            {stats.newApplications > 0 && (
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">New Applications</p>
                    <p className="text-sm text-muted-foreground">In the last 24 hours</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{stats.newApplications}</span>
              </div>
            )}
            {stats.pendingApplications > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Total Pending Applications</p>
                    <p className="text-sm text-muted-foreground">Awaiting review</p>
                  </div>
                </div>
                <span className="text-lg font-bold">{stats.pendingApplications}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}