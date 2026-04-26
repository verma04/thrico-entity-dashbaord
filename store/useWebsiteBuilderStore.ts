import { create } from "zustand";

// --- Types ---

export type ThemeType =
  | "academia"
  | "enterprise"
  | "creator"
  | "association"
  | "startup"
  | "dark-mode";

export type FontType =
  | "inter"
  | "roboto"
  | "poppins"
  | "playfair"
  | "montserrat"
  | "lato"
  | "open-sans"
  | "raleway"
  | "merriweather"
  | "nunito"
  | "sans-serif"
  | "verdana"
  | "georgia"
  | "comic-sans"
  | "arial-narrow"
  | "impact"
  | "fira-code"
  | "source-sans"
  | "work-sans"
  | "ubuntu"
  | "lora"
  | "cormorant"
  | "bitter"
  | "oswald"
  | "bebas-neue"
  | "cinzel"
  | "pacifico";

export type LayoutType =
  | "carousel"
  | "split"
  | "single-image"
  | "text"
  | "creator-showcase"
  | "full-image"
  | "video"
  | "gradient"
  | "saas-modern"
  | "bento-grid"
  | "dark-cinematic"
  | "newsletter-focus"
  | "app-showcase" // Hero
  | "globe-interactive"
  | "simple"
  | "centered"
  | "minimal"
  | "stacked"
  | "split" // Navbar & generic
  | "grid"
  | "list"
  | "cards"
  | "masonry" // Communities
  | "columns"
  | "corporate"
  | "newsletter" // Footer specific
  | "classic-card"
  | "split-screen"
  | "centered"
  | "testimonial"
  | "modern-asymmetric" // CEO Message
  | "grid-cards"
  | "carousel"
  | "marquee"
  | "featured-large"
  | "masonry-wall"
  | "minimal-list"
  | "video-testimonials"
  | "quote-wall"
  | "social-proof-stats" // Testimonials
  | "story-vision"
  | "mission-values"
  | "founder-message"
  | "impact-growth"
  | "simple-overview" // About
  | "simple-contact"
  | "support-focused"
  | "sales-inquiry"
  | "community-reach"
  | "location-office" // Contact
  | "simple-privacy"
  | "legal-document"
  | "tabbed-policy" // Privacy Policy
  | "grid-profiles"
  | "carousel-leaders"
  | "minimal-list" // Team
  | "marquee-3d"
  | "marquee-horizontal"
  | "simple-terms"
  | "structured-agreement"
  | "faq-style" // Terms & Conditions
  | "simple-accordion"
  | "grid-cards"
  | "highlight-feature" // FAQ
  | "details-list"
  | "alternating-grid"
  | "cards-grid"
  | "feature-showcase"
  | "text-focused" // Custom Content
  | "centered-banner"
  | "split-cta"
  | "full-width-highlight"
  | "minimal-cta"
  | "urgency-cta" // CTA Banner
  | "stats-row"
  | "grid-metrics"
  | "icon-stats"
  | "highlight-metric"
  | "timeline-stats" // Stats & Metrics
  | "logo-grid"
  | "logo-carousel"
  | "monochrome-logos"
  | "featured-logos"
  | "minimal-strip"
  | "logo-marquee" // Logo Showcase
  | "event-cards"
  | "timeline-events"
  | "calendar-view"
  | "featured-event"
  | "compact-list"
  | "card-events"
  | "list-events"
  | "calendar-events" // Events
  | "pricing-cards"
  | "comparison-table"
  | "toggle-pricing"
  | "featured-tier"
  | "minimal-pricing"
  | "cards-pricing"
  | "table-pricing"
  | "simple-pricing" // Pricing
  | "step-timeline"
  | "numbered-cards"
  | "icon-steps"
  | "vertical-process"
  | "animated-flow"
  | "horizontal-steps"
  | "vertical-steps"
  | "card-steps" // Process Steps
  | "masonry-gallery"
  | "grid-gallery"
  | "carousel-gallery"
  | "lightbox-grid"
  | "video-showcase"
  | "lightbox-gallery" // Media Gallery
  | "icon-list"
  | "cards-features"
  | "split-features"
  | "tabs-features"
  | "minimal-features"
  | "grid-highlights"
  | "list-highlights"
  | "cards-highlights"
  | "icon-highlights" // Feature Highlights
  | "inline-form"
  | "centered-form"
  | "sidebar-form"
  | "minimal-newsletter"
  | "hero-newsletter" // Newsletter
  | "vertical-timeline"
  | "horizontal-timeline"
  | "milestone-cards"
  | "story-timeline"
  | "compact-timeline"
  | "card-timeline"
  | "zigzag-timeline"
  | "minimal-timeline" // Timeline
  | "encyclopedia-article"
  | "documentation-page"
  | "knowledge-hub"
  | "article"
  | "interview-qa"
  | "guide-tutorial"
  | "featured-story"
  | "standard-article" // Blog
  | "logo-row"
  | "badge-grid"
  | "centered-video"
  | "resource-cards"
  | "inline-proof"
  | "centered-countdown"
  | "table-grid"
  | "map-fullwidth"
  | "card-map"
  | "full-width-map"
  | "minimal-map"
  | "split-map"
  | "fullwidth-embed"
  | "top-strip"
  | "link-columns"
  | "grouped-sections"
  | "footer-style"
  | "accordion-sections"
  | "tree-view" // Sitemap layouts
  | "spotlight-cards"
  | "story-cards"
  | "timer-large"
  | "milestone-track"
  | "rank-list"
  | "simple-list"
  | "location-grid"
  | "course-cards"
  | "research-list"
  | "benefit-icons"
  | "horizontal-roadmap"
  | "case-grid"
  | "success-stories"
  | "detailed-case"
  | "industry-focus"
  | "impact-metrics"
  | "info-box"
  | "episode-list"
  | "poll-card"
  | "feed-grid"
  | "donation-simple" // Additional module layouts
  | "logo-grid"
  | "logo-carousel"
  | "award-wall"
  | "timeline-awards"
  | "carousel-badges"
  | "video-gallery"
  | "playlist-view"
  | "hero-video"
  | "download-list"
  | "category-tabs"
  | "search-library"
  | "featured-member"
  | "member-carousel"
  | "grid-profiles"
  | "testimonial-wall"
  | "story-timeline"
  | "course-grid"
  | "course-list"
  | "learning-path"
  | "podium-view"
  | "stats-board"
  | "card-rankings" // Layout variants
  | "numbered-rules"
  | "accordion-rules"
  | "card-guidelines"
  | "map-view"
  | "list-chapters"
  | "region-cards"
  | "paper-grid"
  | "timeline-research"
  | "feature-grid"
  | "comparison-list"
  | "highlight-cards"
  | "detailed-stats"
  | "testimonials-strip"
  | "logo-wall"
  | "vertical-timeline"
  | "milestone-grid"
  | "progress-steps"
  | "detailed-cards"
  | "featured-case"
  | "banner-style"
  | "card-callout"
  | "sidebar-note"
  | "player-cards"
  | "season-grid"
  | "featured-episode"
  | "live-voting"
  | "results-chart"
  | "poll-grid"
  | "timeline-feed"
  | "masonry-posts"
  | "platform-tabs"
  | "goal-progress"
  | "impact-showcase"
  | "supporter-wall" // Additional layout variants
  | "list-view"
  | "compact-grid"
  | "timeline" // Latest Members layouts
  | "world-map-heatmap"
  | "country-stats-grid"
  | "interactive-globe"
  | "regional-cards"
  | "pin-drop-map"
  | "member-density-chart"
  | "top-countries-leaderboard"
  | "continents-breakdown"
  | "minimal-stats-row"
  | "photo-mosaic-region" // Members Around World layouts
  | "map-pins"
  | "country-cards"
  | "stats-grid"
  | "list-flags"
  | "podium"
  | "hall-grid"
  | "featured-research"
  | "publication-list"
  | "research-grid"
  | "featured-cards" // Wall of Fame layouts
  | "info-message"
  | "warning-alert"
  | "success-message"
  | "error-alert"
  | "promotion-banner"
  | "maintenance-notice"
  | "dismissible-bar"
  | "countdown-alert"
  | "link-notification" // Announcement Bar layouts
  | "video-player"
  | "video-dialog" // Video layouts
  | "hero-video-dialog"
  | "footer"
  | "default";

