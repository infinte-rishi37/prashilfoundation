"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

type Application = {
  id: string;
  status: string;
  admin_response: string | null;
  created_at: string;
  responded_at: string | null;
  user: {
    email: string;
    username: string;
  };
  course: {
    name: string;
    type: string;
  };
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *,
          user:users(email, username),
          course:courses(name, type)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    };

    fetchApplications();
  }, []);

  const handleResponse = async (applicationId: string) => {
    const response = responses[applicationId];
    if (!response) return;

    const { error } = await supabase
      .from("applications")
      .update({ 
        admin_response: response,
        status: 'in_progress'
      })
      .eq("id", applicationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send response. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Response sent successfully.",
    });

    setApplications(applications.map(app => 
      app.id === applicationId ? { 
        ...app, 
        admin_response: response,
        status: 'in_progress'
      } : app
    ));
    setResponses({ ...responses, [applicationId]: "" });
  };

  const handleStatusUpdate = async (applicationId: string, status: string) => {
    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Status updated successfully.",
    });

    setApplications(applications.map(app => 
      app.id === applicationId ? { ...app, status } : app
    ));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Applications</h1>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{application.course.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    From: {application.user.username} ({application.user.email})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Course Type: {application.course.type}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusUpdate(application.id, e.target.value)}
                    className="text-sm border rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : application.status === "in_progress"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {application.status.replace("_", " ").toUpperCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {application.admin_response ? (
                  <div className="bg-primary/5 p-4 rounded-lg">
                    <p className="font-semibold mb-2">Your Response:</p>
                    <p>{application.admin_response}</p>
                    {application.responded_at && (
                      <p className="text-sm text-muted-foreground mt-2">
                        Responded on {new Date(application.responded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your response..."
                      value={responses[application.id] || ""}
                      onChange={(e) => setResponses({
                        ...responses,
                        [application.id]: e.target.value
                      })}
                    />
                    <Button 
                      onClick={() => handleResponse(application.id)}
                      disabled={!responses[application.id]}
                    >
                      Send Response
                    </Button>
                  </div>
                )}
              </div>
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