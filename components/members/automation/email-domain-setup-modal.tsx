"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Mail,
  ShieldAlert,
  ArrowRight,
  ShieldCheck,
  Zap,
  AlertTriangle,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useEmailDomainStatus } from "@/hooks/use-email-domain-status";

interface EmailDomainSetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmailDomainSetupModal: React.FC<EmailDomainSetupModalProps> = ({
  open,
  onOpenChange,
}) => {
  const router = useRouter();
  const { domain, isConfigured, isVerified, isPending, isFailed, loading } =
    useEmailDomainStatus();

  const handleNavigateToSettings = () => {
    onOpenChange(false);
    router.push("/settings/domains");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-6 gap-5">
        <DialogHeader className="gap-2 text-left">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shrink-0 shadow-2xs">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <DialogTitle className="text-base font-bold text-foreground flex items-center gap-2">
              Email Domain Setup Required
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Automated member emails cannot be dispatched until a custom business
              domain is registered and verified with DNS records (SPF & DKIM).
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Current Domain Status Card */}
        <div className="p-3.5 rounded-xl border border-border bg-muted/30 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
              Sender Domain Status
            </span>
            {loading ? (
              <Badge variant="outline" className="text-[10px] gap-1">
                <RefreshCw className="w-3 h-3 animate-spin" /> Checking...
              </Badge>
            ) : !isConfigured ? (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-rose-600 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40"
              >
                Not Configured
              </Badge>
            ) : isPending ? (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-amber-600 border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40"
              >
                Pending DNS Verification
              </Badge>
            ) : isFailed ? (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-rose-600 border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40"
              >
                DNS Check Failed
              </Badge>
            ) : isVerified ? (
              <Badge
                variant="outline"
                className="text-[10px] font-bold text-emerald-600 border-emerald-300 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40"
              >
                Verified
              </Badge>
            ) : null}
          </div>

          <div className="flex items-center gap-2 text-xs text-foreground font-medium">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="truncate">
              {domain?.domain ? (
                <>
                  Domain: <strong>{domain.domain}</strong>
                </>
              ) : (
                "No sender domain configured for this ecosystem"
              )}
            </span>
          </div>

          <p className="text-[11px] text-muted-foreground leading-normal">
            {!isConfigured
              ? "To start delivering automated emails to your members, please set up your business domain first in Settings > Domains."
              : isPending
              ? "Your domain DNS records (TXT, MX, SPF, DKIM) are waiting for verification. Check DNS propagation in Domain Settings."
              : isFailed
              ? "Your domain verification encountered an error. Please verify the DNS records in your domain provider."
              : "Your domain is verified and ready."}
          </p>
        </div>

        {/* Deliverability & Security Highlights */}
        <div className="grid grid-cols-2 gap-2 text-left">
          <div className="p-2.5 rounded-lg border border-border/70 bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              <span>Deliverability</span>
            </div>
            <p className="text-[10.5px] text-muted-foreground leading-snug">
              Guarantees automated emails land directly in inboxes instead of spam.
            </p>
          </div>

          <div className="p-2.5 rounded-lg border border-border/70 bg-card space-y-1">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 text-xs font-semibold">
              <Mail className="w-3.5 h-3.5 shrink-0" />
              <span>Branded Sender</span>
            </div>
            <p className="text-[10.5px] text-muted-foreground leading-snug">
              Emails arrive authentically from your entity's verified domain address.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs h-9"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={handleNavigateToSettings}
            className="text-xs h-9 gap-1.5 font-bold bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-xs cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5" />
            Setup Domain in Settings
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
