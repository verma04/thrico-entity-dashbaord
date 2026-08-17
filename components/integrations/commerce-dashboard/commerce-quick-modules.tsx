"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Package,
  ShoppingCart,
  Tag,
  Sparkles,
  Settings,
} from "lucide-react";
import { ModulePerformanceCard } from "@/components/layout/ecosystem/module-performance-card";

interface CommerceQuickModulesProps {
  brand: "shopify" | "woocommerce";
  totalCustomers: number | string;
  syncedProducts: number | string;
  ordersProcessed: number | string;
  couponsCount: number | string;
  rewardsClaimed: number | string;
  loading?: boolean;
}

export function CommerceQuickModules({
  brand,
  totalCustomers,
  syncedProducts,
  ordersProcessed,
  couponsCount,
  rewardsClaimed,
  loading = false,
}: CommerceQuickModulesProps) {
  const basePath = `/integrations/${brand}`;

  const modules = [
    {
      title: "Store Customers",
      icon: Users,
      color: "text-emerald-600",
      href: `${basePath}/user`,
      stats: [
        `${loading ? "..." : totalCustomers} synced`,
        "Profile matched",
      ],
    },
    {
      title: "Product Catalog",
      icon: Package,
      color: "text-blue-600",
      href: `${basePath}/product`,
      stats: [
        `${loading ? "..." : syncedProducts} items`,
        "Live inventory",
      ],
    },
    {
      title: "Orders & Checkouts",
      icon: ShoppingCart,
      color: "text-cyan-600",
      href: `${basePath}/orders`,
      stats: [
        `${loading ? "..." : ordersProcessed} processed`,
        "Auto-rewarded",
      ],
    },
    {
      title: "Coupons & Discounts",
      icon: Tag,
      color: "text-amber-600",
      href: `${basePath}/coupons`,
      stats: [
        `${loading ? "..." : couponsCount} active`,
        "Promo rules",
      ],
    },
    {
      title: "Gamification Rules",
      icon: Sparkles,
      color: "text-purple-600",
      href: "/gamification/points-and-badges",
      stats: [
        `${loading ? "..." : rewardsClaimed} claimed`,
        "Points & Badges",
      ],
    },
    {
      title: "Integration Keys",
      icon: Settings,
      color: "text-slate-600",
      href: "/settings/integrations",
      stats: [
        "Webhooks active",
        "API connected",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {modules.map((mod) => (
        <Link href={mod.href} key={mod.title} className="block group">
          <ModulePerformanceCard
            title={mod.title}
            icon={mod.icon}
            stats={mod.stats}
            color={mod.color}
          />
        </Link>
      ))}
    </div>
  );
}
