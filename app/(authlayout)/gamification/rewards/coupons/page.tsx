"use client";

import React, { Suspense } from "react";
import { CouponsManage } from "@/components/rewards/coupons/manage";

export default function RewardsCouponsPage() {
  return (
    <Suspense fallback={null}>
      <CouponsManage />
    </Suspense>
  );
}
