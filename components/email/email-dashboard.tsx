"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Mail,
  Globe,
  PaintBucket,
  Send,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
  TrendingUp,
  Shield,
  RefreshCw,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetEmailOverview,
  useGetEmailDomain,
} from "@/graphql/actions/email";

// ---------------------------------------------------------------------------
// Design Tokens
// ---------------------------------------------------------------------------
const STYLES = {
  card: "rounded-xl border border-slate-200/60 bg-white",
  statCard: "flex flex-col gap-2 p-5 rounded-xl border border-slate-200/60 bg-white shadow-xs",
  iconWrapper: "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border border-slate-100",
  heading: "text-[16px] font-black tracking-tight text-slate-900 leading-none",
  subtext: "text-[12px] text-slate-500 font-medium leading-none",
  button: "h-9 px-4 text-[12px] font-black rounded-xl transition-all flex items-center gap-2",
  primaryBtn: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm",
  secondaryBtn: "bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-xs",
};

// ---------------------------------------------------------------------------
// Progress Step
// ---------------------------------------------------------------------------
function SetupStep({
  step,
  title,
  description,
  status,
  onClick,
  delay,
}: {
  step: number;
  title: string;
  description: string;
  status: "complete" | "current" | "pending";
  onClick: () => void;
  delay: number;
}) {
  const statusConfig = {
    complete: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      bg: "bg-emerald-50/50 border-emerald-100",
      iconColor: "text-emerald-600",
    },
    current: {
      icon: <Zap className="h-4 w-4" />,
      bg: "bg-slate-50 border-slate-200",
      iconColor: "text-slate-900",
    },
    pending: {
      icon: <Clock className="h-4 w-4" />,
      bg: "bg-slate-50/30 border-slate-100",
      iconColor: "text-slate-300",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.03 }}
      onClick={onClick}
      className={cn(
        "group flex items-center gap-4 w-full text-left px-4 py-4 rounded-xl border transition-all duration-200",
        status === "current" ? "border-indigo-100 bg-indigo-50/30" : "border-slate-100 bg-white hover:border-slate-200 shadow-xs hover:shadow-sm"
      )}
    >
      <div
        className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center shrink-0 border",
          config.bg,
          config.iconColor
        )}
      >
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[9px] uppercase tracking-widest font-black text-slate-400">
            Step {step}
          </span>
          {status === "complete" && (
            <span className="text-[9px] uppercase tracking-widest font-black text-emerald-600">
              Complete
            </span>
          )}
        </div>
        <p className="text-[13px] font-black text-slate-900 truncate leading-none">
          {title}
        </p>
        <p className="text-[11px] font-medium text-slate-500 mt-1.5 truncate leading-none">
          {description}
        </p>
      </div>

      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-600 transition-all shrink-0 group-hover:translate-x-0.5" />
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Quick Stat Card
// ---------------------------------------------------------------------------
function QuickStat({
  icon: Icon,
  label,
  value,
  color,
  bg,
  delay,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.03 }}
      className={STYLES.statCard}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center border", bg)}>
          <Icon className={cn("h-3.5 w-3.5", color)} />
        </div>
      </div>
      <span className="text-xl font-black text-slate-900 tracking-tight tabular-nums mt-1.5">
        {value}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Notification Banner
