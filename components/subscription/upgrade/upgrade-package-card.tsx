"use client";

import type React from "react";
import {
  Smartphone,
  Users,
  ShieldCheck,
  ArrowUp,
  Check,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Module {
  name: string;
  icon: string;
}

interface CountryPackage {
  packageId: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  currency: string;
  accessType: string;
  numberOfUsers: number;
  adminUsers: number;
  benefits: string[];
  modules: Module[];
}

interface PlanOverview {
  userUsage: { limit: number };
  adminUsers?: { limit: number };
}

interface UpgradePackageCardProps {
  pkg: CountryPackage;
  isYearly: boolean;
  planOverview: PlanOverview | null;
  isRecommended?: boolean;
  loadingPlan: boolean;
  isActive: boolean;
  onUpgrade: () => void;
}

const formatPrice = (
  monthly: number,
  yearly: number,
  isYearly: boolean,
  currency: string
) => {
  const price = isYearly ? Math.round(yearly / 12) : monthly;
  return `${currency}${price}`;
};

const getYearlySavings = (monthly: number, yearly: number) => {
  if (monthly === 0 || yearly === 0) return 0;
  const monthlyTotal = monthly * 12;
  const savings = monthlyTotal - yearly;
  return Math.round((savings / monthlyTotal) * 100);
};

const UpgradePackageCard: React.FC<UpgradePackageCardProps> = ({
  pkg,
  isYearly,
  planOverview,
  isRecommended = false,
  loadingPlan,
  isActive,
  onUpgrade,
}) => {
  const savings = getYearlySavings(pkg.monthlyPrice, pkg.yearlyPrice);
  const extraUsers = pkg.numberOfUsers - (planOverview?.userUsage.limit ?? 0);
  const extraAdmins = pkg.adminUsers - (planOverview?.adminUsers?.limit ?? 0);

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border bg-card p-6 transition-all duration-300",
        isRecommended
          ? "border-primary ring-2 ring-primary/20 scale-[1.02]"
          : "border-border hover:border-primary/50"
      )}
    >
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground px-4 py-1 font-medium shadow-lg">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Recommended
          </Badge>
        </div>
      )}

      {/* Header */}
      <div className="text-center pt-2 pb-4">
        <h3 className="text-xl font-semibold text-foreground mb-4">
          {pkg.name}
        </h3>
        <div className="flex items-baseline justify-center gap-1">
          <span className="text-4xl font-bold text-foreground">
            {formatPrice(
              pkg.monthlyPrice,
              pkg.yearlyPrice,
              isYearly,
              pkg.currency
            )}
          </span>
          <span className="text-muted-foreground">/mo</span>
        </div>
        {isYearly && savings > 0 && (
          <Badge
            variant="secondary"
            className="mt-2 bg-primary/10 text-primary border-0"
          >
            Save {savings}% yearly
          </Badge>
        )}
        {isYearly && (
          <p className="text-xs text-muted-foreground mt-2">
            Billed {pkg.currency}
            {pkg.yearlyPrice} annually
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border my-4" />

      {/* Features */}
      <div className="space-y-3 flex-1">
        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Smartphone className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground">
            {pkg.accessType === "WebOnly"
              ? "Web Access Only"
              : "Web + Mobile App"}
          </span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground">{pkg.numberOfUsers} users</span>
          {extraUsers > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{extraUsers} more
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
            <ShieldCheck className="h-4 w-4 text-primary" />
          </div>
          <span className="text-foreground">
            {pkg.adminUsers} admin{pkg.adminUsers > 1 ? "s" : ""}
          </span>
          {extraAdmins > 0 && (
            <Badge variant="secondary" className="text-xs">
              +{extraAdmins} more
            </Badge>
          )}
        </div>
      </div>

      {/* Benefits */}
      <div className="mt-6 space-y-2.5">
        {pkg.benefits
          .filter((benefit) => benefit.trim() !== "")
          .map((benefit, index) => (
            <div key={index} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{benefit}</span>
            </div>
          ))}
      </div>

      {/* CTA Button */}
      <Button
        disabled={loadingPlan && isActive}
        onClick={onUpgrade}
        className={cn(
          "mt-6 w-full",
          isRecommended
            ? "bg-primary hover:bg-primary/90"
            : "bg-secondary hover:bg-secondary/80 text-foreground"
        )}
      >
        {loadingPlan && isActive ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            Processing...
          </span>
        ) : (
          <>
            <ArrowUp className="mr-2 h-4 w-4" />
            Upgrade Now
          </>
        )}
      </Button>
    </div>
  );
};

export default UpgradePackageCard;
