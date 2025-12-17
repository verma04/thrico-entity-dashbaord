import type { Metadata } from "next";

/**
 * Default metadata configuration for the application
 */
export const defaultMetadata: Metadata = {
  title: {
    default: "Thrico Entity Dashboard",
    template: "%s | Thrico",
  },
  description:
    "Manage your community, members, and content with Thrico's powerful entity dashboard. Build engaging websites, forums, and member experiences.",
  keywords: [
    "community management",
    "entity dashboard",
    "member management",
    "website builder",
    "thrico",
  ],
  authors: [{ name: "Thrico" }],
  creator: "Thrico",
  publisher: "Thrico",
};

/**
 * Page-specific metadata configurations
 */
export const pageMetadata: Record<string, Metadata> = {
  "/": {
    title: "Dashboard",
    description:
      "Overview of your community dashboard with key metrics, recent activity, and quick actions.",
  },
  "/app-layout": {
    title: "Website Builder",
    description:
      "Design and customize your community website with our powerful modular builder.",
  },
  "/app-layout/pages": {
    title: "Page Management",
    description: "Manage your website structure and pages.",
  },
  "/app-layout/layout": {
    title: "Layout Builder",
    description:
      "Design your community site with our modular builder. Customize layouts, add modules, and create engaging experiences.",
  },
  "/app-layout/navigation": {
    title: "Navigation Settings",
    description: "Configure your website navigation menu, links, and structure.",
  },
  "/app-layout/footer": {
    title: "Footer Settings",
    description:
      "Customize your website footer, including links, social media, and contact information.",
  },
  "/app-layout/seo": {
    title: "SEO Settings",
    description:
      "Configure SEO settings, meta tags, and search engine optimization for your website.",
  },
  "/app-layout/settings": {
    title: "Site Settings",
    description:
      "Configure global site settings, branding, and website preferences.",
  },
  "/members": {
    title: "Members",
    description:
      "View and manage your community members, track engagement, and analyze member activity.",
  },
  "/forums": {
    title: "Forums",
    description:
      "Manage community discussions, topics, and forum settings for your community.",
  },
  "/feed": {
    title: "Feed",
    description:
      "View and manage your community feed, posts, and social interactions.",
  },
  "/polls": {
    title: "Polls",
    description:
      "Create and manage polls to gather feedback and engage with your community.",
  },
  "/listing": {
    title: "Listings",
    description:
      "Manage listings, directories, and categorized content for your community.",
  },
  "/settings": {
    title: "Settings",
    description:
      "Manage your account settings, preferences, and entity configuration.",
  },
};

/**
 * Generate metadata for a given pathname
 */
export function generateMetadata(pathname: string): Metadata {
  const metadata = pageMetadata[pathname] || {};
  return {
    ...defaultMetadata,
    ...metadata,
  };
}

/**
 * Get page title from pathname
 */
export function getPageTitle(pathname: string): string {
  const metadata = pageMetadata[pathname];
  if (metadata?.title && typeof metadata.title === "string") {
    return metadata.title;
  }
  // Fallback: Generate title from pathname
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) return "Dashboard";
  const lastSegment = segments[segments.length - 1];
  return lastSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get page description from pathname
 */
export function getPageDescription(pathname: string): string {
  const metadata = pageMetadata[pathname];
  if (metadata?.description && typeof metadata.description === "string") {
    return metadata.description;
  }
  return defaultMetadata.description as string;
}
