"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  LogOut,
  Menu,
  Settings,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const logo = "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//logo.png";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Services", href: "/admin/services", icon: Settings },
  { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const isActive = (href: string) => pathname === href;

  const NavContent = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
            isActive(item.href)
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-primary/5"
          )}
          onClick={() => setIsOpen(false)}
        >
          <item.icon
            className={cn(
              "mr-3 h-5 w-5",
              isActive(item.href)
                ? "text-primary"
                : "text-foreground"
            )}
          />
          {item.name}
        </Link>
      ))}
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-card border-r">
        <div className="flex-shrink-0 flex border-b p-2">
            <Link
            key="Prashil Foundation"
            href="/"
            className="flex gap-2 items-center text-sm font-medium rounded-md transition-colors"
            > 
              <Image
                src={logo}
                alt="Prashil Foundation Logo"
                width={150}
                height={150}
                className="mx-auto object-cover"
              />
                <span className="text-base font-bold">Prashil Foundation</span>
            </Link>
        </div>
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            <NavContent />
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t p-4">
          <Button
            variant="ghost"
            className="flex-1 justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="md:hidden fixed bottom-4 right-4 z-50">
          <Button size="icon" className="rounded-full h-12 w-12">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64">
          <div className="flex flex-col h-full">
            <Link
            key="Prashil Foundation"
            href="/"
            > 
              <Image
                src={logo}
                alt="Prashil Foundation Logo"
                width={150}
                height={150}
                className="mx-auto object-cover"
              />
            </Link>
            <div className="flex-1 py-4">
              <NavContent />
            </div>
            <Button
              variant="ghost"
              className="justify-start"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}