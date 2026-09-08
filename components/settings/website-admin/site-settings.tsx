"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  useWebsiteBuilderStore,
  FontType,
  ThemeType,
} from "@/store/useWebsiteBuilderStore";
import { Button } from "@/components/ui/button";
import {
  Map,
  Share2,
  FileCode,
  Settings as SettingsIcon,
  Globe,
  Upload,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  useGetWebsite,
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useUpdateWebsiteFont,
  useUpdateWebsiteTheme,
  useUpdateSiteSettings,
} from "@/graphql/actions/website";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { IntegrationsForm, IntegrationsFormValues } from "./integrations";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
  EcosystemActionBar,
} from "@/components/layout/ecosystem";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  SitemapTab,
  ThemeIdentityTab,
  SocialTab,
  SettingsTab,
} from "./site-settings-tabs";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SiteSettings = () => {
  const {
    siteSettings,
    updateSiteSettings,
    font,
    setFont,
    theme,
    setTheme,
  } = useWebsiteBuilderStore();

  const [activeTab, setActiveTab] = useState<SettingsTab>("sitemap");
  const [search, setSearch] = useState("");
  const [sitemapFilter, setSitemapFilter] = useState<"ALL" | "INDEXED" | "EXCLUDED">("ALL");
  const [pageNumber, setPageNumber] = useState(1);

  const [hasChanged, setHasChanged] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    serial: true,
    name: true,
    slug: true,
    indexing: true,
    sitemapToggle: true,
    seoTitle: true,
  });

  const toggleColumn = (key: string) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleIntegrationsChange = useCallback(
    (values: IntegrationsFormValues) => {
      updateSiteSettings({
        googleAnalyticsId: values.googleAnalyticsId,
        googleSearchConsoleId: values.googleSearchConsoleId,
        robotsTxt: values.robotsTxt,
      });
      setHasChanged(true);
    },
    [updateSiteSettings]
  );

  const integrationsInitialValues = useMemo(
    () => ({
      googleAnalyticsId: siteSettings?.googleAnalyticsId || "",
      googleSearchConsoleId: siteSettings?.googleSearchConsoleId || "",
      robotsTxt: siteSettings?.robotsTxt || "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab === "parameters"]
  );

  const { data: websiteData } = useGetWebsite({});
  const websiteId = websiteData?.getWebsite?.id;

  const { data: seoData, refetch: refetchSeo, loading: loadingSeo } = useGetAllPagesSeo(
    websiteId || "",
    {
      skip: !websiteId,
    },
  );

  const [updatePageSeoMutation] = useUpdatePageSeo({
    onCompleted: () => {
      refetchSeo();
      toast.success("Sitemap preference updated");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update sitemap");
    },
  });

  const [updateWebsiteFontMutation] = useUpdateWebsiteFont({
    onCompleted: () => {
      toast.success("Font updated globally");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update font");
    },
  });

  const [updateWebsiteThemeMutation] = useUpdateWebsiteTheme({
    onCompleted: () => {
      toast.success("Theme archetype updated globally");
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update theme");
    },
  });

  const { isPremium } = useIsPremium();

  const handleFontChange = (fontId: FontType) => {
    setFont(fontId);
    setHasChanged(true);
    if (websiteId) {
      updateWebsiteFontMutation({
        variables: {
          websiteId,
          font: fontId,
        },
      });
    }
  };

  const handleThemeChange = (themeId: ThemeType) => {
    setTheme(themeId);
    setHasChanged(true);
    if (websiteId) {
      updateWebsiteThemeMutation({
        variables: {
          websiteId,
          theme: themeId,
        },
      });
    }
  };

  const handleTogglePageSitemap = (pageId: string, currentVal: boolean) => {
    updatePageSeoMutation({
      variables: {
        pageId,
        includeInSitemap: !currentVal,
      },
    });
  };

  const handleUpdateSocial = (platformKey: string, value: string) => {
    updateSiteSettings({
      socialLinks: {
        ...siteSettings.socialLinks,
        [platformKey]: value,
      },
    });
    setHasChanged(true);
  };

  const pages: any[] = useMemo(() => {
    return seoData?.getAllPagesSeo || websiteData?.getWebsite?.pages || [];
  }, [seoData, websiteData]);

  const indexedCount = pages.filter((p: any) => (p.seo?.includeInSitemap ?? true)).length;

  const [updateSiteSettingsMutation, { loading: isSavingMutation }] =
    useUpdateSiteSettings({
      onCompleted: () => {
        setIsSaving(false);
        setHasChanged(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        toast.success("Settings Saved", {
          description: "Your site configuration has been updated successfully.",
        });
      },
      onError: (err) => {
        setIsSaving(false);
        toast.error(err.message || "Failed to save website settings");
      },
    });

  const handleSaveSettings = async () => {
    if (!websiteId) {
      toast.error("Website ID not found");
      return;
    }
    setIsSaving(true);
    updateSiteSettingsMutation({
      variables: {
        websiteId,
        siteSettings: {
          googleAnalyticsId: siteSettings.googleAnalyticsId || null,
          googleSearchConsoleId: siteSettings.googleSearchConsoleId || null,
          robotsTxt: siteSettings.robotsTxt || null,
          socialLinks: siteSettings.socialLinks || null,
        },
      },
    });
  };

  const handleResetSettings = () => {
    setHasChanged(false);
    toast.info("Changes discarded");
  };

  return (
    <EcosystemWrapper className="min-h-screen pb-32">
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Website Settings"
        description="Global sitemap routing, design archetypes, integrations, and external bridges."
        badgeText="Core Settings"
        icon={SettingsIcon}
        breadcrumbs={[
          { label: "Website", href: "/app-layout" },
          { label: "Site Configuration" },
        ]}
      />

      {/* ── Action Bar / Controls ─────────────────────────────────────────── */}
      <EcosystemActionBar>
        {/* Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.Search
              value={search}
              onChange={setSearch}
              placeholder="Search settings & pages…"
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Separator />

        {/* Primary Tab Navigation */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <EcosystemActionBar.ViewToggle
              value={activeTab}
              onChange={(v) => {
                setActiveTab(v as SettingsTab);
                setPageNumber(1);
              }}
              options={[
                { id: "sitemap", label: "Sitemap", icon: Map },
                { id: "identity", label: "Theme & Identity", icon: Palette },
                { id: "parameters", label: "Integrations", icon: FileCode },
                { id: "social", label: "Social", icon: Share2 },
              ]}
            />
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        {/* Tab-Specific Filters & Controls */}
        {activeTab === "sitemap" && (
          <>
            <EcosystemActionBar.Separator />
            <EcosystemActionBar.Group>
              <EcosystemActionBar.Item>
                <EcosystemActionBar.Select
                  value={sitemapFilter}
                  onValueChange={(v: string) => {
                    setSitemapFilter(v as any);
                    setPageNumber(1);
                  }}
                  options={[
                    { value: "ALL", label: "All Pages" },
                    { value: "INDEXED", label: "Indexed Only" },
                    { value: "EXCLUDED", label: "Excluded Only" },
                  ]}
                  placeholder="Status"
                />
              </EcosystemActionBar.Item>
            </EcosystemActionBar.Group>
          </>
        )}

        {/* Right Action Utilities */}
        <EcosystemActionBar.Group className="ml-auto flex items-center gap-2">
          {activeTab === "sitemap" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 bg-card border-border shadow-md">
                <DropdownMenuLabel className="text-xs font-semibold">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  { key: "serial", header: "Serial #" },
                  { key: "name", header: "Page Title" },
                  { key: "indexing", header: "Indexing Status" },
                  { key: "sitemapToggle", header: "Include in Sitemap" },
                  { key: "seoTitle", header: "Meta Title" },
                ].map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.key}
                    checked={visibleColumns[col.key] !== false}
                    onCheckedChange={() => toggleColumn(col.key)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {col.header}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <Button
            variant="outline"
            onClick={() => setShowExportModal(true)}
            className="h-8 gap-1.5 shrink-0 bg-card border-border shadow-2xs text-xs font-medium text-foreground px-2.5"
          >
            <Upload className="h-3.5 w-3.5" />
            Export
          </Button>

          <EcosystemActionBar.Separator />

          <EcosystemActionBar.Status active={true}>
            {pages.length} Pages • {indexedCount} Indexed • Theme: {theme || "academia"}
          </EcosystemActionBar.Status>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      {/* ── Content Area ─────────────────────────────────────────────────── */}
      <EcosystemContainer className="p-0 m-3 mt-0 border-none bg-transparent shadow-none ring-0 space-y-4">
        {/* Tab 1: Sitemap */}
        {activeTab === "sitemap" && (
          <SitemapTab
            isPremium={isPremium}
            pages={pages}
            loadingSeo={loadingSeo}
            search={search}
            sitemapFilter={sitemapFilter}
            pageNumber={pageNumber}
            onPageChange={setPageNumber}
            visibleColumns={visibleColumns}
            onTogglePageSitemap={handleTogglePageSitemap}
          />
        )}

        {/* Tab 2: Theme & Identity */}
        {activeTab === "identity" && (
          <ThemeIdentityTab
            isPremium={isPremium}
            theme={theme || "academia"}
            font={font || "inter"}
            onThemeChange={handleThemeChange}
            onFontChange={handleFontChange}
          />
        )}

        {/* Tab 3: Integrations & Analytics */}
        {activeTab === "parameters" && (
          <div className="space-y-6">
            <IntegrationsForm
              initialValues={integrationsInitialValues}
              onChange={handleIntegrationsChange}
              websiteUrl={
                websiteData?.getWebsite?.customDomain
                  ? `https://${websiteData.getWebsite.customDomain}`
                  : "https://thrico.community"
              }
            />
          </div>
        )}

        {/* Tab 4: Social Bridges */}
        {activeTab === "social" && (
          <SocialTab
            isPremium={isPremium}
            siteSettings={siteSettings}
            onUpdateSocial={handleUpdateSocial}
          />
        )}
      </EcosystemContainer>

      {/* ── Floating Save Panel ───────────────────────────────────────────── */}
      <FloatingSavePanel
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        isSaving={isSaving || isSavingMutation}
        hasChanged={hasChanged}
        saved={saved}
        title="Pending Changes"
        description="You have modified website configuration parameters."
      />

      {/* ── Export CSV Modal ──────────────────────────────────────────────── */}
      <ExportCsvModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        entityName="website sitemap pages"
        description="Export website pages, sitemap indexing status, and SEO metadata as CSV."
        totalCount={pages.length}
        onExport={(_scope: ExportCsvScope, format: ExportCsvFormat) => {
          if (pages.length === 0) {
            toast.error("Nothing to export", { description: "No website pages found." });
            return;
          }
          const csv = buildCsv(pages, [
            { header: "Page Name", getValue: (p: any) => p.name || "" },
            { header: "Slug", getValue: (p: any) => (p.slug ? `/${p.slug}` : "") },
            {
              header: "Include in Sitemap",
              getValue: (p: any) =>
                (p.seo?.includeInSitemap ?? true) ? "Yes" : "No",
            },
            { header: "Meta Title", getValue: (p: any) => p.seo?.title || "" },
            { header: "Meta Description", getValue: (p: any) => p.seo?.description || "" },
            {
              header: "Keywords",
              getValue: (p: any) =>
                Array.isArray(p.seo?.keywords)
                  ? p.seo.keywords.join(", ")
                  : p.seo?.keywords || "",
            },
          ]);
          downloadCsv(
            csv,
            `website-sitemap-${new Date().toISOString().slice(0, 10)}`,
            format
          );
          toast.success("Export ready", {
            description: `${pages.length} sitemap entries exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
};

export default SiteSettings;
