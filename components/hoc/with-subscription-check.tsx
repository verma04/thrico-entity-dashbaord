"use client";

import React from "react";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Rocket, Lock } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

/**
 * Higher-Order Component to check if a module is enabled in the user's subscription.
 * Shows a nice upgrade message if the module is not enabled.
 *
 * @param WrappedComponent The component to protect
 * @param moduleKey The key of the module to check (e.g., 'jobs', 'forums', 'communities')
 */
export function withSubscriptionCheck<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  moduleKey: string
) {
  return function SubscriptionCheckedComponent(props: P) {
    const { data, loading, error } = useCheckEntitySubscription();

    const isEnabled = React.useMemo(() => {
      if (loading) return null;
      if (!data?.checkEntitySubscription?.modules) return false;

      const modules = data.checkEntitySubscription.modules;
      const normalizedKey = moduleKey.toLowerCase().replace(/'/g, "_");

      return modules.some(
        (m) =>
          m.enabled &&
          m.name?.toLowerCase().replace(/'/g, "_") === normalizedKey
      );
    }, [data, loading]);

    if (loading || isEnabled === null) {
      return (
        <div className="p-8 space-y-4 w-full h-full min-h-[400px]">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      );
    }

    if (isEnabled === false) {
      return (
        <div className="flex items-center justify-center p-8 min-h-[400px] w-full">
          <Card className="max-w-md w-full border-dashed">
            <CardContent className="pt-10 pb-10 flex flex-col items-center text-center space-y-6">
              <div className="p-4 rounded-full bg-amber-50 text-amber-600">
                <Lock className="h-10 w-10" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">
                  Module Locked
                </h2>
                <p className="text-muted-foreground text-sm px-4">
                  The{" "}
                  <span className="font-semibold text-foreground capitalize">
                    {moduleKey}
                  </span>{" "}
                  module is not included in your current subscription plan.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full px-4">
                <Link href="/settings/subscription" className="w-full">
                  <Button
                    className="w-full gap-2 shadow-lg shadow-primary/20"
                    size="lg"
                  >
                    <Rocket className="h-4 w-4" />
                    Upgrade Your Plan
                  </Button>
                </Link>
                <Link href="/" className="w-full">
                  <Button variant="outline" className="w-full" size="lg">
                    Return Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (error) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
