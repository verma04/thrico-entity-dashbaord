"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  HelpCircle,
  Calculator,
  Loader2,
  CheckCircle2,
  Zap,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Mail,
  RefreshCw,
  Clock,
  Activity,
  Layers,
  X,
  Target,
  ArrowUpRight,
  Shield,
  Trophy,
} from "lucide-react";
import { useEmailStore } from "@/store/useEmailStore";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { formatNumber } from "@/lib/formatNumber";
import {
  useGetEmailOverview,
  useGetEmailTopups,
  useBuyEmailTopup,
  useVerifyEmailTopupPayment,
  useGetEmailLogs,
  useGetEmailTopupHistory,
  type EmailOverview,
  type EmailTopupProduct,
  type EmailLog,
  type EmailTopupHistory,
  type BuyTopupResponse,
} from "@/graphql/actions/email";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ---------------------------------------------------------------------------
// Top-up Modal (Redesigned to match addon-purchase-modal.tsx)
// ---------------------------------------------------------------------------
function TopUpModal({
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
  const [buyTopup, { loading: isInitiating }] = useBuyEmailTopup();
  const [verifyPayment] = useVerifyEmailTopupPayment();

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
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_AVIthfNy85rAR2",
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
              toast.error(verifyData?.verifyEmailTopupPayment.message || "Verification failed");
            }
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed");
          }
        },
        theme: { color: "#6C47FF" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate payment");
    }
  };

  const packs = topupData?.getEmailTopups || [];
  const selectedPackDetails = packs.find(p => p.topupId === selectedPack);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border z-50 p-0 overflow-hidden">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-border">
          <div className="absolute inset-0 bg-linear-to-r from-primary/5 to-transparent" />
          <DialogHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {step === "selection" ? "Add Email Credits" : "Confirm Purchase"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {step === "selection" 
                    ? "Choose a credit pack to boost your monthly quota." 
                    : "Review your order summary and taxes before payment."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Processing State Banner */}
        {isInitiating && (
          <div className="flex items-center justify-center py-4 bg-secondary/10 border-b border-border/50">
            <Loader2 className="animate-spin h-5 w-5 text-primary" />
            <span className="ml-2 text-sm text-muted-foreground font-medium">Preparing your summary...</span>
          </div>
        )}

        {/* Info Banner */}
        <div className="mx-6 mt-4 rounded-xl bg-primary/5 border border-primary/20 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-foreground leading-relaxed">
              {step === "selection"
                ? `Your current usage is at ${Math.round(usage.usagePercent)}%. Adding credits will take effect immediately.`
                : "Credits are non-refundable and will be added to your current balance immediately after purchase."}
            </p>
          </div>
        </div>

        <div className="p-6">
          {step === "selection" ? (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Available Packs</h4>
              <div className="grid gap-3">
                {packsLoading ? (
                  <div className="h-40 flex items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                  </div>
                ) : (
                  packs.map((pack: EmailTopupProduct) => (
                    <button
                      key={pack.topupId}
                      onClick={() => setSelectedPack(pack.topupId)}
                      className={cn(
                        "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group",
                        selectedPack === pack.topupId
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border bg-background hover:border-primary/50"
                      )}
                    >
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-xl flex items-center justify-center border transition-colors",
                          selectedPack === pack.topupId ? "bg-white border-primary/20 shadow-sm" : "bg-secondary/50 border-transparent group-hover:bg-background"
                        )}>
                          <Mail className={cn("h-4 w-4", selectedPack === pack.topupId ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-foreground">{pack.name}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-muted-foreground">{pack.numberOfEmails.toLocaleString()} units</span>
                            <span className="h-0.5 w-0.5 rounded-full bg-border" />
                            <span className="text-xs font-medium text-emerald-600">₹{(pack.price / pack.numberOfEmails).toFixed(2)} / email</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-foreground">₹{pack.price}</span>
                        {selectedPack === pack.topupId && (
                          <div className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">Selected</div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : orderData && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Purchase Details</h4>
                  <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold">{selectedPackDetails?.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Instant top-up of {selectedPackDetails?.numberOfEmails.toLocaleString()} email transmission units. No expiration date.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100/30">
                  <Shield className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-blue-700 font-medium leading-tight">
                    Transactions are secured by 256-bit SSL encryption. We do not store your card details.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-foreground/80">Payment Summary</h4>
                <div className="rounded-2xl border bg-secondary/20 p-4 space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      Subtotal
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="w-3.5 h-3.5 text-muted-foreground/40 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-72 p-4 bg-popover border shadow-xl">
                            <div className="space-y-2">
                              <p className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                                <Calculator className="w-4 h-4 text-primary" />
                                Price Breakdown
                              </p>
                              <p className="text-xs text-muted-foreground">
                                All top-ups inclusive of local taxation based on your billing region.
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </span>
                    <span className="font-bold">₹{(orderData.amount / 100).toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">
                      {orderData.taxName} ({orderData.taxPercentage}%)
                    </span>
                    <span className="font-bold text-primary">₹{(orderData.taxAmount / 100).toFixed(2)}</span>
                  </div>

                  <div className="h-px bg-border/50 border-dashed" />

                  <div className="space-y-1">
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest leading-none">Total amount due</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-foreground">₹{(orderData.totalAmount / 100).toFixed(2)}</span>
                      <span className="text-xs font-bold text-muted-foreground uppercase">{orderData.currency}</span>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="w-full justify-center bg-primary/10 text-primary border-none font-bold">
                    PREPAID TOP-UP
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <DialogFooter className="flex flex-row justify-between items-center px-6 py-4 bg-secondary/20 border-t border-border/50 sm:justify-between">
          <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <Zap className="h-3.5 w-3.5 text-primary" />
            Instant Activation
          </div>

          <div className="flex gap-2">
            <Button
              variant="ghost"
              className="text-xs font-bold hover:bg-white"
              onClick={step === "selection" ? onClose : () => setStep("selection")}
              disabled={isInitiating}
            >
              {step === "selection" ? "Cancel" : "Change Pack"}
            </Button>
            <Button
              className="font-bold shadow-lg shadow-primary/20 px-6 py-2 h-auto text-xs"
              onClick={handleAction}
              disabled={!selectedPack || isInitiating}
            >
              {isInitiating ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  One moment...
                </span>
              ) : step === "selection" ? (
                <>
                  Review Order
                  <ArrowRight className="h-3.5 w-3.5 ml-2" />
                </>
              ) : (
                <>
                  <CreditCard className="h-3.5 w-3.5 mr-2" />
                  Pay ₹{(orderData!.totalAmount / 100).toFixed(2)}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Stat Card
// ---------------------------------------------------------------------------
function UsageStat({
  label,
  value,
  icon: Icon,
  color,
  bg,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
  bg: string;
}) {
  return (
    <div className="p-6 rounded-3xl border border-slate-200/60 bg-white shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center border",
            bg,
          )}
        >
          <Icon className={cn("h-5 w-5", color)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500">{label}</label>
        <p className="text-2xl font-bold text-slate-900 tracking-tight mt-0.5 tabular-nums">
          {value}
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Logs Section
// ---------------------------------------------------------------------------
function LogsSection() {
  const { data, loading } = useGetEmailLogs({ limit: 5 });
  const logs = data?.getEmailLogs || [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/60 shadow-sm overflow-hidden">
      <div className="p-8 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Recent Activity
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Live transmission logs
          </p>
        </div>
        <button className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">
          View All
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 text-slate-300 animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-sm text-slate-400">
            No recent activity found.
          </div>
        ) : (
          logs.map((log: EmailLog) => (
            <div
              key={log.id}
              className="p-5 flex items-center justify-between hover:bg-slate-50/50 transition-colors group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-9 w-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-slate-950 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-medium text-slate-900 truncate">
                    {log.subject}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    to {log.to}
                  </p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="flex items-center gap-2 justify-end">
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      log.status === "sent"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-50 text-slate-400",
                    )}
                  >
                    {log.status}
                  </span>
                </div>
                <p className="text-[10px] font-medium text-slate-400 mt-1 tabular-nums">
                  {new Date(log.sentAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// History Section
// ---------------------------------------------------------------------------
function HistorySection() {
  const { data, loading } = useGetEmailTopupHistory();
  const history = data?.getEmailTopupHistory || [];

  return (
    <div className="p-6 rounded-3xl border border-slate-200/60 bg-white shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="text-[14px] font-semibold text-slate-900">
          Purchase History
        </h4>
        <CreditCard className="h-4 w-4 text-slate-300" />
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="py-4 flex items-center justify-center">
            <RefreshCw className="h-4 w-4 text-slate-300 animate-spin" />
          </div>
        ) : history.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-2">
            No purchases yet.
          </p>
        ) : (
          history.slice(0, 3).map((item: EmailTopupHistory) => (
            <div
              key={item.id}
              className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-900">
                  +{item.extraEmails.toLocaleString()} Credits
                </p>
                <p className="text-[10px] text-slate-400">
                  {new Date(item.purchasedAt).toLocaleDateString()}
                </p>
              </div>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Usage Dashboard
// ---------------------------------------------------------------------------
export default function UsageDashboard() {
  const { data, loading } = useGetEmailOverview();
  const [topOpen, setTopOpen] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  if (loading || !data) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-slate-300 animate-spin" />
      </div>
    );
  }

  const { usage } = data.getEmailOverview;
  const usagePercent = usage.usagePercent;
  const daysUntilReset = usage.periodEnd
    ? Math.ceil((new Date(usage.periodEnd).getTime() - Date.now()) / 86400000)
    : 0;

  const chartData = [
    { name: "Mon", sent: 120, delivered: 118 },
    { name: "Tue", sent: 450, delivered: 442 },
    { name: "Wed", sent: 380, delivered: 375 },
    { name: "Thu", sent: 890, delivered: 882 },
    { name: "Fri", sent: 620, delivered: 615 },
    { name: "Sat", sent: 210, delivered: 208 },
    { name: "Sun", sent: 150, delivered: 148 },
  ];

  const stats = [
    {
      label: "Emails Sent",
      value: usage.emailsSent.toLocaleString(),
      icon: Mail,
      color: "text-slate-600",
      bg: "bg-slate-50 border-slate-100",
    },
    {
      label: "Monthly Quota",
      value: usage.numberOfEmailsPerMonth.toLocaleString(),
      icon: Layers,
      color: "text-slate-600",
      bg: "bg-slate-50 border-slate-100",
    },
    {
      label: "Remaining",
      value: usage.remaining.toLocaleString(),
      icon: Activity,
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-100/50",
    },
    {
      label: "Days to Reset",
      value: daysUntilReset,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-100/50",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-10 px-6 space-y-12 animate-in fade-in duration-1000">
      {/* Sober Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Usage & Billing
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor your infrastructure resource consumption.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTopOpen(true)}
            className="h-11 px-6 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Add Credits
          </button>
          <button
            onClick={() => setShowBuyPlanDialog(true)}
            className="h-11 px-6 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Manage Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Resource View */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm space-y-8">
            <div className="flex items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Resource Pulse
                </span>
                <h2 className="text-xl font-semibold text-slate-900">
                  Current Cycle Usage
                </h2>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-slate-900 tracking-tight">
                  {Math.round(usagePercent)}%
                </span>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  {usage.emailsSent.toLocaleString()} of{" "}
                  {usage.numberOfEmailsPerMonth.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${usagePercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  usagePercent >= 90
                    ? "bg-red-500"
                    : usagePercent >= 70
                      ? "bg-amber-500"
                      : "bg-slate-900",
                )}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-50">
              {[
                {
                  label: "Cycle Ends",
                  value: `${daysUntilReset} days`,
                  icon: Clock,
                },
                { label: "Stability", value: "99.9%", icon: Shield },
                { label: "Performance", value: "Optimal", icon: Activity },
                { label: "Reputation", value: "High", icon: Target },
              ].map((item, i) => (
                <div key={i} className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                    {item.label}
                  </span>
                  <p className="text-sm font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-base font-semibold text-slate-900">
                  Distribution
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Historical delivery performance
                </p>
              </div>
              <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
                  <span className="text-xs font-medium text-slate-600">
                    Sent
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs font-medium text-slate-600">
                    Delivered
                  </span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f8fafc"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#94a3b8" }}
                    tickFormatter={formatNumber}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      padding: "8px 12px",
                    }}
                    itemStyle={{ fontSize: "12px", fontWeight: "600" }}
                    labelStyle={{ display: "none" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="sent"
                    stroke="#1e293b"
                    strokeWidth={2}
                    fill="#1e293b"
                    fillOpacity={0.02}
                  />
                  <Area
                    type="monotone"
                    dataKey="delivered"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b981"
                    fillOpacity={0.02}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Email Logs Section */}
          <LogsSection />
        </div>

        {/* Info Column */}
        <div className="space-y-8">
          <div className="bg-slate-950 rounded-3xl p-8 text-white shadow-lg space-y-6">
            <div>
              <Trophy className="h-6 w-6 text-slate-400" />
              <h3 className="text-xl font-semibold mt-4">Enterprise</h3>
              <p className="text-sm text-slate-400 mt-2 leading-relaxed">
                Active tier with high-volume output core and priority delivery
                routing.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => setShowBuyPlanDialog(true)}
                className="w-full h-11 bg-white text-slate-950 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
              >
                Update Plan
                <ArrowRight className="h-4 w-4" />
              </button>
              <button className="w-full h-11 bg-slate-800 text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-colors">
                Billing History
              </button>
            </div>
          </div>

          <HistorySection />

          <div className="grid grid-cols-1 gap-6">
            {stats.map((s, i) => (
              <UsageStat key={i} {...s} />
            ))}
          </div>

          <div className="p-6 rounded-3xl border border-slate-200/60 bg-white shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Shield className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-semibold text-slate-900">
                Infrastructure
              </h4>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">
              Verified DKIM and SPF authentication active. Delivery reputation
              is high.
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {topOpen && (
          <TopUpModal usage={usage} onClose={() => setTopOpen(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
