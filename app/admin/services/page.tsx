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
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Pencil, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["Domestic", "Abroad"]),
  mode: z.enum(["Online", "Offline"]).optional(),
  fees: z.number().min(0, "Fees must be positive"),
  startDate: z.string().optional(),
  location: z.string().optional(),
  category: z.enum(["career_counselling", "college_admission"]).optional(),
  minAmount: z.number().min(0).optional(),
  maxAmount: z.number().min(0).optional(),
  interestRate: z.number().min(0).optional(),
  processingFee: z.number().min(0).optional(),
  duration: z.string().optional(),
  minStudents: z.number().min(0).optional(),
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function ManageServicesPage() {
  const [activeTab, setActiveTab] = useState("educare");
  const [services, setServices] = useState<any[]>([]);
  const [editingService, setEditingService] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
  });

  const fetchServices = async (type: string) => {
    let table = "";
    switch (type) {
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
      console.error(`Error fetching ${type} services:`, error);
      return;
    }

    setServices(data || []);
  };

  useEffect(() => {
    fetchServices(activeTab);
  }, [activeTab]);

  const handleTabChange = (value: string) => { 
    setEditingService(null);
    setActiveTab(value);
    fetchServices(value);
    setSearchTerm("");
    reset();
  };

  const onSubmitForm = async (data: ServiceForm) => {
    setIsLoading(true);
    alert("submitted");
    let table = "";
    let serviceData = {};

    switch (activeTab) {
      case "educare":
        table = "courses";
        serviceData = {
          name: data.name,
          type: data.type,
          mode: data.mode,
          fees: data.fees,
          start_date: data.startDate,
        };
        break;
      case "eduguide":
        table = "eduguide_services";
        serviceData = {
          name: data.name,
          description: data.description,
          category: data.category,
          fee: data.fees,
          min_students: data.minStudents,
          location: data.location,
        };
        break;
      case "finance":
        table = "finance_services";
        serviceData = {
          name: data.name,
          description: data.description,
          type: data.type,
          min_amount: data.minAmount,
          max_amount: data.maxAmount,
          interest_rate: data.interestRate,
          processing_fee: data.processingFee,
          duration: data.duration,
        };
        break;
    }

    try {
      if (editingService) {
        const { error } = await supabase
          .from(table)
          .update(serviceData)
          .eq("id", editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from(table)
          .insert([serviceData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service created successfully.",
        });
      }

      reset();
      setEditingService(null);
      router.refresh();
      await fetchServices(activeTab);
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
    Object.keys(service).forEach((key) => {
      setValue(key as any, service[key]);
    });
  };

  const handleDelete = async (id: string) => {
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

    const { error } = await supabase
      .from(table)
      .delete()
      .eq("id", id);

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
    await fetchServices(activeTab);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex h-20 justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              {editingService ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
              {editingService ? "Edit Service" : "Add Service"}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-scroll">
            <DialogHeader>
              <DialogTitle>
                {(editingService ? "Edit " : "Add New ") + activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + " Service"}
              </DialogTitle>
              <DialogDescription>
                Fill in the service details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
              <Input
                placeholder="Service Name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}

              {(activeTab === "eduguide" || activeTab === "finance") && (
                <Textarea
                  placeholder="Description"
                  {...register("description")}
                  className={errors.description ? "border-destructive" : ""}
                />
              )}

              {(activeTab === "educare" || activeTab === "finance") && (
                <Select
                  onValueChange={(value) => setValue("type", value as "Domestic" | "Abroad")}
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
              )}

              {activeTab === "educare" && (
                <Select
                  onValueChange={(value) => setValue("mode", value as "Online" | "Offline")}
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
              )}

              {activeTab === "eduguide" && (
                <Select
                  onValueChange={(value) => setValue("category", value as "career_counselling" | "college_admission")}
                  defaultValue={editingService?.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="career_counselling">Career Counselling</SelectItem>
                    <SelectItem value="college_admission">College Admission</SelectItem>
                  </SelectContent>
                </Select>
              )}

              <Input
                type="number"
                placeholder="Fees"
                {...register("fees", { valueAsNumber: true })}
                className={errors.fees ? "border-destructive" : ""}
              />

              {activeTab === "educare" && (
                <Input
                  type="date"
                  placeholder="Start Date"
                  {...register("startDate")}
                />
              )}

              {activeTab === "eduguide" && (
                <>
                  <Input
                    type="number"
                    placeholder="Minimum Students"
                    {...register("minStudents", { valueAsNumber: true })}
                  />
                  <Input
                    placeholder="Location"
                    {...register("location")}
                  />
                </>
              )}

              {activeTab === "finance" && (
                <>
                  <Input
                    type="number"
                    placeholder="Minimum Amount"
                    {...register("minAmount", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Maximum Amount"
                    {...register("maxAmount", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Interest Rate"
                    {...register("interestRate", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Processing Fee"
                    {...register("processingFee", { valueAsNumber: true })}
                  />
                  <Input
                    placeholder="Duration"
                    {...register("duration")}
                  />
                </>
              )}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : (editingService ? "Update" : "Create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 flex-wrap gap-2 h-20">
          <Tabs defaultValue="educare" className="flex-1 min-w-[250px]" onValueChange={handleTabChange}>
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

        <div className="grid gap-4 h-[calc(100vh-250px)] overflow-scroll">
          {filteredServices.map((service) => (
            <Card key={service.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">{service.name}</CardTitle>
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
                    if (key === "id" || key === "created_at" || key === "updated_at") return null;
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
          ))}

          {filteredServices.length === 0 && (
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