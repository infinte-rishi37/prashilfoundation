"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Application, Course, EduGuideService, FinanceService } from "@/lib/types";
import ApplicationsModal from "@/components/ApplicationsModal";
import { useRouter } from "next/navigation";
import { sendStatusCode } from "next/dist/server/api-utils";
import { set } from "date-fns";
import { Loader2 } from "lucide-react";

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [eduguideServices, setEduguideServices] = useState<EduGuideService[]>([]);
  const [financeServices, setFinanceServices] = useState<FinanceService[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  const fetchApplications = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [
      applicationsRes,
      coursesRes,
      eduguideRes,
      financeRes
    ] = await Promise.all([
      supabase
        .from("applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("courses")
        .select("*")
        .order("name", { ascending: true }),
      supabase
        .from("eduguide_services")
        .select("*")
        .order("name", { ascending: true }),
      supabase
        .from("finance_services")
        .select("*")
        .order("name", { ascending: true })
    ]);

    if (applicationsRes.error) {
      console.error("Error fetching applications:", applicationsRes.error);
      return;
    }

    // Fetch service details for each application
    const applicationsWithServices = await Promise.all(
      (applicationsRes.data || []).map(async (app) => {
        let serviceData;
        switch (app.service_type) {
          case "educare":
            serviceData = await supabase
              .from("courses")
              .select("*")
              .eq("id", app.service_id)
              .single();
            break;
          case "eduguide":
            serviceData = await supabase
              .from("eduguide_services")
              .select("*")
              .eq("id", app.service_id)
              .single();
            break;
          case "finance":
            serviceData = await supabase
              .from("finance_services")
              .select("*")
              .eq("id", app.service_id)
              .single();
            break;
        }
        return {
          ...app,
          service: serviceData?.data || null
        };
      })
    );

    setApplications(applicationsWithServices);
    setCourses(coursesRes.data || []);
    setEduguideServices(eduguideRes.data || []);
    setFinanceServices(financeRes.data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleDelete = async (applicationId: string) => {
    const { error } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete application. Please try again.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Application deleted successfully."
    });

    // Refresh data
    router.refresh();
    fetchApplications();
  };

  const getServiceName = (application: Application) => {
    if (!application.service) return "Unknown Service";
    return application.service.name;
  };

  const getServiceDetails = (application: Application) => {
    if (!application.service) return null;

    switch (application.service_type) {
      case "educare":
        const course = application.service as Course;
        return `${course.type} - ${course.mode}`;
      case "eduguide":
        const eduguide = application.service as EduGuideService;
        return eduguide.category.replace("_", " ").toUpperCase();
      case "finance":
        const finance = application.service as FinanceService;
        return finance.type;
      default:
        return null;
    }
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
      <div className="flex justify-between items-center flex-wrap gap-5">
        <h1 className="text-3xl font-bold">Applications</h1>
        <ApplicationsModal
          courses={courses}
          eduguideServices={eduguideServices}
          financeServices={financeServices}
          onClose={fetchApplications}
        >
          <Button>New Application</Button>
        </ApplicationsModal>
      </div>

      <div className="grid gap-6">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{getServiceName(application)}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {getServiceDetails(application)}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  application.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : application.status === "rejected"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  {application.status.toUpperCase()}
                </span>
                {application.status === "pending" && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">Delete</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your application.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(application.id)}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(application.created_at).toLocaleDateString()}
                </p>
                {application.admin_response && (
                  <div className="mt-4 p-4 bg-secondary/5 rounded-lg">
                    <p className="font-medium mb-2">Admin Response:</p>
                    <p className="text-sm text-muted-foreground">{application.admin_response}</p>
                    {application.responded_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Responded on {new Date(application.responded_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {applications.length === 0 && !isLoading && (
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