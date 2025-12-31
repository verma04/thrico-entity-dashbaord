"use client";

import type React from "react";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search, X } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  main,
  useFilteredExtendedItems,
  profile,
  settings,
} from "./menu-items";
import Logo from "./logo";
import VisitSite from "./visit";
import LogoutModal from "./logout";

interface MenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isLogout?: boolean;
}

export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [extendedCollapsed, setExtendedCollapsed] = useState(false);

  // Get subscription-filtered extended items
  const { filteredItems: subscriptionFilteredItems, loading: modulesLoading } =
    useFilteredExtendedItems();

  const toggleGroup = (key: string) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  // Filter extended items based on search query (on top of subscription filtering)
  const filteredExtendedItems = useMemo(() => {
    if (!searchQuery.trim()) return subscriptionFilteredItems;

    const query = searchQuery.toLowerCase();
    return subscriptionFilteredItems.filter((item) => {
      const labelMatch =
        typeof item.label === "string" &&
        item.label.toLowerCase().includes(query);
      const childrenMatch = item.children?.some(
        (child) =>
          typeof child.label === "string" &&
          child.label.toLowerCase().includes(query)
      );
      return labelMatch || childrenMatch;
    });
  }, [searchQuery, subscriptionFilteredItems]);

  const renderItems = (items: MenuItem[]) => (
    <SidebarMenu>
      {items.map((item) => {
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = openGroup === item.key;

        return (
          <SidebarMenuItem key={item.key}>
            <SidebarMenuButton
              asChild={!hasChildren && !item.isLogout}
              isActive={pathName === item.path}
              onClick={() => {
                if (hasChildren) {
                  toggleGroup(item.key);
                } else if (item.isLogout) {
                  setLogoutOpen(true);
                }
              }}
            >
              {hasChildren ? (
                <div className="flex w-full items-center justify-between cursor-pointer">
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isOpen ? "rotate-90" : ""
                    }`}
                  />
                </div>
              ) : item.isLogout ? (
                <div className="flex items-center gap-2 cursor-pointer">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
              ) : (
                <Link href={item.path || "#"}>
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              )}
            </SidebarMenuButton>

            {hasChildren && isOpen && (
              <div className="ml-4 border-l border-border pl-3 space-y-1 mt-1">
                {renderItems(item.children!)}
              </div>
            )}
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar className="border-r border-border">
        {/* HEADER */}
        <SidebarHeader className="flex h-14 items-center border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Logo />
          </Link>
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent>
          {/* MAIN */}
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(main)}</SidebarGroupContent>
          </SidebarGroup>

          {/* EXTENDED MODULES */}
          {subscriptionFilteredItems.length > 0 && (
            <SidebarGroup>
              <div className="flex items-center justify-between px-2 mb-2">
                <div
                  className="flex items-center gap-2  flex-1"
                  // onClick={() => setExtendedCollapsed(!extendedCollapsed)}
                >
                  <SidebarGroupLabel className="cursor-pointer">
                    Modules
                  </SidebarGroupLabel>
                  <Badge variant="secondary" className="text-[10px] h-5">
                    {filteredExtendedItems.length}
                  </Badge>
                  {/* <ChevronRight
                    className={`h-3 w-3 transition-transform ${
                      !extendedCollapsed ? "rotate-90" : ""
                    }`}
                  /> */}
                </div>
              </div>

              {!extendedCollapsed && (
                <>
                  {/* Search Bar */}
                  <div className="px-2 mb-2">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                      <Input
                        placeholder="Search  Modules..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="h-8 pl-7 pr-7 text-xs"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-muted rounded-sm p-0.5"
                        >
                          <X className="h-3 w-3 text-muted-foreground" />
                        </button>
                      )}
                    </div>
                  </div>

                  <SidebarGroupContent>
                    {filteredExtendedItems.length > 0 ? (
                      renderItems(filteredExtendedItems)
                    ) : (
                      <div className="px-2 py-4 text-center text-xs text-muted-foreground">
                        No Module found
                      </div>
                    )}
                  </SidebarGroupContent>
                </>
              )}
            </SidebarGroup>
          )}

          {/* SETTINGS */}
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarGroupContent>{renderItems(settings)}</SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER */}
        <SidebarFooter className="border-t border-border p-4">
          {renderItems(profile)}
        </SidebarFooter>
      </Sidebar>

      {/* MAIN CONTENT AREA */}
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <h1 className="text-lg font-semibold capitalize">
              {pathName === "/"
                ? "Home"
                : pathName.replace("/", "").replace(/-/g, " ")}
            </h1>
          </div>
          <VisitSite />
        </header>

        <main className="flex-1 p-4 lg:p-6 w-full min-w-0 ">{children}</main>
      </SidebarInset>

      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </SidebarProvider>
  );
}
