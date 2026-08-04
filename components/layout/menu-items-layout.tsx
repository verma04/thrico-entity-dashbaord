"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, AlertTriangle, X, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/store";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
  locked?: boolean;
};

type MenuItemsLayoutProps = {
  children: React.ReactNode;
  items?: MenuItem[];
  active?: string;
  hideDefaultTabs?: boolean;
  showAdminTabs?: boolean;
  hideTabs?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fixed?: boolean;
  className?: string;
};

/* ─── Single Tab Button ─────────────────────────────────────────────────── */
function TabButton({
  item,
  isActive,
  onClick,
  fullWidth,
}: {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
  fullWidth?: boolean;
}) {
  return (
    <button
      onClick={item.locked ? undefined : onClick}
      className={cn(
        "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 whitespace-nowrap",
        item.locked
          ? "cursor-not-allowed opacity-50 text-muted-foreground bg-transparent"
          : isActive
            ? "text-primary bg-primary/5"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30",
        fullWidth && "w-full justify-center",
      )}
    >
      {/* Animated pill background */}
      {isActive && !item.locked && (
        <motion.span
          layoutId="menu-tab-pill"
          className="absolute inset-0 rounded-lg border border-primary/10 shadow-sm"
          transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "relative z-9 shrink-0 transition-all duration-200",
          item.locked
            ? "text-muted-foreground/60"
            : isActive
              ? "text-primary"
              : "text-muted-foreground group-hover/tab:text-foreground",
        )}
      >
        {React.isValidElement(item.icon)
          ? React.cloneElement(
              item.icon as React.ReactElement<{ className?: string }>,
              { className: "h-3.5 w-3.5" },
            )
          : item.icon}
      </span>

      {/* Label */}
      <span
        className={cn(
          "relative z-9 leading-none tracking-tight transition-all flex items-center gap-1",
          isActive && !item.locked ? "font-bold" : "font-medium",
        )}
      >
        {item.label}
        {item.locked && (
          <Lock className="h-3 w-3 ml-0.5 text-muted-foreground/50" />
        )}
      </span>
    </button>
  );
}

