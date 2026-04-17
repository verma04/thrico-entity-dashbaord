import React from "react";
import { cn } from "@/lib/utils";

interface RewardInfoSidebarProps {
  reward: any;
  inventoryRequired: boolean;
}

export function RewardInfoSidebar({ reward, inventoryRequired }: RewardInfoSidebarProps) {
  if (!reward) return null;

  return (
    <div className="bg-white dark:bg-muted/5 rounded-2xl border border-border/40 p-5 space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        Reward Info
      </h4>
      <div className="space-y-2 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Created</span>
          <span className="font-medium text-foreground">
            {reward.createdAt
              ? new Date(reward.createdAt).toLocaleDateString()
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Last updated</span>
          <span className="font-medium text-foreground">
            {reward.updatedAt
              ? new Date(reward.updatedAt).toLocaleDateString()
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Status</span>
          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border",
              reward.isActive
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-muted text-muted-foreground border-border",
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                reward.isActive ? "bg-emerald-500" : "bg-muted-foreground",
              )}
            />
            {reward.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Inventory tracking</span>
          <span className="font-medium text-foreground">
            {inventoryRequired ? "On" : "Off"}
          </span>
        </div>
      </div>
    </div>
  );
}
