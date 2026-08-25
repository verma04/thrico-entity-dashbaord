"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Wrench,
  AlertTriangle,
  X,
  Lock,
  GripVertical,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
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
  enableReorder?: boolean;
  onReorder?: (newOrder: string[]) => void;
};

/* ─── Single Tab Button ─────────────────────────────────────────────────── */
function TabButton({
  item,
  isActive,
  href,
  fullWidth,
  layoutId = "menu-tab-underline",
}: {
  item: MenuItem;
  isActive: boolean;
  href: string;
  fullWidth?: boolean;
  layoutId?: string;
}) {
  const content = (
    <>
      {item.label}
      {item.locked && <Lock className="h-3 w-3 text-muted-foreground/50" />}

      {/* Active underline indicator */}
      {isActive && !item.locked && (
        <motion.div
          layoutId={layoutId}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white"
          transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
        />
      )}
    </>
  );

  const className = cn(
    "relative px-4 py-3  text-[12px] font-medium transition-colors duration-150 outline-none whitespace-nowrap flex items-center gap-1.5",
    item.locked
      ? "cursor-not-allowed opacity-40 text-muted-foreground"
      : isActive
        ? "text-foreground"
        : "text-muted-foreground hover:text-foreground",
    fullWidth && "flex-1 justify-center",
  );

  if (item.locked) {
    return (
      <button className={className} disabled>
        {content}
      </button>
    );
  }

  return (
    <Link href={href} className={className} draggable={false}>
      {content}
    </Link>
  );
}

function MenuTabs({
  fullWidth,
  fixed,
  sections,
  sortedSectionNames,
  activeTab,
  fullKey,
  activeBase,
  onClose,
  enableReorder,
  onReorder,
}: {
  fullWidth: boolean;
  fixed: boolean;
  sections: Record<string, MenuItem[]>;
  sortedSectionNames: string[];
  activeTab: string;
  fullKey: string;
  activeBase: string;
  onClose: () => void;
  enableReorder?: boolean;
  onReorder?: (newOrder: string[]) => void;
}) {
  React.useEffect(() => {
    if (
      typeof window !== "undefined" &&
      process.env.NODE_ENV === "development"
    ) {
      const originalWarn = console.warn;
      console.warn = (...args: any[]) => {
        if (
          typeof args[0] === "string" &&
          args[0].includes("unsupported nested scroll container detected")
        ) {
          return;
        }
        originalWarn(...args);
      };
      return () => {
        console.warn = originalWarn;
      };
    }
  }, []);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination || !onReorder) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    // Flatten the items to reorder
    const allItems = sortedSectionNames.flatMap((section) => sections[section]);
    const itemsCopy = [...allItems];
    const [reorderedItem] = itemsCopy.splice(source.index, 1);
    itemsCopy.splice(destination.index, 0, reorderedItem);
    onReorder(itemsCopy.map((i) => i.key));
  };

  const renderTabs = () => {
    let globalIndex = 0;
    return sortedSectionNames.map((sectionName) => (
      <React.Fragment key={sectionName}>
        {sections[sectionName].map((item, idx) => {
          if (!item) return null;
          const currentIndex = globalIndex++;
          const dragId = String(
            item.key || `tab-${sectionName}-${idx}-${currentIndex}`,
          );
          const href =
            item.key === "dashboard" || item.key === ""
              ? `/${activeBase}`
              : `/${activeBase}/${item.key}`;

          const tabButton = (
            <TabButton
              key={dragId}
              item={item}
              isActive={
                activeTab === item.key ||
                (!!item.key &&
                  (fullKey === item.key || fullKey.startsWith(item.key + "/")))
              }
              href={href}
              fullWidth={fullWidth}
              layoutId={`menu-tab-underline-${activeBase.replace(/\//g, "-")}`}
            />
          );

          if (enableReorder) {
            return (
              <Draggable key={dragId} draggableId={dragId} index={currentIndex}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {tabButton}
                  </div>
                )}
              </Draggable>
            );
          }

          return tabButton;
        })}
      </React.Fragment>
    ));
  };

  return (
    <nav className="sticky top-0 z-30 bg-white dark:bg-background mx-1 border-b border-border">
      <div className={cn("px-6 relative", !fullWidth && "max-w-7xl mx-auto")}>
        {enableReorder ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="menu-tabs" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="flex items-center gap-0 overflow-x-auto no-scrollbar"
                >
                  {renderTabs()}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="flex items-center gap-0 overflow-x-auto no-scrollbar">
            {renderTabs()}
          </div>
        )}

        {fixed && (
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-all z-50"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
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
  enableReorder = false,
  onReorder,
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
    const parentMatch = items.find(
      (i) => i.key && (fullKey.startsWith(i.key + "/") || fullKey === i.key),
    );
    if (parentMatch) return parentMatch.key;
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
  const sections = enableReorder
    ? { All: menuitems }
    : menuitems.reduce(
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

  const sortedSectionNames = enableReorder
    ? ["All"]
    : Object.keys(sections).sort((a, b) => {
        const ia = sectionOrder.indexOf(a);
        const ib = sectionOrder.indexOf(b);
        if (ia !== -1 && ib !== -1) return ia - ib;
        if (ia !== -1) return -1;
        if (ib !== -1) return 1;
        return a.localeCompare(b);
      });

  return (
    <div
      className={cn(
        "bg-background text-foreground flex flex-col w-full sm:w-[90%] md:w-[95%] lg:w-full flex-1 min-h-full",
        fixed
          ? "fixed inset-0 z-50 bg-background h-screen w-screen overflow-hidden"
          : fullHeight
            ? "h-full overflow-hidden"
            : "min-h-full",
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
          activeBase={active}
          onClose={() => router.back()}
          enableReorder={enableReorder}
          onReorder={onReorder}
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
