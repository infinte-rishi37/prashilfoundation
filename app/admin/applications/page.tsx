"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Application, Course, EduGuideService, FinanceService } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();
  const router = useRouter();

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select(`
        *,
        user:users(email, username)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching applications:", error);
      return;
    }

    // Fetch service details for each application
    const applicationsWithServices = await Promise.all(
      (data || []).map(async (app) => {
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
          service: serviceData?.data || null,
        };
      })
    );

    setApplications(applicationsWithServices);
    console.log(applicationsWithServices);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleResponse = async (applicationId: string) => {
    const response = responses[applicationId];
    if (!response) return;

    const { error } = await supabase
      .from("applications")
      .update({ 
        admin_response: response,
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

    // Refresh data
    router.refresh();
    fetchApplications();

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getServiceName(app).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesType = typeFilter === "all" || app.service_type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Applications</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or service..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="educare">Educare</SelectItem>
              <SelectItem value="eduguide">EduGuide</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredApplications.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex justify-between items-start gap-2 flex-wrap">
                <div>
                  <CardTitle>{getServiceName(application)}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Name: {application.user?.username}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: {application.user?.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Service Type: {application.service_type.toUpperCase()} - {getServiceDetails(application)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Select
                    value={application.status}
                    onValueChange={(value) => handleStatusUpdate(application.id, value)}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : application.status === "rejected"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}>
                    {application.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Applied on {new Date(application.created_at).toLocaleDateString()}
                </p>

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

        {filteredApplications.length === 0 && (
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