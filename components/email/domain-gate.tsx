"use client";

import * as React from "react";
import {
  useGetEmailDomain,
  useCheckEmailVerification,
} from "@/graphql/actions/email";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Lock,
  RefreshCw,
  Bell,
  Copy,
  CheckCircle2,
  Clock,
  Loader2,
  Globe,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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

interface EmailDomainGateProps {
  children: React.ReactNode;
}

export function EmailDomainGate({ children }: EmailDomainGateProps) {
  const pathname = usePathname();
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
      <div className="h-96 flex items-center justify-center">
        <RefreshCw className="h-6 w-6 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (!isVerified) {
    const records = [];
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
          name: domainData.domain,
          value: dnsRecords.spfRecord,
          verified: dnsRecords.spfVerified,
        });
      }
      if (dnsRecords.dkimRecords) {
        dnsRecords.dkimRecords.forEach((dkim: any, index: number) => {
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
      <div className="min-h-[70vh] py-2 px-4 sm:px-8">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto space-y-8"
        >
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                {status === "pending" ? (
                  <RefreshCw className="h-6 w-6 animate-spin text-amber-500" />
                ) : status === "failed" ? (
                  <Bell className="h-6 w-6 text-red-500" />
                ) : (
                  <Lock className="h-6 w-6" />
                )}
              </div>
              <div>
                <h1 className="text-[20px] font-semibold tracking-tight text-slate-900">
                  {status === "pending"
                    ? "Domain Verification Pending"
                    : status === "failed"
                      ? "Domain Verification Failed"
                      : "Email Domain Required"}
                </h1>
                <p className="text-[13px] text-slate-500 mt-1 font-medium">
                  {domainData?.domain ||
                    "Configure your custom domain to start sending emails."}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => checkVerification()}
                disabled={checking}
                className="h-10 px-4 text-[12px] font-semibold border-slate-200 hover:bg-slate-50 gap-2 transition-colors"
              >
                {checking ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {checking ? "Checking..." : "Re-Verify"}
              </Button>
              <Button
                onClick={() => router.push("/settings/domains")}
                className="h-10 px-5 bg-slate-900 hover:bg-black text-white text-[12px] font-semibold shadow-sm transition-all"
              >
                Configure Settings
              </Button>
            </div>
          </div>

          {/* Setup Instructions */}
          {!domainData && (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center space-y-6 shadow-sm">
              <div className="h-16 w-16 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 mx-auto">
                <Globe className="h-8 w-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h3 className="text-[16px] font-semibold text-slate-900">
                  Get Started with Custom Domain
                </h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">
                  To send professional emails from your own domain, you first
                  need to configure and verify it in your domain settings.
                </p>
              </div>
              <Button
                onClick={() => router.push("/settings/domains")}
                className="h-11 px-8 bg-slate-900 hover:bg-black text-white text-[12px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-slate-200"
              >
                Add Your Domain
              </Button>
            </div>
          )}

          {domainData && (
            <div className="space-y-6">
              {/* Alert instructions header */}
              <div className="px-5 py-4 border border-slate-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-white text-slate-600 flex items-center justify-center border border-slate-200 shrink-0 shadow-sm">
                    <Globe className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight leading-none">
                      DNS Configuration
                    </h3>
                    <p className="text-[12px] text-slate-500 mt-1.5 max-w-md">
                      Apply these records at your registrar to route traffic.
                    </p>
                  </div>
                </div>
                <DNSProviderGuide domainName={domainData.domain} />
              </div>

              {/* Records table */}
              <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                  <h3 className="text-[13px] font-semibold text-slate-900">
                    Required DNS Records
                  </h3>
                </div>
                <Table>
                  <TableHeader className="bg-slate-50/30">
                    <TableRow className="hover:bg-transparent border-slate-100">
                      <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider h-11 px-6">
                        Type
                      </TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider h-11 px-6">
                        Host / Name
                      </TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider h-11 px-6">
                        Value
                      </TableHead>
                      <TableHead className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider h-11 px-6 text-right">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.map((record, i) => (
                      <TableRow
                        key={i}
                        className="border-slate-100 hover:bg-slate-50/50 transition-colors group"
                      >
                        <TableCell className="px-6 py-4">
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                            <span className="font-mono text-[11px] text-slate-500 max-w-[200px] truncate block">
                              {record.name}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(record.name)}
                              className="h-7 w-7 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                            <span className="font-mono text-[11px] text-slate-600 bg-slate-50 border border-slate-200 px-2 py-1.5 rounded truncate max-w-[280px] block">
                              {record.value}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(record.value)}
                              className="h-8 w-8 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          {record.verified ? (
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-emerald-600">
                              <CheckCircle2 className="h-4 w-4" />
                              <span className="hidden sm:inline">Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-amber-600 font-mono">
                              <Clock className="h-4 w-4" />
                              <span className="hidden sm:inline uppercase tracking-widest text-[10px]">
                                Pending
                              </span>
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
