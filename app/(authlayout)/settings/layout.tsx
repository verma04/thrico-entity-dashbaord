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
  Headset,
  Coins,
  Blocks,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { useMemo } from "react";

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
    {
      key: "/settings/profile",
      icon: UserCheck,
      label: "Your Profile",
    },
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
      key: "/settings/moderation",
      icon: ShieldCheck,
      label: "Moderation",
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
    {
      key: "/settings/contact",
      icon: Headset,
      label: "Contact Support",
    },

    {
      key: "/settings/integrations",
      icon: Blocks,
      label: "Integrations",
    },
  ];
  const user = useUserStore((state) => state.user);
  const isSuperAdmin = user?.isSuperAdmin;
  const isSystemRole = user?.role?.isSystem;
  const permissions = user?.permissions;

  const filteredMenuItems = useMemo(() => {
    if (isSuperAdmin || isSystemRole) return menuItems;

    return menuItems.filter((item) => {
      if (item.key === "/settings/profile") return true;
      if (item.key === "/settings") return permissions?.settings;
      if (item.key === "/settings/appearance") return permissions?.appearance;
      if (item.key === "/settings/domains") return permissions?.domain;
      if (item.key === "/settings/moderation") return permissions?.moderation;
      if (item.key === "/settings/subscription") return permissions?.subscription;
      if (item.key === "/settings/modules") return permissions?.platformFeatures;
      if (item.key === "/settings/billing") return permissions?.subscription;
      if (item.key === "/settings/users") return permissions?.adminUsers;
      if (item.key === "/settings/taxes") return permissions?.settings;
      if (item.key === "/settings/languages") return permissions?.settings;
      if (item.key === "/settings/privacy") return permissions?.settings;
      if (item.key === "/settings/policies") return permissions?.settings;
      if (item.key === "/settings/integrations") return permissions?.platformFeatures;
      return true;
    });
  }, [user, isSuperAdmin, isSystemRole, permissions, menuItems]);

  const configItems = filteredMenuItems.filter((_, idx) => idx < 7);
  const advancedItems = filteredMenuItems.filter((_, idx) => idx >= 7);

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
                  {configItems.map((item) => {
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
                  {advancedItems.map((item) => {
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
