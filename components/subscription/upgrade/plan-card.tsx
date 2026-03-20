import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CountryPackage } from "../ts-types";
import { formatPrice, renderModuleIcon } from "../utils";
import {
  ArrowUpRight,
  ShieldAlert,
  TabletSmartphone,
  Users2,
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
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
  const moduleLimit = 6;
  const hasMoreModules = pkg.modules.length > moduleLimit;
  const visibleModules = showAllModules ? pkg.modules : pkg.modules.slice(0, moduleLimit);

  const isPopular = pkg.isPopular;

  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md",
        isPopular ? "border-slate-900 ring-1 ring-slate-900/10" : "border-slate-200/80"
      )}
    >
      {/* Popular ribbon */}
      {isPopular && (
        <div className="bg-slate-900 px-5 py-1.5 flex items-center gap-2">
          <span className="text-[10px] font-semibold text-white uppercase tracking-widest">
            Most Popular
          </span>
        </div>
      )}

      {/* Header */}
      <div className={cn("px-5 pt-5 pb-4", isPopular && "border-b border-slate-100")}>
        <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">{pkg.name}</h3>
        <div className="flex items-baseline gap-1.5 mt-3">
          <span className="text-[28px] font-bold text-slate-900 leading-none tabular-nums tracking-tight">
            {formatPrice(pkg.monthlyPrice, pkg.yearlyPrice, isYearly, pkg.currency)}
          </span>
          <span className="text-[12px] text-slate-400">
            / {isYearly ? "yr" : "mo"}
          </span>
        </div>
        {isYearly && savings > 0 && (
          <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md">
            Save {savings}% vs monthly
          </span>
        )}
      </div>

      {/* Specs */}
      <div className="px-5 py-3 border-b border-slate-100 space-y-2">
        <div className="flex items-center gap-2 text-[12px] text-slate-600">
          <TabletSmartphone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {pkg.accessType === "WebOnly" ? "Web Only" : "Web + Mobile"}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-600">
          <Users2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {pkg.numberOfUsers} members
          {extraUsers > 0 && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
              +{extraUsers} more
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-[12px] text-slate-600">
          <ShieldAlert className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          {pkg.adminUsers} admin{pkg.adminUsers > 1 ? "s" : ""}
          {extraAdmins > 0 && (
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">
              +{extraAdmins} more
            </span>
          )}
        </div>
      </div>

      {/* Benefits */}
      {pkg.benefits.filter((b) => b.trim()).length > 0 && (
        <div className="px-5 py-3 border-b border-slate-100 space-y-2">
          {pkg.benefits
            .filter((b) => b.trim())
            .map((benefit, i) => (
              <div key={i} className="flex items-start gap-2 text-[12px] text-slate-700">
                <Check className="h-3.5 w-3.5 text-emerald-500 mt-0.5 shrink-0" />
                {benefit}
              </div>
            ))}
        </div>
      )}

      {/* Modules */}
      <div className="px-5 py-3 flex-1 space-y-2">
        <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
          Modules
        </p>
        {visibleModules.map((module, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px] text-slate-600">
            {renderModuleIcon(module.icon)}
            {module.name}
          </div>
        ))}
        {hasMoreModules && (
          <button
            onClick={() => setShowAllModules(!showAllModules)}
            className="flex items-center gap-1 text-[12px] text-slate-400 hover:text-slate-700 transition-colors mt-1"
          >
            {showAllModules ? (
              <>
                <ChevronUp className="h-3.5 w-3.5" /> Show less
              </>
            ) : (
              <>
                <ChevronDown className="h-3.5 w-3.5" /> {pkg.modules.length - moduleLimit} more
              </>
            )}
          </button>
        )}
      </div>

      {/* CTA */}
      <div className="px-5 pb-5 pt-3">
        <Button
          onClick={() => onUpgrade(pkg)}
          disabled={isLoading && isActivePackage}
          className={cn(
            "w-full h-9 text-[12px] font-semibold gap-2",
            isPopular
              ? "bg-slate-900 hover:bg-black text-white"
              : "bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 shadow-sm"
          )}
          variant="ghost"
        >
          {isLoading && isActivePackage ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Upgrade to {pkg.name}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
