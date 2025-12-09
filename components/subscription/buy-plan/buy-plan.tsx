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

const BuyPlan = () => {
  const { data, loading } = useCountryPackage();
  const [isYearly, setIsYearly] = useState<boolean>(false);
  const [activePackage, setActivePackage] = useState<CountryPackage | null>(
    null
  );

  return (
    <Card className="max-w-5xl mx-auto mt-8 p-8 shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Choose Your Plan</h2>
      <p className="text-muted-foreground mb-6">
        Select the perfect plan for your business needs
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
