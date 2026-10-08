import React, { useEffect } from "react";
import Image from "next/image";
import {
  LayoutType,
  ModuleType,
  ThemeType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Plus,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Globe,
  Users,
  ShieldCheck,
  Loader2,
  Check,
  Save,
} from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { NavbarSettings } from "./settings/navbar-settings";
import { FooterSettings } from "./settings/footer-settings";
import { LayoutSelector } from "./settings/layout-selector";
import CtaBannerSettings from "./settings/cta-banner-settings";
import StatsSettings from "./settings/stats-settings";
import LogoCloudSettings from "./settings/logo-cloud-settings";
import TimelineSettings from "./settings/timeline-settings";
import ProcessStepsSettings from "./settings/process-steps-settings";
import PricingSettings from "./settings/pricing-settings";
import EventsSettings from "./settings/events-settings";
import FeatureHighlightsSettings from "./settings/feature-highlights-settings";
import MediaGallerySettings from "./settings/media-gallery-settings";
import BlogSettings from "./settings/blog-settings";
import { HeroSettings } from "./settings/hero-settings";
import { PrivacyPolicySettings } from "./settings/privacy-policy-settings";
import { TeamSettings } from "./settings/team-settings";
import { FaqSettings } from "./settings/faq-settings";
import { ContentSectionSettings } from "./settings/content-section-settings";
import { ContactSettings } from "./settings/contact-settings";
import CommunitiesSettings from "./settings/communities-settings";
import CeoMessageSettings from "./settings/ceo-message-settings";
import AboutSettings from "./settings/about-settings";
import TestimonialsSettings from "./settings/testimonials-settings";
import MarketplaceSettings from "./settings/marketplace-settings";
import {
  useUpdateModule,
  useUpdateNavbar,
  useUpdateFooter,
  useGetWebsite,
} from "@/graphql/actions/website";

// Community Module Settings
import { MemberSpotlightSettings } from "./settings/member-spotlight-settings";
import { LeaderboardSettings } from "./settings/leaderboard-settings";
import { ChaptersSettings } from "./settings/chapters-settings";
import { PollsSettings } from "./settings/polls-settings";
import { SocialFeedSettings } from "./settings/social-feed-settings";
import { SuccessStoriesSettings } from "./settings/success-stories-settings";

// Business Module Settings
import { AchievementsSettings } from "./settings/achievements-settings";
import { BenefitsSettings } from "./settings/benefits-settings";
import { CaseStudiesSettings } from "./settings/case-studies-settings";
import { DonationSettings } from "./settings/donation-settings";

// Content & Media Module Settings
import { VideoSpotlightSettings } from "./settings/video-spotlight-settings";
import { PodcastSettings } from "./settings/podcast-settings";

// Interactive Module Settings
import { ComparisonTableSettings } from "./settings/comparison-table-settings";
import { LocationMapSettings } from "./settings/location-map-settings";
import { EmbedBlockSettings } from "./settings/embed-block-settings";
import { HtmlSettings } from "./settings/html-settings";
import { CalloutSettings } from "./settings/callout-settings";

// Information Module Settings
import { AnnouncementBarSettings } from "./settings/announcement-bar-settings";
import { SitemapSettings } from "./settings/sitemap-settings";
import { GuidelinesSettings } from "./settings/guidelines-settings";

// Timeline & Events Module Settings
import { EventCountdownSettings } from "./settings/event-countdown-settings";
import { MilestonesSettings } from "./settings/milestones-settings";
import { RoadmapSettings } from "./settings/roadmap-settings";

// Learning Module Settings
import { CoursesSettings } from "./settings/courses-settings";
import { ResearchSettings } from "./settings/research-settings";

// Services & Jobs Module Settings
import { ServicesSettings } from "./settings/services-settings";
import { JobsSettings } from "./settings/jobs-settings";
import { WallOfFameSettings } from "./settings/wall-of-fame-settings";
import { MembersAroundWorldSettings } from "./settings/members-around-world-settings";
import { CommonHeaderSettings } from "./settings/common-header-settings";
import { ContainerSettings } from "./settings/container-settings";

