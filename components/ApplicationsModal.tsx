"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Course, EduGuideService, FinanceService } from "@/lib/types";
import { Search } from "lucide-react";
import ApplicationDialog from "./ApplicationDialog";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type ApplicationsModalProps = {
  courses: Course[];
  eduguideServices: EduGuideService[];
  financeServices: FinanceService[];
  onClose: () => Promise<void>;
  children: React.ReactNode;
};

export default function ApplicationsModal({
  courses,
  eduguideServices,
  financeServices,
  onClose,
  children
}: ApplicationsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    address: "",
    employment_type: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
          setFormData({
            full_name: profile.full_name,
            address: profile.address,
            employment_type: profile.employment_type
          });
        } else {
          setShowProfileForm(true);
        }
      }
    };

    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const handleProfileSubmit = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        ...formData
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
      return;
    }

    setUserProfile(data);
    setShowProfileForm(false);
    toast({
      title: "Success",
      description: "Profile updated successfully."
    });
  };

  const filterItems = <T extends { name: string }>(items: T[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const handleClose = async () => {
    try {
      await onClose();
      console.log('Modal closed successfully');
    } catch (error) {
      console.error('Error closing modal:', error);
    }
  };

  if (showProfileForm) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Your Profile</DialogTitle>
            <DialogDescription>
              Please provide the following information to continue with your application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Select
              value={formData.employment_type}
              onValueChange={(value) => setFormData({ ...formData, employment_type: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Employment Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="salaried">Salaried</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="self_employed">Self Employed</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              className="w-full" 
              onClick={handleProfileSubmit}
              disabled={!formData.full_name || !formData.address || !formData.employment_type}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto" onCloseAutoFocus={handleClose}>
        <DialogHeader>
          <DialogTitle>New Application</DialogTitle>
          <DialogDescription>
            Choose a service to apply for from our available options
          </DialogDescription>
        </DialogHeader>

        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        <Tabs defaultValue="educare" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="educare">Educare</TabsTrigger>
            <TabsTrigger value="eduguide">EduGuide</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="educare" className="space-y-4 overflow-y-auto">
            {filterItems(courses).map((course) => (
              <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{course.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.type} - {course.mode}
                  </p>
                  <p className="text-sm">₹{course.fees.toLocaleString()}</p>
                </div>
                <ApplicationDialog
                  serviceId={course.id}
                  serviceType="educare"
                  name={course.name}
                >
                  <Button onClick={() => setIsOpen(true)}>Apply</Button>
                </ApplicationDialog>
              </div>
            ))}
            {filterItems(courses).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No courses found
              </div>
            )}
          </TabsContent>

          <TabsContent value="eduguide" className="space-y-4">
            {filterItems(eduguideServices).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {service.category.replace('_', ' ').toUpperCase()}
                  </p>
                  <p className="text-sm">₹{service.fee.toLocaleString()}</p>
                </div>
                <ApplicationDialog
                  serviceId={service.id}
                  serviceType="eduguide"
                  name={service.name}
                >
                  <Button onClick={() => setIsOpen(true)}>Apply</Button>
                </ApplicationDialog>
              </div>
            ))}
            {filterItems(eduguideServices).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No guidance services found
              </div>
            )}
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            {filterItems(financeServices).map((service) => (
              <div key={service.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{service.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {service.category.toUpperCase()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </div>
                <ApplicationDialog
                  serviceId={service.id}
                  serviceType="finance"
                  name={service.name}
                >
                  <Button onClick={() => setIsOpen(true)}>Apply</Button>
                </ApplicationDialog>
              </div>
            ))}
            {filterItems(financeServices).length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No financial services found
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}