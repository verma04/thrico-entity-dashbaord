"use client";

import * as React from "react";
import {
  useGetEmailDomain,
  useCheckEmailVerification,
} from "@/graphql/actions/email";
import { useRouter } from "next/navigation";
import {
  Lock,
  RefreshCw,
  Copy,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
  ShieldCheck,
  Zap,
  Mail,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { DNSProviderGuide } from "@/components/settings/domains/dns-provider-guide";
import { cn } from "@/lib/utils";

interface EmailDomainGateProps {
  children: React.ReactNode;
}

export function EmailDomainGate({ children }: EmailDomainGateProps) {
  const router = useRouter();
  const {
    data: emailData,
    loading: emailLoading,
    refetch,
  } = useGetEmailDomain();

  const [checkVerification, { loading: checking }] = useCheckEmailVerification({
    onCompleted: (data: any) => {
      if (data?.checkEmailDomainVerification?.status === "verified") {
        toast.success("Domain verified successfully!");
        refetch();
      } else {
        toast.info("Domain is still pending verification.");
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to check verification status.");
    },
  });

  const domainData = emailData?.getEmailDomain;
  const isVerified = domainData?.status === "verified";
  const status = domainData?.status;
  const dnsRecords = domainData?.dnsRecords;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (emailLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="h-6 w-6 text-muted-foreground animate-spin" />
        <p className="text-[12px] text-muted-foreground font-medium">
          Checking domain authentication status…
        </p>
      </div>
    );
  }

  if (!isVerified) {
    const records: Array<{
      type: string;
      name: string;
      value: string;
      verified: boolean;
    }> = [];

    if (dnsRecords) {
      if (dnsRecords.txtRecord) {
        records.push({
          type: "TXT",
          name: dnsRecords.txtRecord,
          value: dnsRecords.txtValue,
          verified: dnsRecords.txtVerified,
        });
      }
      if (dnsRecords.spfRecord) {
        records.push({
          type: "SPF (TXT)",
          name: domainData?.domain || "",
          value: dnsRecords.spfRecord,
          verified: dnsRecords.spfVerified,
        });
      }
      if (dnsRecords.dkimRecords) {
        dnsRecords.dkimRecords.forEach((dkim: any) => {
          records.push({
            type: "DKIM (CNAME)",
            name: dkim.name,
            value: dkim.value,
            verified: dkim.verified,
          });
        });
      }
    }

    return (
      <div className="py-4 px-2 sm:px-4 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
        {/* Setup Instructions when no domain is configured */}
        {!domainData && (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white dark:bg-zinc-900 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 text-center shadow-2xs space-y-6 max-w-2xl mx-auto my-6">
            <div className="w-12 h-12 rounded-[8px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#e1e3e5] dark:border-zinc-700 flex items-center justify-center text-[#616161] dark:text-zinc-300 shadow-2xs">
              <Globe className="h-6 w-6" />
            </div>

            <div className="space-y-1.5 max-w-md">
              <h3 className="text-[15px] font-bold text-[#303030] dark:text-zinc-100">
                Get Started with Custom Domain
              </h3>
              <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                To send professional emails from your own domain, you first need
                to configure and verify it in your domain settings.
              </p>
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full text-left pt-2">
              <div className="p-3.5 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#fbfbfb] dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-bold text-foreground">
                    High Deliverability
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-snug">
                  Boost inbox placement with SPF &amp; DKIM cryptographic signatures.
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#fbfbfb] dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400">
                  <Mail className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-bold text-foreground">
                    Branded Sender
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-snug">
                  Dispatch emails directly from your own verified business domain.
                </p>
              </div>

              <div className="p-3.5 rounded-[6px] border border-[#e1e3e5] dark:border-zinc-800 bg-[#fbfbfb] dark:bg-zinc-900/60 space-y-1">
                <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                  <Zap className="h-4 w-4 shrink-0" />
                  <span className="text-[11px] font-bold text-foreground">
                    Zero Downtime
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground leading-snug">
                  Fast DNS record validation and automated TLS certificate provisioning.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => router.push("/settings/domains")}
                className="h-[32px] px-4 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 text-[12px] font-semibold rounded-[4px] shadow-2xs cursor-pointer gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" />
                Add Your Domain
              </Button>
            </div>
          </div>
        )}

        {/* DNS Configuration Helper & Records Table when domain exists */}
        {domainData && (
          <div className="space-y-4">
            {/* Top Status Card */}
            <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#e1e3e5] dark:border-zinc-700 flex items-center justify-center text-[#616161] dark:text-zinc-300 shrink-0">
                  {status === "pending" ? (
                    <RefreshCw className="h-5 w-5 animate-spin text-amber-500" />
                  ) : status === "failed" ? (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[14px] font-bold text-[#303030] dark:text-zinc-100">
                      {status === "pending"
                        ? "Domain Verification Pending"
                        : status === "failed"
                          ? "Domain Verification Failed"
                          : "Email Domain Required"}
                    </h2>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold px-1.5 py-0 rounded-[3px]",
                        status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300"
                          : "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300"
                      )}
                    >
                      {status === "pending"
                        ? "Pending DNS Propagation"
                        : "Verification Failed"}
                    </Badge>
                  </div>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 font-mono mt-0.5">
                    {domainData.domain}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => checkVerification()}
                  disabled={checking}
                  className="h-[30px] px-2.5 text-[12px] font-semibold border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-2xs rounded-[4px] cursor-pointer gap-1.5"
                >
                  {checking ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {checking ? "Checking…" : "Re-Verify"}
                </Button>
                <Button
                  onClick={() => router.push("/settings/domains")}
                  className="h-[30px] px-3 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 text-[12px] font-semibold rounded-[4px] shadow-2xs cursor-pointer"
                >
                  Configure Settings
                </Button>
              </div>
            </div>

            {/* DNS Helper Alert Banner */}
            <div className="p-4 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#fbfbfb] dark:bg-zinc-900/60 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Globe className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                <div>
                  <h4 className="text-[12.5px] font-bold text-foreground">
                    Required DNS Authentication Records
                  </h4>
                  <p className="text-[11.5px] text-muted-foreground">
                    Add these SPF and DKIM records to your DNS registrar to authenticate your custom domain.
                  </p>
                </div>
              </div>
              <DNSProviderGuide domainName={domainData.domain} />
            </div>

            {/* Records Table */}
            <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs overflow-hidden">
              <Table>
                <TableHeader className="bg-[#f6f6f7]/60 dark:bg-zinc-900/60 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5 px-4">
                      Type
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5 px-4">
                      Host / Name
                    </TableHead>
                    <TableHead className="text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5 px-4">
                      Value / Data
                    </TableHead>
                    <TableHead className="text-right text-[11px] font-bold uppercase tracking-wider text-[#616161] py-2.5 px-4">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-[#e1e3e5] dark:divide-zinc-800/60">
                  {records.map((record, i) => (
                    <TableRow
                      key={i}
                      className="hover:bg-[#f6f6f7]/50 dark:hover:bg-zinc-800/30 transition-colors group"
                    >
                      <TableCell className="px-4 py-3">
                        <span className="text-[11px] font-bold text-foreground bg-muted px-2 py-0.5 rounded-[4px] border border-border">
                          {record.type}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11.5px] text-foreground max-w-[200px] truncate block">
                            {record.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(record.name)}
                            className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                            title="Copy Host"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] text-foreground bg-muted/50 border border-border px-2 py-1 rounded-[4px] truncate max-w-[320px] block">
                            {record.value}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyToClipboard(record.value)}
                            className="h-6 w-6 text-muted-foreground hover:text-foreground opacity-60 group-hover:opacity-100 transition-opacity shrink-0 cursor-pointer"
                            title="Copy Value"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right">
                        {record.verified ? (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 gap-1 text-[10.5px] font-semibold rounded-[3px]"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Verified
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 gap-1 text-[10.5px] font-semibold rounded-[3px]"
                          >
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    );
  }

  return <>{children}</>;
}

export default EmailDomainGate;
