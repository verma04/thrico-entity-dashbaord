"use client";

import React, { useState, useEffect } from "react";
import {
  EnterpriseClient,
  useUpdateEnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  KeyRound,
  Copy,
  Check,
  RotateCw,
  ShieldCheck,
  ShieldAlert,
  Save,
  Clock,
  Gauge,
  Calendar,
} from "lucide-react";
import { RegenerateSecretDialog } from "./regenerate-secret-dialog";

interface ApiCredentialsCardProps {
  client: EnterpriseClient | null;
  loading?: boolean;
}

export function ApiCredentialsCard({
  client,
  loading = false,
}: ApiCredentialsCardProps) {
  const [copiedId, setCopiedId] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  // Form states for editable fields
  const [name, setName] = useState(client?.name || "");
  const [rateLimit, setRateLimit] = useState(
    client?.rateLimitPerMinute?.toString() || "3000"
  );
  const [tokenTtl, setTokenTtl] = useState(
    client?.tokenTtlSeconds?.toString() || "3600"
  );
  const [isActive, setIsActive] = useState(client?.isActive ?? true);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (client) {
      setName(client.name || "");
      setRateLimit(client.rateLimitPerMinute?.toString() || "3000");
      setTokenTtl(client.tokenTtlSeconds?.toString() || "3600");
      setIsActive(client.isActive ?? true);
      setIsDirty(false);
    }
  }, [client]);

  const [updateClient, { loading: updating }] = useUpdateEnterpriseClient({
    onCompleted: () => {
      toast.success("Security settings updated successfully");
      setIsDirty(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update security settings");
    },
  });

  const handleCopyClientId = () => {
    if (!client?.clientId) return;
    navigator.clipboard.writeText(client.clientId);
    setCopiedId(true);
    toast.success("Client ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSave = () => {
    const rateLimitNum = parseInt(rateLimit, 10);
    const tokenTtlNum = parseInt(tokenTtl, 10);

    if (isNaN(rateLimitNum) || rateLimitNum < 10) {
      toast.error("Rate limit must be at least 10 requests per minute");
      return;
    }
    if (isNaN(tokenTtlNum) || tokenTtlNum < 60) {
      toast.error("Token TTL must be at least 60 seconds (1 minute)");
      return;
    }

    updateClient({
      variables: {
        input: {
          name: name.trim(),
          rateLimitPerMinute: rateLimitNum,
          tokenTtlSeconds: tokenTtlNum,
          isActive,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ── Key Credentials Overview ────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                Enterprise Client Credentials
                {client?.isActive ? (
                  <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 text-[10px] font-medium">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="border-destructive/30 text-destructive bg-destructive/10 text-[10px] font-medium">
                    Suspended
                  </Badge>
                )}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Authentication credentials used by your frontend apps & headless SDKs.
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowRegenerateDialog(true)}
            className="h-8 gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-amber-700 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Regenerate Secret
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Client ID */}
          <div className="space-y-2 p-3.5 rounded-lg border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                Client ID
              </Label>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Public Identifier
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xs px-3 py-2 rounded-md bg-background border border-border text-foreground truncate select-all">
                {client?.clientId || "Loading client ID..."}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopyClientId}
                disabled={!client?.clientId}
                className="h-8 px-2.5 shrink-0 gap-1.5 text-xs bg-card border-border"
              >
                {copiedId ? (
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
            <p className="text-[11px] text-muted-foreground">
              Pass this in <code className="font-mono text-primary text-[10px]">ThricoLeaderboard.init({`{ clientId }`})</code>.
            </p>
          </div>

          {/* Client Secret */}
          <div className="space-y-2 p-3.5 rounded-lg border border-border/80 bg-muted/20">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-amber-500" />
                Client Secret
              </Label>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Encrypted Key
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 font-mono text-xs px-3 py-2 rounded-md bg-background border border-border text-muted-foreground truncate select-none">
                {client?.clientSecretPrefix || "thrico_sk_live_••••••••••••••••"}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowRegenerateDialog(true)}
                className="h-8 px-2.5 shrink-0 gap-1.5 text-xs bg-card border-border text-foreground"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Rotate
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Stored securely as a one-way hash. Plaintext is only visible upon generation.
            </p>
          </div>
        </div>

        {/* Timestamp metadata */}
        <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-muted-foreground border-t border-border/50">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Provisioned: {client?.createdAt ? new Date(client.createdAt).toLocaleDateString() : "—"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            <span>Last Active: {client?.lastUsedAt ? new Date(client.lastUsedAt).toLocaleString() : "Never"}</span>
          </div>
        </div>
      </div>

      {/* ── Security & Rate Limits Configuration ────────────────────────────── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div>
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Gauge className="h-4 w-4 text-primary" />
            Security & Throughput Limits
          </h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Control request velocity and token expiration for this enterprise integration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Integration Name */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Integration Label
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsDirty(true);
              }}
              placeholder="e.g. Enterprise Production Web"
              className="h-8 text-xs bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              Friendly name for identifying this enterprise client.
            </p>
          </div>

          {/* Rate Limit */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              Rate Limit (req / min)
            </Label>
            <Input
              type="number"
              value={rateLimit}
              onChange={(e) => {
                setRateLimit(e.target.value);
                setIsDirty(true);
              }}
              min={10}
              max={100000}
              className="h-8 text-xs bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              Sliding-window Redis rate limit. Default: 3,000 req/min.
            </p>
          </div>

          {/* Token TTL */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium text-foreground">
              JWT Token TTL (seconds)
            </Label>
            <Input
              type="number"
              value={tokenTtl}
              onChange={(e) => {
                setTokenTtl(e.target.value);
                setIsDirty(true);
              }}
              min={60}
              max={86400}
              className="h-8 text-xs bg-background"
            />
            <p className="text-[10px] text-muted-foreground">
              Session token lifespan. 3600s = 1 hour (Default).
            </p>
          </div>
        </div>

        {/* Client Active Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-lg border border-border/80 bg-muted/20">
          <div className="space-y-0.5">
            <Label className="text-xs font-medium text-foreground">
              Enable Enterprise API Access
            </Label>
            <p className="text-[11px] text-muted-foreground">
              When toggled off, all incoming SDK requests using this Client ID will immediately be rejected.
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => {
              setIsActive(checked);
              setIsDirty(true);
            }}
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!isDirty || updating}
            className="h-8 gap-1.5 text-xs font-medium"
          >
            <Save className="h-3.5 w-3.5" />
            {updating ? "Saving Changes..." : "Save Security Settings"}
          </Button>
        </div>
      </div>

      {/* Secret Regenerate Dialog */}
      <RegenerateSecretDialog
        open={showRegenerateDialog}
        onOpenChange={setShowRegenerateDialog}
        clientId={client?.clientId || ""}
      />
    </div>
  );
}
