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
      ring: "bg-emerald-50 border-emerald-100",
      iconColor: "text-emerald-600",
    },
    current: {
      icon: <Zap className="h-4 w-4" />,
      ring: "bg-blue-50 border-blue-100",
      iconColor: "text-blue-600",
    },
    pending: {
      icon: <Clock className="h-4 w-4" />,
      ring: "bg-slate-50 border-slate-200",
      iconColor: "text-slate-400",
    },
  };

  const config = statusConfig[status];

  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 }}
      onClick={onClick}
      className="group flex items-center gap-4 w-full text-left px-5 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all duration-200"
    >
      <div
        className={cn(
          "h-10 w-10 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-300",
          config.ring,
        )}
      >
        <span className={config.iconColor}>{config.icon}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Step {step}
          </span>
          {status === "complete" && (
            <span className="text-xs text-emerald-600 font-medium">
              Done
            </span>
          )}
        </div>
        <p className="text-[14px] font-semibold text-slate-900 mt-0.5 truncate leading-none">
          {title}
        </p>
        <p className="text-[12px] text-slate-500 mt-0.5 truncate leading-none">
          {description}
        </p>
      </div>

      <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-all shrink-0 group-hover:translate-x-1" />
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
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: delay * 0.05 }}
      className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {label}
        </span>
        <div
          className={cn(
            "h-8 w-8 rounded-lg flex items-center justify-center",
            bg,
          )}
        >
          <Icon className={cn("h-4 w-4", color)} />
        </div>
      </div>
      <span className="text-2xl font-bold text-slate-900 tracking-tight tabular-nums leading-none">
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
      bg: "bg-amber-50 border-amber-200",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      text: "text-amber-800",
    },
    error: {
      bg: "bg-rose-50 border-rose-200",
      icon: <AlertTriangle className="h-4 w-4 text-rose-500" />,
      text: "text-rose-800",
    },
    info: {
      bg: "bg-sky-50 border-sky-200",
      icon: <Shield className="h-4 w-4 text-sky-500" />,
      text: "text-sky-800",
    },
  };
  const c = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl border",
        c.bg,
      )}
    >
      {c.icon}
      <span className={cn("text-[13px] font-medium flex-1 leading-none", c.text)}>
        {message}
      </span>
      {action && onAction && (
        <button
          onClick={onAction}
          className={cn(
            "text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all",
            c.text,
          )}
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
        <RefreshCw className="h-6 w-6 text-slate-400 animate-spin" />
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
      description: "Send emails from your brand domain (@" + (domainData?.domain || "yourdomain.com") + ")",
      route: "/settings/domains",
      status: hasDomain ? "complete" : "current",
    },
    {
      step: 2,
      title: "Design Templates",
      description: "Create branded email designs and reusable layouts",
      route: "/email/templates",
      status: "current",
    },
    {
      step: 3,
      title: "Send Emails",
      description: "Write and send emails to your members",
      route: "/email/send",
      status: "pending",
    },
    {
      step: 4,
      title: "Email Stats",
      description: "See how many emails were sent and opened",
      route: "/email/usage",
      status: usage.emailsSent > 0 ? "current" : "pending",
    },
  ];

  return (
    <div className="space-y-10 py-6 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto overflow-hidden">
      {/* Notifications */}
      {usagePercent >= 90 && (
        <NotificationBanner
          type="error"
          message={`Account Alert: You have exhausted ${usagePercent}% of your monthly email quota.`}
          action="Add Credits"
          onAction={() => router.push("/email/usage")}
        />
      )}

      {/* Hero Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 shadow-lg shadow-slate-200">
            <Mail className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-[20px] font-semibold tracking-tight text-slate-900 leading-none">
              Email Campaigns
            </h1>
            <p className="text-[13px] text-slate-500 mt-1 font-medium leading-none">
              Manage your emails, templates, and track how they perform.
            </p>
          </div>
        </div>
        <button
          onClick={() => router.push("/email/send")}
          className="h-11 px-6 bg-slate-900 hover:bg-black text-white text-[13px] font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2"
        >
          <Send className="h-4 w-4" />
          Send New Email
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <QuickStat
              icon={BarChart3}
              label="Emails Sent"
              value={usage.emailsSent.toLocaleString()}
              color="text-slate-600"
              bg="bg-slate-50"
              delay={0}
            />
            <QuickStat
              icon={TrendingUp}
              label="Monthly Quota"
              value={usage.numberOfEmailsPerMonth.toLocaleString()}
              color="text-emerald-600"
              bg="bg-emerald-50"
              delay={1}
            />
            <QuickStat
              icon={Clock}
              label="Credits Remaining"
              value={usage.remaining.toLocaleString()}
              color="text-amber-600"
              bg="bg-amber-50"
              delay={2}
            />
            <QuickStat
              icon={Zap}
              label="Usage"
              value={`${Math.round(usagePercent)}%`}
              color="text-slate-600"
              bg="bg-slate-50"
              delay={3}
            />
          </div>

          {/* Quick Links */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-medium text-slate-400 px-1">
              Quick access
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  icon: PaintBucket,
                  title: "Email Templates",
                  desc: "Create and edit designs",
                  route: "/email/templates",
                  color: "bg-indigo-50 text-indigo-600 border-indigo-100",
                },
                {
                  icon: Globe,
                  title: "Domain Settings",
                  desc: "Set up domain for sending",
                  route: "/settings/domains",
                  color: "bg-slate-50 text-slate-600 border-slate-200",
                },
              ].map((link, i) => (
                <button
                  key={link.route}
                  onClick={() => router.push(link.route)}
                  className="group flex flex-col gap-4 p-5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all text-left shadow-sm"
                >
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center border transition-transform duration-300 group-hover:scale-110", link.color)}>
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-[14px] font-semibold text-slate-900">{link.title}</h4>
                    <p className="text-[12px] text-slate-500 mt-0.5">{link.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar / Progress Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center text-slate-900 border border-slate-200">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Setup Guide
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your onboarding progress
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3">
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
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <Info className="h-4 w-4" />
              </div>
              <p className="text-[12px] text-slate-500 leading-relaxed">
                All emails are secured and protected to ensure they land in the inbox.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