export type ModuleType =
  | "navbar"
  | "hero"
  | "ceo-message"
  | "results-dashboard"
  | "communities"
  | "marketplace"
  | "jobs"
  | "testimonials"
  | "about"
  | "contact"
  | "privacy-policy"
  | "terms-conditions"
  | "faq"
  | "custom-content"
  | "contact-form"
  | "contact-info"
  | "map-location"
  | "team-members"
  | "services"
  | "cta-banner"
  | "stats"
  | "logo-cloud"
  | "events"
  | "pricing"
  | "process-steps"
  | "media-gallery"
  | "feature-highlights"
  | "newsletter"
  | "timeline"
  | "mission-vision"
  | "blog"
  | "partners"
  | "achievements"
  | "video-spotlight"
  | "resources"
  | "social-proof"
  | "countdown-banner"
  | "comparison-table"
  | "location-map"
  | "embed-block"
  | "announcement"
  | "sitemap"
  | "member-spotlight"
  | "success-stories"
  | "event-countdown"
  | "milestones"
  | "leaderboard"
  | "guidelines"
  | "chapters"
  | "courses"
  | "research"
  | "benefits"
  | "roadmap"
  | "case-studies"
  | "callout"
  | "podcast"
  | "polls"
  | "social-feed"
  | "donation"
  | "latest-members"
  | "members-around-world"
  | "wall-of-fame"
  | "announcement-bar"
  | "video"
  | "footer";

