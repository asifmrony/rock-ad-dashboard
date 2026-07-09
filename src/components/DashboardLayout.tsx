import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
import { Link, Outlet } from "react-router-dom";

export function DashboardLayout() {
  const { logout } = useAuth();
  const isBingePlusAdmin = localStorage.getItem("bingePlusAdmin") === "true";

  const menuItems = [
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

  const bingeMenuItems = [
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
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-100">
        <Sidebar className="bg-white">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isBingePlusAdmin
                    ? bingeMenuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link to={item.url} className="text-[#646cff]">
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))
                    : menuItems.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <Link to={item.url} className="text-[#646cff]">
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
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
