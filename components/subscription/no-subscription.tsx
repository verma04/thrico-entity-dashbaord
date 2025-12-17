"use client";

import { Alert } from "@/components/ui/alert";
import { useGetEntity } from "@/graphql/actions";


import {
  AlertCircle,
  Clock,
  Ban,
  Star,
  Zap,
  Rocket,
  Sparkles,
} from "lucide-react";
import BuyPlan from "./buy-plan/buy-plan";

export default function NoSubscription() {
  const { data, loading } = useGetEntity();
  
  // Get subscription status from entity data
  const subscription = data?.getEntity?.subscription;
  const status = subscription?.status || "pending";

  // Determine the display status
  const displayStatus = 
    !subscription ? "no_subscription" :
    status === "cancelled" ? "cancelled" :
    status === "suspended" ? "suspended" :
    status === "active" ? "active" :
    status === "scheduled_downgrade" ? "scheduled_downgrade" :
    status === "scheduled_upgrade" ? "scheduled_upgrade" :
    "pending";

  const statusConfig = {
    no_subscription: {
      variant: "default" as const,
      icon: <Sparkles className="text-blue-600 dark:text-blue-400" size={24} />,
      message: "No Active Subscription",
      description:
        "You don't have an active subscription yet. Choose a plan below to unlock all premium features and grow your community.",
      action: "View Plans",
    },
    cancelled: {
      variant: "destructive" as const,
      icon: <Ban className="text-red-500 dark:text-red-400" size={24} />,
      message: "Subscription Cancelled",
      description:
        "Your subscription has been cancelled. Reactivate to continue using premium features and maintain your community engagement.",
      action: "Reactivate Now",
    },
    suspended: {
      variant: "default" as const,
      icon: <AlertCircle className="text-yellow-500 dark:text-yellow-400" size={24} />,
      message: "Account Suspended",
      description:
        "Your account is temporarily suspended. Please resolve payment issues to continue accessing your dashboard.",
      action: "Update Payment",
    },
    pending: {
      variant: "default" as const,
      icon: <Clock className="text-blue-500 dark:text-blue-400" size={24} />,
      message: "Subscription Pending",
      description:
        "Your subscription is being processed. You currently have limited access. This usually takes a few minutes.",
      action: "Complete Setup",
    },
    active: {
      variant: "default" as const,
      icon: <Sparkles className="text-green-500 dark:text-green-400" size={24} />,
      message: "Subscription Active",
      description:
        `Your ${subscription?.planName || 'subscription'} plan is active. Enjoy all premium features!`,
      action: "Manage Subscription",
    },
    scheduled_downgrade: {
      variant: "default" as const,
      icon: <AlertCircle className="text-orange-500 dark:text-orange-400" size={24} />,
      message: "Downgrade Scheduled",
      description:
        `Your plan will be downgraded on ${subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'the next billing cycle'}. You can cancel this change anytime.`,
      action: "Cancel Downgrade",
    },
    scheduled_upgrade: {
      variant: "default" as const,
      icon: <Rocket className="text-purple-600 dark:text-purple-400" size={24} />,
      message: "Upgrade Scheduled",
      description:
        `Your plan will be upgraded on ${subscription?.endDate ? new Date(subscription.endDate).toLocaleDateString() : 'the next billing cycle'}. Get ready for more features!`,
      action: "View Upgrade Details",
    },
  };

  const currentConfig = statusConfig[displayStatus as keyof typeof statusConfig];

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        
        {/* Modal Content */}
        <div className="relative z-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-lg shadow-lg mx-4">

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b">
            <h2 className="text-2xl font-semibold">Subscription Status</h2>
            <p className="text-sm text-muted-foreground mt-1">Loading your subscription information...</p>
          </div>

          {/* Loading Content */}
          <div className="p-6">
            <div className="rounded-lg border-2 px-6 py-4 flex items-center gap-4 animate-pulse">
              <div className="w-6 h-6 bg-muted rounded-full" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-1/4" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
      
      {/* Modal Content */}
      <div className="relative z-50 w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-lg shadow-lg mx-4">

        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b">
          <h2 className="text-2xl font-semibold">Subscription Management</h2>
          <p className="text-sm text-muted-foreground mt-1">{currentConfig.message}</p>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Alert */}
          <Alert
            variant={currentConfig.variant}
            className="rounded-lg border-2 px-6 py-4 flex items-center gap-4"
          >
            {currentConfig.icon}
            <div className="flex-1">
              <span className="font-semibold text-base">
                {currentConfig.message}
              </span>
              <div className="mt-1 text-muted-foreground text-sm">
                {currentConfig.description}
              </div>
            </div>
          </Alert>

          {/* Plans */}
          <BuyPlan displayStatus={displayStatus} />
        </div>
      </div>
    </div>
  );
}
