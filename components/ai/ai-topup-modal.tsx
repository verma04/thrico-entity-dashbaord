"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Loader2,
  CheckCircle2,
  Zap,
  ArrowRight,
  CreditCard,
  ShieldCheck,
  Coins,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRazorpay } from "react-razorpay";
import { useGetUser } from "@/graphql/actions";
import { useGetRazorpayKeyId } from "@/graphql/actions/plan";
import {
  useBuyAiTopup,
  useVerifyAiTopupPayment,
  useGetAiTopupPackages,
} from "@/graphql/actions/ai";

interface AITopupModalProps {
  onClose: () => void;
  quota?: {
    balance: number;
    usedThisMonth: number;
  };
}

export function AITopupModal({ onClose, quota }: AITopupModalProps) {
  const { Razorpay } = useRazorpay();
  const { data: userData } = useGetUser();
  const { data: keyData } = useGetRazorpayKeyId();
  const user = userData?.getUser;

  const razorpayKey =
    keyData?.getRazorpayKeyId ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY ||
    "rzp_test_TS0keaefy8lTV8";

  const { data: packagesData } = useGetAiTopupPackages();

  const [selectedPack, setSelectedPack] = useState<string>("ai_pack_1m");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showModal, setShowModal] = useState(true);

  const [buyTopup, { loading: isInitiating }] = useBuyAiTopup({});
  const [verifyPayment, { loading: verificationLoader }] = useVerifyAiTopupPayment({});

  // Fix Razorpay z-index over Radix Dialog
  useEffect(() => {
    const styleId = "razorpay-ai-topup-z-index-fix";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML = `
        .razorpay-container { z-index: 999999 !important; }
        .razorpay-backdrop { z-index: 999998 !important; }
      `;
      document.head.appendChild(style);
    }
    return () => {
      document.getElementById(styleId)?.remove();
    };
  }, []);

  const defaultPacks = [
    {
      topupId: "ai_pack_500k",
      name: "Starter Boost",
      tokens: "500,000",
      price: 1499,
      popular: false,
    },
    {
      topupId: "ai_pack_1m",
      name: "Scale Copilot",
      tokens: "1,000,000",
      price: 2699,
      popular: true,
    },
    {
      topupId: "ai_pack_5m",
      name: "Enterprise Studio",
      tokens: "5,000,000",
      price: 10999,
      popular: false,
    },
  ];

  const fetchedPacks = (packagesData?.getAiTopupPackages || []).map((p: any) => ({
    topupId: p.topupId,
    name: p.name,
    tokens: p.numberOfTokens?.toLocaleString() || "1,000,000",
    price: p.price,
    popular: p.topupId === "ai_pack_1m",
  }));

  const packs = fetchedPacks.length > 0 ? fetchedPacks : defaultPacks;

  const selectedPackDetails = packs.find((p) => p.topupId === selectedPack);
  const basePrice = selectedPackDetails?.price || 2699;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalAmount = basePrice + gstAmount;

  const handleCheckout = async () => {
    if (!selectedPackDetails) return;
    setIsProcessing(true);

    try {
      const { data } = await buyTopup({
        variables: { input: { topupId: selectedPack } },
      });

      const response = data?.buyAiTopup;
      if (!response?.orderId) {
        toast.error("Failed to generate payment order");
        setIsProcessing(false);
        return;
      }

      setShowModal(false);

      const options = {
        key: response.razorpayKeyId || razorpayKey,
        amount: response.amount ? response.amount * 100 : totalAmount * 100,
        currency: response.currency || "INR",
        name: "Thrico AI",
        description: `${selectedPackDetails.name} (${selectedPackDetails.tokens} AI Tokens)`,
        order_id: response.orderId,
        handler: async function (razorpayRes: any) {
          setShowModal(true);
          setIsVerifying(true);
          try {
            await verifyPayment({
              variables: {
                input: {
                  razorpayOrderId: razorpayRes.razorpay_order_id,
                  razorpayPaymentId: razorpayRes.razorpay_payment_id,
                  razorpaySignature: razorpayRes.razorpay_signature,
                },
              },
            });
            toast.success("AI tokens credited to your entity wallet successfully!");
            onClose();
          } catch (err: any) {
            toast.error(err?.message || "Payment verification failed");
          } finally {
            setIsVerifying(false);
          }
        },
        prefill: {
          name: user?.firstName ? `${user.firstName} ${user.lastName || ""}` : "Entity Admin",
          email: user?.email || "admin@thrico.network",
        },
        modal: {
          ondismiss: function () {
            setShowModal(true);
            setIsProcessing(false);
          },
        },
        theme: { color: "#4f46e5" },
      };

      const rzpInstance = new Razorpay(options);
      rzpInstance.open();
    } catch (err: any) {
      toast.error(err?.message || "Could not initiate top-up");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md sm:max-w-md p-6 space-y-5">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
              <Coins className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-foreground">
                AI Token Top-Up
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Instant compute allowance for multi-agent reasoning and copilot tasks
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isVerifying ? (
          <div className="py-10 flex flex-col items-center justify-center text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <h4 className="text-sm font-bold text-foreground">Verifying Payment & Provisioning Tokens</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Communicating with Razorpay and updating entity token ledger...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Packages */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                Select Package
              </span>

              <div className="space-y-2">
                {packs.map((pack) => (
                  <button
                    key={pack.topupId}
                    type="button"
                    onClick={() => setSelectedPack(pack.topupId)}
                    className={cn(
                      "w-full flex items-center justify-between p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                      selectedPack === pack.topupId
                        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-2 ring-indigo-500/20"
                        : "border-border/70 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">{pack.name}</span>
                        {pack.popular && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-600 text-white">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {pack.tokens} Tokens
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-foreground tabular-nums">
                        ₹{pack.price.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">+18% GST</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Price Summary */}
            <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 space-y-1.5 text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Base Amount</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>GST (18%)</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-foreground pt-1 border-t border-border/60">
                <span>Total Payable</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              disabled={isProcessing || isInitiating}
              className="w-full h-10 text-xs font-semibold gap-2 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-xl"
            >
              {isProcessing || isInitiating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Initiating Razorpay...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>Pay ₹{totalAmount.toLocaleString()} with Razorpay</span>
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
