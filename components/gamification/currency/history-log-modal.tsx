"use client";

import React, { useState } from "react";
import { useGetUserActivityLog } from "@/graphql/actions/gamification/gamification-quiries";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Coins, ChevronLeft, ChevronRight, ArrowDownRight, ArrowUpRight, Award, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import moment from "moment";
import { motion } from "framer-motion";

type FilterType = "all" | "earned" | "spent";

export function HistoryLogModal({
  userId,
  userName,
  isOpen,
  onClose,
}: {
  userId: string | null;
  userName: string;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<FilterType>("all");
  
  const limit = 20;
  const offset = (page - 1) * limit;

  const { data, loading } = useGetUserActivityLog(userId || "", limit, offset, filter);

  React.useEffect(() => {
    if (isOpen) {
      setPage(1);
      setFilter("all");
    }
  }, [isOpen, userId]);

  const filteredLogs = data?.getUserActivityLog || [];
  const hasMore = filteredLogs.length === limit;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-lg w-[90vw] overflow-y-auto p-0 flex flex-col h-full bg-background border-l border-border/50">
        
        {/* Header Section */}
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-5">
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center gap-2.5 mb-1">
              <div className="p-2 bg-primary/10 text-primary rounded-xl">
                <History className="h-5 w-5" />
              </div>
              <SheetTitle className="text-xl font-bold tracking-tight">
                History Log
              </SheetTitle>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Activity for <span className="text-foreground">{userName}</span>
            </p>
          </SheetHeader>

          {/* Filter Tabs */}
          <div className="mt-4 flex items-center border-b border-border/50">
            {[
              { id: "all", label: "All" },
              { id: "earned", label: "Earned (+)" },
              { id: "spent", label: "Spent (-)" },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as FilterType)}
                  className={cn(
                    "relative px-4 py-3 text-sm font-medium transition-colors outline-none whitespace-nowrap",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tab.label}
                  {isActive && (
                    <motion.div
                      layoutId="history-tab-underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-foreground dark:bg-white"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {loading ? (
            <div className="relative pl-1">
              <div className="absolute left-[17px] top-4 bottom-4 w-px bg-muted/60" />
              <div className="space-y-3 relative z-10">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex gap-3 items-start animate-pulse">
                    <div className="w-9 h-9 rounded-xl shrink-0 border-2 border-background shadow-sm bg-muted" />
                    <div className="flex-1 min-w-0">
                      <div className="bg-muted/10 border border-border/40 py-2.5 px-3.5 rounded-xl">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1 space-y-2 mt-0.5">
                            <div className="h-3.5 bg-muted rounded w-2/3" />
                            <div className="h-2.5 bg-muted/60 rounded w-1/3" />
                          </div>
                          <div className="w-16 h-6 bg-muted rounded-md shrink-0 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4">
              <div className="p-4 bg-muted/30 rounded-full">
                <History className="h-8 w-8 text-muted-foreground/50" />
              </div>
              <div>
                <p className="text-base font-semibold text-foreground">No records found</p>
                <p className="text-sm text-muted-foreground mt-1 max-w-[250px] mx-auto">
                  There are no {filter !== "all" ? filter : ""} history logs matching your criteria.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative pl-1">
              {/* Timeline line */}
              <div className="absolute left-[17px] top-4 bottom-4 w-px bg-border/40" />

              <div className="space-y-3 relative z-10">
                {filteredLogs.map((log: any) => {
                  const isPoints = log.type === "POINTS";
                  const isNegativeAction = isPoints && (
                    log.points < 0 || 
                    (log.ruleAction && (
                      log.ruleAction.toLowerCase().includes("spend") || 
                      log.ruleAction.toLowerCase().includes("spent") || 
                      log.ruleAction.toLowerCase().includes("redeem") || 
                      log.ruleAction.toLowerCase().includes("deduct")
                    ))
                  );
                  const isPositive = isPoints ? !isNegativeAction : true;
                  const isBadge = log.type === "BADGE";

                  return (
                    <div key={log.id} className="group flex gap-3 items-start relative">
                      
                      {/* Timeline Icon */}
                      <div className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 border-background shadow-sm transition-transform group-hover:scale-105",
                        isBadge ? "bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400" :
                        isPositive ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400" :
                        "bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"
                      )}>
                        {isBadge ? (
                          <Award className="h-4 w-4" />
                        ) : isPositive ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : (
                          <ArrowDownRight className="h-4 w-4" />
                        )}
                      </div>

                      {/* Content Card */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-muted/10 hover:bg-muted/30 transition-colors border border-border/40 py-2.5 px-3.5 rounded-xl">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] font-bold text-foreground leading-snug truncate">
                                {isPoints ? log.ruleAction || (isPositive ? "Earned Points" : "Spent Points") : log.badgeName || "Earned Badge"}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5 font-medium truncate">
                                {log.createdAt ? moment(!isNaN(Number(log.createdAt)) ? Number(log.createdAt) : log.createdAt).format("MMM D, YYYY • h:mm A") : "Unknown Date"}
                              </p>
                            </div>

                            {/* Value Chip */}
                            <div className={cn(
                              "flex items-center gap-1 px-2 py-1 rounded-md font-bold text-xs shrink-0 shadow-sm",
                              isBadge ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20" :
                              isPositive ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20" :
                              "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                            )}>
                              {isPoints ? (
                                <>
                                  <Coins className="h-3 w-3" />
                                  {isPositive ? "+" : "-"}{Math.abs(log.points || 0)}
                                </>
                              ) : (
                                <span className="text-[10px] tracking-widest uppercase">
                                  BADGE
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Description if available */}
                          {(log.ruleDescription || log.badgeDescription) && (
                            <p className="mt-2 text-[12px] text-muted-foreground/80 leading-snug border-t border-border/40 pt-2">
                              {log.ruleDescription || log.badgeDescription}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer / Pagination */}
        <div className="sticky bottom-0 z-10 bg-background/80 backdrop-blur-xl border-t border-border/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => Math.max(1, p - 1));
                setFilter("all"); // Reset filter on pagination to avoid empty screens
              }}
              disabled={page === 1 || loading}
              className="h-9 px-4 rounded-xl text-xs font-semibold shadow-sm hover:bg-muted"
            >
              <ChevronLeft className="h-4 w-4 mr-1.5" />
              Previous
            </Button>
            <div className="flex flex-col items-center">
              <span className="text-[13px] font-bold text-foreground">Page {page}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPage((p) => p + 1);
                setFilter("all");
              }}
              disabled={!hasMore || loading}
              className="h-9 px-4 rounded-xl text-xs font-semibold shadow-sm hover:bg-muted"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
