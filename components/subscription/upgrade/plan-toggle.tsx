import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";

interface PlanToggleProps {
  isYearly: boolean;
  onToggle: (yearly: boolean) => void;
  maxSavings: number;
}

export const PlanToggle = ({
  isYearly,
  onToggle,
  maxSavings,
}: PlanToggleProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
      <div>
        <span className="font-semibold mr-2">Monthly</span>
        <Switch
          checked={isYearly}
          onCheckedChange={onToggle}
          className="align-middle"
        />
        <span className="font-semibold ml-2">Yearly</span>
        <Badge variant="outline" className="ml-4">
          Save up to {maxSavings}% on yearly plans
          {isYearly ? " (compared to monthly)" : ""}
        </Badge>
      </div>
    </div>
  );
};
