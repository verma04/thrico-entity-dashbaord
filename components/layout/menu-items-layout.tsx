"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Wrench, AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        "group/tab relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/20 whitespace-nowrap",
        isActive
          ? "text-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
      )}
    >
      {/* Animated pill background */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="tab-pill"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 rounded-xl bg-primary/5 border border-primary/10 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.05)]"
            transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      {/* Icon */}
      <span
        className={cn(
          "relative z-10 shrink-0 transition-transform duration-200",
          isActive ? "text-primary scale-110" : "text-muted-foreground/60 group-hover/tab:text-foreground/70",
        )}
      >
        {React.isValidElement(item.icon)
          ? React.cloneElement(
              item.icon as React.ReactElement<{ className?: string }>,
              {
                className: cn("h-4 w-4", (item.icon as any).props?.className),
              },
            )
          : item.icon}
      </span>

      {/* Label */}
      <span className="relative z-10 leading-none tracking-tight">
        {item.label}
      </span>

      {/* Active Dot indicator */}
      {isActive && (
        <motion.span 
          layoutId="active-dot"
          className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" 
        />
      )}
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
}: {
  children: React.ReactNode;
  items: MenuItem[];
  active: string;
  hideDefaultTabs?: boolean;
  showAdminTabs?: boolean;
  fullWidth?: boolean;
  fullHeight?: boolean;
  fixed?: boolean;
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
                label: "Reports",
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

  const onChange = (key: string) => {
    if (key === "dashboard" || key === "") router.push(`/${active}`);
    else router.push(`/${active}/${key}`);
  };

  return (
    <div className={cn(
      "bg-background text-foreground flex flex-col",
      fixed ? "fixed inset-0 z-100 bg-background h-screen w-screen overflow-hidden" : (fullHeight ? "h-screen overflow-hidden" : "min-h-screen")
    )}>
      {/* ── Top Nav Bar ─────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className={cn("px-6", fullWidth ? "w-full" : "max-w-[1400px] mx-auto")}>
          <div className="flex h-12 items-center gap-1 overflow-x-auto scrollbar-hide relative no-scrollbar">
            {menuitems.map((item) => (
              <TabButton
                key={item.key}
                item={item}
                isActive={
                  activeTab === item.key ||
                  fullKey.startsWith(item.key + "/")
                }
                onClick={() => onChange(item.key)}
              />
            ))}
          </div>
        </div>

        {/* Close Button for Fixed Mode */}
        {fixed && (
          <button
            onClick={() => router.push("/")}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all z-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </nav>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <main className={cn(
        "flex-1 min-w-0 min-h-0 transition-opacity duration-300 flex flex-col",
        fullWidth ? "w-full" : "max-w-[1400px] mx-auto px-6",
        !fullHeight && "py-4 lg:py-6"
      )}>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "flex-1",
            fullHeight && "h-full overflow-y-auto"
          )}
        >
          {children}
        </motion.div>
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default MenuItemsLayout;
