"use client";

import React from "react";
import Link from "next/link";
import { Lock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSidebarSectionStore } from "@/store/useSidebarStore";
import type { MenuItem } from "./types";

/* ─── Section Label (collapsible) ───────────────────────────────── */
export function SectionLabel({
  sectionKey,
  children,
}: {
  sectionKey: string;
  children: React.ReactNode;
}) {
  const collapsedSections = useSidebarSectionStore((s) => s.collapsedSections);
  const toggleSection = useSidebarSectionStore((s) => s.toggleSection);
  const isOpen = !collapsedSections.includes(sectionKey);

  return (
    <div className="mb-1 mt-4 first:mt-1">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="group-data-[collapsible=icon]:hidden flex w-full items-center justify-between px-2.5 py-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors duration-150 cursor-pointer select-none"
      >
        <span className="text-[11px] font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 leading-none">
          {children}
        </span>
        <ChevronRight
          size={12}
          className={cn(
            "text-neutral-400 transition-transform duration-200",
            isOpen && "rotate-90",
          )}
        />
      </button>
      <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center px-2 py-1">
        <div className="w-full h-px bg-neutral-200 dark:bg-neutral-800" />
      </div>
    </div>
  );
}

/* ─── NavRailItem (for Parent Sidebar) ──────────────────────────── */
export function NavRailItem({
  icon,
  label,
  active,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}) {
  const content = (
    <>
      <div className="relative flex items-center justify-center">
        {active && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-tr from-[#ff5733] via-[#0967ff ] to-[#0967ff] rounded-full blur-[6px] opacity-90 mix-blend-screen" />
        )}
        <div
          className={cn(
            "relative z-10 transition-transform duration-200",
            active && "scale-110 text-white drop-shadow-sm",
          )}
        >
          {icon}
        </div>
      </div>
      <span
        className={cn(
          "text-[9px] tracking-wide mt-1",
          active ? "font-bold text-white" : "font-medium text-neutral-400",
        )}
      >
        {label}
      </span>
    </>
  );

  const className = cn(
    "flex flex-col items-center justify-center w-[50px] py-1 rounded-xl transition-all duration-200 group/navitem relative",
    !active && "hover:text-white hover:bg-white/5",
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return <button className={className}>{content}</button>;
}

/* ─── Menu Item Renderer ─────────────────────────────────────────── */
export function MenuItemRow({
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
          size: depth > 0 ? 12 : 14,
          className: cn(
            "shrink-0 transition-colors duration-150",
            isActive
              ? "text-neutral-900 dark:text-neutral-100"
              : "text-[#636363] group-hover:text-neutral-600 dark:text-neutral-500 dark:group-hover:text-neutral-300",
          ),
        },
      )
    : null;

  const rowBase = cn(
    "group relative flex items-center w-full transition-colors duration-200 select-none",
    item.isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer",
    depth === 0
      ? "h-7 px-2 rounded-md gap-2 my-[1px]"
      : "h-6 px-2 rounded-md gap-1.5 my-[1px]",
    isActive && !item.isLocked
      ? "bg-neutral-200/60 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-medium"
      : item.isLocked
        ? "text-muted-foreground"
        : "text-[#636363] dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100",
  );

  const activeBar = isActive && depth === 0 && (
    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-primary pointer-events-none group-data-[collapsible=icon]:hidden" />
  );

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
          onClick={() =>
            !item.isLocked && !isCollapsed && toggleGroup(item.key)
          }
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
                "truncate leading-none tracking-[-0.01em] transition-colors duration-150 group-data-[collapsible=icon]:hidden",
                depth > 0 ? "text-[11px]" : "text-[12px]",
                isActive && !item.isLocked
                  ? "font-medium text-foreground"
                  : "font-normal text-inherit",
              )}
            >
              {item.label}
            </span>
          </span>
          {!item.isLocked && item.badge && (
            <Badge
              variant="secondary"
              className="ml-auto mr-1 text-[10px] leading-none h-5 px-2 bg-indigo-50 hover:bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/20 dark:text-indigo-400 border-none rounded-md font-medium shrink-0 group-data-[collapsible=icon]:hidden"
            >
              {item.badge}
            </Badge>
          )}
          {item.isLocked ? (
            <Lock
              size={12}
              className="shrink-0 text-muted-foreground/40 group-data-[collapsible=icon]:hidden"
            />
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
          <span className="text-[12px] leading-none tracking-[-0.01em] font-normal truncate group-data-[collapsible=icon]:hidden">
            {item.label}
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

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
            item.isLocked && "pointer-events-none",
          )}
        >
          {activeBar}
          {iconEl}
          <span
            className={cn(
              "leading-none tracking-[-0.01em] transition-colors duration-150 truncate group-data-[collapsible=icon]:hidden",
              depth > 0 ? "text-[11px]" : "text-[12px]",
              isActive && !item.isLocked
                ? "text-foreground font-medium"
                : "text-inherit font-normal",
            )}
          >
            {item.label}
          </span>
          {item.isLocked && (
            <Lock
              size={12}
              className="ml-auto text-muted-foreground/50 shrink-0 group-data-[collapsible=icon]:hidden"
            />
          )}
          {!item.isLocked && item.badge && (
            <Badge
              variant="secondary"
              className="ml-auto text-[10px] leading-none h-5 px-2 bg-indigo-50 hover:bg-indigo-50 text-indigo-600 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/20 dark:text-indigo-400 border-none rounded-md font-medium shrink-0 group-data-[collapsible=icon]:hidden"
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
export function CollapsibleSection({
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
  const collapsedSections = useSidebarSectionStore((s) => s.collapsedSections);
  const isOpen = !collapsedSections.includes(sectionKey);

  if (items.length === 0) return null;

  return (
    <SidebarGroup className={cn("p-0", className)}>
      <SectionLabel sectionKey={sectionKey}>{label}</SectionLabel>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
          "group-data-[collapsible=icon]:max-h-[2000px] group-data-[collapsible=icon]:opacity-100 group-data-[collapsible=icon]:pointer-events-auto",
        )}
      >
        <SidebarGroupContent>{renderItems(items)}</SidebarGroupContent>
      </div>
    </SidebarGroup>
  );
}
