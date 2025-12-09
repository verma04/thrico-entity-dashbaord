"use client";
import React, { useState } from "react";
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
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

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
    <>
      <Drawer open={open}>
        <DrawerContent className="h-[95vh]">
          <SidebarProvider defaultOpen={true}>
            <div className="flex border-r-2  h-full w-full">
              {/* Sidebar */}
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

              {/* Main Content */}
              <main className="flex-1 overflow-auto">
                {/* Header with Trigger */}
                <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-6">
                  <SidebarTrigger />
                  <h1 className="text-lg font-semibold">
                    {menuItems.find((item) => item.key === pathname)?.label ||
                      "Settings"}
                  </h1>
                </div>

                {/* Page Content */}
                <div className="p-6 mb-20">{children}</div>
              </main>
            </div>
          </SidebarProvider>
        </DrawerContent>
      </Drawer>
    </>
  );
}

export default SettingsLayout;
