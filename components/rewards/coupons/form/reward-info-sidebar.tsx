import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";

interface RewardInfoSidebarProps {
  reward: any;
  inventoryRequired: boolean;
}

export function RewardInfoSidebar({
  reward,
  inventoryRequired,
}: RewardInfoSidebarProps) {
  if (!reward) return null;

  return (
    <PolarisSidebarCard title="Metadata" badge="Audit Log" icon={Info}>
      <div className="space-y-1 text-xs">
        <PolarisSummaryRow
          label="Created Date"
          value={
            reward.createdAt
              ? new Date(Number(reward.createdAt) || reward.createdAt).toLocaleDateString()
              : "—"
          }
        />
        <PolarisSummaryRow
          label="Last Modified"
          value={
            reward.updatedAt
              ? new Date(Number(reward.updatedAt) || reward.updatedAt).toLocaleDateString()
              : "—"
          }
        />
        <PolarisSummaryRow
          label="Status"
          value={
            <span
              className={cn(
                "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                reward.isActive
                  ? "bg-[#008060]/10 text-[#008060]"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  reward.isActive ? "bg-[#008060]" : "bg-zinc-400",
                )}
              />
              {reward.isActive ? "Active" : "Inactive"}
            </span>
          }
        />
        <PolarisSummaryRow
          label="Inventory Mode"
          value={inventoryRequired ? "One-to-One" : "One-to-Many"}
          isLast
        />
      </div>
    </PolarisSidebarCard>
  );
}
