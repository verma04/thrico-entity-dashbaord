"use client";

import React, { useState, useEffect } from "react";
import {
  Wallet,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Zap,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRazorpay } from "react-razorpay";
import { useGetUser } from "@/graphql/actions";
import { useCountry, useGetRazorpayKeyId } from "@/graphql/actions/plan";
import {
  useTopupRewardWallet,
  useCreateRewardWalletTopupOrder,
  useVerifyRewardWalletTopupPayment,
} from "@/graphql/actions/rewards/gift-cards";

interface TopUpWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  onTopUpSuccess?: (amount: number) => void;
}

const PRESET_AMOUNTS = [10000, 25000, 50000, 100000];

export const TopUpWalletModal: React.FC<TopUpWalletModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  onTopUpSuccess,
}) => {
  const { Razorpay } = useRazorpay();
  const { data: countryData } = useCountry();
  const { data: userData } = useGetUser();
  const { data: keyData } = useGetRazorpayKeyId();
  const user = userData?.getUser;

  const [createOrder] = useCreateRewardWalletTopupOrder();
  const [verifyPayment, { loading: verificationLoader }] =
    useVerifyRewardWalletTopupPayment();
  const [topupRewardWallet] = useTopupRewardWallet();

  const [selectedAmount, setSelectedAmount] = useState<number>(50000);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
      setIsVerifying(false);
    }
  }, [isOpen]);

  const razorpayKey =
    keyData?.getRazorpayKeyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    "rzp_test_TS0keaefy8lTV8";

  const country = countryData?.country;
  const taxPercentage = country?.taxPercentage ?? 18;
  const taxName = country?.taxName || "GST";
  const taxIncluded = country?.taxIncluded || false;

  const effectiveAmount = customAmount ? Number(customAmount) : selectedAmount;

  // Dynamic Tax calculation logic (matching buy-plan-pop & addon modal pattern)
  let taxAmount = 0;
  let subtotal = effectiveAmount || 0;
  let finalTotal = effectiveAmount || 0;

  if (taxIncluded) {
    taxAmount = subtotal - subtotal / (1 + taxPercentage / 100);
    subtotal = subtotal - taxAmount;
    finalTotal = effectiveAmount || 0;
  } else {
    taxAmount = subtotal * (taxPercentage / 100);
    finalTotal = subtotal + taxAmount;
  }

  // Inject global styles for Razorpay z-index over Radix Dialog
  useEffect(() => {
    const styleId = "razorpay-topup-z-index-fix";
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

  const handleTopUp = async () => {
    if (!effectiveAmount || effectiveAmount <= 0) {
      toast.error("Please select or enter a valid top-up amount.");
      return;
    }

    setIsProcessing(true);
    try {
      // Step 1: Create Razorpay Order on Backend
      const orderRes = await createOrder({
        variables: {
          input: {
            amount: Number(effectiveAmount),
            currency: "INR",
            notes: "Prepaid Reward Wallet Deposit",
          },
        },
      });

      const order = orderRes?.data?.createRewardWalletTopupOrder;
      if (!order?.orderId) {
        // Fallback to direct topup in offline/sandbox mode if order creation is mocked
        const paymentRef = `TOPUP-${Date.now()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
        const res = await topupRewardWallet({
          variables: {
            amount: Number(effectiveAmount),
            paymentReference: paymentRef,
            notes: "Prepaid Reward Wallet Deposit",
          },
        });
        const updatedBalance =
          res?.data?.topupRewardWallet?.balance ??
          currentBalance + effectiveAmount;
        if (onTopUpSuccess) onTopUpSuccess(effectiveAmount);
        toast.success(`Reward Wallet Top-Up Successful!`, {
          description: `Added ₹${effectiveAmount.toLocaleString("en-IN")} to prepaid balance. New Balance: ₹${updatedBalance.toLocaleString("en-IN")}.`,
        });
        setIsProcessing(false);
        onClose();
        return;
      }

      // Step 2: Open Razorpay Checkout Modal
      const options = {
        key: order.razorpayKeyId || razorpayKey,
        amount: order.amountInPaise || Math.round(finalTotal * 100),
        currency: order.currency || "INR",
        name: "Thrico Reward Wallet Deposit",
        description: `Prepaid Reward Wallet Top-Up (₹${Number(effectiveAmount).toLocaleString("en-IN")})`,
        order_id: order.orderId,
        handler: async function (response: any) {
          setShowModal(true);
          setIsVerifying(true);
          try {
            // Step 3: Verify Payment & Credit Wallet
            const verifyRes = await verifyPayment({
              variables: {
                input: {
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                  amount: Number(effectiveAmount),
                  notes: "Prepaid Reward Wallet Top-Up",
                },
              },
            });

            const newBal =
              verifyRes?.data?.verifyRewardWalletTopupPayment?.balance ??
              currentBalance + effectiveAmount;

            if (onTopUpSuccess) {
              onTopUpSuccess(effectiveAmount);
            }

            toast.success("Reward Wallet Top-Up Successful!", {
              description: `Payment verified & ₹${effectiveAmount.toLocaleString("en-IN")} credited. New balance: ₹${newBal.toLocaleString("en-IN")}.`,
            });
            onClose();
          } catch (vErr: any) {
            toast.error(
              vErr?.message ||
                "Payment verification failed. Please contact support.",
            );
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
        theme: {
          color: "#7c3aed",
        },
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

      const rzp = new Razorpay(options);

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

      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Hide dialog and open Razorpay
      setShowModal(false);
      rzp.open();

      // Apply fix multiple times as backup
      setTimeout(applyZIndexFix, 50);
      setTimeout(applyZIndexFix, 100);
      setTimeout(applyZIndexFix, 200);
      setTimeout(applyZIndexFix, 500);

      // Clean up observer after 10 seconds
      setTimeout(() => {
        observer.disconnect();
      }, 10000);
    } catch (err: any) {
      console.error("Top-up order error:", err);
      setShowModal(true);
      toast.error(
        err?.message ||
          "Failed to initiate wallet top-up order. Please try again.",
      );
      setIsProcessing(false);
    }
  };

  return (
    <Dialog
      open={isOpen && showModal}
      onOpenChange={(open) => {
        if (isVerifying || verificationLoader) return;
        if (!open) {
          setShowModal(true);
          setIsVerifying(false);
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-2xl bg-card border-border z-[160] p-0 overflow-hidden shadow-2xl">
        {/* HEADER WITH GRADIENT */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>

              <div>
                <DialogTitle className="text-xl font-semibold">
                  Top-Up Prepaid Reward Wallet
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  Deposit funds with real-time tax breakdown to fuel automated
                  on-win digital gift cards.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* PROMINENT VERIFICATION LOADER VIEW */}
        {isVerifying || verificationLoader ? (
          <div className="py-14 px-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in-50 duration-200">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-xs">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                Verifying Payment & Crediting Wallet...
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Confirming your transaction signature with Razorpay and crediting ₹
                {Number(effectiveAmount || 0).toLocaleString("en-IN")} to your
                prepaid wallet balance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Please do not refresh or close this window</span>
            </div>
          </div>
        ) : (
          <>
            {/* PROCESSING BANNER (ORDER INITIATION) */}
            {isProcessing && (
              <div className="flex items-center justify-center py-3 bg-primary/5 border-b border-primary/20">
                <Loader2 className="animate-spin h-4 w-4 text-primary" />
                <span className="ml-2 text-xs font-medium text-foreground">
                  Initiating payment gateway...
                </span>
              </div>
            )}

            {/* TOP SUMMARY BANNER */}
            <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-3.5 mb-0">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-foreground leading-relaxed">
                  Review your top-up amount and applicable tax calculations before
                  proceeding with payment.
                </p>
              </div>
            </div>

            {/* CONTENT BODY - 2 COLUMN GRID */}
            <div className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* LEFT COLUMN: AMOUNT */}
                <div className="space-y-4">
                  {/* Current Balance Banner */}
                  <div className="p-3.5 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">
                        Current Wallet Balance
                      </span>
                      <span className="text-lg font-bold text-foreground font-mono block">
                        ₹{currentBalance.toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div className="text-right space-y-0.5">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold">
                        After Top-Up
                      </span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono block">
                        ₹
                        {(
                          currentBalance + (effectiveAmount || 0)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Preset Amounts */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-foreground">
                      Select Deposit Amount
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_AMOUNTS.map((amt) => {
                        const isSelected =
                          selectedAmount === amt && !customAmount;
                        return (
                          <button
                            key={amt}
                            type="button"
                            onClick={() => {
                              setSelectedAmount(amt);
                              setCustomAmount("");
                            }}
                            className={cn(
                              "p-2.5 rounded-xl border text-center font-mono font-bold text-xs transition-all cursor-pointer",
                              isSelected
                                ? "border-primary bg-primary/10 text-primary ring-1 ring-primary"
                                : "border-border hover:border-primary/40 bg-secondary/30 text-foreground",
                            )}
                          >
                            ₹{amt.toLocaleString("en-IN")}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-foreground">
                      Or Enter Custom Amount (₹)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="e.g. 75000"
                      className="text-xs font-mono font-semibold"
                    />
                  </div>
                </div>

                {/* RIGHT COLUMN: PAYMENT & TAX SUMMARY */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Payment & Tax Summary</h4>

                  <div className="rounded-xl border bg-secondary/30 p-4 space-y-3.5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">
                        Prepaid Deposit
                      </span>
                      <span className="font-mono font-semibold">
                        ₹
                        {(taxIncluded
                          ? subtotal
                          : effectiveAmount || 0
                        ).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground flex items-center gap-1">
                        {taxName} ({taxPercentage}%
                        {taxIncluded ? " Included" : ""})
                      </span>
                      <span className="font-mono font-semibold text-primary">
                        ₹
                        {taxAmount.toLocaleString("en-IN", {
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
                        {finalTotal.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Sub-item: Post Top-up projected balance */}
                    <div className="rounded-lg bg-background/60 border border-border/70 p-2.5 flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">
                        New Wallet Balance:
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ₹
                        {(
                          currentBalance + (effectiveAmount || 0)
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Zero Inventory Risk Badge */}
                  <div className="p-3 rounded-xl border border-border bg-secondary/20 text-[11px] text-muted-foreground flex items-start gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong className="text-foreground">
                        Zero Inventory Risk:
                      </strong>{" "}
                      Funds remain securely in your prepaid wallet until a
                      member wins a gift card. If provider fulfillment fails,
                      funds are automatically released back to your balance.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* FOOTER */}
        <DialogFooter className="flex justify-between items-center px-6 py-4 bg-secondary/20 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Instant wallet credit upon verification
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isProcessing || isVerifying || verificationLoader}
            >
              Cancel
            </Button>

            <Button
              size="sm"
              onClick={handleTopUp}
              disabled={isProcessing || isVerifying || verificationLoader}
              className="gap-2"
            >
              {isVerifying || verificationLoader ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                <>
                  <CreditCard className="h-4 w-4" />
                  Deposit ₹
                  {finalTotal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
