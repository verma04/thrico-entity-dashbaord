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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Plus,
  Minus,
  ShoppingCart,
  CheckCircle2,
  Zap,
  CreditCard,
  ArrowRight,
  HelpCircle,
  Calculator,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddonPricing } from "./ts-types";
import {
  useAddAddon,
  useVerifyRazorpayPayment,
  useCountry,
} from "@/graphql/actions/plan";
import { useGetUser } from "@/graphql/actions";
import { RazorpayOrderOptions, useRazorpay } from "react-razorpay";
import { toast } from "sonner";

interface AddonPurchaseModalProps {
  addon: AddonPricing | null;
  currency: string;
  billingCycle: string;
  onClose: () => void;
}

const AddonPurchaseModal = ({
  addon,
  currency,
  billingCycle,
  onClose,
}: AddonPurchaseModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { Razorpay } = useRazorpay();
  const { data: countryData } = useCountry();
  const { data: userData } = useGetUser();
  const user = userData?.getUser;

  const country = countryData?.country;
  const taxPercentage = country?.taxPercentage || 0;
  const taxName = country?.taxName || "Tax";
  const taxIncluded = country?.taxIncluded || false;

  const [verify] = useVerifyRazorpayPayment({
    onCompleted: (data: { verifyRazorpayPayment: boolean }) => {
      if (data?.verifyRazorpayPayment) {
        toast.success("Add-on purchased successfully!");
        onClose();
        window.location.reload();
      } else {
        toast.error("Payment verification failed.");
      }
    },
  });

  const [addAddon, { loading }] = useAddAddon({
    onCompleted: (data: any) => {
      const response = data?.addAddon;
      console.log(response);
      if (!response?.success) {
        toast.error(response?.message || "Failed to initiate purchase");
        return;
      }

      if (response.razorpayOrder) {
        const options: RazorpayOrderOptions = {
          key: "rzp_live_SiqzWXdijA6k6U",
          amount: response.razorpayOrder.amount,
          currency: response.razorpayOrder.currency,
          name: "Thrico",
          description: `Purchase ${addon?.name}`,
          order_id: response.razorpayOrder.id,
          handler: (res) => {
            verify({
              variables: {
                input: {
                  razorpayPaymentId: res.razorpay_payment_id,
                  razorpayOrderId: res.razorpay_order_id,
                  razorpaySignature: res.razorpay_signature,
                },
              },
            });
          },
          prefill: {
            name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "User",
            email: user?.email ?? "",
            contact: user?.profile?.phone?.phoneNumber ?? "",
          },
          theme: {
            color: "#6C47FF",
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } else {
        toast.success("Add-on added successfully!");
        onClose();
        // window.location.reload();
      }
    },
  });

  if (!addon) return null;

  const unitPrice =
    billingCycle === "yearly" ? addon.yearlyUnitPrice : addon.monthlyUnitPrice;
  const subtotal = unitPrice * quantity;

  // Tax calculation logic
  let taxAmount = 0;
  let finalTotal = subtotal;

  if (taxIncluded) {
    // If tax is included, subtotal is the final total, we derive tax from it
    taxAmount = subtotal - subtotal / (1 + taxPercentage / 100);
    finalTotal = subtotal;
  } else {
    // If tax is excluded, we add tax on top of subtotal
    taxAmount = subtotal * (taxPercentage / 100);
    finalTotal = subtotal + taxAmount;
  }

  return (
    <Dialog open={!!addon} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border z-50 p-0 overflow-hidden">
        {/* HEADER WITH GRADIENT */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold">
                  Add {addon.name}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Choose quantity & complete purchase
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* PROCESSING BANNER */}
        {loading && (
          <div className="flex items-center justify-center py-4 bg-secondary/10">
            <Loader2 className="animate-spin h-5 w-5 text-primary" />
            <span className="ml-2 text-muted-foreground">
              Processing purchase...
            </span>
          </div>
        )}

        {/* TOP SUMMARY BANNER */}
        <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4 mb-0">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              Review your add-on details before proceeding with payment.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Quantity Controls */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT COLUMN — QUANTITY & DESCRIPTION */}
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Add-on Details</h4>
                <div className="p-4 rounded-xl bg-secondary/20 border border-border/50">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {addon.description}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">Select Quantity</label>
                <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 border border-border/50">
                  <span className="text-sm font-medium text-foreground">
                    {addon.unitLabel} to add
                  </span>
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-border/50 hover:bg-background"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-bold text-xl">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 rounded-xl border-border/50 hover:bg-background"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN — PAYMENT SUMMARY */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Payment Summary</h4>
              <div className="rounded-xl border bg-secondary/30 p-4 space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    Total Units
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help hover:text-primary transition-colors" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-72 p-4 space-y-3 bg-popover border-border shadow-2xl">
                          <div className="space-y-1">
                            <p className="font-bold text-sm flex items-center gap-1.5">
                              <Calculator className="w-4 h-4 text-primary" />
                              How we bill add-ons
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Add-ons are linked to your main subscription.
                            </p>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-2">
                              <span className="font-bold uppercase tracking-tighter text-foreground">
                                Mid-Cycle Purchase
                              </span>
                              <span className="text-muted-foreground">
                                Prorated charge based on remaining days.
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-2">
                              <span className="font-bold uppercase tracking-tighter text-foreground">
                                Renewal
                              </span>
                              <span className="text-muted-foreground">
                                Consolidated with your base plan invoice.
                              </span>
                            </div>
                            <div className="flex flex-col gap-0.5 border-l-2 border-primary/30 pl-2">
                              <span className="font-bold uppercase tracking-tighter text-foreground">
                                Cancellation
                              </span>
                              <span className="text-muted-foreground">
                                Active until current cycle ends; no refunds.
                              </span>
                            </div>
                          </div>

                          <p className="text-[10px] pt-1 border-t italic text-muted-foreground/80">
                            * {taxName} of {taxPercentage}% is applied as per{" "}
                            {country?.name || "local"} regulations.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                  <span className="font-bold">
                    {quantity * addon?.unitLabel} {addon?.type}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    Unit Rate ({billingCycle})
                  </span>
                  <span className="font-bold text-xs">
                    {currency} {unitPrice} / {addon.unitLabel || "unit"}
                  </span>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">
                    {currency}{" "}
                    {(taxIncluded ? subtotal - taxAmount : subtotal).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">
                    {taxName} ({taxPercentage}%{taxIncluded ? " Included" : ""})
                  </span>
                  <span className="font-bold text-primary">
                    {currency} {taxAmount.toFixed(2)}
                  </span>
                </div>

                <div className="h-px bg-border/50" />

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest mb-1">
                      Total due today
                    </p>
                    <p className="text-2xl font-black text-foreground">
                      {currency} {finalTotal.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary font-bold capitalize"
                    >
                      {addon.type} Add-on
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3 text-xs text-muted-foreground bg-secondary/30 p-3 rounded-xl">
            <CreditCard className="w-4 h-4 shrink-0 mt-0.5" />
            <p>
              Your card will be charged immediately. This add-on will be
              integrated into your next billing cycle.
            </p>
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
              className="font-bold"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              className="font-bold shadow-lg shadow-primary/20 group"
              onClick={() =>
                addAddon({
                  variables: {
                    input: { addonPricingId: addon.addonPricingId, quantity },
                  },
                })
              }
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Confirm & Pay
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddonPurchaseModal;
