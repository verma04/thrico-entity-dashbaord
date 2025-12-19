import {
  LayoutType,
  ModuleData,
  ModuleType,
  ThemeType,
  useWebsiteBuilderStore,
  MenuItem,
} from "@/store/useWebsiteBuilderStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { Button } from "@/components/ui/button";
import { X, Plus, Trash2 } from "lucide-react";

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
import { useEffect } from "react";
import { HeroSettings } from "./settings/hero-settings";
import { PrivacyPolicySettings } from "./settings/privacy-policy-settings";
import { TeamSettings } from "./settings/team-settings";
import { FaqSettings } from "./settings/faq-settings";
import { ContentSectionSettings } from "./settings/content-section-settings";
import { ContactSettings } from "./settings/contact-settings";
import CommunitiesSettings from "./settings/communities-settings";
import CeoMessageSettings from "./settings/ceo-message-settings";
import TestimonialsSettings from "./settings/testimonials-settings";
import MarketplaceSettings from "./settings/marketplace-settings";
import AboutSettings from "./settings/about-settings";

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
import { CalloutSettings } from "./settings/callout-settings";

// Information Module Settings
import { AnnouncementSettings } from "./settings/announcement-settings";
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

const getAvailableLayouts = (
  theme: ThemeType,
  moduleType: ModuleType
): LayoutType[] => {
  if (moduleType === "hero") {
    // 4 Core Hero Layouts
    return ["carousel", "split", "video", "single-image"];
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
    return [
      "simple-contact",
      "support-focused",
      "sales-inquiry",
      "community-reach",
      "location-office",
    ];
  }
  if (moduleType === "privacy-policy") {
    return ["simple-privacy", "legal-document", "tabbed-policy"];
  }
  if (moduleType === "team-members") {
    return ["grid-profiles", "carousel-leaders", "minimal-list"];
  }
  if (moduleType === "terms-conditions") {
    return ["simple-terms", "structured-agreement", "faq-style"];
  }
  if (moduleType === "faq") {
    return ["simple-accordion", "grid-cards", "highlight-feature"];
  }
  if (moduleType === "custom-content") {
    return [
      "details-list",
      "alternating-grid",
      "cards-grid",
      "feature-showcase",
      "text-focused",
    ];
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
      "logo-marquee",
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
    return [
      "cards-pricing",
      "table-pricing",
      "toggle-pricing",
      "simple-pricing",
    ];
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
    return ["centered-video", "video-gallery", "playlist-view", "hero-video"];
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
    "minimal-timer"
  ];
}
  if (moduleType === "comparison-table") {
    return ["table-grid"];
  }
  if (moduleType === "location-map") {
    return ["map-fullwidth"];
  }
  if (moduleType === "embed-block") {
    return ["fullwidth-embed"];
  }
  if (moduleType === "announcement") {
    return ["top-strip"];
  }
  if (moduleType === "sitemap") {
    return [ "link-columns",        
    "grouped-sections",    
    "footer-style",       
    "accordion-sections",
    "tree-view",           
    "minimal-list"      
    ]}
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
    "milestone-counter"
  ];
}
 if (moduleType === "milestones") {
  return [
    "timeline-vertical",
    "timeline-horizontal", 
    "milestone-cards",
    "roadmap-view",
    "achievement-list"
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
      "timeline-research",
      "category-tabs",
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
    return ["success-stories", "detailed-case", "industry-focus" ,  "impact-metrics"];
  }
  if (moduleType === "callout") {
    return ["info-box", "banner-style", "card-callout", "sidebar-note"];
  }
  if (moduleType === "podcast") {
    return ["episode-list", "player-cards", "season-grid", "featured-episode"];
  }
  if (moduleType === "polls") {
    return ["poll-card", "live-voting", "results-chart", "poll-grid" , "results-dashboard"];
  }
  if (moduleType === "social-feed") {
    return ["feed-grid", "timeline-feed", "masonry-posts", "platform-tabs"];
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
  console.log(globalFooter , globalHeader)

  useEffect(() => {
    // If selectedModuleId is set but no matching module found, reset it
    if (selectedModuleId && !selectedModule) {
      selectModule(null);
    }
  }, [selectedModuleId, selectedModule, selectModule]);

  // If selectedModule is null, reset selectedModuleId to null
  if (!selectedModule) {
    if (selectedModuleId) selectModule(null);
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground bg-muted/10 rounded-xl border border-dashed m-4">
        <p>Select a module to edit settings</p>
      </div>
    );
  }

  const availableLayouts = getAvailableLayouts(
    currentTheme,
    selectedModule.type
  );

  

  return (
    <div className="flex flex-col h-full bg-card border-l w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div>
          <h3 className="font-semibold text-lg">{selectedModule.name}</h3>
          <p className="text-xs text-muted-foreground capitalize">
            {selectedModule.type} Module
          </p>
        </div>
        <button
          onClick={() => selectModule(null)}
          className="p-2 hover:bg-muted rounded-full"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Module Name Editor */}
        <div className="space-y-2 pb-4 border-b">
          <Label className="text-xs font-semibold uppercase text-muted-foreground">
            Module Name
          </Label>
          <Input
            value={selectedModule.name}
            onChange={(e) =>
              updateModuleName(selectedModuleId!, e.target.value)
            }
            placeholder="e.g., Hero Section - Homepage"
            className="h-9"
          />
          <p className="text-[10px] text-muted-foreground">
            Give this module a custom name for easier identification
          </p>
        </div>

        {/* Layout Selection */}
        <LayoutSelector
          currentTheme={currentTheme}
          currentLayout={selectedModule.layout}
          availableLayouts={availableLayouts}
          onLayoutChange={(layout) =>
            updateModuleLayout(selectedModuleId!, layout)
          }
          type={selectedModule.type}
        />

        <hr className="border-border" />

        {/* Content Controls */}
        <div className="space-y-4">
          <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
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

          {/* Common fields for other modules */}
          {!["navbar", "footer", "hero"].includes(selectedModule.type) && (
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
            />
          )}

          {/* HERO SETTINGS */}
          {selectedModule.type === "hero" && (
            <HeroSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "wall-of-fame" && (
            <WallOfFameSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}
          {/* COMMUNITIES: COMMUNITY EDITOR */}
          {selectedModule.type === "communities" && (
            <CommunitiesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CEO MESSAGE: MESSAGE EDITOR */}
          {selectedModule.type === "ceo-message" && (
            <CeoMessageSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TESTIMONIALS: TESTIMONIAL EDITOR */}
          {selectedModule.type === "testimonials" && (
            <TestimonialsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* JOBS: JOB SETTINGS */}
          {selectedModule.type === "jobs" && (
            <JobsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* MARKETPLACE: PRODUCT EDITOR */}
          {selectedModule.type === "marketplace" && (
            <MarketplaceSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* SERVICES: SERVICE EDITOR */}
          {selectedModule.type === "services" && (
            <ServicesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CONTACT: CONTACT SETTINGS */}
          {selectedModule.type === "contact" && (
            <ContactSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* PRIVACY POLICY: PRIVACY POLICY SETTINGS */}
          {selectedModule.type === "privacy-policy" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TEAM MEMBERS: TEAM SETTINGS */}
          {selectedModule.type === "team-members" && (
            <TeamSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TERMS & CONDITIONS: REUSING PRIVACY SETTINGS (Structure is identical) */}
          {selectedModule.type === "terms-conditions" && (
            <PrivacyPolicySettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* FAQ: FAQ SETTINGS */}
          {selectedModule.type === "faq" && (
            <FaqSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CUSTOM CONTENT: SETTINGS */}
          {selectedModule.type === "custom-content" && (
            <ContentSectionSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* CTA BANNER: SETTINGS */}
          {selectedModule.type === "cta-banner" && (
            <CtaBannerSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* STATS: SETTINGS */}
          {selectedModule.type === "stats" && (
            <StatsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* LOGO CLOUD: SETTINGS */}
          {selectedModule.type === "logo-cloud" && (
            <LogoCloudSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TIMELINE: SETTINGS */}
          {selectedModule.type === "timeline" && (
            <TimelineSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* PROCESS STEPS: SETTINGS */}
          {selectedModule.type === "process-steps" && (
            <ProcessStepsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* PRICING: SETTINGS */}
          {selectedModule.type === "pricing" && (
            <PricingSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* EVENTS: SETTINGS */}
          {selectedModule.type === "events" && (
            <EventsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* FEATURE HIGHLIGHTS: SETTINGS */}
          {selectedModule.type === "feature-highlights" && (
            <FeatureHighlightsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* MEDIA GALLERY: SETTINGS */}
          {selectedModule.type === "media-gallery" && (
            <MediaGallerySettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* BLOG: SETTINGS */}
          {selectedModule.type === "blog" && (
            <BlogSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* ABOUT: CONTENT EDITOR */}
          {selectedModule.type === "about" && (
            <AboutSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* COMMUNITY MODULES */}
          {selectedModule.type === "member-spotlight" && (
            <MemberSpotlightSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "leaderboard" && (
            <LeaderboardSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "chapters" && (
            <ChaptersSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "polls" && (
            <PollsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "social-feed" && (
            <SocialFeedSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "success-stories" && (
            <SuccessStoriesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* BUSINESS MODULES */}
          {selectedModule.type === "partners" && (
            <PartnersSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}
          {selectedModule.type === "members-around-world" && (
            <MembersAroundWorldSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}
          {selectedModule.type === "latest-members" && (
            <LatestMembersSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "achievements" && (
            <AchievementsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "benefits" && (
            <BenefitsSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "case-studies" && (
            <CaseStudiesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "donation" && (
            <DonationSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {/* CONTENT & MEDIA MODULES */}
          {selectedModule.type === "video-spotlight" && (
            <VideoSpotlightSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "resources" && (
            <ResourcesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "podcast" && (
            <PodcastSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
              layout={selectedModule.layout}
            />
          )}

          {selectedModule.type === "social-proof" && (
            <SocialProofSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* INTERACTIVE MODULES */}
          {selectedModule.type === "countdown-banner" && (
            <CountdownBannerSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "comparison-table" && (
            <ComparisonTableSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "location-map" && (
            <LocationMapSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "embed-block" && (
            <EmbedBlockSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "callout" && (
            <CalloutSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* INFORMATION MODULES */}
          {selectedModule.type === "announcement" && (
            <AnnouncementSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "sitemap" && (
            <SitemapSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "guidelines" && (
            <GuidelinesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* TIMELINE & EVENTS MODULES */}
          {selectedModule.type === "event-countdown" && (
            <EventCountdownSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "milestones" && (
            <MilestonesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "roadmap" && (
            <RoadmapSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {/* LEARNING MODULES */}
          {selectedModule.type === "courses" && (
            <CoursesSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {selectedModule.type === "research" && (
            <ResearchSettings
              content={selectedModule.content}
              onChange={(updates) =>
                updateModuleContent(selectedModule.id, updates)
              }
            />
          )}

          {![" navbar", "footer"].includes(selectedModule.type) && (
            <div className="space-y-2">
              <Label>Media</Label>
              <div className="border border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition cursor-pointer">
                <span className="text-sm font-medium text-primary">
                  Click to upload image
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  or drag and drop
                </span>
              </div>
            </div>
          )}
        </div>

        <hr className="border-border" />

        <div className="space-y-3">
          <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
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
              <Label htmlFor="vis-public" className="font-normal">
                Everyone
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="members" id="vis-members" />
              <Label htmlFor="vis-members" className="font-normal">
                Members Only
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="admin" id="vis-admin" />
              <Label htmlFor="vis-admin" className="font-normal">
                Admin Preview Only
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* CONTAINER SETTINGS */}
        {!["navbar", "footer", "cta-banner" ,"hero" ].includes(selectedModule.type) && (
          <>
            <hr className="border-border" />
            <div className="space-y-4">
              <Label className="uppercase text-xs text-muted-foreground font-bold tracking-wider">
                Container Settings
              </Label>

              {/* Container Width Option */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Container Width</Label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          fullWidth: false,
                        },
                      })
                    }
                    className={`flex-1 h-9 px-3 rounded-md border text-sm transition ${
                      !selectedModule.content.containerSettings?.fullWidth
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    Fixed Container
                  </button>
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          fullWidth: true,
                        },
                      })
                    }
                    className={`flex-1 h-9 px-3 rounded-md border text-sm transition ${
                      selectedModule.content.containerSettings?.fullWidth
                        ? "border-primary bg-primary text-white"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    Full Width
                  </button>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Fixed container centers content, full width spans entire screen
                </p>
              </div>

              {/* Background Color with Color Picker */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Background Color</Label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={
                      selectedModule.content.containerSettings?.background?.startsWith("#")
                        ? selectedModule.content.containerSettings.background
                        : "#ffffff"
                    }
                    onChange={(e) =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: e.target.value,
                        },
                      })
                    }
                    className="h-9 w-16 rounded-md border border-input cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={selectedModule.content.containerSettings?.background || ""}
                    onChange={(e) =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          background: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g., #ff5500 or bg-slate-50"
                    className="h-9 flex-1"
                  />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Use color picker or enter hex, rgb, or Tailwind class
                </p>
              </div>

              {/* Background Image Upload */}
              <ImageUploadWithCrop
                currentImage={selectedModule.content.containerSettings?.backgroundImage}
                onImageUpdate={(imageUrl) =>
                  updateModuleContent(selectedModule.id, {
                    containerSettings: {
                      ...selectedModule.content.containerSettings,
                      backgroundImage: imageUrl,
                    },
                  })
                }
                label="Background Image"
                recommendedWidth={1920}
                recommendedHeight={1080}
                aspectRatio={16 / 9}
                maxFileSize={10}
                showDimensions={true}
                className=""
              />

              {/* Opacity */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">Background Opacity</Label>
                  <span className="text-xs text-muted-foreground">
                    {selectedModule.content.containerSettings?.opacity ?? 100}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={selectedModule.content.containerSettings?.opacity ?? 100}
                  onChange={(e) =>
                    updateModuleContent(selectedModule.id, {
                      containerSettings: {
                        ...selectedModule.content.containerSettings,
                        opacity: parseInt(e.target.value),
                      },
                    })
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <p className="text-[10px] text-muted-foreground">
                  Control background transparency (0% = transparent, 100% = opaque)
                </p>
              </div>

              {/* CTA Button Settings */}
              <div className="space-y-3 pt-2 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-gray-600">CTA Button</Label>
                  <button
                    onClick={() =>
                      updateModuleContent(selectedModule.id, {
                        containerSettings: {
                          ...selectedModule.content.containerSettings,
                          button: {
                            ...selectedModule.content.containerSettings?.button,
                            enabled: !selectedModule.content.containerSettings?.button?.enabled,
                            text: selectedModule.content.containerSettings?.button?.text || "View All",
                            style: selectedModule.content.containerSettings?.button?.style || "primary",
                            position: selectedModule.content.containerSettings?.button?.position || "right",
                          },
                        },
                      })
                    }
                    className={`h-6 w-11 rounded-full transition ${
                      selectedModule.content.containerSettings?.button?.enabled
                        ? "bg-primary"
                        : "bg-gray-300"
                    } relative`}
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white shadow transform transition ${
                        selectedModule.content.containerSettings?.button?.enabled
                          ? "translate-x-6"
                          : "translate-x-1"
                      } mt-1`}
                    />
                  </button>
                </div>

                {selectedModule.content.containerSettings?.button?.enabled && (
                  <div className="space-y-3 pl-2 border-l-2 border-primary/20">
                    {/* Button Text Selector */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Button Text</Label>
                      <select
                        value={
                          ["View All", "Explore More", "Learn More", "See More"].includes(
                            selectedModule.content.containerSettings?.button?.text || ""
                          )
                            ? selectedModule.content.containerSettings?.button?.text
                            : "Custom"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          updateModuleContent(selectedModule.id, {
                            containerSettings: {
                              ...selectedModule.content.containerSettings,
                              button: {
                                ...selectedModule.content.containerSettings?.button,
                                enabled: true,
                                text: value === "Custom" ? "" : value,
                                style: selectedModule.content.containerSettings?.button?.style || "primary",
                                position: selectedModule.content.containerSettings?.button?.position || "right",
                              },
                            },
                          });
                        }}
                        className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                      >
                        <option value="View All">View All</option>
                        <option value="Explore More">Explore More</option>
                        <option value="Learn More">Learn More</option>
                        <option value="See More">See More</option>
                        <option value="Custom">Custom Text</option>
                      </select>
                    </div>

                    {/* Custom Text Input */}
                    {!["View All", "Explore More", "Learn More", "See More"].includes(
                      selectedModule.content.containerSettings?.button?.text || ""
                    ) && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Custom Button Text</Label>
                        <Input
                          type="text"
                          value={selectedModule.content.containerSettings?.button?.text || ""}
                          onChange={(e) =>
                            updateModuleContent(selectedModule.id, {
                              containerSettings: {
                                ...selectedModule.content.containerSettings,
                                button: {
                                  ...selectedModule.content.containerSettings?.button,
                                  enabled: true,
                                  text: e.target.value,
                                  style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  position: selectedModule.content.containerSettings?.button?.position || "right",
                                },
                              },
                            })
                          }
                          placeholder="Enter button text"
                          className="h-9"
                        />
                      </div>
                    )}

                    {/* Button Icon (Optional) */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs text-gray-600">Button Icon (Optional)</Label>
                        {selectedModule.content.containerSettings?.button?.icon && (
                          <button
                            onClick={() =>
                              updateModuleContent(selectedModule.id, {
                                containerSettings: {
                                  ...selectedModule.content.containerSettings,
                                  button: {
                                    ...selectedModule.content.containerSettings?.button,
                                    icon: undefined,
                                    iconPosition: undefined,
                                  },
                                },
                              })
                            }
                            className="text-xs text-red-500 hover:text-red-700"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                      <IconPicker
                        value={selectedModule.content.containerSettings?.button?.icon || ""}
                        onChange={(icon) =>
                          updateModuleContent(selectedModule.id, {
                            containerSettings: {
                              ...selectedModule.content.containerSettings,
                              button: {
                                ...selectedModule.content.containerSettings?.button,
                                enabled: true,
                                icon: icon,
                                iconPosition: selectedModule.content.containerSettings?.button?.iconPosition || "left",
                                text: selectedModule.content.containerSettings?.button?.text || "View All",
                                style: selectedModule.content.containerSettings?.button?.style || "primary",
                                position: selectedModule.content.containerSettings?.button?.position || "right",
                              },
                            },
                          })
                        }
                      />
                    </div>

                    {/* Icon Position (only show if icon is selected) */}
                    {selectedModule.content.containerSettings?.button?.icon && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Icon Position</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() =>
                              updateModuleContent(selectedModule.id, {
                                containerSettings: {
                                  ...selectedModule.content.containerSettings,
                                  button: {
                                    ...selectedModule.content.containerSettings?.button,
                                    iconPosition: "left",
                                  },
                                },
                              })
                            }
                            className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                              (selectedModule.content.containerSettings?.button?.iconPosition === "left" ||
                                !selectedModule.content.containerSettings?.button?.iconPosition)
                                ? "border-primary bg-primary text-white"
                                : "border-input bg-background hover:bg-muted"
                            }`}
                          >
                            ← Left
                          </button>
                          <button
                            onClick={() =>
                              updateModuleContent(selectedModule.id, {
                                containerSettings: {
                                  ...selectedModule.content.containerSettings,
                                  button: {
                                    ...selectedModule.content.containerSettings?.button,
                                    iconPosition: "right",
                                  },
                                },
                              })
                            }
                            className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                              selectedModule.content.containerSettings?.button?.iconPosition === "right"
                                ? "border-primary bg-primary text-white"
                                : "border-input bg-background hover:bg-muted"
                            }`}
                          >
                            Right →
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Button Link Type */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Link Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() =>
                            updateModuleContent(selectedModule.id, {
                              containerSettings: {
                                ...selectedModule.content.containerSettings,
                                button: {
                                  ...selectedModule.content.containerSettings?.button,
                                  enabled: true,
                                  linkType: "internal",
                                  link: "/",
                                  target: "_self",
                                  text: selectedModule.content.containerSettings?.button?.text || "View All",
                                  style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  position: selectedModule.content.containerSettings?.button?.position || "right",
                                },
                              },
                            })
                          }
                          className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                            (selectedModule.content.containerSettings?.button?.linkType === "internal" ||
                              (!selectedModule.content.containerSettings?.button?.linkType &&
                                selectedModule.content.containerSettings?.button?.link?.startsWith("/")))
                              ? "border-primary bg-primary text-white"
                              : "border-input bg-background hover:bg-muted"
                          }`}
                        >
                          <span>📄</span> Internal Page
                        </button>
                        <button
                          onClick={() =>
                            updateModuleContent(selectedModule.id, {
                              containerSettings: {
                                ...selectedModule.content.containerSettings,
                                button: {
                                  ...selectedModule.content.containerSettings?.button,
                                  enabled: true,
                                  linkType: "external",
                                  link: "https://",
                                  target: "_blank",
                                  text: selectedModule.content.containerSettings?.button?.text || "View All",
                                  style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  position: selectedModule.content.containerSettings?.button?.position || "right",
                                },
                              },
                            })
                          }
                          className={`h-9 px-3 rounded-md border text-xs flex items-center justify-center gap-2 transition ${
                            selectedModule.content.containerSettings?.button?.linkType === "external"
                              ? "border-primary bg-primary text-white"
                              : "border-input bg-background hover:bg-muted"
                          }`}
                        >
                          <span>🔗</span> External URL
                        </button>
                      </div>
                    </div>

                    {/* Button Link - Internal Page Selector */}
                    {(selectedModule.content.containerSettings?.button?.linkType === "internal" ||
                      (!selectedModule.content.containerSettings?.button?.linkType &&
                        selectedModule.content.containerSettings?.button?.link?.startsWith("/"))) && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">Select Page</Label>
                        <select
                          value={selectedModule.content.containerSettings?.button?.link || "/"}
                          onChange={(e) =>
                            updateModuleContent(selectedModule.id, {
                              containerSettings: {
                                ...selectedModule.content.containerSettings,
                                button: {
                                  ...selectedModule.content.containerSettings?.button,
                                  enabled: true,
                                  link: e.target.value,
                                  linkType: "internal",
                                  target: "_self",
                                  text: selectedModule.content.containerSettings?.button?.text || "View All",
                                  style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  position: selectedModule.content.containerSettings?.button?.position || "right",
                                },
                              },
                            })
                          }
                          className="w-full h-9 px-3 rounded-md border border-input bg-background text-sm"
                        >
                          <option value="/">Home</option>
                          {useWebsiteBuilderStore.getState().pages
                            .filter((p) => p.isEnabled)
                            .map((page) => (
                              <option key={page.id} value={`/${page.slug}`}>
                                {page.name} (/{page.slug})
                              </option>
                            ))}
                        </select>
                      </div>
                    )}

                    {/* Button Link - External URL Input */}
                    {selectedModule.content.containerSettings?.button?.linkType === "external" && (
                      <div className="space-y-2">
                        <Label className="text-xs text-gray-600">External URL</Label>
                        <Input
                          type="text"
                          value={selectedModule.content.containerSettings?.button?.link || ""}
                          onChange={(e) =>
                            updateModuleContent(selectedModule.id, {
                              containerSettings: {
                                ...selectedModule.content.containerSettings,
                                button: {
                                  ...selectedModule.content.containerSettings?.button,
                                  enabled: true,
                                  link: e.target.value,
                                  linkType: "external",
                                  text: selectedModule.content.containerSettings?.button?.text || "View All",
                                  style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  position: selectedModule.content.containerSettings?.button?.position || "right",
                                },
                              },
                            })
                          }
                          placeholder="https://example.com"
                          className="h-9"
                        />
                      </div>
                    )}

                    {/* Button Style */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Button Style</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {["primary", "secondary", "outline", "ghost"].map((style) => (
                          <button
                            key={style}
                            onClick={() =>
                              updateModuleContent(selectedModule.id, {
                                containerSettings: {
                                  ...selectedModule.content.containerSettings,
                                  button: {
                                    ...selectedModule.content.containerSettings?.button,
                                    enabled: true,
                                    style: style as any,
                                    text: selectedModule.content.containerSettings?.button?.text || "View All",
                                    position: selectedModule.content.containerSettings?.button?.position || "right",
                                  },
                                },
                              })
                            }
                            className={`h-9 px-3 rounded-md border text-xs capitalize transition ${
                              selectedModule.content.containerSettings?.button?.style === style
                                ? "border-primary bg-primary text-white"
                                : "border-input bg-background hover:bg-muted"
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Button Position */}
                    <div className="space-y-2">
                      <Label className="text-xs text-gray-600">Button Position</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {["left", "center", "right"].map((position) => (
                          <button
                            key={position}
                            onClick={() =>
                              updateModuleContent(selectedModule.id, {
                                containerSettings: {
                                  ...selectedModule.content.containerSettings,
                                  button: {
                                    ...selectedModule.content.containerSettings?.button,
                                    enabled: true,
                                    position: position as any,
                                    text: selectedModule.content.containerSettings?.button?.text || "View All",
                                    style: selectedModule.content.containerSettings?.button?.style || "primary",
                                  },
                                },
                              })
                            }
                            className={`h-9 px-3 rounded-md border text-xs capitalize transition ${
                              selectedModule.content.containerSettings?.button?.position === position
                                ? "border-primary bg-primary text-white"
                                : "border-input bg-background hover:bg-muted"
                            }`}
                          >
                            {position}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleSettings;
