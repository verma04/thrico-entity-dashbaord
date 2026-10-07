"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Globe,
  Plus,
  Trash2,
  Save,
  RotateCw,
  Sparkles,
} from "lucide-react";
import { useUpdateEnterpriseClient } from "@/graphql/actions/enterprise-leaderboard";
import { useMediaGalleryDeveloper } from "../media-gallery-developer-context";

const allowedDomainsValidationSchema = Yup.object().shape({
  domains: Yup.array().of(Yup.string().required()).default([]),
  newDomain: Yup.string().optional(),
});

export function AllowedDomainsTabView() {
  const { client, refetchClient } = useMediaGalleryDeveloper();
  const [newDomainInput, setNewDomainInput] = useState("");

  const [updateClient, { loading: isSaving }] = useUpdateEnterpriseClient({
    onCompleted: () => {
      toast.success("Allowed domains whitelist updated successfully!");
      refetchClient();
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update allowed domains";
      toast.error(msg);
    },
  });

  const formik = useFormik({
    initialValues: {
      domains: client?.allowedDomains || [],
      newDomain: "",
    },
    validationSchema: allowedDomainsValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateClient({
        variables: {
          input: {
            allowedDomains: values.domains,
          },
        },
      });
    },
  });

  const domains = formik.values.domains;

  const handleAddDomain = (domainToAdd?: string) => {
    const raw = (domainToAdd || newDomainInput).trim();
    if (!raw) return;

    let domain = raw;
    try {
      if (domain.startsWith("http://") || domain.startsWith("https://")) {
        const parsed = new URL(domain);
        domain = parsed.origin;
      }
    } catch {
      // Keep raw string if wildcard or partial
    }

    if (domains.includes(domain)) {
      toast.error(`"${domain}" is already in the allowed origins list.`);
      return;
    }

    formik.setFieldValue("domains", [...domains, domain]);
    setNewDomainInput("");
    toast.success(`Added "${domain}" to whitelist.`);
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    formik.setFieldValue(
      "domains",
      domains.filter((d) => d !== domainToRemove)
    );
    toast.info(`Removed "${domainToRemove}". Remember to save.`);
  };

  const PRESET_DOMAINS = [
    { label: "localhost:3000", value: "http://localhost:3000" },
    { label: "localhost:5173", value: "http://localhost:5173" },
    { label: "*.myshopify.com", value: "https://*.myshopify.com" },
    { label: "webflow.io", value: "https://*.webflow.io" },
  ];

  return (
    <PolarisFormCard
      icon={Globe}
      title="Authorized CORS Origins & Domain Whitelist"
      description="Specify authorized parent website origins that are allowed to make cross-origin upload requests and embed gallery widgets."
      badge="Origin Security"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Action Bar for Adding Domains */}
        <EcosystemActionBar shadow="none">
          <EcosystemActionBar.Group>
            <EcosystemActionBar.Item grow className="max-w-md">
              <div className="flex items-center gap-2">
                <Input
                  value={newDomainInput}
                  onChange={(e) => setNewDomainInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddDomain();
                    }
                  }}
                  placeholder="https://community.yourbrand.com or localhost:3000"
                  className="h-[32px] text-xs font-mono"
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={() => handleAddDomain()}
                  className="h-[32px] text-xs gap-1.5 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs shrink-0"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Origin</span>
                </Button>
              </div>
            </EcosystemActionBar.Item>
          </EcosystemActionBar.Group>

          <EcosystemActionBar.Group align="right">
            <Button
              type="submit"
              disabled={isSaving || !formik.dirty}
              className="h-[32px] text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-2xs"
            >
              {isSaving ? (
                <RotateCw className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Save className="h-3.5 w-3.5" />
              )}
              <span>Save Domain Whitelist</span>
            </Button>
          </EcosystemActionBar.Group>
        </EcosystemActionBar>

        {/* Quick Add Preset Origins */}
        <div className="flex items-center gap-1.5 flex-wrap text-xs text-muted-foreground pt-1">
          <span className="text-[11px] font-semibold text-foreground flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            Quick presets:
          </span>
          {PRESET_DOMAINS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => handleAddDomain(preset.value)}
              className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-border/70 hover:border-indigo-400 bg-muted/40 hover:bg-muted text-foreground transition-all cursor-pointer"
            >
              + {preset.label}
            </button>
          ))}
        </div>

        {/* Domain List Table */}
        {domains.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[220px] border border-dashed border-border/80 rounded-xl p-8 text-center bg-card shadow-2xs">
            <div className="h-10 w-10 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3">
              <Globe className="h-5 w-5" />
            </div>
            <h4 className="text-sm font-bold text-foreground">
              No Domains Configured (Open Mode)
            </h4>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              When no specific domains are whitelisted, the uploader API accepts upload sessions from any origin. Add specific domains above to restrict access.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border/70 overflow-hidden bg-card shadow-2xs">
            <table className="w-full text-xs text-left">
              <thead className="bg-muted/40 border-b border-border/60 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Authorized Origin / Domain</th>
                  <th className="py-2.5 px-3">Environment</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {domains.map((domain) => {
                  const isLocal =
                    domain.includes("localhost") || domain.includes("127.0.0.1");
                  const isWildcard = domain.includes("*");

                  return (
                    <tr key={domain} className="hover:bg-muted/30 transition-colors">
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-2 font-mono font-medium text-foreground">
                          <Globe className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                          <span>{domain}</span>
                        </div>
                      </td>

                      <td className="py-2.5 px-3">
                        <Badge
                          variant="secondary"
                          className="text-[10px] px-1.5 py-0 font-medium"
                        >
                          {isLocal
                            ? "Local Development"
                            : isWildcard
                            ? "Wildcard Subdomains"
                            : "Production"}
                        </Badge>
                      </td>

                      <td className="py-2.5 px-3">
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 border-emerald-400/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold"
                        >
                          Authorized
                        </Badge>
                      </td>

                      <td className="py-2.5 px-3 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveDomain(domain)}
                          className="h-7 w-7 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                          title="Remove domain"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </form>
    </PolarisFormCard>
  );
}
