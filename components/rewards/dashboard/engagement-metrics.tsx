import React from "react";
import { Ticket, Zap, Activity } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";

export const EngagementMetrics = ({ stats }: { stats?: any }) => {
  const uniqueRedeemers = stats?.uniqueRedeemers || 0;
  const totalRedemptions = stats?.totalRedemptions || 0;
  const totalTcBurned = stats?.totalTcBurned || 0;
  const repeatClaimers = stats?.repeatClaimers || 0;

  const avgRedemptions = uniqueRedeemers > 0 ? (totalRedemptions / uniqueRedeemers).toFixed(1) : "0";
  const pointsPerRedemption = totalRedemptions > 0 ? Math.round(totalTcBurned / totalRedemptions) : 0;
  const repeatClaimersPct = uniqueRedeemers > 0 ? Math.round((repeatClaimers / uniqueRedeemers) * 100) : 0;

  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Engagement Metrics"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="grid grid-cols-1 gap-4">
        {[
          {
            label: "Avg. redemptions per user",
            value: avgRedemptions,
            icon: Ticket,
            sub: "in this period",
          },
          {
            label: "Points per redemption",
            value: pointsPerRedemption,
            icon: Zap,
            sub: "average cost",
          },
          {
            label: "Repeat claimers",
            value: `${repeatClaimersPct}%`,
            icon: Activity,
            sub: "of redeemers",
          },
        ].map((m, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card"
          >
            <div className="h-10 w-10 rounded-xl bg-muted border border-border/50 flex items-center justify-center shrink-0">
              <m.icon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                {m.label}
              </p>
              <p className="text-xl font-bold text-foreground tabular-nums">
                {m.value}
              </p>
              <p className="text-[11px] text-muted-foreground/60">{m.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
