"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { useCheckEntitySubscription } from "@/graphql/actions";
import {
  useUpdateToYearly,
  useUpdateToYearlySummary,
  useVerifyRazorpayPayment,
  useCountry,
} from "@/graphql/actions/plan";
import PaymentLoading from "./loading";

interface PlanOverview {
  package?: {
    monthlyPrice?: number;
    yearlyPrice?: number;
    currency?: string;
    packageId?: string;
  };
}

const YearlyUpgrade = ({
  planOverview,
}: {
  planOverview: PlanOverview;
}) => {
  const [showModal, setShowModal] = useState(false);

  const { refetch, loading: statusLoader } = useCheckEntitySubscription();
  const { data: summaryData, loading: summaryLoading } =
    useUpdateToYearlySummary();
  const { data: countryData } = useCountry();
  const { Razorpay } = useRazorpay();

  const country = countryData?.country;
  const summary = summaryData?.getUpdateToYearlySummary;

  const [verify, { loading: verificationLoader }] = useVerifyRazorpayPayment({
    onCompleted: (data: { verifyRazorpayPayment: boolean }) => {
      if (data?.verifyRazorpayPayment) {
        refetch();
        setShowModal(false);
        window.location.reload();
      } else {
        alert("Payment verification failed. Please try again.");
      }
    },
  });

  const [upgrade, { loading: joinLoading }] = useUpdateToYearly({
    onCompleted: (data: any) => {
      const result = data?.updateToYearly;
      if (!result) return;

      if (result.razorpayOrder) {
        const options: RazorpayOrderOptions = {
          key: "rzp_test_AVIthfNy85rAR2",
          amount: result.razorpayOrder.amount,
          currency: result.razorpayOrder
            .currency as RazorpayOrderOptions["currency"],
          name: "Thrico",
          description: "Switch to Yearly Billing",
          order_id: result.razorpayOrder.id,
          handler: (response) => {
            if (!response.razorpay_payment_id) {
              alert("Payment failed. Please try again.");
              return;
            }
            verify({
              variables: {
                input: {
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                },
              },
            });
          },
          prefill: {
            name: "User",
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#6C47FF",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        // No payment needed (e.g., free upgrade)
        setShowModal(false);
        window.location.reload();
      }
    },
  });

  // Savings calculation
  const monthlyTotal = (planOverview.package?.monthlyPrice ?? 0) * 12;
  const yearlyTotal = planOverview.package?.yearlyPrice ?? 0;
  const savings = monthlyTotal - yearlyTotal;
  const savingsPercent =
    monthlyTotal > 0 ? Math.round((savings / monthlyTotal) * 100) : 0;

  return (
    <>
      {(verificationLoader || statusLoader) && <PaymentLoading />}

      {/* Upgrade Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-2xl bg-card border-border z-50 p-0 overflow-hidden">
          {/* HEADER WITH GRADIENT */}
          <div className="relative px-6 pt-6 pb-4 border-b border-border">
            <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent" />
            <DialogHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>

                <div>
                  <DialogTitle className="text-xl font-semibold">
                    Switch to Yearly Billing
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    Save {savingsPercent}% by switching to annual billing
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
          </div>

          {/* PROCESSING BANNER */}
          {(joinLoading || verificationLoader) && (
            <div className="flex items-center justify-center py-4 bg-secondary/10">
              <Loader2 className="animate-spin h-5 w-5 text-primary" />
              <span className="ml-2 text-muted-foreground">
                Processing upgrade...
              </span>
            </div>
          )}

          {/* TOP SUMMARY BANNER */}
          <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4 mb-0">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                You&apos;re switching from monthly to yearly billing. Review the
                details below before proceeding.
              </p>
            </div>
          </div>

          {/* CONTENT BODY */}
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* LEFT COLUMN — PLAN & SAVINGS */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Billing Change</h4>

                {/* Current vs New */}
                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-border/50 bg-secondary/20">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">
                      Current Plan
                    </p>
                    <p className="font-semibold text-foreground">
                      {summary?.planName || planOverview.package?.packageId}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {country?.currency}{" "}
                      {planOverview.package?.monthlyPrice?.toFixed(2)} / month
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-primary uppercase tracking-wider font-bold mb-1">
                          New Plan
                        </p>
                        <p className="font-semibold text-foreground">
                          {summary?.planName ||
                            planOverview.package?.packageId}{" "}
                          (Yearly)
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {country?.currency}{" "}
                          {planOverview.package?.yearlyPrice?.toFixed(2)} / year
                        </p>
                      </div>
                      {savingsPercent > 0 && (
                        <Badge className="bg-primary text-primary-foreground font-bold">
                          Save {savingsPercent}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN — PAYMENT SUMMARY */}
              <div>
                <h4 className="text-sm font-medium mb-4">Payment Summary</h4>

                <div className="rounded-xl border bg-secondary/30 p-4 space-y-4">
                  {summaryLoading ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="animate-spin h-5 w-5 text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        Loading summary...
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Base Plan (yearly)
                        </span>
                        <span className="font-medium">
                          {country?.currency}{" "}
                          {(summary?.basePrice ?? 0).toFixed(2)}
                        </span>
                      </div>

                      {(summary?.addonsPrice ?? 0) > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Add-ons ({summary?.addons?.length ?? 0})
                          </span>
                          <span className="font-medium">
                            {country?.currency}{" "}
                            {summary?.addonsPrice?.toFixed(2)}
                          </span>
                        </div>
                      )}

                      {/* Individual addons */}
                      {summary?.addons && summary.addons.length > 0 && (
                        <div className="space-y-2 pl-3 border-l-2 border-primary/20">
                          {summary.addons.map((addon) => (
                            <div
                              key={addon.addonId}
                              className="flex justify-between text-xs"
                            >
                              <span className="text-muted-foreground">
                                {addon.name} × {addon.quantity}
                              </span>
                              <span className="font-medium">
                                {country?.currency}{" "}
                                {addon.totalPrice.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="h-px bg-border" />

                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {summary?.taxName || "Tax"} (
                          {summary?.taxPercentage ?? 0}%)
                        </span>
                        <span className="font-medium text-primary">
                          {country?.currency}{" "}
                          {(summary?.taxAmount ?? 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total due today</span>
                        <span className="text-xl font-bold">
                          {country?.currency}{" "}
                          {(summary?.totalAmount ?? 0).toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Billed annually going forward</span>
                      </div>
                    </>
                  )}
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
              <Button
                variant="outline"
                onClick={() => setShowModal(false)}
                disabled={joinLoading}
              >
                Cancel
              </Button>
              <Button
                className="font-bold shadow-lg shadow-primary/20 group"
                disabled={joinLoading || summaryLoading}
                onClick={() => upgrade()}
              >
                {joinLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Switch to Yearly
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inline CTA Button (used from PlanOverview) */}
      <Button
        variant="outline"
        className="border-primary/30 text-primary hover:bg-primary/10 bg-transparent"
        onClick={() => setShowModal(true)}
      >
        Upgrade
      </Button>
    </>
  );
};

export default YearlyUpgrade;