function MenuTabs({
  fullWidth,
  fixed,
  sections,
  sortedSectionNames,
  activeTab,
  fullKey,
  onChange,
  onClose,
}: {
  fullWidth: boolean;
  fixed: boolean;
  sections: Record<string, MenuItem[]>;
  sortedSectionNames: string[];
  activeTab: string;
  fullKey: string;
  onChange: (key: string) => void;
  onClose: () => void;
}) {
  return (
    <nav className="sticky top-0 z-10 bg-white backdrop-blur-xl   border-b border-border/50">
      <div className={cn("px-6 relative", !fullWidth && "max-w-7xl mx-auto")}>
        <div className="flex h-14 items-center gap-1 overflow-x-auto no-scrollbar">
          {sortedSectionNames.map((sectionName, sIdx) => (
            <React.Fragment key={sectionName}>
              {sIdx > 0 && (
                <div className="mx-4 h-4 w-px bg-border/50 shrink-0" />
              )}

              <div
                className={cn(
                  "flex items-center gap-0.5",
                  fullWidth && "flex-1",
                )}
              >
                {sections[sectionName].map((item) => (
                  <TabButton
                    key={item.key}
                    item={item}
                    isActive={
                      activeTab === item.key ||
                      fullKey.startsWith(item.key + "/")
                    }
                    onClick={() => onChange(item.key)}
                    fullWidth={fullWidth}
                  />
                ))}
              </div>
            </React.Fragment>
          ))}

          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-background to-transparent z-10" />
        </div>

        {fixed && (
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all z-12"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </nav>
  );
}

function MenuPage({
  children,
  fullWidth,
  fullHeight,
}: {
  children: React.ReactNode;
  fullWidth: boolean;
  fullHeight: boolean;
}) {
  return (
    <main
      className={cn(
        "flex-1 min-w-0 min-h-0 flex flex-col w-full",
        !fullWidth && "max-w-7xl mx-auto ",
        !fullHeight && "",
      )}
    >
      <div
        className={cn("flex-1 w-full", fullHeight && "h-full overflow-y-auto")}
      >
        {children}
      </div>
    </main>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
const MenuItemsLayout = ({
  children,
  items = [],
  active = "",
  hideDefaultTabs = false,
  showAdminTabs = true,
  hideTabs = false,
  fullWidth = false,
  fullHeight = false,
  fixed = false,
  className,
}: MenuItemsLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserStore((state) => state.user);

  const hasSettingsPerm = React.useMemo(() => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    return !!user.permissions?.settings;
  }, [user]);

  const hasReportsPerm = React.useMemo(() => {
    if (!user) return false;
    if (user.isSuperAdmin || user.role?.isSystem) return true;
    return !!user.permissions?.reports;
  }, [user]);
  const pathParts = pathname.split("/").filter(Boolean);
  const activeSegments = active.split("/").filter(Boolean);
  const activeIndex = pathname.startsWith(`/${active}`)
    ? activeSegments.length - 1
    : pathParts.indexOf(active);
  const fullKey = pathParts.slice(activeIndex + 1).join("/");

  const activeTab = React.useMemo(() => {
    if (activeIndex === -1 || activeIndex === pathParts.length - 1) {
      if (hideDefaultTabs) {
        const defaultRootItem = items.find(
          (i) => i.key === "dashboard" || i.key === "",
        );
        if (defaultRootItem) return defaultRootItem.key;
      }
      return "dashboard";
    }

    if (items.some((i) => i.key === fullKey)) return fullKey;
    return pathParts[activeIndex + 1];
  }, [activeIndex, pathParts, hideDefaultTabs, items, fullKey]);

  const defaultTabs: MenuItem[] = hideDefaultTabs
    ? []
    : [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard />,
          section: "System",
        },
        ...items,
        ...(showAdminTabs
          ? [
              {
                key: "reports",
                label: "Reported Items",
                icon: <AlertTriangle />,
                section: "Admin",
                locked: !hasReportsPerm,
              },
              {
                key: "settings",
                label: "Settings",
                icon: <Wrench />,
                section: "Admin",
                locked: !hasSettingsPerm,
              },
            ]
          : []),
      ];

  const menuitems: MenuItem[] = hideDefaultTabs ? items : defaultTabs;

  // Group by section
  const sections = menuitems.reduce(
    (acc, item) => {
      const section = item.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>,
  );

  const sectionOrder = [
    "System",
    "Vouchers",
    "General",
    "Engagement",
    "Modules",
    "Management",
    "Admin",
  ];
  const sortedSectionNames = Object.keys(sections).sort((a, b) => {
    const ia = sectionOrder.indexOf(a);
    const ib = sectionOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  const onChange = (key: string) => {
    if (key === "dashboard" || key === "") router.push(`/${active}`);
    else router.push(`/${active}/${key}`);
  };

  return (
    <div
      className={cn(
        "bg-background border-t-1 text-foreground flex flex-col w-full mt-2  bg-[#f9f9f9] dark:border-neutral-800",
        fixed
          ? "fixed inset-0 z-20 bg-background h-screen w-screen overflow-hidden"
          : fullHeight
            ? "h-screen overflow-hidden"
            : "min-h-screen",
        className,
      )}
    >
      {!hideTabs && (
        <MenuTabs
          fullWidth={fullWidth}
          fixed={fixed}
          sections={sections}
          sortedSectionNames={sortedSectionNames}
          activeTab={activeTab}
          fullKey={fullKey}
          onChange={onChange}
          onClose={() => router.back()}
        />
      )}

      <MenuPage fullWidth={fullWidth} fullHeight={fullHeight}>
        {children}
      </MenuPage>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuItemsLayout;