export interface MenuItem {
  id: string;
  label: string;
  link?: string;
  icon?: string; // Lucide icon name
  target?: "_self" | "_blank"; // Internal vs External
  children?: MenuItem[];
}

export interface ModuleData {
  id: string;
  type: ModuleType;
  name: string;
  isEnabled: boolean;
  layout: LayoutType;
  content: Record<string, any>; // Flexible content, but specific types like { menuItems: MenuItem[] } for navbar
  isCustomized: boolean; // True if user manually changed layout
  visibility: "public" | "members" | "admin";
  order?: number; // Explicit order order for modules
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  modules: ModuleData[];
  isEnabled: boolean;
  includeInSitemap: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string;
    ogImage?: string;
    schemaMarkup?: string;
  };
}

export interface SiteSettings {
  googleAnalyticsId: string;
  favicon: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    github: string;
    instagram: string;
  };
}

export interface CustomThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  muted?: string;
  border?: string;
  buttonColor?: string;
  buttonTextColor?: string;
  // Additional customization
  borderRadius?: number; // 0-20px
  spacing?: number; // 0.5-2 (multiplier)
  fontSize?: number; // 12-20px base size
}

export interface WebsiteBuilderState {
  theme: ThemeType;
  font: FontType;
  customColors: CustomThemeColors;
  pages: Page[];
  siteSettings: SiteSettings;
  currentPageId: string | null;
  selectedModuleId: string | null;
  previewDevice: "desktop" | "tablet" | "mobile";
  zoomLevel: number;

  // Global Modules
  globalHeader: ModuleData;
  globalFooter: ModuleData;

  // Computed properties
  get currentTheme(): ThemeType;

  // Actions
  setTheme: (theme: ThemeType) => void;
  setFont: (font: FontType) => void;
  setCustomColor: (colorKey: keyof CustomThemeColors, value: string) => void;
  setCustomColors: (colors: CustomThemeColors) => void;
  resetCustomColors: () => void;
  setCurrentPage: (pageId: string) => void;
  toggleModule: (id: string) => void;
  reorderModules: (startIndex: number, endIndex: number) => void;
  selectModule: (id: string | null) => void;
  updateModuleLayout: (id: string, layout: LayoutType) => void;
  updateModuleContent: (id: string, content: Record<string, any>) => void;
  updateModuleName: (id: string, name: string) => void;
  updateModuleVisibility: (
    id: string,
    visibility: "public" | "members" | "admin"
  ) => void;
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setZoomLevel: (zoom: number) => void;
  setModules: (modules: ModuleData[]) => void;
  addModuleToPage: (pageId: string, module: ModuleData) => void;
  deleteModule: (moduleId: string) => void;
  // Page Management
  addPage: (name: string, slug: string) => void;
  deletePage: (id: string) => void;
  updatePageSeo: (id: string, seo: Partial<Page["seo"]>) => void;
  togglePageStatus: (id: string) => void;
  togglePageSitemap: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  initializeWebsiteData: (websiteData: any) => void;
}

// --- Defaults ---

const DEFAULT_MENU: MenuItem[] = [
  { id: "1", label: "Home", link: "/" },
  {
    id: "2",
    label: "About",
    link: "/about",
    children: [
      { id: "2-1", label: "Our Story", link: "/story" },
      { id: "2-2", label: "Team", link: "/team" },
    ],
  },
  { id: "3", label: "Services", link: "/services" },
  { id: "4", label: "Contact", link: "/contact" },
];

