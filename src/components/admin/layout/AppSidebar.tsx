"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
  SidebarFooter,
} from "@/components/ui/sidebar";
import { LayoutDashboard, Film, Users, Clapperboard, ShieldCheck, UserCheck, Gem } from "lucide-react";
import { adminPath } from "@/constants/path";
import { useAuthStore } from "@/stores/authStore";

export function AppSidebar() {
  const pathname = usePathname();
  const { isAuthenticated, authUser } = useAuthStore();

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard, href: adminPath.DASHBOARD },
    { title: "Phim", icon: Film, href: adminPath.MOVIES },
    { title: "Gói VIP", icon: Gem, href: adminPath.VIP_PLANS },
    { title: "Người dùng", icon: Users, href: adminPath.USERS },
    { title: "Quyền hạn", icon: ShieldCheck, href: adminPath.PERMISSIONS },
    { title: "Vai trò", icon: UserCheck, href: adminPath.ROLES },
  ];

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="border-b bg-gradient-to-b from-slate-900 to-black">
        <div className="flex items-center gap-4 px-6 py-5">
          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-yellow-400 opacity-40 animate-pulse"></div>

            <div
              className="relative flex h-12 w-12 items-center justify-center rounded-xl 
                      bg-gradient-to-br from-yellow-600 via-amber-500 to-orange-600 
                      shadow-2xl ring-4 ring-yellow-500/20"
            >
              <Clapperboard className="h-7 w-7 text-white drop-shadow-2xl" />
            </div>
          </div>

          <div className="flex flex-col">
            <h1 className="relative text-2xl font-black tracking-tight">
              <span
                className="absolute inset-0 blur-md opacity-60 
                        bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent"
              >
                ChillFLix
              </span>

              <span
                className="relative bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 
                        bg-clip-text text-transparent 
                        drop-shadow-2xl
                        "
              >
                ChillFLix
              </span>
            </h1>
            <p className="text-xs tracking-wider text-amber-300/80 font-medium mt-1">Trang quản trị</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-xs text-muted-foreground">
          {isAuthenticated === true ? (
            <>
              <p className="font-medium">{`Name: ${authUser.fullName}`}</p>
              <p>{authUser.email}</p>
            </>
          ) : (
            <></>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
