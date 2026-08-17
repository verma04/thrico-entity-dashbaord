"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Globe,
  Contact2,
  ChevronLeft,
  ChevronRight,
  Database,
  Tag,
  Code2,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetCRMMembers,
  CRMProvider,
  CRMMemberStatus,
  CRM_PROVIDERS_CONFIG,
  CRMMember,
} from "@/graphql/actions";
import { cn } from "@/lib/utils";

export default function CRMMembersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedProvider, setSelectedProvider] = useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [viewingMember, setViewingMember] = useState<CRMMember | null>(null);

  const { data, loading, refetch } = useGetCRMMembers({
    provider: selectedProvider !== "ALL" ? (selectedProvider as CRMProvider) : undefined,
    input: {
      page,
      limit: 15,
      search: search.trim() || undefined,
      status: selectedStatus !== "ALL" ? (selectedStatus as CRMMemberStatus) : undefined,
    },
  });

  const members = data?.getCRMMembers?.members || [];
  const totalCount = data?.getCRMMembers?.totalCount || 0;
  const totalPages = data?.getCRMMembers?.totalPages || 1;

  const renderStatusBadge = (status: CRMMemberStatus) => {
    switch (status) {
      case CRMMemberStatus.ACTIVE:
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]"
          >
            Active
          </Badge>
        );
      case CRMMemberStatus.INACTIVE:
        return (
          <Badge variant="outline" className="text-[10px] text-muted-foreground">
            Inactive
          </Badge>
        );
      case CRMMemberStatus.DEACTIVATED:
        return (
          <Badge
            variant="secondary"
            className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px]"
          >
            Deactivated
          </Badge>
        );
      case CRMMemberStatus.TERMINATED:
        return (
          <Badge variant="destructive" className="text-[10px]">
            Terminated
          </Badge>
        );
      default:
        return <Badge variant="outline" className="text-[10px]">{status}</Badge>;
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="CRM Member Directory"
        description="Unified index of imported leads, contacts, and accounts synchronized from connected CRM pipelines."
        breadcrumbs={[
          { label: "Integrations", href: "/settings/integrations" },
          { label: "CRM Hub", href: "/integrations/crm" },
          { label: "Members" },
        ]}
        icon={Users}
        badgeText={`${totalCount} Synced Records`}
        actions={
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => refetch()}
            disabled={loading}
          >
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
            Refresh
          </Button>
        }
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/50 shadow-sm">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search by email, name, or external ID..."
                className="pl-8 h-8 text-xs bg-background/60"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Select
                value={selectedProvider}
                onValueChange={(val) => {
                  setSelectedProvider(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs w-[140px] bg-background/60">
                  <SelectValue placeholder="All Providers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Providers</SelectItem>
                  {Object.values(CRMProvider).map((p) => (
                    <SelectItem key={p} value={p}>
                      {CRM_PROVIDERS_CONFIG[p]?.name || p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs w-[130px] bg-background/60">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All Status</SelectItem>
                  <SelectItem value={CRMMemberStatus.ACTIVE}>Active</SelectItem>
                  <SelectItem value={CRMMemberStatus.INACTIVE}>Inactive</SelectItem>
                  <SelectItem value={CRMMemberStatus.DEACTIVATED}>Deactivated</SelectItem>
                  <SelectItem value={CRMMemberStatus.TERMINATED}>Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Members Table */}
          <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/30 text-muted-foreground font-medium">
                    <th className="py-3 px-4">Contact / Email</th>
                    <th className="py-3 px-4">Provider</th>
                    <th className="py-3 px-4">Object Type</th>
                    <th className="py-3 px-4">External ID</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Last Synced</th>
                    <th className="py-3 px-4 text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {loading && members.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 opacity-50" />
                        Loading synchronized CRM members...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-muted-foreground">
                        No CRM members found matching your search or filters.
                      </td>
                    </tr>
                  ) : (
                    members.map((member) => {
                      const config = CRM_PROVIDERS_CONFIG[member.provider];
                      return (
                        <tr
                          key={member.id || member.externalId}
                          className="hover:bg-muted/30 transition-colors"
                        >
                          <td className="py-3 px-4 font-medium text-foreground">
                            {member.email || "No Email Provided"}
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10.5px] font-medium text-white shadow-xs"
                              style={{ backgroundColor: config?.color || "#555" }}
                            >
                              <Contact2 className="h-3 w-3" />
                              {config?.name || member.provider}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground font-mono text-[11px]">
                            {member.objectType || "Contact"}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-muted-foreground truncate max-w-[140px]">
                            {member.externalId}
                          </td>
                          <td className="py-3 px-4">
                            {renderStatusBadge(member.status)}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground text-[11px]">
                            {member.lastSyncedAt
                              ? new Date(member.lastSyncedAt).toLocaleString()
                              : "Recently"}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs px-2 gap-1"
                              onClick={() => setViewingMember(member)}
                            >
                              <Eye className="h-3 w-3" />
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between p-3 border-t border-border/40 text-xs text-muted-foreground bg-muted/10">
              <div>
                Showing Page <strong className="text-foreground">{page}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong> ({totalCount} total members)
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5 gap-1"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1 || loading}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5 gap-1"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages || loading}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </EcosystemContainer>

      {/* Member Details / Raw Custom Payload Inspector Dialog */}
      <Dialog open={!!viewingMember} onOpenChange={(open) => !open && setViewingMember(null)}>
        <DialogContent className="sm:max-w-[540px]">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-primary" />
              <DialogTitle className="text-sm">CRM Member Payload & Attributes</DialogTitle>
            </div>
            <DialogDescription className="text-xs">
              Raw schema payload received from {viewingMember?.provider} for record {viewingMember?.externalId}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-muted/40 border text-[11px]">
              <div>
                <span className="text-muted-foreground">External ID:</span>
                <p className="font-mono font-medium text-foreground">{viewingMember?.externalId}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Object Type:</span>
                <p className="font-mono font-medium text-foreground">{viewingMember?.objectType}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium text-foreground">{viewingMember?.email || "N/A"}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Status:</span>
                <p className="font-medium text-foreground">{viewingMember?.status}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-1.5 flex items-center gap-1.5">
                <Database className="h-3.5 w-3.5 text-muted-foreground" />
                Custom Fields JSON
              </p>
              <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-[11px] overflow-x-auto max-h-[260px] border border-slate-800 leading-relaxed">
                {viewingMember?.customFields
                  ? JSON.stringify(
                      typeof viewingMember.customFields === "string"
                        ? JSON.parse(viewingMember.customFields)
                        : viewingMember.customFields,
                      null,
                      2
                    )
                  : "// No additional custom attributes recorded"}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </EcosystemWrapper>
  );
}
