import { ArrowUpRight } from "lucide-react";

interface UpgradeHeaderProps {
  subscriptionType?: string;
  isHighTier?: boolean;
}

export const UpgradeHeader = ({ subscriptionType, isHighTier }: UpgradeHeaderProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-1">
      <div>
        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
          {isHighTier ? "Maximum Tier" : "Available Plans"}
        </p>
        <h2 className="text-[20px] font-semibold text-foreground tracking-tight leading-tight">
          {isHighTier
            ? "You're on our highest tier"
            : "Choose the right plan for your team"}
        </h2>
        <p className="text-[13px] text-muted-foreground mt-1.5 max-w-lg leading-relaxed">
          {isHighTier
            ? "You've unlocked all features. For custom scale or white-label solutions, contact our enterprise team."
            : subscriptionType === "trail"
            ? "Your 14-day trial includes full access. Upgrade to unlock advanced modules and higher limits."
            : "Explore plans to unlock additional modules, advanced features, and higher limits."}
        </p>
      </div>
      {!isHighTier && (
        <a
          href="#custom"
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Need custom?
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      )}
    </div>
  );
};
