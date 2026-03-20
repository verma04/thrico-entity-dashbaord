"use client";

import { CheckCircle, FileWarning, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckEntitySubscription } from "@/graphql/actions";

type AlertCardProps = {
  variant: "destructive" | "warning" | "success" | "default";
  icon: typeof CheckCircle;
  title: string;
  description: string;
};

const variantStyles = {
  destructive: {
    wrap: "bg-red-50 border-red-200",
    icon: "bg-red-100 text-red-600",
    title: "text-red-800",
    desc: "text-red-600",
    bar: "bg-red-500",
  },
  warning: {
    wrap: "bg-amber-50 border-amber-200",
    icon: "bg-amber-100 text-amber-600",
    title: "text-amber-800",
    desc: "text-amber-600",
    bar: "bg-amber-400",
  },
  success: {
    wrap: "bg-emerald-50 border-emerald-200",
    icon: "bg-emerald-100 text-emerald-600",
    title: "text-emerald-800",
    desc: "text-emerald-600",
    bar: "bg-emerald-500",
  },
  default: {
    wrap: "bg-slate-50 border-slate-200",
    icon: "bg-slate-100 text-slate-600",
    title: "text-slate-800",
    desc: "text-slate-500",
    bar: "bg-slate-400",
  },
};

const AlertCard = ({ variant, icon: Icon, title, description }: AlertCardProps) => {
  const s = variantStyles[variant];
  return (
    <div className={cn("flex items-start gap-3 px-4 py-3.5 rounded-xl border", s.wrap)}>
      {/* Left accent bar */}
      <div className={cn("w-0.5 self-stretch rounded-full shrink-0", s.bar)} />
      <div className={cn("h-7 w-7 rounded-md flex items-center justify-center shrink-0", s.icon)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className={cn("text-[13px] font-semibold leading-none", s.title)}>{title}</p>
        <p className={cn("text-[12px] mt-1 leading-relaxed", s.desc)}>{description}</p>
      </div>
    </div>
  );
};

const MyPlan = () => {
  const { data, loading } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const now = new Date().getTime();
  const endDate = subscription?.endDate ? new Date(subscription.endDate).getTime() : null;
  const graceUntil = subscription?.graceUntil ? new Date(subscription.graceUntil).getTime() : null;

  const isTrialEnded =
    subscription?.subscriptionType === "trial" && endDate !== null && endDate < now;
  const isTrialActive =
    subscription?.subscriptionType === "trial" && endDate !== null && endDate > now;
  const isSuspended = subscription?.status === "suspended";
  const isInGracePeriod =
    subscription?.status === "cancelled" && graceUntil && graceUntil > now;
  const isCancelledAndExpired =
    subscription?.status === "cancelled" && (!graceUntil || graceUntil <= now);
  const isActivePaid =
    subscription?.subscriptionType === "paid" && subscription?.status === "active";

  if (loading) return null;

  return (
    <div className="space-y-2">
      {isSuspended && (
        <AlertCard
          variant="destructive"
          icon={XCircle}
          title="Account Suspended"
          description="Your subscription has been suspended. Please select a plan to continue using Thrico."
        />
      )}
      {isTrialEnded && (
        <AlertCard
          variant="destructive"
          icon={FileWarning}
          title="Trial Period Ended"
          description="You can no longer use Thrico. Select a plan to continue."
        />
      )}
      {isTrialActive && (
        <AlertCard
          variant="warning"
          icon={AlertTriangle}
          title={`Trial ends on ${subscription?.endDate && new Date(subscription.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
          description="You can continue using Thrico until then. Select a plan to stay subscribed."
        />
      )}
      {isInGracePeriod && (
        <AlertCard
          variant="warning"
          icon={AlertTriangle}
          title="Grace Period Active"
          description={`Your subscription is cancelled. Grace period ends on ${subscription?.graceUntil && new Date(subscription.graceUntil).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}.`}
        />
      )}
      {isCancelledAndExpired && (
        <AlertCard
          variant="destructive"
          icon={XCircle}
          title="Subscription Expired"
          description="Your subscription and grace period have ended. Please subscribe to regain access."
        />
      )}
      {isActivePaid && (
        <AlertCard
          variant="success"
          icon={CheckCircle}
          title={`Active — ${subscription.planName}`}
          description={`Billing cycle: ${subscription.billingCycle}`}
        />
      )}
    </div>
  );
};

export default MyPlan;
