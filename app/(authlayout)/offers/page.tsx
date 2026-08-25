"use client";

import { Suspense } from "react";
import OffersDashboard from "@/components/offers/dashboard";
import { withModulePermission } from "@/components/hoc/with-module-permission";

/**
 * Promotional Offers & Discounts Dashboard Page
 * Route: /offers
 */
function OffersPage() {
  return (
    <Suspense fallback={null}>
      <OffersDashboard />
    </Suspense>
  );
}

export default withModulePermission(OffersPage, "OFFERS", "canRead");
