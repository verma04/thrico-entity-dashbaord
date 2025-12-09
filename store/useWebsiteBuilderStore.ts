import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---

export type ThemeType = "academia" | "enterprise" | "creator" | "association" | "startup" | "dark-mode";
export type LayoutType = 
  | "carousel" | "split" | "single-image" | "text" | "creator-showcase" | "full-image" | "video" | "gradient" | "saas-modern" | "bento-grid" | "dark-cinematic" | "newsletter-focus" | "app-showcase" // Hero
  | "simple" | "centered" | "minimal" | "stacked" | "split" // Navbar & generic
  | "grid" | "list" | "cards" | "masonry" // Communities
  | "columns" | "corporate" | "newsletter" // Footer specific
  | "classic-card" | "split-screen" | "centered" | "testimonial" | "modern-asymmetric" // CEO Message
  | "grid-cards" | "carousel" | "marquee" | "featured-large" | "masonry-wall" | "minimal-list" // Testimonials
  | "story-vision" | "mission-values" | "founder-message" | "impact-growth" | "simple-overview" // About
  | "simple-contact" | "support-focused" | "sales-inquiry" | "community-reach" | "location-office" // Contact
  | "simple-privacy" | "legal-document" | "tabbed-policy" // Privacy Policy
  | "grid-profiles" | "carousel-leaders" | "minimal-list" // Team
  | "simple-terms" | "structured-agreement" | "faq-style" // Terms & Conditions
  | "simple-accordion" | "grid-cards" | "highlight-feature" // FAQ
  | "default";

export type ModuleType = 
  | "navbar" 
  | "hero" 
  | "ceo-message" 
  | "communities" 
  | "marketplace" 
  | "jobs" 
  | "testimonials" 
  | "about"
  | "contact"
  | "privacy-policy"
  | "terms-conditions"
  | "faq"
  | "contact-form"
  | "contact-info"
  | "map-location"
  | "team-members"
  | "timeline"
  | "mission-vision"
  | "stats"
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
}

export interface Page {
  id: string;
  name: string;
  slug: string;
  modules: ModuleData[];
}

export interface WebsiteBuilderState {
  currentTheme: ThemeType;
  pages: Page[];
  currentPageId: string;
  modules: ModuleData[]; // Deprecated, kept for backward compatibility
  selectedModuleId: string | null;
  previewDevice: "desktop" | "tablet" | "mobile";

  // Actions
  setTheme: (theme: ThemeType) => void;
  setCurrentPage: (pageId: string) => void;
  toggleModule: (id: string) => void;
  reorderModules: (startIndex: number, endIndex: number) => void;
  selectModule: (id: string | null) => void;
  updateModuleLayout: (id: string, layout: LayoutType) => void;
  updateModuleContent: (id: string, content: Record<string, any>) => void;
  updateModuleVisibility: (id: string, visibility: "public" | "members" | "admin") => void;
  setPreviewDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setModules: (modules: ModuleData[]) => void;
  addModuleToPage: (pageId: string, module: ModuleData) => void;
}

// --- Defaults ---

const DEFAULT_MENU: MenuItem[] = [
  { id: "1", label: "Home", link: "/" },
  { id: "2", label: "About", link: "/about", children: [
     { id: "2-1", label: "Our Story", link: "/story" },
     { id: "2-2", label: "Team", link: "/team" },
  ]},
  { id: "3", label: "Services", link: "/services" },
  { id: "4", label: "Contact", link: "/contact" },
];

