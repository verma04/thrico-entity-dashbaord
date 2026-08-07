"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Boxes,
  CalendarDays,
  Crown,
  IndianRupee,
  Plus,
  Shield,
  Sparkles,
  TrendingUp,
  Users,
  ArrowRight,
} from "lucide-react";
import { AccessDeniedAlert } from "@/components/shared/access-denied-alert";
import { usePlanOverview } from "@/graphql/actions/plan";
import YearlyUpgrade from "./yearly-upgrade";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  used: number;
  limit: number;
};

const StatCard = ({ icon: Icon, label, used, limit }: StatCardProps) => {
  const percent = limit > 0 ? (used / limit) * 100 : 0;
  const isHigh = percent > 80;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
            <Icon className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <span className="text-[12px] font-semibold text-muted-foreground">{label}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-[13px] font-bold text-foreground tabular-nums">{used}</span>
          <span className="text-[11px] text-muted-foreground font-medium">/ {limit}</span>
          {isHigh && (
            <span className="ml-1.5 text-[10px] font-semibold text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 border border-red-100 px-1 py-0.5 rounded">
              High
            </span>
          )}
        </div>
      </div>
      <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700",
            isHigh ? "bg-red-500" : "bg-slate-800 dark:bg-slate-200"
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
};

const statusConfig = {
  active: {
    dot: "bg-emerald-500",
    label: "Active",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  },
  scheduled_upgrade: {
    dot: "bg-blue-500",
    label: "Upgrade Scheduled",
    badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
  },
  scheduled_downgrade: {
    dot: "bg-amber-500",
    label: "Downgrade Scheduled",
    badge: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
  },
  cancelled: {
    dot: "bg-red-500",
    label: "Cancelled",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
  suspended: {
    dot: "bg-red-500",
    label: "Suspended",
    badge: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20",
  },
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const PlanOverview = () => {
  const { data, loading, error } = usePlanOverview();
  const planOverview = data?.getPlanOverview;

  const status =
    statusConfig[planOverview?.status as keyof typeof statusConfig] ?? statusConfig.active;

  if (error) {
    return (
      <AccessDeniedAlert 
        message={error.message || "You do not have permission to view subscription details."} 
      />
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-border/50 bg-card shadow-sm p-5 animate-pulse space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="h-3 w-56 bg-muted rounded" />
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-9 w-9 rounded-lg bg-slate-900 dark:bg-muted flex items-center justify-center shrink-0">
            <Crown className="h-4.5 w-4.5 text-white dark:text-foreground" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[15px] font-semibold text-foreground leading-none tracking-tight">
                {planOverview?.planName ?? "Current Plan"}
              </h2>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold uppercase tracking-wider",
                  status.badge
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", status.dot)} />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-[12px] text-muted-foreground flex-wrap">
              {planOverview?.subscriptionType === "trail" ? (
                <span className="flex items-center gap-1 text-amber-600 font-medium">
                  <CalendarDays className="h-3 w-3" />
                  Trial ends {formatDate(planOverview?.nextPaymentDate ?? "")}
                </span>
              ) : (
                <>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3" />
                    Renews {formatDate(planOverview?.nextPaymentDate ?? "")}
                  </span>
                  <span className="text-muted-foreground/30">·</span>
                  <span className="flex items-center gap-1 capitalize">
                    <TrendingUp className="h-3 w-3" />
                    {planOverview?.billingCycle} billing
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Price */}
        {planOverview?.price !== undefined && (
          <div className="text-right shrink-0">
            <p className="text-[18px] font-bold text-foreground leading-none flex items-center justify-end gap-0.5 tabular-nums">
              <IndianRupee className="h-4 w-4" />
              {planOverview.price}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1 capitalize">
              per {planOverview.billingCycle}
            </p>
          </div>
        )}
      </div>

      {/* Usage stats */}
      <div className="px-5 py-4 space-y-4">
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
          Usage
        </p>
        <div className="grid grid-cols-1 gap-4">
          <StatCard
            icon={Users}
            label="Team Members"
            used={planOverview?.userUsage?.used ?? 0}
            limit={planOverview?.userUsage?.limit ?? 0}
          />
          <StatCard
            icon={Shield}
            label="Admin Users"
            used={planOverview?.adminUsers?.used ?? 0}
            limit={planOverview?.adminUsers?.limit ?? 0}
          />
        </div>
      </div>

      {/* Modules */}
      <div className="border-t border-border/50 px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center border border-indigo-100 dark:border-indigo-500/20">
            <Boxes className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-foreground leading-none">Modules</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Active modules in your plan
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/50 border border-border/50">
          <span className="text-[13px] font-bold text-foreground tabular-nums">
            {planOverview?.modulesUsed?.used ?? 0}
          </span>
          <span className="text-[11px] text-muted-foreground font-medium">
            / {planOverview?.modulesUsed?.limit ?? 0}
          </span>
        </div>
      </div>

      {/* Active Add-ons */}
      {planOverview?.addons && planOverview.addons.length > 0 && (
        <div className="border-t border-border/50 px-5 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
              Active Add-ons
            </p>
            <span className="text-[11px] font-semibold text-foreground bg-muted px-2 py-0.5 rounded-md">
              {planOverview.addons.length}
            </span>
          </div>
          <div className="space-y-1.5">
            {planOverview.addons.map((addon) => (
              <div
                key={addon.addonId}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-muted/50 border border-border/50 hover:border-border transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="h-6 w-6 rounded-md bg-background border border-border/50 flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-foreground leading-none">
                      {addon.name}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      Qty {addon.quantity} • {formatDate(addon.addedAt)}
                    </p>
                  </div>
                </div>
                <p className="text-[12px] font-semibold text-foreground tabular-nums">
                  {planOverview.package?.currency} {addon.totalPrice.toFixed(2)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Yearly upsell */}
      {planOverview?.status === "active" &&
        planOverview.subscriptionType === "paid" &&
        planOverview?.billingCycle === "monthly" && (
          <div className="border-t border-border/50 px-5 py-4">
            <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-lg bg-slate-900 dark:bg-muted text-white dark:text-foreground">
              <div className="flex items-center gap-3">
                <div className="h-7 w-7 rounded-md bg-card/10 dark:bg-slate-900/10 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-white dark:text-foreground" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold leading-none">
                    Save 20% with annual billing
                  </p>
                  <p className="text-[11px] text-slate-300 dark:text-muted-foreground mt-1">
                    Switch to yearly and reduce your total cost
                  </p>
                </div>
              </div>
              <YearlyUpgrade planOverview={{ package: planOverview.package }} />
            </div>
          </div>
        )}
    </div>
  );
};

export default PlanOverview;
