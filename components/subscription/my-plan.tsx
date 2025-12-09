"use client";

import { CheckCircle, FileWarning, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCheckEntitySubscription } from "@/graphql/actions";

type AlertCardProps = {
  variant: "destructive" | "warning" | "success" | "default";
  icon: typeof CheckCircle;
  iconClassName: string;
  title: string;
  description: string;
};

const AlertCard = ({
  variant,
  icon: Icon,
  iconClassName,
  title,
  description,
}: AlertCardProps) => (
  <div
    className={cn(
      "flex items-start gap-4 p-5 rounded-xl border mb-6 transition-all",
      variant === "destructive" && "bg-destructive/10 border-destructive/30",
      variant === "warning" && "bg-warning/10 border-warning/30",
      variant === "success" && "bg-success/10 border-success/30",
      variant === "default" && "bg-secondary border-border"
    )}
  >
    <div
      className={cn(
        "flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
        variant === "destructive" && "bg-destructive/20",
        variant === "warning" && "bg-warning/20",
        variant === "success" && "bg-success/20",
        variant === "default" && "bg-muted"
      )}
    >
      <Icon className={cn("h-5 w-5", iconClassName)} />
    </div>
    <div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

const MyPlan = () => {
  const { data, loading } = useCheckEntitySubscription();

  const subscription = data?.checkEntitySubscription;

  const now = new Date().getTime();
  const endDate = subscription?.endDate
    ? new Date(subscription.endDate).getTime()
    : null;
  const graceUntil = subscription?.graceUntil
    ? new Date(subscription.graceUntil).getTime()
    : null;

  const isTrialEnded =
    subscription?.subscriptionType === "trial" &&
    endDate !== null &&
    endDate < now;
  const isTrialActive =
    subscription?.subscriptionType === "trial" &&
    endDate !== null &&
    endDate > now;
  const isSuspended = subscription?.status === "suspended";
  const isInGracePeriod =
    subscription?.status === "cancelled" && graceUntil && graceUntil > now;
  const isCancelledAndExpired =
    subscription?.status === "cancelled" && (!graceUntil || graceUntil <= now);
  const isActivePaid =
    subscription?.subscriptionType === "paid" &&
    subscription?.status === "active";

  return (
    <>
      {isSuspended && (
        <AlertCard
          variant="destructive"
          icon={XCircle}
          iconClassName="text-destructive"
          title="Your account is suspended."
          description="Your subscription has been suspended. Please select a plan to continue using Thrico."
        />
      )}

      {isTrialEnded && (
        <AlertCard
          variant="destructive"
          icon={FileWarning}
          iconClassName="text-destructive"
          title="Your trial has ended!"
          description="You can no longer use Thrico. Select a plan to continue."
        />
      )}

      {isTrialActive && (
        <AlertCard
          variant="warning"
          icon={AlertTriangle}
          iconClassName="text-warning"
          title={`Your trial ends on ${
            subscription?.endDate &&
            new Date(subscription.endDate).toLocaleDateString()
          }`}
          description="You can continue using Thrico until then. Select a plan to stay subscribed."
        />
      )}

      {isInGracePeriod && (
        <AlertCard
          variant="warning"
          icon={AlertTriangle}
          iconClassName="text-warning"
          title="You're in a grace period."
          description={`Your subscription is cancelled. Grace period ends on ${
            subscription?.graceUntil &&
            new Date(subscription.graceUntil).toLocaleDateString()
          }.`}
        />
      )}

      {isCancelledAndExpired && (
        <AlertCard
          variant="destructive"
          icon={XCircle}
          iconClassName="text-destructive"
          title="Your subscription and grace period have ended."
          description="Please subscribe to regain access to Thrico."
        />
      )}

      {isActivePaid && (
        <AlertCard
          variant="success"
          icon={CheckCircle}
          iconClassName="text-success"
          title={`You're on an active plan: ${subscription.planName}`}
          description={`Billing cycle: ${subscription.billingCycle}`}
        />
      )}
    </>
  );
};

export default MyPlan;
