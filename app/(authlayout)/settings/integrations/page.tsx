"use client";

import React, { useState, useMemo } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import {
  ShopifyIntegrationCard,
  WooCommerceIntegrationCard,
  HRIntegrationCard,
} from "@/components/settings/integrations";
import { HR_PROVIDERS_CONFIG, HRProviderMetaConfig, useGetHRProviders } from "@/graphql/actions";
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
  ArrowRight,
  Briefcase,
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

  const { data: hrProvidersData, loading: hrLoading } = useGetHRProviders();
  const hrProviders = hrProvidersData?.getHRProviders || [];

  const integrations: IntegrationItem[] = useMemo(
    () => [
      {
        id: "shopify",
        name: "Shopify",
        category: "ecommerce",
        categoryLabel: "E-Commerce",
        description:
          "Sync products, customers, and checkout orders in real-time.",
        component: <ShopifyIntegrationCard />,
      },
      {
        id: "woocommerce",
        name: "WooCommerce",
        category: "ecommerce",
        categoryLabel: "E-Commerce",
        description:
          "Sync WordPress WooCommerce catalog, customers, and orders via REST API keys.",
        component: <WooCommerceIntegrationCard />,
      },
      ...hrProviders
        .map((meta: any) => {
          const config = HR_PROVIDERS_CONFIG[meta.provider];
          if (!config) return null;
          return {
            id: meta.provider.toLowerCase(),
            name: meta.name || config.name,
            category: "hr" as const,
            categoryLabel: "HR & Directory",
            description: config.description,
            component: <HRIntegrationCard providerKey={config.provider} />,
          };
        })
        .filter(Boolean) as IntegrationItem[],
    ],
    [hrProviders],
  );

  const categories = [
    { id: "all", label: "All Apps", icon: Layers, count: integrations.length },
    {
      id: "ecommerce",
      label: "E-Commerce",
      icon: ShoppingBag,
      count: integrations.filter((i) => i.category === "ecommerce").length,
    },
    {
      id: "hr",
      label: "HR & Directory",
      icon: Briefcase,
      count: integrations.filter((i) => i.category === "hr").length,
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
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Available Apps",
                value: integrations.length,
                sub: "Services",
                icon: Blocks,
                iconClass: "text-muted-foreground",
              },
              {
                label: "Auto-Sync Engine",
                value: "Active",
                sub: "Real-time",
                icon: Zap,
                iconClass: "text-amber-500",
                subClass: "text-emerald-600 dark:text-emerald-400",
              },
              {
                label: "Store Sync",
                value: "Catalog",
                sub: "Products & Orders",
                icon: RefreshCw,
                iconClass: "text-indigo-500",
              },
              {
                label: "Security",
                value: "Encrypted",
                sub: "OAuth & Keys",
                icon: ShieldCheck,
                iconClass: "text-emerald-500",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="group p-3.5 rounded-xl bg-card border border-border/50 shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-300 space-y-1.5"
              >
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                  <stat.icon
                    className={cn(
                      "h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:scale-110",
                      stat.iconClass,
                    )}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground tracking-tight">
                    {stat.value}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-medium",
                      stat.subClass || "text-muted-foreground",
                    )}
                  >
                    {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Filters Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const CatIcon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "h-8 px-3 rounded-lg text-[12px] font-medium transition-all duration-200 flex items-center gap-1.5 shrink-0 border cursor-pointer",
                      isSelected
                        ? "bg-foreground text-background border-foreground shadow-sm font-semibold"
                        : "bg-card text-muted-foreground hover:text-foreground border-border/50 hover:border-border/80 hover:bg-muted/40",
                    )}
                  >
                    <CatIcon className="h-3.5 w-3.5 opacity-70" />
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ml-0.5",
                        isSelected
                          ? "bg-background/20 text-background"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
              <Input
                type="search"
                placeholder="Search integrations…"
                className="pl-8 pr-7 h-8 text-[12px] bg-card border-border/50 shadow-[0_1px_2px_rgba(0,0,0,0.03)] focus-visible:ring-1 focus-visible:ring-primary/20 rounded-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 transition-colors duration-150"
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
            <div className="p-14 flex flex-col items-center text-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30">
              <div className="h-12 w-12 rounded-xl bg-muted/80 flex items-center justify-center mb-4">
                <Inbox className="h-5 w-5 text-muted-foreground/50" />
              </div>
              <p className="text-[14px] font-semibold text-foreground">
                No matching integrations
              </p>
              <p className="text-[13px] text-muted-foreground mt-1.5 max-w-sm leading-relaxed">
                We couldn't find any tools matching "{searchQuery}". Try a
                different search term or clear your filters.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 h-8 text-[12px] rounded-lg gap-1.5"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
              >
                Reset Filters
                <ArrowRight className="h-3 w-3 opacity-50" />
              </Button>
            </div>
          )}

          {/* Footer Note */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/40 text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-0.5 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground text-[13px]">
                Enterprise Integration Security
              </p>
              <p className="text-[12px] leading-[1.6]">
                All third-party data synchronizations are encrypted end-to-end
                via TLS 1.3. API credentials and OAuth tokens are strictly
                isolated per tenant workspace and never exposed in client
                bundles.
              </p>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
