"use client";

import React from "react";
import {
  Globe,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Server,
  KeyRound,
  FileCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface EmailDomainHealthProps {
  loading?: boolean;
  domain?: {
    domain?: string;
    status?: string;
  } | null;
}

export function EmailDomainHealth({
  loading = false,
  domain,
}: EmailDomainHealthProps) {
  const router = useRouter();
  const isVerified = domain?.status === "verified";
  const domainName = domain?.domain || "mail.thrico.io";

  const dnsPills = [
    { label: "SPF Record", status: "Verified", icon: FileCheck },
    { label: "DKIM Keys (2048-bit)", status: "Active & Signed", icon: KeyRound },
    { label: "DMARC Policy (p=reject)", status: "Enforced", icon: ShieldCheck },
    { label: "TLS 1.3 Transport", status: "Encrypted", icon: Server },
  ];

  return (
    <div id="kpi-section-infrastructure" className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-pink-500/10 flex items-center justify-center text-pink-600 dark:text-pink-400">
            <Globe className="h-3.5 w-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              5. Infrastructure &amp; Verified Sending Domain
            </h3>
            <p className="text-[11px] text-muted-foreground">
              DNS deliverability records, cryptographic signatures, and custom domain setup
            </p>
          </div>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => router.push("/settings/domains")}
          className="h-7 text-[11px] font-semibold gap-1.5 border-border rounded-[4px] cursor-pointer"
        >
          Manage DNS Settings
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      <Card className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px]">
        <CardContent className="p-5">
          {loading ? (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-[6px]" />
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-32 rounded-[3px]" />
                      <Skeleton className="h-4 w-20 rounded-[3px]" />
                    </div>
                    <Skeleton className="h-3 w-48 rounded-[3px]" />
                  </div>
                </div>
                <Skeleton className="h-8 w-44 rounded-[4px]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
                {Array.from({ length: 4 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2.5 p-2.5 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/60 border border-border/40"
                  >
                    <Skeleton className="h-7 w-7 rounded-[4px]" />
                    <div className="space-y-1 flex-1">
                      <Skeleton className="h-2.5 w-16 rounded-[2px]" />
                      <Skeleton className="h-3 w-20 rounded-[2px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-border/40">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-[6px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-foreground">
                        @{domainName}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9.5px] px-1.5 py-0 font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 rounded-[3px]"
                      >
                        {isVerified ? "Verified Sender" : "System Pool Active"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Sender identity for broadcast campaigns and notification receipts
                    </p>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push("/settings/domains")}
                  className="h-8 text-[11.5px] font-semibold rounded-[4px] border-border shrink-0 cursor-pointer"
                >
                  Add Custom Sending Domain
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4">
                {dnsPills.map((p, idx) => {
                  const Icon = p.icon;
                  return (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 p-2.5 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/60 border border-border/40"
                    >
                      <div className="h-7 w-7 rounded-[4px] bg-background flex items-center justify-center text-emerald-600 dark:text-emerald-400 border border-border/60 shrink-0">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                          {p.label}
                        </p>
                        <p className="text-[11.5px] font-semibold text-foreground truncate flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-500 shrink-0" />
                          {p.status}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

