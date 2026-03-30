"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Mail,
  CheckCircle2,
  Clock,
  Zap,
  X,
  ArrowUpRight,
  Shield,
  CreditCard,
  RefreshCw,
  Trophy,
  Activity,
  Layers,
  ArrowRight,
  Target,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
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
// Top-up Modal
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
  const [buyTopup, { loading: isBuying }] = useBuyEmailTopup();
  const [verifyPayment] = useVerifyEmailTopupPayment();

  const handleBuy = async () => {
    if (!selectedPack) {
      toast.error("Please select a top-up pack");
      return;
    }

    try {
      const { data } = await buyTopup({
        variables: { input: { topupId: selectedPack } },
      });

      const order = data?.buyEmailTopup;
      if (!order) return;

      const scriptLoaded = await loadRazorpay();
      if (!scriptLoaded) {
        toast.error("Failed to load payment gateway");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_AVIthfNy85rAR2",
        amount: order.amount,
        currency: order.currency,
        name: "Thrico",
        description: `Email Top-up: ${selectedPack}`,
        order_id: order.razorpayOrderId,
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
              toast.success("Payment verified and credits added!");
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
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      toast.error(error.message || "Failed to initiate purchase");
    }
  };

  const packs = topupData?.getEmailTopups || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-slate-950/20 backdrop-blur-sm p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.98, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.98, opacity: 0, y: 10 }}
        className="bg-white rounded-3xl shadow-xl max-w-lg w-full overflow-hidden border border-slate-200/60"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">
                Add Credits
              </h3>
              <p className="text-sm text-slate-500 mt-1">
                Current usage is at {usage.usagePercent}%
              </p>
            </div>
            <button
              onClick={onClose}
              className="h-10 w-10 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-3">
            {packsLoading ? (
              <div className="py-12 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-slate-300 animate-spin" />
              </div>
            ) : (
              packs.map((pack) => (
                <button
                  key={pack.topupId}
                  onClick={() => setSelectedPack(pack.topupId)}
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left",
                    selectedPack === pack.topupId
                      ? "border-slate-900 bg-slate-50"
                      : "border-slate-100 bg-white hover:border-slate-200",
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center border",
                        selectedPack === pack.topupId
                          ? "bg-white border-slate-200"
                          : "bg-slate-50 border-transparent",
                      )}
                    >
                      <Mail className="h-4 w-4 text-slate-600" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        {pack.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-xs text-slate-500">
                          {pack.numberOfEmails.toLocaleString()} units
                        </p>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <p className="text-xs font-medium text-emerald-600">
                          ₹{(pack.price / pack.numberOfEmails).toFixed(2)} /
                          email
                        </p>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-slate-900 py-1 px-3 bg-slate-100 rounded-lg">
                    ₹{pack.price}
                  </span>
                </button>
              ))
            )}
          </div>

          <button
            onClick={handleBuy}
            disabled={!selectedPack || isBuying}
            className={cn(
              "w-full mt-8 h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all",
              selectedPack && !isBuying
                ? "bg-slate-900 text-white hover:bg-black shadow-sm"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200",
            )}
          >
            {isBuying ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4" />
            )}
            {isBuying ? "Processing..." : "Purchase Credits"}
          </button>
        </div>
      </motion.div>
    </motion.div>
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
          logs.map((log) => (
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
          history.slice(0, 3).map((item) => (
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
                  {usagePercent}%
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
