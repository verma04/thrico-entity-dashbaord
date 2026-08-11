import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, List as ListIcon, Users, UserCheck, Clock, Ban, UserX, CheckCircle2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { MembersListCards } from "../dashboard/members-listcards";
import { UserList } from "./user-list";

export const STATUS_TABS = [
  {
    value: "ALL",
    label: "All Statuses",
    icon: Users,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "APPROVED",
    label: "Approved",
    icon: UserCheck,
    dot: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    value: "PENDING",
    label: "Pending",
    icon: Clock,
    dot: "bg-amber-500",
    color: "text-amber-600",
  },
  {
    value: "BLOCKED",
    label: "Blocked",
    icon: Ban,
    dot: "bg-red-500",
    color: "text-red-600",
  },
  {
    value: "REJECTED",
    label: "Rejected",
    icon: UserX,
    dot: "bg-slate-400",
    color: "text-muted-foreground",
  },
  {
    value: "DISABLED",
    label: "Disabled",
    icon: CheckCircle2,
    dot: "bg-orange-500",
    color: "text-orange-600",
  },
] as const;

export type StatusValue = (typeof STATUS_TABS)[number]["value"];

/** View-mode toggle: Grid / List */
export function ViewToggle({
  value,
  onChange,
}: {
  value: "grid" | "list";
  onChange: (v: "grid" | "list") => void;
}) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as "grid" | "list")}
      className="bg-muted p-0.5 rounded-lg border border-border"
    >
      <TabsList className="bg-transparent border-none h-auto p-0 gap-0.5">
        <TabsTrigger
          value="grid"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <LayoutGrid className="h-3.5 w-3.5 mr-1.5" />
          Grid
        </TabsTrigger>
        <TabsTrigger
          value="list"
          className="h-8 px-3 rounded-md data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-foreground text-muted-foreground transition-all text-xs font-medium"
        >
          <ListIcon className="h-3.5 w-3.5 mr-1.5" />
          List
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

/** Status section bar — appears between action bar and content */
export function SectionHeader({
  status,
  count,
  loading,
}: {
  status: StatusValue;
  count: number;
  loading: boolean;
}) {
  const tab = STATUS_TABS.find((t) => t.value === status) ?? STATUS_TABS[0];
  const Icon = tab.icon;

  if (status === "ALL") return null; // no extra header for All

  return (
    <div className="flex items-center gap-3 pb-1">
      <div
        className={cn(
          "flex items-center gap-2 text-sm font-semibold",
          tab.color,
        )}
      >
        {tab.dot && (
          <span
            className={cn(
              "h-2 w-2 rounded-full shrink-0 animate-pulse",
              tab.dot,
            )}
          />
        )}
        <Icon className="h-4 w-4" />
        <span>{tab.label} Members</span>
      </div>
      <div className="h-px flex-1 bg-border" />
      {!loading && (
        <span className="text-[11px] font-medium text-muted-foreground">
          {count} {count === 1 ? "record" : "records"}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Content area (animated)
// ─────────────────────────────────────────────────────────────────────────────

export function ContentArea({
  view,
  loading,
  users,
  visibleColumns,
  offset = 0,
}: {
  view: "grid" | "list";
  loading: boolean;
  users: any[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}) {
  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="space-y-2"
        >
          {/* Inline skeleton matching list rows */}
          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="h-10 border-b border-border bg-muted/30 px-5 flex items-center gap-4">
              {[120, 180, 100, 80, 80, 90].map((w, i) => (
                <Skeleton
                  key={i}
                  className="h-2.5 rounded"
                  style={{ width: w }}
                />
              ))}
            </div>
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-3 border-b border-border/40 last:border-0"
              >
                <Skeleton className="h-9 w-9 rounded-lg shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-2.5 w-20 rounded" />
                </div>
                <Skeleton className="h-3 w-40 rounded hidden sm:block" />
                <Skeleton className="h-3 w-20 rounded hidden md:block" />
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-5 w-16 rounded-md hidden lg:block" />
                <Skeleton className="h-3 w-20 rounded hidden lg:block" />
              </div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          key={view}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          {view === "grid" ? (
            <MembersListCards manualData={users} />
          ) : (
            <UserList users={users} visibleColumns={visibleColumns} offset={offset} />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
