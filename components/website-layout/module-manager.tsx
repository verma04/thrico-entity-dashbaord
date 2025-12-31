"use client";

import React, { useEffect, useState } from "react";
import {
  useWebsiteBuilderStore,
  ModuleData,
  ModuleType,
} from "@/store/useWebsiteBuilderStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import {
  GripVertical,
  Eye,
  EyeOff,
  Settings,
  PlusCircle,
  Trash2,
  Search,
  FileText,
  HelpCircle,
  Users,
  Briefcase,
  MessageSquare,
  Phone,
  Megaphone,
  BarChart3,
  Building,
  Calendar,
  CreditCard,
  MapPin,
  PlayCircle,
  Image,
  Star,
  Mail,
  Clock,
  BookOpen,
  Handshake,
  Award,
  Video,
  Download,
  Shield,
  Timer,
  Table,
  Map,
  Code,
  Bell,
  UserCheck,
  Trophy,
  ScrollText,
  MapPin as Location,
  GraduationCap,
  FlaskConical,
  Gift,
  Route,
  FileBarChart,
  Info,
  Headphones,
  BarChart,
  Share2,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NavigationManager } from "./navigation-manager";
import { FooterManager } from "./footer-manager";
import { useIsPremium } from "@/hooks/useIsPremium";
import { Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AVAILABLE_MODULES: {
  type: ModuleType;
  name: string;
  description: string;
  defaultLayout: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
}[] = [
  // Content & Text
  {
    type: "custom-content",

    name: "Custom Content",
    description:
      "Flexible content section with headings, text, images, or rich content.",
    defaultLayout: "details-list",
    icon: FileText,
    category: "Content & Text",
  },
  {
    type: "faq",
    name: "FAQ",
    description: "Frequently asked questions in an expandable list.",
    defaultLayout: "simple-accordion",
    icon: HelpCircle,
    category: "Content & Text",
  },
  {
    type: "blog",
    name: "Blog",
    description:
      "Articles, guides, and content in various formats and layouts.",
    defaultLayout: "standard-article",
    icon: BookOpen,
    category: "Content & Text",
  },
  {
    type: "resources",
    name: "Resources",
    description: "Downloads, guides, tools, and helpful content library.",
    defaultLayout: "resource-cards",
    icon: Download,
    category: "Content & Text",
  },
  {
    type: "guidelines",
    name: "Community Guidelines",
    description: "Display rules, code of conduct, and participation standards.",
    defaultLayout: "simple-list",
    icon: ScrollText,
    category: "Content & Text",
  },
  {
    type: "callout",
    name: "Callout Box",
    description: "Short highlighted message or announcement.",
    defaultLayout: "info-box",
    icon: Info,
    category: "Content & Text",
  },
  {
    type: "ceo-message",
    name: "CEO Message",
    description:
      "Executive message or letter from leadership to the community.",
    defaultLayout: "classic-card",
    icon: MessageSquare,
    category: "Content & Text",
  },

  // People & Community
  {
    type: "team-members",
    name: "Team Members",
    description: "Showcase founders, team members, or organizers.",
    defaultLayout: "grid-profiles",
    icon: Users,
    category: "People & Community",
  },
  {
    type: "testimonials",
    name: "Testimonials",
    description: "Customer or member reviews and success stories.",
    defaultLayout: "carousel",
    icon: MessageSquare,
    category: "People & Community",
  },
  {
    type: "member-spotlight",
    name: "Member Spotlights",
    description:
      "Highlight featured community members with stories or profiles.",
    defaultLayout: "spotlight-cards",
    icon: UserCheck,
    category: "People & Community",
  },
  {
    type: "success-stories",
    name: "Success Stories",
    description: "Share real journeys and results achieved by the community.",
    defaultLayout: "story-cards",
    icon: Trophy,
    category: "People & Community",
  },
  {
    type: "chapters",
    name: "Chapters & Regions",
    description: "List local chapters, departments, or regional groups.",
    defaultLayout: "location-grid",
    icon: Location,
    category: "People & Community",
  },
  {
    type: "leaderboard",
    name: "Leaderboard",
    description: "Show top contributors, members, or community rankings.",
    defaultLayout: "rank-list",
    icon: Trophy,
    category: "People & Community",
  },
  {
    type: "latest-members",
    name: "Latest Members",
    description:
      "Display recently joined members with various presentation styles.",
    defaultLayout: "grid-cards",
    icon: UserCheck,
    category: "People & Community",
  },
  {
    type: "members-around-world",
    name: "Members Around the World",
    description:
      "Showcase global member distribution across countries and regions.",
    defaultLayout: "country-cards",
    icon: Map,
    category: "People & Community",
  },
  {
    type: "wall-of-fame",
    name: "Wall of Fame",
    description: "Honor and celebrate outstanding members and achievements.",
    defaultLayout: "podium",
    icon: Award,
    category: "People & Community",
  },

  // Business & Services
  {
    type: "communities",
    name: "Communities",
    description: "Showcase your communities, groups, or member organizations.",
    defaultLayout: "grid",
    icon: Users,
    category: "Business & Services",
  },
  {
    type: "marketplace",
    name: "Marketplace",
    description:
      "Display products, services, or offerings for sale or exchange.",
    defaultLayout: "grid",
    icon: Building,
    category: "Business & Services",
  },
  {
    type: "jobs",
    name: "Job Board",
    description: "List job openings, career opportunities, and positions.",
    defaultLayout: "list",
    icon: Briefcase,
    category: "Business & Services",
  },
  {
    type: "services",
    name: "Services",
    description: "Highlight services, offerings, or core features.",
    defaultLayout: "grid",
    icon: Briefcase,
    category: "Business & Services",
  },
  {
    type: "pricing",
    name: "Pricing Plans",
    description: "Membership or subscription pricing tiers.",
    defaultLayout: "pricing-cards",
    icon: CreditCard,
    category: "Business & Services",
  },
  {
    type: "partners",
    name: "Partners",
    description: "Showcase business partners, sponsors, and collaborators.",
    defaultLayout: "logo-row",
    icon: Handshake,
    category: "Business & Services",
  },
  {
    type: "logo-cloud",
    name: "Logo Showcase",
    description: "Display partner, sponsor, or member organization logos.",
    defaultLayout: "logo-grid",
    icon: Building,
    category: "Business & Services",
  },
  {
    type: "case-studies",
    name: "Case Studies",
    description: "In-depth stories showcasing results or community impact.",
    defaultLayout: "case-grid",
    icon: FileBarChart,
    category: "Business & Services",
  },
  {
    type: "benefits",
    name: "Membership Benefits",
    description: "Highlight perks and reasons to join the community.",
    defaultLayout: "benefit-icons",
    icon: Gift,
    category: "Business & Services",
  },

  // Marketing & Conversion
  {
    type: "cta-banner",
    name: "Call to Action",
    description: "Prominent action banner to drive signups or conversions.",
    defaultLayout: "centered-banner",
    icon: Megaphone,
    category: "Marketing & Conversion",
  },
  {
    type: "newsletter",
    name: "Newsletter Signup",
    description: "Email subscription and updates section.",
    defaultLayout: "inline-form",
    icon: Mail,
    category: "Marketing & Conversion",
  },
  {
    type: "social-proof",
    name: "Social Proof",
    description: "Customer reviews, ratings, and trust indicators.",
    defaultLayout: "inline-proof",
    icon: Shield,
    category: "Marketing & Conversion",
  },
  {
    type: "countdown-banner",
    name: "Countdown Banner",
    description: "Time-sensitive offers, event countdowns, and deadlines.",
    defaultLayout: "centered-countdown",
    icon: Timer,
    category: "Marketing & Conversion",
  },
  {
    type: "announcement",
    name: "Announcement",
    description: "Important updates, news, or promotional banners.",
    defaultLayout: "top-strip",
    icon: Bell,
    category: "Marketing & Conversion",
  },
  {
    type: "donation",
    name: "Donation Block",
    description: "Collect donations or contributions from supporters.",
    defaultLayout: "donation-simple",
    icon: Heart,
    category: "Marketing & Conversion",
  },
  {
    type: "announcement-bar",
    name: "Announcement Bar",
    description:
      "Top notification bar for alerts, promotions, and important messages.",
    defaultLayout: "info-message",
    icon: Bell,
    category: "Marketing & Conversion",
  },

  // Data & Analytics
  {
    type: "stats",
    name: "Stats & Metrics",
    description: "Display key numbers like members, events, or growth.",
    defaultLayout: "stats-row",
    icon: BarChart3,
    category: "Data & Analytics",
  },
  {
    type: "comparison-table",
    name: "Comparison Table",
    description: "Feature comparisons, pricing charts, and plan details.",
    defaultLayout: "table-grid",
    icon: Table,
    category: "Data & Analytics",
  },
  {
    type: "polls",
    name: "Interactive Polls",
    description: "Ask questions and collect community opinions.",
    defaultLayout: "poll-card",
    icon: BarChart,
    category: "Data & Analytics",
  },

  // Events & Timeline
  {
    type: "events",
    name: "Events",
    description: "Highlight upcoming or past community events.",
    defaultLayout: "event-cards",
    icon: Calendar,
    category: "Events & Timeline",
  },
  {
    type: "timeline",
    name: "Timeline",
    description: "Show community journey, milestones, or growth history.",
    defaultLayout: "vertical-timeline",
    icon: Clock,
    category: "Events & Timeline",
  },
  {
    type: "event-countdown",
    name: "Event Countdown",
    description: "Countdown timer for upcoming events or launches.",
    defaultLayout: "timer-large",
    icon: Timer,
    category: "Events & Timeline",
  },
  {
    type: "milestones",
    name: "Milestones",
    description: "Show progress over time with achievements or goals reached.",
    defaultLayout: "milestone-track",
    icon: Award,
    category: "Events & Timeline",
  },
  {
    type: "roadmap",
    name: "Roadmap",
    description: "Display upcoming features, goals, or planned updates.",
    defaultLayout: "horizontal-roadmap",
    icon: Route,
    category: "Events & Timeline",
  },

  // Media & Interactive
  {
    type: "media-gallery",
    name: "Media Gallery",
    description: "Image or video gallery showcasing community moments.",
    defaultLayout: "masonry-gallery",
    icon: Image,
    category: "Media & Interactive",
  },
  {
    type: "video-spotlight",
    name: "Video Spotlight",
    description:
      "Featured video content like demos, testimonials, or highlights.",
    defaultLayout: "centered-video",
    icon: Video,
    category: "Media & Interactive",
  },
  {
    type: "social-feed",
    name: "Social Media Feed",
    description: "Show recent posts from Instagram, Twitter, or LinkedIn.",
    defaultLayout: "feed-grid",
    icon: Share2,
    category: "Media & Interactive",
  },
  {
    type: "podcast",
    name: "Podcast Episodes",
    description: "List podcast episodes with audio players and descriptions.",
    defaultLayout: "episode-list",
    icon: Headphones,
    category: "Media & Interactive",
  },
  {
    type: "embed-block",
    name: "Embed Block",
    description:
      "Third-party content like videos, forms, or interactive widgets.",
    defaultLayout: "fullwidth-embed",
    icon: Code,
    category: "Media & Interactive",
  },

  // Learning & Development
  {
    type: "courses",
    name: "Courses",
    description:
      "Highlight available courses, curriculum, or training content.",
    defaultLayout: "course-cards",
    icon: GraduationCap,
    category: "Learning & Development",
  },
  {
    type: "research",
    name: "Research Highlights",
    description: "Showcase research, insights, whitepapers, or reports.",
    defaultLayout: "research-list",
    icon: FlaskConical,
    category: "Learning & Development",
  },

  // Structure & Navigation
  {
    type: "process-steps",
    name: "How It Works",
    description: "Explain steps or workflows in a simple flow.",
    defaultLayout: "step-timeline",
    icon: Route,
    category: "Structure & Navigation",
  },
  {
    type: "feature-highlights",
    name: "Feature Highlights",
    description: "Highlight key benefits or platform features.",
    defaultLayout: "icon-list",
    icon: Star,
    category: "Structure & Navigation",
  },
  {
    type: "sitemap",
    name: "Sitemap",
    description: "Organized navigation links and site structure overview.",
    defaultLayout: "link-columns",
    icon: Star,
    category: "Structure & Navigation",
  },

  // Contact & Location
  {
    type: "contact",
    name: "Contact Block",
    description: "Contact details, links, and inquiry options.",
    defaultLayout: "simple-contact",
    icon: Phone,
    category: "Contact & Location",
  },
  {
    type: "location-map",
    name: "Location Map",
    description: "Interactive maps showing offices, events, or service areas.",
    defaultLayout: "map-fullwidth",
    icon: Map,
    category: "Contact & Location",
  },

  // Recognition & Awards
  {
    type: "achievements",
    name: "Achievements",
    description: "Display awards, certifications, and milestone badges.",
    defaultLayout: "badge-grid",
    icon: Award,
    category: "Recognition & Awards",
  },
];

// Basic modules available to all users (non-premium)
const BASIC_MODULE_TYPES: ModuleType[] = [
  // Essential Content
  "custom-content",
  "faq",
  "blog",

  // Basic People & Community
  "team-members",
  "testimonials",

  // Basic Business
  "services",
  "pricing",

  // Marketing Essentials
  "cta-banner",
  "newsletter",

  // Basic Data
  "stats",

  // Events
  "events",
  "timeline",

  // Media
  "media-gallery",

  // Contact
  "contact",
  "location-map",
];

const ModuleCard = ({
  module,
  index,
  isDraggable,
  provided,
}: {
  module: ModuleData;
  index?: number;
  isDraggable: boolean;
  provided?: any;
}) => {
  const { toggleModule, selectModule, selectedModuleId, deleteModule } =
    useWebsiteBuilderStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    deleteModule(module.id);
    setIsDeleteOpen(false);
  };

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={cn(
        "group flex items-center gap-3 p-3 rounded-xl border bg-card text-card-foreground transition-all",
        provided?.snapshot?.isDragging
          ? "shadow-lg scale-105 border-primary z-50"
          : "hover:border-primary/50",
        !isDraggable && "border-dashed bg-muted/20 opacity-90",
        !module.isEnabled && "opacity-60 bg-muted/50 grayscale",
        selectedModuleId === module.id && "border-primary ring-1 ring-primary"
      )}
    >
      {/* Drag Handle */}
      <div
        {...provided?.dragHandleProps}
        className={cn(
          "text-muted-foreground",
          isDraggable
            ? "cursor-move hover:text-foreground"
            : "cursor-default opacity-20"
        )}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Content */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => selectModule(module.id)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{module.name}</span>
          {module.isCustomized && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Customized
            </span>
          )}
          {!isDraggable && (
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-muted text-muted-foreground">
              Fixed
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Layout:{" "}
          <span className="capitalize">{module.layout.replace("-", " ")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleModule(module.id);
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            module.isEnabled
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          title={module.isEnabled ? "Disable Module" : "Enable Module"}
        >
          {module.isEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            selectModule(module.id);
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            selectedModuleId === module.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Delete Button - Only show for draggable modules (not header/footer) */}
        {isDraggable && (
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                title="Delete Module"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </DialogTrigger>
            <DialogContent className="z-[2000]">
              <DialogHeader>
                <DialogTitle>Delete Module</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {module.name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const ModuleManager = () => {
  const { pages, currentPageId, setModules, addModuleToPage } =
    useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { isPremium } = useIsPremium();
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const pageModules = currentPage?.modules || [];

  // Split modules into Navbar, Body, and Footer, then sort by sort field
  const bodyModules = pageModules
    .filter((m) => m.type !== "navbar" && m.type !== "footer")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  // Get unique categories
  const categories = Array.from(
    new Set(AVAILABLE_MODULES.map((m) => m.category))
  ).sort();

  // Filter modules based on search and category only (show all modules)
  const filteredModules = AVAILABLE_MODULES.filter((module) => {
    const matchesSearch =
      searchQuery === "" ||
      module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      module.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" || module.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Group filtered modules by category
  const groupedModules = categories.reduce((acc, category) => {
    const categoryModules = filteredModules.filter(
      (m) => m.category === category
    );
    if (categoryModules.length > 0) {
      acc[category] = categoryModules;
    }
    return acc;
  }, {} as Record<string, typeof filteredModules>);

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const newBodyModules = Array.from(bodyModules);
    const [moved] = newBodyModules.splice(sourceIndex, 1);
    newBodyModules.splice(destIndex, 0, moved);

    // Assign sort indices to maintain explicit ordering
    const modulesWithSort = newBodyModules.map((module, index) => ({
      ...module,
      order: index,
    }));

    // Reconstruct the full list, ensuring we only update the body modules for the page
    // Note: Navbar/Footer are now global and not part of page.modules usually,
    // but if we are migrating, we ensure we only save body modules back if we want to clean data,
    // OR we preserve existing structure.
    // Since we are moving to global, we should just save the body modules if we want to strip them,
    // BUT setModules writes back to page.modules.

    // To strictly support the new architecture, page.modules should NOT contain navbar/footer.
    // So we just save the new body list.
    // However, if we want to be safe, we can keep them if they existed, but better to enforce the new rule.
    setModules(modulesWithSort);
  };

  const handleAddModule = (
    type: ModuleType,
    baseName: string,
    defaultLayout: string,
    isPremiumModule: boolean
  ) => {
    if (!currentPageId) return;

    // Check if user is trying to add a premium module without premium access
    if (isPremiumModule && !isPremium) {
      toast({
        title: "Premium Feature",
        description:
          "This module is only available for premium users. Upgrade to access all modules.",
        variant: "destructive",
      });
      return;
    }

    const newId = crypto.randomUUID();

    // Calculate sort value for new module (next available index)
    const currentPage = pages.find((p) => p.id === currentPageId);
    const currentModules = currentPage?.modules || [];
    const maxSort = currentModules.reduce(
      (max, mod) => Math.max(max, mod.order ?? -1),
      -1
    );
    const newSort = maxSort + 1;

    const newModule: ModuleData = {
      id: newId,
      type: type,
      name: baseName, // Could append number if multiple
      isEnabled: true,
      layout: defaultLayout as any, // dynamic
      content: {
        title: `New ${baseName}`,
        subtitle: "Edit this description in settings.",
        items: [], // Default content structure
      },
      isCustomized: false,
      visibility: "public",
      order: newSort,
    };

    addModuleToPage(currentPageId, newModule);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Modules
        </h3>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 text-xs gap-1 text-primary hover:text-primary hover:bg-primary/10"
            >
              <PlusCircle className="h-3 w-3" />
            </Button>
          </DialogTrigger>
          <DialogContent className="z-[2000] max-w-4xl ">
            <DialogHeader>
              <DialogTitle>Add Section</DialogTitle>
              <DialogDescription>
                Choose a module to add to this page.
              </DialogDescription>
            </DialogHeader>

            {/* Search and Filter Controls */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory("all")}
                  className="h-7 text-xs"
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="h-7 text-xs"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            {/* Modules by Category */}
            <div className="overflow-y-auto max-h-[50vh] space-y-6">
              {Object.entries(groupedModules).map(([category, modules]) => (
                <div key={category}>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 sticky top-0 bg-background/95 backdrop-blur py-2 border-b">
                    {category}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {modules.map((item) => {
                      const IconComponent = item.icon;
                      const isPremiumModule = !BASIC_MODULE_TYPES.includes(
                        item.type
                      );
                      const isLocked = isPremiumModule && !isPremium;

                      return (
                        <button
                          key={item.type}
                          onClick={() =>
                            handleAddModule(
                              item.type,
                              item.name,
                              item.defaultLayout,
                              isPremiumModule
                            )
                          }
                          className={cn(
                            "flex items-start gap-3 p-4 border rounded-xl transition-all text-left group relative",
                            isLocked
                              ? "opacity-60 cursor-not-allowed hover:border-muted-foreground/30"
                              : "hover:border-primary hover:bg-primary/5"
                          )}
                        >
                          <div
                            className={cn(
                              "flex-shrink-0 p-2 rounded-lg transition-colors",
                              isLocked
                                ? "bg-muted/50"
                                : "bg-muted group-hover:bg-primary/10"
                            )}
                          >
                            {React.createElement(IconComponent, {
                              className: cn(
                                "h-5 w-5 transition-colors",
                                isLocked
                                  ? "text-muted-foreground/50"
                                  : "text-muted-foreground group-hover:text-primary"
                              ),
                            })}
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "font-semibold text-sm transition-colors block",
                                  isLocked
                                    ? "text-muted-foreground"
                                    : "group-hover:text-primary"
                                )}
                              >
                                {item.name}
                              </span>
                              {isPremiumModule && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1">
                                  <Lock className="h-2.5 w-2.5" />
                                  Premium
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground leading-relaxed block">
                              {item.description}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {Object.keys(groupedModules).length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">
                    No modules found matching your search.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {/* Global Navigation */}
        <NavigationManager />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="body-modules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 py-1"
              >
                {bodyModules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <ModuleCard
                        module={module}
                        isDraggable={true}
                        index={index}
                        provided={{ ...provided, snapshot }}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Global Footer */}
        <FooterManager />
      </div>
    </div>
  );
};

export default ModuleManager;
