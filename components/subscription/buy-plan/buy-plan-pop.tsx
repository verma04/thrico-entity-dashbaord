"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  Calendar,
  CreditCard,
  Loader2,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

import moment from "moment";

import { useRazorpay } from "react-razorpay";

import { useCheckEntitySubscription } from "@/graphql/actions";
import {
  useUpdateTrialToPackage,
  useVerifyRazorpayPayment,
} from "@/graphql/actions/plan";

interface BuyPlanPopUpProps {
  visible: boolean;
  onClose: () => void;
  activePackage: {
    name: string;
    currency: string;
    monthlyPrice: number;
    yearlyPrice: number;
    packageId: string;
    [key: string]: any;
  };
}

export default function BuyPlanPopUp({
  visible,
  onClose,
  activePackage,
}: BuyPlanPopUpProps) {
  enum BillingCycle {
    Monthly = "monthly",
    Yearly = "yearly",
  }

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(
    BillingCycle.Monthly
  );

  const currentDate = moment();

  const { Razorpay } = useRazorpay();
  const { refetch, loading: statusLoader } = useCheckEntitySubscription();

  const [verify, { loading: verificationLoader }] = useVerifyRazorpayPayment({
    onCompleted: (data) => {
      if (data?.verifyRazorpayPayment) {
        refetch();
        onClose();
      } else alert("Payment verification failed.");
    },
  });

  const [upgrade, { loading: joinLoading }] = useUpdateTrialToPackage({
    onCompleted: (data) => {
      const order = data?.updateTrialToPackage;
      if (!order) return;

      const options = {
        key: "rzp_test_AVIthfNy85rAR2",
        amount: order.amount,
        currency: order.currency,
        name: "Test Company",
        description: "Plan Purchase",
        order_id: order.id,
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
          name: "John Doe",
          email: "john.doe@example.com",
          contact: "9999999999",
        },
        theme: { color: "#6C47FF" },
      };

      new Razorpay(options).open();
    },
  });

  // --- Savings Calculation ---
  const yearlySavings =
    activePackage?.monthlyPrice && activePackage?.yearlyPrice
      ? activePackage.currency +
        (activePackage.monthlyPrice * 12 - activePackage.yearlyPrice)
      : null;

  return (
    <Dialog open={visible} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border p-0 overflow-hidden">
        {/* HEADER WITH GRADIENT */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Zap className="h-5 w-5 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold">
                  Buy {activePackage?.name} Plan
                </DialogTitle>
                <p className="text-sm text-muted-foreground">
                  Choose billing cycle & complete purchase
                </p>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* PROCESSING BANNER */}
        {(verificationLoader || statusLoader) && (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="animate-spin h-5 w-5 text-primary" />
            <span className="ml-2 text-muted-foreground">
              Processing payment...
            </span>
          </div>
        )}

        {/* TOP SUMMARY */}
        <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4 mb-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              Review your plan details before proceeding with payment.
            </p>
          </div>
        </div>

        {/* CONTENT BODY */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT COLUMN — BILLING CYCLE */}
            <div>
              <h4 className="text-sm font-medium mb-4">Select Billing Cycle</h4>

              <RadioGroup
                value={billingCycle}
                onValueChange={(v) => setBillingCycle(v)}
                className="space-y-3"
              >
                {/* MONTHLY OPTION */}
                <label
                  className={`flex justify-between cursor-pointer rounded-xl border p-4 transition-all ${
                    billingCycle === BillingCycle.Monthly
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
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
                      {activePackage?.monthlyPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">per month</p>
                  </div>
                </label>

                {/* YEARLY OPTION */}
                <label
                  className={`relative flex justify-between cursor-pointer rounded-xl border p-4 transition-all ${
                    billingCycle === BillingCycle.Yearly
                      ? "border-primary bg-primary/5 ring-1 ring-primary"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  {yearlySavings && (
                    <Badge className="absolute -top-2 right-4 bg-primary text-primary-foreground">
                      Save {yearlySavings}
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
                      {activePackage?.yearlyPrice}
                    </p>
                    <p className="text-xs text-muted-foreground">per year</p>
                  </div>
                </label>
              </RadioGroup>
            </div>

            {/* RIGHT COLUMN — PAYMENT SUMMARY */}
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
                      ? activePackage?.monthlyPrice
                      : activePackage?.yearlyPrice}
                  </span>
                </div>

                <div className="h-px bg-border" />

                <div className="flex justify-between items-center">
                  <span className="font-medium">Total due today</span>
                  <span className="text-xl font-bold">
                    {activePackage?.currency}
                    {billingCycle === "monthly"
                      ? activePackage?.monthlyPrice
                      : activePackage?.yearlyPrice}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>
                    Next billing:{" "}
                    {moment(
                      billingCycle === "monthly"
                        ? currentDate.clone().add(1, "month")
                        : currentDate.clone().add(1, "year")
                    ).format("MMM Do YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="flex justify-between items-center px-6 py-4 bg-secondary/20 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Zap className="h-4 w-4 text-primary" />
            Effective immediately
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              disabled={joinLoading}
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
            >
              {joinLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
