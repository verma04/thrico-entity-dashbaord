"use client";

import React, { useRef } from "react";
import {
  Pencil,
  FileUp,
  Users,
  Globe,
  X,
  Download,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  Plus,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecipientMode } from "./types";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { EmailUserGroup } from "@/graphql/actions/email";

interface RecipientManagerProps {
  recipients: string[];
  setRecipients: (recipients: string[]) => void;
  recipientMode: RecipientMode;
  setRecipientMode: (mode: RecipientMode) => void;
  emailInput: string;
  setEmailInput: (input: string) => void;
  addEmail: () => void;
  userGroups: EmailUserGroup[];
  userGroupsLoading: boolean;
  remainingQuota: number;
  totalRecipientCount: number;
}

export function RecipientManager({
  recipients,
  setRecipients,
  recipientMode,
  setRecipientMode,
  emailInput,
  setEmailInput,
  addEmail,
  userGroups,
  userGroupsLoading,
  remainingQuota,
  totalRecipientCount,
}: RecipientManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadCSVTemplate = () => {
    const csvContent = "email\nrecipient1@example.com\nrecipient2@example.com";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "thrico_recipient_template.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("CSV template downloaded.");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r?\n/).filter((line) => line.trim());
      if (lines.length === 0) {
        toast.error("The uploaded CSV file is empty.");
        return;
      }
      const headers = lines[0].toLowerCase().split(",");
      const emailIndex = headers.indexOf("email");
      const finalIndex = emailIndex === -1 ? 0 : emailIndex;
      const newEmails = lines
        .slice(1)
        .map((line) => line.split(",")[finalIndex]?.trim().toLowerCase())
        .filter((email) => email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));

      const uniqueEmails = Array.from(new Set([...recipients, ...newEmails]));
      const addedCount = uniqueEmails.length - recipients.length;
      setRecipients(uniqueEmails);
      toast.success(`${addedCount} contacts imported from CSV.`);
      if (fileInputRef.current) fileInputRef.current.value = "";
    };
    reader.readAsText(file);
  };

  const importGroup = (group: EmailUserGroup) => {
    const groupIdentifier = `GROUP:${group.name}`;
    if (recipients.includes(groupIdentifier)) {
      toast.error(`Group "${group.name}" is already added.`);
      return;
    }
    setRecipients([...recipients, groupIdentifier]);
    toast.success(`Group "${group.name}" added (${group.count} recipients).`);
  };

  const modes = [
    { key: "manual", icon: Pencil, label: "Manual Entry" },
    { key: "csv", icon: FileUp, label: "CSV Spreadsheet" },
    { key: "community", icon: Users, label: "Audience Groups" },
  ] as const;

  const quotaExceeded = totalRecipientCount > remainingQuota;

  return (
    <div className="space-y-4">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-border/60">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-[14px] font-bold text-foreground">
              Target Audience
            </h2>
            {totalRecipientCount > 0 && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-1.5 py-0 h-4.5 font-semibold rounded-[3px] border",
                  quotaExceeded
                    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                )}
              >
                {totalRecipientCount.toLocaleString()} Target
                {totalRecipientCount === 1 ? "" : "s"}
              </Badge>
            )}
          </div>
          <p className="text-[12px] text-muted-foreground mt-0.5">
            Add individual emails, import a CSV list, or choose audience segments.
          </p>
        </div>

        {/* Polaris Segmented Tabs */}
        <div className="flex items-center p-0.5 bg-[#f1f1f2] dark:bg-zinc-800/80 rounded-[5px] border border-border/60 self-start sm:self-auto">
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = recipientMode === m.key;
            return (
              <button
                key={m.key}
                type="button"
                onClick={() => setRecipientMode(m.key)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] text-[11.5px] font-medium transition-all cursor-pointer",
                  isSelected
                    ? "bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-100 shadow-2xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="h-3 w-3" />
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mode Action Panel */}
      <div className="bg-white dark:bg-zinc-900 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 p-4 shadow-2xs">
        {/* 1. Manual Entry */}
        {recipientMode === "manual" && (
          <div className="space-y-3">
            <label className="text-[12px] font-semibold text-foreground block">
              Enter Email Address
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
                <Input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="e.g. member@community.org"
                  className="pl-8 h-[32px] rounded-[4px] text-[12px] bg-background border-[#8a8a8a] dark:border-zinc-700"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addEmail();
                    }
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={addEmail}
                className="h-[32px] px-3.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 rounded-[4px] text-[12px] font-semibold shrink-0 cursor-pointer gap-1.5"
              >
                <Plus className="h-3 w-3" />
                Add Recipient
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tip: Press Enter after typing each email to quickly add multiple recipients.
            </p>
          </div>
        )}

        {/* 2. CSV Upload */}
        {recipientMode === "csv" && (
          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-8 rounded-[6px] border-2 border-dashed border-[#d2d5d9] dark:border-zinc-800 flex flex-col items-center justify-center gap-2 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-[#f9fafb] dark:hover:bg-zinc-800/40 transition-all cursor-pointer text-center px-4"
            >
              <div className="h-9 w-9 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 border border-border/60 flex items-center justify-center text-[#616161]">
                <FileSpreadsheet className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[12.5px] font-bold text-foreground">
                  Click to choose CSV or drag and drop
                </p>
                <p className="text-[11px] text-muted-foreground">
                  File must contain a column named <span className="font-semibold text-foreground">email</span>
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#f6f6f7] dark:bg-zinc-800/60 rounded-[6px] border border-border/60 text-[11.5px]">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Download className="h-3.5 w-3.5" />
                <span>Need an example file format?</span>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={downloadCSVTemplate}
                className="h-[26px] px-2 text-[11px] font-medium bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[3px] cursor-pointer"
              >
                Download CSV Sample
              </Button>
            </div>
          </div>
        )}

        {/* 3. Audience Groups */}
        {recipientMode === "community" && (
          <div className="space-y-3">
            {userGroupsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-2 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-7 w-7 rounded-[4px]" />
                      <Skeleton className="h-4 w-12 rounded-[3px]" />
                    </div>
                    <Skeleton className="h-3.5 w-24 rounded-[3px]" />
                  </div>
                ))}
              </div>
            ) : userGroups.length === 0 ? (
              <div className="py-8 text-center rounded-[6px] border border-dashed border-border/60">
                <p className="text-[12px] text-muted-foreground">
                  No predefined user groups found in your community database.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {userGroups.map((group) => {
                  const isAllUsers = group.name === "All Users";
                  const isAlreadyAdded = recipients.includes(`GROUP:${group.name}`);

                  return (
                    <button
                      key={group.name}
                      type="button"
                      disabled={isAlreadyAdded}
                      onClick={() => importGroup(group)}
                      className={cn(
                        "p-3 rounded-[6px] border text-left transition-all flex items-center justify-between gap-2.5 cursor-pointer shadow-2xs",
                        isAlreadyAdded
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800/50 opacity-80 cursor-default"
                          : isAllUsers
                          ? "border-[#303030] dark:border-zinc-600 bg-[#f9fafb] dark:bg-zinc-800 hover:bg-[#f1f1f2]"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-[4px] flex items-center justify-center border shrink-0",
                            isAlreadyAdded
                              ? "bg-emerald-600 text-white border-emerald-600"
                              : isAllUsers
                              ? "bg-[#303030] dark:bg-zinc-100 text-white dark:text-zinc-900 border-[#303030]"
                              : "bg-[#f6f6f7] dark:bg-zinc-800 text-muted-foreground border-border/60"
                          )}
                        >
                          {isAlreadyAdded ? (
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          ) : isAllUsers ? (
                            <Globe className="h-3.5 w-3.5" />
                          ) : (
                            <Users className="h-3.5 w-3.5" />
                          )}
                        </div>
                        <div className="min-w-0 space-y-0.5">
                          <h4 className="text-[12.5px] font-bold text-foreground truncate">
                            {group.name}
                          </h4>
                          <p className="text-[10.5px] text-muted-foreground">
                            {group.count.toLocaleString()} member
                            {group.count === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0">
                        {isAlreadyAdded ? (
                          <Badge
                            variant="secondary"
                            className="text-[9.5px] px-1.5 py-0 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 rounded-[3px]"
                          >
                            Added
                          </Badge>
                        ) : (
                          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                            + Add
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Recipients Summary Tray */}
      {recipients.length > 0 && (
        <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-2xs">
          <div className="flex items-center justify-between pb-2 border-b border-border/50">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  quotaExceeded ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                )}
              />
              <span className="text-[12.5px] font-bold text-foreground">
                {totalRecipientCount.toLocaleString()} Total Recipient
                {totalRecipientCount === 1 ? "" : "s"} Selected
              </span>
              <span className="text-[11px] text-muted-foreground">
                ({remainingQuota.toLocaleString()} credits available)
              </span>
            </div>

            <button
              type="button"
              onClick={() => setRecipients([])}
              className="flex items-center gap-1 text-[11px] font-medium text-red-600 dark:text-red-400 hover:underline cursor-pointer"
            >
              <Trash2 className="h-3 w-3" />
              Clear all
            </button>
          </div>

          {/* Quota warning */}
          {quotaExceeded && (
            <div className="p-2.5 rounded-[4px] bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-[11.5px] text-red-700 dark:text-red-300 font-medium">
                {totalRecipientCount.toLocaleString()} recipients exceeds your
                available quota of {remainingQuota.toLocaleString()} credits.
                Please remove some recipients or top up your quota.
              </p>
            </div>
          )}

          {/* Tag Chips */}
          <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
            {recipients.map((item) => {
              const isGroup = item.startsWith("GROUP:");
              const displayName = isGroup ? item.split("GROUP:")[1] : item;

              return (
                <div
                  key={item}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[4px] text-[11px] font-medium border group transition-all",
                    isGroup
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800"
                      : "bg-[#f6f6f7] dark:bg-zinc-800 text-foreground border-border/60"
                  )}
                >
                  {isGroup ? (
                    <Users className="h-3 w-3 opacity-70 shrink-0" />
                  ) : (
                    <Mail className="h-3 w-3 opacity-60 shrink-0" />
                  )}
                  <span className="truncate max-w-[200px]">{displayName}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setRecipients(recipients.filter((e) => e !== item))
                    }
                    className="h-3.5 w-3.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-red-600 transition-colors ml-0.5 cursor-pointer"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

