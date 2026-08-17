"use client";

import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bell, Mail, Loader2, Crown } from "lucide-react";
import { Rank, useUpdateRankNotifications } from "@/graphql/actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RankNotificationModalProps {
  rank: Rank | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function RankNotificationModal({
  rank,
  open,
  onOpenChange,
  onSuccess,
}: RankNotificationModalProps) {
  const [updateRankNotifications, { loading: isUpdating }] =
    useUpdateRankNotifications();

  const [allowPush, setAllowPush] = useState(true);
  const [pushTitle, setPushTitle] = useState("");
  const [pushBody, setPushBody] = useState("");

  const [allowEmail, setAllowEmail] = useState(true);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");

  const [activeTab, setActiveTab] = useState<"push" | "email">("push");

  useEffect(() => {
    if (rank) {
      setAllowPush(rank.allowPushNotification !== false);
      setPushTitle(rank.pushNotificationTitle || "");
      setPushBody(rank.pushNotificationBody || "");

      setAllowEmail(rank.allowEmailNotification !== false);
      setEmailSubject(rank.emailNotificationSubject || "");
      setEmailBody(rank.emailNotificationBody || "");
    }
  }, [rank, open]);

  const handleSave = async () => {
    if (!rank) return;

    try {
      const res = await updateRankNotifications({
        variables: {
          id: rank.id,
          input: {
            allowPushNotification: allowPush,
            pushNotificationTitle: allowPush ? pushTitle : undefined,
            pushNotificationBody: allowPush ? pushBody : undefined,
            allowEmailNotification: allowEmail,
            emailNotificationSubject: allowEmail ? emailSubject : undefined,
            emailNotificationBody: allowEmail ? emailBody : undefined,
          },
        },
      });

      if (res.errors && res.errors.length > 0) {
        throw new Error(res.errors[0].message);
      }

      toast.success("Notification settings updated successfully");
      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      const errorMsg =
        error?.graphQLErrors?.[0]?.message ||
        error?.networkError?.result?.errors?.[0]?.message ||
        error?.message ||
        "Failed to update notification settings";
      toast.error("Update Failed", {
        description: errorMsg,
      });
    }
  };

  const insertVariable = (
    field: "pushBody" | "emailBody",
    variable: string,
  ) => {
    if (field === "pushBody") {
      setPushBody((prev) => `${prev} ${variable}`.trim());
    } else {
      setEmailBody((prev) => `${prev} ${variable}`.trim());
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[620px] p-0 overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-3">
            {rank ? (
              <div
                className="h-10 w-10 rounded-xl border flex items-center justify-center text-lg shrink-0 overflow-hidden shadow-xs"
                style={{
                  backgroundColor: `${rank.color}15`,
                  borderColor: `${rank.color}30`,
                }}
              >
                <BadgeIcon icon={rank.icon} className="h-full w-full" />
              </div>
            ) : (
              <div className="h-10 w-10 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs shrink-0 flex items-center justify-center">
                <Crown className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100 truncate">
                Notification Templates
              </DialogTitle>
              <DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 truncate">
                Customize alert messages for{" "}
                <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                  {rank?.name}
                </span>{" "}
                ({rank?.minPoints?.toLocaleString()} – {rank?.maxPoints?.toLocaleString()} pts)
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-5">
          <Tabs
            value={activeTab}
            onValueChange={(val) => setActiveTab(val as "push" | "email")}
            className="w-full"
          >
            <TabsList className="grid grid-cols-2 w-full h-10 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              <TabsTrigger
                value="push"
                className="text-xs font-semibold gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 rounded-lg shadow-2xs transition-all"
              >
                <Bell className="h-3.5 w-3.5" />
                Push Notification
                {allowPush && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="text-xs font-semibold gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-900 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-zinc-100 rounded-lg shadow-2xs transition-all"
              >
                <Mail className="h-3.5 w-3.5" />
                Email Notification
                {allowEmail && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                )}
              </TabsTrigger>
            </TabsList>

            {/* Push Notification Content */}
            <TabsContent value="push" className="space-y-4 pt-3 mt-0">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="allowPushToggleRank"
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    Enable Push Notification
                  </Label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Alert the member on rank promotion directly to their device.
                  </p>
                </div>
                <Switch
                  id="allowPushToggleRank"
                  checked={allowPush}
                  onCheckedChange={setAllowPush}
                  className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                />
              </div>

              {allowPush && (
                <div className="space-y-3.5 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="modalPushTitleRank"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Notification Title
                    </Label>
                    <Input
                      id="modalPushTitleRank"
                      placeholder="e.g. 👑 You've been promoted!"
                      value={pushTitle}
                      onChange={(e) => setPushTitle(e.target.value)}
                      className="h-10 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="modalPushBodyRank"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Notification Message Body
                    </Label>
                    <Textarea
                      id="modalPushBodyRank"
                      placeholder="e.g. Congrats! You've reached {{rankName}}!"
                      value={pushBody}
                      onChange={(e) => setPushBody(e.target.value)}
                      className="min-h-[85px] text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-zinc-600 dark:text-zinc-300">
                      Variables:
                    </span>
                    <button
                      type="button"
                      onClick={() => insertVariable("pushBody", "{{rankName}}")}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700 transition-colors font-mono text-[10px]"
                    >
                      {"{{rankName}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable("pushBody", "{{userName}}")}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700 transition-colors font-mono text-[10px]"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Email Notification Content */}
            <TabsContent value="email" className="space-y-4 pt-3 mt-0">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700/80 bg-zinc-50/50 dark:bg-zinc-800/30">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="allowEmailToggleRank"
                    className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 cursor-pointer"
                  >
                    Enable Email Notification
                  </Label>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    Send a celebratory email when a member achieves this rank tier.
                  </p>
                </div>
                <Switch
                  id="allowEmailToggleRank"
                  checked={allowEmail}
                  onCheckedChange={setAllowEmail}
                  className="data-[state=checked]:bg-zinc-900 dark:data-[state=checked]:bg-zinc-100"
                />
              </div>

              {allowEmail && (
                <div className="space-y-3.5 animate-in fade-in-50 duration-200">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="modalEmailSubjectRank"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email Subject
                    </Label>
                    <Input
                      id="modalEmailSubjectRank"
                      placeholder="e.g. You've reached {{rankName}}!"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="h-10 text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="modalEmailBodyRank"
                      className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
                    >
                      Email Message / Content
                    </Label>
                    <Textarea
                      id="modalEmailBodyRank"
                      placeholder="e.g. Congratulations on reaching {{rankName}}!"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="min-h-[85px] text-xs bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                    <span className="font-medium text-zinc-600 dark:text-zinc-300">
                      Variables:
                    </span>
                    <button
                      type="button"
                      onClick={() => insertVariable("emailBody", "{{rankName}}")}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700 transition-colors font-mono text-[10px]"
                    >
                      {"{{rankName}}"}
                    </button>
                    <button
                      type="button"
                      onClick={() => insertVariable("emailBody", "{{userName}}")}
                      className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200/80 dark:border-zinc-700 transition-colors font-mono text-[10px]"
                    >
                      {"{{userName}}"}
                    </button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={isUpdating}
            className="text-xs h-9 px-4 rounded-xl border-zinc-200 dark:border-zinc-700"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isUpdating}
            className="text-xs h-9 px-4 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 font-semibold"
          >
            {isUpdating && <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
