import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import PackageCard from "./package-card";
import BuyPlanPopUp from "./buy-plan-pop";
import { CountryPackage } from "../ts-types";
import { useCountryPackage } from "@/graphql/actions/plan";
import CustomRequestForm from "../custom-request/custom-request-form";
import { PlanCardSkeleton } from "../upgrade/plan-skeleton";
import { PlanToggle } from "../upgrade/plan-toggle";

function allPlanPercentage(packages?: CountryPackage[]): number {
  if (!packages || packages.length === 0) return 0;
  const percentages = packages.map((pkg) => {
    if (!pkg.monthlyPrice || !pkg.yearlyPrice) return 0;
    const monthlyTotal = pkg.monthlyPrice * 12;
    if (monthlyTotal === 0) return 0;
    return Math.round(((monthlyTotal - pkg.yearlyPrice) / monthlyTotal) * 100);
  });
  return Math.max(...percentages);
}

type BuyPlanProps = {
  displayStatus?: string;
};

const statusMessages: Record<string, string> = {
  no_subscription:
    "Your trial includes 14 days of full access. Upgrade to unlock advanced modules, exclusive features, and higher limits.",
  cancelled:
    "Your subscription was cancelled. Choose a plan below to reactivate and regain access to all premium features.",
  suspended:
    "Resolve your payment issues by selecting a plan below. Once activated, you'll regain full access.",
  pending:
    "Complete your subscription setup by choosing a plan below.",
  active:
    "Upgrade your current plan to unlock even more features and capabilities.",
  scheduled_downgrade:
    "Reconsider your downgrade by exploring our plans below.",
  scheduled_upgrade:
    "Your upgrade is scheduled! Explore other plans or modify your upcoming upgrade.",
};

const BuyPlan = ({ displayStatus = "no_subscription" }: BuyPlanProps) => {
  const { data, loading } = useCountryPackage();
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [activePackage, setActivePackage] = useState<CountryPackage | null>(null);

  const message = statusMessages[displayStatus] ?? statusMessages.no_subscription;

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
            Select a Plan
          </p>
          <p className="text-[13px] text-muted-foreground mt-1 max-w-lg">{message}</p>
        </div>
        <PlanToggle
          isYearly={isYearly}
          onToggle={setIsYearly}
          maxSavings={allPlanPercentage(data?.getCountryPackage)}
        />
      </div>

      {/* Cards */}
      <div className="p-5">
        {loading && <PlanCardSkeleton />}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data?.getCountryPackage?.map((pkg: CountryPackage) => (
              <PackageCard
                key={pkg.packageId}
                pkg={pkg}
                isYearly={isYearly}
                activePackage={activePackage}
                setActivePackage={setActivePackage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Custom form */}
      <div className="border-t border-border px-5 py-5">
        <CustomRequestForm />
      </div>

      {activePackage && (
        <BuyPlanPopUp
          activePackage={activePackage}
          visible={!!activePackage}
          onClose={() => setActivePackage(null)}
        />
      )}
    </div>
  );
};

export default BuyPlan;
