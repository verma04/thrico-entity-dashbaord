import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CountryPackage } from "../ts-types";
import { formatPrice, renderModuleIcon } from "../utils";
import {
  ArrowUpIcon,
  ShieldAlertIcon,
  TabletSmartphone,
  Users2Icon,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";

interface PlanCardProps {
  pkg: CountryPackage;
  isYearly: boolean;
  savings: number;
  extraUsers: number;
  extraAdmins: number;
  onUpgrade: (pkg: CountryPackage) => void;
  isLoading: boolean;
  isActivePackage: boolean;
}

export const PlanCard = ({
  pkg,
  isYearly,
  savings,
  extraUsers,
  extraAdmins,
  onUpgrade,
  isLoading,
  isActivePackage,
}: PlanCardProps) => {
  const [showAllModules, setShowAllModules] = useState(false);
  const moduleLimit = 8; // Show only 3 modules by default
  const hasMoreModules = pkg.modules.length > moduleLimit;
  const visibleModules = showAllModules
    ? pkg.modules
    : pkg.modules.slice(0, moduleLimit);
  return (
    <div
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
              <Check className="text-green-500 mt-1" size={16} />
              <span>{benefit}</span>
            </div>
          ))}
      </div>

      <div className="flex flex-col gap-1 mb-4">
        {visibleModules.map((module, index) => (
          <div key={index} className="flex items-start gap-2">
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
        onClick={() => onUpgrade(pkg)}
        disabled={isLoading && isActivePackage}
        className="w-full mt-auto"
      >
        <ArrowUpIcon size={16} className="mr-2" />
        {isLoading && isActivePackage ? "Loading..." : "Upgrade"}
      </Button>
    </div>
  );
};
