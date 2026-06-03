"use client";
import React, { useState, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Blocks,
  Earth,
  FileStack,
  HandCoins,
  Headset,
  Fingerprint,
  Languages,
  ListTodo,
  Lock,
  PaintBucket,
  Search,
  UserCheck,
  Terminal,
  ChevronRight,
  X,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/store";
import { cn } from "@/lib/utils";

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
  { key: "/settings", icon: Fingerprint, label: "General Workspace" },
  { key: "/settings/appearance", icon: PaintBucket, label: "Appearance" },
  { key: "/settings/domains", icon: Earth, label: "Domains" },

  { key: "/settings/subscription", icon: ArrowUpRight, label: "Subscription" },
  { key: "/settings/modules", icon: ListTodo, label: "Modules" },
  { key: "/settings/users", icon: UserCheck, label: "Users & Permissions" },
  { key: "/settings/taxes", icon: HandCoins, label: "Taxes & Duties" },
  { key: "/settings/languages", icon: Languages, label: "Languages" },
  { key: "/settings/privacy", icon: Lock, label: "Customer Privacy" },
  { key: "/settings/policies", icon: FileStack, label: "Policies" },
  { key: "/settings/contact", icon: Headset, label: "Contact Support" },
  { key: "/settings/integrations", icon: Blocks, label: "Integrations" },
  {
    key: "/settings/mcp",
    icon: Terminal,
    label: "Model Context Protocol (MCP)",
  },
];

/** Semantic section grouping */
const buildSections = (items: MenuItem[]): MenuSection[] => {
  const find = (key: string) => items.find((i) => i.key === key);

  const sections: MenuSection[] = [];

  // Account
  const accountItems = [find("/settings/profile"), find("/settings")].filter(
    Boolean,
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
    find("/settings/mcp"),
  ].filter(Boolean) as MenuItem[];
  if (platformItems.length)
    sections.push({ title: "Platform", items: platformItems });

  // Commerce
  const commerceItems = [
    find("/settings/subscription"),
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
  const teamItems = [find("/settings/users")].filter(Boolean) as MenuItem[];
  if (teamItems.length) sections.push({ title: "Team", items: teamItems });

  // Support
  const supportItems = [find("/settings/contact")].filter(
    Boolean,
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
    <div className="mb-1 mt-4 first:mt-1">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-3 py-0.5 rounded hover:bg-accent/40 transition-colors duration-150 cursor-pointer select-none bg-transparent border-none"
        aria-expanded={open}
      >
        <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground/40 leading-none">
          {section.title}
        </span>
        <ChevronRight
          size={10}
          className={cn(
            "text-muted-foreground/25 transition-transform duration-200",
            open && "rotate-90",
          )}
        />
      </button>

      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          open
            ? "max-h-[600px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none",
        )}
      >
        <ul className="list-none m-0 py-0.5 flex flex-col gap-0">
          {section.items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => onNavigate(item.key)}
                  className={cn(
                    "group relative flex items-center w-full transition-colors duration-150 cursor-pointer select-none h-9 px-3 rounded-lg gap-2.5 my-px bg-transparent border-none text-left",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r bg-primary pointer-events-none" />
                  )}

                  <Icon
                    size={16}
                    className={cn(
                      "shrink-0 transition-colors duration-150",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground/50 group-hover:text-muted-foreground",
                    )}
                  />

                  <span
                    className={cn(
                      "text-[13px] leading-none tracking-[-0.01em] transition-colors duration-150 truncate",
                      isActive
                        ? "text-foreground font-medium"
                        : "text-inherit font-normal",
                    )}
                  >
                    {item.label}
                  </span>
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

  // Helper to check permissions synchronously
  const hasModulePermission = (
    moduleName: string,
    action: string = "canRead",
  ) => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    if (user.permissions && moduleName in user.permissions) {
      return !!user.permissions[moduleName as keyof typeof user.permissions];
    }
    const modulePermission = user.modulePermissions?.find(
      (m) => m.module.toUpperCase() === moduleName.toUpperCase(),
    );
    // @ts-ignore
    return !!modulePermission?.[action];
  };

  const filteredMenuItems = useMemo(() => {
    if (isSuperAdmin || isSystemRole) return allMenuItems;
    return allMenuItems.filter((item) => {
      if (item.key === "/settings/profile") return true;
      if (item.key === "/settings")
        return hasModulePermission("GENERAL_SETTINGS");
      if (item.key === "/settings/appearance")
        return hasModulePermission("APPEARANCE");
      if (item.key === "/settings/domains")
        return hasModulePermission("DOMAIN");
      if (item.key === "/settings/moderation")
        return hasModulePermission("MODERATION");
      if (item.key === "/settings/subscription")
        return hasModulePermission("SUBSCRIPTION");
      if (item.key === "/settings/modules")
        return hasModulePermission("PLATFORM_FEATURES");
      if (item.key === "/settings/billing")
        return hasModulePermission("BILLING");
      if (item.key === "/settings/users")
        return hasModulePermission("USERS_AND_PERMISSIONS");
      if (item.key === "/settings/taxes")
        return hasModulePermission("TAXES_AND_DUTIES");
      if (item.key === "/settings/languages")
        return hasModulePermission("LANGUAGES");
      if (item.key === "/settings/privacy")
        return hasModulePermission("CUSTOMER_PRIVACY");
      if (item.key === "/settings/policies")
        return hasModulePermission("POLICIES");
      if (item.key === "/settings/contact")
        return hasModulePermission("CONTACT_SUPPORT");
      if (item.key === "/settings/integrations")
        return hasModulePermission("INTEGRATIONS");
      if (item.key === "/settings/mcp")
        return hasModulePermission("PLATFORM_FEATURES");
      return true;
    });
  }, [user, isSuperAdmin, isSystemRole]);

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
      <aside
        className="flex flex-col bg-sidebar border-r border-border h-full overflow-hidden transition-[width] duration-150 ease-in-out"
        style={{ width: "248px", minWidth: "248px" }}
      >
        {/* Header */}
        <div className="px-2 pt-4 pb-2 shrink-0">
          <div className="flex items-center gap-2.5 mb-3.5 px-2">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/50 text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200 shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex flex-col min-w-0">
              <h2 className="text-[14px] font-semibold text-foreground tracking-tight leading-tight">
                Settings
              </h2>
              <p className="text-[11px] text-muted-foreground mt-px tracking-wide">
                Workspace config
              </p>
            </div>
          </div>
          {/* Search */}
          <div className="relative px-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 pointer-events-none" />
            <input
              type="text"
              placeholder="Search settings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8 bg-accent/50 border border-border/50 pl-8 pr-7 text-[12.5px] rounded-md focus-visible:ring-1 focus-visible:ring-primary/30 focus-visible:outline-none placeholder:text-muted-foreground/40 text-foreground transition-colors duration-200"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors bg-transparent border-none cursor-pointer p-0 flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 [scrollbar-width:thin]">
          {sections.length === 0 && search.trim() && (
            <div className="py-8 text-center">
              <p className="text-[11.5px] text-muted-foreground/50">
                No results found
              </p>
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
      </aside>

      {/* ---- Content ---- */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 min-w-0 bg-background">
        {children}
      </main>
    </div>
  );
}

export default SettingsLayout;
