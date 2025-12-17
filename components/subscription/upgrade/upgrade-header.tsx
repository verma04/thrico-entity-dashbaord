import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface UpgradeHeaderProps {
  subscriptionType?: string;
}

export const UpgradeHeader = ({ subscriptionType }: UpgradeHeaderProps) => {
  return (
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

      {subscriptionType === "trail" && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Your trial includes 14 days of full access. Upgrade to unlock advanced
          modules, exclusive features, and higher limits tailored for your team.
          Each plan offers unique benefits to help your organization grow.
        </p>
      )}

      {subscriptionType === "paid" && (
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
          Explore our plans to unlock additional modules, advanced features, and
          higher limits. Upgrade to get even more value and flexibility for your
          growing organization.
        </p>
      )}
    </div>
  );
};
