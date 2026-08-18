"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  Tag,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useGetOfferById } from "@/graphql/actions/offers";
import { Badge } from "@/components/ui/badge";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: Tag, path: "manage" },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function OfferManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/offers/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const { data, loading } = useGetOfferById(id, {
    skip: !id,
  });

  const offer = data?.getOfferById;

  const statusColor =
    offer?.status === "APPROVED"
      ? "bg-emerald-500"
      : offer?.status === "DISABLED"
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
      statusVariant={offer?.status === "APPROVED" ? "default" : "secondary"}
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

