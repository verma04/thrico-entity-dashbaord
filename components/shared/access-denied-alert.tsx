import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccessDeniedAlertProps {
  message?: string;
  className?: string;
}

export function AccessDeniedAlert({ 
  message = "You do not have permission to view this resource.",
  className 
}: AccessDeniedAlertProps) {
  return (
    <Alert 
      variant="destructive" 
      className={cn(
        "bg-red-50 dark:bg-red-950/20 border-red-200/60 dark:border-red-900/50 text-red-800 dark:text-red-300",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4 !text-red-600 dark:!text-red-400" />
      <AlertTitle className="text-sm font-semibold">Access Denied</AlertTitle>
      <AlertDescription className="text-xs mt-1.5 opacity-90">
        {message}
      </AlertDescription>
    </Alert>
  );
}
