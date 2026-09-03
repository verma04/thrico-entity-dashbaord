"use client";

import React, { useState, useMemo } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import {
  ShopifyIntegrationCard,
  WooCommerceIntegrationCard,
  HRIntegrationCard,
  CRMIntegrationCard,
  SlackIntegrationCard,
  ZoomIntegrationCard,
  GoogleMeetIntegrationCard,
  SendGridIntegrationCard,
  DeveloperApiCard,
  FedenaIntegrationCard,
  EntabCampusCareIntegrationCard,
  MyClassCampusIntegrationCard,
  MasterSoftERPIntegrationCard,
  WhatsAppIntegrationCard,
} from "@/components/settings/integrations";
import {
  HR_PROVIDERS_CONFIG,
  HRProvider,
  useGetHRProviders,
  useGetHRConnections,
  CRM_PROVIDERS_CONFIG,
  CRMProvider,
  useGetCRMProviders,
  useGetCRMConnections,
  useGetShopifyConnection,
  useGetWooCommerceConnection,
  useGetWhatsAppConnections,
} from "@/graphql/actions";
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
  Contact2,
  CheckCircle2,
  MessageSquare,
  Terminal,
  Activity,
  Plus,
  GraduationCap,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface IntegrationItem {
  id: string;
  name: string;
  category: "ecommerce" | "crm" | "hr" | "erp" | "communication" | "developer";
  categoryLabel: string;
  description: string;
  isConnected: boolean;
  component: React.ReactNode;
}

