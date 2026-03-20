"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Copy,
  Trash2,
  Globe,
  ExternalLink,
  Info,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useRouter } from "next/navigation";
import {
  checkUpdatedDnsRecord,
  deleteDomain,
  getCustomDomainDetails,
} from "@/graphql/actions/domain";
import { CheckSsl } from "./check-ssl";
import { DNSProviderGuide } from "./dns-provider-guide";
import { cn } from "@/lib/utils";

interface DomainDetailProps {
  id: string;
}

export const DomainDetail = ({ id }: DomainDetailProps) => {
  const router = useRouter();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data, loading, error } = getCustomDomainDetails({
    variables: { input: { id } },
  });

  const [del, { loading: deleting }] = deleteDomain({
    onCompleted: () => {
      router.push("/settings/domains");
    },
  });

  const [check, { loading: checking }] = checkUpdatedDnsRecord({});

  if (error) {
    return (
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-red-50 border-red-200">
        <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-red-800">Domain not found</p>
          <p className="text-[12px] text-red-600 mt-0.5">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-20 bg-slate-100 rounded-xl" />
        <div className="h-64 bg-slate-50 rounded-xl" />
      </div>
    );
  }

  const domainDetails = data?.getCustomDomainDetails;
  if (!domainDetails) return null;

  const dnsRecords = !domainDetails.isSubDomain
    ? [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
        { key: "3", type: "A", ...domainDetails.aRecord },
      ]
    : [
        { key: "1", type: "CNAME", ...domainDetails.cname },
        { key: "2", type: "TXT", ...domainDetails.txt },
      ];

  const handleDelete = () => {
    del({ variables: { input: { id } } });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-2 pb-16">
      {/* Action Bar / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8 text-slate-500 hover:text-slate-900 shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-[18px] font-semibold tracking-tight text-slate-900 leading-none">
                {domainDetails.domain}
              </h1>
              {domainDetails.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[10px] font-semibold text-emerald-700 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] font-semibold text-amber-700 uppercase tracking-widest">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Pending
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-400 mt-1.5">DNS configuration and active status</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {domainDetails?.isVerified && (
            <>
              {domainDetails?.ssl ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-[11px] font-semibold text-emerald-700 mr-2">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  TLS Encrypted
                </span>
              ) : (
                <CheckSsl ssl={domainDetails.ssl} />
              )}
            </>
          )}

          <Button
            variant="ghost"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="h-9 px-4 text-[12px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 border border-slate-200 shadow-sm transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Detach
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {domainDetails.isVerified ? (
          // Verified State
          <>
            <div className="px-5 py-4 border-b border-emerald-100 bg-emerald-50 flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-emerald-900 tracking-tight">
                  Domain configuration complete
                </h3>
                <p className="text-[11px] text-emerald-700 mt-0.5 max-w-md">
                  DNS records are actively routing successfully to our edge infrastructure.
                </p>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg group hover:border-slate-300 transition-colors">
                <Globe className="h-5 w-5 text-slate-400 shrink-0" />
                <a
                  href={`https://www.${domainDetails.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 group-hover:underline flex-1 truncate font-mono"
                >
                  https://www.{domainDetails.domain}
                </a>
                <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
              </div>
            </div>
          </>
        ) : (
          // Setup Needed State
          <>
            <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 shrink-0">
                  <Globe className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">
                    DNS Configuration
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 max-w-md">
                    Apply these records at your registrar to route traffic.
                  </p>
                </div>
              </div>
              <DNSProviderGuide domainName={domainDetails.domain} />
            </div>

            <div className="p-5 space-y-5">
              {/* Alert instructions */}
              <div className="flex items-start gap-3 p-3.5 bg-slate-50 border border-slate-100 rounded-lg">
                <AlertCircle className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                <div className="space-y-2 text-[12px] text-slate-600">
                  <p className="font-semibold text-slate-800">Setup Instructions</p>
                  <ol className="list-decimal pl-4 space-y-1 text-slate-500">
                    <li>
                      Log in to your registrar and open DNS management for <strong className="text-slate-700">{domainDetails.domain}</strong>
                    </li>
                    <li>Add the records listed below EXACTLY as they appear</li>
                  </ol>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/50 mt-2 flex items-center gap-1">
                    <Info className="h-3 w-3 inline" /> Propagation across global networks can take up to 48h.
                  </div>
                </div>
              </div>

              {/* Records table */}
              <div className="rounded-lg border border-slate-200 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50 border-b border-slate-200">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-600 text-[11px] tracking-widest uppercase h-9">Type</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-[11px] tracking-widest uppercase h-9">Name</TableHead>
                      <TableHead className="font-semibold text-slate-600 text-[11px] tracking-widest uppercase h-9">Value</TableHead>
                      <TableHead className="text-right font-semibold text-slate-600 text-[11px] tracking-widest uppercase h-9">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dnsRecords.map((record) => (
                      <TableRow key={record.key} className="hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="font-mono text-[12px] font-semibold text-slate-700">
                          {record.type}
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-slate-600">
                          {record.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 group-hover:gap-3 transition-all">
                            <span className="font-mono text-[11px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded truncate max-w-[200px] sm:max-w-xs block">
                              {record.value}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(record.value)}
                              className="h-6 w-6 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {record.verified ? (
                            <span className="inline-flex items-center justify-end gap-1.5 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Verified</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center justify-end gap-1.5 text-[11px] font-semibold text-amber-600">
                              <Clock className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Pending</span>
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Action */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <p className="text-[11px] text-slate-400 select-none">Waiting for propagation...</p>
                <Button
                  onClick={() => check({ variables: { input: { id } } })}
                  loading={checking}
                  disabled={checking}
                  className="h-10 px-5 text-[12px] font-semibold bg-slate-900 hover:bg-black text-white shadow-sm gap-2 transition-all"
                >
                  {checking ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  {checking ? "Scanning network..." : "Re-Verify DNS"}
               </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detach Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200 shadow-xl rounded-xl">
          <div className="p-6">
            <AlertDialogHeader className="mb-6 text-left">
              <AlertDialogTitle className="text-[16px] font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                Detach Custom Domain
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] text-slate-500 mt-2 leading-relaxed">
                You are about to permanently detach <strong className="text-slate-700 font-mono">{domainDetails.domain}</strong> from this environment. This action prevents further routing and terminates TLS automation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="sm:justify-end gap-2 border-t border-slate-100 pt-4 mt-6">
              <AlertDialogCancel
                disabled={deleting}
                className="h-9 px-4 text-[12px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-none m-0"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="h-9 px-6 text-[12px] font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm gap-2 m-0"
              >
                {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {deleting ? "Detaching..." : "Confirm Detach"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
