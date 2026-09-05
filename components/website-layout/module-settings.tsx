import {
  LayoutType,
  ModuleType,
  ThemeType,
  useWebsiteBuilderStore,
  MenuItem,
} from "@/store/useWebsiteBuilderStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { X, Plus, Trash2, Maximize2, Minimize2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { NavbarSettings } from "./settings/navbar-settings";
import { FooterSettings } from "./settings/footer-settings";
import { SocialLinksEditor } from "./settings/social-links-editor";
import { LayoutSelector } from "./settings/layout-selector";
import CtaBannerSettings from "./settings/cta-banner-settings";
import StatsSettings from "./settings/stats-settings";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import LogoCloudSettings from "./settings/logo-cloud-settings";
import TimelineSettings from "./settings/timeline-settings";
import ProcessStepsSettings from "./settings/process-steps-settings";
import PricingSettings from "./settings/pricing-settings";
import EventsSettings from "./settings/events-settings";
import FeatureHighlightsSettings from "./settings/feature-highlights-settings";
import MediaGallerySettings from "./settings/media-gallery-settings";
import BlogSettings from "./settings/blog-settings";
import { useEffect, useMemo } from "react";
import React from "react";
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
import { Loader2, Check } from "lucide-react";

// Community Module Settings
import { MemberSpotlightSettings } from "./settings/member-spotlight-settings";
import { LeaderboardSettings } from "./settings/leaderboard-settings";
import { ChaptersSettings } from "./settings/chapters-settings";
import { PollsSettings } from "./settings/polls-settings";
import { SocialFeedSettings } from "./settings/social-feed-settings";
import { SuccessStoriesSettings } from "./settings/success-stories-settings";

// Business Module Settings
import { PartnersSettings } from "./settings/partners-settings";
import { AchievementsSettings } from "./settings/achievements-settings";
import { BenefitsSettings } from "./settings/benefits-settings";
import { CaseStudiesSettings } from "./settings/case-studies-settings";
import { DonationSettings } from "./settings/donation-settings";

// Content & Media Module Settings
import { VideoSpotlightSettings } from "./settings/video-spotlight-settings";

import { ResourcesSettings } from "./settings/resources-settings";
import { PodcastSettings } from "./settings/podcast-settings";
import { SocialProofSettings } from "./settings/social-proof-settings";

// Interactive Module Settings
import { CountdownBannerSettings } from "./settings/countdown-banner-settings";
import { ComparisonTableSettings } from "./settings/comparison-table-settings";
import { LocationMapSettings } from "./settings/location-map-settings";
import { EmbedBlockSettings } from "./settings/embed-block-settings";
import { HtmlSettings } from "./settings/html-settings";
import { CalloutSettings } from "./settings/callout-settings";