const DEFAULT_MODULES: ModuleData[] = [
  {
    id: "hero-1",
    type: "hero",
    name: "Hero Section",
    isEnabled: true,
    layout: "carousel",
    content: {
      title: "Build Your Community",
      description: "The all-in-one platform for creators and brands.",
      videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
      slides: [
        {
          title: "Welcome to Thrico",
          subtitle: "The best place to build",
          image:
            "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
          ctaText: "Get Started",
          ctaLink: "/signup",
        },
        {
          title: "Grow Together",
          subtitle: "Connect with like-minded people",
          image:
            "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
          ctaText: "Join Now",
          ctaLink: "/community",
        },
        {
          title: "Monetize Content",
          subtitle: "Turn your passion into profit",
          image:
            "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
          ctaText: "Learn More",
          ctaLink: "/monetize",
        },
      ],
      features: ["Community", "Courses", "Events"],
    },
    isCustomized: false,
    visibility: "public",
    order: 0,
  },
  {
    id: "ceo-1",
    type: "ceo-message",
    name: "CEO Message",
    isEnabled: true,
    layout: "default",
    content: { message: "Hello" },
    isCustomized: false,
    visibility: "public",
    order: 1,
  },
  {
    id: "comm-1",
    type: "communities",
    name: "Communities",
    isEnabled: true,
    layout: "grid",
    content: {},
    isCustomized: false,
    visibility: "public",
    order: 2,
  },
  {
    id: "market-1",
    type: "marketplace",
    name: "Marketplace",
    isEnabled: true,
    layout: "grid",
    content: {},
    isCustomized: false,
    visibility: "public",
    order: 3,
  },
  {
    id: "jobs-1",
    type: "jobs",
    name: "Jobs",
    isEnabled: true,
    layout: "list",
    content: {},
    isCustomized: false,
    visibility: "public",
    order: 4,
  },
  {
    id: "test-1",
    type: "testimonials",
    name: "Testimonials",
    isEnabled: true,
    layout: "carousel",
    content: {},
    isCustomized: false,
    visibility: "public",
    order: 5,
  },
];

