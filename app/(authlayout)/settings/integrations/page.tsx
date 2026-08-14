"use client";

import React, { useState, useMemo } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import {
  ShopifyIntegrationCard,
} from "@/components/settings/integrations";
import {
  Search,
  Blocks,
  Inbox,
  Sparkles,
  ShieldCheck,
  Zap,
  RefreshCw,
  X,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IntegrationItem {
  id: string;
  name: string;
  category: "ecommerce";
  categoryLabel: string;
  description: string;
  component: React.ReactNode;
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const integrations: IntegrationItem[] = useMemo(
    () => [
      {
        id: "shopify",
        name: "Shopify",
        category: "ecommerce",
        categoryLabel: "E-Commerce",
        description: "Sync products, customers, and checkout orders in real-time.",
        component: <ShopifyIntegrationCard />,
      },
    ],
    []
  );

  const categories = [
    { id: "all", label: "All Apps", icon: Layers, count: integrations.length },
    {
      id: "ecommerce",
      label: "E-Commerce",
      icon: ShoppingBag,
      count: integrations.filter((i) => i.category === "ecommerce").length,
    },
  ];

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((integration) => {
      const matchesCategory =
        selectedCategory === "all" || integration.category === selectedCategory;
      const matchesSearch =
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.categoryLabel
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        integration.description
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [integrations, selectedCategory, searchQuery]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="App Integrations"
        description="Connect third-party platforms, configure event webhooks, and automate data synchronization."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Integrations" },
        ]}
        icon={Blocks}
        badgeText="Ecosystem & APIs"
        showLiveIndicator={false}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-6">
          {/* Top Quick Highlights Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Available Apps
                </span>
                <Blocks className="h-3.5 w-3.5 opacity-70" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  {integrations.length}
                </span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Services
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Auto-Sync Engine
                </span>
                <Zap className="h-3.5 w-3.5 text-amber-500 opacity-90" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">Active</span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Real-time
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Store Sync
                </span>
                <RefreshCw className="h-3.5 w-3.5 text-indigo-500 opacity-90" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">Catalog</span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  Products & Orders
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-[11px] font-semibold uppercase tracking-wider">
                  Security
                </span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 opacity-90" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">Encrypted</span>
                <span className="text-[11px] text-muted-foreground font-medium">
                  OAuth & Keys
                </span>
              </div>
            </div>
          </div>

          {/* Action Bar with Search and Category Pills */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "h-7.5 px-2.5 rounded-lg text-xs font-medium transition-all duration-150 flex items-center gap-1.5 shrink-0 border cursor-pointer",
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-2xs font-semibold"
                        : "bg-card text-muted-foreground hover:text-foreground border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <Icon className="h-3 w-3 opacity-70" />
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        "text-[10px] px-1 rounded-full",
                        isSelected
                          ? "bg-background/20 text-background"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
              <Input
                type="search"
                placeholder="Search integrations..."
                className="pl-8 pr-7 h-7.5 text-xs bg-card border-border/60 shadow-2xs focus-visible:ring-1 focus-visible:ring-primary/20 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Integrations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredIntegrations.map((integration) => (
              <React.Fragment key={integration.id}>
                {integration.component}
              </React.Fragment>
            ))}
          </div>

          {/* Empty State */}
          {filteredIntegrations.length === 0 && (
            <div className="p-12 flex flex-col items-center text-center justify-center rounded-xl border border-dashed border-border/70 bg-card/50">
              <div className="h-11 w-11 rounded-full bg-muted flex items-center justify-center mb-3">
                <Inbox className="h-5 w-5 text-muted-foreground/60" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                No matching integrations found
              </p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                We couldn't find any tools matching "{searchQuery}". Try searching with different keywords or clearing filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 h-7.5 text-xs"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
          )}

          {/* Security & Infrastructure Footer Note */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/30 border border-border/50 text-xs">
            <ShieldCheck className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
            <div className="space-y-0.5 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground text-xs">
                Enterprise Integration Security
              </p>
              <p className="text-[11px]">
                All third-party data synchronizations are encrypted end-to-end via TLS 1.3. API credentials and OAuth tokens are strictly isolated per tenant workspace and never exposed in client bundles.
              </p>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

