"use client";

import { useEffect, useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Pencil, Trash } from "lucide-react";

const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
  section: z.enum(['home', 'educare', 'eduguide', 'finance', 'support']),
  order: z.number().min(0),
});

type FaqForm = z.infer<typeof faqSchema>;

type FAQ = {
  id: string;
  question: string;
  answer: string;
  section: 'home' | 'educare' | 'eduguide' | 'finance' | 'support';
  order: number;
  created_at: string;
  updated_at: string;
};

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);
  const [activeSection, setActiveSection] = useState<FAQ['section']>('home');
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FaqForm>({
    resolver: zodResolver(faqSchema),
    defaultValues: {
      order: 0,
    },
  });

  const fetchFaqs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching FAQs:', error);
      return;
    }

    setFaqs(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const onSubmit = async (data: FaqForm) => {
    setIsLoading(true);
    try {
      if (editingFaq) {
        const { error } = await supabase
          .from('faqs')
          .update(data)
          .eq('id', editingFaq.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ updated successfully.",
        });
      } else {
        const { error } = await supabase
          .from('faqs')
          .insert([data]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "FAQ created successfully.",
        });
      }

      setIsDialogOpen(false);
      reset();
      setEditingFaq(null);
      router.refresh();
      await fetchFaqs();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  const handleEdit = (faq: FAQ) => {
    setEditingFaq(faq);
    setValue("question", faq.question);
    setValue("answer", faq.answer);
    setValue("section", faq.section);
    setValue("order", faq.order);
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete FAQ.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "FAQ deleted successfully.",
    });

    router.refresh();
    await fetchFaqs();
  };

  const filteredFaqs = faqs.filter(faq => faq.section === activeSection);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Manage FAQs</h1>
        <Button
          onClick={() => {
            setEditingFaq(null);
            reset();
            setIsDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-4">
        <Select value={activeSection} onValueChange={(value: FAQ['section']) => setActiveSection(value)}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select section" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="home">Home Page</SelectItem>
            <SelectItem value="educare">Educare</SelectItem>
            <SelectItem value="eduguide">EduGuide</SelectItem>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="support">Support</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingFaq ? "Edit FAQ" : "Add New FAQ"}
              </DialogTitle>
              <DialogDescription>
                Fill in the FAQ details below
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Select
                value={activeSection}
                onValueChange={(value) => setValue("section", value as FAQ['section'])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home Page</SelectItem>
                  <SelectItem value="educare">Educare</SelectItem>
                  <SelectItem value="eduguide">EduGuide</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>

              <Input
                type="number"
                placeholder="Display Order"
                {...register("order", { valueAsNumber: true })}
                className={errors.order ? "border-destructive" : ""}
              />

              <Input
                placeholder="Question"
                {...register("question")}
                className={errors.question ? "border-destructive" : ""}
              />

              <Textarea
                placeholder="Answer"
                {...register("answer")}
                className={errors.answer ? "border-destructive" : ""}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Saving..." : editingFaq ? "Update FAQ" : "Add FAQ"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        <div className="grid gap-4">
          {filteredFaqs.map((faq) => (
            <Card key={faq.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl">
                  {faq.question}
                </CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(faq)}
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
                          This action cannot be undone. This will permanently delete the FAQ.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(faq.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{faq.answer}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Order: {faq.order}
                </p>
              </CardContent>
            </Card>
          ))}

          {filteredFaqs.length === 0 && (
            <Card>
              <CardContent className="text-center py-6">
                <p className="text-muted-foreground">No FAQs found for this section</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}