const getAvailableLayouts = (
  theme: ThemeType,
  moduleType: ModuleType
): LayoutType[] => {
  if (moduleType === "hero") {
    // 4 Core Hero Layouts
    return ["carousel", "split", "video", "single-image", "globe-interactive"];
  }
  if (moduleType === "navbar") {
    return ["simple", "centered", "minimal", "stacked", "split"];
  }
  if (moduleType === "footer") {
    return ["columns", "simple", "minimal", "corporate", "newsletter", "custom-html"];
  }
  if (["communities", "marketplace", "jobs"].includes(moduleType)) {
    return ["grid", "list", "cards", "masonry"];
  }
  if (moduleType === "ceo-message") {
    return [
      "classic-card",
      "split-screen",
      "centered",
      "testimonial",
      "modern-asymmetric",
    ];
  }
  if (moduleType === "wall-of-fame") {
    return ["podium", "hall-grid", "timeline", "featured-cards"];
  }
  if (moduleType === "testimonials") {
    return [
      "grid-cards",
      "carousel",
      "marquee",
      "featured-large",
      "masonry-wall",
      "minimal-list",
      "video-testimonials",
      "quote-wall",
      "social-proof-stats",
    ];
  }
  if (moduleType === "about") {
    return [
      "story-vision",
      "mission-values",
      "founder-message",
      "impact-growth",
      "simple-overview",
    ];
  }
  if (moduleType === "contact") {
    return ["simple-contact"];
  }
  if (moduleType === "privacy-policy") {
    return ["simple-privacy", "legal-document", "tabbed-policy"];
  }
  if (moduleType === "team-members") {
    return [
      "grid-profiles",
      "carousel-leaders",
      "minimal-list",
      "marquee",
      "marquee-horizontal",
      "marquee-3d",
    ];
  }
  if (moduleType === "terms-conditions") {
    return ["simple-terms", "structured-agreement", "faq-style"];
  }
  if (moduleType === "faq") {
    return ["simple-accordion", "grid-cards", "highlight-feature"];
  }
  if (moduleType === "custom-content") {
    return ["details-list", "alternating-grid", "cards-grid", "text-focused"];
  }
  if (moduleType === "cta-banner") {
    return [
      "centered-banner",
      "split-cta",
      "full-width-highlight",
      "minimal-cta",
      "urgency-cta",
    ];
  }
  if (moduleType === "stats") {
    return [
      "stats-row",
      "grid-metrics",
      "icon-stats",
      "highlight-metric",
      "timeline-stats",
    ];
  }
  if (moduleType === "logo-cloud") {
    return [
      "logo-grid",
      "logo-carousel",
      "monochrome-logos",
      "featured-logos",
      "minimal-strip",
    ];
  }
  if (moduleType === "timeline") {
    return [
      "vertical-timeline",
      "horizontal-timeline",
      "card-timeline",
      "zigzag-timeline",
      "minimal-timeline",
    ];
  }
  if (moduleType === "process-steps") {
    return ["horizontal-steps", "vertical-steps", "card-steps", "icon-steps"];
  }
  if (moduleType === "pricing") {
    return ["cards-pricing", "table-pricing", "toggle-pricing"];
  }
  if (moduleType === "events") {
    return ["card-events", "list-events", "timeline-events", "calendar-events"];
  }
  if (moduleType === "feature-highlights") {
    return [
      "grid-highlights",
      "list-highlights",
      "cards-highlights",
      "icon-highlights",
    ];
  }
  if (moduleType === "media-gallery") {
    return [
      "grid-gallery",
      "masonry-gallery",
      "lightbox-gallery",
      "carousel-gallery",
    ];
  }
  if (moduleType === "blog") {
    return [
      "encyclopedia-article",
      "documentation-page",
      "knowledge-hub",
      "article",
      "interview-qa",
      "guide-tutorial",
      "featured-story",
      "standard-article",
    ];
  }
  if (moduleType === "partners") {
    return ["logo-row", "logo-grid", "logo-carousel", "simple-list"];
  }
  if (moduleType === "achievements") {
    return ["badge-grid", "award-wall", "timeline-awards", "carousel-badges"];
  }
  if (moduleType === "video-spotlight") {
    return [
      "centered-video",
      "video-gallery",
      "playlist-view",
      "hero-video",
      "hero-video-dialog",
    ];
  }
  if (moduleType === "resources") {
    return [
      "resource-cards",
      "download-list",
      "category-tabs",
      "search-library",
    ];
  }
  if (moduleType === "social-proof") {
    return ["inline-proof"];
  }
  if (moduleType === "countdown-banner") {
    return [
      "centered-countdown",
      "inline-banner",
      "flip-card",
      "split-banner",
      "minimal-timer",
    ];
  }
  if (moduleType === "comparison-table") {
    return ["standard-table", "feature-grid"];
  }
  if (moduleType === "location-map") {
    return ["full-width-map", "card-map", "split-map", "minimal-map"];
  }
  if (moduleType === "embed-block") {
    return ["fullwidth-embed"];
  }
  if (moduleType === "html") {
    return ["fullwidth-embed", "contained", "direct", "iframe"];
  }
  if (moduleType === "announcement") {
    return ["top-strip"];
  }
  if (moduleType === "sitemap") {
    return [
      "link-columns",
      "grouped-sections",
      "footer-style",
      "accordion-sections",
      "tree-view",
      "minimal-list",
    ];
  }
  if (moduleType === "member-spotlight") {
    return [
      "spotlight-cards",
      "featured-member",
      "member-carousel",
      "grid-profiles",
    ];
  }
  if (moduleType === "success-stories") {
    return [
      "story-cards",
      "testimonial-wall",
      "story-timeline",
      "featured-story",
    ];
  }
  if (moduleType === "event-countdown") {
    return [
      "timer-large",
      "event-card",
      "circular-progress",
      "compact-banner",
      "milestone-counter",
    ];
  }
  if (moduleType === "milestones") {
    return [
      "vertical-milestones",
      "horizontal-milestones",
      "card-milestones",
      "roadmap-milestones",
      "list-milestones",
    ];
  }
  if (moduleType === "leaderboard") {
    return ["rank-list", "podium-view", "stats-board", "card-rankings"];
  }
  if (moduleType === "guidelines") {
    return [
      "simple-list",
      "numbered-rules",
      "accordion-rules",
      "card-guidelines",
    ];
  }
  if (moduleType === "members-around-world") {
    return [
      "world-map-heatmap",
      "country-stats-grid",
      "interactive-globe",
      "regional-cards",
      "pin-drop-map",

      "top-countries-leaderboard",
      "continents-breakdown",
      "minimal-stats-row",
      "photo-mosaic-region",
    ];
  }

  if (moduleType === "chapters") {
    return ["location-grid", "map-view", "list-chapters", "region-cards"];
  }
  if (moduleType === "courses") {
    return ["course-cards", "course-grid", "course-list", "learning-path"];
  }
  if (moduleType === "research") {
    return [
      "research-list",
      "paper-grid",
      "featured-research",
      "publication-list",
    ];
  }
  if (moduleType === "benefits") {
    return [
      "benefit-icons",
      "feature-grid",
      "comparison-list",
      "highlight-cards",
    ];
  }
  if (moduleType === "roadmap") {
    return [
      "horizontal-roadmap",
      "vertical-timeline",
      "milestone-grid",
      "progress-steps",
    ];
  }
  if (moduleType === "case-studies") {
    return [
      "success-stories",
      "detailed-case",
      "newsletter-focus",
      "app-showcase",
    ];
  }
  if (moduleType === "callout") {
    return ["info-box", "banner-style", "card-callout", "sidebar-note"];
  }
  if (moduleType === "podcast") {
    return ["episode-list", "player-cards", "season-grid", "featured-episode"];
  }
  if (moduleType === "polls") {
    return [
      "poll-card",
      "live-voting",
      "results-chart",
      "poll-grid",
      "results-dashboard",
    ];
  }
  if (moduleType === "social-feed") {
    return ["feed-grid", "timeline-feed", "masonry-posts", "platform-tabs"];
  }
  if (moduleType === "announcement-bar") {
    return [
      "info-message",
      "warning-alert",
      "success-message",
      "error-alert",
      "promotion-banner",
      "maintenance-notice",
      "dismissible-bar",
      "countdown-alert",
      "link-notification",
    ];
  }
  if (moduleType === "donation") {
    return [
      "donation-simple",
      "goal-progress",
      "impact-showcase",
      "supporter-wall",
    ];
  }

  return ["default"];
};

