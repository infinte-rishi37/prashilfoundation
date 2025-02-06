"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { Mail, Users, Clock } from "lucide-react";

type DashboardStats = {
  totalMessages: number;
  unrespondedMessages: number;
  totalUsers: number;
  recentMessages: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalMessages: 0,
    unrespondedMessages: 0,
    totalUsers: 0,
    recentMessages: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const [messages, users, recentMessages] = await Promise.all([
        supabase.from("messages").select("*", { count: "exact" }),
        supabase.from("users").select("*", { count: "exact" }),
        supabase
          .from("messages")
          .select("*", { count: "exact" })
          .gte("created_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);

      const unrespondedMessages = await supabase
        .from("messages")
        .select("*", { count: "exact" })
        .is("admin_response", null);

      setStats({
        totalMessages: messages.count || 0,
        unrespondedMessages: unrespondedMessages.count || 0,
        totalUsers: users.count || 0,
        recentMessages: recentMessages.count || 0,
      });
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMessages}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Responses</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unrespondedMessages}</div>
          </CardContent>
        </Card>

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
            <CardTitle className="text-sm font-medium">Recent Messages</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.recentMessages}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );