"use client";

import React, { useState } from "react";
import {
  Plus,
  Mail,
  Loader2,
  CheckCircle2,
  Zap,
  ArrowRight,
  CreditCard,
  Shield,
  HelpCircle,
  Calculator,
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  useGetEmailTopups,
  useBuyEmailTopup,
  useVerifyEmailTopupPayment,
  type EmailOverview,
  type EmailTopupProduct,
  type BuyTopupResponse,
} from "@/graphql/actions/email";

const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function UsageTopupModal({
  onClose,
  usage,
}: {
  onClose: () => void;
  usage: EmailOverview["usage"];
}) {
  const { data: topupData, loading: packsLoading } = useGetEmailTopups();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [step, setStep] = useState<"selection" | "checkout">("selection");
  const [orderData, setOrderData] = useState<BuyTopupResponse | null>(null);
  const [buyTopup, { loading: isInitiating }] = useBuyEmailTopup({});
  const [verifyPayment] = useVerifyEmailTopupPayment({});

  const handleAction = async () => {
    if (!selectedPack) {
      toast.error("Please select a top-up pack");
      return;
    }

    if (step === "selection") {
      try {
        const { data } = await buyTopup({
          variables: { input: { topupId: selectedPack } },
        });

        if (data?.buyEmailTopup) {
          setOrderData(data.buyEmailTopup);
          setStep("checkout");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to initiate purchase");
      }
      return;
    }

    if (!orderData) return;

    try {
      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_live_SiqzWXdijA6k6U",
        amount: orderData.totalAmount,
        currency: orderData.currency,
        name: "Thrico",
        description: `Credits Top-up: ${selectedPack}`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          try {
            const { data: verifyData } = await verifyPayment({
              variables: {
                input: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  topupId: selectedPack,
                },
              },
            });

            if (verifyData?.verifyEmailTopupPayment.success) {
              toast.success("Credits added successfully!");
              onClose();
            } else {
              toast.error(
                verifyData?.verifyEmailTopupPayment.message ||
                  "Verification failed",
              );
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        theme: { color: "#000000" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
    }
  };

  const packs = [...(topupData?.getEmailTopups || [])].sort(
    (a, b) => a.numberOfEmails - b.numberOfEmails,
  );
  const selectedPackDetails = packs.find((p) => p.topupId === selectedPack);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-border p-0 overflow-hidden bg-background">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50 bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background border border-border">
              <Plus className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <DialogTitle className="text-lg font-semibold">
                {step === "selection"
                  ? "Add Email Credits"
                  : "Confirm Purchase"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {step === "selection"
                  ? "Choose a credit pack to boost your monthly quota."
                  : "Review your order summary before payment."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6">
          {step === "selection" ? (
            <div className="space-y-4">
              <div className="grid gap-2">
                {packsLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  packs.map((pack: EmailTopupProduct) => (
                    <button
                      key={pack.topupId}
                      onClick={() => setSelectedPack(pack.topupId)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
                        selectedPack === pack.topupId
                          ? "border-primary bg-primary/5 shadow-sm"
                          : "border-border bg-background hover:bg-muted/30",
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center border",
                            selectedPack === pack.topupId
                              ? "bg-background border-primary/20"
                              : "bg-muted border-border",
                          )}
                        >
                          <Mail
                            className={cn(
                              "h-4 w-4",
                              selectedPack === pack.topupId
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{pack.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span>
                              {pack.numberOfEmails.toLocaleString()} units
                            </span>
                            <span className="h-1 w-1 rounded-full bg-border" />
                            <span className="text-emerald-600 font-medium">
                              ₹{(pack.price / pack.numberOfEmails).toFixed(2)}
                              /email
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          ₹{pack.price}
                        </p>
                        {selectedPack === pack.topupId && (
                          <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                            Selected
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            orderData && (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-muted/30 border border-border">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        {selectedPackDetails?.name}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Instant top-up of{" "}
                      {selectedPackDetails?.numberOfEmails.toLocaleString()}{" "}
                      units. No expiration date.
                    </p>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                    <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <p className="text-[10px] text-blue-700 dark:text-blue-300 leading-tight">
                      Secure payment processed via Razorpay. Transactions are
                      SSL encrypted.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/20 p-4 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold text-foreground">
                      ₹{(orderData.amount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">
                      {orderData.taxName} ({orderData.taxPercentage}%)
                    </span>
                    <span className="font-semibold text-foreground">
                      ₹{(orderData.taxAmount / 100).toFixed(2)}
                    </span>
                  </div>
                  <div className="h-px bg-border/50 border-dashed" />
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase text-muted-foreground">
                      Total Due
                    </span>
                    <div className="text-right">
                      <p className="text-xl font-bold">
                        ₹{(orderData.totalAmount / 100).toFixed(2)}
                      </p>
                      <p className="text-[9px] font-medium text-muted-foreground uppercase">
                        {orderData.currency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border bg-muted/20 flex flex-row items-center justify-between">
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Instant Activation
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              onClick={
                step === "selection" ? onClose : () => setStep("selection")
              }
              disabled={isInitiating}
            >
              {step === "selection" ? "Cancel" : "Back"}
            </Button>
            <Button
              size="sm"
              className="px-4 text-xs font-semibold"
              onClick={handleAction}
              disabled={!selectedPack || isInitiating}
            >
              {isInitiating ? (
                <Loader2 className="h-3 w-3 animate-spin mr-2" />
              ) : step === "selection" ? (
                "Review"
              ) : (
                <>
                  <CreditCard className="h-3 w-3 mr-2" /> Pay Now
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