export default function IntegrationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("connected");

  // Fetch connection statuses across all integration categories
  const { data: shopifyData } = useGetShopifyConnection();
  const isShopifyConnected = !!shopifyData?.shopifyConnection?.id;

  const { data: wooCommerceData } = useGetWooCommerceConnection();
  const isWooCommerceConnected = !!wooCommerceData?.wooCommerceConnection?.id;

  const { data: whatsAppData } = useGetWhatsAppConnections();
  const isWhatsAppConnected =
    !!whatsAppData?.getWhatsAppConnections?.[0]?.id &&
    whatsAppData?.getWhatsAppConnections?.[0]?.status === "CONNECTED";

  const { data: hrProvidersData } = useGetHRProviders();
  const { data: hrConnectionsData } = useGetHRConnections();
  const hrProviders = hrProvidersData?.getHRProviders || [];
  const hrConnections = hrConnectionsData?.getHRConnections || [];

  const { data: crmProvidersData } = useGetCRMProviders();
  const { data: crmConnectionsData } = useGetCRMConnections();
  const crmProviders =
    crmProvidersData?.getCRMProviders &&
    crmProvidersData.getCRMProviders.length > 0
      ? crmProvidersData.getCRMProviders
      : Object.values(CRMProvider).map((p) => ({ provider: p }));
  const crmConnections = crmConnectionsData?.getCRMConnections || [];

  // Build full integrations registry with live connected state
  const integrations: IntegrationItem[] = useMemo(() => {
    return [
      {
        id: "shopify",
        name: "Shopify",
        category: "ecommerce",
        categoryLabel: "E-Commerce",
        description:
          "Sync products, customers, and checkout orders from your online store directly with Thrico in real-time.",
        isConnected: isShopifyConnected,
        component: <ShopifyIntegrationCard />,
      },
      {
        id: "woocommerce",
        name: "WooCommerce",
        category: "ecommerce",
        categoryLabel: "E-Commerce",
        description:
          "Sync products, customers, and checkout orders from your WordPress WooCommerce store directly with Thrico.",
        isConnected: isWooCommerceConnected,
        component: <WooCommerceIntegrationCard />,
      },
      ...(crmProviders
        .map((meta: any) => {
          const config = CRM_PROVIDERS_CONFIG[meta.provider as CRMProvider];
          if (!config) return null;
          const isConn = crmConnections.some(
            (c: any) =>
              c.provider === meta.provider && c.status === "CONNECTED",
          );
          return {
            id: `crm-${meta.provider.toLowerCase()}`,
            name: meta.name || config.name,
            category: "crm" as const,
            categoryLabel: "CRM & Pipeline",
            description: config.description,
            isConnected: isConn,
            component: <CRMIntegrationCard providerKey={config.provider} />,
          };
        })
        .filter(Boolean) as IntegrationItem[]),
      ...(hrProviders
        .map((meta: any) => {
          const config = HR_PROVIDERS_CONFIG[meta.provider as HRProvider];
          if (!config) return null;
          const isConn = hrConnections.some(
            (c: any) =>
              c.provider === meta.provider && c.status === "CONNECTED",
          );
          return {
            id: `hr-${meta.provider.toLowerCase()}`,
            name: meta.name || config.name,
            category: "hr" as const,
            categoryLabel: "HR & Directory",
            description: config.description,
            isConnected: isConn,
            component: <HRIntegrationCard providerKey={config.provider} />,
          };
        })
        .filter(Boolean) as IntegrationItem[]),
      {
        id: "fedena",
        name: "Fedena ERP",
        category: "erp",
        categoryLabel: "ERP & Campus",
        description:
          "Synchronize students, faculty batches, attendance records, and academic course structures from Fedena School & College ERP.",
        isConnected: false,
        component: <FedenaIntegrationCard />,
      },
      {
        id: "campuscare",
        name: "Entab CampusCare",
        category: "erp",
        categoryLabel: "ERP & Campus",
        description:
          "Connect Entab CampusCare to seamlessly import student master directory, parent contacts, classes, and academic rosters.",
        isConnected: false,
        component: <EntabCampusCareIntegrationCard />,
      },
      {
        id: "myclasscampus",
        name: "MyClassCampus",
        category: "erp",
        categoryLabel: "ERP & Campus",
        description:
          "Automate student profile syncing, department structures, faculty directories, and institute notifications with MyClassCampus.",
        isConnected: false,
        component: <MyClassCampusIntegrationCard />,
      },
      {
        id: "mastersoft",
        name: "MasterSoft ERP",
        category: "erp",
        categoryLabel: "ERP & Campus",
        description:
          "Integrate MasterSoft Centralized Campus Management System (CCMS) for university-level student, faculty, and academic record synchronization.",
        isConnected: false,
        component: <MasterSoftERPIntegrationCard />,
      },
      {
        id: "slack",
        name: "Slack",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Broadcast announcements, notify community channels, and sync discussions directly with your Slack workspace.",
        isConnected: false,
        component: <SlackIntegrationCard />,
      },
      {
        id: "zoom",
        name: "Zoom",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Create and manage virtual meeting rooms, auto-sync event registrations, and track attendee engagement seamlessly.",
        isConnected: false,
        component: <ZoomIntegrationCard />,
      },
      {
        id: "google-meet",
        name: "Google Meet",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Schedule secure Google Meet sessions for community calls, webinars, and 1-on-1 member mentoring.",
        isConnected: false,
        component: <GoogleMeetIntegrationCard />,
      },
      {
        id: "sendgrid",
        name: "SendGrid",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Deliver transactional emails, newsletter digests, and marketing automation with high deliverability via Twilio SendGrid.",
        isConnected: false,
        component: <SendGridIntegrationCard />,
      },
      {
        id: "whatsapp",
        name: "WhatsApp Business",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Send template messages, sync Meta-approved templates, track delivery rates, and automate WhatsApp Business notifications.",
        isConnected: isWhatsAppConnected,
        component: <WhatsAppIntegrationCard />,
      },
      {
        id: "developer-api",
        name: "MCP & Webhooks",
        category: "developer",
        categoryLabel: "Developer Tools",
        description:
          "Connect AI agents via Model Context Protocol or configure secure event triggers and webhooks.",
        isConnected: true,
        component: <DeveloperApiCard />,
      },
    ];
  }, [
    isShopifyConnected,
    isWooCommerceConnected,
    isWhatsAppConnected,
    hrProviders,
    hrConnections,
    crmProviders,
    crmConnections,
  ]);

  const connectedCount = useMemo(
    () => integrations.filter((i) => i.isConnected).length,
    [integrations],
  );

  // Categories list without "All" - starts with Connected, then all specific categories
  const categories = [
    {
      id: "connected",
      label: "Connected",
      icon: CheckCircle2,
      count: connectedCount,
      highlight: true,
    },
    {
      id: "erp",
      label: "ERP & Campus",
      icon: GraduationCap,
      count: integrations.filter((i) => i.category === "erp").length,
    },
    {
      id: "ecommerce",
      label: "E-Commerce",
      icon: ShoppingBag,
      count: integrations.filter((i) => i.category === "ecommerce").length,
    },
    {
      id: "crm",
      label: "CRM & Pipeline",
      icon: Contact2,
      count: integrations.filter((i) => i.category === "crm").length,
    },
    {
      id: "hr",
      label: "HR & Directory",
      icon: Briefcase,
      count: integrations.filter((i) => i.category === "hr").length,
    },
    {
      id: "communication",
      label: "Communication",
      icon: MessageSquare,
      count: integrations.filter((i) => i.category === "communication").length,
    },
    {
      id: "developer",
      label: "Developer Tools",
      icon: Terminal,
      count: integrations.filter((i) => i.category === "developer").length,
    },
  ];

  // Filtered lists based on search & active category
  const filteredIntegrations = useMemo(() => {
    return integrations
      .filter((integration) => {
        const matchesCategory =
          selectedCategory === "connected"
            ? integration.isConnected
            : integration.category === selectedCategory;

        const matchesSearch =
          integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          integration.categoryLabel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          integration.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        // In category views, sort connected ones first
        if (a.isConnected && !b.isConnected) return -1;
        if (!a.isConnected && b.isConnected) return 1;
        return 0;
      });
  }, [integrations, selectedCategory, searchQuery]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="App Integrations"
        description="Connect third-party platforms, configure event webhooks, and automate bidirectional data synchronization."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Integrations" },
        ]}
        icon={Blocks}
        badgeText="Ecosystem & APIs"
        showLiveIndicator={connectedCount > 0}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-6 space-y-6">
          {/* Stat Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Active Connections",
                value: connectedCount,
                sub: connectedCount > 0 ? "Real-time Sync" : "Ready to Connect",
                icon: Activity,
                iconClass:
                  connectedCount > 0
                    ? "text-emerald-500"
                    : "text-muted-foreground",
                subClass:
                  connectedCount > 0
                    ? "text-emerald-600 dark:text-emerald-400 font-semibold"
                    : "text-muted-foreground",
                hasLivePulse: connectedCount > 0,
              },
              {
                label: "Available Platforms",
                value: integrations.length,
                sub: "Supported Services",
                icon: Blocks,
                iconClass: "text-indigo-500",
              },
              {
                label: "Sync Engine",
                value: "Auto-Sync",
                sub: "Real-time Webhooks",
                icon: Zap,
                iconClass: "text-amber-500",
                subClass: "text-amber-600 dark:text-amber-400",
              },
              {
                label: "Tenant Security",
                value: "Encrypted",
                sub: "AES-256 & TLS 1.3",
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
                      "h-3.5 w-3.5 opacity-75 transition-transform duration-300 group-hover:scale-110",
                      stat.iconClass,
                    )}
                  />
                </div>
                <div className="flex items-baseline gap-2">
                  <div className="flex items-center gap-1.5">
                    {stat.hasLivePulse && (
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                    )}
                    <span className="text-xl font-bold text-foreground tracking-tight">
                      {stat.value}
                    </span>
                  </div>
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

          {/* Filters & Search Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
            {/* Category Navigation Pills (Active, then all categories) */}
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
                      cat.highlight &&
                        !isSelected &&
                        cat.count > 0 &&
                        "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10",
                    )}
                  >
                    <CatIcon
                      className={cn(
                        "h-3.5 w-3.5 opacity-70",
                        cat.highlight &&
                          cat.count > 0 &&
                          !isSelected &&
                          "text-emerald-500 opacity-100",
                      )}
                    />
                    <span>{cat.label}</span>
                    <span
                      className={cn(
                        "text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md ml-0.5",
                        isSelected
                          ? "bg-background/20 text-background"
                          : cat.highlight && cat.count > 0
                            ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold"
                            : "bg-muted text-muted-foreground",
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
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 transition-colors duration-150 cursor-pointer"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="space-y-4">
            {/* Header info for connected category */}
            {selectedCategory === "connected" &&
              filteredIntegrations.length > 0 && (
                <div className="flex items-center justify-between pb-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <p className="text-[13px] font-semibold text-foreground">
                      Active & Connected Platforms (
                      {filteredIntegrations.length})
                    </p>
                  </div>
                  <p className="text-[11.5px] text-muted-foreground hidden sm:block">
                    Live data sync & background webhooks active
                  </p>
                </div>
              )}

            {/* Integrations Grid with Uniform/Balanced layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
              {filteredIntegrations.map((integration) => (
                <div key={integration.id} className="h-full">
                  {integration.component}
                </div>
              ))}
            </div>
          </div>

          {/* Empty State for Connected Tab when no connections exist yet */}
          {selectedCategory === "connected" &&
            filteredIntegrations.length === 0 &&
            !searchQuery && (
              <div className="p-12 flex flex-col items-center text-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30">
                <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
                  <Activity className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p className="text-[14px] font-semibold text-foreground">
                  No Connected Integrations
                </p>
                <p className="text-[13px] text-muted-foreground mt-1.5 max-w-md leading-relaxed">
                  Connect your E-Commerce stores, CRM pipelines, or HR
                  directories from the categories above to enable real-time
                  synchronization.
                </p>
                <div className="flex items-center gap-2 mt-5 flex-wrap justify-center">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[12px] rounded-lg gap-1.5 cursor-pointer"
                    onClick={() => setSelectedCategory("erp")}
                  >
                    <GraduationCap className="h-3.5 w-3.5" />
                    Browse ERP & Campus
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[12px] rounded-lg gap-1.5 cursor-pointer"
                    onClick={() => setSelectedCategory("ecommerce")}
                  >
                    <ShoppingBag className="h-3.5 w-3.5" />
                    Browse E-Commerce
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[12px] rounded-lg gap-1.5 cursor-pointer"
                    onClick={() => setSelectedCategory("crm")}
                  >
                    <Contact2 className="h-3.5 w-3.5" />
                    Browse CRM
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[12px] rounded-lg gap-1.5 cursor-pointer"
                    onClick={() => setSelectedCategory("hr")}
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Browse HR
                  </Button>
                </div>
              </div>
            )}

          {/* Empty State for Searches with 0 results */}
          {filteredIntegrations.length === 0 &&
            (searchQuery || selectedCategory !== "connected") && (
              <div className="p-14 flex flex-col items-center text-center justify-center rounded-2xl border border-dashed border-border/60 bg-card/30">
                <div className="h-12 w-12 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
                  <Inbox className="h-5 w-5 text-muted-foreground/50" />
                </div>
                <p className="text-[14px] font-semibold text-foreground">
                  No matching integrations
                </p>
                <p className="text-[13px] text-muted-foreground mt-1.5 max-w-sm leading-relaxed">
                  {searchQuery
                    ? `We couldn't find any tools matching "${searchQuery}". Try a different search term or clear your filters.`
                    : "No integrations found in this category."}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-5 h-8 text-[12px] rounded-lg gap-1.5 cursor-pointer"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("connected");
                  }}
                >
                  Reset Search
                  <ArrowRight className="h-3 w-3 opacity-50" />
                </Button>
              </div>
            )}

          {/* Footer Security Note */}
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border/40 text-xs">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="space-y-0.5 text-muted-foreground leading-relaxed">
              <p className="font-semibold text-foreground text-[13px]">
                Enterprise Multi-Tenant Integration Security
              </p>
              <p className="text-[12px] leading-[1.6]">
                All third-party data synchronizations are encrypted end-to-end
                via TLS 1.3. API credentials and OAuth tokens are strictly
                isolated per tenant workspace with AES-256-GCM encryption and
                never exposed in client bundles.
              </p>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