// HeroSettings has been moved to ./settings/hero-settings.tsx
// This inline version is kept for reference but should not be used

// --- Privacy Policy Settings ---

interface SavedContentSnapshot {
  name: string;
  layout: LayoutType;
  content: Record<string, unknown>;
}

const ModuleSettings = () => {
  const {
    pages,
    currentPageId,
    selectedModuleId,
    selectModule,
    updateModuleLayout,
    updateModuleContent,
    updateModuleName,
    updateModuleVisibility,
    currentTheme,
    globalHeader,
    globalFooter,
  } = useWebsiteBuilderStore();

  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [updateModule, { loading: isUpdatingModule }] = useUpdateModule();
  const [updateNavbar, { loading: isUpdatingNavbar }] = useUpdateNavbar();
  const [updateFooter, { loading: isUpdatingFooter }] = useUpdateFooter();
  const { data: websiteData } = useGetWebsite();

  const isUpdating = isUpdatingModule || isUpdatingNavbar || isUpdatingFooter;
  const websiteId = websiteData?.getWebsite?.id;

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const lastSavedContentRef = React.useRef<SavedContentSnapshot | null>(null);

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const modules = currentPage?.modules || [];

  // Find selected module - check page modules first, then global header/footer
  let selectedModule = modules.find((m) => m.id === selectedModuleId);

  // If not found in page modules, check global modules
  if (!selectedModule && selectedModuleId) {
    if (globalHeader.id === selectedModuleId) {
      selectedModule = globalHeader;
    } else if (globalFooter.id === selectedModuleId) {
      selectedModule = globalFooter;
    }
  }

  const handleContentUpdate = React.useCallback(
    (updates: Record<string, unknown>) => {
      if (selectedModule) {
        updateModuleContent(selectedModule.id, updates);
        setHasUnsavedChanges(true);
      }
    },
    [selectedModule, updateModuleContent],
  );

  useEffect(() => {
    // If selectedModuleId is set but no matching module found, reset it
    if (selectedModuleId && !selectedModule) {
      selectModule(null);
    }
  }, [selectedModuleId, selectedModule, selectModule]);

  const handleSave = React.useCallback(async () => {
    if (!selectedModuleId || !selectedModule) return;

    try {
      if (selectedModule.type === "navbar" && websiteId) {
        await updateNavbar({
          variables: {
            websiteId,
            layout: selectedModule.layout,
            content: selectedModule.content,
            isEnabled: selectedModule.isEnabled,
          },
        });
      } else if (selectedModule.type === "footer" && websiteId) {
        await updateFooter({
          variables: {
            websiteId,
            layout: selectedModule.layout,
            content: selectedModule.content,
            isEnabled: selectedModule.isEnabled,
          },
        });
      } else {
        await updateModule({
          variables: {
            moduleId: selectedModuleId,
            name: selectedModule.name,
            layout: selectedModule.layout,
            content: selectedModule.content,
          },
        });
      }

      // Update last saved state
      lastSavedContentRef.current = {
        name: selectedModule.name,
        layout: selectedModule.layout,
        content: JSON.parse(JSON.stringify(selectedModule.content)),
      };
      setHasUnsavedChanges(false);
      toast({
        title: "Section Saved",
        description: `Successfully saved ${selectedModule.name}.`,
      });
    } catch (error: unknown) {
      console.error("Save failed:", error);
      setHasUnsavedChanges(true); // Mark as unsaved so user knows
      toast({
        title: "Save Failed",
        description: (error as Error)?.message || "Failed to save section changes.",
        variant: "destructive",
      });
    }
  }, [
    selectedModuleId,
    selectedModule,
    websiteId,
    updateNavbar,
    updateFooter,
    updateModule,
    toast,
  ]);

  const moduleName = selectedModule?.name;
  const moduleLayout = selectedModule?.layout;
  const serializedContent = selectedModule
    ? JSON.stringify(selectedModule.content)
    : "";

  // Debounced autosave effect
  useEffect(() => {
    if (!selectedModule || !selectedModuleId) return;

    // Initialize lastSavedContent if it's null
    if (!lastSavedContentRef.current) {
      lastSavedContentRef.current = {
        name: selectedModule.name,
        layout: selectedModule.layout,
        content: JSON.parse(JSON.stringify(selectedModule.content)),
      };
      return;
    }

    // Check if anything meaningfully changed compared to last saved state
    const lastSerializedContent = JSON.stringify(
      lastSavedContentRef.current.content,
    );

    const hasChanged =
      selectedModule.name !== lastSavedContentRef.current.name ||
      selectedModule.layout !== lastSavedContentRef.current.layout ||
      serializedContent !== lastSerializedContent;

    if (!hasChanged) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000); // 3 second debounce

    return () => clearTimeout(timer);
  }, [
    moduleName,
    moduleLayout,
    serializedContent,
    selectedModule,
    selectedModuleId,
    handleSave,
  ]);

  // If selectedModule is null, reset selectedModuleId to null
  if (!selectedModule) {
    if (selectedModuleId) selectModule(null);
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground text-xs bg-muted/10 rounded-lg border border-dashed m-3">
        <p>Select a module to edit</p>
      </div>
    );
  }

  const availableLayouts = getAvailableLayouts(
    currentTheme,
    selectedModule.type
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-white dark:bg-zinc-900 border-r border-[#d2d5d9] dark:border-zinc-800 transition-all duration-200 shadow-2xl overflow-hidden",
        isExpanded
          ? "w-full md:w-[700px] lg:w-[860px]"
          : "w-[360px] sm:w-[420px]",
      )}
    >
      {/* ─── Tier 1: Sticky Polaris Header ─── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0 shadow-2xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-semibold text-xs text-[#303030] dark:text-zinc-100 truncate">
                {selectedModule.name}
              </h3>
              <Badge
                variant="outline"
                className="text-[9.5px] px-1.5 py-0 rounded-md border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7] dark:bg-zinc-800/60 text-muted-foreground capitalize shrink-0"
              >
                {selectedModule.type}
              </Badge>
            </div>
            <p className="text-[10px] text-muted-foreground truncate">
              Configure layout, content, and display options
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {/* Saving Indicator */}
          {isUpdating ? (
            <Badge
              variant="outline"
              className="text-[10px] gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 py-0.5"
            >
              <Loader2 className="h-2.5 w-2.5 animate-spin" />
              <span className="hidden sm:inline">Saving</span>
            </Badge>
          ) : hasUnsavedChanges ? (
            <Badge
              variant="outline"
              className="text-[10px] gap-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 py-0.5"
            >
              <span>Unsaved</span>
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="text-[10px] gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 py-0.5"
            >
              <Check className="h-2.5 w-2.5" />
              <span className="hidden sm:inline">Saved</span>
            </Badge>
          )}

          {/* Quick Manual Save Button */}
          <Button
            type="button"
            size="sm"
            onClick={handleSave}
            disabled={isUpdating}
            className="h-7 px-2 text-[11px] font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs gap-1 cursor-pointer"
          >
            {isUpdating ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            <span className="hidden sm:inline">Save</span>
          </Button>

          <div className="w-px h-4 bg-[#e1e3e5] dark:bg-zinc-800 mx-0.5" />

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            title={isExpanded ? "Collapse Panel" : "Expand Panel"}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            type="button"
            onClick={() => selectModule(null)}
            className="p-1.5 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 rounded-lg transition-colors text-muted-foreground hover:text-foreground cursor-pointer"
            title="Close Panel"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* ─── Tier 2: Scrollable Body ─── */}
      <div className="flex-1 overflow-y-auto p-3.5 sm:p-4 space-y-3.5 bg-[#f6f6f7] dark:bg-zinc-950">
        {/* Card 1: Section Identity */}
        <div className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              1
            </span>
            <Label className="text-xs font-bold uppercase tracking-wide text-foreground">
              Section Identity
            </Label>
          </div>
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-foreground">
              Section Title
            </Label>
            <Input
              value={selectedModule.name}
              onChange={(e) =>
                updateModuleName(selectedModuleId!, e.target.value)
              }
              placeholder="e.g., Hero Section"
              className="h-8 text-xs rounded-lg border-[#d2d5d9] dark:border-zinc-800 bg-background"
            />
            <p className="text-[11px] text-muted-foreground leading-snug">
              Internal label for organizing sections across the builder.
            </p>
          </div>
        </div>

        {/* Card 2: Layout Style */}
        <div className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              2
            </span>
            <Label className="text-xs font-bold uppercase tracking-wide text-foreground">
              Layout Style
            </Label>
          </div>
          <LayoutSelector
            currentTheme={currentTheme}
            currentLayout={selectedModule.layout}
            availableLayouts={availableLayouts}
            onLayoutChange={(layout) => {
              updateModuleLayout(selectedModuleId!, layout);
              if (selectedModule.type === "html") {
                const updates: Record<string, unknown> = {};
                if (layout === "fullwidth-embed") {
                  updates.containerWidth = "full";
                } else if (layout === "contained") {
                  updates.containerWidth = "contained";
                } else if (layout === "direct") {
                  updates.renderMode = "direct";
                } else if (layout === "iframe") {
                  updates.renderMode = "iframe";
                }
                if (Object.keys(updates).length > 0) {
                  updateModuleContent(selectedModule.id, updates);
                }
              }
            }}
            type={selectedModule.type}
          />
        </div>

        {/* Card 3: Section Content */}
        <div className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              3
            </span>
            <Label className="text-xs font-bold uppercase tracking-wide text-foreground">
              Section Content
            </Label>
          </div>

          {/* NAVBAR SETTINGS */}
          {selectedModule.type === "navbar" && (
            <NavbarSettings
              content={selectedModule.content}
              moduleId={selectedModule.id}
              onContentUpdate={handleContentUpdate}
            />
          )}

          {/* FOOTER SETTINGS */}
          {selectedModule.type === "footer" && (
            <FooterSettings
              content={selectedModule.content}
              moduleId={selectedModule.id}
              onContentUpdate={handleContentUpdate}
            />
          )}

          {selectedModule.type === "video-spotlight" && (
            <VideoSpotlightSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* Common fields for other modules */}
          {!["navbar", "footer", "hero", "video", "html"].includes(
            selectedModule.type
          ) && (
            <CommonHeaderSettings
              title={selectedModule.content.title}
              description={selectedModule.content.description}
              onTitleChange={(title) =>
                updateModuleContent(selectedModule.id, { title })
              }
              onDescriptionChange={(description) =>
                updateModuleContent(selectedModule.id, { description })
              }
              showLayoutControls={true}
              layoutSettings={selectedModule.content.layoutSettings}
              onLayoutChange={(layoutSettings) =>
                updateModuleContent(selectedModule.id, { layoutSettings })
              }
              titleColor={selectedModule.content.titleColor}
              descriptionColor={selectedModule.content.descriptionColor}
              hideTitle={selectedModule.content.hideTitle}
              hideDescription={selectedModule.content.hideDescription}
              onTitleColorChange={(titleColor) =>
                updateModuleContent(selectedModule.id, { titleColor })
              }
              onDescriptionColorChange={(descriptionColor) =>
                updateModuleContent(selectedModule.id, { descriptionColor })
              }
              onHideTitleChange={(hideTitle) =>
                updateModuleContent(selectedModule.id, { hideTitle })
              }
              onHideDescriptionChange={(hideDescription) =>
                updateModuleContent(selectedModule.id, { hideDescription })
              }
            />
          )}

          {/* HERO SETTINGS */}
          {selectedModule.type === "hero" && (
            <HeroSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "wall-of-fame" && (
            <WallOfFameSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}
          {/* COMMUNITIES: COMMUNITY EDITOR */}
          {selectedModule.type === "communities" && (
            <CommunitiesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* CEO MESSAGE: MESSAGE EDITOR */}
          {selectedModule.type === "ceo-message" && (
            <CeoMessageSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* MEMBER SPOTLIGHT: MEMBER EDITOR */}
          {selectedModule.type === "member-spotlight" && (
            <MemberSpotlightSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* TESTIMONIALS: TESTIMONIAL EDITOR */}
          {selectedModule.type === "testimonials" && (
            <TestimonialsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* JOBS: JOB SETTINGS */}
          {selectedModule.type === "jobs" && (
            <JobsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* MARKETPLACE: PRODUCT EDITOR */}
          {selectedModule.type === "marketplace" && (
            <MarketplaceSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "location-map" && (
            <LocationMapSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* HTML: HTML MODULE SETTINGS */}
          {selectedModule.type === "html" && (
            <HtmlSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* EMBED BLOCK SETTINGS */}
          {selectedModule.type === "embed-block" && (
            <EmbedBlockSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* SERVICES: SERVICE EDITOR */}
          {selectedModule.type === "services" && (
            <ServicesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* CONTACT: CONTACT SETTINGS */}
          {selectedModule.type === "contact" && (
            <ContactSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* PRIVACY POLICY: PRIVACY POLICY SETTINGS */}
          {selectedModule.type === "privacy-policy" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* TEAM MEMBERS: TEAM SETTINGS */}
          {selectedModule.type === "team-members" && (
            <TeamSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "comparison-table" && (
            <ComparisonTableSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* TERMS & CONDITIONS: REUSING PRIVACY SETTINGS (Structure is identical) */}
          {selectedModule.type === "terms-conditions" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "achievements" && (
            <AchievementsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* FAQ: FAQ SETTINGS */}
          {selectedModule.type === "faq" && (
            <FaqSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* CUSTOM CONTENT: SETTINGS */}
          {selectedModule.type === "custom-content" && (
            <ContentSectionSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* CTA BANNER: SETTINGS */}
          {selectedModule.type === "cta-banner" && (
            <CtaBannerSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* STATS: SETTINGS */}
          {selectedModule.type === "stats" && (
            <StatsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* LOGO CLOUD: SETTINGS */}
          {selectedModule.type === "logo-cloud" && (
            <LogoCloudSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* TIMELINE: SETTINGS */}
          {selectedModule.type === "timeline" && (
            <TimelineSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* PROCESS STEPS: SETTINGS */}
          {selectedModule.type === "process-steps" && (
            <ProcessStepsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* PRICING: SETTINGS */}
          {selectedModule.type === "pricing" && (
            <PricingSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* EVENTS: SETTINGS */}
          {selectedModule.type === "events" && (
            <EventsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* FEATURE HIGHLIGHTS: SETTINGS */}
          {selectedModule.type === "feature-highlights" && (
            <FeatureHighlightsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* MEDIA GALLERY: SETTINGS */}
          {selectedModule.type === "media-gallery" && (
            <MediaGallerySettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* BLOG: SETTINGS */}
          {selectedModule.type === "blog" && (
            <BlogSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* ABOUT: CONTENT EDITOR */}
          {selectedModule.type === "about" && (
            <AboutSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* COMMUNITY MODULES */}
          {selectedModule.type === "member-spotlight" && (
            <MemberSpotlightSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "success-stories" && (
            <SuccessStoriesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "event-countdown" && (
            <EventCountdownSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "milestones" && (
            <MilestonesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "leaderboard" && (
            <LeaderboardSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "guidelines" && (
            <GuidelinesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "members-around-world" && (
            <MembersAroundWorldSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}
          {/* RESOURCE HUB MODULES */}
          {selectedModule.type === "chapters" && (
            <ChaptersSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "courses" && (
            <CoursesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "research" && (
            <ResearchSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* PROJECT & MARKETING MODULES */}
          {selectedModule.type === "benefits" && (
            <BenefitsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "roadmap" && (
            <RoadmapSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "case-studies" && (
            <CaseStudiesSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* INTERACTIVE & ENGAGEMENT MODULES */}
          {selectedModule.type === "callout" && (
            <CalloutSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {selectedModule.type === "podcast" && (
            <PodcastSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "polls" && (
            <PollsSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "social-feed" && (
            <SocialFeedSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* MISC MODULES */}
          {selectedModule.type === "announcement-bar" && (
            <AnnouncementBarSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "donation" && (
            <DonationSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
              layout={selectedModule.layout}
            />
          )}

          {/* SITEMAP: SETTINGS */}
          {selectedModule.type === "sitemap" && (
            <SitemapSettings
              content={selectedModule.content}
              onChange={handleContentUpdate}
            />
          )}

          {/* BACKGROUND & OVERLAYS */}
          {selectedModule.content.backgroundImage && (
            <div className="space-y-3 pt-2 border-t border-border/60">
              <Label className="text-xs font-semibold text-foreground">
                Background Image
              </Label>
              <div className="relative group aspect-video rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-muted/40 flex items-center justify-center cursor-pointer overflow-hidden">
                {selectedModule.content.backgroundImage ? (
                  <>
                    <Image
                      src={selectedModule.content.backgroundImage}
                      alt="Background"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Plus className="h-5 w-5" />
                    <span className="text-xs font-medium">Add Background</span>
                    <span className="text-[11px] text-muted-foreground">
                      or drag and drop
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card 4: Access & Visibility */}
        <div className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              4
            </span>
            <Label className="text-xs font-bold uppercase tracking-wide text-foreground">
              Audience & Access
            </Label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {[
              {
                id: "public",
                label: "Everyone",
                desc: "Public to all visitors",
                icon: Globe,
              },
              {
                id: "members",
                label: "Members",
                desc: "Signed-in accounts",
                icon: Users,
              },
              {
                id: "admin",
                label: "Admins",
                desc: "Admin users only",
                icon: ShieldCheck,
              },
            ].map((option) => {
              const Icon = option.icon;
              const isSelected = selectedModule.visibility === option.id;
              return (
                <button
                  type="button"
                  key={option.id}
                  onClick={() =>
                    updateModuleVisibility(
                      selectedModule.id,
                      option.id as "public" | "members" | "admin",
                    )
                  }
                  className={cn(
                    "flex flex-col items-start p-2 rounded-xl border text-left transition-all cursor-pointer shadow-2xs",
                    isSelected
                      ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/60",
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <div
                      className={cn(
                        "p-1 rounded-lg border",
                        isSelected
                          ? "bg-indigo-600 text-white border-indigo-600"
                          : "bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border-indigo-200/80 dark:border-indigo-800/80",
                      )}
                    >
                      <Icon className="h-3 w-3" />
                    </div>
                    {isSelected && (
                      <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-indigo-600 text-white">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      isSelected
                        ? "text-indigo-950 dark:text-indigo-100"
                        : "text-[#303030] dark:text-zinc-100",
                    )}
                  >
                    {option.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground leading-tight mt-0.5">
                    {option.desc}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Card 5: Container Geometry */}
        {!["navbar", "footer"].includes(selectedModule.type) && (
          <div className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
                5
              </span>
              <Label className="text-xs font-bold uppercase tracking-wide text-foreground">
                Container Geometry
              </Label>
            </div>
            <ContainerSettings
              selectedModule={selectedModule}
              updateModuleContent={updateModuleContent}
            />
          </div>
        )}
      </div>

      {/* ─── Tier 3: Sticky Polaris Footer ─── */}
      <div className="p-3 px-4 border-t border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between shrink-0 shadow-2xs">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          {isUpdating ? (
            <>
              <Loader2 className="h-3 w-3 animate-spin text-amber-500 shrink-0" />
              <span>Saving changes...</span>
            </>
          ) : hasUnsavedChanges ? (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
              <span>Unsaved changes</span>
            </>
          ) : (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>All changes synced</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              if (hasUnsavedChanges) {
                await handleSave();
              }
              selectModule(null);
            }}
            disabled={isUpdating}
            className="h-8 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 text-[#303030] dark:text-zinc-200 cursor-pointer shadow-2xs"
          >
            Done
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isUpdating}
            className="h-8 px-3.5 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs cursor-pointer gap-1.5"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                <span>Save Section</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModuleSettings;
