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
  Loader2,
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
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Design Tokens
// ---------------------------------------------------------------------------
const STYLES = {
  card: "rounded-lg border border-slate-200/60 bg-white",
  heading: "text-[16px] font-semibold tracking-tight text-slate-900 leading-none",
  label: "text-[11px] font-bold uppercase tracking-widest text-slate-400",
  mono: "font-mono text-[12px] text-slate-600",
};

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
      toast.success("Domain detached successfully");
      router.push("/settings/domains");
    },
  });

  const [check, { loading: checking }] = checkUpdatedDnsRecord({
    onCompleted: (data: any) => {
      if (data?.checkUpdatedDnsRecord?.success) {
        toast.success("DNS records updated");
      }
    }
  });

  if (error) {
    return (
      <div className="flex items-start gap-4 p-5 rounded-lg border border-red-200/50 bg-red-50/30">
        <AlertCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
        <div>
          <p className="text-[13px] font-bold text-red-900 uppercase tracking-wide">
            Endpoint error
          </p>
          <p className="text-[12px] text-red-600 mt-1 font-medium">{error.message}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 animate-pulse">
        <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-lg" />
        <div className="grid grid-cols-1 gap-6">
          <div className="h-64 w-full bg-slate-50 border border-slate-100 rounded-lg" />
        </div>
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
    toast.success("Copied to clipboard");
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 pb-20">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-slate-100">
        <div className="flex items-start gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-9 w-9 rounded-md text-slate-400 hover:text-slate-900 hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="pt-0.5">
            <div className="flex items-center gap-3">
              <h1 className={STYLES.heading}>
                {domainDetails.domain}
              </h1>
              {domainDetails.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-100 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                  <span className="h-1 w-1 rounded-full bg-emerald-500" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                  <span className="h-1 w-1 rounded-full bg-amber-500 animate-pulse" />
                  Propagation
                </span>
              )}
            </div>
            <p className="text-[13px] text-slate-500 mt-2 font-medium leading-none">
              Manage infrastructure settings for your custom domain.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {domainDetails?.isVerified && (
            <>
              {domainDetails?.ssl ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white border border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Mutual TLS Managed
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
            className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200/60 shadow-none transition-all"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Detach Entity
          </Button>
        </div>
      </div>

      {/* Main Configuration Card */}
      <div className={STYLES.card}>
        {domainDetails.isVerified ? (
          // Verified Infrastructure State
          <>
            <div className="p-8 border-b border-slate-100 flex items-start gap-5">
              <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  Public Traffic Route Active
                </h3>
                <p className="text-[13px] text-slate-500 mt-1 max-w-md font-medium leading-relaxed">
                  Traffic is served via our global edge network. All requests are automatically upgraded to HTTPS.
                </p>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg group transition-all">
                <div className="h-8 w-8 rounded bg-white border border-slate-100 flex items-center justify-center shrink-0">
                  <Globe className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">External Resource</p>
                  <a
                    href={`https://${domainDetails.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] font-bold text-slate-900 group-hover:text-black group-hover:underline truncate font-mono"
                  >
                    https://{domainDetails.domain}
                  </a>
                </div>
                <ExternalLink className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors shrink-0" />
              </div>
            </div>
          </>
        ) : (
          // Pending DNS Propagation State
          <>
            <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/40">
              <div className="flex items-center gap-4">
                <div className="h-9 w-9 rounded-md bg-slate-100 text-slate-400 flex items-center justify-center border border-slate-200 shrink-0">
                  <Globe className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">
                    Authoritative DNS Records
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Provision these entries at your registrar.
                  </p>
                </div>
              </div>
              <DNSProviderGuide domainName={domainDetails.domain} />
            </div>

            <div className="p-8 space-y-8">
              <div className="flex items-start gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-lg">
                <Info className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div className="text-[12px] text-slate-600 font-medium leading-relaxed">
                  <p className="text-slate-900 font-bold mb-1.5 uppercase tracking-wide text-[11px]">Verification Logic</p>
                  <p className="text-slate-500">Propagation can take up to 48 hours depending on your registrar’s TTL settings. Please ensure values match exactly.</p>
                </div>
              </div>

              {/* Records Table */}
              <div className="rounded-lg border border-slate-200/60 overflow-hidden bg-white">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent border-b border-slate-200/60">
                      <TableHead className={cn(STYLES.label, "h-10 pl-6")}>Type</TableHead>
                      <TableHead className={cn(STYLES.label, "h-10")}>Identity / Name</TableHead>
                      <TableHead className={cn(STYLES.label, "h-10")}>Target Value</TableHead>
                      <TableHead className={cn(STYLES.label, "h-10 text-right pr-6")}>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dnsRecords.map((record) => (
                      <TableRow
                        key={record.key}
                        className="hover:bg-slate-50/30 transition-colors group border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="pl-6">
                           <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 text-[10px] font-bold text-slate-600 font-mono">
                            {record.type}
                          </span>
                        </TableCell>
                        <TableCell className="font-mono text-[11px] text-slate-500 font-medium">
                          {record.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-[11px] text-slate-900 bg-slate-50 border border-slate-200 px-2 py-1 rounded truncate max-w-[200px] sm:max-w-xs font-mono">
                              {record.value}
                            </code>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => copyToClipboard(record.value)}
                              className="h-7 w-7 rounded-md text-slate-300 hover:text-slate-900 hover:bg-white border border-transparent hover:border-slate-100 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          {record.verified ? (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                              <CheckCircle2 className="h-3 w-3" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                              <Clock className="h-3 w-3" />
                              Waiting
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Action Area */}
              <div className="flex items-center justify-between pt-2">
                 <div className="flex items-center gap-2">
                    <RefreshCw className={cn("h-3 w-3 text-slate-300", checking && "animate-spin")} />
                    <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                      Network scanning available every 60s
                    </p>
                 </div>
                <Button
                  onClick={() => check({ variables: { input: { id } } })}
                  disabled={checking}
                  className="h-9 px-6 text-[11px] font-bold uppercase tracking-wider bg-slate-900 hover:bg-black text-white rounded-md shadow-none gap-2 transition-all active:scale-[0.98]"
                >
                  {checking ? "Scanning network..." : "Re-Verify DNS Namespace"}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detach Dialog */}
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="sm:max-w-md p-0 overflow-hidden border-slate-200/60 rounded-lg shadow-none">
          <div className="px-6 py-5 border-b border-slate-100 bg-rose-50/20">
            <AlertDialogHeader className="text-left">
              <AlertDialogTitle className="text-[15px] font-semibold text-slate-900 tracking-tight flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500" />
                Detach Custom Resource
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[12px] text-slate-500 mt-2 font-medium leading-relaxed">
                You are about to remove <code className="text-slate-900 bg-slate-100 px-1 rounded">{domainDetails.domain}</code>. Public traffic routing will cease immediately.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          <div className="p-6">
            <AlertDialogFooter className="sm:justify-end gap-2">
              <AlertDialogCancel
                disabled={deleting}
                className="h-9 px-4 text-[11px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-none m-0 shadow-none"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="h-9 px-6 text-[11px] font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-700 text-white rounded-md m-0 shadow-none"
              >
                {deleting ? "Detaching..." : "Confirm Detach"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
