"use client";

import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

// If you have a Typography/Text component, otherwise use <span>
import {
  AlertCircle,
  Clock,
  Ban,
  ArrowRight,
  Star,
  Zap,
  Rocket,
} from "lucide-react";
import BuyPlan from "./buy-plan/buy-plan";

export default function NoSubscription() {
  const [status, setStatus] = useState<"cancelled" | "suspended" | "pending">(
    "pending"
  );

  const statusConfig = {
    cancelled: {
      variant: "destructive" as const,
      icon: <Ban className="text-red-500" size={24} />,
      message: "Subscription Cancelled",
      description:
        "Your subscription has been cancelled. Reactivate to continue using premium features.",
      action: "Reactivate Now",
    },
    suspended: {
      variant: "default" as const,
      icon: <AlertCircle className="text-yellow-500" size={24} />,
      message: "Account Suspended",
      description:
        "Your account is temporarily suspended. Please resolve payment issues to continue.",
      action: "Update Payment",
    },
    pending: {
      variant: "default" as const,
      icon: <Clock className="text-blue-500" size={24} />,
      message: "Subscription Pending",
      description:
        "Your subscription is being processed. You currently have limited access.",
      action: "Complete Setup",
    },
  };

  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      description: "Perfect for individuals getting started",
      icon: <Star className="text-blue-500" size={24} />,
      features: [
        "5 Projects",
        "Basic Analytics",
        "Email Support",
        "1GB Storage",
        "Basic Templates",
      ],
      buttonText: "Choose Starter",
      popular: false,
      color: "text-blue-500",
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "Best for growing businesses",
      icon: <Zap className="text-green-500" size={24} />,
      features: [
        "Unlimited Projects",
        "Advanced Analytics",
        "Priority Support",
        "10GB Storage",
        "Premium Templates",
        "Team Collaboration",
        "API Access",
      ],
      buttonText: "Choose Professional",
      popular: true,
      color: "text-green-500",
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "/month",
      description: "For large organizations",
      icon: <Rocket className="text-purple-600" size={24} />,
      features: [
        "Everything in Professional",
        "Custom Integrations",
        "Dedicated Support",
        "Unlimited Storage",
        "White-label Solution",
        "Advanced Security",
        "SLA Guarantee",
      ],
      buttonText: "Contact Sales",
      popular: false,
      color: "text-purple-600",
    },
  ];

  const currentConfig = statusConfig[status];

  return (
    <div className="bg-muted min-h-screen">
      {/* Banner */}
      <div className="py-6 bg-background border-b border-muted">
        <div className="max-w-5xl mx-auto">
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
            <Button
              variant="default"
              size="sm"
              className="ml-4 flex items-center gap-2"
            >
              <ArrowRight size={16} />
              {currentConfig.action}
            </Button>
          </Alert>
        </div>
      </div>
      <BuyPlan />
    </div>
  );
}
