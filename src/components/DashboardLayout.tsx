import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ListMusic,
  ChartNoAxesCombined,
  PartyPopper,
  Megaphone,
  Clapperboard,
} from "lucide-react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { canAccess, getRole } from "@/lib/roles";

export function DashboardLayout() {
  const { logout } = useAuth();
  const { pathname } = useLocation();
  const role = getRole();

  // Root ("/") must match exactly; nested routes (e.g. /ads/create) still
  // highlight their parent nav item.
  const isActive = (url: string) =>
    url === "/" ? pathname === "/" : pathname.startsWith(url);

  const allMenuItems = [
    // {
    //   title: "Dashboard",
    //   icon: LayoutDashboard,
    //   url: "/dashboard",
    // },
    {
      title: "Vast Analytics",
      icon: ChartNoAxesCombined,
      url: "/",
    },
    {
      title: "Midroll Analytics",
      icon: Clapperboard,
      url: "/midroll",
    },
    {
      title: "Ads List",
      icon: ListMusic,
      url: "/ads",
    },
    {
      title: "Advertisers",
      icon: Megaphone,
      url: "/advertisers",
    },
    {
      title: "Campaigns",
      icon: PartyPopper,
      url: "/campaigns",
    },
  ];

  // Only surface the pages this role is allowed to reach.
  const menuItems = allMenuItems.filter((item) => canAccess(item.url, role));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-100">
        <Sidebar className="bg-white">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map(
                    (item) => {
                      const active = isActive(item.url);
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild isActive={active}>
                            <Link
                              to={item.url}
                              className={cn(
                                "text-[#646cff] border-l-4 border-transparent",
                                active &&
                                  "bg-[#646cff]/10 border-[#646cff] font-semibold",
                              )}
                            >
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    },
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <div className="mt-auto p-4">
              <Button onClick={logout} variant="destructive" className="w-full">
                Logout
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-2">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}