// Information Module Settings
import { AnnouncementSettings } from "./settings/announcement-settings";
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
import { LatestMembersSettings } from "./settings/latest-members-settings";
import { IconPicker } from "./settings/icon-picker";
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
    return ["columns", "simple", "minimal", "corporate", "newsletter"];
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
  if (moduleType === "testimonials") {
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

  const [isExpanded, setIsExpanded] = React.useState(false);
  const [updateModule, { loading: isUpdatingModule }] = useUpdateModule();
  const [updateNavbar, { loading: isUpdatingNavbar }] = useUpdateNavbar();
  const [updateFooter, { loading: isUpdatingFooter }] = useUpdateFooter();
  const { data: websiteData } = useGetWebsite();

  const isUpdating = isUpdatingModule || isUpdatingNavbar || isUpdatingFooter;
  const websiteId = websiteData?.getWebsite?.id;

  const [hasUnsavedChanges, setHasUnsavedChanges] = React.useState(false);
  const [lastSavedContent, setLastSavedContent] = React.useState<any>(null);

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
  console.log(globalFooter, globalHeader);

  useEffect(() => {
    // If selectedModuleId is set but no matching module found, reset it
    if (selectedModuleId && !selectedModule) {
      selectModule(null);
    }
  }, [selectedModuleId, selectedModule, selectModule]);

  // Debounced autosave effect
  useEffect(() => {
    if (!selectedModule || !selectedModuleId) return;

    // Initialize lastSavedContent if it's null
    if (!lastSavedContent) {
      setLastSavedContent({
        name: selectedModule.name,
        layout: selectedModule.layout,
        content: JSON.parse(JSON.stringify(selectedModule.content)),
      });
      return;
    }

    // Check if anything meaningfully changed compared to last saved state
    const currentSerializedContent = JSON.stringify(selectedModule.content);
    const lastSerializedContent = JSON.stringify(lastSavedContent.content);

    const hasChanged =
      selectedModule.name !== lastSavedContent.name ||
      selectedModule.layout !== lastSavedContent.layout ||
      currentSerializedContent !== lastSerializedContent;

    if (!hasChanged) return;

    const timer = setTimeout(() => {
      handleSave();
    }, 3000); // 1 second debounce

    return () => clearTimeout(timer);
  }, [
    selectedModule?.name,
    selectedModule?.layout,
    JSON.stringify(selectedModule?.content),
  ]);

  const handleSave = async () => {
    if (!selectedModuleId || !selectedModule) return;

    try {
      setHasUnsavedChanges(false);

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
      setLastSavedContent({
        name: selectedModule.name,
        layout: selectedModule.layout,
        content: JSON.parse(JSON.stringify(selectedModule.content)),
      });
    } catch (error) {
      console.error("Autosave failed:", error);
      setHasUnsavedChanges(true); // Mark as unsaved so user knows
    }
  };

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
        "flex flex-col h-full bg-card border-l transition-all duration-200 min-w-[300px]",
        isExpanded
          ? "w-full md:w-[700px] lg:w-[900px] shadow-2xl z-50"
          : "w-[340px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center w-full justify-between px-3 py-2.5 border-b shrink-0">
        <div className="min-w-0">
          <h3 className="font-semibold text-sm truncate">{selectedModule.name}</h3>
          <p className="text-[10px] text-muted-foreground/60 capitalize">
            {selectedModule.type}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {/* Saving Indicator */}
          <div className="flex items-center gap-1 text-[9px] font-medium">
            {isUpdating ? (
              <>
                <Loader2 className="h-2.5 w-2.5 animate-spin text-primary" />
                <span className="text-muted-foreground">Saving</span>
              </>
            ) : (
              <>
                <Check className="h-2.5 w-2.5 text-green-500" />
                <span className="text-muted-foreground/40">Saved</span>
              </>
            )}
          </div>
          <div className="w-px h-4 bg-border/40" />
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground/60 hover:text-foreground"
            title={isExpanded ? "Collapse" : "Expand"}
          >
            {isExpanded ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => selectModule(null)}
            className="p-1 hover:bg-muted rounded-md transition-colors text-muted-foreground/60 hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Module Name Editor */}
        <div className="space-y-1.5 pb-3 border-b">
          <Label className="text-[10px] font-semibold uppercase text-muted-foreground/60 tracking-wider">
            Name
          </Label>
          <Input
            value={selectedModule.name}
            onChange={(e) =>
              updateModuleName(selectedModuleId!, e.target.value)
            }
            placeholder="e.g., Hero Section"
            className="h-8 text-xs"
          />
        </div>

        {/* Layout Selection */}
        <LayoutSelector
          currentTheme={currentTheme}
          currentLayout={selectedModule.layout}
          availableLayouts={availableLayouts}
          onLayoutChange={(layout) => {
            updateModuleLayout(selectedModuleId!, layout);
            if (selectedModule.type === "html") {
              const updates: any = {};
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

        <hr className="border-border/40" />

        {/* Content Controls */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
            Content
          </Label>

          {/* NAVBAR SETTINGS */}
          {selectedModule.type === "navbar" && (
            <NavbarSettings
              content={selectedModule.content}
              moduleId={selectedModule.id}
              onContentUpdate={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* FOOTER SETTINGS */}
          {selectedModule.type === "footer" && (
            <FooterSettings
              content={selectedModule.content}
              moduleId={selectedModule.id}
              onContentUpdate={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "video-spotlight" && (
            <VideoSpotlightSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
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
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "wall-of-fame" && (
            <WallOfFameSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}
          {/* COMMUNITIES: COMMUNITY EDITOR */}
          {selectedModule.type === "communities" && (
            <CommunitiesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CEO MESSAGE: MESSAGE EDITOR */}
          {selectedModule.type === "ceo-message" && (
            <CeoMessageSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* MEMBER SPOTLIGHT: MEMBER EDITOR */}
          {selectedModule.type === "member-spotlight" && (
            <MemberSpotlightSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* TESTIMONIALS: TESTIMONIAL EDITOR */}
          {selectedModule.type === "testimonials" && (
            <TestimonialsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* JOBS: JOB SETTINGS */}
          {selectedModule.type === "jobs" && (
            <JobsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* MARKETPLACE: PRODUCT EDITOR */}
          {selectedModule.type === "marketplace" && (
            <MarketplaceSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "location-map" && (
            <LocationMapSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* HTML: HTML MODULE SETTINGS */}
          {selectedModule.type === "html" && (
            <HtmlSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* EMBED BLOCK SETTINGS */}
          {selectedModule.type === "embed-block" && (
            <EmbedBlockSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* SERVICES: SERVICE EDITOR */}
          {selectedModule.type === "services" && (
            <ServicesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CONTACT: CONTACT SETTINGS */}
          {selectedModule.type === "contact" && (
            <ContactSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* PRIVACY POLICY: PRIVACY POLICY SETTINGS */}
          {selectedModule.type === "privacy-policy" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TEAM MEMBERS: TEAM SETTINGS */}
          {selectedModule.type === "team-members" && (
            <TeamSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "comparison-table" && (
            <ComparisonTableSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TERMS & CONDITIONS: REUSING PRIVACY SETTINGS (Structure is identical) */}
          {selectedModule.type === "terms-conditions" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "achievements" && (
            <AchievementsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* FAQ: FAQ SETTINGS */}
          {selectedModule.type === "faq" && (
            <FaqSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CUSTOM CONTENT: SETTINGS */}
          {selectedModule.type === "custom-content" && (
            <ContentSectionSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CTA BANNER: SETTINGS */}
          {selectedModule.type === "cta-banner" && (
            <CtaBannerSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* STATS: SETTINGS */}
          {selectedModule.type === "stats" && (
            <StatsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* LOGO CLOUD: SETTINGS */}
          {selectedModule.type === "logo-cloud" && (
            <LogoCloudSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TIMELINE: SETTINGS */}
          {selectedModule.type === "timeline" && (
            <TimelineSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* PROCESS STEPS: SETTINGS */}
          {selectedModule.type === "process-steps" && (
            <ProcessStepsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* PRICING: SETTINGS */}
          {selectedModule.type === "pricing" && (
            <PricingSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* EVENTS: SETTINGS */}
          {selectedModule.type === "events" && (
            <EventsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* FEATURE HIGHLIGHTS: SETTINGS */}
          {selectedModule.type === "feature-highlights" && (
            <FeatureHighlightsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* MEDIA GALLERY: SETTINGS */}
          {selectedModule.type === "media-gallery" && (
            <MediaGallerySettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* BLOG: SETTINGS */}
          {selectedModule.type === "blog" && (
            <BlogSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* ABOUT: CONTENT EDITOR */}
          {selectedModule.type === "about" && (
            <AboutSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* COMMUNITY MODULES */}
          {selectedModule.type === "member-spotlight" && (
            <MemberSpotlightSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "success-stories" && (
            <SuccessStoriesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "event-countdown" && (
            <EventCountdownSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "milestones" && (
            <MilestonesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "leaderboard" && (
            <LeaderboardSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "guidelines" && (
            <GuidelinesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "members-around-world" && (
            <MembersAroundWorldSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}
          {/* RESOURCE HUB MODULES */}
          {selectedModule.type === "chapters" && (
            <ChaptersSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "courses" && (
            <CoursesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "research" && (
            <ResearchSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* PROJECT & MARKETING MODULES */}
          {selectedModule.type === "benefits" && (
            <BenefitsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "roadmap" && (
            <RoadmapSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "case-studies" && (
            <CaseStudiesSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* INTERACTIVE & ENGAGEMENT MODULES */}
          {selectedModule.type === "callout" && (
            <CalloutSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "podcast" && (
            <PodcastSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "polls" && (
            <PollsSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "social-feed" && (
            <SocialFeedSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* MISC MODULES */}
          {selectedModule.type === "announcement-bar" && (
            <AnnouncementBarSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "donation" && (
            <DonationSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* SITEMAP: SETTINGS */}
          {selectedModule.type === "sitemap" && (
            <SitemapSettings
              content={selectedModule.content}
              onChange={(updates: any) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* BACKGROUND & OVERLAYS */}
          {selectedModule.content.backgroundImage && (
            <div className="space-y-4">
              <hr className="border-border" />
              <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
                Background Image
              </Label>
              <div
                className="relative group aspect-video rounded-xl border bg-muted flex items-center justify-center cursor-pointer overflow-hidden"
                onClick={() => {
                  /* Open image selection */
                }}
              >
                {selectedModule.content.backgroundImage ? (
                  <>
                    <img
                      src={selectedModule.content.backgroundImage}
                      alt="Background"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        Change Image
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                    <Plus className="h-6 w-6" />
                    <span className="text-xs font-medium">Add Background</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      or drag and drop
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <hr className="border-border/40" />

          <div className="space-y-2">
            <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
              Visibility
            </Label>
            <RadioGroup
              value={selectedModule.visibility}
              onValueChange={(val: any) =>
                updateModuleVisibility(selectedModule.id, val)
              }
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="public" id="vis-public" />
                <Label htmlFor="vis-public" className="font-normal text-xs">
                  Everyone
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="members" id="vis-members" />
                <Label htmlFor="vis-members" className="font-normal text-xs">
                  Members Only
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="admin" id="vis-admin" />
                <Label htmlFor="vis-admin" className="font-normal text-xs">
                  Admin Only
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* CONTAINER SETTINGS */}
          {!["navbar", "footer"].includes(selectedModule.type) && (
            <>
              <hr className="border-border/40" />
              <ContainerSettings
                selectedModule={selectedModule}
                updateModuleContent={updateModuleContent}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModuleSettings;
