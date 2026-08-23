"use client";

import React from "react";
import { ShopifyDiscountForm } from "@/components/discounts/shopify-discount-form";

export default function CreateShopifyDiscountPage() {
  return (
    <ShopifyDiscountForm
      pageTitle="Create discount"
      backHref="/integrations/shopify/coupons"
    />
  );
}
