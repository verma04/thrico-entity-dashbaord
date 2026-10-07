"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisTipCard,
  PolarisSidebarCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  KeyRound,
  Copy,
  Check,
  ShieldCheck,
  Save,
  RotateCw,
  Terminal,
} from "lucide-react";
import { useUpdateEnterpriseClient } from "@/graphql/actions/enterprise-leaderboard";
import { RegenerateSecretDialog } from "@/components/gamification/leaderboard/enterprise/regenerate-secret-dialog";
import { useMediaGalleryDeveloper } from "../media-gallery-developer-context";
import { cn } from "@/lib/utils";

const apiCredentialsSchema = Yup.object().shape({
  name: Yup.string().trim().required("Client name is required"),
  rateLimitPerMinute: Yup.number()
    .min(10, "Minimum rate limit is 10 requests/min")
    .max(100000, "Maximum rate limit is 100,000 requests/min")
    .required("Rate limit is required"),
  tokenTtlSeconds: Yup.number()
    .min(60, "Minimum TTL is 60 seconds")
    .max(86400, "Maximum TTL is 86,400 seconds (24h)")
    .required("Token TTL is required"),
  isActive: Yup.boolean().required(),
});

export function ApiCredentialsTabView() {
  const { client, refetchClient } = useMediaGalleryDeveloper();
  const [copiedId, setCopiedId] = useState(false);
  const [showRegenerateDialog, setShowRegenerateDialog] = useState(false);

  const [updateClient, { loading: isSaving }] = useUpdateEnterpriseClient({
    onCompleted: () => {
      toast.success("API client settings saved successfully!");
      refetchClient();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update client settings";
      toast.error(msg);
    },
  });

  const formik = useFormik({
    initialValues: {
      name: client?.name || "Production Web Gallery Client",
      rateLimitPerMinute: Number(client?.rateLimitPerMinute || 3000),
      tokenTtlSeconds: Number(client?.tokenTtlSeconds || 3600),
      isActive: client?.isActive ?? true,
    },
    validationSchema: apiCredentialsSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateClient({
        variables: {
          input: {
            name: values.name,
            rateLimitPerMinute: Number(values.rateLimitPerMinute),
            tokenTtlSeconds: Number(values.tokenTtlSeconds),
            isActive: values.isActive,
          },
        },
      });
    },
  });

  const handleCopyId = () => {
    if (!client?.clientId) return;
    navigator.clipboard.writeText(client.clientId);
    setCopiedId(true);
    toast.success("Client ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const curlExample = `curl -X POST https://api.thrico.network/graphql \\
  -H "Authorization: Bearer <CLIENT_TOKEN>" \\
  -H "X-Client-Id: ${client?.clientId || "thrico_client_YOUR_KEY"}" \\
  -H "Content-Type: application/json"`;

  return (
    <PolarisFormLayout
      sidebar={
        <div className="space-y-4">
          <PolarisSidebarCard
            title="API Authentication Header"
            badge="Bearer Token"
            icon={Terminal}
          >
            <div className="space-y-2 text-xs">
              <p className="text-[11.5px] text-muted-foreground leading-snug">
                Pass your client credentials in request headers for authenticated REST/GraphQL SDK interactions:
              </p>
              <pre className="p-3 rounded-lg bg-zinc-950 text-zinc-100 font-mono text-[10px] leading-relaxed overflow-x-auto border border-border/80">
                <code>{curlExample}</code>
              </pre>
            </div>
          </PolarisSidebarCard>

          <PolarisTipCard title="Security & Secret Protection">
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <p>
                • <strong>Never Expose Secrets:</strong> Keep your Client Secret confined to server-side environments and secrets managers (.env).
              </p>
              <p>
                • <strong>Instant Rotation:</strong> If your secret is accidentally committed to source code, regenerate it immediately.
              </p>
            </div>
          </PolarisTipCard>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Step 1: Client Identity & Keys */}
        <PolarisFormCard
          step={1}
          icon={KeyRound}
          title="Client Identity & Secret Key"
          description="Your public Client ID and masked secret key used to authenticate SDK upload sessions."
          badge="Credentials"
        >
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Client Application Name
              </Label>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="e.g. Production Mobile App"
                className={cn(
                  "h-9 text-xs",
                  formik.touched.name && formik.errors.name && "border-destructive"
                )}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-[11px] text-destructive font-medium mt-1">
                  {formik.errors.name}
                </p>
              )}
            </div>

            {/* Client ID */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Client ID (Public Identifier)
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  value={client?.clientId || "Provisioning Client ID…"}
                  className="h-9 text-xs font-mono bg-muted/30"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyId}
                  className="h-9 text-xs gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedId ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  <span>{copiedId ? "Copied" : "Copy"}</span>
                </Button>
              </div>
            </div>

            {/* Client Secret */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-foreground">
                Client Secret Key
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  readOnly
                  type="password"
                  value="thrico_sec_••••••••••••••••••••••••••••••••"
                  className="h-9 text-xs font-mono bg-muted/30"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRegenerateDialog(true)}
                  className="h-9 text-xs gap-1.5 shrink-0 text-amber-600 dark:text-amber-400 hover:border-amber-400 cursor-pointer"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Regenerate Key</span>
                </Button>
              </div>
            </div>
          </div>
        </PolarisFormCard>

        {/* Step 2: Rate Limiting & TTL */}
        <PolarisFormCard
          step={2}
          icon={ShieldCheck}
          title="Rate Limiting & Token Expiration"
          description="Enforce security throttling to protect against volumetric API abuse and replay attacks."
          badge="Security Controls"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Rate Limit (Requests per Minute)
                </Label>
                <Input
                  type="number"
                  name="rateLimitPerMinute"
                  value={formik.values.rateLimitPerMinute}
                  onChange={formik.handleChange}
                  className={cn(
                    "h-9 text-xs font-mono",
                    formik.touched.rateLimitPerMinute &&
                      formik.errors.rateLimitPerMinute &&
                      "border-destructive"
                  )}
                />
                <span className="text-[11px] text-muted-foreground">
                  Default 3,000 requests/min across all endpoints.
                </span>
                {formik.touched.rateLimitPerMinute &&
                  formik.errors.rateLimitPerMinute && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.rateLimitPerMinute}
                    </p>
                  )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-foreground">
                  Bearer Token TTL (Seconds)
                </Label>
                <Input
                  type="number"
                  name="tokenTtlSeconds"
                  value={formik.values.tokenTtlSeconds}
                  onChange={formik.handleChange}
                  className={cn(
                    "h-9 text-xs font-mono",
                    formik.touched.tokenTtlSeconds &&
                      formik.errors.tokenTtlSeconds &&
                      "border-destructive"
                  )}
                />
                <span className="text-[11px] text-muted-foreground">
                  Default 3,600s (1 hour) before session re-authorization.
                </span>
                {formik.touched.tokenTtlSeconds &&
                  formik.errors.tokenTtlSeconds && (
                    <p className="text-[11px] text-destructive font-medium mt-1">
                      {formik.errors.tokenTtlSeconds}
                    </p>
                  )}
              </div>
            </div>

            {/* Active Status Switch */}
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-3 pt-2">
              <div>
                <Label className="text-xs font-semibold text-foreground">
                  Client Status (Active / Paused)
                </Label>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  Temporarily disable API and upload access for this client key without revoking tokens.
                </p>
              </div>
              <Switch
                checked={formik.values.isActive}
                onCheckedChange={(checked) =>
                  formik.setFieldValue("isActive", checked)
                }
              />
            </div>
          </div>
        </PolarisFormCard>

        {/* Submit Action */}
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={isSaving || !formik.dirty}
            className="h-9 text-xs gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs font-medium"
          >
            {isSaving ? (
              <RotateCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save API Configuration</span>
          </Button>
        </div>
      </form>

      {/* Regenerate Secret Dialog */}
      {client && (
        <RegenerateSecretDialog
          open={showRegenerateDialog}
          onOpenChange={setShowRegenerateDialog}
          clientId={client.clientId}
        />
      )}
    </PolarisFormLayout>
  );
}
