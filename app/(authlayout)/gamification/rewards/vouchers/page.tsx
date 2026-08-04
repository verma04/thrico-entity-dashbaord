"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Vouchers has been merged into the Coupons page.
 * This page redirects to /rewards/coupons (Voucher Codes tab).
 */
export default function VoucherRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/rewards/coupons");
  }, [router]);

  return null;
}
