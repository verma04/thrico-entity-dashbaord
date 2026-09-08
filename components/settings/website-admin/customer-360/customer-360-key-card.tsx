"use client";

import React, { useState } from "react";
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Calendar,
  Sparkles,
  Edit2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Customer360ApiKey } from "@/graphql/actions/customer-360-api-key";
import { toast } from "sonner";

interface Customer360KeyCardProps {
  apiKey: Customer360ApiKey | null;
  loading: boolean;
  onCreateKey: () => void;
  onRegenerateKey: () => void;
  onDeleteKey: () => void;
  onToggleActive: (isActive: boolean) => void;
  onUpdateName: (name: string) => void;
  isCreating: boolean;
  isRegenerating: boolean;
  isDeleting: boolean;
}

export function Customer360KeyCard({
  apiKey,
  loading,
  onCreateKey,
  onRegenerateKey,
  onDeleteKey,
  onToggleActive,
  onUpdateName,
  isCreating,
  isRegenerating,
  isDeleting,
}: Customer360KeyCardProps) {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(apiKey?.name || "Customer 360 Production Key");
  const [confirmRegenerateOpen, setConfirmRegenerateOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const handleCopy = () => {
    if (!apiKey?.apiKey) return;
    navigator.clipboard.writeText(apiKey.apiKey);
    setCopied(true);
    toast.success("API key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    if (!nameValue.trim()) return;
    onUpdateName(nameValue.trim());
    setIsEditingName(false);
  };

  const maskedKey = apiKey?.apiKey
    ? `${apiKey.apiKey.slice(0, 8)}••••••••••••••••••••••••${apiKey.apiKey.slice(-4)}`
    : "";

  if (!apiKey && !loading) {
    return (
      <PolarisFormCard
        icon={KeyRound}
        title="Customer 360 API Credential"
        description="Generate a secure programmatic token to access Customer 360 intelligence and analytics."
        badge="Unprovisioned"
        badgeVariant="outline"
      >
        <div className="py-6 px-4 flex flex-col items-center justify-center text-center space-y-4 bg-[#f9fafb] dark:bg-zinc-800/40 border border-dashed border-[#d2d5d9] dark:border-zinc-700 rounded-lg">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <KeyRound className="h-6 w-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-sm font-semibold text-foreground">No Customer 360 Key Provisioned</h4>
            <p className="text-xs text-muted-foreground">
              Create an API key to securely bridge your website, community CRM, and custom integrations with real-time unified audience intelligence.
            </p>
          </div>
          <Button
            onClick={onCreateKey}
            disabled={isCreating}
            className="h-9 px-4 gap-2 bg-primary text-primary-foreground font-medium text-xs shadow-xs"
          >
            {isCreating ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            Generate Customer 360 API Key
          </Button>
        </div>
      </PolarisFormCard>
    );
  }

  return (
    <>
      <PolarisFormCard
        icon={KeyRound}
        title="Customer 360 API Credential"
        description="Your secret authentication token for querying Customer 360 metrics, module status, and profile graphs."
        badge={apiKey?.isActive ? "Active Key" : "Suspended"}
        badgeVariant={apiKey?.isActive ? "emerald" : "outline"}
      >
        <div className="space-y-4 pt-1">
          {/* Top Bar: Name & Active Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#e1e3e5] dark:border-zinc-800">
            <div className="flex items-center gap-2">
              {isEditingName ? (
                <div className="flex items-center gap-1.5">
                  <Input
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    className="h-8 text-xs font-semibold max-w-xs"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveName();
                      if (e.key === "Escape") setIsEditingName(false);
                    }}
                  />
                  <Button size="sm" variant="default" className="h-8 px-2.5 text-xs" onClick={handleSaveName}>
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-xs"
                    onClick={() => setIsEditingName(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 group">
                  <span className="text-sm font-semibold text-foreground">
                    {apiKey?.name || "Customer 360 Production Key"}
                  </span>
                  <button
                    onClick={() => {
                      setNameValue(apiKey?.name || "Customer 360 Production Key");
                      setIsEditingName(true);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-foreground transition-opacity"
                    title="Rename key"
                  >
                    <Edit2 className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground font-medium">
                {apiKey?.isActive ? "Enabled" : "Disabled"}
              </span>
              <Switch
                checked={apiKey?.isActive ?? false}
                onCheckedChange={onToggleActive}
                className="data-[state=checked]:bg-emerald-600"
              />
            </div>
          </div>

          {/* Token Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground flex items-center justify-between">
              <span>Authorization Secret Token</span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-normal">
                Pass in <code className="bg-muted px-1 py-0.5 rounded text-[10px]">X-Customer-360-Key</code> header
              </span>
            </label>

            <div className="flex items-center gap-2 p-2 bg-[#f4f5f6] dark:bg-zinc-800/80 rounded-lg border border-[#e1e3e5] dark:border-zinc-700 font-mono text-xs">
              <div className="flex-1 overflow-x-auto select-all text-foreground font-medium tracking-wide py-0.5 px-1">
                {showKey ? apiKey?.apiKey : maskedKey}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowKey(!showKey)}
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                  title={showKey ? "Hide API key" : "Show full API key"}
                >
                  {showKey ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 gap-1.5 px-2.5 text-xs bg-white dark:bg-zinc-900 shadow-2xs font-sans"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-600 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Metadata & Actions Footer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Created {apiKey?.createdAt ? new Date(apiKey.createdAt).toLocaleDateString() : "Recently"}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {apiKey?.lastUsedAt
                  ? `Last used ${new Date(apiKey.lastUsedAt).toLocaleString()}`
                  : "Never used yet"}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirmRegenerateOpen(true)}
                disabled={isRegenerating}
                className="h-7 gap-1.5 text-xs text-foreground px-2.5"
              >
                <RefreshCw className={`h-3 w-3 ${isRegenerating ? "animate-spin" : ""}`} />
                Roll Key
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={isDeleting}
                className="h-7 gap-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 px-2"
              >
                <Trash2 className="h-3 w-3" />
                Revoke
              </Button>
            </div>
          </div>
        </div>
      </PolarisFormCard>

      {/* Confirmation: Roll / Regenerate */}
      <AlertDialog open={confirmRegenerateOpen} onOpenChange={setConfirmRegenerateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
              <ShieldAlert className="h-5 w-5" />
              Regenerate Customer 360 Key?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                Rolling this key will instantly invalidate the current API key. Any running background worker, customer portal, or automation relying on the old token will experience authentication failures until updated.
              </p>
              <p className="font-medium text-foreground">
                Do you want to proceed with regenerating the secret key?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmRegenerateOpen(false);
                onRegenerateKey();
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Yes, Roll Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Confirmation: Revoke / Delete */}
      <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-red-600">
              <Trash2 className="h-5 w-5" />
              Revoke Customer 360 API Key?
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>
                This will permanently delete the current API key. External applications using this credential will no longer have access to Customer 360 endpoints.
              </p>
              <p className="text-xs text-muted-foreground">
                You can generate a new key at any time, but the old token cannot be recovered.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setConfirmDeleteOpen(false);
                onDeleteKey();
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Revoke Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
