"use client";

import { useState } from "react";
import {
  Dialog,
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
import { Course, EduGuideService, FinanceService } from "@/lib/types";
import { Search } from "lucide-react";
import ApplicationDialog from "./ApplicationDialog";

type ApplicationsModalProps = {
  courses: Course[];
  eduguideServices: EduGuideService[];
  financeServices: FinanceService[];
  children: React.ReactNode;
};

export default function ApplicationsModal({
  courses,
  eduguideServices,
  financeServices,
  children
}: ApplicationsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filterItems = <T extends { name: string }>(items: T[]) => {
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
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

          <TabsContent value="educare" className="space-y-4">
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
                  serviceName={course.name}
                >
                  <Button onClick={() => setIsOpen(false)}>Apply</Button>
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
                  serviceName={service.name}
                >
                  <Button onClick={() => setIsOpen(false)}>Apply</Button>
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
                  <p className="text-sm text-muted-foreground">{service.type}</p>
                  <p className="text-sm">
                    ₹{service.min_amount.toLocaleString()} - ₹{service.max_amount.toLocaleString()}
                  </p>
                </div>
                <ApplicationDialog
                  serviceId={service.id}
                  serviceType="finance"
                  serviceName={service.name}
                >
                  <Button onClick={() => setIsOpen(false)}>Apply</Button>
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