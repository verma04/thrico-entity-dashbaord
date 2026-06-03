"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronRight,
  Search,
  X,
  BellDotIcon,
  User2,
  Settings,
  CreditCard,
  Bell,
  PaintBucket,
  LogOut,
  ChevronDown,
  Trophy,
  Users,
  PanelLeft,
  Lock,
} from "lucide-react";
import { useSidebarSectionStore } from "@/store/useSidebarStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

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
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useGetUser, useGetMyOtherAccounts } from "@/graphql/actions";
import { SwitchingLoader } from "./switching-loader";
import { useWorkspaceSwitch } from "@/hooks/use-workspace-switch";

import {
  useFilteredExtendedItems,
  useFilteredManagementItems,
  profile,
  UserAvatar,
  UserName,
} from "./menu-items";

import { useUserStore } from "@/store/store";
import Logo from "./logo";
import { WorkspaceSwitcher } from "./switcher";
import VisitSite from "./visit";
import LogoutModal from "./logout";
import { ThemeToggle } from "../theme-toggle";

interface MenuItem {
  key: string;
  label: string | React.ReactNode;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  isLogout?: boolean;
  badge?: string;
  isLocked?: boolean;
}

/* ─── Section Label (collapsible) ───────────────────────────────── */
function SectionLabel({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: React.ReactNode;
}) {
  // Select the array directly — Zustand re-renders when the array reference changes
  const collapsedSections = useSidebarSectionStore((s) => s.collapsedSections);
  const toggleSection = useSidebarSectionStore((s) => s.toggleSection);
  const isOpen = !collapsedSections.includes(sectionKey);

  return (
    <div className="mb-1 mt-4 first:mt-1">
      {/* Expanded: clickable label with chevron */}
      <button
        onClick={() => toggleSection(sectionKey)}
        className="group-data-[collapsible=icon]:hidden flex w-full items-center justify-between px-3 py-0.5 rounded hover:bg-accent/40 transition-colors duration-150 cursor-pointer select-none"
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/40 leading-none">
          {children}
        </span>
        <ChevronRight
          size={10}
          className={cn(
            "text-muted-foreground/25 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
      </button>
      {/* Collapsed sidebar: thin divider line */}
      <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center px-2 py-1">
        <div className="w-full h-px bg-border/50" />
      </div>
    </div>
  );
}

/* ─── Menu Item Renderer ─────────────────────────────────────────── */
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
            "shrink-0 transition-colors duration-150",
            isActive
              ? "text-primary"
              : "text-muted-foreground/50 group-hover:text-muted-foreground",
          ),
        },
      )
    : null;

  const rowBase = cn(
    "group relative flex items-center w-full transition-colors duration-150 select-none",
    item.isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    depth === 0
      ? "h-9 px-3 rounded-lg gap-2.5 my-px"
      : "h-8 px-3 rounded-md gap-2 my-px",
    isActive && !item.isLocked
      ? "bg-accent text-foreground"
      : item.isLocked
      ? "text-muted-foreground"
      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
  );

  /* Active indicator — clean 2px bar, no glow */
  const activeBar = isActive && depth === 0 && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-primary pointer-events-none group-data-[collapsible=icon]:hidden" />
  );

  /* ── Children (expandable group) ── */
  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild={false}
          isActive={isActive && !item.isLocked}
          tooltip={tooltipLabel}
          className={cn(
            rowBase,
            "justify-between h-auto! py-0 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => !item.isLocked && !isCollapsed && toggleGroup(item.key)}
        >
          <span
            className={cn(
              "flex items-center gap-2.5 flex-1 min-w-0 h-9",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:w-9",
            )}
          >
            {activeBar}
            {iconEl}
            <span
              className={cn(
                "truncate text-[13px] leading-none tracking-[-0.01em] transition-colors duration-150 group-data-[collapsible=icon]:hidden",
                isActive && !item.isLocked
                  ? "font-medium text-foreground"
                  : "font-normal text-inherit",
              )}
            >
              {item.label}
            </span>
          </span>
          {item.isLocked ? (
            <Lock size={12} className="shrink-0 text-muted-foreground/40 group-data-[collapsible=icon]:hidden" />
          ) : (
            <ChevronRight
              size={11}
              className={cn(
                "shrink-0 text-muted-foreground/30 transition-transform duration-150 group-data-[collapsible=icon]:hidden",
                isOpen && "rotate-90 text-muted-foreground",
              )}
            />
          )}
        </SidebarMenuButton>

        {isOpen && !isCollapsed && (
          <div className="ml-3.5 pl-3 border-l border-border/40 mt-px mb-px group-data-[collapsible=icon]:hidden">
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
            "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5",
            "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => setLogoutOpen(true)}
        >
          {iconEl}
          <span className="text-[13px] leading-none tracking-[-0.01em] font-normal truncate group-data-[collapsible=icon]:hidden">
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
        isActive={isActive && !item.isLocked}
        tooltip={tooltipLabel}
        className={cn(
          rowBase,
          "group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
        )}
      >
        <Link
          href={item.isLocked ? "#" : item.path || "#"}
          className={cn(
            "flex items-center gap-2.5 flex-1 min-w-0 group-data-[collapsible=icon]:justify-center",
            item.isLocked && "pointer-events-none"
          )}
        >
          {activeBar}
          {iconEl}
          <span
            className={cn(
              "text-[13px] leading-none tracking-[-0.01em] transition-colors duration-150 truncate group-data-[collapsible=icon]:hidden",
              isActive && !item.isLocked
                ? "text-foreground font-medium"
                : "text-inherit font-normal",
            )}
          >
            {item.label}
          </span>
          {item.isLocked && (
            <Lock size={12} className="ml-auto text-muted-foreground/50 shrink-0 group-data-[collapsible=icon]:hidden" />
          )}
          {!item.isLocked && item.badge && (
            <Badge
              variant="outline"
              className="ml-auto text-[9px] h-[17px] px-1.5 bg-primary/8 text-primary border-primary/20 rounded font-semibold uppercase tracking-wider shrink-0 group-data-[collapsible=icon]:hidden"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

/* ─── Collapsible Section ───────────────────────────────────────── */
function CollapsibleSection({
  sectionKey,
  label,
  items,
  renderItems,
  className,
}: {
  sectionKey: string;
  label: string;
  items: MenuItem[];
  renderItems: (items: MenuItem[]) => React.ReactNode;
  className?: string;
}) {
  // Select collapsedSections array directly so Zustand re-renders on change
  const collapsedSections = useSidebarSectionStore((s) => s.collapsedSections);
  const isOpen = !collapsedSections.includes(sectionKey);

  if (items.length === 0) return null;

  return (
    <SidebarGroup className={cn("p-0", className)}>
      <SectionLabel sectionKey={sectionKey}>{label}</SectionLabel>
      {/* Animate open/close with CSS — avoids layout jank */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
          /* When sidebar icon-only mode, always show (icon tooltips still work) */
          "group-data-[collapsible=icon]:max-h-[2000px] group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:pointer-events-auto",
        )}
      >
        <SidebarGroupContent>{renderItems(items)}</SidebarGroupContent>
      </div>
    </SidebarGroup>
  );
}

/* ─── Inner Layout ─────────────────────────────────────────────── */
function SidebarLayoutInner({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const {
    homeItems,
    communityIntelligence,
    contentModeration,
    gamificationEngine,
    modules: modulesItems,
  } = useFilteredExtendedItems();
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
            } as MenuItem;
          }
          return null;
        })
        .filter(Boolean) as MenuItem[];
    },
    [],
  );

  const filteredHome = useMemo(
    () => filterList(homeItems as MenuItem[], searchQuery),
    [searchQuery, homeItems, filterList],
  );
  const filteredCommunity = useMemo(
    () => filterList(communityIntelligence as MenuItem[], searchQuery),
    [searchQuery, communityIntelligence, filterList],
  );
  const filteredModeration = useMemo(
    () => filterList(contentModeration as MenuItem[], searchQuery),
    [searchQuery, contentModeration, filterList],
  );
  const filteredGamification = useMemo(
    () => filterList(gamificationEngine as MenuItem[], searchQuery),
    [searchQuery, gamificationEngine, filterList],
  );
  const filteredModules = useMemo(
    () => filterList(modulesItems as MenuItem[], searchQuery),
    [searchQuery, modulesItems, filterList],
  );
  const filteredSettings = useMemo(
    () => filterList(managementFolders as MenuItem[], searchQuery),
    [searchQuery, managementFolders, filterList],
  );

  const { data: userData } = useGetUser();
  const { data: otherAccountsData } = useGetMyOtherAccounts();
  const { isSwitching, targetName, handleSwitch } = useWorkspaceSwitch();

  const nameOfUser = userData?.getUser
    ? `${userData.getUser.firstName} ${userData.getUser.lastName}`
    : "Deepak Rai";

  const profileItems = useMemo(
    () => profile(nameOfUser) as MenuItem[],
    [nameOfUser],
  );
  const filteredProfile = useMemo(
    () => filterList(profileItems, searchQuery),
    [searchQuery, profileItems, filterList],
  );

  // Flatten items for ⌘K search
  const flattenItems = useCallback(
    (
      items: MenuItem[],
      section: string,
      parentIcon?: React.ReactNode,
    ): any[] => {
      return items.reduce((acc: any[], item) => {
        const icon = item.icon || parentIcon;
        if (item.children && item.children.length > 0) {
          return [...acc, ...flattenItems(item.children, section, icon)];
        }
        if (item.path) {
          acc.push({
            key: item.key,
            label: item.label,
            path: item.path,
            icon: icon,
            section: section,
          });
        }
        return acc;
      }, []);
    },
    [],
  );

  const allSearchItems = useMemo(() => {
    return [
      ...flattenItems(homeItems as MenuItem[], "Home"),
      ...flattenItems(communityIntelligence as MenuItem[], "Community"),
      ...flattenItems(contentModeration as MenuItem[], "Moderation"),
      ...flattenItems(gamificationEngine as MenuItem[], "Gamification"),
      ...flattenItems(modulesItems as MenuItem[], "Modules"),
      ...flattenItems(managementFolders as MenuItem[], "Settings"),
      ...flattenItems(profileItems, "Account"),
    ];
  }, [
    homeItems,
    communityIntelligence,
    contentModeration,
    gamificationEngine,
    modulesItems,
    managementFolders,
    profileItems,
    flattenItems,
  ]);

  const renderItems = (items: MenuItem[]) => (
    <SidebarMenu className="gap-0">
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
      <SwitchingLoader
        isVisible={isSwitching}
        targetWorkspaceName={targetName}
      />
      {/* ── SIDEBAR ── */}
      <Sidebar
        collapsible="icon"
        className="border-r border-border bg-sidebar transition-[width] duration-150 ease-in-out"
        style={{ "--sidebar-width": "248px" } as React.CSSProperties}
      >
        {/* HEADER */}
        <SidebarHeader className="h-14 flex items-center border-b border-border px-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-center">
          <div className="flex-1 min-w-0 flex items-center group-data-[collapsible=icon]:hidden">
            <WorkspaceSwitcher />
          </div>
          {/* Collapsed: just show mini logo icon */}
          <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center w-full">
            <WorkspaceSwitcher />
          </div>
          {/* Collapse toggle — only shown when expanded */}
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="py-2 px-2 overflow-x-hidden group-data-[collapsible=icon]:px-1">
          {/* SEARCH */}
          {!isCollapsed && (
            <div className="mb-3 mt-1 group-data-[collapsible=icon]:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
                <Input
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 bg-accent/50 border-border/50 pl-8 pr-7 text-[12.5px] rounded-md focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-muted-foreground/40 text-foreground"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HOME */}
          <CollapsibleSection
            sectionKey="home"
            label="Home"
            items={filteredHome}
            renderItems={renderItems}
            className="mb-1"
          />

          {/* COMMUNITY INTELLIGENCE */}
          <CollapsibleSection
            sectionKey="community"
            label="Community"
            items={filteredCommunity}
            renderItems={renderItems}
            className="mb-1"
          />

          {/* CONTENT MODERATION */}
          <CollapsibleSection
            sectionKey="moderation"
            label="Moderation"
            items={filteredModeration}
            renderItems={renderItems}
            className="mb-1"
          />

          {/* GAMIFICATION ENGINE */}
          <CollapsibleSection
            sectionKey="gamification"
            label="Gamification"
            items={filteredGamification}
            renderItems={renderItems}
            className="mb-1"
          />

          {/* MODULES */}
          <CollapsibleSection
            sectionKey="modules"
            label="Modules"
            items={filteredModules}
            renderItems={renderItems}
            className="mb-1"
          />

          {/* ADMIN SETTINGS */}
          <CollapsibleSection
            sectionKey="settings"
            label="Settings"
            items={filteredSettings}
            renderItems={renderItems}
          />

          {/* NO RESULTS */}
          {searchQuery.trim() &&
            filteredHome.length === 0 &&
            filteredModeration.length === 0 &&
            filteredGamification.length === 0 &&
            filteredModules.length === 0 &&
            filteredSettings.length === 0 &&
            filteredProfile.length === 0 && (
              <div className="py-8 text-center group-data-[collapsible=icon]:hidden">
                <p className="text-[11.5px] text-muted-foreground/50">
                  No results found
                </p>
              </div>
            )}
        </SidebarContent>
      </Sidebar>

      {/* ── MAIN CONTENT ── */}
      <SidebarInset className="bg-background">
        {/* ── NAVBAR ── */}
        <header className="flex h-14 items-center justify-between gap-3 border-b border-border bg-background px-4 sticky top-0 z-40">
          {/* Left: sidebar toggle + breadcrumb */}
          <div className="flex items-center gap-2 min-w-0">
            {/* Always-visible toggle in navbar */}
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 rounded-md text-muted-foreground/40 hover:text-foreground hover:bg-accent transition-colors duration-150 flex items-center justify-center shrink-0"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft
                size={15}
                className={cn(
                  "transition-transform duration-200",
                  isCollapsed && "rotate-180",
                )}
              />
            </button>
            <div className="h-4 w-px bg-border/40" />
            <span className="text-[13px] font-medium text-muted-foreground/60 capitalize tracking-[-0.01em] truncate">
              {pathName === "/"
                ? "Dashboard"
                : pathName
                    .split("/")
                    .filter(Boolean)
                    .map((s) => s.replace(/-/g, " "))
                    .join(" / ")}
            </span>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5">
            <VisitSite />

            <div className="h-4 w-px bg-border/50 mx-0.5" />

            {/* Search */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-8 items-center gap-2 px-2.5 rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors duration-150"
            >
              <Search size={14} />
              <kbd className="hidden sm:inline-flex h-4 items-center gap-px rounded border border-border/60 bg-muted/60 px-1.5 text-[10px] font-medium text-muted-foreground/50">
                ⌘K
              </kbd>
            </button>

            {/* Bell */}
            <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground/60 hover:text-foreground hover:bg-accent transition-colors duration-150">
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
              <BellDotIcon size={15} />
            </button>
            <ThemeToggle />

            <div className="h-4 w-px bg-border/50 mx-0.5" />

            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors duration-150 outline-none">
                  <div className="h-6 w-6 rounded-md overflow-hidden ring-1 ring-border/60">
                    <UserAvatar />
                  </div>
                  <span className="text-[12.5px] font-medium text-foreground leading-none truncate max-w-[100px] hidden sm:block">
                    <UserName />
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground/40" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                sideOffset={6}
                className="w-52 rounded-lg p-1"
              >
                {/* User info header */}
                <DropdownMenuLabel className="px-2 py-1.5">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 shrink-0 rounded-md overflow-hidden ring-1 ring-border/50">
                      <UserAvatar />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[12.5px] font-semibold text-foreground truncate">
                        <UserName />
                      </span>
                      <span className="text-[11px] text-muted-foreground/60 font-normal">
                        Manage account
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Switch Workspace group */}
                {otherAccountsData?.getMyOtherAccounts &&
                  otherAccountsData.getMyOtherAccounts.length > 0 && (
                    <>
                      <DropdownMenuGroup>
                        <DropdownMenuLabel className="px-2 py-1 font-semibold text-muted-foreground/40 text-[10px] uppercase tracking-[0.08em]">
                          Switch Workspace
                        </DropdownMenuLabel>
                        {otherAccountsData.getMyOtherAccounts.map((account) => (
                          <DropdownMenuItem
                            key={account?.id}
                            disabled={isSwitching}
                            className="rounded-md px-2 py-1.5 cursor-pointer gap-2.5 group/item"
                            onClick={() =>
                              handleSwitch(account?.entityId, account?.name)
                            }
                          >
                            <div className="h-6 w-6 rounded-md overflow-hidden bg-muted flex items-center justify-center border border-border/40">
                              {account?.logo ? (
                                <img
                                  src={`https://cdn.thrico.network/${account?.logo}`}
                                  alt={account?.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Users
                                  size={12}
                                  className="text-muted-foreground/50"
                                />
                              )}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-[12.5px] font-medium truncate">
                                {account?.name}
                              </span>
                              <span className="text-[10px] text-muted-foreground/60 truncate capitalize">
                                {account?.role || "Admin"}
                              </span>
                            </div>
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                    </>
                  )}

                {/* Account group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    <Link
                      href="/settings/profile"
                      className="flex items-center gap-2"
                    >
                      <User2 className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[12.5px]">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    <Link
                      href="/settings/appearance"
                      className="flex items-center gap-2"
                    >
                      <PaintBucket className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[12.5px]">Appearance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    <Link
                      href="/notifications"
                      className="flex items-center gap-2"
                    >
                      <Bell className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[12.5px]">Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Billing group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    <Link
                      href="/settings/billing"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[12.5px]">Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    asChild
                    className="rounded-md px-2 py-1.5 cursor-pointer"
                  >
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-3.5 w-3.5 text-muted-foreground/60" />
                      <span className="text-[12.5px]">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  className="rounded-md px-2 py-1.5 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="text-[12.5px]">Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 w-full min-w-0">{children}</main>
      </SidebarInset>

      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />

      {/* ⌘K Global Search Palette */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search for a page..." />
        <CommandList className="max-h-[80vh] sm:max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {/* Grouped results */}
          {[
            "Home",
            "Community",
            "Moderation",
            "Gamification",
            "Modules",
            "Settings",
            "Account",
          ].map((section) => {
            const sectionItems = allSearchItems.filter(
              (i) => i.section === section,
            );
            if (sectionItems.length === 0) return null;

            return (
              <CommandGroup key={section} heading={section}>
                {sectionItems.map((item) => (
                  <CommandItem
                    key={item.key}
                    value={
                      typeof item.label === "string" ? item.label : item.key
                    }
                    onSelect={() => {
                      setSearchOpen(false);
                      router.push(item.path);
                    }}
                    className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0 border border-border/50">
                      {item.icon ? (
                        React.cloneElement(
                          item.icon as React.ReactElement<{ size?: number }>,
                          { size: 16 },
                        )
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </div>
                    <span className="text-[13.5px] font-medium">
                      {item.label}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}

/* ─── Root Export ────────────────────────────────────────────────── */
export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarLayoutInner>{children}</SidebarLayoutInner>
    </SidebarProvider>
  );
}
