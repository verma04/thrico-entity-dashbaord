"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Search, X, ChevronRight, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

import { useGetUser, useGetMyOtherAccounts } from "@/graphql/actions";
import {
  useFilteredExtendedItems,
  useFilteredManagementItems,
  profile,
  emailItems,
  mobileAppItems,
  websiteItems,
} from "./menu-items";
import { useWorkspaceSwitch } from "@/hooks/use-workspace-switch";

import type { MenuItem } from "./types";
import { MenuItemRow, CollapsibleSection } from "./sidebar-components";
import { TopNavbar } from "./top-navbar";
import { ParentSidebar } from "./parent-sidebar";
import LogoutModal from "./logout";
import { SwitchingLoader } from "./switching-loader";

type ActiveTab =
  | "home"
  | "community"
  | "gamification"
  | "modules"
  | "settings"
  | "email"
  | "mobile-app"
  | "website";

function getActiveTab(pathName: string): ActiveTab {
  if (pathName.startsWith("/settings/modules")) return "modules";
  if (pathName.startsWith("/app-layout")) return "website";
  if (pathName.startsWith("/settings")) return "settings";
  if (pathName.startsWith("/email")) return "email";
  if (pathName.startsWith("/mobile-app")) return "mobile-app";

  if (
    pathName.startsWith("/members") ||
    pathName.startsWith("/moderation") ||
    pathName.startsWith("/feed") ||
    pathName.startsWith("/reports") ||
    pathName.startsWith("/trust-center")
  )
    return "community";

  if (pathName.startsWith("/gamification")) return "gamification";

  if (
    pathName === "/" ||
    pathName.startsWith("/dashboard") ||
    pathName.startsWith("/chat") ||
    pathName.startsWith("/ai-agent")
  )
    return "home";

  return "modules"; // Fallback
}

export function ChildSidebarContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathName = usePathname();
  const router = useRouter();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  const activeTab = getActiveTab(pathName);

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
    gamificationLabel,
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
  const filteredEmail = useMemo(
    () => filterList(emailItems as MenuItem[], searchQuery),
    [searchQuery, filterList],
  );
  const filteredMobileApp = useMemo(
    () => filterList(mobileAppItems as MenuItem[], searchQuery),
    [searchQuery, filterList],
  );
  const filteredWebsite = useMemo(
    () => filterList(websiteItems as MenuItem[], searchQuery),
    [searchQuery, filterList],
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
      ...flattenItems(websiteItems as MenuItem[], "Website"),
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
    <div className="flex flex-col flex-1 min-w-0 w-full overflow-hidden">
      <SwitchingLoader
        isVisible={isSwitching}
        targetWorkspaceName={targetName}
      />
      <TopNavbar
        toggleSidebar={toggleSidebar}
        isCollapsed={isCollapsed}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setSearchOpen={setSearchOpen}
        setLogoutOpen={setLogoutOpen}
        otherAccountsData={otherAccountsData}
        isSwitching={isSwitching}
        handleSwitch={handleSwitch}
      />
      <div className="flex flex-1 relative w-full bg-white group/sidebar-wrapper">
        <ParentSidebar />
        {/* ── SIDEBAR ── */}
        <Sidebar
          collapsible="icon"
          className="border bg-[#f9f9f9] dark:bg-background transition-[width] duration-150 ease-in-out !left-[80px] !top-[64px] !h-[calc(100vh-72px)] my-2 mx-2 mt-0 shadow-sm !rounded-2xl !rounded-r-none !rounded-br-none"
          style={{ "--sidebar-width": "248px" } as React.CSSProperties}
        >
          <SidebarHeader className="h-10 flex items-center justify-between flex-row px-4 pb-0 pt-0 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-center">
            {!isCollapsed && (
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 capitalize tracking-tight w-full">
                {activeTab}
              </span>
            )}
            {isCollapsed && (
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 capitalize text-center w-full">
                {activeTab[0]}
              </span>
            )}
          </SidebarHeader>

          <SidebarContent className="py-2 px-2 overflow-x-hidden group-data-[collapsible=icon]:px-1">
            {!isCollapsed && (
              <div className="mb-3 mt-1 group-data-[collapsible=icon]:hidden">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                  <Input
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8 bg-neutral-100 dark:bg-neutral-900 border-transparent pl-8 pr-7 text-[12.5px] rounded-md focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-100"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === "home" && (
              <CollapsibleSection
                sectionKey="home"
                label="Home"
                items={filteredHome}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {activeTab === "community" && (
              <>
                <CollapsibleSection
                  sectionKey="community"
                  label="Community"
                  items={filteredCommunity}
                  renderItems={renderItems}
                  className="mb-1"
                />
                <CollapsibleSection
                  sectionKey="moderation"
                  label="Moderation"
                  items={filteredModeration}
                  renderItems={renderItems}
                  className="mb-1"
                />
              </>
            )}

            {activeTab === "gamification" && (
              <CollapsibleSection
                sectionKey="gamification"
                label={gamificationLabel}
                items={filteredGamification}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {activeTab === "modules" && (
              <CollapsibleSection
                sectionKey="modules"
                label="Modules"
                items={filteredModules}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {activeTab === "website" && (
              <CollapsibleSection
                sectionKey="website"
                label="Website Builder"
                items={filteredWebsite}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {activeTab === "settings" && (
              <CollapsibleSection
                sectionKey="settings"
                label="Settings"
                items={filteredSettings}
                renderItems={renderItems}
              />
            )}

            {activeTab === "email" && (
              <CollapsibleSection
                sectionKey="email"
                label="Email"
                items={filteredEmail}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {activeTab === "mobile-app" && (
              <CollapsibleSection
                sectionKey="mobile-app"
                label="Mobile App"
                items={filteredMobileApp}
                renderItems={renderItems}
                className="mb-1"
              />
            )}

            {searchQuery.trim() &&
              filteredHome.length === 0 &&
              filteredModeration.length === 0 &&
              filteredGamification.length === 0 &&
              filteredModules.length === 0 &&
              filteredSettings.length === 0 &&
              filteredWebsite.length === 0 &&
              filteredProfile.length === 0 && (
                <div className="py-8 text-center group-data-[collapsible=icon]:hidden">
                  <p className="text-[11.5px] text-muted-foreground/50">
                    No results found
                  </p>
                </div>
              )}
          </SidebarContent>

          {activeTab === "settings" && (
            <SidebarFooter className="border-t border-border/50 bg-[#f9f9f9] dark:bg-background">
              <SidebarMenu>
                <MenuItemRow
                  item={{
                    key: "logout",
                    label: "Log out",
                    isLogout: true,
                    icon: <LogOut size={16} />,
                  }}
                  pathName={pathName}
                  openGroup={openGroup}
                  toggleGroup={toggleGroup}
                  setLogoutOpen={setLogoutOpen}
                />
              </SidebarMenu>
            </SidebarFooter>
          )}
        </Sidebar>

        {/* ── MAIN CONTENT ── */}
        <SidebarInset className="bg-transparent overflow-hidden flex flex-col h-[calc(100vh-56px)]">
          <main className="flex-1 w-full min-w-0 overflow-y-auto">
            {children}
          </main>
        </SidebarInset>
      </div>

      <LogoutModal open={logoutOpen} onOpenChange={setLogoutOpen} />

      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput placeholder="Search for a page..." />
        <CommandList className="max-h-[80vh] sm:max-h-[450px]">
          <CommandEmpty>No results found.</CommandEmpty>

          {[
            "Home",
            "Community",
            "Moderation",
            "Gamification",
            "Modules",
            "Website",
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
    </div>
  );
}
