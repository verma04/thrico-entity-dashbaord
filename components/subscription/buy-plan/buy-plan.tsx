import React, { useState } from "react";
import { Card } from "@/components/ui/card";

import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

import PackageCard from "./package-card";
import BuyPlanPopUp from "./buy-plan-pop";

import { CountryPackage } from "../ts-types";
import { useCountryPackage } from "@/graphql/actions/plan";
import CustomRequestForm from "../custom-request/custom-request-form";
import { PlanCardSkeleton } from "../upgrade/plan-skeleton";

// Utility function to calculate the maximum percentage saved on yearly plans
function allPlanPercentage(packages?: CountryPackage[]): number {
  if (!packages || packages.length === 0) return 0;
  // Assuming each package has a 'monthlyPrice' and 'yearlyPrice' property
  // and yearlyPrice is the total for 12 months (not per month)
  const percentages = packages.map((pkg) => {
    if (!pkg.monthlyPrice || !pkg.yearlyPrice) return 0;
    const monthlyTotal = pkg.monthlyPrice * 12;
    const yearly = pkg.yearlyPrice;
    if (monthlyTotal === 0) return 0;
    return Math.round(((monthlyTotal - yearly) / monthlyTotal) * 100);
  });
  return Math.max(...percentages);
}

type BuyPlanProps = {
  displayStatus?: string;
};

const BuyPlan = ({ displayStatus = "no_subscription" }: BuyPlanProps) => {
  const { data, loading } = useCountryPackage();
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [activePackage, setActivePackage] = useState<CountryPackage | null>(
    null
  );

  // Dynamic messages based on subscription status
  const statusMessages: Record<string, string> = {
    no_subscription:
      "Your trial includes 14 days of full access. Upgrade to unlock advanced modules, exclusive features, and higher limits tailored for your team. Each plan offers unique benefits to help your organization grow.",
    cancelled:
      "Your subscription was cancelled. Choose a plan below to reactivate and regain access to all premium features and continue growing your community.",
    suspended:
      "Resolve your payment issues by selecting a plan below. Once activated, you'll regain full access to your dashboard and all premium features.",
    pending:
      "Complete your subscription setup by choosing a plan below. Get instant access to advanced modules, exclusive features, and higher limits.",
    active:
      "Upgrade your current plan to unlock even more features and capabilities. Compare plans below to find the perfect fit for your growing needs.",
    scheduled_downgrade:
      "Reconsider your downgrade by exploring our plans below. You can upgrade or maintain your current plan to keep all premium features.",
    scheduled_upgrade:
      "Your upgrade is scheduled! In the meantime, explore other plans below or modify your upcoming upgrade to better suit your needs.",
  };

  const message = statusMessages[displayStatus] || statusMessages.no_subscription;

  return (
    <Card className="max-w-5xl mx-auto mt-8 p-8 shadow-lg">
      <p className="text-muted-foreground mb-6">
        {message}
      </p>
      <div className="flex items-center gap-4 mb-8">
        <Label className={isYearly ? "" : "font-bold"}>Monthly</Label>
        <Switch checked={isYearly} onCheckedChange={setIsYearly} />
        <Label className={isYearly ? "font-bold" : ""}>Yearly</Label>
        <Badge variant="outline" className="ml-4 text-blue-600 border-blue-600">
          Save up to {allPlanPercentage(data?.getCountryPackage)}% on yearly
          plans
          {isYearly ? " (compared to monthly)" : ""}
        </Badge>
      </div>
      <Separator className="mb-8" />

  

      {loading && <PlanCardSkeleton />}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-6">
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

      {activePackage && (
        <BuyPlanPopUp
          activePackage={activePackage}
          visible={!!activePackage}
          onClose={() => setActivePackage(null)}
        />
      )}
      <div className="mt-8">
        <CustomRequestForm />
      </div>
    </Card>
  );
};

export default BuyPlan;