// ---------------------------------------------------------------------------
function NotificationBanner({
  type,
  message,
  action,
  onAction,
}: {
  type: "warning" | "error" | "info";
  message: string;
  action?: string;
  onAction?: () => void;
}) {
  const config = {
    warning: {
      bg: "bg-amber-50/50 border-amber-200/50",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      text: "text-amber-900",
    },
    error: {
      bg: "bg-rose-50/50 border-rose-200/50",
      icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
      text: "text-rose-900",
    },
    info: {
      bg: "bg-slate-50 border-slate-200",
      icon: <Shield className="h-4 w-4 text-slate-900" />,
      text: "text-slate-900",
    },
  };
  const c = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xs",
        c.bg,
      )}
    >
      {c.icon}
      <span className={cn("text-[13px] font-black flex-1 leading-none", c.text)}>
        {message}
      </span>
      {action && onAction && (
        <button
          onClick={onAction}
          className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-all text-slate-700 shadow-xs active:scale-95"
        >
          {action}
        </button>
      )}
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------
export default function EmailDashboard() {
  const router = useRouter();

  const { data: overviewData, loading: overviewLoading } =
    useGetEmailOverview();

  // Custom Domain Logic
  const { data: emailData, loading: emailLoading } = useGetEmailDomain();
  const domainData = emailData?.getEmailDomain;

  if (overviewLoading || emailLoading || !overviewData) {
    return (
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-slate-300 animate-spin" />
      </div>
    );
  }

  const { usage } = overviewData.getEmailOverview;
  const usagePercent = usage.usagePercent;
  const hasDomain = !!domainData;

  const setupSteps = [
    {
      step: 1,
      title: "Confirm Domain",
      description: "Send emails from @" + (domainData?.domain || "yourdomain.com"),
      route: "/settings/domains",
      status: hasDomain ? "complete" : "current",
    },
    {
      step: 2,
      title: "Design Templates",
      description: "Create branded email layouts",
      route: "/email/templates",
      status: "current",
    },
    {
      step: 3,
      title: "Send Emails",
      description: "Write and send to members",
      route: "/email/send",
      status: "pending",
    },
    {
      step: 4,
      title: "Email Stats",
      description: "Track performance & opens",
      route: "/email/usage",
      status: usage.emailsSent > 0 ? "current" : "pending",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8">
      {/* Notifications */}
      {usagePercent >= 90 && (
        <NotificationBanner
          type="error"
          message={`Usage Alert: You have used ${Math.round(usagePercent)}% of your email quota.`}
          action="Add Credits"
          onAction={() => router.push("/email/usage")}
        />
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-indigo-600/20">
            <Mail className="h-5 w-5" />
          </div>
          <div className="pt-0.5">
            <h1 className={STYLES.heading}>Email Campaigns</h1>
            <p className="text-[13px] text-slate-500 mt-2 font-medium leading-none">
              Overview of your email communications and infrastructure.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/email/usage")}
            className={cn(STYLES.button, STYLES.secondaryBtn)}
          >
            Usage Analytics
          </button>
          <button
            onClick={() => router.push("/email/send")}
            className={cn(STYLES.button, STYLES.primaryBtn)}
          >
            <Send className="h-3.5 w-3.5" />
            New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Stats & Quick Links */}
        <div className="lg:col-span-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickStat
              icon={BarChart3}
              label="Sent"
              value={usage.emailsSent.toLocaleString()}
              color="text-slate-600"
              bg="bg-slate-50/50"
              delay={0}
            />
            <QuickStat
              icon={TrendingUp}
              label="Quota"
              value={usage.numberOfEmailsPerMonth.toLocaleString()}
              color="text-emerald-600"
              bg="bg-emerald-50/50"
              delay={1}
            />
            <QuickStat
              icon={Clock}
              label="Remaining"
              value={usage.remaining.toLocaleString()}
              color="text-amber-600"
              bg="bg-amber-50/50"
              delay={2}
            />
            <div className={cn(STYLES.statCard, "relative overflow-hidden")}>
               <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Used
                </span>
                <div className="h-7 w-7 rounded-md flex items-center justify-center border bg-slate-100">
                  <Zap className="h-3.5 w-3.5 text-slate-900" />
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight tabular-nums mt-1">
                {Math.round(usagePercent)}%
              </span>
              <div className="mt-3 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${usagePercent}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    usagePercent > 90 ? "bg-rose-500" : usagePercent > 70 ? "bg-amber-500" : "bg-slate-900"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Quick Access Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Email Toolbox
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: PaintBucket,
                  title: "Template Studio",
                  desc: "Design and manage layouts",
                  route: "/email/templates",
                  iconColor: "text-slate-900",
                },
                {
                  icon: Globe,
                  title: "Domain Verification",
                  desc: "DNS and deliverability",
                  route: "/settings/domains",
                  iconColor: "text-slate-600",
                },
              ].map((link, i) => (
                <button
                  key={link.route}
                  onClick={() => router.push(link.route)}
                  className="group flex items-start gap-4 p-5 rounded-lg border border-slate-200/60 bg-white hover:bg-slate-50 transition-all text-left"
                >
                  <div className="h-10 w-10 rounded-md flex items-center justify-center border border-slate-100 bg-slate-50 group-hover:scale-105 transition-transform">
                    <link.icon className={cn("h-5 w-5", link.iconColor)} />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900">{link.title}</h4>
                    <p className="text-[12px] text-slate-500 mt-1">{link.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Campaigns Placeholder */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Recent Campaigns
              </h3>
              <button 
                onClick={() => router.push("/email/campaigns")}
                className="text-[11px] font-semibold text-slate-900 hover:underline"
              >
                View all
              </button>
            </div>
            <div className={cn(STYLES.card, "divide-y divide-slate-100")}>
              {usage.emailsSent === 0 ? (
                <div className="p-8 text-center">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 mb-3">
                    <Send className="h-5 w-5" />
                  </div>
                  <p className="text-[13px] font-medium text-slate-900">No campaigns yet</p>
                  <p className="text-[12px] text-slate-500 mt-1">Ready to send your first email? Click "New Campaign" above.</p>
                </div>
              ) : (
                <div className="p-4 text-center text-slate-500 text-[12px]">
                  Feature coming soon: Detailed campaign history and per-email analytics.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Setup Guide */}
        <div className="lg:col-span-4 space-y-6">
          <div className={cn(STYLES.card, "p-6")}>
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-8 rounded-md bg-slate-50 flex items-center justify-center border border-slate-200 text-slate-900">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-[14px] font-semibold text-slate-900">Infrastructure</h2>
              </div>
            </div>

            <div className="space-y-2">
              {setupSteps.map((s, i) => (
                <SetupStep
                  key={s.step}
                  step={s.step}
                  title={s.title}
                  description={s.description}
                  status={s.status as any}
                  onClick={() => router.push(s.route)}
                  delay={i}
                />
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="flex gap-3">
                <Info className="h-4 w-4 text-slate-300 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500 leading-normal">
                  Our system automatically handles DKIM, SPF, and DMARC setups to maximize your inbox deliverability rates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
