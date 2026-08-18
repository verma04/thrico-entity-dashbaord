"use client";

import React from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Settings,
  AlertTriangle,
  Activity,
  ShieldAlert,
} from "lucide-react";
import { useListingDetails } from "@/graphql/actions/listing";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: ShoppingBag, path: "manage" },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function ListingManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/listing/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const { data, loading } = useListingDetails({
    variables: {
      input: {
        listingId: id,
      },
    },
    skip: !id,
  });

  const listing = data?.getListingDetailsByID;

  const statusColor =
    listing?.status === "APPROVED"
      ? "bg-emerald-500"
      : listing?.status === "DISABLED"
        ? "bg-red-500"
        : "bg-amber-500";

  return (
    <ManageItemLayout
      title={listing?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      coverImage={
        listing?.media && listing.media.length > 0
          ? listing.media[0].url
          : null
      }
      defaultIcon={ShoppingBag}
      status={listing?.status}
      statusVariant={listing?.status === "APPROVED" ? "default" : "secondary"}
      statusColor={statusColor}
      subtitle={
        !loading && listing?.category ? (
          <span>
            {listing.category}
            {listing.location?.name ? ` · ${listing.location.name}` : ""}
          </span>
        ) : null
      }
      closeHref="/listing/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/listing/all" },
        { label: listing?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(
  ListingManagementLayout,
  "LISTING",
  "canRead",
);

