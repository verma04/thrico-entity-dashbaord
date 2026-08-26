"use client";

import React from "react";
import {
  ExportCsvModal,
  ExportCsvScope,
  ExportCsvFormat,
} from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { safeFormat } from "@/lib/date-utils";
import { useExportData } from "@/graphql/actions/export";
import { Mail } from "lucide-react";

export interface MemberFilters {
  status?: string;
  search?: string;
  membershipTierId?: string;
  industryId?: string;
}

export interface ExportMembersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  users?: any[];
  totalCount: number;
  matchingCount?: number;
  selectedCount?: number;
  filters?: MemberFilters;
  onSuccess?: () => void;
}

export function ExportMembersModal({
  open,
  onOpenChange,
  users = [],
  totalCount,
  matchingCount,
  selectedCount,
  filters,
  onSuccess,
}: ExportMembersModalProps) {
  const [exportDataMutation, { loading }] = useExportData();

  const handleExport = (scope: ExportCsvScope, format: ExportCsvFormat) => {
    const rows =
      scope === "matching" || scope === "current" ? users : users;

    if (rows.length === 0) {
      toast.error("Nothing to export", {
        description: "There are no members on this page to export.",
      });
      return;
    }

    const csv = buildCsv(rows, [
      {
        header: "First Name",
        getValue: (r: any) => r.user?.firstName || "",
      },
      {
        header: "Last Name",
        getValue: (r: any) => r.user?.lastName || "",
      },
      { header: "Email", getValue: (r: any) => r.user?.email || "" },
      {
        header: "Phone",
        getValue: (r: any) =>
          r.user?.profile?.phone?.phoneNumber
            ? `+${r.user.profile.phone.countryCode || ""}-${r.user.profile.phone.phoneNumber}`
            : "",
      },
      { header: "Status", getValue: (r: any) => r.status || "" },
      {
        header: "Tier",
        getValue: (r: any) => r.membershipTier?.name || "",
      },
      {
        header: "Points",
        getValue: (r: any) =>
          r.gamificationSummary?.totalPointsEarned ?? 0,
      },
      {
        header: "Wallet",
        getValue: (r: any) => r.entityCurrencyWallet?.balance ?? 0,
      },
      {
        header: "Rank",
        getValue: (r: any) => r.gamificationSummary?.rankPosition ?? "",
      },
      {
        header: "Badges",
        getValue: (r: any) =>
          r.gamificationSummary?.totalBadgesEarned ?? 0,
      },
      {
        header: "Impact Score",
        getValue: (r: any) => r.impactScore ?? 0,
      },
      {
        header: "Location",
        getValue: (r: any) => r.user?.location?.name || "",
      },
      {
        header: "Industries",
        getValue: (r: any) =>
          (r.industries || []).map((i: any) => i.title).join("; "),
      },
      {
        header: "Source",
        getValue: (r: any) => r.user?.loginType || "EMAIL",
      },
      {
        header: "Verified",
        getValue: (r: any) => (r.verification?.isVerified ? "Yes" : "No"),
      },
      {
        header: "Joined",
        getValue: (r: any) =>
          safeFormat(r.user?.createdAt, "yyyy-MM-dd", ""),
      },
      {
        header: "Last Session",
        getValue: (r: any) =>
          safeFormat(r.lastSession?.lastUsed, "yyyy-MM-dd HH:mm", ""),
      },
      {
        header: "Referrer",
        getValue: (r: any) =>
          r.referrer?.user
            ? `${r.referrer.user.firstName || ""} ${r.referrer.user.lastName || ""}`.trim()
            : "Direct Join",
      },
    ]);

    const label =
      scope === "matching" ? "members-search" : "members-page";
    downloadCsv(
      csv,
      `${label}-${new Date().toISOString().slice(0, 10)}`,
      format,
    );

    toast.success(`Export ready`, {
      description: `${rows.length} member${rows.length !== 1 ? "s" : ""} exported successfully.`,
    });
  };

  const handleExportAll = async (format: ExportCsvFormat) => {
    try {
      const res = await exportDataMutation({
        variables: {
          input: {
            module: "MEMBERS",
            format,
            status:
              filters?.status && filters.status !== "ALL"
                ? filters.status
                : undefined,
            search: filters?.search?.trim() || undefined,
            membershipTierId:
              filters?.membershipTierId && filters.membershipTierId !== "ALL"
                ? filters.membershipTierId
                : undefined,
            industryId:
              filters?.industryId && filters.industryId !== "ALL"
                ? filters.industryId
                : undefined,
          },
        },
      });

      if (res.data?.exportData?.success) {
        toast.success("CSV will be sent to your email", {
          description:
            res.data.exportData.message ||
            `Exporting all ${totalCount.toLocaleString()} members — we'll email you the file when it's ready.`,
          icon: <Mail className="h-4 w-4" />,
          duration: 5000,
        });
        onSuccess?.();
      } else {
        toast.error("Export failed", {
          description:
            res.data?.exportData?.message || "Could not start member export.",
        });
      }
    } catch (err: any) {
      toast.error("Export failed", {
        description:
          err?.message || "Something went wrong while exporting members.",
      });
    }
  };

  return (
    <ExportCsvModal
      open={open}
      onOpenChange={onOpenChange}
      entityName="members"
      description="Export member profiles, tier statuses, gamification scores, and contact information. For All Members, the file is processed and delivered directly to your email."
      totalCount={totalCount}
      matchingCount={matchingCount}
      selectedCount={selectedCount}
      loading={loading}
      onExport={handleExport}
      onExportAll={handleExportAll}
    />
  );
}

// Re-export common types for convenience and backwards compatibility
export {
  ExportCsvModal,
  type ExportCsvScope as ExportScope,
  type ExportCsvFormat as ExportFormat,
};

export default ExportMembersModal;
