"use client";

import React from "react";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { ModuleLocked } from "@/components/shared/module-locked";

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
      let normalizedKey = moduleKey.toLowerCase().replace(/'/g, "_");

      if (
        normalizedKey === "engagement-games" ||
        normalizedKey === "engagement-activities" ||
        normalizedKey === "gamification" ||
        normalizedKey === "currency"
      ) {
        normalizedKey = "rewards";
      }

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
      return <ModuleLocked moduleKey={moduleKey} />;
    }

    if (error) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}
