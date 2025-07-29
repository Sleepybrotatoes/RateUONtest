import { useState } from "react";
import { Home, User, BookOpen, Building, MessageSquare, Search, Star } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Professors", url: "/professors", icon: User },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Buildings", url: "/buildings", icon: Building },
  { title: "Forums", url: "/forums", icon: MessageSquare },
  { title: "Search", url: "/search", icon: Search },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const isExpanded = navigationItems.some((item) => isActive(item.url));

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-muted text-primary font-medium" : "hover:bg-muted/50";

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-border/50"
    >
      <SidebarHeader className="p-3 border-b border-border/50">
        <div className="flex items-center justify-center">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <Star className="h-5 w-5 text-white" />
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground text-xs uppercase tracking-wider px-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={isActive(item.url) ? "bg-primary/10 text-primary border-r-2 border-primary" : "hover:bg-muted/50"}
                  >
                    <NavLink to={item.url} end className="flex items-center">
                      <item.icon className="mr-3 h-4 w-4" />
                      {open && <span className="font-medium">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}