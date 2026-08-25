"use client";

import React from "react";
import Link from "next/link";
import {
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
  PanelLeft,
  Calendar,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSwitcher } from "./switcher";
import VisitSite from "./visit";
import { ThemeToggle } from "../theme-toggle";
import { UserAvatar, UserName } from "./menu-items";
import { EntityLogo } from "./entity-logo";

interface TopNavbarProps {
  toggleSidebar: () => void;
  isCollapsed: boolean;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  setSearchOpen: (val: boolean) => void;
  setLogoutOpen: (val: boolean) => void;
  otherAccountsData: any; // Ideally typed with your GraphQL generated types
  isSwitching: boolean;
  handleSwitch: (entityId: string, name: string) => void;
  showSidebarToggle?: boolean;
}

export function TopNavbar({
  toggleSidebar,
  isCollapsed,
  searchQuery,
  setSearchQuery,
  setSearchOpen,
  setLogoutOpen,
  otherAccountsData,
  isSwitching,
  handleSwitch,
  showSidebarToggle = true,
}: TopNavbarProps) {
  return (
    <header className="flex h-14 items-center justify-between gap-3  bg-white dark:bg-background px-4 sticky top-0 z-40">
      {/* Left: sidebar toggle + Workspace */}
      <div className="flex items-center gap-2 min-w-0 shrink-0">
        <WorkspaceSwitcher />
        {showSidebarToggle && (
          <>
            <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800" />
            <button
              onClick={toggleSidebar}
              className="h-7 w-7 rounded-md text-neutral-400 hover:text-neutral-900 hover:bg-neutral-100 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 flex items-center justify-center shrink-0 cursor-pointer"
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
          </>
        )}
      </div>

      {/* Center: Search + AI Chats */}
      <div className="flex-1 flex justify-center items-center gap-2 max-w-xl mx-auto">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
          <Input
            placeholder="Search ⌘K"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full bg-neutral-100 dark:bg-neutral-900 border-transparent pl-9 pr-7 text-[13px] rounded-full focus-visible:ring-1 focus-visible:ring-primary/30 placeholder:text-neutral-400 text-neutral-900 dark:text-neutral-100"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        {/* <button className="hidden lg:flex items-center gap-1 text-[13px] font-medium text-neutral-500 hover:text-neutral-900 px-3 py-1 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-700">
          AI Chats <Sparkles className="w-3.5 h-3.5 text-pink-500" />
        </button> */}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        <VisitSite />

        <div className="h-4 w-px bg-border/50 mx-0.5" />

        {/* Search (Mobile) */}
        <button
          onClick={() => setSearchOpen(true)}
          className="md:hidden flex h-8 items-center gap-2 px-2.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150"
        >
          <Search size={14} />
        </button>

        {/* Bell */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150">
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
          <BellDotIcon size={15} />
        </button>
        <ThemeToggle />

        <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-800 mx-0.5" />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center gap-2 h-8 pl-1 pr-2.5 rounded-md text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:text-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 outline-none">
              <div className="h-6 w-6 rounded-md overflow-hidden ring-1 ring-neutral-200 dark:ring-neutral-800">
                <UserAvatar />
              </div>
              <span className="text-[12.5px] font-medium text-neutral-900 dark:text-neutral-100 leading-none truncate max-w-[100px] hidden sm:block">
                <UserName />
              </span>
              <ChevronDown className="h-3 w-3 text-neutral-400" />
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
                    {otherAccountsData.getMyOtherAccounts.map(
                      (account: any) => (
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
                      ),
                    )}
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
                <Link href="/notifications" className="flex items-center gap-2">
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
  );
}
