"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

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

type Course = {
  id: string;
  name: string;
  type: string;
  fees: number;
  start_date: string;
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [applicationsResponse, coursesResponse] = await Promise.all([
        supabase
          .from("applications")
          .select(`
            *,
            course:courses(name, type)
          `)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase
          .from("courses")
          .select("*")
          .order("name", { ascending: true })
      ]);

      if (applicationsResponse.error) {
        console.error("Error fetching applications:", applicationsResponse.error);
        return;
      }

      if (coursesResponse.error) {
        console.error("Error fetching courses:", coursesResponse.error);
        return;
      }

      setApplications(applicationsResponse.data || []);
      setCourses(coursesResponse.data || []);
    };

    fetchData();
  }, []);

  const handleNewApplication = async () => {
    if (!selectedCourse) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("applications")
      .insert({
        user_id: user.id,
        course_id: selectedCourse,
        status: "pending"
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create application. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application submitted successfully."
    });

    // Refresh applications
    const { data } = await supabase
      .from("applications")
      .select(`
        *,
        course:courses(name, type)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setApplications(data);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Applications</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>New Application</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Select onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name} ({course.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                className="w-full" 
                onClick={handleNewApplication}
                disabled={!selectedCourse}
              >
                Submit Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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