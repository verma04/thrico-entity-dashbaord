import React from "react";
import {
  ModuleData,
  ModuleType,
  ThemeType,
  FontType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import {
  DeviceSelector,
  PreviewTopBar,
  PreviewContainer,
  EmptyState,
  ServiceRenderer,
} from "./preview";
import {
  NavbarModule,
  FooterModule,
  TestimonialsModule,
  JobsModule,
  MarketplaceModule,
  CommunitiesModule,
  CeoMessageModule,
} from "./modules";
import { AboutRenderer } from "./preview/about-renderer";
import { ContactRenderer } from "./preview/contact-renderer";
import { PrivacyPolicyRenderer } from "./preview/privacypolicy-renderer";
import { TeamMembersRenderer } from "./preview/team-members-renderer";
import { TermsRenderer } from "./preview/terms-renderer";
import { FaqRenderer } from "./preview/faq-renderer";
import { ContentSectionRenderer } from "./preview/content-section-renderer";
import { CtaBannerRenderer } from "./preview/cta-banner-renderer";
import { StatsRenderer } from "./preview/stats-renderer";
import { LogoCloudRenderer } from "./preview/logo-cloud-renderer";
import { TimelineRenderer } from "./preview/timeline-renderer";
import { ProcessStepsRenderer } from "./preview/process-steps-renderer";

import { EventsRenderer } from "./preview/events-renderer";
import { FeatureHighlightsRenderer } from "./preview/feature-highlights-renderer";
import { MediaGalleryRenderer } from "./preview/media-gallery-renderer";
import BlogRenderer from "./preview/blog-renderer";
// Core and Content Modules
import { PartnersModule } from "./modules/partners-module";
import { AchievementsModule } from "./modules/achievements-module";
import { VideoSpotlightModule } from "./modules/video-spotlight-module";

import { ResourcesModule } from "./modules/resources-module";
import { SocialProofModule } from "./modules/social-proof-module";

// Interactive Modules
import { CountdownBannerModule } from "./modules/countdown-banner-module";
import { ComparisonTableModule } from "./modules/comparison-table-module";
import { LocationMapModule } from "./modules/location-map-module";
import { EmbedBlockModule } from "./modules/embed-block-module";
import { HtmlModule } from "./modules/html-module";
import { CalloutModule } from "./modules/callout-module";

// Information Modules
import { AnnouncementModule } from "./modules/announcement-module";
import { AnnouncementBarModule } from "./modules/announcement-bar-module";
import { SitemapModule } from "./modules/sitemap-module";
import { GuidelinesModule } from "./modules/guidelines-module";

// Community Modules
import { MemberSpotlightModule } from "./modules/member-spotlight-module";
import { SuccessStoriesModule } from "./modules/success-stories-module";
import { LeaderboardModule } from "./modules/leaderboard-module";
import { ChaptersModule } from "./modules/chapters-module";
import { SocialFeedModule } from "./modules/social-feed-module";
import { PollsModule } from "./modules/polls-module";

// Event and Timeline Modules
import { EventCountdownModule } from "./modules/event-countdown-module";
import { MilestonesModule } from "./modules/milestones-module";
import { RoadmapModule } from "./modules/roadmap-module";

// Learning Modules
import { CoursesModule } from "./modules/courses-module";
import { ResearchModule } from "./modules/research-module";
import { PodcastModule } from "./modules/podcast-module";

// Business Modules
import { BenefitsModule } from "./modules/benefits-module";
import { CaseStudiesModule } from "./modules/case-studies-module";
import { DonationModule } from "./modules/donation-module";

// Layout Modules
import { HeroModule } from "./modules/hero-module";
import { WallOfFameModule } from "./modules/wall-of-fame-module";
import { MembersAroundWorldModule } from "./modules/members-around-world-module";
import { LatestMembersModule } from "./modules/latest-members-module";
import { PricingRenderer } from "./preview/pricing-renderer";
import { MilestonesRenderer } from "./preview/milestones-renderer";

// --- Enhanced Module Renderer Component ---

interface ModuleRendererProps {
  module: ModuleData;
  theme: ThemeType;
  previewDevice: "desktop" | "tablet" | "mobile";
  isSelected?: boolean;
  onSelect?: () => void;
}

const ModuleRenderer: React.FC<ModuleRendererProps> = ({
  module,
  theme,
  previewDevice,
  isSelected = false,
  onSelect,
}) => {
  const { type, layout, content } = module;

  // Memoize click handler for better performance
  const handleClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    },
    [onSelect]
  );

  // Module component mapping for better maintainability
  const moduleComponents: Record<ModuleType, React.ReactNode> = {
    // Layout Components
    hero: <HeroModule module={module} previewDevice={previewDevice} />,
    navbar: (
      <NavbarModule
        content={content}
        layout={layout}
        previewDevice={previewDevice}
      />
    ),
    footer: <FooterModule content={content} layout={layout} />,
    newsletter: <FooterModule content={content} layout={layout} />, // Newsletter is often part of footer or CTA

    // Content Components
    about: <AboutRenderer module={module} />,
    "mission-vision": <AboutRenderer module={module} />,
    jobs: <JobsModule module={module} previewDevice={previewDevice} />,
    testimonials: <TestimonialsModule content={content} layout={layout} />,
    blog: (
      <BlogRenderer
        content={content}
        layout={layout}
        theme={theme}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),

    "map-location": (
      <LocationMapModule module={module} previewDevice={previewDevice} />
    ),
    "contact-form": (
      <ContactRenderer module={module} previewDevice={previewDevice as any} />
    ),
    "contact-info": (
      <ContactRenderer module={module} previewDevice={previewDevice as any} />
    ),
    milestones: (
      <MilestonesRenderer module={module} previewDevice={previewDevice} />
    ),

    // Community Components
    communities: <CommunitiesModule content={content} layout={layout} />,
    "ceo-message": <CeoMessageModule content={content} layout={layout} />,
    "member-spotlight": (
      <MemberSpotlightModule module={module} previewDevice={previewDevice} />
    ),
    leaderboard: (
      <LeaderboardModule module={module} previewDevice={previewDevice} />
    ),
    chapters: <ChaptersModule module={module} previewDevice={previewDevice} />,
    polls: <PollsModule module={module} previewDevice={previewDevice} />,
    "social-feed": (
      <SocialFeedModule module={module} previewDevice={previewDevice} />
    ),

    // Business Components
    marketplace: <MarketplaceModule content={content} layout={layout} />,
    partners: <PartnersModule module={module} previewDevice={previewDevice} />,
    achievements: (
      <AchievementsModule module={module} previewDevice={previewDevice} />
    ),
    benefits: <BenefitsModule module={module} previewDevice={previewDevice} />,
    "case-studies": (
      <CaseStudiesModule module={module} previewDevice={previewDevice} />
    ),
    donation: <DonationModule module={module} previewDevice={previewDevice} />,

    // Content & Media Components
    "video-spotlight": (
      <VideoSpotlightModule module={module} previewDevice={previewDevice} />
    ),

    resources: (
      <ResourcesModule module={module} previewDevice={previewDevice} />
    ),
    podcast: <PodcastModule module={module} previewDevice={previewDevice} />,
    "social-proof": (
      <SocialProofModule module={module} previewDevice={previewDevice} />
    ),

    // Interactive Components
    "countdown-banner": (
      <CountdownBannerModule module={module} previewDevice={previewDevice} />
    ),
    "comparison-table": (
      <ComparisonTableModule module={module} previewDevice={previewDevice} />
    ),
    "location-map": (
      <LocationMapModule module={module} previewDevice={previewDevice} />
    ),
    "embed-block": (
      <EmbedBlockModule module={module} previewDevice={previewDevice} />
    ),
    html: <HtmlModule module={module} previewDevice={previewDevice} />,
    callout: <CalloutModule module={module} previewDevice={previewDevice} />,

    // Information Components
    announcement: (
      <AnnouncementModule module={module} previewDevice={previewDevice} />
    ),
    "announcement-bar": (
      <AnnouncementBarModule module={module} previewDevice={previewDevice} />
    ),
    sitemap: <SitemapModule module={module} previewDevice={previewDevice} />,
    guidelines: (
      <GuidelinesModule module={module} previewDevice={previewDevice} />
    ),

    // Success & Progress Components
    "success-stories": (
      <SuccessStoriesModule module={module} previewDevice={previewDevice} />
    ),
    "event-countdown": (
      <EventCountdownModule module={module} previewDevice={previewDevice} />
    ),
    roadmap: <RoadmapModule module={module} previewDevice={previewDevice} />,

    // Learning Components
    courses: <CoursesModule module={module} previewDevice={previewDevice} />,
    research: <ResearchModule module={module} previewDevice={previewDevice} />,

    // Legacy Preview Components (to be gradually replaced)
    contact: (
      <ContactRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "privacy-policy": (
      <PrivacyPolicyRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "team-members": (
      <TeamMembersRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "terms-conditions": (
      <TermsRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    faq: (
      <FaqRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "custom-content": (
      <ContentSectionRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "cta-banner": (
      <CtaBannerRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    stats: (
      <StatsRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "logo-cloud": (
      <LogoCloudRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "wall-of-fame": (
      <WallOfFameModule
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    services: (
      <ServiceRenderer
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    events: <EventsRenderer module={module} previewDevice={previewDevice} />,
    pricing: <PricingRenderer module={module} previewDevice={previewDevice} />,
    "process-steps": (
      <ProcessStepsRenderer module={module} previewDevice={previewDevice} />
    ),
    "media-gallery": (
      <MediaGalleryRenderer module={module} previewDevice={previewDevice} />
    ),
    "feature-highlights": (
      <FeatureHighlightsRenderer
        module={module}
        previewDevice={previewDevice}
      />
    ),
    "members-around-world": (
      <MembersAroundWorldModule
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    "latest-members": (
      <LatestMembersModule
        module={module}
        previewDevice={previewDevice as "desktop" | "tablet" | "mobile"}
      />
    ),
    timeline: (
      <TimelineRenderer module={module} previewDevice={previewDevice} />
    ),
    "results-dashboard": (
      <div className="p-12 bg-gray-100 border-2 border-dashed border-gray-300 text-center">
        <p className="text-gray-500">Results Dashboard - Coming Soon</p>
      </div>
    ),
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "w-full transition-all duration-300 relative group cursor-pointer",
        isSelected && "ring-2 ring-primary ring-offset-2"
      )}
    >
      {/* Hover overlay to hint at interactivity in builder */}
      <div
        className={cn(
          "absolute inset-0 border-2 border-transparent pointer-events-none z-10 transition-colors",
          !isSelected && "group-hover:border-primary/50"
        )}
      />

      {/* Render the appropriate module component */}
      {moduleComponents[type] || (
        <div className="p-12 bg-gray-100 border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500">
            Module type &ldquo;{type}&rdquo; not found
          </p>
        </div>
      )}
    </div>
  );
};

const LivePreview = () => {
  const {
    pages,
    currentPageId,
    currentTheme,
    previewDevice,
    setPreviewDevice,
    selectedModuleId,
    selectModule,
    globalHeader,
    globalFooter,
    font,
    zoomLevel,
    setZoomLevel,
  } = useWebsiteBuilderStore();

  // Get current page's modules (excluding old potential navbars/footers if data wasn't migrated)
  const currentPage = pages.find((p) => p.id === currentPageId);
  const pageModules = currentPage?.modules || [];

  // Filter out any per-page navbar/footer that might still exist in data, as we now use global ones
  // Also filter only enabled modules for the body
  const bodyModules = pageModules.filter(
    (m) => m.isEnabled && m.type !== "navbar" && m.type !== "footer"
  );

  // Font family mapping
  // Font family mapping
  const fontFamilyMap: Record<FontType, string> = {
    inter: "var(--font-inter), sans-serif",
    roboto: "var(--font-roboto), sans-serif",
    poppins: "var(--font-poppins), sans-serif",
    playfair: "var(--font-playfair), serif",
    montserrat: "var(--font-montserrat), sans-serif",
    lato: "var(--font-lato), sans-serif",
    "open-sans": "var(--font-open-sans), sans-serif",
    raleway: "var(--font-raleway), sans-serif",
    merriweather: "var(--font-merriweather), serif",
    nunito: "var(--font-nunito), sans-serif",
    "source-sans": "var(--font-source-sans-3), sans-serif",
    "work-sans": "var(--font-work-sans), sans-serif",
    ubuntu: "var(--font-ubuntu), sans-serif",
    lora: "var(--font-lora), serif",
    cormorant: "var(--font-cormorant-garamond), serif",
    bitter: "var(--font-bitter), serif",
    oswald: "var(--font-oswald), sans-serif",
    "bebas-neue": "var(--font-bebas-neue), sans-serif",
    cinzel: "var(--font-cinzel), serif",
    pacifico: "var(--font-pacifico), cursive",
    "fira-code": "var(--font-fira-code), monospace",
    "sans-serif": "sans-serif",
    verdana: "Verdana, Geneva, sans-serif",
    georgia: "Georgia, 'Times New Roman', serif",
    "comic-sans": "'Comic Sans MS', 'Comic Sans', cursive",
    "arial-narrow": "'Arial Narrow', Arial, sans-serif",
    impact: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
  };

  const handleWheel = React.useCallback(
    (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -5 : 5;
        setZoomLevel(Math.min(Math.max(25, zoomLevel + delta), 200));
      }
    },
    [zoomLevel, setZoomLevel]
  );

  return (
    <div
      className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 relative transition-colors overflow-hidden"
      onWheel={handleWheel}
    >
      {/* Simulation Bar */}
      <PreviewTopBar currentTheme={currentTheme}>
        <div className="flex items-center gap-4">
          <DeviceSelector
            previewDevice={previewDevice}
            setPreviewDevice={setPreviewDevice}
          />
          <div className="h-4 w-px bg-border/50" />
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-md border">
            <button
              onClick={() => setZoomLevel(Math.max(25, zoomLevel - 10))}
              className="p-1 hover:bg-background rounded text-muted-foreground transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <span className="text-[10px] w-10 text-center font-medium">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(200, zoomLevel + 10))}
              className="p-1 hover:bg-background rounded text-muted-foreground transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setZoomLevel(100)}
              className="p-1 hover:bg-background rounded text-muted-foreground transition-colors ml-1"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </PreviewTopBar>

      {/* Preview Container */}
      <PreviewContainer
        previewDevice={previewDevice}
        fontFamily={fontFamilyMap[font]}
        zoomLevel={zoomLevel}
        className=""
      >
        {/* 1. Global Header */}
        {globalHeader.isEnabled && (
          <ModuleRenderer
            key="global-header"
            module={{
              ...globalHeader,
              type: "navbar",
            }}
            theme={currentTheme}
            previewDevice={previewDevice}
            isSelected={selectedModuleId === globalHeader.id}
            onSelect={() => selectModule(globalHeader.id)}
          />
        )}

        {/* 2. Page Body Modules */}
        {bodyModules.map((module) => (
          <ModuleRenderer
            key={module.id}
            module={module}
            theme={currentTheme}
            previewDevice={previewDevice}
            isSelected={selectedModuleId === module.id}
            onSelect={() => selectModule(module.id)}
          />
        ))}

        {/* 3. Global Footer */}
        {globalFooter.isEnabled && (
          <ModuleRenderer
            key="global-footer"
            module={{
              ...globalFooter,
              type: "footer",
            }}
            theme={currentTheme}
            previewDevice={previewDevice}
            isSelected={selectedModuleId === globalFooter.id}
            onSelect={() => selectModule(globalFooter.id)}
          />
        )}

        {/* Empty State */}
        {bodyModules.length === 0 &&
          !globalHeader.isEnabled &&
          !globalFooter.isEnabled && <EmptyState />}
      </PreviewContainer>
    </div>
  );
};

export default LivePreview;
