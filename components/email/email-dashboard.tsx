"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Globe,
  PaintBucket,
  Send,
  BarChart3,
  ArrowRight,
  AlertTriangle,
  Zap,
  ShieldCheck,
  RefreshCw,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  useGetEmailOverview,
  useGetEmailDomain,
} from "@/graphql/actions/email";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { UsageTopupModal } from "./usage/usage-topup-modal";
import {
  EmailNorthStar,
  EmailPipelineNav,
  EmailDeliverabilityHealth,
  EmailQuotaCapacity,
  EmailCampaignEngagement,
  EmailRecentCampaigns,
  EmailDomainHealth,
} from "./kpi-dashboard";

interface EmailDashboardProps {
  dateRange?: any;
  timeRange?: string;
}

export default function EmailDashboard({
  dateRange,
  timeRange,
}: EmailDashboardProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("deliverability");
  const [showTopupModal, setShowTopupModal] = useState(false);
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  const {
    data: overviewData,
    loading: overviewLoading,
    refetch: refetchOverview,
  } = useGetEmailOverview();

  const {
    data: emailData,
    loading: emailLoading,
    refetch: refetchDomain,
  } = useGetEmailDomain();

  // Listen to refresh events from page header
  useEffect(() => {
    const handleRefreshEvent = () => {
      refetchOverview();
      refetchDomain();
    };
    window.addEventListener("refresh-email-dashboard", handleRefreshEvent);
    return () => {
      window.removeEventListener("refresh-email-dashboard", handleRefreshEvent);
    };
  }, [refetchOverview, refetchDomain]);

  const scrollToSection = (key: string) => {
    setActiveSection(key);
    const el = document.getElementById(`kpi-section-${key}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const domainData = emailData?.getEmailDomain;
  const overview = overviewData?.getEmailOverview;
  const usage = overview?.usage || {
    emailsSent: 0,
    numberOfEmailsPerMonth: 5000,
    usagePercent: 0,
    remaining: 5000,
    periodEnd: new Date(Date.now() + 18 * 86400000).toISOString(),
  };

  const usagePercent = usage.usagePercent || (usage.emailsSent / (usage.numberOfEmailsPerMonth || 1)) * 100;
  const loading = overviewLoading || emailLoading;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Quota / Limit Warning Banner */}
      {usagePercent >= 85 && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="h-4 w-4 text-rose-600 dark:text-rose-400 shrink-0" />
            <span className="text-xs font-semibold">
              Quota Limit Warning: You have consumed {Math.round(usagePercent)}% of your monthly email allowance.
            </span>
          </div>
          <Button
            size="sm"
            onClick={() => setShowTopupModal(true)}
            className="h-7 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-[4px]"
          >
            Add Credits
          </Button>
        </div>
      )}

      {/* North Star Deliverability Metric */}
      <EmailNorthStar
        loading={loading}
        emailsSent={usage.emailsSent}
        monthlyQuota={usage.numberOfEmailsPerMonth}
        usagePercent={usagePercent}
      />

      {/* KPI Pipeline Navigation */}
      <EmailPipelineNav
        activeSection={activeSection}
        onSectionClick={scrollToSection}
      />

      {/* 1. Deliverability & Transmission Health */}
      <EmailDeliverabilityHealth
        loading={loading}
        emailsSent={usage.emailsSent}
      />

      {/* 2. Quota Capacity & Top-Up Velocity */}
      <EmailQuotaCapacity
        loading={loading}
        usage={usage}
        onAddCredits={() => setShowTopupModal(true)}
        onManagePlan={() => setShowBuyPlanDialog(true)}
      />

      {/* 3. Campaign Performance & Engagement */}
      <EmailCampaignEngagement loading={loading} />

      {/* 4. Recent Campaigns Feed */}
      <EmailRecentCampaigns
        loading={loading}
        recentEmails={overview?.recentEmails}
      />

      {/* 5. Infrastructure & DNS Deliverability */}
      <EmailDomainHealth loading={loading} domain={domainData} />

      {/* 6. Quick Launchpad */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Zap className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              6. Quick Launchpad & Workflows
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Direct access to template studio, automation triggers, and quota top-ups
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: "Template Studio",
              description: "Design reusable responsive layouts",
              icon: PaintBucket,
              route: "/email/templates",
              color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-100 dark:border-blue-900/40",
            },
            {
              title: "Send Campaign",
              description: "Broadcast to segments or tiers",
              icon: Send,
              route: "/email/send",
              color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/40",
            },
            {
              title: "Email Automations",
              description: "Configure event-based triggers",
              icon: Zap,
              route: "/email/automation",
              color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/40",
            },
            {
              title: "Usage & Invoices",
              description: "Review credit consumption logs",
              icon: BarChart3,
              route: "/email/usage",
              color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/40",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => router.push(item.route)}
                className="group flex items-start gap-3 p-4 rounded-xl border border-border/60 bg-card hover:border-border hover:shadow-2xs transition-all text-left cursor-pointer"
              >
                <div className={cn("h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border", item.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Top-up Credits Modal */}
      {showTopupModal && (
        <UsageTopupModal
          onClose={() => setShowTopupModal(false)}
          usage={usage}
        />
      )}
    </div>
  );
}
