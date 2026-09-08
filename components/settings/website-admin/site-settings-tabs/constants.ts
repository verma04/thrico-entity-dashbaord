export type SettingsTab = "sitemap" | "identity" | "parameters" | "social";

export const THEME_OPTIONS = [
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

export const FONT_OPTIONS = [
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

export const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/yourhandle" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourprofile" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/yourorg" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel" },
  { key: "discord", label: "Discord", placeholder: "https://discord.gg/yourinvite" },
];
