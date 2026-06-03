"use client";

import React, { useRef } from "react";
import { Pencil, FileUp, Users, Globe, X, Download, Trash2, FileSpreadsheet, AlertCircle, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecipientMode } from "./types";
import { toast } from "sonner";
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
    const uniqueEmails = Array.from(new Set([...recipients, ...group.emails]));
    const addedCount = uniqueEmails.length - recipients.length;
    setRecipients(uniqueEmails);
    toast.success(`${addedCount} recipients added from "${group.name}".`);
  };

  const modes = [
    { key: "manual", icon: Pencil, label: "Manual" },
    { key: "csv", icon: FileUp, label: "CSV" },
    { key: "community", icon: Users, label: "Groups" },
  ] as const;

  const quotaExceeded = recipients.length > remainingQuota;

  // Find "All Users" group for quick total
  const allUsersGroup = userGroups.find((g) => g.name === "All Users");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            Add Recipients
            {recipients.length > 0 && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                quotaExceeded ? "bg-red-50 text-red-600" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700"
              )}>
                {recipients.length} added
              </span>
            )}
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">Choose how to add your recipients.</p>
        </div>
        {/* Mode switcher */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-xl border border-border/50">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => setRecipientMode(m.key)}
              title={m.label}
              className={cn(
                "px-3 py-1.5 rounded-lg transition-all text-xs font-medium flex items-center gap-1.5",
                recipientMode === m.key
                  ? "bg-card shadow-sm border border-border/50 text-foreground"
                  : "text-muted-foreground/80 hover:text-foreground/80"
              )}
            >
              <m.icon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 p-6">
        {/* Manual Entry */}
        {recipientMode === "manual" && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-muted-foreground">Enter email address</label>
            <div className="flex gap-3">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="name@company.com"
                className="flex-1 h-11 px-4 rounded-xl border border-border/50 bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                onKeyDown={(e) => e.key === "Enter" && addEmail()}
              />
              <button
                onClick={addEmail}
                className="h-11 px-6 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-sm font-semibold hover:bg-black dark:hover:bg-white transition-all"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {/* CSV Import */}
        {recipientMode === "csv" && (
          <div className="space-y-4">
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-12 rounded-2xl border-2 border-dashed border-border/50 flex flex-col items-center justify-center gap-3 hover:border-slate-400 hover:bg-muted transition-all cursor-pointer"
            >
              <div className="h-12 w-12 rounded-2xl border border-border/50 bg-card flex items-center justify-center text-muted-foreground/80">
                <FileSpreadsheet className="h-6 w-6" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground">Click to upload CSV</p>
                <p className="text-xs text-muted-foreground/80 mt-1">Requires an "email" column header</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted rounded-xl border border-border/50">
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-muted-foreground/80" />
                <span className="text-xs font-medium text-foreground/80">Need the format?</span>
              </div>
              <button
                onClick={downloadCSVTemplate}
                className="text-xs font-semibold text-foreground/90 bg-card border border-border/50 px-3 py-1.5 rounded-lg hover:bg-muted transition-all"
              >
                Download sample
              </button>
            </div>
          </div>
        )}

        {/* User Groups (from API) */}
        {recipientMode === "community" && (
          <div className="space-y-4">
            {userGroupsLoading ? (
              <div className="h-32 flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-muted-foreground/50 animate-spin" />
              </div>
            ) : userGroups.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">No user groups found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userGroups.map((group) => {
                  const isAllUsers = group.name === "All Users";
                  return (
                    <button
                      key={group.name}
                      onClick={() => importGroup(group)}
                      className={cn(
                        "p-4 rounded-2xl border text-left transition-all hover:shadow-sm",
                        isAllUsers
                          ? "border-slate-900 bg-muted hover:bg-muted/50"
                          : "border-border/50 bg-card hover:border-border hover:bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center border",
                          isAllUsers
                            ? "bg-slate-900 dark:bg-slate-100 border-slate-900 text-white dark:text-slate-900"
                            : "bg-muted border-border/50 text-muted-foreground"
                        )}>
                          {isAllUsers ? <Globe className="h-4 w-4" /> : <Users className="h-4 w-4" />}
                        </div>
                        <span className="text-lg font-bold text-foreground tabular-nums">{group.count}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground">{group.name}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {group.count === 1 ? "1 recipient" : `${group.count} recipients`}
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recipient list */}
      {recipients.length > 0 && (
        <div className="rounded-2xl border border-border/50 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={cn("h-2 w-2 rounded-full", quotaExceeded ? "bg-red-500" : "bg-emerald-50 dark:bg-emerald-500/100")} />
              <span className="text-sm font-semibold text-foreground">{recipients.length} recipients</span>
              <span className="text-xs text-muted-foreground/80">/ {remainingQuota} credits remaining</span>
            </div>
            <button
              onClick={() => setRecipients([])}
              className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-all"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear all
            </button>
          </div>

          {quotaExceeded && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-medium">
                {recipients.length} recipients exceeds your {remainingQuota} remaining credits. Remove some or upgrade your plan.
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {recipients.map((email) => (
              <div
                key={email}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted text-foreground/90 text-xs font-medium border border-border/50 group"
              >
                {email}
                <button
                  onClick={() => setRecipients(recipients.filter((e) => e !== email))}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
