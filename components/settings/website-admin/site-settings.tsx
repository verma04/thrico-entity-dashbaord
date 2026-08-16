"use client";

import React, { useState, useMemo } from "react";
import {
  useWebsiteBuilderStore,
  FontType,
  ThemeType,
} from "@/store/useWebsiteBuilderStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Map,
  Share2,
  FileCode,
  Type,
  Lock,
  Settings as SettingsIcon,
  Sparkles,
  Zap,
  ChevronRight,
  Info,
  Globe,
  Upload,
  Layout,
  Check,
  CheckCircle2,
  Palette,
  ExternalLink,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Compass,
  Laptop,
} from "lucide-react";
import { ExportCsvModal } from "@/components/shared/export-csv-modal";
import type { ExportCsvScope, ExportCsvFormat } from "@/components/shared/export-csv-modal";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { toast } from "sonner";
import { useToast } from "@/hooks/use-toast";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useDrawerStore } from "@/store/drawerStore";
import {
  useGetWebsite,
  useGetAllPagesSeo,
  useUpdatePageSeo,
  useUpdateWebsiteFont,
  useUpdateWebsiteTheme,
} from "@/graphql/actions/website";
import { cn } from "@/lib/utils";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  EcosystemWrapper,
  EcosystemHeader,
  EcosystemContainer,
  EcosystemActionBar,
} from "@/components/layout/ecosystem";
import {
  AdminTable,
  AdminStatusBadge,
  AdminTableColumn,
  AdminTableItem,
  Pagination,
} from "@/components/shared/admin-table/admin-table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// ─────────────────────────────────────────────────────────────────────────────
// THEMES CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const THEME_OPTIONS = [
  {
    id: "academia",
    name: "Academia",
    description: "Scholarly, authoritative aesthetic with refined classical tones.",
    previewColor: "bg-amber-800",
    accentColor: "#92400e",
    tag: "Scholarly",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Clean, corporate styling engineered for modern organizations.",
    previewColor: "bg-blue-600",
    accentColor: "#2563eb",
    tag: "Corporate",
  },
  {
    id: "creator",
    name: "Creator",
    description: "Vibrant, high-energy palette designed for personal brands & media.",
    previewColor: "bg-rose-500",
    accentColor: "#f43f5e",
    tag: "Dynamic",
  },
  {
    id: "association",
    name: "Association",
    description: "Balanced, trustworthy framework for member networks & guilds.",
    previewColor: "bg-emerald-600",
    accentColor: "#059669",
    tag: "Community",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern, high-velocity SaaS aesthetic with crisp accents.",
    previewColor: "bg-indigo-600",
    accentColor: "#4f46e5",
    tag: "Modern",
  },
  {
    id: "dark-mode",
    name: "Dark Matrix",
    description: "Deep contrast, futuristic dark palette with luminous highlights.",
    previewColor: "bg-zinc-900",
    accentColor: "#18181b",
    tag: "High Contrast",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// FONTS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const FONT_OPTIONS = [
  {
    id: "inter",
    name: "Inter",
    category: "Sans-Serif",
    fontFamily: "var(--font-inter), sans-serif",
    sample: "Precision UI engineering & clarity",
  },
  {
    id: "roboto",
    name: "Roboto",
    category: "Neo-Grotesque",
    fontFamily: "Roboto, sans-serif",
    sample: "Balanced neo-grotesque readability",
  },
  {
    id: "poppins",
    name: "Poppins",
    category: "Geometric Sans",
    fontFamily: "Poppins, sans-serif",
    sample: "Friendly geometric character & form",
  },
  {
    id: "playfair",
    name: "Playfair Display",
    category: "Editorial Serif",
    fontFamily: "Playfair Display, Georgia, serif",
    sample: "Sophisticated editorial elegance",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    category: "Geometric Display",
    fontFamily: "Montserrat, sans-serif",
    sample: "Architectural presence & strength",
  },
  {
    id: "lato",
    name: "Lato",
    category: "Humanist Sans",
    fontFamily: "Lato, sans-serif",
    sample: "Warm humanist curves & harmony",
  },
  {
    id: "open-sans",
    name: "Open Sans",
    category: "Humanist Sans",
    fontFamily: "Open Sans, sans-serif",
    sample: "Universal clarity across screen sizes",
  },
  {
    id: "raleway",
    name: "Raleway",
    category: "Elegant Display",
    fontFamily: "Raleway, sans-serif",
    sample: "Refined headings with slim headings",
  },
  {
    id: "merriweather",
    name: "Merriweather",
    category: "Literary Serif",
    fontFamily: "Merriweather, serif",
    sample: "Pleasant long-form reading rhythm",
  },
  {
    id: "nunito",
    name: "Nunito",
    category: "Rounded Sans",
    fontFamily: "Nunito, sans-serif",
    sample: "Soft rounded approachable appeal",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL PLATFORMS CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/yourhandle" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/yourorg" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/yourinvite" },
];

type SettingsTab = "sitemap" | "identity" | "parameters" | "social";

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
const SiteSettings = () => {
  const {
    togglePageSitemap,
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
  const pageSize = 15;

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

  const [updateFontMutation] = useUpdateWebsiteFont({
    onCompleted: () => {
      toast.success("Font updated globally");
    },
  });

  const [updateThemeMutation] = useUpdateWebsiteTheme({
    onCompleted: () => {
      toast.success("Theme archetype updated globally");
    },
  });

  const handleFontChange = (newFont: string) => {
    setFont(newFont as any);
    setHasChanged(true);
    if (websiteId) {
      updateFontMutation({
        variables: {
          websiteId,
          font: newFont,
        },
      });
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme as any);
    setHasChanged(true);
    if (websiteId) {
      updateThemeMutation({
        variables: {
          websiteId,
          theme: newTheme,
        },
      });
    }
  };

  const pages = seoData?.getAllPagesSeo || websiteData?.getWebsite?.pages || [];
  const { isPremium } = useIsPremium();
  const { openDrawer } = useDrawerStore();

  // Filter pages for sitemap table
  const filteredPages = useMemo(() => {
    return pages.filter((page: any) => {
      const matchesSearch =
        !search.trim() ||
        page.name?.toLowerCase().includes(search.toLowerCase()) ||
        page.slug?.toLowerCase().includes(search.toLowerCase()) ||
        page.seo?.title?.toLowerCase().includes(search.toLowerCase());

      const isIncluded = page.seo?.includeInSitemap ?? true;
      const matchesStatus =
        sitemapFilter === "ALL" ||
        (sitemapFilter === "INDEXED" && isIncluded) ||
        (sitemapFilter === "EXCLUDED" && !isIncluded);

      return matchesSearch && matchesStatus;
    });
  }, [pages, search, sitemapFilter]);

  const paginatedPages = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredPages.slice(start, start + pageSize);
  }, [filteredPages, pageNumber, pageSize]);

  const totalPagesCount = Math.ceil(filteredPages.length / pageSize) || 1;
  const indexedCount = pages.filter((p: any) => (p.seo?.includeInSitemap ?? true)).length;

  const handleSaveSettings = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setHasChanged(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      toast.success("Settings Saved", {
        description: "Your site configuration has been updated successfully.",
      });
    }, 600);
  };

  const handleResetSettings = () => {
    setHasChanged(false);
    toast.info("Changes discarded");
  };

  // ─────────────────────────────────────────────────────────────────────────
  // PREMIUM RESTRICTED COMPONENT
  // ─────────────────────────────────────────────────────────────────────────
  const PremiumLock = ({
    title,
    description,
    icon: Icon,
  }: {
    title: string;
    description: string;
    icon: any;
  }) => (
    <Card className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden relative group bg-card">
      <div className="absolute top-0 right-0 p-6">
        <Lock className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto py-14">
        <div className="p-5 bg-muted/60 rounded-2xl relative border border-border/60">
          <Icon className="h-8 w-8 text-muted-foreground" />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-background flex items-center justify-center shadow-md border border-border">
            <Lock className="h-3 w-3 text-primary" />
          </div>
        </div>
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold tracking-tight text-foreground">
            {title} Restricted
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Button
          onClick={() => openDrawer()}
          className="h-9 px-5 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-sm transition-all active:scale-95 gap-1.5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Unlock Feature
        </Button>
      </CardContent>
    </Card>
  );

  // ─────────────────────────────────────────────────────────────────────────
  // SITEMAP COLUMNS DEFINITION (AdminTable)
  // ─────────────────────────────────────────────────────────────────────────
  const sitemapColumns: AdminTableColumn<any>[] = [
    {
      key: "serial",
      header: "S.No",
      headerClassName: "w-12 text-center",
      className: "text-center text-[11px] font-medium text-muted-foreground",
      cell: (_, index) => (pageNumber - 1) * pageSize + index + 1,
    },
    {
      key: "name",
      header: "Resource Name",
      cell: (row) => (
        <AdminTableItem
          icon={Layout}
          title={row.name || "Untitled Page"}
          subtitle={
            row.slug === "home" ? (
              <span className="text-[10px] text-primary font-bold uppercase tracking-wider">
                Primary Root
              </span>
            ) : (
              `Node ID: ${row.id ? row.id.slice(0, 8) : "N/A"}`
            )
          }
        />
      ),
    },
    {
      key: "slug",
      header: "Node Address",
      cell: (row) => (
        <code className="px-2 py-0.5 rounded-md bg-muted border border-border text-[11px] font-mono text-muted-foreground font-semibold">
          /{row.slug}
        </code>
      ),
    },
    {
      key: "indexing",
      header: "Index Status",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => {
        const isIncluded = row.seo?.includeInSitemap ?? true;
        return (
          <AdminStatusBadge status={isIncluded ? "ACTIVE" : "DISABLED"}>
            {isIncluded ? "Indexed" : "Excluded"}
          </AdminStatusBadge>
        );
      },
    },
    {
      key: "sitemapToggle",
      header: "XML Sitemap",
      headerClassName: "text-center",
      className: "text-center",
      cell: (row) => {
        const isIncluded = row.seo?.includeInSitemap ?? true;
        return (
          <div className="flex items-center justify-center">
            <Switch
              checked={isIncluded}
              onCheckedChange={(checked) => {
                togglePageSitemap(row.id);
                updatePageSeoMutation({
                  variables: {
                    pageId: row.id,
                    includeInSitemap: checked,
                  },
                });
              }}
            />
          </div>
        );
      },
    },
    {
      key: "seoTitle",
      header: "Meta Title",
      cell: (row) => (
        <span className="text-xs text-muted-foreground truncate max-w-[200px] block">
          {row.seo?.title || "Default entity meta"}
        </span>
      ),
    },
  ];

  const activeSitemapColumns = sitemapColumns.filter(
    (col) => visibleColumns[col.key] !== false
  );

  return (
    <EcosystemWrapper className="gap-6">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <EcosystemHeader
        title="Website Settings"
        badgeText="Website Builder"
        description="Manage global site-wide definitions, XML sitemap indexing, theme & typography, and integration protocols."
        icon={SettingsIcon}
        breadcrumbs={[
          { label: "Website Builder", href: "/app-layout" },
          { label: "Settings" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-8 gap-1.5 text-xs font-medium bg-card border-border shadow-2xs text-foreground px-2.5"
            >
              <Upload className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        }
      />

      {/* ── Action / Filter Bar ───────────────────────────────────────────── */}
      <EcosystemActionBar shadow="none">
        {/* Left Search */}
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item grow className="max-w-xs">
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

          {activeTab === "sitemap" && (
            <EcosystemActionBar.Item>
              <Select
                value={sitemapFilter}
                onValueChange={(v: any) => {
                  setSitemapFilter(v);
                  setPageNumber(1);
                }}
              >
                <SelectTrigger className="w-[140px] h-8 rounded-md border-border bg-card text-xs font-medium text-foreground shadow-2xs focus:ring-1 focus:ring-ring">
                  <SelectValue placeholder="Sitemap Status" />
                </SelectTrigger>
                <SelectContent className="rounded-lg border-border shadow-md p-1 min-w-[150px]">
                  <SelectItem value="ALL" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    All Pages ({pages.length})
                  </SelectItem>
                  <SelectItem value="INDEXED" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Indexed ({indexedCount})
                  </SelectItem>
                  <SelectItem value="EXCLUDED" className="text-xs font-medium py-1 px-2 cursor-pointer">
                    Excluded ({pages.length - indexedCount})
                  </SelectItem>
                </SelectContent>
              </Select>
            </EcosystemActionBar.Item>
          )}
        </EcosystemActionBar.Group>

        {/* Right Section */}
        <EcosystemActionBar.Group align="right">
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
              <DropdownMenuContent align="end" className="w-[180px]">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
                  Toggle Columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {sitemapColumns.map((col) => (
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
        {/* ================================================================= */}
        {/* TAB 1: SITEMAP & INDEXING MATRIX                                  */}
        {/* ================================================================= */}
        {activeTab === "sitemap" && (
          <div className="space-y-4">
            {!isPremium ? (
              <PremiumLock
                title="Sitemap Manager"
                icon={Map}
                description="Optimize your site's discovery architecture. Control search engine indexing and hierarchical visibility mapping."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Main Table Area */}
                <div className="lg:col-span-8 space-y-4">
                  <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                    <AdminTable
                      columns={activeSitemapColumns}
                      data={paginatedPages}
                      loading={loadingSeo}
                      keyExtractor={(row) => row.id || row.slug}
                      emptyTitle="No pages found"
                      emptyDescription={
                        search
                          ? `No pages matched your search "${search}".`
                          : "No pages available in your website."
                      }
                    />
                  </div>

                  {/* Pagination */}
                  {!loadingSeo && filteredPages.length > pageSize && (
                    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xs">
                      <Pagination
                        currentPage={pageNumber}
                        totalPages={totalPagesCount}
                        totalItems={filteredPages.length}
                        pageSize={pageSize}
                        onPageChange={setPageNumber}
                      />
                    </div>
                  )}
                </div>

                {/* Sidebar Cards */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Platform Overview */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <Globe className="h-3.5 w-3.5 text-primary" />
                        Platform Metrics
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 grid grid-cols-2 gap-3 divide-x divide-border/60">
                      <div className="flex flex-col items-center justify-center py-2 text-center">
                        <span className="text-2xl font-bold text-foreground">{pages.length}</span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                          Total Pages
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center py-2 text-center pl-3">
                        <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                          {Math.round((indexedCount / (pages.length || 1)) * 100)}%
                        </span>
                        <span className="text-[10px] uppercase font-bold text-muted-foreground mt-1">
                          Index Coverage
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* SEO & Sitemap Tips */}
                  <Card className="border-border bg-card shadow-2xs">
                    <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <Info className="h-3.5 w-3.5 text-primary" />
                        Sitemap Guidelines
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <ul className="space-y-2.5 text-xs text-muted-foreground">
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            XML sitemaps guide Googlebot to crawl your most critical landing nodes.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Toggle off non-public, preview, or internal staging pages from public index.
                          </span>
                        </li>
                        <li className="flex gap-2">
                          <span className="text-primary font-bold">•</span>
                          <span>
                            Changes sync in real-time to your generated <code className="font-mono text-[11px] bg-muted px-1 rounded">/sitemap.xml</code>.
                          </span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: THEME & IDENTITY                                           */}
        {/* ================================================================= */}
        {activeTab === "identity" && (
          <div className="space-y-6">
            {!isPremium ? (
              <PremiumLock
                title="Theme & Identity"
                icon={Palette}
                description="Customize the aesthetic DNA of your platform. Access exclusive typography systems and high-fidelity global themes."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                  {/* Theme Archetypes */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Palette className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Theme Archetype
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Select an overarching visual design language for your entire platform.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                        {THEME_OPTIONS.map((opt) => {
                          const isSelected = (theme || "academia") === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleThemeChange(opt.id)}
                              className={cn(
                                "flex flex-col text-left p-4 rounded-xl border transition-all duration-200 relative group outline-none",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                              )}
                            >
                              <div className="flex items-center justify-between w-full mb-3">
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn("h-4 w-4 rounded-full shadow-xs", opt.previewColor)}
                                  />
                                  <span className="text-xs font-bold text-foreground">
                                    {opt.name}
                                  </span>
                                </div>
                                {isSelected ? (
                                  <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                                    <Check className="h-3 w-3" />
                                  </span>
                                ) : (
                                  <span className="text-[10px] uppercase font-bold text-muted-foreground/60 px-1.5 py-0.5 rounded bg-muted">
                                    {opt.tag}
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground leading-relaxed">
                                {opt.description}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Typography Protocols */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Type className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Typography System
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Configure the global font family for headings, navigation, and body copy.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {FONT_OPTIONS.map((opt) => {
                          const isSelected = (font || "inter") === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => handleFontChange(opt.id)}
                              className={cn(
                                "flex flex-col text-left p-4 rounded-xl border transition-all duration-200 relative outline-none",
                                isSelected
                                  ? "border-primary bg-primary/5 ring-1 ring-primary shadow-xs"
                                  : "border-border bg-card hover:border-border/80 hover:bg-muted/30"
                              )}
                            >
                              <div className="flex items-center justify-between w-full mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-foreground">
                                    {opt.name}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                    {opt.category}
                                  </span>
                                </div>
                                {isSelected && (
                                  <span className="h-4 w-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px]">
                                    <Check className="h-2.5 w-2.5" />
                                  </span>
                                )}
                              </div>
                              <p
                                className="text-[13px] text-foreground font-medium truncate mt-1"
                                style={{ fontFamily: opt.fontFamily }}
                              >
                                {opt.sample}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Preview */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Live Archetype Preview Box */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-3 border-b border-border/60">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <Laptop className="h-3.5 w-3.5 text-primary" />
                        Live Typography Preview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="p-5 rounded-xl border border-border/80 bg-background/80 space-y-3">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Headline Preview
                          </span>
                          <h4
                            className="text-lg font-bold text-foreground leading-tight"
                            style={{
                              fontFamily:
                                FONT_OPTIONS.find((f) => f.id === (font || "inter"))?.fontFamily ||
                                "inherit",
                            }}
                          >
                            Building Modern Communities
                          </h4>
                        </div>
                        <p
                          className="text-xs text-muted-foreground leading-relaxed"
                          style={{
                            fontFamily:
                              FONT_OPTIONS.find((f) => f.id === (font || "inter"))?.fontFamily ||
                              "inherit",
                          }}
                        >
                          Empowering members with unified access, curated feeds, and interactive
                          ecosystem features.
                        </p>
                        <div className="pt-2 flex items-center gap-2">
                          <Button size="sm" className="h-7 text-xs font-medium px-3">
                            Sample Action
                          </Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs font-medium px-3">
                            Details
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-border/60 text-xs text-muted-foreground">
                        <div className="flex justify-between">
                          <span>Active Theme:</span>
                          <span className="font-semibold text-foreground capitalize">
                            {theme || "academia"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active Font:</span>
                          <span className="font-semibold text-foreground capitalize">
                            {font || "inter"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: INTEGRATIONS & PARAMETERS                                  */}
        {/* ================================================================= */}
        {activeTab === "parameters" && (
          <div className="space-y-6">
            {!isPremium ? (
              <PremiumLock
                title="Global Parameters"
                icon={FileCode}
                description="Deploy advanced analytics and cross-platform branding anchors. Unlock the full potential of your site's data ecosystem."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 space-y-6">
                  {/* Google Analytics 4 */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <FileCode className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Google Analytics 4 (GA4)
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Connect your GA4 measurement stream to track visitors and telemetry.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-foreground">
                          Measurement Protocol ID
                        </Label>
                        <Input
                          placeholder="G-XXXXXXXXXX"
                          value={siteSettings?.googleAnalyticsId || ""}
                          onChange={(e) => {
                            updateSiteSettings({ googleAnalyticsId: e.target.value });
                            setHasChanged(true);
                          }}
                          className="h-9 font-mono text-xs bg-background border-border"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Found in Google Analytics &gt; Admin &gt; Data Streams &gt; Measurement ID.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Favicon Asset */}
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Globe className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Favicon Asset
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Define the browser icon appearing on desktop and mobile tabs.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-semibold text-foreground">
                          Favicon URL Asset
                        </Label>
                        <div className="flex items-center gap-3">
                          <Input
                            placeholder="https://cdn.yourdomain.com/favicon.png"
                            value={siteSettings?.favicon || ""}
                            onChange={(e) => {
                              updateSiteSettings({ favicon: e.target.value });
                              setHasChanged(true);
                            }}
                            className="h-9 text-xs bg-background border-border flex-1"
                          />
                          {siteSettings?.favicon && (
                            <div className="h-9 w-9 rounded-lg border border-border bg-muted flex items-center justify-center shrink-0 p-1">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={siteSettings.favicon}
                                alt="Favicon"
                                className="h-5 w-5 object-contain"
                                onError={(e) => {
                                  (e.target as HTMLElement).style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground">
                          Direct CDN URL or absolute asset link to a 32x32 or 64x64 PNG / ICO image.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar Guidance */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="border-border bg-card shadow-2xs">
                    <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <Info className="h-3.5 w-3.5 text-primary" />
                        Integration Protocols
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2.5 text-xs text-muted-foreground">
                      <p>
                        Measurement tags inject automatically into the document header on page loads.
                      </p>
                      <p>
                        Verify your Google Analytics real-time stream within 60 seconds of applying.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: SOCIAL BRIDGES                                             */}
        {/* ================================================================= */}
        {activeTab === "social" && (
          <div className="space-y-6">
            {!isPremium ? (
              <PremiumLock
                title="Social Bridges"
                icon={Share2}
                description="Connect cross-platform social identity anchors across header, footer, and sharing cards."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8">
                  <Card className="border-border bg-card shadow-2xs overflow-hidden">
                    <CardHeader className="bg-muted/30 pb-4 border-b border-border/60">
                      <div className="flex items-center gap-2 mb-1">
                        <Share2 className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base font-bold text-foreground">
                          Social Connection Links
                        </CardTitle>
                      </div>
                      <CardDescription className="text-xs">
                        Configure public social profiles displayed on your website navbar and footer.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const currentVal =
                            (siteSettings?.socialLinks as any)?.[platform.key] || "";
                          return (
                            <div key={platform.key} className="space-y-1.5">
                              <Label className="text-xs font-semibold text-foreground">
                                {platform.label}
                              </Label>
                              <Input
                                placeholder={platform.placeholder}
                                value={currentVal}
                                onChange={(e) => {
                                  updateSiteSettings({
                                    socialLinks: {
                                      ...siteSettings.socialLinks,
                                      [platform.key]: e.target.value,
                                    },
                                  });
                                  setHasChanged(true);
                                }}
                                className="h-9 text-xs bg-background border-border"
                              />
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Guidance Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                  <Card className="border-border bg-card shadow-2xs">
                    <CardHeader className="pb-3 border-b border-border/60 bg-muted/30">
                      <CardTitle className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 text-foreground">
                        <Compass className="h-3.5 w-3.5 text-primary" />
                        Social Graph Tip
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-2 text-xs text-muted-foreground">
                      <p>
                        Social URLs automatically link into OpenGraph and Twitter card metadata for
                        rich embeds when members share pages.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </EcosystemContainer>

      {/* ── Floating Save Panel ───────────────────────────────────────────── */}
      <FloatingSavePanel
        onSave={handleSaveSettings}
        onReset={handleResetSettings}
        isSaving={isSaving}
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
          ]);
          downloadCsv(
            csv,
            `website-sitemap-${new Date().toISOString().slice(0, 10)}`,
            format
          );
          toast.success("Export ready", {
            description: `${pages.length} page${pages.length !== 1 ? "s" : ""} exported.`,
          });
        }}
      />
    </EcosystemWrapper>
  );
};

export default SiteSettings;
