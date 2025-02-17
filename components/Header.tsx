"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";

const logo = "https://jktuoxljbtnrehtnctre.supabase.co/storage/v1/object/public/freebucket//logo.png";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select()
          .eq("id", session.user.id)
          .single();
        setIsAdmin(!!adminUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };

    checkAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: adminUser } = await supabase
          .from("admin_users")
          .select()
          .eq("id", session.user.id)
          .single();
        setIsAdmin(!!adminUser);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Prashil Educare", href: "/services/prashil-educare" },
    { label: "Prashil EduGuide", href: "/services/prashil-eduguide" },
    { label: "Prashil Finance", href: "/services/prashil-finance" },
  ];

  if (user) {
    menuItems.push({
      label: "Dashboard",
      href: isAdmin ? "/admin" : "/dashboard",
    });
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logo}
              alt="Prashil Foundation Logo"
              width={75}
              height={75}
              className="h-16 w-auto"
            />
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Prashil Foundation
            </span>
          </Link>

          {/* Desktop Menu - Hidden on mobile */}
          <nav className="hidden lg:flex items-center space-x-4">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors whitespace-nowrap px-3 py-2 rounded-md",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-primary/5 text-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/sign-in">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button - Visible only on mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col h-full py-6">
                <div className="flex items-center justify-between object-center mb-8">
                  <div className="flex items-center">
                    <Image
                      src={logo}
                      alt="Prashil Foundation Logo"
                      width={60}
                      height={60}
                      className="h-12 w-auto"
                    />
                    <span className="text-base font-bold ml-2 bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
                      Prashil <br /> Foundation
                    </span>
                  </div>
                  <ThemeToggle />
                </div>
                <nav className="flex flex-col space-y-2">
                  {menuItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={cn(
                        "text-sm font-medium transition-colors px-3 py-2 rounded-md",
                        isActive(item.href)
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-primary/5 text-foreground"
                      )}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {user ? (
                    <Button onClick={handleSignOut} variant="outline" size="sm">
                      Sign Out
                    </Button>
                  ) : (
                    <div className="flex flex-col space-y-2 pt-2">
                      <Link href="/auth/sign-in" onClick={() => setIsOpen(false)}>
                        <Button variant="outline" className="w-full" size="sm">Sign In</Button>
                      </Link>
                      <Link href="/auth/sign-up" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90" size="sm">
                          Sign Up
                        </Button>
                      </Link>
                    </div>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}