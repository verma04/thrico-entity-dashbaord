import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: React.ReactNode;
  color?: "green" | "amber" | "blue" | "pink" | "purple" | "default";
  className?: string;
}

const colorStyles = {
  default: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    icon: "text-foreground",
    value: "text-foreground",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/50",
    text: "text-green-600 dark:text-green-400",
    icon: "text-green-600 dark:text-green-400",
    value: "text-green-600 dark:text-green-400",
  },
  amber: {
    bg: "bg-amber-50 dark:bg-amber-950/50",
    text: "text-amber-600 dark:text-amber-400",
    icon: "text-amber-600 dark:text-amber-400",
    value: "text-amber-600 dark:text-amber-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/50",
    text: "text-blue-600 dark:text-blue-400",
    icon: "text-blue-600 dark:text-blue-400",
    value: "text-blue-600 dark:text-blue-400",
  },
  pink: {
    bg: "bg-pink-50 dark:bg-pink-950/50",
    text: "text-pink-600 dark:text-pink-400",
    icon: "text-pink-600 dark:text-pink-400",
    value: "text-pink-600 dark:text-pink-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-950/50",
    text: "text-purple-600 dark:text-purple-400",
    icon: "text-purple-600 dark:text-purple-400",
    value: "text-purple-600 dark:text-purple-400",
  },
};

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  color = "default",
  className,
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("rounded-full p-2", styles.bg)}>
          <Icon className={cn("h-4 w-4", styles.icon)} />
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className={cn("text-2xl font-bold", styles.value)}>{value}</div>
        {description && (
          <div className={cn("flex items-center text-xs mt-1", styles.text)}>
            {description}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
