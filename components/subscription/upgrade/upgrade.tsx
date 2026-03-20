import React, { useState } from "react";
import { CountryPackage, UpgradePlanSummary } from "../ts-types";
import UpgradeModal from "./upgrade-modal";
import {
  useCountryPackage,
  usePlanOverview,
  useUpgradePlanSummary,
} from "@/graphql/actions/plan";
import CustomRequestForm from "../custom-request/custom-request-form";
import { UpgradeHeader } from "./upgrade-header";
import { PlanToggle } from "./plan-toggle";
import { PlanCardSkeleton } from "./plan-skeleton";
import { PlanCard } from "./plan-card";

const Upgrade = () => {
  const { data, loading } = useCountryPackage();
  const [active, setActive] = useState<UpgradePlanSummary | null>(null);
  const [activePackage, setActivePackage] = useState<CountryPackage | null>(null);
  const { data: myPlan } = usePlanOverview();
  const planOverview = myPlan?.getPlanOverview;
  const [isYearly, setIsYearly] = useState<boolean>(false);

  const getYearlySavings = (monthly: number, yearly: number) => {
    if (monthly === 0 || yearly === 0) return 0;
    const monthlyTotal = monthly * 12;
    const savings = monthlyTotal - yearly;
    return Math.round((savings / monthlyTotal) * 100);
  };

  const allPlanPercentage = (packages: CountryPackage[] = []) => {
    if (!packages.length) return 0;
    return Math.max(...packages.map((pkg) => getYearlySavings(pkg.monthlyPrice, pkg.yearlyPrice)));
  };

  const [get, { loading: loadingPlan }] = useUpgradePlanSummary({
    onCompleted: (data: { getUpgradePlanSummary: UpgradePlanSummary }) => {
      setActive(data.getUpgradePlanSummary);
    },
  });

  const handleUpgrade = (pkg: CountryPackage) => {
    get({ variables: { input: { packageId: pkg.packageId } } });
    setActivePackage(pkg);
  };

  return (
    <>
      <div className="space-y-6">
        <UpgradeHeader
          subscriptionType={planOverview?.subscriptionType}
          isHighTier={!loading && data?.getCountryPackage.length === 0}
        />

        {loading && <PlanCardSkeleton />}

        {!loading && data?.getCountryPackage.length > 0 && (
          <>
            <PlanToggle
              isYearly={isYearly}
              onToggle={setIsYearly}
              maxSavings={allPlanPercentage(data?.getCountryPackage)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {data?.getCountryPackage?.map((pkg: CountryPackage) => {
                const savings = getYearlySavings(pkg.monthlyPrice, pkg.yearlyPrice);
                const extraUsers = pkg.numberOfUsers - (planOverview?.userUsage.limit ?? 0);
                const extraAdmins = pkg.adminUsers - (planOverview?.adminUsers?.limit ?? 0);
                return (
                  <PlanCard
                    key={pkg.packageId}
                    pkg={pkg}
                    isYearly={isYearly}
                    savings={savings}
                    extraUsers={extraUsers}
                    extraAdmins={extraAdmins}
                    onUpgrade={handleUpgrade}
                    isLoading={loadingPlan}
                    isActivePackage={activePackage?.packageId === pkg.packageId}
                  />
                );
              })}
            </div>
          </>
        )}

        <CustomRequestForm />
      </div>

      {active && (
        <UpgradeModal
          activePackage={activePackage}
          summary={active}
          visible={!!active}
          onClose={() => {
            setActive(null);
            setActivePackage(null);
          }}
        />
      )}
    </>
  );
};

export default Upgrade;
