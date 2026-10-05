"use client";

import React, { useState, useEffect } from "react";
import {
  EnterpriseClient,
  useUpdateEnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Globe,
  Plus,
  X,
  ShieldCheck,
  Save,
  AlertCircle,
  HelpCircle,
  Laptop,
} from "lucide-react";

interface AllowedDomainsCardProps {
  client: EnterpriseClient | null;
  loading?: boolean;
}

export function AllowedDomainsCard({
  client,
  loading = false,
}: AllowedDomainsCardProps) {
  const [domains, setDomains] = useState<string[]>([]);
  const [newDomain, setNewDomain] = useState("");
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (client) {
      setDomains(client.allowedDomains || []);
      setIsDirty(false);
    }
  }, [client]);

  const [updateClient, { loading: updating }] = useUpdateEnterpriseClient({
    onCompleted: () => {
      toast.success("Allowed domains updated successfully");
      setIsDirty(false);
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update allowed domains");
    },
  });

  const handleAddDomain = (domainToAdd?: string) => {
    const raw = (domainToAdd || newDomain).trim();
    if (!raw) return;

    // Normalize domain
    let domain = raw;

    if (domains.includes(domain)) {
      toast.error(`"${domain}" is already in the whitelist`);
      return;
    }

    setDomains([...domains, domain]);
    setNewDomain("");
    setIsDirty(true);
  };

  const handleRemoveDomain = (index: number) => {
    const updated = domains.filter((_, i) => i !== index);
    setDomains(updated);
    setIsDirty(true);
  };

  const handleSave = () => {
    updateClient({
      variables: {
        input: {
          allowedDomains: domains,
        },
      },
    });
  };

  const quickSuggestions = [
    { label: "localhost", value: "localhost" },
    { label: "http://localhost:3000", value: "http://localhost:3000" },
    { label: "http://localhost:5055", value: "http://localhost:5055" },
    { label: "https://*.domain.com", value: "https://*.example.com" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              Allowed Domains & CORS Whitelist
              <Badge variant="secondary" className="text-[10px] font-medium">
                {domains.length} {domains.length === 1 ? "Domain" : "Domains"} Whitelisted
              </Badge>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Only requests originating from these browser origins are authorized to fetch leaderboard data.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleSave}
          disabled={!isDirty || updating}
          className="h-8 gap-1.5 text-xs font-medium self-start sm:self-auto"
        >
          <Save className="h-3.5 w-3.5" />
          {updating ? "Saving..." : "Save Whitelist"}
        </Button>
      </div>

      {/* Add New Domain Input */}
      <div className="space-y-3">
        <Label className="text-xs font-medium text-foreground">
          Add Authorized Origin or Pattern
        </Label>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Globe className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddDomain();
                }
              }}
              placeholder="e.g. https://*.yourdomain.com or localhost"
              className="h-8 pl-8 text-xs bg-background"
            />
          </div>
          <Button
            size="sm"
            onClick={() => handleAddDomain()}
            disabled={!newDomain.trim()}
            className="h-8 gap-1.5 text-xs shrink-0 font-medium"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Origin
          </Button>
        </div>

        {/* Quick Add Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] text-muted-foreground font-medium mr-1 flex items-center gap-1">
            <Laptop className="h-3 w-3" /> Quick Add:
          </span>
          {quickSuggestions.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => handleAddDomain(s.value)}
              className="text-[11px] px-2 py-0.5 rounded-md border border-border/80 bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors font-mono cursor-pointer"
            >
              + {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Domain Pills / Badges */}
      <div className="space-y-2">
        <Label className="text-xs font-medium text-muted-foreground">
          Currently Configured Domains ({domains.length})
        </Label>

        {domains.length === 0 ? (
          <div className="p-6 rounded-lg border border-dashed border-border text-center space-y-1.5 bg-muted/10">
            <AlertCircle className="h-5 w-5 text-amber-500 mx-auto" />
            <p className="text-xs font-medium text-foreground">
              No domains whitelisted yet
            </p>
            <p className="text-[11px] text-muted-foreground max-w-sm mx-auto">
              Requests without a matching whitelisted origin will be rejected with a CORS 403 error.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border/70 bg-muted/20 min-h-[50px] items-center">
            {domains.map((dom, i) => {
              const isWildcard = dom.includes("*");
              const isLocalhost = dom.includes("localhost") || dom.includes("127.0.0.1");

              return (
                <Badge
                  key={i}
                  variant="outline"
                  className="px-2.5 py-1 text-xs gap-1.5 rounded-md border-border bg-card shadow-2xs font-mono font-normal flex items-center group"
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isLocalhost
                        ? "bg-amber-500"
                        : isWildcard
                        ? "bg-purple-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="text-foreground">{dom}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveDomain(i)}
                    className="ml-1 text-muted-foreground hover:text-destructive transition-colors rounded-xs"
                    title="Remove domain"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* Domain Pattern Rule Cheatsheet */}
      <div className="rounded-lg border border-border/60 bg-muted/30 p-3.5 space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
          <HelpCircle className="h-3.5 w-3.5 text-primary" />
          Supported Domain Patterns Reference
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] text-muted-foreground">
          <div className="p-2 rounded border border-border/40 bg-card/60 space-y-0.5">
            <span className="font-mono text-foreground font-medium">
              https://www.yourdomain.com
            </span>
            <p>Matches only that exact origin (protocol + host + port).</p>
          </div>
          <div className="p-2 rounded border border-border/40 bg-card/60 space-y-0.5">
            <span className="font-mono text-foreground font-medium">
              https://*.yourdomain.com
            </span>
            <p>Matches all subdomains (e.g. community.yourdomain.com).</p>
          </div>
          <div className="p-2 rounded border border-border/40 bg-card/60 space-y-0.5">
            <span className="font-mono text-foreground font-medium">
              localhost / http://localhost:3000
            </span>
            <p>Allows local development and staging environments.</p>
          </div>
          <div className="p-2 rounded border border-border/40 bg-card/60 space-y-0.5">
            <span className="font-mono text-amber-600 dark:text-amber-400 font-medium">
              * (Wildcard)
            </span>
            <p>Allows all web origins (useful for testing, not recommended for prod).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
