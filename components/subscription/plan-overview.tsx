import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Boxes, Crown, Shield, Sparkles, Users } from "lucide-react";
import moment from "moment";

import { usePlanOverview } from "@/graphql/actions/plan";
import YearlyUpgrade from "./yearly-upgrade";
import { cn } from "@/lib/utils";

type StatCardProps = {
  icon: React.ElementType;
  label: string;
  used: number;
  limit: number;
};

const StatCard = ({ icon: Icon, label, used, limit }: StatCardProps) => (
  <div className="bg-secondary/50 rounded-xl p-5 border border-border/50">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-foreground">{used}</span>
      <span className="text-muted-foreground">/ {limit}</span>
    </div>
  </div>
);

const PlanOverview = () => {
  const { data, loading } = usePlanOverview();
  const planOverview = data?.getPlanOverview;
  const statusConfig = {
    active: {
      color: "bg-success/20 text-success border-success/30",
      label: "Active",
    },
    scheduled_upgrade: {
      color: "bg-primary/20 text-primary border-primary/30",
      label: "Upgrade Scheduled",
    },
    scheduled_downgrade: {
      color: "bg-warning/20 text-warning border-warning/30",
      label: "Downgrade Scheduled",
    },
    cancelled: {
      color: "bg-destructive/20 text-destructive border-destructive/30",
      label: "Cancelled",
    },
    suspended: {
      color: "bg-destructive/20 text-destructive border-destructive/30",
      label: "Suspended",
    },
  };

  const status =
    statusConfig[planOverview?.status as keyof typeof statusConfig] ||
    statusConfig.active;

  const percent =
    planOverview?.userUsage?.used !== undefined &&
    planOverview?.userUsage?.limit
      ? (planOverview.userUsage.used / planOverview.userUsage.limit) * 100
      : 0;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full max-w-3xl border-border/50 bg-card">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Crown className="w-7 h-7 text-primary" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                {planOverview?.planName}
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", status.color)}
                >
                  {status.label}
                </Badge>
              </CardTitle>
              <CardDescription className="mt-1">
                {planOverview?.subscriptionType === "trail" ? (
                  <span className="text-warning">
                    Trial ends on{" "}
                    {formatDate(planOverview?.nextPaymentDate ?? "")}
                  </span>
                ) : (
                  <span>
                    Renews on {formatDate(planOverview?.nextPaymentDate ?? "")}{" "}
                    •{" "}
                    <span className="capitalize">
                      {planOverview?.billingCycle}
                    </span>{" "}
                    billing
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <StatCard
            icon={Boxes}
            label="Modules Used"
            used={planOverview?.modulesUsed?.used ?? 0}
            limit={planOverview?.modulesUsed?.limit ?? 0}
          />
        </div>

        {/* Usage Progress */}
        <div className="bg-secondary/30 rounded-xl p-5 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <span className="font-medium text-foreground">
              Team Member Usage
            </span>
            <span className="text-sm text-muted-foreground">
              {planOverview?.userUsage?.used ?? 0} of{" "}
              {planOverview?.userUsage?.limit ?? 0} used
            </span>
          </div>
          <Progress
            value={percent}
            className={cn(
              "h-2",
              percent > 80 ? "[&>div]:bg-destructive" : "[&>div]:bg-primary"
            )}
          />
          {percent > 80 && (
            <p className="text-sm text-destructive mt-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
              You&apos;re at {Math.round(percent)}% capacity. Consider
              upgrading.
            </p>
          )}
        </div>

        {/* Yearly Upgrade CTA */}
        {planOverview?.status === "active" &&
          planOverview.subscriptionType === "paid" &&
          planOverview?.billingCycle === "monthly" && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    Save 20% with yearly billing
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Switch to annual and save on your subscription
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
              >
                Upgrade
              </Button>
            </div>
          )}
      </CardContent>
    </Card>
  );
};

export default PlanOverview;
