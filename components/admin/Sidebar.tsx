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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Applications", href: "/admin/applications", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const NavContent = () => (
    <>
      {navigation.map((item) => (
        <Link
          key={item.name}
          href={item.href}
          className={cn(
            pathname === item.href
              ? "bg-primary/10 text-primary"
              : "text-foreground hover:bg-primary/5",
            "group flex items-center px-2 py-2 text-sm font-medium rounded-md"
          )}
          onClick={() => setIsOpen(false)}
        >
          <item.icon
            className={cn(
              pathname === item.href
                ? "text-primary"
                : "text-foreground",
              "mr-3 h-5 w-5"
            )}
          />
          {item.name}
        </Link>
      ))}
    </>
  );

  // Mobile view
  const MobileNav = () => (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild className="md:hidden fixed bottom-4 right-4 z-50">
        <Button size="icon" className="rounded-full h-12 w-12">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col h-full">
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
  );

  // Desktop view
  const DesktopNav = () => (
    <div className="hidden md:flex flex-col w-64 bg-card border-r">
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
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}