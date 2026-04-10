"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type MenuItem = {
  key: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
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
      onClick={onClick}
      className={cn(
        "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 whitespace-nowrap",
        isActive
          ? "text-indigo-700"
          : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/70",
        fullWidth && "w-full justify-center",
      )}
    >
      {/* Animated pill background */}
      {isActive && (
        <motion.span
          layoutId="menu-tab-pill"
          className="absolute inset-0 rounded-lg bg-indigo-50 border border-indigo-100/80 shadow-[0_1px_3px_0_oklch(0.55_0.24_264/0.08)]"
          transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "relative z-10 shrink-0 transition-all duration-200",
          isActive
            ? "text-indigo-600"
            : "text-zinc-400 group-hover/tab:text-zinc-600",
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
      <span className="relative z-10 leading-none">{item.label}</span>
    </button>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
const MenuItemsLayout = ({
  children,
  items,
  active,
  hideDefaultTabs = false,
  showAdminTabs = true,
  fullWidth = false,
  fullHeight = false,
  fixed = false,
  className,
}: {
  children: React.ReactNode;
  items: MenuItem[];
  active: string;
  hideDefaultTabs?: boolean;
  showAdminTabs?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fixed?: boolean;
  className?: string;
}) => {
  const router = useRouter();
  const pathname = usePathname();
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
              },
              {
                key: "settings",
                label: "Settings",
                icon: <Wrench />,
                section: "Admin",
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
        "bg-[#FAFBFC] text-foreground flex flex-col w-full",
        fixed
          ? "fixed inset-0 z-100 bg-background h-screen w-screen overflow-hidden"
          : fullHeight
            ? "h-screen overflow-hidden"
            : "min-h-screen",
        className,
      )}
    >
      {/* ── Top Nav Bar ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div
          className={cn(
            "px-6 relative w-full",
            !fullWidth && "max-w-[1400px] mx-auto",
          )}
        >
          <div className="flex h-12 items-center gap-0 overflow-x-auto no-scrollbar">
            {sortedSectionNames.map((sectionName, sIdx) => (
              <React.Fragment key={sectionName}>
                {/* Separator between sections */}
                {sIdx > 0 && (
                  <div className="mx-3 h-4 w-px bg-zinc-200/70 shrink-0" />
                )}

                {/* Tab buttons for this section */}
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

            {/* Right fade mask */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white/90 to-transparent z-10" />
          </div>

          {/* Close Button for Fixed Mode */}
          {fixed && (
            <button
              onClick={() => router.back()}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all z-50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Bottom border line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-100" />
      </nav>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main
        className={cn(
          "flex-1 min-w-0 min-h-0 flex flex-col w-full",
          !fullWidth && "max-w-[1400px] mx-auto px-6",
          !fullHeight && "py-4 lg:py-6",
        )}
      >
        <div
          key={activeTab}
          className={cn(
            "flex-1 w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out",
            fullHeight && "h-full overflow-y-auto",
          )}
        >
          {children}
        </div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuItemsLayout;
