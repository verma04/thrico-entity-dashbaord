"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Plus,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Layers,
  AlertCircle,
  Zap,
  ShieldCheck,
  Activity,
  RotateCcw,
  Timer,
  LayoutGrid,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopDashboardPage() {
  const loading = false;
  const kpis = [
    {
      title: "Total Views",
      value: "1,234",
      trend: 12,
      icon: Eye,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Products",
      value: "156",
      trend: -2,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Banners",
      value: "5",
      trend: 0,
      icon: ImageIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Categories",
      value: "8",
      trend: 0,
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  const quickActions = [
    { label: "Manage Banners", href: "/shop/banners" },
    { label: "Manage Categories", href: "#" },
    { label: "Product Tags", href: "#" },
    { label: "Collections", href: "#" },
    { label: "SEO Settings", href: "#" },
  ];

  return (
    <EcosystemWrapper anonymized-1="shop-intelligence">
      <EcosystemHeader
        title="Commerce Hub"
        description="Monitor product performance, inventory status, and storefront analytics."
        badgeText="Overview"
        icon={ShoppingBag}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Commerce Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/shop/all">
              <Button
                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 text-indigo-500" />
                Catalog
              </Button>
            </Link>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/shop/all?action=create">
              <Button className="h-9 px-6 rounded-lg bg-zinc-900 border-zinc-800 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-black transition-all active:scale-95 group">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Period stats" />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Shop Activity"
              description="Real-time visibility metrics"
              icon={TrendingUp}
            >
              <div className="flex flex-col items-center justify-center p-12 text-center min-h-[350px]">
                <div className="w-16 h-16 rounded-2xl bg-zinc-50 border border-zinc-100 flex items-center justify-center text-zinc-300 mb-6">
                  <Activity className="h-8 w-8 animate-pulse" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-tight mb-2">
                  Intelligence Sync Pending
                </h3>
                <p className="text-[10px] font-medium text-zinc-400 uppercase tracking-widest leading-relaxed max-w-sm">
                  We are aggregating storefront performance data. Visual insights
                  will automatically populate once the synchronization is
                  complete.
                </p>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <EcosystemCard
              title="Stock Alerts"
              description="Inventory exceptions"
              icon={AlertCircle}
            >
              <div className="p-5 rounded-xl border border-rose-100 bg-rose-50/20 mb-4">
                <p className="text-xs font-bold text-zinc-800 uppercase tracking-tight mb-4">
                  12 items require restocking attention.
                </p>
                <Link href="/shop/all?filter=low-stock">
                  <Button
                    variant="outline"
                    className="w-full h-9 rounded-lg border-rose-200 font-bold text-[9px] uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  >
                    View Low Stock
                  </Button>
                </Link>
              </div>
            </EcosystemCard>

            <EcosystemCard
              title="Operational Tools"
              description="Common workflows"
              icon={Zap}
            >
              <div className="grid grid-cols-1 gap-2">
                {quickActions.map((action, i) => (
                  <Link key={i} href={action.href}>
                    <div className="group/btn flex items-center justify-between p-3.5 rounded-lg border border-zinc-100 hover:bg-zinc-50 hover:border-indigo-200 transition-all">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-indigo-600">
                        {action.label}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-zinc-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