const DEFAULT_MODULES: ModuleData[] = [
    { id: "nav-1", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
    { id: "hero-1", type: "hero", name: "Hero Section", isEnabled: true, layout: "carousel", content: { 
        title: "Build Your Community", 
        description: "The all-in-one platform for creators and brands.",
        videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
        slides: [
            { title: "Welcome to Thrico", subtitle: "The best place to build", image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80", ctaText: "Get Started", ctaLink: "/signup" },
            { title: "Grow Together", subtitle: "Connect with like-minded people", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80", ctaText: "Join Now", ctaLink: "/community" },
            { title: "Monetize Content", subtitle: "Turn your passion into profit", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80", ctaText: "Learn More", ctaLink: "/monetize" }
        ],
        features: ["Community", "Courses", "Events"]
    }, isCustomized: false, visibility: "public" },
    { id: "ceo-1", type: "ceo-message", name: "CEO Message", isEnabled: true, layout: "default", content: { message: "Hello" }, isCustomized: false, visibility: "public" },
    { id: "comm-1", type: "communities", name: "Communities", isEnabled: true, layout: "grid", content: {}, isCustomized: false, visibility: "public" },
    { id: "market-1", type: "marketplace", name: "Marketplace", isEnabled: true, layout: "grid", content: {}, isCustomized: false, visibility: "public" },
    { id: "jobs-1", type: "jobs", name: "Jobs", isEnabled: true, layout: "list", content: {}, isCustomized: false, visibility: "public" },
    { id: "test-1", type: "testimonials", name: "Testimonials", isEnabled: true, layout: "carousel", content: {}, isCustomized: false, visibility: "public" },
    { id: "foot-1", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: { 
        socialLinks: [
            { platform: "twitter", url: "https://twitter.com" },
            { platform: "linkedin", url: "https://linkedin.com" },
            { platform: "github", url: "https://github.com" }
        ] 
    }, isCustomized: false, visibility: "public" },
];

const THEME_DEFAULTS: Record<ThemeType, Record<ModuleType, LayoutType>> = {
  academia: {
    navbar: "centered",
    hero: "carousel",
    communities: "grid",
    "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
    about: "story-vision",
    contact: "simple-contact",
    "contact-form": "default", "contact-info": "default", "map-location": "default",
    "team-members": "default", timeline: "default", "mission-vision": "default", stats: "default",
    footer: "default"
  },
  enterprise: {
    navbar: "simple",
    hero: "single-image",
    communities: "list",
    "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
    about: "mission-values",
    contact: "support-focused",
    "privacy-policy": "legal-document",
    "terms-conditions": "structured-agreement",
    faq: "simple-accordion",
    "contact-form": "default", "contact-info": "default", "map-location": "default",
    "team-members": "minimal-list", timeline: "default", "mission-vision": "default", stats: "default",
    footer: "default"
  },
  creator: {
    navbar: "minimal",
    hero: "creator-showcase",
    communities: "masonry",
    "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
    about: "founder-message",
    contact: "simple-contact",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "grid-cards",
    "contact-form": "default", "contact-info": "default", "map-location": "default",
    "team-members": "default", timeline: "default", "mission-vision": "default", stats: "default",
    footer: "default"
  },
  association: {
    navbar: "stacked",
    hero: "carousel",
    communities: "cards",
    "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
    about: "impact-growth",
    contact: "community-reach",
    "privacy-policy": "tabbed-policy",
    "terms-conditions": "faq-style",
    faq: "highlight-feature",
    "contact-form": "default", "contact-info": "default", "map-location": "default",
    "team-members": "carousel-leaders", timeline: "default", "mission-vision": "default", stats: "default",
    footer: "default"
  },
  startup: {
    navbar: "split",
    hero: "saas-modern",
    communities: "grid",
    "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
    about: "simple-overview",
    contact: "sales-inquiry",
    "privacy-policy": "simple-privacy",
    "terms-conditions": "simple-terms",
    faq: "grid-cards",
    "contact-form": "default", "contact-info": "default", "map-location": "default",
    "team-members": "grid-profiles", timeline: "default", "mission-vision": "default", stats: "default",
    footer: "default"
  },
  "dark-mode": { // Adding a mock "dark mode" theme variant or just purely using "dark-cinematic" layout
      navbar: "minimal",
      hero: "dark-cinematic",
      communities: "masonry",
      "ceo-message": "default", marketplace: "grid", jobs: "list", testimonials: "carousel",
      about: "founder-message",
      contact: "simple-contact",
      "privacy-policy": "simple-privacy",
      "terms-conditions": "simple-terms",
      faq: "simple-accordion",
      "contact-form": "default", "contact-info": "default", "map-location": "default",
      "team-members": "grid-profiles", timeline: "default", "mission-vision": "default", stats: "default",
      footer: "default"
  }
};

// --- Store ---

const DEFAULT_PAGES: Page[] = [
  {
    id: "home",
    name: "Home",
    slug: "home",
    modules: DEFAULT_MODULES
  },
  {
    id: "contact",
    name: "Contact Us",
    slug: "contact",
    modules: [
      { id: "nav-contact", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
      { id: "contact-1", type: "contact", name: "Contact", isEnabled: true, layout: "simple-contact", content: { title: "Get in Touch", subtitle: "We'd love to hear from you", email: "hello@example.com", phone: "+1 (555) 123-4567" }, isCustomized: false, visibility: "public" },
      { id: "foot-contact", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  },
  {
    id: "about",
    name: "About Us",
    slug: "about",
    modules: [
      { id: "nav-about", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
      { id: "about-1", type: "about", name: "About", isEnabled: true, layout: "story-vision", content: {}, isCustomized: false, visibility: "public" },
      { id: "foot-about", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  },
  {
    id: "privacy",
    name: "Privacy Policy",
    slug: "privacy-policy",
    modules: [
        { id: "nav-privacy", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
        { id: "privacy-1", type: "privacy-policy", name: "Privacy Policy", isEnabled: true, layout: "simple-privacy", content: { 
            title: "Privacy Policy", 
            lastUpdated: "January 1, 2024",
            sections: [
                { title: "1. Introduction", content: "Welcome to our Privacy Policy. Your privacy is critically important to us." },
                { title: "2. Data Collection", content: "We collect information to provide better services to all our users." },
                { title: "3. Use of Information", content: "We use the information we collect to operate and maintain our services." },
                { title: "4. Information Sharing", content: "We do not share your personal information with companies, organizations, or individuals outside of our company." }
            ]
        }, isCustomized: false, visibility: "public" },
        { id: "foot-privacy", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  },
  {
    id: "team",
    name: "Our Team",
    slug: "team",
    modules: [
        { id: "nav-team", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
        { id: "team-1", type: "team-members", name: "Team Members", isEnabled: true, layout: "grid-profiles", content: { 
            title: "Meet Our Team", 
            subtitle: "The people behind the mission.",
            members: [
                { name: "Sarah Johnson", role: "CEO & Founder", bio: "Visionary leader with 15+ years exp.", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80", social: { twitter: "#", linkedin: "#" } },
                { name: "Michael Chen", role: "Head of Product", bio: "Product strategist and design thinker.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80", social: { twitter: "#", github: "#" } },
                { name: "Jessica Williams", role: "Lead Engineer", bio: "Full-stack wizard loves clean code.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=400&q=80", social: { github: "#", linkedin: "#" } },
                { name: "David Kim", role: "Marketing Director", bio: "Growth hacker and storyteller.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80", social: { twitter: "#", linkedin: "#" } }
            ]
        }, isCustomized: false, visibility: "public" },
        { id: "foot-team", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  },
  {
    id: "terms",
    name: "Terms & Conditions",
    slug: "terms",
    modules: [
        { id: "nav-terms", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
        { id: "terms-1", type: "terms-conditions", name: "Terms & Conditions", isEnabled: true, layout: "structured-agreement", content: { 
            title: "Terms and Conditions", 
            lastUpdated: "January 1, 2024",
            sections: [
                { title: "1. Acceptance of Terms", content: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement." },
                { title: "2. Use License", content: "Permission is granted to temporarily download one copy of the materials (information or software) on Thrico's website for personal, non-commercial transitory viewing only." },
                { title: "3. Disclaimer", content: "The materials on Thrico's website are provided on an 'as is' basis. Thrico makes no warranties, expressed or implied." },
                { title: "4. Limitations", content: "In no event shall Thrico or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption)." }
            ]
        }, isCustomized: false, visibility: "public" },
        { id: "foot-terms", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  },
  {
    id: "faq",
    name: "FAQ",
    slug: "faq",
    modules: [
        { id: "nav-faq", type: "navbar", name: "Navbar", isEnabled: true, layout: "simple", content: { menuItems: DEFAULT_MENU, logoText: "Brand", logoType: "text" }, isCustomized: false, visibility: "public" },
        { id: "faq-1", type: "faq", name: "FAQ", isEnabled: true, layout: "simple-accordion", content: { 
            title: "Frequently Asked Questions", 
            subtitle: "Common questions about our services.",
            questions: [
                { question: "How do I get started?", answer: "Sign up for an account and follow the onboarding guide." },
                { question: "What payment methods do you accept?", answer: "We accept all major credit cards and PayPal." },
                { question: "Can I cancel anytime?", answer: "Yes, you can cancel your subscription at any time from your account settings." }
            ]
        }, isCustomized: false, visibility: "public" },
        { id: "foot-faq", type: "footer", name: "Footer", isEnabled: true, layout: "default", content: {}, isCustomized: false, visibility: "public" },
    ]
  }
];

export const useWebsiteBuilderStore = create<WebsiteBuilderState>()(
  persist(
    (set, get) => ({
      currentTheme: "academia",
      pages: DEFAULT_PAGES,
      currentPageId: "home",
      modules: DEFAULT_MODULES, // Deprecated
      selectedModuleId: null,
      previewDevice: "desktop",

      setTheme: (theme) => set((state) => {
        // Update layouts for non-customized modules across all pages
        const newPages = state.pages.map(page => ({
          ...page,
          modules: page.modules.map((mod) => {
            if (mod.isCustomized) return mod;
            const defaultLayout = THEME_DEFAULTS[theme][mod.type];
            return { ...mod, layout: defaultLayout || "default" };
          })
        }));

        return { currentTheme: theme, pages: newPages };
      }),

      setCurrentPage: (pageId) => set({ currentPageId: pageId }),

      toggleModule: (id) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === state.currentPageId
            ? {
                ...page,
                modules: page.modules.map((m) => 
                  m.id === id ? { ...m, isEnabled: !m.isEnabled } : m
                )
              }
            : page
        ),
      })),

      reorderModules: (startIndex, endIndex) => set((state) => {
        const newPages = state.pages.map(page => {
          if (page.id !== state.currentPageId) return page;
          
          const result = Array.from(page.modules);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { ...page, modules: result };
        });
        
        return { pages: newPages };
      }),

      selectModule: (id) => set({ selectedModuleId: id }),

      updateModuleLayout: (id, layout) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === state.currentPageId
            ? {
                ...page,
                modules: page.modules.map((m) => 
                  m.id === id ? { ...m, layout, isCustomized: true } : m
                )
              }
            : page
        ),
      })),

      updateModuleContent: (id, content) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === state.currentPageId
            ? {
                ...page,
                modules: page.modules.map((m) => 
                  m.id === id ? { ...m, content: { ...m.content, ...content } } : m
                )
              }
            : page
        ),
      })),
      
      updateModuleVisibility: (id, visibility) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === state.currentPageId
            ? {
                ...page,
                modules: page.modules.map((m) => 
                  m.id === id ? { ...m, visibility } : m
                )
              }
            : page
        ),
      })),

      setPreviewDevice: (device) => set({ previewDevice: device }),
      
      setModules: (modules) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === state.currentPageId
            ? { ...page, modules }
            : page
        ),
      })),

      addModuleToPage: (pageId, module) => set((state) => ({
        pages: state.pages.map(page => 
          page.id === pageId
            ? { ...page, modules: [...page.modules, module] }
            : page
        ),
      })),
    }),
    {
      name: "website-builder-storage-v10",
    }
  )
);
