"use client";

import { CurrencyDashboard } from "@/components/settings/currency/currency-dashboard";
import { Button } from "@/components/ui/button";
import { useReSeedDefaultCurrency } from "@/graphql/actions";
import { toast } from "sonner";
import { RotateCcw, LayoutDashboard } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CurrencySettingsPage() {
  const [reSeed, { loading: resetting }] = useReSeedDefaultCurrency({
    onCompleted: () => toast.success("Currency settings reset to defaults"),
    onError: (err: any) => toast.error(err.message),
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <LayoutDashboard className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Currency Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Real-time insights into your entity's local economy.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-red-600"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Config
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will reset all currency configurations, caps, and
                  redemption rules to platform defaults.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => reSeed()}
                  disabled={resetting}
                >
                  {resetting ? "Resetting..." : "Reset Everything"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <CurrencyDashboard />
    </div>
  );
}
