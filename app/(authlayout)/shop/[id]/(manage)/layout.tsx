"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Settings,
  AlertTriangle,
  Activity,
  ShoppingBag,
  ShieldAlert,
} from "lucide-react";
import { useShopProduct } from "@/graphql/actions/shop";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";
import {
  ManageItemLayout,
  type ManageTabItem,
} from "@/components/layout/manage-item-layout";

const tabItems: ManageTabItem[] = [
  { key: "manage", label: "Overview", icon: ShoppingBag, path: "manage" },
  { key: "settings", label: "Settings", icon: Settings },
  { key: "audit-log", label: "Audit Log", icon: Activity },
  { key: "danger-zone", label: "Danger Zone", icon: AlertTriangle, danger: true },
  { key: "reported-items", label: "Reported Items", icon: ShieldAlert },
];

function ShopManagementLayout({ children }: { children: React.ReactNode }) {
  const moduleName = useModuleStore((state) => state.shopModuleName);
  const singularName = useModuleStore((state) => state.shopSingularName);
  const pathname = usePathname();
  const id = pathname?.split("/")[2];
  const basePath = `/shop/${id}`;
  const currentTab =
    pathname === basePath || pathname === `${basePath}/`
      ? "manage"
      : pathname?.replace(`${basePath}/`, "").split("/")[0] || "manage";

  const { data, loading } = useShopProduct(id);

  const product = data?.getShopProduct;

  const statusColor =
    product?.status === "PUBLISHED" || product?.status === "ACTIVE"
      ? "bg-emerald-500"
      : product?.status === "DRAFT" || product?.status === "INACTIVE"
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <ManageItemLayout
      title={product?.title || `${singularName} Details`}
      loading={loading}
      loadingText={`Loading ${singularName}...`}
      defaultIcon={ShoppingBag}
      iconContainerClassName="bg-indigo-50 border-indigo-100 text-indigo-500"
      status={product?.status}
      statusVariant={
        product?.status === "PUBLISHED" || product?.status === "ACTIVE"
          ? "default"
          : "secondary"
      }
      statusColor={statusColor}
      subtitle={
        !loading && product ? (
          <span>
            {product.category || "Uncategorized"} ·{" "}
            {product.currency || "USD"} {product.price}
          </span>
        ) : null
      }
      closeHref="/shop/all"
      basePath={basePath}
      currentTab={currentTab}
      tabs={tabItems}
      breadcrumbs={[
        { label: moduleName, href: "/shop/all" },
        { label: product?.title || `${singularName} Details` },
      ]}
    >
      {children}
    </ManageItemLayout>
  );
}

export default withModulePermission(ShopManagementLayout, "SHOP", "canRead");

