import React, { use, useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CountryPackage, UpgradePlanSummary } from "../ts-types";
import { formatPrice, renderModuleIcon } from "../utils";
import {
  ArrowUpIcon,
  ShieldAlertIcon,
  TabletSmartphone,
  Users2Icon,
  Check,
  Sparkles,
} from "lucide-react";

import UpgradeModal from "./upgrade-modal";
import {
  useCountryPackage,
  usePlanOverview,
  useUpgradePlanSummary,
} from "@/graphql/actions/plan";
import CustomRequestForm from "../custom-request/custom-request-form";
import { Skeleton } from "@/components/ui/skeleton";

const Upgrade = () => {
  const { data, loading } = useCountryPackage();
  const [active, setActive] = useState<UpgradePlanSummary | null>(null);
  const [activePackage, setActivePackage] = useState<CountryPackage | null>(
    null
  );
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
    return Math.max(
      ...packages.map((pkg) =>
        getYearlySavings(pkg.monthlyPrice, pkg.yearlyPrice)
      )
    );
  };

  const [get, { loading: loadingPlan }] = useUpgradePlanSummary({
    onCompleted: (data: { getUpgradePlanSummary: UpgradePlanSummary }) => {
      setActive(data.getUpgradePlanSummary);
    },
  });

  return (
    <>
      <div className="min-h-screen bg-background py-12 px-4">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <Badge
              variant="secondary"
              className="mb-4 bg-primary/10 text-primary border-0"
            >
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              Upgrade Your Plan
            </Badge>
            <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">
              Choose the perfect plan for your team
            </h1>
            {planOverview?.subscriptionType === "trail" && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Your trial includes 14 days of full access. Upgrade to unlock
                advanced modules, exclusive features, and higher limits tailored
                for your team. Each plan offers unique benefits to help your
                organization grow.
              </p>
            )}

            {planOverview?.subscriptionType === "paid" && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Explore our plans to unlock additional modules, advanced
                features, and higher limits. Upgrade to get even more value and
                flexibility for your growing organization.
              </p>
            )}
          </div>

          {loading && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-6 w-32 ml-4" />
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="relative w-full max-w-xs bg-background border rounded-xl shadow-sm flex flex-col p-6"
                  >
                    <Skeleton className="absolute top-2 right-2 h-6 w-20" />

                    <div className="text-center mb-4">
                      <Skeleton className="h-7 w-32 mx-auto mb-2" />
                      <Skeleton className="h-10 w-40 mx-auto mt-4" />
                      <Skeleton className="h-4 w-28 mx-auto mt-2" />
                    </div>

                    <div className="flex flex-col gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-36" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-28" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-4" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex flex-col gap-2 mb-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Skeleton className="h-4 w-4 mt-1" />
                          <Skeleton className="h-4 flex-1" />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 mb-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      ))}
                    </div>

                    <Skeleton className="h-10 w-full mt-auto" />
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && data?.getCountryPackage.length > 0 && (
            <>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                  <span className="font-semibold mr-2">Monthly</span>
                  <Switch
                    checked={isYearly}
                    onCheckedChange={setIsYearly}
                    className="align-middle"
                  />
                  <span className="font-semibold ml-2">Yearly</span>
                  <Badge variant="outline" className="ml-4">
                    Save up to {allPlanPercentage(data?.getCountryPackage)}% on
                    yearly plans
                    {isYearly ? " (compared to monthly)" : ""}
                  </Badge>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {data?.getCountryPackage?.map((pkg: CountryPackage) => {
                  const savings = getYearlySavings(
                    pkg.monthlyPrice,
                    pkg.yearlyPrice
                  );
                  const extraUsers =
                    pkg.numberOfUsers - (planOverview?.userUsage.limit ?? 0);
                  const extraAdmins =
                    pkg.adminUsers - (planOverview?.adminUsers?.limit ?? 0);

                  return (
                    <div
                      key={pkg.packageId}
                      className={cn(
                        "relative w-full max-w-xs bg-background border rounded-xl shadow-sm flex flex-col p-6"
                      )}
                    >
                      <Badge
                        variant="default"
                        className="absolute top-0 right-0 mt-2 mr-2 z-10"
                      >
                        Upgrade
                      </Badge>
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-bold mb-1">{pkg.name}</h3>
                        <div className="mt-2">
                          <div className="text-3xl font-bold mb-0">
                            {formatPrice(
                              pkg.monthlyPrice,
                              pkg.yearlyPrice,
                              isYearly,
                              pkg.currency
                            )}
                          </div>
                          {isYearly && savings > 0 && (
                            <div className="text-green-600 font-semibold text-sm mt-1">
                              Save {savings}% annually
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <TabletSmartphone size={16} />
                          <span>
                            {pkg.accessType === "WebOnly"
                              ? "Web Access Only"
                              : "Web + Mobile App"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users2Icon size={16} />
                          <span>{pkg.numberOfUsers} users</span>
                          {extraUsers > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              +{extraUsers}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldAlertIcon size={16} />
                          <span>
                            {pkg.adminUsers} admin user
                            {pkg.adminUsers > 1 ? "s" : ""}
                          </span>
                          {extraAdmins > 0 && (
                            <Badge variant="secondary" className="ml-1">
                              +{extraAdmins}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Separator className="my-3" />
                      <div className="flex flex-col gap-1 mb-2">
                        {pkg.benefits
                          .filter((benefit) => benefit.trim() !== "")
                          .map((benefit, index) => (
                            <div key={index} className="flex items-start gap-2">
                              <Check
                                className="text-green-500 mt-1"
                                size={16}
                              />
                              <span>{benefit}</span>
                            </div>
                          ))}
                      </div>
                      <div className="flex flex-col gap-1 mb-4">
                        {pkg.modules.map((module, index) => (
                          <div key={index} className="flex items-start gap-2">
                            {renderModuleIcon(module.icon)}
                            <span>{module.name}</span>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={() => {
                          get({
                            variables: {
                              input: {
                                packageId: pkg.packageId,
                              },
                            },
                          });
                          setActivePackage(pkg);
                        }}
                        disabled={
                          loadingPlan &&
                          activePackage?.packageId === pkg.packageId
                        }
                        className="w-full mt-auto"
                      >
                        <ArrowUpIcon size={16} className="mr-2" />
                        {loadingPlan &&
                        activePackage?.packageId === pkg.packageId
                          ? "Loading..."
                          : "Upgrade"}
                      </Button>
                    </div>
                  );
                })}
              </div>
            </>
          )}
          {!loading && data?.getCountryPackage.length === 0 && (
            <div className="mt-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-foreground mb-3">
                  You're on our highest tier! 🎉
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  You're already enjoying our most premium package with all
                  available features and benefits. Need something more? Let us
                  know your custom requirements below.
                </p>
              </div>
            </div>
          )}

          <CustomRequestForm />
        </div>
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
