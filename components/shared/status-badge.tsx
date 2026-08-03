import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StatusBadgeProps {
  status?: string | null;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null;

  const normalizedStatus = status.toUpperCase();

  const renderBadgeContent = () => {
    switch (normalizedStatus) {
      case "APPROVED":
        return {
          badge: (
            <Badge
              className={cn(
                "bg-green-100 text-green-700 hover:bg-green-100/80 border-green-200 gap-1",
                className
              )}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Approved
            </Badge>
          ),
          tooltipText: "Approved by admin",
        };
      case "PENDING":
        return {
          badge: (
            <Badge
              className={cn(
                "bg-amber-100 text-amber-700 hover:bg-amber-100/80 border-amber-200 gap-1",
                className
              )}
            >
              <Clock className="w-3.5 h-3.5" />
              Pending
            </Badge>
          ),
          tooltipText: "Pending admin review. Once reviewed, it will be approved.",
        };
      case "REJECTED":
        return {
          badge: (
            <Badge
              className={cn(
                "bg-red-100 text-red-700 hover:bg-red-100/80 border-red-200 gap-1",
                className
              )}
            >
              <XCircle className="w-3.5 h-3.5" />
              Rejected
            </Badge>
          ),
          tooltipText: "Rejected by admin",
        };
      default:
        return {
          badge: (
            <Badge
              variant="secondary"
              className={cn("gap-1 text-muted-foreground", className)}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {status}
            </Badge>
          ),
          tooltipText: `Status: ${status}`,
        };
    }
  };

  const { badge, tooltipText } = renderBadgeContent();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="w-fit">{badge}</div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
