"use client";

import React, { useState } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname, useRouter } from "next/navigation";
import {
  Tag,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
  RotateCcw,
  Upload,
} from "lucide-react";
import { useGetOfferById } from "@/graphql/actions/offers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";
import { toast } from "sonner";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import moment from "moment";
import { cn } from "@/lib/utils";

function OfferManagementLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const moduleName = useModuleStore((state) => state.offerModuleName) || "Offers";
  const singularName = useModuleStore((state) => state.offerSingularName) || "Offer";
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/offers/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, loading, refetch } = useGetOfferById(id, {
    skip: !id,
  });

  const offer = data?.getOfferById;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (refetch) {
        await refetch();
      }
      toast.success(`${singularName} details refreshed`);
    } catch {
      toast.error("Failed to refresh details");
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  const handleExportSummary = () => {
    if (!offer) {
      toast.error("No offer data available to export");
      return;
    }

    const summaryRow = [
      {
        id: offer.id || id,
        title: offer.title || "",
        category: offer.category?.name || "General",
        discount: offer.discount || "",
        company: offer.company || "",
        location: offer.location || "",
        status: offer.status || "ACTIVE",
        claims: offer.claimsCount ?? 0,
        views: offer.viewsCount ?? 0,
        validityStart: offer.validityStart
          ? moment(offer.validityStart).format("YYYY-MM-DD")
          : "N/A",
        validityEnd: offer.validityEnd
          ? moment(offer.validityEnd).format("YYYY-MM-DD")
          : "N/A",
      },
    ];

    const csv = buildCsv(summaryRow, [
      { header: "Offer ID", getValue: (r) => r.id },
      { header: "Title", getValue: (r) => r.title },
      { header: "Category", getValue: (r) => r.category },
      { header: "Discount Value", getValue: (r) => r.discount },
      { header: "Partner / Company", getValue: (r) => r.company },
      { header: "Location", getValue: (r) => r.location },
      { header: "Status", getValue: (r) => r.status },
      { header: "Total Redemptions", getValue: (r) => r.claims },
      { header: "Views", getValue: (r) => r.views },
      { header: "Start Date", getValue: (r) => r.validityStart },
      { header: "End Date", getValue: (r) => r.validityEnd },
    ]);

    downloadCsv(csv, `${singularName.toLowerCase()}-${offer.title?.toLowerCase().replace(/\s+/g, "-") || id}`);
    toast.success(`Exported ${singularName.toLowerCase()} summary`);
  };

  const tabItems: ManageTabItem[] = [
    { key: "manage", label: "Overview", icon: Tag, path: "manage" },
    { key: "settings", label: "Settings", icon: Settings, path: "settings" },
    { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, path: "danger-zone", danger: true },
    { key: "audit-log", label: "Audit Log", icon: Activity, path: "audit-log" },
    { key: "reported-items", label: "Reported Items", icon: ShieldAlert, path: "reported-items" },
  ];

  const isOfferActive = offer?.status === "ACTIVE";
  const isOfferExpired = offer?.status === "EXPIRED";

  const statusColor = isOfferActive
    ? "bg-emerald-500"
    : isOfferExpired
      ? "bg-red-500"
      : "bg-amber-500";

  return (
    <ManageItemLayout
      title={offer?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      coverImage={offer?.image}
      defaultIcon={Tag}
      status={offer?.status}
      statusVariant={isOfferActive ? "default" : "secondary"}
      statusColor={statusColor}
      badges={
        !loading && offer?.category?.name ? (
          <Badge
            variant="secondary"
            className="px-2 py-0 text-[10px] font-semibold uppercase tracking-wider rounded-md"
          >
            {offer.category.name}
          </Badge>
        ) : null
      }
      subtitle={
        !loading && offer?.discount ? (
          <span>Discount: {offer.discount}</span>
        ) : null
      }
      headerActions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportSummary}
            className="h-8 gap-1.5 rounded-lg border-border/60 text-xs font-semibold shadow-2xs hover:bg-muted"
          >
            <Upload className="h-3.5 w-3.5" />
            Export CSV
          </Button>

          <Button
            variant="outline"
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing || loading}
            className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
            title="Refresh details"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin text-primary")}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`${basePath}/settings`)}
            className="h-8 gap-1.5 rounded-lg border-border/60 text-xs font-semibold shadow-2xs hover:bg-muted"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Button>
        </div>
      }
      closeHref="/offers/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/offers/all" },
        { label: offer?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(OfferManagementLayout, "OFFERS", "canRead");
