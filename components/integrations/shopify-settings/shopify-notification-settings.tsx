"use client";

import React from "react";
import { Bell, Mail, Send, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { cn } from "@/lib/utils";

interface ShopifyNotificationSettingsProps {
  allowPushNotifications: boolean;
  setAllowPushNotifications: (val: boolean) => void;
  sendEmailOnSent: boolean;
  setSendEmailOnSent: (val: boolean) => void;
  notifyOnRewardDelivery: boolean;
  setNotifyOnRewardDelivery: (val: boolean) => void;
  notifyOnOrderSync: boolean;
  setNotifyOnOrderSync: (val: boolean) => void;
}

export function ShopifyNotificationSettings({
  allowPushNotifications,
  setAllowPushNotifications,
  sendEmailOnSent,
  setSendEmailOnSent,
  notifyOnRewardDelivery,
  setNotifyOnRewardDelivery,
  notifyOnOrderSync,
  setNotifyOnOrderSync,
}: ShopifyNotificationSettingsProps) {
  return (
    <PolarisFormCard
      step={2}
      title="Member Notifications & Dispatch Channels"
      description="Configure real-time mobile push alerts and automated email confirmations when rewards, vouchers, or sync events occur."
      badge="Channels"
    >
      <div className="space-y-4">
        {/* Two primary channel toggle cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Channel 1: Allow Push Notifications */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-xs">
                <Bell className="h-4 w-4" />
              </div>
              <Switch
                checked={allowPushNotifications}
                onCheckedChange={setAllowPushNotifications}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer">
                  Allow Push Notifications
                </Label>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold",
                    allowPushNotifications
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                >
                  {allowPushNotifications ? "Enabled" : "Muted"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Dispatch real-time in-app and mobile push alerts to members when
                loyalty points or tier badges are awarded.
              </p>
            </div>
          </div>

          {/* Channel 2: Send Email When Sent */}
          <div className="p-4 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex flex-col justify-between space-y-3.5">
            <div className="flex items-start justify-between gap-3">
              <div className="h-9 w-9 rounded-lg bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center shrink-0 shadow-xs">
                <Mail className="h-4 w-4" />
              </div>
              <Switch
                checked={sendEmailOnSent}
                onCheckedChange={setSendEmailOnSent}
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-bold text-zinc-900 dark:text-zinc-100 cursor-pointer">
                  Send Email When Sent
                </Label>
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[9px] font-bold",
                    sendEmailOnSent
                      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
                  )}
                >
                  {sendEmailOnSent ? "Enabled" : "Muted"}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Automatically send transactional confirmation emails and coupon
                codes to member email inboxes upon distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Granular Trigger Toggles */}
        <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-800/40 divide-y divide-zinc-100 dark:divide-zinc-800">
          <div className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Notify Members on Gamification Reward Issuance
                </span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Trigger notifications immediately when checkout rewards or
                  discount codes are awarded.
                </p>
              </div>
            </div>
            <Switch
              checked={notifyOnRewardDelivery}
              onCheckedChange={setNotifyOnRewardDelivery}
            />
          </div>

          <div className="p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-7 w-7 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                <Send className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  Notify Admin on Store Synchronization Digests
                </span>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400">
                  Send summary alerts to administrators upon completion of large
                  customer and order syncs.
                </p>
              </div>
            </div>
            <Switch
              checked={notifyOnOrderSync}
              onCheckedChange={setNotifyOnOrderSync}
            />
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}
