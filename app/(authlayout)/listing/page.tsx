"use client";

import { Suspense } from "react";
import ListingsDashboard from "@/components/listings/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";

/**
 * Marketplace & Catalog Listings Dashboard Page
 * Route: /listing
 */
const MarketplaceDashboardPage = () => {
  return (
    <Suspense fallback={null}>
      <ListingsDashboard />
    </Suspense>
  );
};

export default withModulePermission(
  MarketplaceDashboardPage,
  "LISTING",
  "canRead"
);
