"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  course_id: string;
  status: string;
  created_at: string;
  course: {
    name: string;
    type: string;
  };
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          course:courses(name, type)
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    };

    fetchApplications();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Button>New Application</Button>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{application.course.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {application.course.type}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : application.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {application.status.replace("_", " ").toUpperCase()}
                </span>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Applied on {new Date(application.created_at).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && (
          <Card>
            <CardContent className="text-center py-6">
              <p className="text-muted-foreground">No applications found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}