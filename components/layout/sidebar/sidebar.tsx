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
    <div className="px-3 mb-1 mt-0.5 group-data-[collapsible=icon]:hidden">
      <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted-foreground/50">
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
          size: depth > 0 ? 14 : 16,
          className: cn(
            "shrink-0 transition-colors duration-150",
            isActive
              ? "text-primary"
              : "text-muted-foreground/70 group-hover:text-foreground/70",
          ),
        },
      )
    : null;

  const rowBase = cn(
    "group relative flex items-center w-full transition-all duration-150 cursor-pointer select-none",
    depth === 0 ? "h-8 px-2.5 rounded-lg gap-2.5" : "h-7 px-2 rounded-md gap-2",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "hover:bg-sidebar-accent/50",
  );

  /* Active indicator */
  const activeBar = isActive && depth === 0 && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2.5px] h-4 rounded-full bg-primary pointer-events-none group-data-[collapsible=icon]:hidden" />
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
              "flex items-center gap-2.5 flex-1 min-w-0 h-8",
              "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8",
            )}
          >
            {activeBar}
            {iconEl}
            <span className="truncate text-[13px] leading-none tracking-[-0.01em] transition-colors duration-150 group-data-[collapsible=icon]:hidden font-medium text-inherit">
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
            "text-destructive/60 hover:text-destructive hover:bg-destructive/5",
            "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
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
          "group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0! group-data-[collapsible=icon]:justify-center",
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
              "text-[13px] leading-none tracking-[-0.01em] transition-colors duration-150 truncate group-data-[collapsible=icon]:hidden",
              isActive
                ? "text-foreground font-semibold"
                : "text-muted-foreground group-hover:text-foreground font-medium",
            )}
          >
            {item.label}
          </span>
          {item.badge && (
            <Badge
              variant="outline"
              className="ml-auto text-[9px] h-4 px-1.5 bg-primary/5 text-primary border-primary/10 rounded-full font-medium shrink-0 group-data-[collapsible=icon]:hidden"
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
        className="border-r border-border bg-sidebar"
        style={{ "--sidebar-width": "240px" } as React.CSSProperties}
      >
        {/* HEADER */}
        <SidebarHeader className="h-14 flex flex-row items-center justify-between px-3 border-b border-border overflow-hidden">
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
            <div className="px-1.5 mb-3 mt-1 group-data-[collapsible=icon]:hidden">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50 pointer-events-none" />
                <Input
                  placeholder="Search…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 bg-sidebar-accent/50 border-border pl-8 pr-7 text-xs rounded-lg focus-visible:ring-1 focus-visible:ring-ring/30 placeholder:text-muted-foreground/40 text-foreground"
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

        {/* FOOTER */}
        {filteredProfile.length > 0 && (
          <SidebarFooter className="border-t border-border p-1.5 pt-2 pb-2">
            <SidebarGroup className="p-0">
              <SidebarGroupContent>
                {renderItems(filteredProfile)}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarFooter>
        )}
      </Sidebar>

      {/* ── MAIN CONTENT ── */}
      <SidebarInset className="bg-background">
        <header className="flex h-14 items-center justify-between gap-4 border-b border-border bg-background/80 backdrop-blur-lg px-5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150" />

            <div className="h-4 w-px bg-border hidden sm:block" />

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
              className="relative flex h-8 items-center gap-1.5 px-2.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150"
            >
              <Search size={15} />
              <kbd className="hidden sm:inline-flex h-5 items-center gap-0.5 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground/70">
                ⌘K
              </kbd>
            </button>

            <button className="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-150">
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive ring-2 ring-background" />
              <BellDotIcon size={15} />
            </button>

            <div className="h-4 w-px bg-border mx-0.5" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-lg bg-sidebar-accent/50 border border-border hover:bg-sidebar-accent transition-all duration-150 outline-none">
                  <div className="h-6 w-6">
                    <UserAvatar />
                  </div>
                  <span className="text-[12px] font-medium text-foreground leading-none truncate max-w-[100px]">
                    <UserName />
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground/50" />
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
