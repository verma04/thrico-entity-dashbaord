"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Inventory has been merged into the Rewards & Codes page.
 * This page redirects to /rewards/coupons (Inventory tab).
 */
export default function InventoryRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rewards/coupons");
  }, [router]);

  return null;
}
