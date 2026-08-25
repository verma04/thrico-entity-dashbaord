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
  aiItems as aiItemsRaw,
} from "./menu-items";
import { useWorkspaceSwitch } from "@/hooks/use-workspace-switch";

import type { MenuItem } from "./types";
import { MenuItemRow, CollapsibleSection } from "./sidebar-components";
import { TopNavbar } from "./top-navbar";
import { ParentSidebar } from "./parent-sidebar";
import LogoutModal from "./logout";
import { SwitchingLoader } from "./switching-loader";
import { getActiveSidebarTab, isFormRoute } from "./sidebar-utils";

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
  const { state, toggleSidebar, setOpen } = useSidebar();
  const isCollapsed = state === "collapsed";

  const activeTab = getActiveSidebarTab(pathName);

  // Automatically collapse child-sidebar drawer on form routes; keep open on all other pages
  useEffect(() => {
    if (isFormRoute(pathName)) {
      setOpen(false);
    } else {
      setOpen(true);
    }
  }, [pathName, setOpen]);

  // Default-open the Classifications group when on the members tab
  useEffect(() => {
    if (activeTab === "members") {
      setOpenGroup("members-classifications");
    }
  }, [activeTab]);

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
    aiStudioItems,
    aiSuperAgentsItems,
    aiChatItems,
    membersIntelligence,
    feedItems,
    moderationItems,
    reportedItems,
    gamificationEngine,
    modules: modulesItems,
    integrationsItems,
  } = useFilteredExtendedItems();
  const { billingAndTeamItems, setupAndDesignItems, supportAndLegalItems } =
    useFilteredManagementItems();

  const toggleGroup = (key: string) => {
    setOpenGroup((prev) => (prev === key ? null : key));
  };

  const filterList = useCallback(
    (list: MenuItem[] = [], query: string): MenuItem[] => {
      if (!list) return [];
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
  const filteredAiStudio = useMemo(
    () => filterList(aiStudioItems as MenuItem[], searchQuery),
    [searchQuery, aiStudioItems, filterList],
  );
  const filteredAiSuperAgents = useMemo(
    () => filterList(aiSuperAgentsItems as MenuItem[], searchQuery),
    [searchQuery, aiSuperAgentsItems, filterList],
  );
  const filteredAiChat = useMemo(
    () => filterList(aiChatItems as MenuItem[], searchQuery),
    [searchQuery, aiChatItems, filterList],
  );
  const filteredMembers = useMemo(
    () => filterList(membersIntelligence as MenuItem[], searchQuery),
    [searchQuery, membersIntelligence, filterList],
  );
  const filteredFeed = useMemo(
    () => filterList(feedItems as MenuItem[], searchQuery),
    [searchQuery, feedItems, filterList],
  );
  const filteredModeration = useMemo(
    () => filterList(moderationItems as MenuItem[], searchQuery),
    [searchQuery, moderationItems, filterList],
  );
  const filteredReported = useMemo(
    () => filterList(reportedItems as MenuItem[], searchQuery),
    [searchQuery, reportedItems, filterList],
  );
  const filteredGamification = useMemo(
    () => filterList(gamificationEngine as MenuItem[], searchQuery),
    [searchQuery, gamificationEngine, filterList],
  );
  const filteredModules = useMemo(
    () => filterList(modulesItems as MenuItem[], searchQuery),
    [searchQuery, modulesItems, filterList],
  );
  const filteredBillingAndTeam = useMemo(
    () => filterList(billingAndTeamItems as MenuItem[], searchQuery),
    [searchQuery, billingAndTeamItems, filterList],
  );
  const filteredSetupAndDesign = useMemo(
    () => filterList(setupAndDesignItems as MenuItem[], searchQuery),
    [searchQuery, setupAndDesignItems, filterList],
  );
  const filteredSupportAndLegal = useMemo(
    () => filterList(supportAndLegalItems as MenuItem[], searchQuery),
    [searchQuery, supportAndLegalItems, filterList],
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
  const filteredIntegrations = useMemo(
    () => filterList(integrationsItems as MenuItem[], searchQuery),
    [searchQuery, integrationsItems, filterList],
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
      items: MenuItem[] = [],
      section: string,
      parentIcon?: React.ReactNode,
    ): any[] => {
      if (!items) return [];
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
      ...flattenItems(aiStudioItems as MenuItem[], "AI"),
      ...flattenItems(aiSuperAgentsItems as MenuItem[], "AI"),
      ...flattenItems(aiChatItems as MenuItem[], "AI"),
      ...flattenItems(membersIntelligence as MenuItem[], "Members"),
      ...flattenItems(feedItems as MenuItem[], "Content"),
      ...flattenItems(moderationItems as MenuItem[], "Content"),
      ...flattenItems(reportedItems as MenuItem[], "Content"),
      ...flattenItems(gamificationEngine as MenuItem[], "Gamification"),
      ...flattenItems(modulesItems as MenuItem[], "Modules"),
      ...flattenItems(integrationsItems as MenuItem[], "Integrations"),
      ...flattenItems(websiteItems as MenuItem[], "Website"),
      ...flattenItems(billingAndTeamItems as MenuItem[], "Settings"),
      ...flattenItems(setupAndDesignItems as MenuItem[], "Settings"),
      ...flattenItems(supportAndLegalItems as MenuItem[], "Settings"),
      ...flattenItems(profileItems, "Account"),
    ];
  }, [
    homeItems,
    aiStudioItems,
    aiSuperAgentsItems,
    aiChatItems,
    membersIntelligence,
    feedItems,
    moderationItems,
    reportedItems,
    gamificationEngine,
    modulesItems,
    integrationsItems,
    websiteItems,
    billingAndTeamItems,
    setupAndDesignItems,
    supportAndLegalItems,
    profileItems,
    flattenItems,
  ]);

  const hasCurrentTabResults = useMemo(() => {
    if (!searchQuery.trim()) return true;
    switch (activeTab) {
      case "ai":
        return (
          filteredAiStudio.length > 0 ||
          filteredAiSuperAgents.length > 0 ||
          filteredAiChat.length > 0
        );
      case "members":
        return filteredMembers.length > 0;
      case "content":
        return (
          filteredFeed.length > 0 ||
          filteredModeration.length > 0 ||
          filteredReported.length > 0
        );
      case "gamification":
        return filteredGamification.some(
          (group) => (group.children || []).length > 0,
        );
      case "modules":
        return filteredModules.length > 0;
      case "website":
        return filteredWebsite.length > 0;
      case "settings":
        return (
          filteredBillingAndTeam.length > 0 ||
          filteredSetupAndDesign.length > 0 ||
          filteredSupportAndLegal.length > 0
        );
      case "email":
        return filteredEmail.length > 0;
      case "integrations":
        return filteredIntegrations.length > 0;
      default:
        return true;
    }
  }, [
    searchQuery,
    activeTab,
    filteredAiStudio,
    filteredAiSuperAgents,
    filteredAiChat,
    filteredMembers,
    filteredFeed,
    filteredModeration,
    filteredReported,
    filteredGamification,
    filteredModules,
    filteredWebsite,
    filteredBillingAndTeam,
    filteredSetupAndDesign,
    filteredSupportAndLegal,
    filteredEmail,
    filteredIntegrations,
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
        setSearchOpen={setSearchOpen}
        setLogoutOpen={setLogoutOpen}
        otherAccountsData={otherAccountsData}
        isSwitching={isSwitching}
        handleSwitch={handleSwitch}
        showSidebarToggle={activeTab !== "mobile-app" && activeTab !== "home"}
      />
      <div className="flex flex-1 relative w-full bg-white dark:bg-neutral-950 group/sidebar-wrapper">
        <ParentSidebar />
        {/* ── SIDEBAR (Hidden on Home route & Mobile App) ── */}
        {activeTab !== "mobile-app" && activeTab !== "home" && (
          <Sidebar
            collapsible="icon"
            className="border bg-[#f9f9f9] dark:bg-background transition-[width] duration-150 ease-in-out left-[76px]! top-[64px]! h-[calc(100vh-72px)]! mb-2 z-30 shadow-sm rounded-l-2xl!"
            style={{ "--sidebar-width": "210px" } as React.CSSProperties}
          >
            <SidebarHeader className="h-10 flex items-center justify-between flex-row px-3 pb-0 pt-0 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:justify-center">
              {!isCollapsed && (
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 capitalize tracking-tight w-full truncate">
                  {activeTab === "gamification"
                    ? "Gamification Engine"
                    : activeTab === "ai"
                      ? "AI Studio"
                      : activeTab}
                </span>
              )}
              {isCollapsed && (
                <span className="text-base font-bold text-neutral-900 dark:text-neutral-100 capitalize text-center w-full">
                  {activeTab[0]}
                </span>
              )}
            </SidebarHeader>

            <SidebarContent className="py-1 pb-10 px-2.5 overflow-x-hidden group-data-[collapsible=icon]:px-1">
              {!isCollapsed && (
                <div className="mb-2 mt-0.5 group-data-[collapsible=icon]:hidden">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 pointer-events-none" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-7.5 w-full bg-neutral-100 hover:bg-neutral-100/80 focus:bg-white dark:bg-neutral-900 dark:hover:bg-neutral-900/80 dark:focus:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 pl-8 pr-7 text-[12px] rounded-md focus-visible:ring-1 focus-visible:ring-primary/40 placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-100 transition-all shadow-none"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "ai" && (
                <>
                  <CollapsibleSection
                    sectionKey="ai-studio"
                    label="AI Studio"
                    items={filteredAiStudio}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="ai-super-agents"
                    label="Super Agents"
                    items={filteredAiSuperAgents}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="ai-chat"
                    label="Chat"
                    items={filteredAiChat}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                </>
              )}

              {activeTab === "members" && (
                <CollapsibleSection
                  sectionKey="members"
                  label="Members"
                  items={filteredMembers}
                  renderItems={renderItems}
                  searchQuery={searchQuery}
                  className="mb-1"
                />
              )}

              {activeTab === "content" && (
                <>
                  <CollapsibleSection
                    sectionKey="feed"
                    label="Feed"
                    items={filteredFeed}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="moderation"
                    label="Moderation"
                    items={filteredModeration}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="reported"
                    label="Reported Items"
                    items={filteredReported}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                </>
              )}

              {activeTab === "gamification" && (
                <>
                  {filteredGamification.map((group) => {
                    const groupItems = (group.children || []).map((child) => ({
                      ...child,
                      icon: child.icon || group.icon,
                    })) as MenuItem[];
                    return (
                      <CollapsibleSection
                        key={group.key}
                        sectionKey={group.key}
                        label={
                          typeof group.label === "string"
                            ? group.label
                            : group.key
                        }
                        items={groupItems}
                        renderItems={renderItems}
                        searchQuery={searchQuery}
                        className="mb-1"
                      />
                    );
                  })}
                </>
              )}

              {activeTab === "modules" && (
                <CollapsibleSection
                  sectionKey="modules"
                  label="Modules"
                  items={filteredModules}
                  renderItems={renderItems}
                  searchQuery={searchQuery}
                  className="mb-1"
                />
              )}

              {activeTab === "website" && (
                <CollapsibleSection
                  sectionKey="website"
                  label="Website Builder"
                  items={filteredWebsite}
                  renderItems={renderItems}
                  searchQuery={searchQuery}
                  className="mb-1"
                />
              )}

              {activeTab === "settings" && (
                <>
                  <CollapsibleSection
                    sectionKey="settings-billing"
                    label="Billing & Team"
                    items={filteredBillingAndTeam}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="settings-setup"
                    label="Setup & Design"
                    items={filteredSetupAndDesign}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                  <CollapsibleSection
                    sectionKey="settings-support"
                    label="Support & Legal"
                    items={filteredSupportAndLegal}
                    renderItems={renderItems}
                    searchQuery={searchQuery}
                    className="mb-1"
                  />
                </>
              )}

              {activeTab === "email" && (
                <CollapsibleSection
                  sectionKey="email"
                  label="Email"
                  items={filteredEmail}
                  renderItems={renderItems}
                  searchQuery={searchQuery}
                  className="mb-1"
                />
              )}

              {activeTab === "integrations" && (
                <CollapsibleSection
                  sectionKey="integrations"
                  label="Integrations"
                  items={filteredIntegrations}
                  renderItems={renderItems}
                  searchQuery={searchQuery}
                  className="mb-1"
                />
              )}

              {searchQuery.trim() && !hasCurrentTabResults && (
                <div className="py-8 text-center group-data-[collapsible=icon]:hidden">
                  <p className="text-[11.5px] text-muted-foreground/60">
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
        )}

        {/* ── MAIN CONTENT ── */}
        <SidebarInset className="bg-transparent overflow-hidden flex flex-col h-[calc(100vh-64px)] min-w-0 flex-1 relative">
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
            "Members",
            "Content",
            "Gamification",
            "Modules",
            "Integrations",
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
