"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, AlertTriangle } from "lucide-react";
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
}: {
  item: MenuItem;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group/tab relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-colors duration-150 outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/50 whitespace-nowrap",
        isActive
          ? "text-indigo-700"
          : "text-zinc-500 hover:text-zinc-800 hover:bg-zinc-100/70"
      )}
    >
      {/* Animated pill background */}
      {isActive && (
        <motion.span
          layoutId="tab-pill"
          className="absolute inset-0 rounded-lg bg-indigo-50 border border-indigo-100/80 shadow-[0_1px_3px_0_oklch(0.55_0.24_264/0.08)]"
          transition={{ type: "spring", bounce: 0.18, duration: 0.38 }}
        />
      )}

      {/* Icon */}
      <span
        className={cn(
          "relative z-10 shrink-0 transition-all duration-200",
          isActive ? "text-indigo-600" : "text-zinc-400 group-hover/tab:text-zinc-600"
        )}
      >
        {React.isValidElement(item.icon)
          ? React.cloneElement(item.icon as React.ReactElement<{ className?: string }>, {
              className: "h-3.5 w-3.5",
            })
          : item.icon}
      </span>

      {/* Label */}
      <span className="relative z-10 leading-none">{item.label}</span>
    </button>
  );
}

/* ─── Section Divider ───────────────────────────────────────────────────── */
function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 shrink-0">
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.14em",
          fontWeight: 700,
          textTransform: "uppercase",
          color: "oklch(0.556 0 0 / 35%)",
        }}
      >
        {label}
      </span>
      <div className="h-px w-4 bg-zinc-200/60 shrink-0" />
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────────────────── */
const MenuItemsLayout = ({
  children,
  items,
  active,
  hideDefaultTabs = false,
  showAdminTabs = true,
}: {
  children: React.ReactNode;
  items: MenuItem[];
  active: string;
  hideDefaultTabs?: boolean;
  showAdminTabs?: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const pathParts = pathname.split("/").filter(Boolean);
  const activeIndex = pathParts.indexOf(active);
  const fullKey = pathParts.slice(activeIndex + 1).join("/");

  const activeTab = React.useMemo(() => {
    if (activeIndex === -1 || activeIndex === pathParts.length - 1) {
      if (hideDefaultTabs) {
        const defaultRootItem = items.find(
          (i) => i.key === "dashboard" || i.key === ""
        );
        if (defaultRootItem) return defaultRootItem.key;
      }
      return "dashboard";
    }

    // Exact match first
    if (items.some((i) => i.key === fullKey)) return fullKey;

    // Fallback to the first segment if no exact match (classic behavior)
    return pathParts[activeIndex + 1];
  }, [activeIndex, pathParts, hideDefaultTabs, items, fullKey]);

  const defaultTabs: MenuItem[] = hideDefaultTabs
    ? []
    : [
        {
          key: "dashboard",
          label: "Dashboard",
          icon: <LayoutDashboard className="h-3.5 w-3.5" />,
          section: "System",
        },
        ...items,
        ...(showAdminTabs ? [
          {
            key: "reports",
            label: "Reports",
            icon: <AlertTriangle className="h-3.5 w-3.5" />,
            section: "Admin",
          },
          {
            key: "settings",
            label: "Settings",
            icon: <Wrench className="h-3.5 w-3.5" />,
            section: "Admin",
          },
        ] : []),
      ];

  const menuitems: MenuItem[] = hideDefaultTabs ? items : defaultTabs;

  const onChange = (key: string) => {
    if (key === "dashboard" || key === "") router.push(`/${active}`);
    else router.push(`/${active}/${key}`);
  };

  // Group by section
  const sections = menuitems.reduce(
    (acc, item) => {
      const section = item.section || "General";
      if (!acc[section]) acc[section] = [];
      acc[section].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const sectionOrder = ["System", "Vouchers", "Engagement", "Admin", "General"];
  const sortedSectionNames = Object.keys(sections).sort((a, b) => {
    const ia = sectionOrder.indexOf(a);
    const ib = sectionOrder.indexOf(b);
    if (ia !== -1 && ib !== -1) return ia - ib;
    if (ia !== -1) return -1;
    if (ib !== -1) return 1;
    return a.localeCompare(b);
  });

  // Check if only one section (skip section labels for cleaner look)
  const showSectionLabels = sortedSectionNames.length > 1;

  return (
    <div className="min-h-screen bg-[#FAFBFC] text-foreground">
      {/* ── Top Nav Bar ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-zinc-100">
        <div className="px-6">
          <div className="flex h-12 items-center gap-0 overflow-x-auto scrollbar-hide">
            {sortedSectionNames.map((sectionName, sIdx) => (
              <React.Fragment key={sectionName}>
                {/* Separator between sections */}
                {showSectionLabels && sIdx > 0 && (
                  <div className="mx-3 h-4 w-px bg-zinc-200/70 shrink-0" />
                )}

                {/* Section label pill — only when multiple sections */}
                {showSectionLabels && (
                  <SectionDivider label={sectionName} />
                )}

                {/* Tab buttons for this section */}
                <div className="flex items-center gap-0.5 ml-1">
                  {sections[sectionName].map((item) => (
                    <TabButton
                      key={item.key}
                      item={item}
                      isActive={activeTab === item.key || fullKey.startsWith(item.key + "/")}
                      onClick={() => onChange(item.key)}
                    />
                  ))}
                </div>
              </React.Fragment>
            ))}

            {/* Right fade mask */}
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-white/90 to-transparent z-10" />
          </div>
        </div>

        {/* Bottom active indicator line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-zinc-100" />
      </nav>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className="px-6 py-6 max-w-[1400px] mx-auto">
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out"
        >
          {children}
        </div>
      </main>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuItemsLayout;
