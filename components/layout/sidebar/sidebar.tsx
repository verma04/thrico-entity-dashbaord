"use client";

import React, { useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Search, X, Users, BellDotIcon } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetUser, useCheckEntitySubscription } from "@/graphql/actions";

import {
  main,
  useFilteredExtendedItems,
  useFilteredManagementItems,
  profile,
  settings,
  UserAvatar,
  UserName,
} from "./menu-items";
import { useUserStore } from "@/store/store";
import Logo from "./logo";
import VisitSite from "./visit";
import LogoutModal from "./logout";
import { DotPatternLinearGradient } from "@/components/common/dot-pattern-linear-gradient";

interface MenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isLogout?: boolean;
  badge?: string;
}

/* ─── Section Label ─────────────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-3 mb-1.5 mt-1 group-data-[collapsible=icon]:hidden">
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.12em",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "oklch(0.556 0 0 / 45%)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

/* ─── Menu Item Renderer ─────────────────────────────────────────────────── */
function MenuItemRow({
  item,
  pathName,
  openGroup,
  toggleGroup,
  setLogoutOpen,
  depth = 0,
  searchQuery = "",
}: {
  item: MenuItem;
  pathName: string;
  openGroup: string | null;
  toggleGroup: (key: string) => void;
  setLogoutOpen: (v: boolean) => void;
  depth?: number;
  searchQuery?: string;
}) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const hasChildren = !!(item.children && item.children.length > 0);
  const isOpen = openGroup === item.key || Boolean(searchQuery.trim());
  const isActive =
    pathName === item.path ||
    (hasChildren && item.children?.some((c) => pathName === c.path));

  // Raw label string for tooltip
  const tooltipLabel = typeof item.label === "string" ? item.label : undefined;

  const iconEl = item.icon
    ? React.cloneElement(
        item.icon as React.ReactElement<{
          size?: number;
          className?: string;
        }>,
        {
          size: depth > 0 ? 14 : 16,
          className: cn(
            "shrink-0 transition-all duration-200",
            isActive
              ? "text-indigo-600"
              : "text-zinc-400 group-hover:text-zinc-600",
          ),
        },
      )
    : null;

  /* Base row styles — the icon size override from shadcn kicks in via
     group-data-[collapsible=icon]:size-8! on SidebarMenuButton */
  const rowBase = cn(
    "group relative flex items-center w-full transition-all duration-150 cursor-pointer select-none",
    depth === 0 ? "h-9 px-3 rounded-xl gap-2.5" : "h-8 px-2.5 rounded-lg gap-2",
    isActive
      ? "bg-indigo-50 shadow-[inset_0_0_0_1px_oklch(0.55_0.24_264/0.12)]"
      : "hover:bg-zinc-50",
  );

  /* Active left bar — hidden when collapsed (icon-only) */
  const activeBar = isActive && depth === 0 && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-indigo-500 pointer-events-none group-data-[collapsible=icon]:hidden" />
  );

  /* ── Children (expandable group) ── */
  if (hasChildren) {
    // In collapsed mode: show first child's icon if no parent icon, else parent icon
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild={false}
          isActive={isActive}
          tooltip={tooltipLabel}
          className={cn(
            rowBase,
            "justify-between h-auto! py-0 group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => !isCollapsed && toggleGroup(item.key)}
        >
          <span
            className={cn(
              "flex items-center gap-2.5 flex-1 min-w-0 h-9",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9",
            )}
          >
            {activeBar}
            {iconEl}
            <span className="truncate text-[13px] leading-none tracking-tight transition-colors duration-200 group-data-[collapsible=icon]:hidden font-medium text-inherit">
              {item.label}
            </span>
          </span>
          <ChevronRight
            size={13}
            className={cn(
              "shrink-0 text-zinc-400 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
              isOpen && "rotate-90 text-indigo-500",
            )}
          />
        </SidebarMenuButton>

        {isOpen && !isCollapsed && (
          <div className="ml-4 pl-3 border-l border-zinc-100 mt-0.5 mb-0.5 space-y-0.5 group-data-[collapsible=icon]:hidden">
            {item.children!.map((child) => (
              <MenuItemRow
                key={child.key}
                item={child}
                pathName={pathName}
                openGroup={openGroup}
                toggleGroup={toggleGroup}
                setLogoutOpen={setLogoutOpen}
                depth={depth + 1}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </SidebarMenuItem>
    );
  }

  /* ── Logout ── */
  if (item.isLogout) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild={false}
          isActive={false}
          tooltip={tooltipLabel}
          className={cn(
            rowBase,
            "text-red-400 hover:text-red-600 hover:bg-red-50",
            "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => setLogoutOpen(true)}
        >
          {iconEl}
          <span className="text-[13px] leading-none tracking-tight font-medium truncate group-data-[collapsible=icon]:hidden">
            {item.label}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  /* ── Regular nav link ── */
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={tooltipLabel}
        className={cn(
          rowBase,
          "group-data-[collapsible=icon]:size-9! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
        )}
      >
        <Link
          href={item.path || "#"}
          className="flex items-center gap-2.5 flex-1 min-w-0 group-data-[collapsible=icon]:justify-center"
        >
          {activeBar}
          {iconEl}
          <span
            className={cn(
              "text-[13px] leading-none tracking-tight transition-colors duration-200 truncate group-data-[collapsible=icon]:hidden",
              isActive
                ? "text-zinc-900 font-semibold"
                : "text-zinc-500 group-hover:text-zinc-800 font-medium",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge
              variant="outline"
              className="ml-auto text-[9px] h-4 px-1.5 bg-indigo-50/60 text-indigo-500 border-indigo-100 rounded-full font-semibold shrink-0 group-data-[collapsible=icon]:hidden"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ─── Inner Layout (needs useSidebar) ───────────────────────────────────── */
function SidebarLayoutInner({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const { extendedItems: subscriptionFilteredItems, gamificationItems } =
    useFilteredExtendedItems();
  const { managementItems: managementFolders } = useFilteredManagementItems();

  const toggleGroup = (key: string) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  const filterList = useCallback(
    (list: MenuItem[], query: string): MenuItem[] => {
      if (!query.trim()) return list;
      const q = query.toLowerCase();

      return list
        .map((item) => {
          const labelMatch =
            typeof item.label === "string" &&
            item.label.toLowerCase().includes(q);
          const filteredChildren = item.children
            ? filterList(item.children, query)
            : undefined;
          const childrenMatch = filteredChildren && filteredChildren.length > 0;

          if (labelMatch || childrenMatch) {
            return {
              ...item,
              children: labelMatch ? item.children : filteredChildren,
            };
          }
          return null;
        })
        .filter(Boolean) as MenuItem[];
    },
    [],
  );

  const filteredMain = useMemo(
    () => filterList(main, searchQuery),
    [searchQuery, filterList],
  );
  const filteredExtendedItems = useMemo(
    () => filterList(subscriptionFilteredItems, searchQuery),
    [searchQuery, subscriptionFilteredItems, filterList],
  );
  const filteredSettings = useMemo(
    () => filterList(managementFolders, searchQuery),
    [searchQuery, managementFolders, filterList],
  );
  const filteredGamification = useMemo(
    () => filterList(gamificationItems, searchQuery),
    [searchQuery, gamificationItems, filterList],
  );
  const filteredProfile = useMemo(
    () => filterList(profile, searchQuery),
    [searchQuery, filterList],
  );

  const renderItems = (items: MenuItem[]) => (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => (
        <MenuItemRow
          key={item.key}
          item={item}
          pathName={pathName}
          openGroup={openGroup}
          toggleGroup={toggleGroup}
          setLogoutOpen={setLogoutOpen}
          searchQuery={searchQuery}
        />
      ))}
    </SidebarMenu>
  );

  return (
    <>
      {/* ── SIDEBAR ── */}
      <Sidebar
        collapsible="icon"
        className="border-r border-zinc-100 bg-white"
        style={{ "--sidebar-width": "232px" } as React.CSSProperties}
      >
        {/* HEADER */}
        <SidebarHeader className="h-14 flex flex-row items-center justify-between px-3 border-b border-zinc-50 overflow-hidden">
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden"
            >
              <Logo />
            </Link>
          )}
          <SidebarTrigger className="h-7 w-7 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all duration-150 flex items-center justify-center shrink-0" />
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="py-3 px-2 overflow-x-hidden">
          {/* SEARCH — global search */}
          {!isCollapsed && (
            <div className="px-2 mb-4 mt-1 group-data-[collapsible=icon]:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-400 pointer-events-none" />
                <Input
                  placeholder="Search sidebar…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 bg-zinc-50 border-zinc-100 pl-7 pr-7 text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-indigo-300 placeholder:text-zinc-400 text-zinc-700"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* MAIN */}
          {filteredMain.length > 0 && (
            <SidebarGroup className="mb-1 p-0">
              <SectionLabel>Playground</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredMain)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* PRODUCTS / EXTENDED MODULES */}
          {filteredExtendedItems.length > 0 && (
            <SidebarGroup className="mb-1 p-0">
              {/* Section header — hidden when collapsed */}
              <div className="flex items-center gap-2 px-3 mb-1.5 mt-1 group-data-[collapsible=icon]:hidden">
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "oklch(0.556 0 0 / 45%)",
                  }}
                >
                  Products
                </span>
                <span
                  className="inline-flex items-center justify-center rounded-full text-[9px] font-bold px-1.5 h-4"
                  style={{
                    background: "oklch(0.55 0.24 264 / 0.08)",
                    color: "oklch(0.45 0.24 264)",
                  }}
                >
                  {filteredExtendedItems.length}
                </span>
              </div>
              <SidebarGroupContent>
                {renderItems(filteredExtendedItems)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* GAMIFICATION */}
          {filteredGamification.length > 0 && (
            <SidebarGroup className="mb-1 p-0">
              <div className="flex items-center gap-2 px-3 mb-1.5 mt-1 group-data-[collapsible=icon]:hidden">
                <span
                  style={{
                    fontSize: "9px",
                    letterSpacing: "0.12em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    color: "oklch(0.556 0 0 / 45%)",
                  }}
                >
                  Gamification
                </span>
                <span
                  className="inline-flex items-center justify-center rounded-full text-[9px] font-bold px-1.5 h-4"
                  style={{
                    background: "oklch(0.55 0.24 264 / 0.08)",
                    color: "oklch(0.45 0.24 264)",
                  }}
                >
                  {filteredGamification.length}
                </span>
              </div>
              <SidebarGroupContent>
                {renderItems(filteredGamification)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* MANAGEMENT */}
          {filteredSettings.length > 0 && (
            <SidebarGroup className="p-0">
              <SectionLabel>Management</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredSettings)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* NO RESULTS FALLBACK */}
          {searchQuery.trim() &&
            filteredMain.length === 0 &&
            filteredExtendedItems.length === 0 &&
            filteredGamification.length === 0 &&
            filteredSettings.length === 0 &&
            filteredProfile.length === 0 && (
              <div className="px-3 py-5 text-center group-data-[collapsible=icon]:hidden">
                <p className="text-[11px] text-zinc-400">No matching items</p>
              </div>
            )}

        </SidebarContent>

        {/* FOOTER */}
        {filteredProfile.length > 0 && (
          <SidebarFooter className="border-t border-zinc-50 p-2 pt-3 pb-3">
            <SidebarGroup className="p-0">
              <SectionLabel>Support</SectionLabel>
              {renderItems(filteredProfile)}
            </SidebarGroup>
          </SidebarFooter>
        )}
      </Sidebar>

      {/* ── MAIN CONTENT ── */}
      <SidebarInset className="bg-[#FAFBFC]">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-zinc-100/80 bg-white/70 backdrop-blur-xl px-6 sticky top-0 z-40 shadow-[0_1px_2px_0_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <SidebarTrigger className="-ml-2 h-8 w-8 rounded-xl text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all duration-200" />

            <div className="h-4 w-px bg-zinc-200/60 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-[13px]">
              <span className="font-semibold text-zinc-800 capitalize tracking-tight">
                {pathName === "/"
                  ? "Dashboard"
                  : pathName
                      .split("/")
                      .filter(Boolean)
                      .join(" / ")
                      .replace(/-/g, " ")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <VisitSite />
            <div className="h-4 w-px bg-zinc-200/60 mx-1" />

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group">
              <Search
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
            </button>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 group">
              <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_0_2px_white]" />
              <BellDotIcon
                size={16}
                className="group-hover:scale-110 transition-transform"
              />
            </button>

            <div className="h-4 w-px bg-zinc-200/60 mx-1" />

            <button className="flex items-center gap-2 h-9 pl-1.5 pr-4 rounded-xl bg-zinc-50 border border-zinc-100 hover:bg-zinc-100 hover:border-zinc-200 transition-all duration-200">
              <div className="h-6 w-6">
                <UserAvatar />
              </div>
              <span className="text-[12px] font-bold text-zinc-700 leading-none truncate max-w-[120px]">
                <UserName />
              </span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 w-full min-w-0">{children}</main>
      </SidebarInset>

      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />
    </>
  );
}

/* ─── Root Export ────────────────────────────────────────────────────────── */
export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DotPatternLinearGradient />
      <SidebarProvider defaultOpen={true}>
        <SidebarLayoutInner>{children}</SidebarLayoutInner>
      </SidebarProvider>
    </>
  );
}