const THEME_DEFAULTS: Record<ThemeType, Record<ModuleType, LayoutType>> = {
  academia: {
    navbar: "centered",
    hero: "carousel",
    communities: "grid",
    "ceo-message": "classic-card",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "story-vision",
    contact: "simple-contact",
    "contact-form": "simple-contact",
    "contact-info": "simple-contact",
    "map-location": "map-fullwidth",
    "team-members": "grid-profiles",
    services: "grid",
    "cta-banner": "centered-banner",
    stats: "stats-row",
    "logo-cloud": "logo-grid",
    events: "card-events",
    pricing: "cards-pricing",
    "process-steps": "horizontal-steps",
    "media-gallery": "grid-gallery",
    "feature-highlights": "grid-highlights",
    newsletter: "inline-form",
    timeline: "vertical-timeline",
    "mission-vision": "story-vision",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "simple-accordion",
    "custom-content": "details-list",
    blog: "encyclopedia-article",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "grid-cards",
    "members-around-world": "country-stats-grid",
    "wall-of-fame": "podium",
    "announcement-bar": "info-message",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
  enterprise: {
    navbar: "simple",
    hero: "single-image",
    communities: "list",
    "ceo-message": "classic-card",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "mission-values",
    contact: "support-focused",
    "contact-form": "support-focused",
    "contact-info": "support-focused",
    "map-location": "map-fullwidth",
    "team-members": "minimal-list",
    services: "list",
    "cta-banner": "split-cta",
    stats: "grid-metrics",
    "logo-cloud": "logo-grid",
    events: "list-events",
    pricing: "table-pricing",
    "process-steps": "vertical-steps",
    "media-gallery": "grid-gallery",
    "feature-highlights": "list-highlights",
    newsletter: "centered-form",
    timeline: "horizontal-timeline",
    "mission-vision": "mission-values",
    "privacy-policy": "legal-document",
    "terms-conditions": "structured-agreement",
    faq: "simple-accordion",
    "custom-content": "details-list",
    blog: "documentation-page",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "list-view",
    "members-around-world": "pin-drop-map",
    "wall-of-fame": "hall-grid",
    "announcement-bar": "warning-alert",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
  creator: {
    navbar: "minimal",
    hero: "creator-showcase",
    communities: "masonry",
    "ceo-message": "centered",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "founder-message",
    contact: "simple-contact",
    "contact-form": "simple-contact",
    "contact-info": "simple-contact",
    "map-location": "map-fullwidth",
    "team-members": "grid-profiles",
    services: "cards",
    "cta-banner": "minimal-cta",
    stats: "icon-stats",
    "logo-cloud": "logo-carousel",
    events: "timeline-events",
    pricing: "cards-pricing",
    "process-steps": "card-steps",
    "media-gallery": "masonry-gallery",
    "feature-highlights": "cards-highlights",
    newsletter: "minimal-newsletter",
    timeline: "card-timeline",
    "mission-vision": "founder-message",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "grid-cards",
    "custom-content": "cards-grid",
    blog: "featured-story",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "compact-grid",
    "members-around-world": "member-density-chart",
    "wall-of-fame": "timeline",
    "announcement-bar": "promotion-banner",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
  association: {
    navbar: "stacked",
    hero: "carousel",
    communities: "cards",
    "ceo-message": "testimonial",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "impact-growth",
    contact: "community-reach",
    "contact-form": "community-reach",
    "contact-info": "community-reach",
    "map-location": "map-fullwidth",
    "team-members": "carousel-leaders",
    services: "grid",
    "cta-banner": "full-width-highlight",
    stats: "highlight-metric",
    "logo-cloud": "logo-grid",
    events: "calendar-events",
    pricing: "cards-pricing",
    "process-steps": "horizontal-steps",
    "media-gallery": "carousel-gallery",
    "feature-highlights": "icon-highlights",
    newsletter: "hero-newsletter",
    timeline: "vertical-timeline",
    "mission-vision": "impact-growth",
    "privacy-policy": "tabbed-policy",
    "terms-conditions": "faq-style",
    faq: "highlight-feature",
    "custom-content": "alternating-grid",
    blog: "knowledge-hub",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "timeline",
    "members-around-world": "top-countries-leaderboard",
    "wall-of-fame": "featured-cards",
    "announcement-bar": "success-message",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
  startup: {
    navbar: "split",
    hero: "saas-modern",
    communities: "grid",
    "ceo-message": "modern-asymmetric",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "simple-overview",
    contact: "sales-inquiry",
    "contact-form": "sales-inquiry",
    "contact-info": "sales-inquiry",
    "map-location": "map-fullwidth",
    "team-members": "grid-profiles",
    services: "cards",
    "cta-banner": "urgency-cta",
    stats: "timeline-stats",
    "logo-cloud": "logo-marquee",
    events: "card-events",
    pricing: "toggle-pricing",
    "process-steps": "icon-steps",
    "media-gallery": "lightbox-gallery",
    "feature-highlights": "grid-highlights",
    newsletter: "sidebar-form",
    timeline: "minimal-timeline",
    "mission-vision": "simple-overview",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "grid-cards",
    "custom-content": "feature-showcase",
    blog: "guide-tutorial",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "grid-cards",
    "members-around-world": "country-stats-grid",
    "wall-of-fame": "podium",
    "announcement-bar": "countdown-alert",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
  "dark-mode": {
    navbar: "minimal",
    hero: "dark-cinematic",
    communities: "masonry",
    "ceo-message": "split-screen",
    marketplace: "grid",
    jobs: "list",
    testimonials: "carousel",
    about: "founder-message",
    contact: "simple-contact",
    "contact-form": "simple-contact",
    "contact-info": "simple-contact",
    "map-location": "map-fullwidth",
    "team-members": "grid-profiles",
    services: "masonry",
    "cta-banner": "centered-banner",
    stats: "stats-row",
    "logo-cloud": "monochrome-logos",
    events: "card-events",
    pricing: "simple-pricing",
    "process-steps": "horizontal-steps",
    "media-gallery": "grid-gallery",
    "feature-highlights": "grid-highlights",
    newsletter: "inline-form",
    timeline: "zigzag-timeline",
    "mission-vision": "founder-message",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "simple-accordion",
    "custom-content": "details-list",
    blog: "article",
    partners: "logo-row",
    achievements: "badge-grid",
    "video-spotlight": "centered-video",
    resources: "resource-cards",
    "social-proof": "inline-proof",
    "countdown-banner": "centered-countdown",
    "comparison-table": "table-grid",
    "location-map": "map-fullwidth",
    "embed-block": "fullwidth-embed",
    announcement: "top-strip",
    sitemap: "link-columns",
    "member-spotlight": "spotlight-cards",
    "success-stories": "story-cards",
    "event-countdown": "timer-large",
    milestones: "milestone-track",
    leaderboard: "rank-list",
    guidelines: "simple-list",
    chapters: "location-grid",
    courses: "course-cards",
    research: "research-list",
    benefits: "benefit-icons",
    roadmap: "horizontal-roadmap",
    "case-studies": "case-grid",
    callout: "info-box",
    podcast: "episode-list",
    polls: "poll-card",
    "social-feed": "feed-grid",
    donation: "donation-simple",
    "latest-members": "list-view",
    "members-around-world": "pin-drop-map",
    "wall-of-fame": "hall-grid",
    "announcement-bar": "dismissible-bar",
    "results-dashboard": "default",
    video: "video-player",
    footer: "columns",
  },
};

// --- Store ---

const DEFAULT_PAGES: Page[] = [
  {
    id: "home",
    name: "Home",
    slug: "home",
    modules: DEFAULT_MODULES,
    isEnabled: true,
    includeInSitemap: true,
  },
  {
    id: "about",
    name: "About Us",
    slug: "about",
    modules: [
      {
        id: "about-1",
        type: "about",
        name: "About",
        isEnabled: true,
        layout: "story-vision",
        content: {},
        isCustomized: false,
        visibility: "public",
        order: 0,
      },
    ],

    isEnabled: true,
    includeInSitemap: true,
    seo: {
      title: "About Us - My Website",
      description: "Learn more about our company.",
      keywords: "about, company, team",
    },
  },
  {
    id: "contact",
    name: "Contact",
    slug: "contact",
    modules: [
      {
        id: "contact-1",
        type: "contact",
        name: "Contact",
        isEnabled: true,
        layout: "simple-contact",
        content: {
          title: "Get in Touch",
          subtitle: "We'd love to hear from you",
          email: "hello@example.com",
          phone: "+1 (555) 123-4567",
        },
        isCustomized: false,
        visibility: "public",
        order: 0,
      },
    ],
    isEnabled: true,
    includeInSitemap: true,
    seo: {
      title: "Contact Us - My Website",
      description: "Get in touch with us.",
      keywords: "contact, email, phone",
    },
  },
  {
    id: "privacy",
    name: "Privacy Policy",
    slug: "privacy",
    modules: [
      {
        id: "privacy-1",
        type: "privacy-policy",
        name: "Privacy Policy",
        isEnabled: true,
        layout: "simple-privacy",
        content: {
          title: "Privacy Policy",
          lastUpdated: "January 1, 2024",
          sections: [
            {
              title: "1. Introduction",
              content:
                "Welcome to our Privacy Policy. Your privacy is critically important to us.",
            },
            {
              title: "2. Data Collection",
              content:
                "We collect information to provide better services to all our users.",
            },
            {
              title: "3. Use of Information",
              content:
                "We use the information we collect to operate and maintain our services.",
            },
            {
              title: "4. Information Sharing",
              content:
                "We do not share your personal information with companies, organizations, or individuals outside of our company.",
            },
          ],
        },
        isCustomized: false,
        visibility: "public",
        order: 0,
      },
    ],

    isEnabled: true,
    includeInSitemap: true,
    seo: {
      title: "Privacy Policy",
      description: "Our privacy commitments.",
      keywords: "privacy, policy",
    },
  },
  {
    id: "terms",
    name: "Terms & Conditions",
    slug: "terms",
    modules: [],
    isEnabled: true,
    includeInSitemap: true,
    seo: {
      title: "Terms & Conditions",
      description: "Usage terms.",
      keywords: "terms, conditions",
    },
  },
  {
    id: "team",
    name: "Our Team",
    slug: "team",
    isEnabled: true,
    includeInSitemap: true,
    modules: [
      {
        id: "team-1",
        type: "team-members",
        name: "Team Members",
        isEnabled: true,
        layout: "grid-profiles",
        content: {
          title: "Meet Our Team",
          subtitle: "The people behind the mission.",
          members: [
            {
              name: "Sarah Johnson",
              role: "CEO & Founder",
              bio: "Visionary leader with 15+ years exp.",
              image:
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
              social: { twitter: "#", linkedin: "#" },
            },
            {
              name: "Michael Chen",
              role: "Head of Product",
              bio: "Product strategist and design thinker.",
              image:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
              social: { twitter: "#", github: "#" },
            },
            {
              name: "Jessica Williams",
              role: "Lead Engineer",
              bio: "Full-stack wizard loves clean code.",
              image:
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80",
              social: { github: "#", linkedin: "#" },
            },
            {
              name: "David Kim",
              role: "Marketing Director",
              bio: "Growth hacker and storyteller.",
              image:
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
              social: { twitter: "#", linkedin: "#" },
            },
          ],
        },
        isCustomized: false,
        visibility: "public",
        order: 0,
      },
    ],
  },
  {
    id: "faq",
    name: "FAQ",
    slug: "faq",
    modules: [
      {
        id: "faq-1",
        type: "faq",
        name: "FAQ",
        isEnabled: true,
        layout: "simple-accordion",
        content: {
          title: "Frequently Asked Questions",
          subtitle: "Common questions about our services.",
          questions: [
            {
              question: "How do I get started?",
              answer: "Sign up for an account and follow the onboarding guide.",
            },
            {
              question: "What payment methods do you accept?",
              answer: "We accept all major credit cards and PayPal.",
            },
            {
              question: "Can I cancel anytime?",
              answer:
                "Yes, you can cancel your subscription at any time from your account settings.",
            },
          ],
        },
        isCustomized: false,
        visibility: "public",
      },
    ],
    isEnabled: true,
    includeInSitemap: true,
    seo: {
      title: "FAQ",
      description: "Frequently Asked Questions.",
      keywords: "faq, help, questions",
    },
  },
];

export const useWebsiteBuilderStore = create<WebsiteBuilderState>()(
  (set, get) => ({
    theme: "academia",
    font: "inter",
    customColors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#10B981",
      background: "#FFFFFF",
      muted: "#F3F4F6",
      border: "#E5E7EB",
      borderRadius: 10,
      spacing: 1,
      fontSize: 16,
    },
    pages: [],
    siteSettings: {
      googleAnalyticsId: "",
      favicon: "",
      socialLinks: { twitter: "", linkedin: "", github: "", instagram: "" },
    },
    // Initialize Global Modules with minimal defaults
    globalFooter: {
      id: "footer",
      type: "footer",
      name: "Footer",
      isEnabled: true,
      layout: "columns",
      content: {},
      isCustomized: false,
      visibility: "public",
    },
    globalHeader: {
      id: "navbar",
      type: "navbar",
      name: "Navbar",
      isEnabled: true,
      layout: "split",
      content: {
        menuItems: [],
        logoText: "",
        logoType: "text",
      },
      isCustomized: false,
      visibility: "public",
    },

    currentPageId: null,
    selectedModuleId: null,
    previewDevice: "desktop",
    zoomLevel: 100,

    // Computed properties
    get currentTheme() {
      return get().theme;
    },

    setTheme: (theme) =>
      set((state) => {
        // Update layouts for non-customized modules across all pages
        const newPages = state.pages.map((page) => ({
          ...page,
          modules: page.modules.map((mod) => {
            if (mod.isCustomized) return mod;
            const defaultLayout = THEME_DEFAULTS[theme][mod.type];
            return { ...mod, layout: defaultLayout || "default" };
          }),
        }));

        // Update Global Modules
        const newHeader = state.globalHeader.isCustomized
          ? state.globalHeader
          : {
              ...state.globalHeader,
              layout: THEME_DEFAULTS[theme].navbar || "simple",
            };

        const newFooter = state.globalFooter.isCustomized
          ? state.globalFooter
          : {
              ...state.globalFooter,
              layout: THEME_DEFAULTS[theme].footer || "default",
            };

        return {
          theme,
          pages: newPages,
          globalHeader: newHeader,
          globalFooter: newFooter,
        };
      }),

    setFont: (font) =>
      set(() => ({
        font,
      })),

    setCustomColor: (colorKey, value) =>
      set((state) => ({
        customColors: {
          ...state.customColors,
          [colorKey]: value,
        },
      })),

    setCustomColors: (colors) =>
      set(() => ({
        customColors: colors,
      })),

    resetCustomColors: () =>
      set(() => ({
        customColors: {},
      })),

    setCurrentPage: (pageId) => set({ currentPageId: pageId }),

    toggleModule: (id) =>
      set((state) => {
        // Check Globals
        if (state.globalHeader.id === id) {
          return {
            globalHeader: {
              ...state.globalHeader,
              isEnabled: !state.globalHeader.isEnabled,
            },
          };
        }
        if (state.globalFooter.id === id) {
          return {
            globalFooter: {
              ...state.globalFooter,
              isEnabled: !state.globalFooter.isEnabled,
            },
          };
        }

        // Check Pages
        return {
          pages: state.pages.map((page) =>
            page.id === state.currentPageId
              ? {
                  ...page,
                  modules: page.modules.map((m) =>
                    m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
                  ),
                }
              : page
          ),
        };
      }),

    reorderModules: (startIndex, endIndex) =>
      set((state) => {
        const newPages = state.pages.map((page) => {
          if (page.id !== state.currentPageId) return page;

          const result = Array.from(page.modules);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { ...page, modules: result };
        });

        return { pages: newPages };
      }),

    selectModule: (id) => set({ selectedModuleId: id }),

    updateModuleLayout: (id, layout) =>
      set((state) => {
        if (state.globalHeader.id === id) {
          return {
            globalHeader: {
              ...state.globalHeader,
              layout,
              isCustomized: true,
            },
          };
        }
        if (state.globalFooter.id === id) {
          return {
            globalFooter: {
              ...state.globalFooter,
              layout,
              isCustomized: true,
            },
          };
        }

        return {
          pages: state.pages.map((page) =>
            page.id === state.currentPageId
              ? {
                  ...page,
                  modules: page.modules.map((m) =>
                    m.id === id ? { ...m, layout, isCustomized: true } : m
                  ),
                }
              : page
          ),
        };
      }),

    updateModuleName: (id, name) => {
      set((state) => {
        // Update global header
        if (state.globalHeader.id === id) {
          return { globalHeader: { ...state.globalHeader, name } };
        }

        // Update global footer
        if (state.globalFooter.id === id) {
          return { globalFooter: { ...state.globalFooter, name } };
        }

        // Update in pages
        return {
          pages: state.pages.map((page) => ({
            ...page,
            modules: page.modules.map((module) =>
              module.id === id ? { ...module, name } : module
            ),
          })),
        };
      });
    },

    updateModuleContent: (id, content) =>
      set((state) => {
        if (state.globalHeader.id === id) {
          return {
            globalHeader: {
              ...state.globalHeader,
              content: { ...state.globalHeader.content, ...content },
            },
          };
        }
        if (state.globalFooter.id === id) {
          return {
            globalFooter: {
              ...state.globalFooter,
              content: { ...state.globalFooter.content, ...content },
            },
          };
        }

        return {
          pages: state.pages.map((page) =>
            page.id === state.currentPageId
              ? {
                  ...page,
                  modules: page.modules.map((m) =>
                    m.id === id
                      ? { ...m, content: { ...m.content, ...content } }
                      : m
                  ),
                }
              : page
          ),
        };
      }),

    updateModuleVisibility: (id, visibility) =>
      set((state) => {
        if (state.globalHeader.id === id) {
          return { globalHeader: { ...state.globalHeader, visibility } };
        }
        if (state.globalFooter.id === id) {
          return { globalFooter: { ...state.globalFooter, visibility } };
        }

        return {
          pages: state.pages.map((page) =>
            page.id === state.currentPageId
              ? {
                  ...page,
                  modules: page.modules.map((m) =>
                    m.id === id ? { ...m, visibility } : m
                  ),
                }
              : page
          ),
        };
      }),

    setPreviewDevice: (device) => set({ previewDevice: device }),
    setZoomLevel: (zoom) => set({ zoomLevel: zoom }),

    setModules: (modules) =>
      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === state.currentPageId ? { ...page, modules } : page
        ),
      })),

    addModuleToPage: (pageId, module) =>
      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === pageId
            ? { ...page, modules: [...page.modules, module] }
            : page
        ),
      })),

    deleteModule: (moduleId) =>
      set((state) => {
        // Don't allow deleting global header/footer
        if (
          state.globalHeader.id === moduleId ||
          state.globalFooter.id === moduleId
        ) {
          return state;
        }

        // Remove from current page
        return {
          pages: state.pages.map((page) => ({
            ...page,
            modules: page.modules.filter((module) => module.id !== moduleId),
          })),
          selectedModuleId:
            state.selectedModuleId === moduleId ? null : state.selectedModuleId,
        };
      }),

    addPage: (name, slug) =>
      set((state) => {
        const newPage: Page = {
          id: slug, // Using slug as ID for simplicity
          name,
          slug,
          modules: [
            {
              id: `hero-${slug}`,
              type: "hero",
              name: "Hero",
              isEnabled: true,
              layout: "split",
              content: {
                title: `Welcome to ${name}`,
                subtitle: "Start building your page",
                ctaText: "Get Started",
                ctaLink: "#",
                image:
                  "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
              },
              isCustomized: false,
              visibility: "public",
            },
            {
              id: `content-${slug}`,
              type: "custom-content",
              name: "Content",
              isEnabled: true,
              layout: "details-list",
              content: {
                title: "Main Features",
                subtitle: "Explore what we offer.",
                items: [
                  {
                    title: "Feature One",
                    description: "Description for feature one goes here.",
                    image: "",
                  },
                  {
                    title: "Feature Two",
                    description: "Description for feature two goes here.",
                    image: "",
                  },
                ],
              },
              isCustomized: false,
              visibility: "public",
            },
          ],
          isEnabled: true,
          includeInSitemap: true,
          seo: {
            title: `${name} - My Website`,
            description: `Welcome to the ${name} page.`,
            keywords: `${name.toLowerCase()}, website, community`,
          },
        };
        return { pages: [...state.pages, newPage] };
      }),

    deletePage: (id) =>
      set((state) => ({
        pages: state.pages.filter((p) => p.id !== id),
      })),

    updatePageSeo: (id, seo) =>
      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === id
            ? { ...page, seo: { ...page.seo, ...seo } as any }
            : page
        ),
      })),

    togglePageStatus: (id) =>
      set((state) => ({
        pages: state.pages.map((page) => {
          if (page.id === "home") return page; // Home cannot be disabled
          if (page.id === id) return { ...page, isEnabled: !page.isEnabled };
          return page;
        }),
      })),

    togglePageSitemap: (id) =>
      set((state) => ({
        pages: state.pages.map((page) =>
          page.id === id
            ? { ...page, includeInSitemap: !page.includeInSitemap }
            : page
        ),
      })),

    updateSiteSettings: (settings) =>
      set((state) => ({
        siteSettings: { ...state.siteSettings, ...settings },
      })),

    initializeWebsiteData: (websiteData) => {
      if (!websiteData) return;

      set(() => ({
        theme: websiteData.theme || "academia",
        font: websiteData.font || "inter",
        customColors: websiteData.customColors || {},
        pages: websiteData.pages || [],
        globalHeader: websiteData.navbar || get().globalHeader,
        globalFooter: websiteData.footer || get().globalFooter,
      }));
    },
  })
);
