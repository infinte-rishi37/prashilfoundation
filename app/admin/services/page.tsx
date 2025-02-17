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

// Make most fields optional
const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  category_id: z.string().min(1, "Category is required"),
  min_amount: z.number().min(0).optional(),
  max_amount: z.number().min(0).optional(),
  interest_rate: z.number().min(0).optional(),
  processing_fee: z.number().min(0).optional(),
  duration: z.string().optional(),
  requirements: z.array(z.string()),
  documents_required: z.array(z.string())
});

type ServiceForm = z.infer<typeof serviceSchema>;

export default function ManageServicesPage() {
  const [activeTab, setActiveTab] = useState("loan");
  const [services, setServices] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
    watch,
    formState: { errors },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      requirements: [],
      documents_required: []
    }
  });

  const fetchServices = async () => {
    setContent(false);
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('finance_categories')
      .select('*')
      .eq('type', activeTab)
      .order('name');

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError);
      return;
    }

    setCategories(categoriesData || []);

    const { data: servicesData, error: servicesError } = await supabase
      .from('finance_services')
      .select(`
        *,
        category:finance_categories(*)
      `)
      .order('name');

    if (servicesError) {
      console.error('Error fetching services:', servicesError);
      return;
    }

    const filteredServices = servicesData?.filter(
      service => service.category.type === activeTab
    ) || [];

    setServices(filteredServices);
    setContent(true);
  };

  useEffect(() => {
    fetchServices();
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setEditingService(null);
    setActiveTab(value);
    fetchServices();
    setSearchTerm("");
    reset();
  };

  const onSubmit = async (data: ServiceForm) => {
    setIsLoading(true);
    try {
      if (editingService) {
        const { error } = await supabase
          .from('finance_services')
          .update(data)
          .eq('id', editingService.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Service updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('finance_services')
          .insert([data]);

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

    setValue("name", service.name);
    setValue("description", service.description);
    setValue("category_id", service.category_id);
    setValue("min_amount", service.min_amount);
    setValue("max_amount", service.max_amount);
    setValue("interest_rate", service.interest_rate);
    setValue("processing_fee", service.processing_fee);
    setValue("duration", service.duration);
    setValue("requirements", service.requirements);
    setValue("documents_required", service.documents_required);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('finance_services')
      .delete()
      .eq('id', id);

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

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCategory = categories.find(
    cat => cat.id === watch('category_id')
  );

  return (
    <div className="space-y-4">
      <div className="flex h-20 justify-between items-center">
        <h1 className="text-3xl font-bold">Manage Services</h1>
        <Button onClick={() => {
          setEditingService(null);
          reset();
          setIsDialogOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4 flex-wrap gap-2 h-20">
          <Tabs defaultValue="loan" className="flex-1 min-w-[250px]" onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="loan">Loan Services</TabsTrigger>
              <TabsTrigger value="document">Document Services</TabsTrigger>
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
                {editingService ? "Edit" : "Add New"} {activeTab === 'loan' ? 'Loan' : 'Document'} Service
              </DialogTitle>
              <DialogDescription>
                Fill in the service details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select
                onValueChange={(value) => setValue("category_id", value)}
                defaultValue={editingService?.category_id}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Service Name"
                {...register("name")}
                className={errors.name ? "border-destructive" : ""}
              />

              <Textarea
                placeholder="Description"
                {...register("description")}
                className={errors.description ? "border-destructive" : ""}
              />

              {activeTab === 'loan' && (
                <>
                  <Input
                    type="number"
                    placeholder="Minimum Amount"
                    {...register("min_amount", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Maximum Amount"
                    {...register("max_amount", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Interest Rate (%)"
                    {...register("interest_rate", { valueAsNumber: true })}
                  />
                  <Input
                    type="number"
                    placeholder="Processing Fee (%)"
                    {...register("processing_fee", { valueAsNumber: true })}
                  />
                  <Input
                    placeholder="Duration"
                    {...register("duration")}
                  />
                </>
              )}

              <Textarea
                placeholder="Requirements (one per line)"
                {...register("requirements")}
                onChange={(e) => setValue("requirements", e.target.value.split('\n'))}
                value={watch("requirements")?.join('\n')}
              />

              <Textarea
                placeholder="Required Documents (one per line)"
                {...register("documents_required")}
                onChange={(e) => setValue("documents_required", e.target.value.split('\n'))}
                value={watch("documents_required")?.join('\n')}
              />

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? "Saving..." : (editingService ? "Update" : "Create")}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4 h-[calc(100vh-250px)] overflow-y-auto">
          {content ? (filteredServices.map((service) => (
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
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      CATEGORY
                    </p>
                    <p className="text-sm">
                      {service.category.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      DESCRIPTION
                    </p>
                    <p className="text-sm">
                      {service.description}
                    </p>
                  </div>
                  {service.min_amount && (
                    <>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          AMOUNT RANGE
                        </p>
                        <p className="text-sm">
                          ₹{service.min_amount.toLocaleString()} - ₹{service.max_amount.toLocaleString()}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          INTEREST RATE
                        </p>
                        <p className="text-sm">
                          {service.interest_rate}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          PROCESSING FEE
                        </p>
                        <p className="text-sm">
                          {service.processing_fee}%
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          DURATION
                        </p>
                        <p className="text-sm">
                          {service.duration}
                        </p>
                      </div>
                    </>
                  )}
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      REQUIREMENTS
                    </p>
                    <ul className="text-sm list-disc list-inside">
                      {service.requirements.map((req: string, i: number) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      REQUIRED DOCUMENTS
                    </p>
                    <ul className="text-sm list-disc list-inside">
                      {service.documents_required.map((doc: string, i: number) => (
                        <li key={i}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))) : (
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