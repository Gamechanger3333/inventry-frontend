"use client";

import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarHeader,
  SidebarMenu, SidebarMenuItem, SidebarMenuButton,
  SidebarProvider, SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard, Package, Boxes, Warehouse, ShoppingCart,
  Truck, Users, Building2, FileText, BarChart3, Bell, LogOut,
  Moon, Sun, Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "next-themes";

const navigation = [
  { name: "Dashboard",    href: "/dashboard",     icon: LayoutDashboard },
  { name: "Products",     href: "/products",      icon: Package },
  { name: "Inventory",    href: "/inventory",     icon: Boxes },
  { name: "Warehouses",   href: "/warehouses",    icon: Warehouse },
  { name: "Sales",        href: "/sales",         icon: ShoppingCart },
  { name: "Purchases",    href: "/purchases",     icon: Truck },
  { name: "Customers",    href: "/customers",     icon: Users },
  { name: "Suppliers",    href: "/suppliers",     icon: Building2 },
  { name: "Invoices",     href: "/invoices",      icon: FileText },
  { name: "Reports",      href: "/reports",       icon: BarChart3 },
  { name: "AI Assistant", href: "/ai",            icon: Bot },
];

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background/50">
        <Sidebar>
          <SidebarHeader className="h-16 flex items-center px-4 border-b">
            <div className="flex items-center gap-2 font-bold text-lg text-primary tracking-tight">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-primary-foreground">
                <Boxes size={18} />
              </div>
              <span>Nexus</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.name}>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4 mr-2" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 border">
                <AvatarImage src={user.avatar || ""} />
                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden flex flex-col">
                <span className="text-sm font-medium truncate">{user.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user.role}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="shrink-0 text-muted-foreground hover:text-destructive"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30 flex items-center justify-between px-4 lg:px-8">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="text-sm font-medium text-muted-foreground">
                {navigation.find((n) => pathname.startsWith(n.href))?.name || "Dashboard"}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button variant="ghost" size="icon" className="relative" asChild>
                <Link href="/notifications">
                  <Bell className="w-[1.2rem] h-[1.2rem]" />
                  <span className="sr-only">Notifications</span>
                </Link>
              </Button>
            </div>
          </header>
          <div className="flex-1 p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  );
}
