"use client";
import React, { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Blocks,
  ChevronDown,
  Earth,
  FileStack,
  HandCoins,
  Headset,
  Home,
  Languages,
  ListTodo,
  Lock,
  PaintBucket,
  Receipt,
  Search,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface MenuItem {
  key: string;
  icon: React.ElementType;
  label: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

/* ------------------------------------------------------------------ */
/*  Menu data                                                          */
/* ------------------------------------------------------------------ */

const allMenuItems: MenuItem[] = [
  { key: "/settings/profile", icon: UserCheck, label: "Your Profile" },
  { key: "/settings", icon: Home, label: "General" },
  { key: "/settings/appearance", icon: PaintBucket, label: "Appearance" },
  { key: "/settings/domains", icon: Earth, label: "Domains" },
  { key: "/settings/moderation", icon: ShieldCheck, label: "Moderation" },
  { key: "/settings/subscription", icon: ArrowUpRight, label: "Subscription" },
  { key: "/settings/modules", icon: ListTodo, label: "Modules" },
  { key: "/settings/billing", icon: Receipt, label: "Billing" },
  { key: "/settings/users", icon: UserCheck, label: "Users & Permissions" },
  { key: "/settings/taxes", icon: HandCoins, label: "Taxes & Duties" },
  { key: "/settings/languages", icon: Languages, label: "Languages" },
  { key: "/settings/privacy", icon: Lock, label: "Customer Privacy" },
  { key: "/settings/policies", icon: FileStack, label: "Policies" },
  { key: "/settings/contact", icon: Headset, label: "Contact Support" },
  { key: "/settings/integrations", icon: Blocks, label: "Integrations" },
];

/** Semantic section grouping */
const buildSections = (items: MenuItem[]): MenuSection[] => {
  const find = (key: string) => items.find((i) => i.key === key);

  const sections: MenuSection[] = [];

  // Account
  const accountItems = [find("/settings/profile"), find("/settings")].filter(
    Boolean
  ) as MenuItem[];
  if (accountItems.length)
    sections.push({ title: "Account", items: accountItems });

  // Platform
  const platformItems = [
    find("/settings/appearance"),
    find("/settings/domains"),
    find("/settings/moderation"),
    find("/settings/modules"),
    find("/settings/languages"),
    find("/settings/integrations"),
  ].filter(Boolean) as MenuItem[];
  if (platformItems.length)
    sections.push({ title: "Platform", items: platformItems });

  // Commerce
  const commerceItems = [
    find("/settings/subscription"),
    find("/settings/billing"),
    find("/settings/taxes"),
  ].filter(Boolean) as MenuItem[];
  if (commerceItems.length)
    sections.push({ title: "Commerce", items: commerceItems });

  // Legal & Privacy
  const legalItems = [
    find("/settings/privacy"),
    find("/settings/policies"),
  ].filter(Boolean) as MenuItem[];
  if (legalItems.length)
    sections.push({ title: "Legal & Privacy", items: legalItems });

  // Team
  const teamItems = [find("/settings/users")].filter(
    Boolean
  ) as MenuItem[];
  if (teamItems.length)
    sections.push({ title: "Team", items: teamItems });

  // Support
  const supportItems = [find("/settings/contact")].filter(
    Boolean
  ) as MenuItem[];
  if (supportItems.length)
    sections.push({ title: "Support", items: supportItems });

  return sections;
};

/* ------------------------------------------------------------------ */
/*  Collapsible Section                                                */
/* ------------------------------------------------------------------ */

function SectionGroup({
  section,
  pathname,
  onNavigate,
  defaultOpen = true,
}: {
  section: MenuSection;
  pathname: string;
  onNavigate: (path: string) => void;
  defaultOpen?: boolean;
}) {
  const hasActive = section.items.some((i) => i.key === pathname);
  const [open, setOpen] = useState(defaultOpen || hasActive);

  return (
    <div className="mb-0.5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-transparent border-none cursor-pointer text-muted-foreground/60 hover:text-foreground transition-all duration-200"
        aria-expanded={open}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider">
          {section.title}
        </span>
        <ChevronDown
          className={cn(
            "w-3.5 h-3.5 opacity-50 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]",
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="list-none m-0 py-0.5 pb-1.5 flex flex-col gap-px">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    "group relative w-full flex items-center gap-3 py-1.5 px-3 rounded-xl border-none bg-transparent cursor-pointer text-[13px] transition-all duration-200 font-medium tracking-tight",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="settings-pill"
                      className="absolute inset-0 rounded-xl bg-primary/5 border border-primary/10"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
                    />
                  )}
                  
                  <div className={cn(
                    "relative z-10 flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200",
                    isActive ? "bg-primary text-primary-foreground shadow-sm scale-105" : "bg-sidebar-accent/20 text-muted-foreground/50 group-hover:bg-sidebar-accent group-hover:text-foreground"
                  )}>
                    <Icon className="w-[15px] h-[15px]" />
                  </div>
                  
                  <span className="relative z-10 flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis leading-none pt-0.5">
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <motion.span 
                      layoutId="settings-dot"
                      className="w-1 h-1 rounded-full bg-primary shrink-0 relative z-10" 
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Layout                                                             */
/* ------------------------------------------------------------------ */

function SettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const user = useUserStore((state) => state.user);
  const isSuperAdmin = user?.isSuperAdmin;
  const isSystemRole = user?.role?.isSystem;
  const permissions = user?.permissions;

  const filteredMenuItems = useMemo(() => {
    if (isSuperAdmin || isSystemRole) return allMenuItems;
    return allMenuItems.filter((item) => {
      if (item.key === "/settings/profile") return true;
      if (item.key === "/settings") return permissions?.settings;
      if (item.key === "/settings/appearance") return permissions?.appearance;
      if (item.key === "/settings/domains") return permissions?.domain;
      if (item.key === "/settings/moderation") return permissions?.moderation;
      if (item.key === "/settings/subscription")
        return permissions?.subscription;
      if (item.key === "/settings/modules")
        return permissions?.platformFeatures;
      if (item.key === "/settings/billing") return permissions?.subscription;
      if (item.key === "/settings/users") return permissions?.adminUsers;
      if (item.key === "/settings/taxes") return permissions?.settings;
      if (item.key === "/settings/languages") return permissions?.settings;
      if (item.key === "/settings/privacy") return permissions?.settings;
      if (item.key === "/settings/policies") return permissions?.settings;
      if (item.key === "/settings/integrations")
        return permissions?.platformFeatures;
      return true;
    });
  }, [user, isSuperAdmin, isSystemRole, permissions]);

  /* Search filter */
  const visibleItems = useMemo(() => {
    if (!search.trim()) return filteredMenuItems;
    const q = search.toLowerCase();
    return filteredMenuItems.filter((i) => i.label.toLowerCase().includes(q));
  }, [filteredMenuItems, search]);

  const sections = useMemo(() => buildSections(visibleItems), [visibleItems]);

  return (
    <div className="fixed inset-0 flex z-50 bg-background">
      {/* ---- Sidebar ---- */}
      <aside className="w-[280px] min-w-[280px] flex flex-col bg-sidebar border-r border-border h-full overflow-hidden">
        {/* Header */}
        <div className="px-4 pt-5 pb-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2.5 mb-3.5">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:-translate-x-0.5 transition-all duration-200 shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[15px] font-semibold text-foreground tracking-tight leading-tight">
                Settings
              </h2>
              <p className="text-[11.5px] text-muted-foreground mt-px tracking-wide">
                Configure your workspace
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none opacity-60" />
            <input
              type="text"
              placeholder="Search settings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-[34px] rounded-lg border border-border bg-background pl-8 pr-3 text-[12.5px] text-foreground outline-none transition-all duration-200 placeholder:text-muted-foreground/50 focus:border-ring focus:shadow-[0_0_0_2px_rgba(0,0,0,0.04)]"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 [scrollbar-width:thin]">
          {sections.length === 0 && (
            <div className="py-8 px-4 text-center text-[12.5px] text-muted-foreground opacity-70">
              <p>No results found</p>
            </div>
          )}
          {sections.map((section) => (
            <SectionGroup
              key={section.title}
              section={section}
              pathname={pathname}
              onNavigate={(path) => router.push(path)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border shrink-0">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-muted-foreground no-underline py-1.5 px-2 rounded-md transition-all duration-150 font-medium hover:text-foreground hover:bg-accent"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* ---- Content ---- */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0 bg-background">
        {children}
      </main>
    </div>
  );
}

export default SettingsLayout;
