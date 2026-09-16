"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Mail,
  Loader2,
  CheckCircle2,
  Zap,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Sparkles,
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
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { useGetUser } from "@/graphql/actions";
import { useGetRazorpayKeyId } from "@/graphql/actions/plan";
import {
  useGetEmailTopups,
  useBuyEmailTopup,
  useVerifyEmailTopupPayment,
  type EmailOverview,
  type EmailTopupProduct,
  type BuyTopupResponse,
} from "@/graphql/actions/email";

interface UsageTopupModalProps {
  onClose: () => void;
  usage?: EmailOverview["usage"];
}

export function UsageTopupModal({ onClose, usage }: UsageTopupModalProps) {
  const { Razorpay } = useRazorpay();
  const { data: userData } = useGetUser();
  const { data: keyData } = useGetRazorpayKeyId();
  const user = userData?.getUser;

  const razorpayKey =
    keyData?.getRazorpayKeyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    "rzp_test_TS0keaefy8lTV8";

  const { data: topupData, loading: packsLoading } = useGetEmailTopups();
  const [selectedPack, setSelectedPack] = useState<string | null>(null);
  const [step, setStep] = useState<"selection" | "checkout">("selection");
  const [orderData, setOrderData] = useState<BuyTopupResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const [buyTopup, { loading: isInitiating }] = useBuyEmailTopup({});
  const [verifyPayment, { loading: verificationLoader }] =
    useVerifyEmailTopupPayment({});

  // Inject global styles for Razorpay z-index over Radix Dialog
  useEffect(() => {
    const styleId = "razorpay-email-topup-z-index-fix";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .razorpay-container {
          z-index: 999999 !important;
        }
        .razorpay-backdrop {
          z-index: 999998 !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  const packs = [...(topupData?.getEmailTopups || [])].sort(
    (a, b) => a.numberOfEmails - b.numberOfEmails,
  );
  const selectedPackDetails = packs.find((p) => p.topupId === selectedPack);

  const handleAction = async () => {
    if (!selectedPack) {
      toast.error("Please select a top-up pack");
      return;
    }

    // Step 1: Initiate order creation on backend
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

    // Step 2: Open Razorpay checkout modal
    setIsProcessing(true);
    try {
      const options = {
        key: razorpayKey,
        amount: Math.round(orderData.totalAmount * 100), // convert rupees to paise
        currency: orderData.currency || "INR",
        name: "Thrico Email System",
        description: `Credits Top-Up: ${selectedPackDetails?.name || selectedPack} (${selectedPackDetails?.numberOfEmails.toLocaleString() || ""} emails)`,
        order_id: orderData.razorpayOrderId,
        handler: async function (response: any) {
          setShowModal(true);
          setIsVerifying(true);
          try {
            // Step 3: Verify payment and credit quota
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

            if (verifyData?.verifyEmailTopupPayment?.success) {
              toast.success("Email credits added successfully!", {
                description: `Added ${selectedPackDetails?.numberOfEmails.toLocaleString()} units to your quota. Invoice generated.`,
              });
              onClose();
            } else {
              toast.error(
                verifyData?.verifyEmailTopupPayment?.message ||
                  "Verification failed. Please contact support.",
              );
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          } finally {
            setIsVerifying(false);
            setIsProcessing(false);
          }
        },
        prefill: {
          name:
            `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
            "Account Admin",
          email: user?.email ?? "",
          contact: user?.profile?.phone?.phoneNumber ?? "",
        },
        theme: { color: "#4f46e5" },
        modal: {
          ondismiss: function () {
            setShowModal(true);
            setIsProcessing(false);
          },
          backdropclose: false,
          escape: true,
          handleback: false,
        },
      };

      const rzp = new Razorpay(options as any);

      rzp.on("payment.failed", function (response: any) {
        setShowModal(true);
        toast.error("Payment Failed", {
          description:
            response?.error?.description ||
            "Transaction was declined or failed.",
        });
        setIsProcessing(false);
      });

      // Function to apply z-index fix
      const applyZIndexFix = () => {
        const razorpayContainer = document.querySelector(".razorpay-container");
        const razorpayBackdrop = document.querySelector(".razorpay-backdrop");
        const razorpayFrame = document.querySelector(
          'iframe[src*="checkout.razorpay.com"]',
        );

        if (razorpayContainer) {
          (razorpayContainer as HTMLElement).style.setProperty(
            "z-index",
            "999999",
            "important",
          );
          (razorpayContainer as HTMLElement).style.position = "fixed";
        }
        if (razorpayBackdrop) {
          (razorpayBackdrop as HTMLElement).style.setProperty(
            "z-index",
            "999998",
            "important",
          );
          (razorpayBackdrop as HTMLElement).style.position = "fixed";
        }
        if (razorpayFrame) {
          (razorpayFrame as HTMLElement).style.setProperty(
            "z-index",
            "999999",
            "important",
          );
        }

        // Also hide all dialog overlays temporarily
        const dialogOverlays = document.querySelectorAll(
          "[data-radix-dialog-overlay]",
        );
        dialogOverlays.forEach((overlay) => {
          (overlay as HTMLElement).style.display = "none";
        });
      };

      // Set up MutationObserver to watch for Razorpay elements
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof HTMLElement) {
              if (
                node.classList.contains("razorpay-container") ||
                node.classList.contains("razorpay-backdrop") ||
                node.querySelector(".razorpay-container")
              ) {
                applyZIndexFix();
              }
            }
          });
        });
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Hide dialog and open Razorpay
      setShowModal(false);
      rzp.open();

      // Backup timeouts for z-index
      setTimeout(applyZIndexFix, 50);
      setTimeout(applyZIndexFix, 100);
      setTimeout(applyZIndexFix, 200);
      setTimeout(applyZIndexFix, 500);

      setTimeout(() => {
        observer.disconnect();
      }, 10000);
    } catch (error: any) {
      console.error("Payment initiation error:", error);
      setShowModal(true);
      toast.error(error.message || "Failed to initiate payment");
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        if (isVerifying || verificationLoader) return;
        if (!open) {
          setShowModal(true);
          setIsVerifying(false);
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl border-border p-0 overflow-hidden bg-background shadow-2xl z-[160]">
        {/* HEADER */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg font-semibold">
                  {step === "selection"
                    ? "Add Email Credits"
                    : "Confirm Purchase & Tax Breakdown"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {step === "selection"
                    ? "Choose a credit pack to recharge your monthly sending quota."
                    : "Review your GST tax calculation and total due before proceeding."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* VERIFYING PAYMENT LOADER VIEW */}
        {isVerifying || verificationLoader ? (
          <div className="py-14 px-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in-50 duration-200">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xs">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                Verifying Payment & Adding Credits...
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Confirming your transaction signature with Razorpay and recharging{" "}
                {selectedPackDetails?.numberOfEmails.toLocaleString()} units to
                your sending quota.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Please do not refresh or close this window</span>
            </div>
          </div>
        ) : (
          <div className="p-6">
            {step === "selection" ? (
              <div className="space-y-4">
                {/* Current Quota Status Banner */}
                {usage && (
                  <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold block">
                        Current Remaining Quota
                      </span>
                      <span className="text-base font-bold text-foreground font-mono">
                        {usage.remaining?.toLocaleString() ?? 0} units
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold block">
                        Monthly Allowance
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground font-mono">
                        {usage.numberOfEmailsPerMonth?.toLocaleString() ?? 0}{" "}
                        units
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <span className="text-xs font-semibold text-foreground">
                    Select Credit Pack
                  </span>
                  <div className="grid gap-2">
                    {packsLoading ? (
                      <div className="h-40 flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      packs.map((pack: EmailTopupProduct) => {
                        const isSelected = selectedPack === pack.topupId;
                        return (
                          <button
                            key={pack.topupId}
                            type="button"
                            onClick={() => setSelectedPack(pack.topupId)}
                            className={cn(
                              "w-full flex items-center justify-between p-3.5 rounded-xl border transition-all text-left cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary"
                                : "border-border/70 bg-card hover:bg-muted/30 hover:border-primary/40",
                            )}
                          >
                            <div className="flex items-center gap-3.5">
                              <div
                                className={cn(
                                  "h-9 w-9 rounded-lg flex items-center justify-center border",
                                  isSelected
                                    ? "bg-primary/10 border-primary/30 text-primary"
                                    : "bg-muted border-border text-muted-foreground",
                                )}
                              >
                                <Mail className="h-4 w-4" />
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground">
                                  {pack.name}
                                </p>
                                <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                                  <span>
                                    {pack.numberOfEmails.toLocaleString()} units
                                  </span>
                                  <span className="h-1 w-1 rounded-full bg-border" />
                                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                                    ₹
                                    {(
                                      pack.price / pack.numberOfEmails
                                    ).toFixed(2)}
                                    /email
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-foreground font-mono">
                                ₹{pack.price.toLocaleString("en-IN")}
                              </p>
                              {isSelected && (
                                <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                                  Selected
                                </span>
                              )}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            ) : (
              orderData && (
                <div className="grid gap-6 md:grid-cols-2">
                  {/* LEFT: PACK DETAILS */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="text-xs font-bold text-foreground">
                          {selectedPackDetails?.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Instant quota recharge of{" "}
                        <strong>
                          {selectedPackDetails?.numberOfEmails.toLocaleString()}{" "}
                          units
                        </strong>
                        . Valid for automated campaigns, newsletters, and transactional emails with no expiry.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl border border-border bg-secondary/20 text-[11px] text-muted-foreground flex items-start gap-2.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <strong className="text-foreground">
                          Official GST Tax Invoice:
                        </strong>{" "}
                        An automated tax invoice with HSN/SAC 998313 will be
                        dispatched to your registered email immediately upon payment.
                      </div>
                    </div>
                  </div>

                  {/* RIGHT: PAYMENT & GST SUMMARY */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">
                      Payment & Tax Summary
                    </h4>

                    <div className="rounded-xl border bg-secondary/30 p-4 space-y-3.5">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          Base Package Price
                        </span>
                        <span className="font-mono font-semibold">
                          ₹
                          {orderData.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          {orderData.taxName} ({orderData.taxPercentage}%)
                        </span>
                        <span className="font-mono font-semibold text-primary">
                          ₹
                          {orderData.taxAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      <div className="h-px bg-border" />

                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium text-sm block">
                            Total due today
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            Inclusive of all applicable taxes
                          </span>
                        </div>
                        <span className="text-xl font-bold font-mono">
                          ₹
                          {orderData.totalAmount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>

                      {/* Quota after Recharge */}
                      {usage && (
                        <div className="rounded-lg bg-background/60 border border-border/70 p-2.5 flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            New Available Quota:
                          </span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                            {(
                              (usage.remaining || 0) +
                              (selectedPackDetails?.numberOfEmails || 0)
                            ).toLocaleString()}{" "}
                            units
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* FOOTER */}
        <DialogFooter className="px-6 py-4 border-t border-border bg-secondary/20 flex flex-row items-center justify-between">
          <div className="text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Instant quota activation
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={
                step === "selection" ? onClose : () => setStep("selection")
              }
              disabled={isInitiating || isProcessing || isVerifying || verificationLoader}
            >
              {step === "selection" ? "Cancel" : "Back"}
            </Button>
            <Button
              size="sm"
              className="px-4 text-xs font-semibold gap-1.5"
              onClick={handleAction}
              disabled={
                !selectedPack ||
                isInitiating ||
                isProcessing ||
                isVerifying ||
                verificationLoader
              }
            >
              {isVerifying || verificationLoader ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Verifying Payment...
                </span>
              ) : isInitiating || isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Processing...
                </span>
              ) : step === "selection" ? (
                <>
                  Review Breakdown
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5 mr-1" />
                  Pay ₹
                  {orderData?.totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
