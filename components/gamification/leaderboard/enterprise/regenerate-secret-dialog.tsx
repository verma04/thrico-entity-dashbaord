"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InlineAlert } from "@/components/ui/inline-alert";
import { useRegenerateEnterpriseClientSecret } from "@/graphql/actions/enterprise-leaderboard";
import { toast } from "sonner";
import { KeyRound, Copy, Check, AlertTriangle, ShieldAlert } from "lucide-react";

interface RegenerateSecretDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clientId: string;
}

export function RegenerateSecretDialog({
  open,
  onOpenChange,
  clientId,
}: RegenerateSecretDialogProps) {
  const [copied, setCopied] = useState(false);
  const [revealedSecret, setRevealedSecret] = useState<string | null>(null);

  const [regenerateSecret, { loading }] =
    useRegenerateEnterpriseClientSecret({
      onCompleted: (res) => {
        const result = res.regenerateEnterpriseClientSecret;
        if (result?.clientSecret) {
          setRevealedSecret(result.clientSecret);
          toast.success("New Client Secret generated successfully");
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to regenerate client secret");
      },
    });

  const handleCopy = (secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    toast.success("Client Secret copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setRevealedSecret(null);
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (v ? onOpenChange(true) : handleClose())}>
      <DialogContent className="sm:max-w-[500px] border-border bg-card">
        <DialogHeader>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-semibold">
                {revealedSecret ? "New Client Secret" : "Regenerate Client Secret"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {revealedSecret
                  ? "Copy and securely store your new secret immediately."
                  : "Rotate your enterprise authentication credentials."}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {revealedSecret ? (
          <div className="space-y-4 py-2">
            <InlineAlert
              variant="error"
              title="Save this secret immediately"
              message="This secret will NEVER be displayed again. If you lose it, you will need to regenerate a new one."
            />

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">
                Client ID
              </label>
              <div className="p-2.5 rounded-lg border border-border bg-muted/40 font-mono text-xs text-foreground select-all break-all">
                {clientId}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Plaintext Client Secret
              </label>
              <div className="relative flex items-center">
                <div className="w-full p-3 pr-24 rounded-lg border border-amber-500/40 bg-amber-500/5 font-mono text-xs font-semibold text-foreground select-all break-all">
                  {revealedSecret}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCopy(revealedSecret)}
                  className="absolute right-2 h-7 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div className="p-3.5 rounded-xl border border-destructive/20 bg-destructive/5 text-destructive space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                Warning: Immediate Service Disruption
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Regenerating your secret will immediately invalidate your previous
                credentials. Any existing external websites, mobile apps, or backend services
                using the old secret will fail to generate authentication tokens until updated.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-1">
              <div className="text-xs font-medium text-foreground">Client ID:</div>
              <div className="text-xs font-mono text-muted-foreground break-all">
                {clientId}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          {revealedSecret ? (
            <Button onClick={handleClose} className="w-full sm:w-auto text-xs font-medium">
              Done & Dismiss
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => regenerateSecret()}
                disabled={loading}
                className="text-xs font-medium gap-1.5"
              >
                {loading ? "Generating..." : "I Understand, Regenerate"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
