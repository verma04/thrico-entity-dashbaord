"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarTrigger,
  SidebarHeader,
  SidebarInset,
} from "@/components/ui/sidebar";
import {
  ArrowUpRight,
  Bell,
  Earth,
  FileStack,
  HandCoins,
  Home,
  Languages,
  ListTodo,
  Lock,
  PaintBucket,
  Receipt,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/settings",
      icon: Home,
      label: "General",
    },
    {
      key: "/settings/appearance",
      icon: PaintBucket,
      label: "Appearance",
    },
    {
      key: "/settings/domains",
      icon: Earth,
      label: "Domains",
    },
    {
      key: "/settings/subscription",
      icon: ArrowUpRight,
      label: "Subscription", // changed from "Plan"
    },
    {
      key: "/settings/modules",
      icon: ListTodo,
      label: "Module",
    },
    {
      key: "/settings/billing",
      icon: Receipt,
      label: "Billing",
    },
    {
      key: "/settings/users",
      icon: UserCheck,
      label: "Users & Permissions",
    },
    {
      key: "/settings/taxes",
      icon: HandCoins,
      label: "Taxes & Duties",
    },
    {
      key: "/settings/notifications",
      icon: Bell,
      label: "Notifications",
    },
    {
      key: "/settings/languages",
      icon: Languages,
      label: "Languages",
    },
    {
      key: "/settings/privacy",
      icon: Lock,
      label: "Customer Privacy",
    },
    {
      key: "/settings/policies",
      icon: FileStack,
      label: "Policies",
    },
  ];

  return (
    <div className="fixed inset-0 flex z-50">
      <SidebarProvider defaultOpen={true}>
        <Sidebar collapsible="icon" className="border-r">
          <SidebarHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <Link href="/">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Home className="h-4 w-4" />
                </div>
              </Link>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold">Settings</span>
                <span className="text-xs text-muted-foreground">
                  Configure your app
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            {/* Configuration Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Configuration</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.slice(0, 6).map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          isActive={pathname === item.key}
                          onClick={() => router.push(item.key)}
                          tooltip={item.label}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Advanced Section */}
            <SidebarGroup>
              <SidebarGroupLabel>Advanced</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.slice(6).map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          isActive={pathname === item.key}
                          onClick={() => router.push(item.key)}
                          tooltip={item.label}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="overflow-auto">
          <main className="flex-1 p-4 lg:p-6 w-full min-w-0">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}

export default SettingsLayout;
