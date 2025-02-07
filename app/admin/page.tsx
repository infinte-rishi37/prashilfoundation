"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Mail, Users, Clock, GraduationCap, BookOpen, PiggyBank, CheckCircle } from "lucide-react";

type DashboardStats = {
  totalMessages: number;
  unrespondedMessages: number;
  totalUsers: number;
  recentMessages: number;
  pendingApplications: number;
  totalEnrollments: {
    educare: number;
    eduguide: number;
    finance: number;
  };
  successfulEnrollments: number;
};

type RecentUser = {
  username: string;
  email: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unrespondedMessages: 0,
    totalUsers: 0,
    recentMessages: 0,
    pendingApplications: 0,
    totalEnrollments: {
      educare: 0,
      eduguide: 0,
      finance: 0
    },
    successfulEnrollments: 0
  });
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const [
        messages,
        users,
        recentMessages,
        unrespondedMessages,
        pendingApplications,
        educareEnrollments,
        eduguideEnrollments,
        financeEnrollments,
        successfulEnrollments,
        latestUsers
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
          .eq("status", "approved"),
        supabase
          .from("users")
          .select("username, email, created_at")
          .order("created_at", { ascending: false })
          .limit(5)
      ]);

      setStats({
        totalMessages: messages.count || 0,
        unrespondedMessages: unrespondedMessages.count || 0,
        totalUsers: users.count || 0,
        recentMessages: recentMessages.count || 0,
        pendingApplications: pendingApplications.count || 0,
        totalEnrollments: {
          educare: educareEnrollments.count || 0,
          eduguide: eduguideEnrollments.count || 0,
          finance: financeEnrollments.count || 0
        },
        successfulEnrollments: successfulEnrollments.count || 0
      });

      if (latestUsers.data) {
        setRecentUsers(latestUsers.data);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
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

      {/* Recent Users */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.email} className="flex items-center justify-between border-b pb-4 last:border-0">
                <div>
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <p className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}