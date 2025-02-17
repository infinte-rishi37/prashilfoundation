"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Pencil, Trash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Define individual schemas for each service type
const educareSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(["Domestic", "Abroad"]),
  mode: z.enum(["Online", "Offline"]),
  fees: z.number().min(0, "Fees must be positive"),
  start_date: z.string(),
});

const eduguideSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(["career_counselling", "college_admission"]),
  fee: z.number().min(0, "Fee must be positive"),
  min_students: z.number().optional(),
  location: z.string().optional(),
});

const financeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.enum(["loan", "document"]),
  description: z.string().min(1, "Description is required"),
});

// Create types for each schema
type EducareForm = z.infer<typeof educareSchema>;
type EduguideForm = z.infer<typeof eduguideSchema>;
type FinanceForm = z.infer<typeof financeSchema>;

// The union type for our form
type ServiceForm = EducareForm | EduguideForm | FinanceForm;

export default function ManageServicesPage() {
  const [activeTab, setActiveTab] = useState("educare");
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(
      activeTab === "educare"
        ? educareSchema
        : activeTab === "eduguide"
        ? eduguideSchema
        : financeSchema
    ),
  });

  const fetchServices = async () => {
    setContent(false);
    let table = "";
    switch (activeTab) {
      case "educare":
        table = "courses";
        break;
      case "eduguide":
        table = "eduguide_services";
        break;
      case "finance":
        table = "finance_services";
        break;
    }

    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching ${activeTab} services:`, error);
      return;
    }

    setServices(data || []);
    setContent(true);
  };

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setEditingService(null);
    setActiveTab(value);
    setSearchTerm("");
    reset();
  };

  const onSubmit = async (data: ServiceForm) => {
    setIsLoading(true);
    try {
      const table =
        activeTab === "educare"
          ? "courses"
          : activeTab === "eduguide"
          ? "eduguide_services"
          : "finance_services";

      if (editingService) {
        const { error } = await supabase
          .from(table)
          .update(data)
          .eq("id", editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        const { error } = await supabase.from(table).insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }

      setIsDialogOpen(false);
      reset();
      setEditingService(null);
      router.refresh();
      await fetchServices();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleEdit = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);

    // Set form values based on service type
    if (activeTab === "educare") {
      setValue("name", service.name);
      setValue("type", service.type);
      setValue("mode", service.mode);
      setValue("fees", service.fees);
      setValue("start_date", service.start_date);
    } else if (activeTab === "eduguide") {
      setValue("name", service.name);
      setValue("description", service.description);
      setValue("category", service.category);
      setValue("fee", service.fee);
      setValue("min_students", service.min_students);
      setValue("location", service.location);
    } else {
      setValue("name", service.name);
      setValue("category", service.category);
      setValue("description", service.description);
    }
  };

  const handleDelete = async (id: string) => {
    const table =
      activeTab === "educare"
        ? "courses"
        : activeTab === "eduguide"
        ? "eduguide_services"
        : "finance_services";

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete service.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Service deleted successfully.",
    });

    router.refresh();
    await fetchServices();
  };

  const filteredServices = services.filter((service) => {
    const searchField =
      activeTab === "finance" ? (service.name ?? "") : (service.name ?? "");
    return searchField.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <div className="flex h-20 justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Button
          onClick={() => {
            setEditingService(null);
            reset();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 flex-wrap gap-2 h-20">
          <Tabs
            defaultValue="educare"
            className="flex-1 min-w-[250px]"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="educare">Educare</TabsTrigger>
              <TabsTrigger value="eduguide">EduGuide</TabsTrigger>
              <TabsTrigger value="finance">Finance</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingService
                  ? "Edit"
                  : "Add New"}{" "}
                {activeTab.charAt(0).toUpperCase() +
                  activeTab.slice(1)}{" "}
                Service
              </DialogTitle>
              <DialogDescription>
                Fill in the service details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {activeTab === "educare" && (
                <>
                  <Input
                    placeholder="Service Name"
                    {...register("name")}
                    className={
                      (errors as Partial<EducareForm>).name
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      setValue("type", value as "Domestic" | "Abroad")
                    }
                    defaultValue={editingService?.type}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Domestic">Domestic</SelectItem>
                      <SelectItem value="Abroad">Abroad</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select
                    onValueChange={(value) =>
                      setValue("mode", value as "Online" | "Offline")
                    }
                    defaultValue={editingService?.mode}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Online">Online</SelectItem>
                      <SelectItem value="Offline">Offline</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Fees"
                    {...register("fees", { valueAsNumber: true })}
                    className={
                      (errors as Partial<EducareForm>).fees
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Input
                    type="date"
                    placeholder="Start Date"
                    {...register("start_date")}
                    className={
                      (errors as Partial<EducareForm>).start_date
                        ? "border-destructive"
                        : ""
                    }
                  />
                </>
              )}

              {activeTab === "eduguide" && (
                <>
                  <Input
                    placeholder="Service Name"
                    {...register("name")}
                    className={
                      (errors as Partial<EduguideForm>).name
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    {...register("description")}
                    className={
                      (errors as Partial<EduguideForm>).description
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      setValue(
                        "category",
                        value as "career_counselling" | "college_admission"
                      )
                    }
                    defaultValue={editingService?.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="career_counselling">
                        Career Counselling
                      </SelectItem>
                      <SelectItem value="college_admission">
                        College Admission
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Fee"
                    {...register("fee", { valueAsNumber: true })}
                    className={
                      (errors as Partial<EduguideForm>).fee
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Minimum Students"
                    {...register("min_students", { valueAsNumber: true })}
                    className={
                      (errors as Partial<EduguideForm>).min_students
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Input placeholder="Location" {...register("location")} />
                </>
              )}

              {activeTab === "finance" && (
                <>
                  <Input
                    placeholder="Service Name"
                    {...register("name")}
                    className={
                      (errors as Partial<FinanceForm>).name
                        ? "border-destructive"
                        : ""
                    }
                  />
                  <Select
                    onValueChange={(value) =>
                      setValue("category", value as "loan" | "document")
                    }
                    defaultValue={editingService?.category}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="loan">Loan</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                    </SelectContent>
                  </Select>
                  <Textarea
                    placeholder="Description"
                    {...register("description")}
                    className={
                      (errors as Partial<FinanceForm>).description
                        ? "border-destructive"
                        : ""
                    }
                  />
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : editingService ? "Update" : "Create"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 h-[calc(100vh-250px)] overflow-y-auto">
          {content ? (
            filteredServices.map((service) => (
              <Card key={service.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xl">
                    {activeTab === "finance" ? service.name : service.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(service.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(service).map(([key, value]) => {
                      if (
                        key === "id" ||
                        key === "created_at" ||
                        key === "updated_at" ||
                        value === null
                      )
                        return null;
                      return (
                        <div key={key} className="space-y-1">
                          <p className="text-sm font-medium text-muted-foreground">
                            {key.replace(/_/g, " ").toUpperCase()}
                          </p>
                          <p className="text-sm">
                            {typeof value === "number"
                              ? value.toLocaleString()
                              : String(value)}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {filteredServices.length === 0 && content && (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">No services found</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}