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
} from "lucide-react";
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
import { useGetUser } from "@/graphql/actions";

import {
  useFilteredExtendedItems,
  useFilteredManagementItems,
  profile,
  UserAvatar,
  UserName,
} from "./menu-items";
import { useUserStore } from "@/store/store";
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
  badge?: string;
}

/* ─── Section Label ──────────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 mb-2 mt-5 group-data-[collapsible=icon]:hidden first:mt-2">
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 select-none">
        {children}
      </span>
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
          size: depth > 0 ? 15 : 18,
          className: cn(
            "shrink-0 transition-all duration-300",
            isActive
              ? "text-primary scale-110 drop-shadow-sm"
              : "text-muted-foreground/50 group-hover:text-foreground/80 group-hover:scale-110",
          ),
        },
      )
    : null;

  const rowBase = cn(
    "group relative flex items-center w-full transition-all duration-300 ease-out cursor-pointer select-none overflow-hidden",
    depth === 0 ? "h-10 px-3 rounded-xl gap-3 my-0.5" : "h-8 px-3 rounded-[10px] gap-2.5 my-0.5",
    isActive
      ? "bg-primary/10 text-primary dark:bg-primary/20 shadow-[inset_0px_1px_0px_rgba(255,255,255,0.04)]"
      : "hover:bg-sidebar-accent/60 text-muted-foreground hover:text-foreground hover:translate-x-1",
  );

  /* Active indicator */
  const activeBar = isActive && depth === 0 && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[4px] h-5 rounded-r-full bg-primary pointer-events-none group-data-[collapsible=icon]:hidden shadow-[0_0_12px_rgba(var(--primary),0.6)] transition-all duration-300" />
  );

  /* ── Children (expandable group) ── */
  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild={false}
          isActive={isActive}
          tooltip={tooltipLabel}
          className={cn(
            rowBase,
            "justify-between h-auto! py-0 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => !isCollapsed && toggleGroup(item.key)}
        >
          <span
            className={cn(
              "flex items-center gap-3 flex-1 min-w-0 h-10",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10",
            )}
          >
            {activeBar}
            {iconEl}
            <span
              className={cn(
                "truncate text-[13.5px] leading-none tracking-normal transition-colors duration-300 group-data-[collapsible=icon]:hidden",
                isActive ? "font-semibold text-primary" : "font-medium text-inherit"
              )}
            >
              {item.label}
            </span>
          </span>
          <ChevronRight
            size={12}
            className={cn(
              "shrink-0 text-muted-foreground/40 transition-transform duration-200 group-data-[collapsible=icon]:hidden",
              isOpen && "rotate-90 text-primary",
            )}
          />
        </SidebarMenuButton>

        {isOpen && !isCollapsed && (
          <div className="ml-4 pl-2.5 border-l border-border/50 mt-0.5 mb-0.5 space-y-0.5 group-data-[collapsible=icon]:hidden">
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
            "text-destructive/70 hover:text-destructive hover:bg-destructive/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] dark:hover:bg-destructive/20",
            "group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
          )}
          onClick={() => setLogoutOpen(true)}
        >
          {iconEl}
          <span className="text-[13px] leading-none tracking-[-0.01em] font-medium truncate group-data-[collapsible=icon]:hidden">
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
          "group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center",
        )}
      >
        <Link
          href={item.path || "#"}
          className="flex items-center gap-3 flex-1 min-w-0 group-data-[collapsible=icon]:justify-center"
        >
          {activeBar}
          {iconEl}
          <span
            className={cn(
              "text-[13.5px] leading-none tracking-normal transition-colors duration-300 truncate group-data-[collapsible=icon]:hidden",
              isActive
                ? "text-primary font-semibold"
                : "text-inherit font-medium shadow-none",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge
              variant="outline"
              className="ml-auto text-[9px] h-[18px] px-2 bg-primary/10 text-primary border-transparent rounded-full font-bold uppercase tracking-wider shrink-0 shadow-sm group-data-[collapsible=icon]:hidden"
            >
              {item.badge}
            </Badge>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
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
  const { state } = useSidebar();
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
  const flattenItems = useCallback((items: MenuItem[], section: string, parentIcon?: React.ReactNode): any[] => {
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
          section: section
        });
      }
      return acc;
    }, []);
  }, []);

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
  }, [homeItems, communityIntelligence, contentModeration, gamificationEngine, modulesItems, managementFolders, profileItems, flattenItems]);

  const renderItems = (items: MenuItem[]) => (
    <SidebarMenu className="gap-px">
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
        className="border-r border-border/40 bg-sidebar/95 backdrop-blur-2xl shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-all duration-300"
        style={{ "--sidebar-width": "260px" } as React.CSSProperties}
      >
        {/* HEADER */}
        <SidebarHeader className="h-16 flex flex-row items-center justify-between px-4 border-b border-border/40 overflow-hidden bg-sidebar/50 backdrop-blur-sm">
          {!isCollapsed && (
            <Link
              href="/"
              className="flex items-center gap-2.5 flex-1 min-w-0 overflow-hidden"
            >
              <Logo />
            </Link>
          )}
          <SidebarTrigger className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all duration-150 flex items-center justify-center shrink-0" />
        </SidebarHeader>

        {/* CONTENT */}
        <SidebarContent className="py-2 px-1.5 overflow-x-hidden">
          {/* SEARCH */}
          {!isCollapsed && (
            <div className="px-3 mb-4 mt-2 group-data-[collapsible=icon]:hidden">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors pointer-events-none" />
                <Input
                  placeholder="Search pages or settings…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 bg-background/50 border-border/40 shadow-sm pl-9 pr-8 text-[13px] rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 placeholder:text-muted-foreground/40 text-foreground transition-all duration-300 hover:bg-background/80"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* HOME */}
          {filteredHome.length > 0 && (
            <SidebarGroup className="mb-3 p-0">
              <SectionLabel>Home</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredHome)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* COMMUNITY INTELLIGENCE */}
          {filteredCommunity.length > 0 && (
            <SidebarGroup className="mb-3 p-0">
              <SectionLabel>Community</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredCommunity)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* CONTENT MODERATION */}
          {filteredModeration.length > 0 && (
            <SidebarGroup className="mb-3 p-0">
              <SectionLabel>Moderation</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredModeration)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* GAMIFICATION ENGINE */}
          {filteredGamification.length > 0 && (
            <SidebarGroup className="mb-3 p-0">
              <SectionLabel>Gamification</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredGamification)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* MODULES */}
          {filteredModules.length > 0 && (
            <SidebarGroup className="mb-3 p-0">
              <SectionLabel>Modules</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredModules)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* ADMIN SETTINGS */}
          {filteredSettings.length > 0 && (
            <SidebarGroup className="p-0">
              <SectionLabel>Settings</SectionLabel>
              <SidebarGroupContent>
                {renderItems(filteredSettings)}
              </SidebarGroupContent>
            </SidebarGroup>
          )}

          {/* NO RESULTS */}
          {searchQuery.trim() &&
            filteredHome.length === 0 &&
            filteredModeration.length === 0 &&
            filteredGamification.length === 0 &&
            filteredModules.length === 0 &&
            filteredSettings.length === 0 &&
            filteredProfile.length === 0 && (
              <div className="px-3 py-6 text-center group-data-[collapsible=icon]:hidden">
                <p className="text-[11px] text-muted-foreground/60">
                  No matching items
                </p>
              </div>
            )}
        </SidebarContent>

      </Sidebar>

      {/* ── MAIN CONTENT ── */}
      <SidebarInset className="bg-background transition-all duration-300">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/40 bg-background/80 backdrop-blur-2xl px-5 sticky top-0 z-40 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">

            <div className="hidden sm:flex items-center gap-1.5 text-[13px]">
              <span className="font-medium text-foreground/80 capitalize tracking-[-0.01em]">
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

          <div className="flex items-center gap-2">
            <VisitSite />
            <div className="h-4 w-px bg-border mx-0.5" />

            <button
              onClick={() => setSearchOpen(true)}
              className="relative flex h-9 items-center gap-2 px-3 rounded-xl bg-accent/40 text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-all duration-300 border border-transparent hover:border-border/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]"
            >
              <Search size={15} className="group-hover:text-primary transition-colors" />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded-md border border-border/50 bg-background/50 px-1.5 text-[10px] font-bold text-muted-foreground/70 shadow-sm">
                ⌘K
              </kbd>
            </button>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-accent/40 text-muted-foreground hover:text-primary hover:bg-accent/80 transition-all duration-300 border border-transparent hover:border-border/60 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)]">
              <span className="absolute top-2 right-2.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
              <BellDotIcon size={16} />
            </button>

            <div className="h-4 w-px bg-border/50 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 h-9 pl-1 pr-3 rounded-xl bg-accent/40 border border-transparent hover:border-border/60 hover:bg-accent/80 transition-all duration-300 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] outline-none">
                  <div className="h-7 w-7 rounded-lg overflow-hidden ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                    <UserAvatar />
                  </div>
                  <span className="text-[13px] font-semibold text-foreground leading-none truncate max-w-[120px] group-hover:text-primary transition-colors">
                    <UserName />
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary/70 transition-colors" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8} className="w-56 rounded-xl p-1.5">
                {/* User info header */}
                <DropdownMenuLabel className="px-2.5 py-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 shrink-0">
                      <UserAvatar />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-semibold text-foreground truncate">
                        <UserName />
                      </span>
                      <span className="text-[11px] text-muted-foreground font-normal">Manage account</span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Account group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
                    <Link href="/settings/profile" className="flex items-center gap-2.5">
                      <User2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[13px]">Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
                    <Link href="/settings/appearance" className="flex items-center gap-2.5">
                      <PaintBucket className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[13px]">Appearance</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
                    <Link href="/notifications" className="flex items-center gap-2.5">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[13px]">Notifications</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Billing group */}
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
                    <Link href="/settings/billing" className="flex items-center gap-2.5">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[13px]">Billing</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-lg px-2.5 py-2 cursor-pointer">
                    <Link href="/settings" className="flex items-center gap-2.5">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-[13px]">Settings</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />

                {/* Logout */}
                <DropdownMenuItem
                  className="rounded-lg px-2.5 py-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/5"
                  onClick={() => setLogoutOpen(true)}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="text-[13px]">Log out</span>
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
          {["Home", "Community", "Moderation", "Gamification", "Modules", "Settings", "Account"].map((section) => {
            const sectionItems = allSearchItems.filter(i => i.section === section);
            if (sectionItems.length === 0) return null;
            
            return (
              <CommandGroup key={section} heading={section}>
                {sectionItems.map((item) => (
                  <CommandItem
                    key={item.key}
                    value={typeof item.label === 'string' ? item.label : item.key}
                    onSelect={() => {
                      setSearchOpen(false);
                      router.push(item.path);
                    }}
                    className="flex items-center gap-3 p-3 cursor-pointer rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground shrink-0 border border-border/50">
                      {item.icon ? React.cloneElement(item.icon as React.ReactElement<{ size?: number }>, { size: 16 }) : <ChevronRight size={16} />}
                    </div>
                    <span className="text-[13.5px] font-medium">{item.label}</span>
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
