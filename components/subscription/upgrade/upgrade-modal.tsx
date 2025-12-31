"use client";

import React, { useState } from "react";
import {
  Calendar,
  Info,
  CreditCard,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import moment from "moment";

import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import {
  useUpgradePlan,
  useVerifyRazorpayPayment,
} from "@/graphql/actions/plan";
import { useCheckEntitySubscription } from "@/graphql/actions";
import { useRouter } from "next/navigation";

enum BillingCycle {
  Monthly = "monthly",
  Yearly = "yearly",
}

function getYearlySavings(monthlyPrice: number, yearlyPrice: number): number {
  if (!monthlyPrice || !yearlyPrice) return 0;
  const totalMonthly = monthlyPrice * 12;
  const savings = totalMonthly - yearlyPrice;
  return Math.round((savings / totalMonthly) * 100);
}

type UpgradeModalProps = {
  visible: boolean;
  onClose: () => void;
  summary: {
    monthlyPrice?: number | string;
    yearlyPrice?: number | string;
    creditAppliedMonthly?: number | string;
    creditAppliedYearly?: number | string;
    finalMonthlyPrice?: number | string;
    finalYearlyPrice?: number | string;
    monthlyBillingDate?: string | Date;
    yearlyNextBillingDate?: string | Date;
    upgradeSummaryText?: string;
  };
  activePackage: {
    name?: string;
    currency?: string;
    packageId?: string | number;
  };
};

export default function UpgradeModal({
  visible,
  onClose,
  summary,
  activePackage,
}: UpgradeModalProps) {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    BillingCycle.Monthly
  );

  const savings = getYearlySavings(
    Number(summary?.monthlyPrice ?? 0),
    Number(summary?.yearlyPrice ?? 0)
  );

  const handleBillingChange = (value: BillingCycle) => {
    setBillingCycle(value);
  };

  // GraphQL hooks
  const { Razorpay } = useRazorpay();
  const { refetch } = useCheckEntitySubscription();

  const [verify] = useVerifyRazorpayPayment({
    onCompleted: (data: { verifyRazorpayPayment: boolean }) => {
      if (data?.verifyRazorpayPayment) {
        router.push("/?firstLogin=true&intensity=high");
        window.location.reload();
      } else {
        alert("Payment verification failed.");
      }
    },
  });

  const [upgrade, { loading: joinLoading }] = useUpgradePlan({
    onCompleted: (data: { upgradePlan: any }) => {
      if (!data?.upgradePlan) return;

      const options: RazorpayOrderOptions = {
        key: "rzp_test_AVIthfNy85rAR2",
        amount: data.upgradePlan.amount,
        currency: data.upgradePlan.currency,
        name: "Test Company",
        description: "Subscription Upgrade",
        order_id: data.upgradePlan.id,
        handler: (response) => {
          verify({
            variables: {
              input: {
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
            },
          });

          onClose();
        },
        prefill: {
          name: "Test User",
          email: "test@gmail.com",
          contact: "9999999999",
        },
        theme: {
          color: "#6C47FF",
        },
      };

      const rzp = new Razorpay(options);
      rzp.open();
    },
  });

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold text-foreground">
                  Upgrade to {activePackage?.name}
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Choose billing cycle & complete upgrade
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* SUMMARY BANNER */}
        <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />

            <p className="text-sm text-foreground leading-relaxed">
              {summary?.upgradeSummaryText ||
                "Your upgrade is ready to process"}
            </p>
          </div>
        </div>

        {/* MAIN BODY */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* BILLING CYCLE */}
            <div>
              <h4 className="text-sm font-medium mb-4">Select Billing Cycle</h4>

              <RadioGroup
                value={billingCycle}
                onValueChange={handleBillingChange}
                className="space-y-3"
              >
                {/* MONTHLY */}
                <label
                  className={cn(
                    "flex justify-between cursor-pointer rounded-xl border p-4 transition-all",
                    billingCycle === BillingCycle.Monthly
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="monthly" />
                    <div>
                      <p className="font-semibold">Monthly</p>
                      <p className="text-xs text-muted-foreground">
                        Flexible billing
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {activePackage?.currency}
                      {summary?.monthlyPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </label>

                {/* YEARLY */}
                <label
                  className={cn(
                    "relative flex justify-between cursor-pointer rounded-xl border p-4 transition-all",
                    billingCycle === BillingCycle.Yearly
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  {savings > 0 && (
                    <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
                      Save {savings}%
                    </Badge>
                  )}

                  <div className="flex items-center gap-3">
                    <RadioGroupItem value="yearly" />
                    <div>
                      <p className="font-semibold">Yearly</p>
                      <p className="text-xs text-muted-foreground">
                        Best value
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {activePackage?.currency}
                      {summary?.yearlyPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">per year</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* PAYMENT SUMMARY */}
            <div>
              <h4 className="text-sm font-medium mb-4">Payment Summary</h4>

              <div className="rounded-xl border bg-secondary/30 p-4 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {activePackage?.name} ({billingCycle})
                  </span>
                  <span className="font-medium">
                    {activePackage?.currency}
                    {billingCycle === "monthly"
                      ? summary?.monthlyPrice
                      : summary?.yearlyPrice}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    Credit applied
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          Prorated credit from your current plan
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <span className="text-primary font-medium">
                    -{activePackage?.currency}
                    {billingCycle === "monthly"
                      ? summary?.creditAppliedMonthly
                      : summary?.creditAppliedYearly}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total due today</span>
                  <span className="text-xl font-bold">
                    {activePackage?.currency}
                    {billingCycle === "monthly"
                      ? summary?.finalMonthlyPrice
                      : summary?.finalYearlyPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Next billing:{" "}
                    {moment(
                      billingCycle === "monthly"
                        ? summary?.monthlyBillingDate
                        : summary?.yearlyNextBillingDate
                    ).format("MMM Do YYYY")}{" "}
                    for {activePackage?.currency}
                    {billingCycle === "monthly"
                      ? summary?.monthlyPrice
                      : summary?.yearlyPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between border-t px-6 py-4 bg-secondary/20">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Effective immediately
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              onClick={() =>
                upgrade({
                  variables: {
                    input: {
                      packageId: activePackage?.packageId,
                      billingCycle,
                    },
                  },
                })
              }
              disabled={joinLoading}
            >
              {joinLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 mr-2" />
                  Upgrade Now
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
