import React, { useState } from "react";
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
  ChevronDown,
  ChevronUp,
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
  const [showAllModules, setShowAllModules] = useState(false);
  const moduleLimit = 3; // Show only 3 modules by default
  const hasMoreModules = pkg.modules.length > moduleLimit;
  const visibleModules = showAllModules
    ? pkg.modules
    : pkg.modules.slice(0, moduleLimit);

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
          className="absolute left-1/2 -translate-x-1/2 -top-0 z-10 bg-gradient-to-r from-blue-600 via-blue-500 to-purple-600 text-white px-3 py-2 text-sm font-bold rounded-full shadow-lg shadow-blue-500/50 animate-pulse"
        >
          ⭐ Most Popular
        </Badge>
      )}
      <Card
        className={`mt-6 flex flex-col items-center p-6 border-2 transition-all duration-300 ${
          pkg.isPopular 
            ? "border-blue-500 shadow-2xl shadow-blue-500/30 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20" 
            : "border-muted shadow-lg"
        }`}
      >
        <div className="text-center mb-4 h-24 flex flex-col justify-center items-center">
          <div className="flex items-center justify-center mb-2">
            <span className="text-2xl font-bold">{pkg.name}</span>
            {pkg.isPopular && (
              <Star className="ml-2 text-yellow-400 fill-yellow-400 drop-shadow-lg" size={24} />
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
          {visibleModules.map((module, index) => (
            <div key={index} className="flex items-center gap-2">
              {renderModuleIcon(module.icon)}
              <span className="text-sm">{module.name}</span>
            </div>
          ))}

          {hasMoreModules && (
            <button
              onClick={() => setShowAllModules(!showAllModules)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 mt-2 transition-colors"
            >
              {showAllModules ? (
                <>
                  <ChevronUp size={14} />
                  Show Less
                </>
              ) : (
                <>
                  <ChevronDown size={14} />
                  Show {pkg.modules.length - moduleLimit} More
                </>
              )}
            </button>
          )}
        </div>
        <Button
          className={`mt-4 w-full font-semibold transition-all duration-300 ${
            pkg.isPopular 
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02]" 
              : ""
          }`}
          loading={activePackage?.packageId === pkg.packageId}
          onClick={() => setActivePackage(pkg)}
          variant={pkg.isPopular ? "default" : "outline"}
        >
          {pkg.isPopular ? "🚀 Get Started" : "Get Started"}
        </Button>
      </Card>
    </div>
  );
};

export default PackageCard;
