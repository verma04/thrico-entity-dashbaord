"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisCard } from "@/components/ui/platform/polaris-primitives";
import {
  ShopifyIntegrationCard,
  HRIntegrationCard,
  CRMIntegrationCard,
  SendGridIntegrationCard,
  WhatsAppIntegrationCard,
  DeveloperApiCard,
  FedenaIntegrationCard,
  EntabCampusCareIntegrationCard,
  MyClassCampusIntegrationCard,
  MasterSoftERPIntegrationCard,
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
  useGetWhatsAppConnections,
  WhatsAppConnectionStatus,
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
  ExternalLink,
  Lock,
  Check,
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
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Fetch connection statuses across all integration categories
  const { data: shopifyData } = useGetShopifyConnection();
  const isShopifyConnected = !!shopifyData?.shopifyConnection?.id;

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

  const { data: whatsappData } = useGetWhatsAppConnections();
  const isWhatsAppConnected = useMemo(() => {
    return (
      whatsappData?.getWhatsAppConnections?.some(
        (c) => c.status === WhatsAppConnectionStatus.CONNECTED,
      ) ?? false
    );
  }, [whatsappData]);

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
        id: "whatsapp",
        name: "WhatsApp Cloud API",
        category: "communication",
        categoryLabel: "Communication",
        description:
          "Connect your official Meta WhatsApp Business Account for transactional notifications, automated event reminders, and Coexistence mode.",
        isConnected: isWhatsAppConnected,
        component: <WhatsAppIntegrationCard />,
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

  // Categories list starting with All, Connected, then specific categories
  const categories = useMemo(() => {
    return [
      {
        id: "all",
        label: "All Platforms",
        icon: Blocks,
        count: integrations.length,
      },
      {
        id: "connected",
        label: "Connected",
        icon: CheckCircle2,
        count: connectedCount,
        highlight: true,
      },
      {
        id: "communication",
        label: "Communication",
        icon: MessageSquare,
        count: integrations.filter((i) => i.category === "communication").length,
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
        id: "erp",
        label: "ERP & Campus",
        icon: GraduationCap,
        count: integrations.filter((i) => i.category === "erp").length,
      },
      {
        id: "developer",
        label: "Developer Tools",
        icon: Terminal,
        count: integrations.filter((i) => i.category === "developer").length,
      },
    ];
  }, [integrations, connectedCount]);

  // Filtered lists based on search & active category
  const filteredIntegrations = useMemo(() => {
    return integrations
      .filter((integration) => {
        const matchesCategory =
          selectedCategory === "all"
            ? true
            : selectedCategory === "connected"
              ? integration.isConnected
              : integration.category === selectedCategory;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          integration.name.toLowerCase().includes(q) ||
          integration.categoryLabel.toLowerCase().includes(q) ||
          integration.description.toLowerCase().includes(q);

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
    <EcosystemWrapper className="animate-in fade-in duration-500">
      <EcosystemHeader
        title="App Integrations"
        description="Connect official Meta WhatsApp, Shopify, CRMs, ERPs, and cloud messaging services to automate bidirectional data synchronization."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Integrations" },
        ]}
        icon={Blocks}
        badgeText="Ecosystem & APIs"
        showLiveIndicator={connectedCount > 0}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0 mt-3">
        <div className="px-4 sm:px-6 py-2 sm:py-4">
          {/* Polaris 2-Column Responsive Grid matching app design pattern */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* ── Main Content Area (8 Columns) ── */}
            <div className="lg:col-span-8 space-y-4">
              {/* Directory Filter & Search PolarisCard */}
              <PolarisCard
                title="Integration Directory"
                description="Search across available platform connectors or filter by operational channel."
                badge={
                  <Badge
                    variant="outline"
                    className="bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-300 border-[#d2d5d9] dark:border-zinc-700 text-[10.5px] font-medium px-1.5 py-0.5 rounded-[4px]"
                  >
                    {filteredIntegrations.length}{" "}
                    {filteredIntegrations.length === 1
                      ? "service"
                      : "services"}
                  </Badge>
                }
              >
                <div className="space-y-3">
                  {/* Search Input */}
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#8c9196]" />
                    <Input
                      type="search"
                      placeholder="Search platforms by name, category, or workflow…"
                      className="pl-8 pr-7 h-8.5 text-[12.5px] bg-[#f6f6f7] dark:bg-zinc-800/60 border-[#d2d5d9] dark:border-zinc-700 shadow-none focus-visible:ring-1 focus-visible:ring-primary/20 rounded-[6px]"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8c9196] hover:text-[#303030] dark:hover:text-zinc-200 p-0.5 cursor-pointer"
                        title="Clear search"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Pills Navigation */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => {
                      const isSelected = selectedCategory === cat.id;
                      const CatIcon = cat.icon;
                      return (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={cn(
                            "h-7 px-2.5 rounded-[6px] text-[11.5px] font-medium transition-all duration-150 flex items-center gap-1.5 shrink-0 border cursor-pointer select-none",
                            isSelected
                              ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100 shadow-2xs font-semibold"
                              : "bg-white dark:bg-zinc-900 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-800 hover:border-[#aeb4b9] dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/50",
                            cat.highlight &&
                              !isSelected &&
                              cat.count > 0 &&
                              "border-emerald-500/30 text-emerald-700 dark:text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10",
                          )}
                        >
                          <CatIcon
                            className={cn(
                              "h-3 w-3",
                              cat.highlight && cat.count > 0
                                ? "text-emerald-500"
                                : "opacity-70",
                            )}
                          />
                          <span>{cat.label}</span>
                          <span
                            className={cn(
                              "text-[10px] font-semibold tabular-nums px-1 py-0.2 rounded-[3px] ml-0.5",
                              isSelected
                                ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                                : cat.highlight && cat.count > 0
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold"
                                  : "bg-[#f1f2f4] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400",
                            )}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </PolarisCard>

              {/* Connected Active Highlight Bar */}
              {selectedCategory === "connected" &&
                filteredIntegrations.length > 0 && (
                  <div className="flex items-center justify-between px-3.5 py-2.5 rounded-[8px] bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-500/25 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span className="font-semibold text-emerald-800 dark:text-emerald-300 text-[12px]">
                        {filteredIntegrations.length} Active{" "}
                        {filteredIntegrations.length === 1
                          ? "Channel"
                          : "Channels"}{" "}
                        Synchronizing
                      </span>
                    </div>
                    <span className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80 hidden sm:inline font-mono">
                      TLS 1.3 Encrypted Webhooks
                    </span>
                  </div>
                )}

              {/* Integrations Grid in 2 Columns */}
              {filteredIntegrations.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 items-start">
                  {filteredIntegrations.map((integration) => (
                    <div key={integration.id} className="h-full">
                      {integration.component}
                    </div>
                  ))}
                </div>
              )}

              {/* Empty State: Connected Tab with 0 items */}
              {selectedCategory === "connected" &&
                filteredIntegrations.length === 0 &&
                !searchQuery && (
                  <PolarisCard className="text-center py-10 px-6">
                    <div className="flex flex-col items-center max-w-md mx-auto space-y-3">
                      <div className="h-10 w-10 rounded-full bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#8c9196]">
                        <Activity className="h-5 w-5" />
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100">
                        No Active Connections Yet
                      </h4>
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                        Connect your official Meta WhatsApp Business Account,
                        Shopify online store, CRM pipelines, or ERP systems to
                        begin real-time synchronization.
                      </p>
                      <div className="flex items-center gap-2 pt-2 flex-wrap justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7.5 text-[11.5px] rounded-[6px] gap-1.5 border-[#d2d5d9] dark:border-zinc-700"
                          onClick={() => setSelectedCategory("communication")}
                        >
                          <MessageSquare className="h-3.5 w-3.5 text-[#25D366]" />
                          Connect WhatsApp
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7.5 text-[11.5px] rounded-[6px] gap-1.5 border-[#d2d5d9] dark:border-zinc-700"
                          onClick={() => setSelectedCategory("ecommerce")}
                        >
                          <ShoppingBag className="h-3.5 w-3.5 text-[#95BF47]" />
                          Connect Shopify
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7.5 text-[11.5px] rounded-[6px] gap-1.5 border-[#d2d5d9] dark:border-zinc-700"
                          onClick={() => setSelectedCategory("all")}
                        >
                          Browse All Platforms
                        </Button>
                      </div>
                    </div>
                  </PolarisCard>
                )}

              {/* Empty State: Search produced 0 items */}
              {filteredIntegrations.length === 0 &&
                (searchQuery || selectedCategory !== "connected") && (
                  <PolarisCard className="text-center py-10 px-6">
                    <div className="flex flex-col items-center max-w-sm mx-auto space-y-3">
                      <div className="h-10 w-10 rounded-full bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center text-[#8c9196]">
                        <Inbox className="h-5 w-5" />
                      </div>
                      <h4 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100">
                        No Matching Integrations
                      </h4>
                      <p className="text-[12px] text-[#616161] dark:text-zinc-400 leading-relaxed">
                        {searchQuery
                          ? `We couldn't find any tools matching "${searchQuery}". Try a different search keyword or clear filters.`
                          : "No connectors found in this category."}
                      </p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7.5 text-[11.5px] rounded-[6px] gap-1.5 border-[#d2d5d9] dark:border-zinc-700 mt-2"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                        }}
                      >
                        Reset All Filters
                        <ArrowRight className="h-3 w-3 opacity-60" />
                      </Button>
                    </div>
                  </PolarisCard>
                )}
            </div>

            {/* ── Sticky Sidebar (4 Columns) ── */}
            <div className="lg:col-span-4 space-y-4 self-start sticky top-6">
              {/* Card 1: System Health & Sync Engine */}
              <PolarisCard
                title="System Health"
                description="Live connection and background poller status."
                badge={
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] font-semibold px-1.5 py-0.5 rounded-[4px] gap-1",
                      connectedCount > 0
                        ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-500/25"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        connectedCount > 0
                          ? "bg-emerald-500 animate-pulse"
                          : "bg-zinc-400",
                      )}
                    />
                    {connectedCount > 0 ? "LIVE" : "READY"}
                  </Badge>
                }
              >
                <div className="space-y-2.5 text-xs">
                  {/* Summary Rows */}
                  <div className="space-y-2 border-b border-[#e1e3e5] dark:border-zinc-800 pb-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[#616161] dark:text-zinc-400 text-[11.5px]">
                        Active Connections
                      </span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-100 text-[12px]">
                        {connectedCount} of {integrations.length} Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#616161] dark:text-zinc-400 text-[11.5px]">
                        Sync Engine
                      </span>
                      <span className="font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-emerald-500" />
                        Webhooks Active
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#616161] dark:text-zinc-400 text-[11.5px]">
                        Meta Cloud API
                      </span>
                      <span className="font-mono text-[11px] font-medium text-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        v25.0 Coexistence
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-0.5">
                    <div className="flex justify-between text-[11px] text-[#616161] dark:text-zinc-400">
                      <span>Coverage Ratio</span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-200">
                        {Math.round(
                          (connectedCount / (integrations.length || 1)) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-[#f1f2f4] dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.max(
                            8,
                            Math.round(
                              (connectedCount / (integrations.length || 1)) *
                                100,
                            ),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </PolarisCard>

              {/* Card 2: Browse by Category */}
              <PolarisCard
                title="Browse by Category"
                description="Click to quickly filter available services."
              >
                <div className="space-y-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    const CatIcon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={cn(
                          "w-full flex items-center justify-between px-2.5 py-1.5 rounded-[6px] text-[12px] font-medium transition-all text-left cursor-pointer",
                          isSelected
                            ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs font-semibold"
                            : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/60",
                        )}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <CatIcon className="h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{cat.label}</span>
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-semibold px-1.5 py-0.5 rounded-[3px] tabular-nums",
                            isSelected
                              ? "bg-white/20 text-white dark:bg-zinc-900/20 dark:text-zinc-900"
                              : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400",
                          )}
                        >
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </PolarisCard>

              {/* Card 3: Enterprise Security & Compliance */}
              <PolarisCard
                title="Security & Governance"
                description="Enterprise workspace data protection standards."
              >
                <div className="space-y-2.5 text-xs text-[#616161] dark:text-zinc-400">
                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-[5px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-200">
                        AES-256-GCM Vaulting
                      </p>
                      <p className="text-[11px] leading-[15px]">
                        Credentials and OAuth refresh tokens are encrypted at
                        rest with tenant-isolated keys.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-[5px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-200">
                        Meta GDPR Compliant
                      </p>
                      <p className="text-[11px] leading-[15px]">
                        Official Tech Provider with automated data deletion
                        callbacks and HMAC validation.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="h-6 w-6 rounded-[5px] bg-[#f6f6f7] dark:bg-zinc-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-200">
                        TLS 1.3 Transport
                      </p>
                      <p className="text-[11px] leading-[15px]">
                        All inbound event triggers and outbound notifications
                        are encrypted in transit.
                      </p>
                    </div>
                  </div>
                </div>
              </PolarisCard>

              {/* Card 4: Developer Resources */}
              <PolarisCard
                title="Developer Resources"
                description="APIs, webhooks, and documentation."
              >
                <div className="space-y-1">
                  <Link
                    href="/settings/mcp"
                    className="flex items-center justify-between p-2 rounded-[6px] hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[12px] text-[#303030] dark:text-zinc-200 group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-primary" />
                      MCP & Webhook Endpoints
                    </span>
                    <ArrowRight className="h-3 w-3 text-[#8c9196] group-hover:translate-x-0.5 transition-transform" />
                  </Link>

                  <a
                    href="https://developers.facebook.com/docs/whatsapp/cloud-api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-[6px] hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[12px] text-[#303030] dark:text-zinc-200 group transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 text-emerald-500" />
                      Meta Graph API v25.0 Docs
                    </span>
                    <ArrowRight className="h-3 w-3 text-[#8c9196] group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </PolarisCard>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}
