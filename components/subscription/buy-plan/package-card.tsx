import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TabletSmartphone,
  Users2,
  ShieldAlert,
  Check,
  Star,
} from "lucide-react";
import { formatPrice, renderModuleIcon } from "../utils";
import { CountryPackage } from "../ts-types";

function getYearlySavings(
  monthlyPrice: number,
  yearlyPrice: number,
  currency: string
): number {
  if (!monthlyPrice || !yearlyPrice) return 0;
  const totalMonthly = monthlyPrice * 12;
  const savings = totalMonthly - yearlyPrice;
  return Math.round((savings / totalMonthly) * 100);
}

interface PackageCardProps {
  pkg: CountryPackage;
  isYearly: boolean;
  activePackage: CountryPackage | null;
  setActivePackage: (pkg: CountryPackage) => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  pkg,
  isYearly,
  activePackage,
  setActivePackage,
}) => {
  const savings = getYearlySavings(
    pkg.monthlyPrice,
    pkg.yearlyPrice,
    pkg.currency
  );

  return (
    <div className="w-[300px] relative">
      {pkg.isPopular && (
        <Badge
          variant="default"
          className="absolute left-1/2 -translate-x-1/2 -top-4 z-10 bg-blue-600 text-white px-4 py-1 rounded-full shadow"
        >
          Most Popular
        </Badge>
      )}
      <Card
        className={`mt-6 flex flex-col items-center p-6 shadow-lg border-2 ${
          pkg.isPopular ? "border-blue-600" : "border-muted"
        }`}
      >
        <div className="text-center mb-4 h-24 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">{pkg.name}</span>
            {pkg.isPopular && (
              <Star className="ml-2 text-yellow-400" size={20} />
            )}
          </div>
          <div>
            <span className="text-3xl font-bold">
              {formatPrice(
                pkg.monthlyPrice,
                pkg.yearlyPrice,
                isYearly,
                pkg.currency
              )}
            </span>
            {isYearly && Number(savings) > 0 && (
              <span className="block text-green-600 font-semibold text-sm mt-1">
                Save {savings}% annually
              </span>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col gap-2 mb-4">
          <div className="flex items-center gap-2">
            <TabletSmartphone size={16} />
            <span className="text-sm">
              {pkg.accessType === "WebOnly"
                ? "Web Access Only"
                : "Web + Mobile App"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users2 size={16} />
            <span className="text-sm">Up to {pkg.numberOfUsers} members</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} />
            <span className="text-sm">
              {pkg.adminUsers} admin user{pkg.adminUsers > 1 ? "s" : ""}
            </span>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="w-full flex flex-col gap-2 mb-2">
          {pkg.benefits
            .filter((benefit) => benefit.trim() !== "")
            .map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <Check className="text-green-500" size={16} />
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
        </div>
        <div className="w-full flex flex-col gap-2 mb-2">
          {pkg.modules.map((module, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderModuleIcon(module.icon)}
              <span className="text-sm">{module.name}</span>
            </div>
          ))}
        </div>
        <Button
          className={`mt-4 w-full ${
            pkg.isPopular ? "bg-blue-600 text-white hover:bg-blue-700" : ""
          }`}
          loading={activePackage?.packageId === pkg.packageId}
          onClick={() => setActivePackage(pkg)}
          variant={pkg.isPopular ? "default" : "outline"}
        >
          Get Started
        </Button>
      </Card>
    </div>
  );
};

export default PackageCard;
