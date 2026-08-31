"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Users, ShieldCheck, Layers, UserCheck, Globe, Building } from "lucide-react";
import { cn } from "@/lib/utils";

export const ELIGIBILITY_FILTER_OPTIONS = [
  {
    value: "ALL",
    label: "All Eligibilities",
    shortLabel: "All",
    icon: Users,
    description: "Available to all members",
  },
  {
    value: "VERIFIED",
    label: "Verified Members",
    shortLabel: "Verified",
    icon: ShieldCheck,
    description: "Only verified members",
  },
  {
    value: "TIERS",
    label: "Specific Tiers",
    shortLabel: "Tiers",
    icon: Layers,
    description: "Members in specific tiers",
  },
  {
    value: "COMMUNITY",
    label: "Specific Communities",
    shortLabel: "Communities",
    icon: Building,
    description: "Members of specific communities",
  },
  {
    value: "SPECIFIC_CUSTOMERS",
    label: "Specific Customers",
    shortLabel: "Specific",
    icon: UserCheck,
    description: "Individually selected members",
  },
  {
    value: "OUTSIDE_PLATFORM",
    label: "Outside Platform",
    shortLabel: "Public",
    icon: Globe,
    description: "Open to members and non-members",
  },
] as const;

export type MemberEligibilityValue =
  | "ALL"
  | "VERIFIED"
  | "TIERS"
  | "COMMUNITY"
  | "SPECIFIC_CUSTOMERS"
  | "OUTSIDE_PLATFORM";

export interface MemberEligibilitySelectProps {
  value?: string | null;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export function MemberEligibilitySelect({
  value = "ALL",
  onValueChange,
  placeholder = "Eligibility",
  className,
  triggerClassName,
  contentClassName,
  showAllOption = true,
  allOptionLabel = "All Eligibilities",
}: MemberEligibilitySelectProps) {
  const currentValue = value || "ALL";

  return (
    <div className={cn("inline-block", className)}>
      <Select value={currentValue} onValueChange={onValueChange}>
        <SelectTrigger
          className={cn(
            "w-[145px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring",
            triggerClassName,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent
          className={cn(
            "rounded-lg border-border shadow-md p-1 min-w-[170px]",
            contentClassName,
          )}
        >
          {ELIGIBILITY_FILTER_OPTIONS.map((opt) => {
            if (!showAllOption && opt.value === "ALL") return null;
            const Icon = opt.icon;
            const label = opt.value === "ALL" ? allOptionLabel : opt.label;
            return (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="rounded-sm text-xs font-medium py-1.5 px-2 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span>{label}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </div>
  );
}
