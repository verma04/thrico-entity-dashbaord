import React from "react";
import {
  LayoutType,
  ModuleData,
  ModuleType,
  ThemeType,
  useWebsiteBuilderStore,
  MenuItem,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  Laptop,
  Smartphone,
  Tablet,
  Menu,
  ChevronDown,
  ShoppingBag,
  Search,
  User,
  LogIn,
  LayoutGrid,
  Zap,
} from "lucide-react";
import { ContactRenderer, PrivacyPolicyRenderer, TeamMembersRenderer, TermsRenderer, FaqRenderer } from "./preview-renderers";

import * as LucideIcons from "lucide-react";

// --- Dynamic Icon Component ---
const DynamicIcon = ({
  name,
  className,
}: {
  name?: string;
  className?: string;
}) => {
  if (!name) return null;
  // Capitalize first letter to match Lucide export convention if user types lowercase
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const IconComponent =
    (LucideIcons as any)[formattedName] || (LucideIcons as any)[name];

  if (!IconComponent) return null;
  return <IconComponent className={className} />;
};

// --- Recursive Menu Renderer ---
const MenuRenderer = ({
  items,
  className,
  vertical = false,
  depth = 0,
}: {
  items: MenuItem[];
  className?: string;
  vertical?: boolean;
  depth?: number;
}) => {
  if (!items || items.length === 0) return null;

  return (
    <ul
      className={cn(
        "flex",
        vertical ? "flex-col space-y-2" : "flex-row gap-6",
        className
      )}
    >
      {items.map((item) => (
        <li
          key={item.id}
          className="relative group text-sm font-medium cursor-pointer"
        >
          <div className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <DynamicIcon name={item.icon} className="h-4 w-4" />
            <span>{item.label}</span>
            {item.children && item.children.length > 0 && (
              <LucideIcons.ChevronDown className="h-3 w-3 opacity-50" />
            )}
          </div>

          {/* Simplified Dropdown Simulation */}
          {item.children && item.children.length > 0 && !vertical && (
            <div className="absolute top-full left-0 mt-2 min-w-[160px] bg-background border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
              <MenuRenderer
                items={item.children}
                vertical={true}
                className="gap-2"
                depth={depth + 1}
              />
            </div>
          )}
          {item.children && item.children.length > 0 && vertical && (
            <div className="pl-4 pt-1">
              <MenuRendererX
                items={item.children}
                vertical={true}
                className="gap-1"
                depth={depth + 1}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

// --- Logo Renderer ---
const LogoRenderer = ({ content }: { content: Record<string, any> }) => {
  if (content.logoType === "image" && content.logoImage) {
    return (
      <img src={content.logoImage} alt="Logo" className="h-8 object-contain" />
    );
  }
  return (
    <div className="font-bold text-xl tracking-tight">
      {content.logoText || "Brand"}
    </div>
  );
};

// --- Auth Buttons Renderer ---
const AuthButtons = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <button className="px-3 py-1.5 text-xs font-semibold hover:text-primary">
      Log in
    </button>
    <button className="px-4 py-1.5 text-xs font-bold bg-primary text-primary-foreground rounded-full hover:opacity-90 transition-opacity">
      Sign up
    </button>
  </div>
);

// --- Mock Module Renderers (Visual Approximations) ---

const ModuleRenderer = ({
  module,
  theme,
  previewDevice,
}: {
  module: ModuleData;
  theme: ThemeType;
  previewDevice: string;
}) => {
  const { type, layout, content } = module;

  // Base style based on theme
  const themeFont =
    theme === "academia"
      ? "font-serif"
      : theme === "enterprise"
      ? "font-sans"
      : theme === "creator"
      ? "font-mono"
      : "font-sans";

  return (
    <div
      className={cn(
        "w-full transition-all duration-300 relative group",
        themeFont
      )}
    >
      {/* Hover overlay to hint at interactivity in builder */}
      <div className="absolute inset-0 border-2 border-transparent hover:border-primary/50 pointer-events-none z-10 transition-colors" />

      {/* --- HERO RENDERER (ENHANCED) --- */}
      {type === "hero" && (
        <div
          className={cn(
            "relative overflow-hidden",
            layout === "carousel" &&
              "bg-slate-900 text-white min-h-[500px] flex items-center",
            layout === "saas-modern" && "bg-white py-24",
            layout === "bento-grid" && "bg-slate-50 py-20",
            layout === "dark-cinematic" &&
              "bg-black text-white min-h-[600px] flex items-center justify-center",
            layout === "video" &&
              "relative min-h-[500px] flex items-center justify-center text-white overflow-hidden",
            layout === "newsletter-focus" &&
              "bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-32 flex items-center justify-center",
            layout === "app-showcase" && "bg-white py-20",
            [
              "split",
              "single-image",
              "text",
              "creator-showcase",
              "full-image",
              "gradient",
            ].includes(layout) &&
              "p-12 flex flex-col justify-center min-h-[300px]", // Fallback for legacy
            layout === "split" && "flex-row items-center gap-8 bg-white",
            layout === "single-image" &&
              "bg-slate-900 text-white text-center bg-[url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center blend-overlay",
            layout === "text" && "bg-white text-left items-start",
            layout === "creator-showcase" &&
              "bg-gradient-to-br from-purple-50 to-pink-50 text-center py-20",
            layout === "full-image" &&
              "h-[500px] justify-end pb-12 text-white bg-black bg-opacity-50",
            layout === "gradient" &&
              "bg-gradient-to-r from-orange-400 to-pink-500 text-white text-center"
          )}
        >
          {/* 1. CAROUSEL */}
          {layout === "carousel" && (
            <div className="w-full h-full relative">
              {content.slides && content.slides.length > 0 ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Valid slide rendering - simply showing first one for "No Code" preview feel, or user can map */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40"
                    style={{
                      backgroundImage: `url(${content.slides[0].image})`,
                    }}
                  />
                  <div className="relative z-10 text-center space-y-6 max-w-3xl px-4">
                    <h1 className="text-5xl font-bold tracking-tight">
                      {content.slides[0].title}
                    </h1>
                    <p className="text-xl opacity-90">
                      {content.slides[0].subtitle}
                    </p>
                    <a
                      href={content.slides[0].ctaLink}
                      className="inline-block bg-primary text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                      {content.slides[0].ctaText}
                    </a>

                    <div className="flex gap-2 justify-center mt-8">
                      {content.slides.map((_: any, i: number) => (
                        <div
                          key={i}
                          className={cn(
                            "h-1.5 rounded-full transition-all",
                            i === 0 ? "w-8 bg-primary" : "w-1.5 bg-white/50"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center opacity-50">
                  Add slides in settings to see carousel
                </div>
              )}
            </div>
          )}

          {/* 2. VIDEO */}
          {layout === "video" && (
            <>
              <video
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-50"
                src={
                  content.videoUrl ||
                  "https://www.w3schools.com/html/mov_bbb.mp4"
                }
              />
              <div
                className="relative z-10 text-center p-8 max-w-2xl"
                style={{ color: content.textColor || "#ffffff" }}
              >
                <h1 className="text-4xl font-bold mb-4">
                  {content.title || "Immersive Video"}
                </h1>
                <p className="text-lg opacity-80 mb-8">
                  {content.description ||
                    "Engage your audience with a powerful video background."}
                </p>
                {content.ctaText && (
                  <button className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-opacity-90 transition-all">
                    {content.ctaText}
                  </button>
                )}
              </div>
            </>
          )}

          {/* 3. SAAS MODERN */}
          {layout === "saas-modern" && (
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />{" "}
                  New Features 2.0
                </div>
                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                  {content.title || "Build Faster."}
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed max-w-lg">
                  {content.description ||
                    "The ultimate platform for modern saas companies to scale their operations without technical debt."}
                </p>
                <div className="flex gap-4 pt-2">
                  <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
                    {content.ctaText || "Start Free Trial"}
                  </button>
                  {content.secondaryCtaText && (
                    <button className="px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                      {content.secondaryCtaText}
                    </button>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl blur-3xl opacity-50 transform rotate-3" />
                <div className="relative bg-white border shadow-2xl rounded-2xl p-2 rotate-[-2deg] hover:rotate-0 transition-all duration-500">
                  <img
                    src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                    className="rounded-xl w-full"
                    alt="Dashboard"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3.1 BENTO GRID */}
          {layout === "bento-grid" && (
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center max-w-2xl mx-auto mb-16">
                <h1 className="text-4xl font-bold mb-4 text-slate-900">
                  {content.title || "Everything you need"}
                </h1>
                <p className="text-lg opacity-60">
                  {content.description ||
                    "A powerful set of features to help you grow your business."}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
                <div className="md:col-span-2 md:row-span-2 bg-white p-8 rounded-3xl border shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-purple-200" />
                  <h3 className="text-2xl font-bold mb-2 relative z-10">
                    Analytics
                  </h3>
                  <p className="opacity-60 relative z-10">
                    Real-time insights into your community growth.
                  </p>
                  <div className="mt-8 relative z-10 border rounded-xl overflow-hidden shadow-lg">
                    <img
                      src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2340&auto=format&fit=crop"
                      className="w-full"
                      alt="Analytics"
                    />
                  </div>
                </div>
                <div className="bg-slate-900 text-white p-8 rounded-3xl flex flex-col justify-between group overflow-hidden relative">
                  <div className="absolute inset-0 bg-blue-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <LayoutGrid className="h-8 w-8 relative z-10" />
                  <div className="relative z-10">
                    <h3 className="font-bold text-lg">Layouts</h3>
                    <p className="opacity-60 text-sm">Themeable</p>
                  </div>
                </div>
                <div className="bg-orange-50 p-8 rounded-3xl flex flex-col justify-between border group hover:border-orange-200 transition-colors">
                  <Zap className="h-8 w-8 text-orange-500" />
                  <div>
                    <h3 className="font-bold text-lg text-orange-900">Fast</h3>
                    <p className="opacity-60 text-sm text-orange-800">
                      Edge optimized
                    </p>
                  </div>
                </div>
                <div className="md:col-span-2 bg-blue-50 p-8 rounded-3xl border flex items-center justify-between group">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-blue-900">
                      Community
                    </h3>
                    <p className="text-blue-700/60">Connect with others</p>
                  </div>
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full border-2 border-white bg-slate-200"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 4. DARK CINEMATIC */}
          {layout === "dark-cinematic" && (
            <div className="text-center space-y-8 max-w-4xl mx-auto px-6">
              <div className="mx-auto w-20 h-1 bg-white/20 rounded-full" />
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
                {content.title?.split(" ")[0] || "UNLEASH"} <br />
                <span className="text-white">
                  {content.title?.split(" ").slice(1).join(" ") || "CREATIVITY"}
                </span>
              </h1>
              <p className="text-xl text-white/60 max-w-2xl mx-auto font-light">
                {content.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 items-center">
                {content.slides &&
                  content.slides.slice(0, 3).map((slide: any, i: number) => (
                    <div
                      key={i}
                      className="group relative overflow-hidden rounded-2xl aspect-[9/16] cursor-pointer"
                    >
                      <img
                        src={slide.image}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-80"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />
                      <div className="absolute bottom-0 left-0 p-6 text-left">
                        <h3 className="text-xl font-bold">{slide.title}</h3>
                        <p className="text-sm opacity-70 mt-1">
                          {slide.subtitle}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* 5. NEWSLETTER FOCUS */}
          {layout === "newsletter-focus" && (
            <div className="max-w-3xl mx-auto text-center px-6 space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                  📧 Join our newsletter
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-tight">
                  {content.title || "Stay in the Loop"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                  {content.description ||
                    "Get the latest updates, exclusive content, and insider tips delivered straight to your inbox."}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto pt-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-6 py-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-none text-slate-900 placeholder:text-slate-400 transition-colors"
                />
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-slate-500 pt-4">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Unsubscribe anytime</span>
                </div>
              </div>

              <p className="text-sm text-slate-400 pt-2">
                Join <span className="font-bold text-indigo-600">12,847</span>{" "}
                subscribers already reading
              </p>
            </div>
          )}

          {/* 6. APP SHOWCASE */}
          {layout === "app-showcase" && (
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6 order-2 md:order-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />{" "}
                    Available Now
                  </div>
                  <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                    {content.title || "Your App, Everywhere"}
                  </h1>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {content.description ||
                      "Download our mobile app and take your experience on the go. Available for iOS and Android devices."}
                  </p>

                  <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-xs opacity-80">
                          Download on the
                        </div>
                        <div className="text-sm font-bold">App Store</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer">
                      <svg
                        className="w-6 h-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                      </svg>
                      <div className="text-left">
                        <div className="text-xs opacity-80">Get it on</div>
                        <div className="text-sm font-bold">Google Play</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-6 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400"
                          />
                        ))}
                      </div>
                      <span>50K+ downloads</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★★★★★</span>
                      <span className="font-semibold text-slate-700">4.8</span>
                    </div>
                  </div>
                </div>

                <div className="relative order-1 md:order-2">
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-200 to-blue-200 rounded-3xl blur-3xl opacity-30 transform rotate-6" />
                  <div className="relative flex justify-center gap-4">
                    <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2340&auto=format&fit=crop"
                          className="w-full h-full object-cover"
                          alt="App Screen 1"
                        />
                      </div>
                    </div>
                    <div className="w-64 h-[500px] bg-slate-900 rounded-[3rem] p-3 shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500 mt-12">
                      <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=2340&auto=format&fit=crop"
                          className="w-full h-full object-cover"
                          alt="App Screen 2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ENHANCED CREATOR SHOWCASE */}
          {layout === "creator-showcase" && (
            <div className="max-w-5xl mx-auto px-6 space-y-12 text-center">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tight">
                  {content.title || "Join Our Creator Community"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                  {content.description ||
                    "Connect with thousands of creators, share your work, and grow together."}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {[
                  {
                    name: "Sarah K.",
                    role: "Designer",
                    color: "from-pink-400 to-rose-500",
                  },
                  {
                    name: "Mike R.",
                    role: "Developer",
                    color: "from-blue-400 to-cyan-500",
                  },
                  {
                    name: "Emma L.",
                    role: "Writer",
                    color: "from-purple-400 to-indigo-500",
                  },
                  {
                    name: "Alex T.",
                    role: "Artist",
                    color: "from-orange-400 to-amber-500",
                  },
                  {
                    name: "Lisa M.",
                    role: "Photographer",
                    color: "from-green-400 to-emerald-500",
                  },
                  {
                    name: "Tom H.",
                    role: "Musician",
                    color: "from-violet-400 to-purple-500",
                  },
                  {
                    name: "Nina P.",
                    role: "Coach",
                    color: "from-fuchsia-400 to-pink-500",
                  },
                  {
                    name: "Dan W.",
                    role: "Creator",
                    color: "from-teal-400 to-cyan-500",
                  },
                ].map((creator, i) => (
                  <div
                    key={i}
                    className="group relative bg-white rounded-2xl p-6 border-2 border-slate-100 hover:border-purple-200 transition-all hover:shadow-xl cursor-pointer"
                  >
                    <div
                      className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${creator.color} mb-3 group-hover:scale-110 transition-transform`}
                    />
                    <h3 className="font-bold text-slate-900 text-sm">
                      {creator.name}
                    </h3>
                    <p className="text-xs text-slate-500">{creator.role}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center gap-4 pt-8">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-lg hover:shadow-2xl transition-all hover:scale-105">
                  Join 15,000+ Creators
                </button>
                <p className="text-sm text-slate-500">
                  Free to join • No credit card required
                </p>
              </div>
            </div>
          )}

          {/* 8. SINGLE IMAGE FOCUS */}
          {layout === "single-image" && (
            <div className="relative min-h-[600px] flex items-center justify-center">
              {/* Background Image with Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${
                    content.image ||
                    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop"
                  })`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

              {/* Content */}
              <div
                className="relative z-10 text-center max-w-4xl px-6 space-y-8"
                style={{ color: content.textColor || "#ffffff" }}
              >
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
                    {content.title || "One Strong Message"}
                  </h1>
                  <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light">
                    {content.description ||
                      "Clear, focused communication that drives action with stunning visual impact."}
                  </p>
                </div>

                {(content.ctaText || content.secondaryCtaText) && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                    {content.ctaText && (
                      <button className="px-8 py-4 bg-white text-slate-900 rounded-lg font-bold text-lg hover:bg-slate-100 transition-all shadow-2xl hover:shadow-xl hover:scale-105">
                        {content.ctaText}
                      </button>
                    )}
                    {content.secondaryCtaText && (
                      <button
                        className="px-8 py-4 bg-transparent border-2 border-white rounded-lg font-bold text-lg hover:bg-white/10 transition-all"
                        style={{
                          borderColor: content.textColor || "#ffffff",
                          color: content.textColor || "#ffffff",
                        }}
                      >
                        {content.secondaryCtaText}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 9. SPLIT BALANCED */}
          {layout === "split" && (
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                {/* Text Column */}
                <div className="space-y-6 order-2 md:order-1">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold">
                      {content.badge || "Why Choose Us"}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight">
                      {content.title ||
                        "Clear Communication Meets Visual Impact"}
                    </h1>
                    <p className="text-lg text-slate-600 leading-relaxed">
                      {content.description ||
                        "A balanced two-column layout that combines compelling copy with stunning visuals for maximum engagement and clarity."}
                    </p>
                  </div>

                  {/* Feature List */}
                  <div className="space-y-3 pt-4">
                    {(
                      content.features || [
                        "Easy to use",
                        "Powerful features",
                        "24/7 support",
                      ]
                    ).map((feature: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-slate-700 font-medium">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Buttons */}
                  {(content.ctaText || content.secondaryCtaText) && (
                    <div className="flex gap-4 pt-6">
                      {content.ctaText && (
                        <button className="px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors shadow-lg">
                          {content.ctaText}
                        </button>
                      )}
                      {content.secondaryCtaText && (
                        <button className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-semibold hover:border-slate-300 transition-colors">
                          {content.secondaryCtaText}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Image Column */}
                <div className="relative order-1 md:order-2">
                  <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-100 rounded-3xl blur-2xl opacity-40 transform -rotate-6" />
                  <div className="relative">
                    <img
                      src={
                        content.image ||
                        "https://images.unsplash.com/photo-1553877522-43269d4ea984?q=80&w=2340&auto=format&fit=crop"
                      }
                      alt="Hero Visual"
                      className="rounded-2xl shadow-2xl w-full hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback for remaining generic layouts */}
          {["text", "full-image", "gradient"].includes(layout) && (
            <>
              {layout !== "text" && (
                <h1 className="text-4xl font-bold mb-4">
                  {content.title || "Hero Title"}
                </h1>
              )}
              {layout === "text" && (
                <h1 className="text-6xl font-bold mb-6 tracking-tight text-slate-900">
                  {content.title || "Hero Title"}
                </h1>
              )}
              <p className="text-lg opacity-80 max-w-xl mx-auto mb-6">
                {content.description ||
                  "This is a description of the hero section that changes based on layout."}
              </p>
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-full font-medium shadow-lg hover:shadow-xl transition-all">
                Get Started
              </button>
            </>
          )}
        </div>
      )}

      {/* --- NAVBAR RENDERER (5 VARIANTS with FIXED LOGIN/SIGNUP) --- */}
      {type === "navbar" && (
        <div
          className={cn(
            "border-b bg-background flex px-8",
            previewDevice === "mobile"
              ? "h-16 items-center justify-between px-4"
              : [
                  layout === "simple" && "h-16 items-center justify-between",
                  layout === "centered" &&
                    "h-24 flex-col justify-center items-center py-4 gap-2 relative",
                  layout === "minimal" && "h-16 items-center justify-between",
                  layout === "stacked" && "h-28 flex-col justify-between py-4",
                  layout === "split" && "h-16 items-center justify-between",
                  layout === "default" && "h-16 items-center justify-between",
                ]
          )}
        >
          {previewDevice === "mobile" ? (
            <>
              <LogoRenderer content={content} />
              <div className="flex items-center gap-4">
                {/* Minimized Auth for Mobile */}
                <button className="text-xs font-bold bg-primary text-primary-foreground rounded-full px-3 py-1">
                  Join
                </button>
                <Menu className="h-6 w-6 cursor-pointer" />
              </div>
            </>
          ) : (
            <>
              {/* VARIANT: SIMPLE (Logo Left, Menu Center, Auth Right) */}
              {layout === "simple" && (
                <>
                  <LogoRenderer content={content} />
                  <MenuRenderer items={content.menuItems} />
                  <AuthButtons />
                </>
              )}

              {/* VARIANT: CENTERED (Logo Center, Menu Below, Auth Absolute Right) */}
              {layout === "centered" && (
                <>
                  <div className="absolute right-8 top-4">
                    <AuthButtons />
                  </div>
                  <LogoRenderer content={content} />
                  <MenuRenderer items={content.menuItems} />
                </>
              )}

              {/* VARIANT: MINIMAL (Logo Left, Auth + Burger Right) */}
              {layout === "minimal" && (
                <>
                  <LogoRenderer content={content} />
                  <div className="flex items-center gap-4">
                    <AuthButtons />
                    <div className="h-6 w-px bg-border mx-1"></div>
                    <Menu className="h-6 w-6 cursor-pointer" />
                  </div>
                </>
              )}

              {/* VARIANT: STACKED (Logo + Auth Top, Menu Bottom) */}
              {layout === "stacked" && (
                <>
                  <div className="w-full flex justify-between items-center px-4">
                    <LogoRenderer content={content} />
                    <AuthButtons />
                  </div>
                  <div className="w-full h-px bg-border/50 my-1" />
                  <div className="w-full flex justify-center">
                    <MenuRenderer items={content.menuItems} />
                  </div>
                </>
              )}

              {/* VARIANT: SPLIT (Menu Left, Logo Center, Auth Right) */}
              {layout === "split" && (
                <>
                  <div className="flex-1 flex justify-start">
                    <MenuRenderer items={content.menuItems} />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <LogoRenderer content={content} />
                  </div>
                  <div className="flex-1 flex justify-end gap-2 items-center">
                    <AuthButtons />
                  </div>
                </>
              )}

              {/* Default Failover */}
              {layout === "default" && (
                <div className="h-16 flex items-center justify-between w-full">
                  <LogoRenderer content={content} />
                  <MenuRenderer items={content.menuItems} />
                  <AuthButtons />
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* --- COMMUNITIES RENDERER --- */}
      {type === "communities" && (
        <div className="py-16 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            {content.title && (
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 sm:mb-12 text-center">
                {content.title}
              </h2>
            )}
            <div
              className={cn(
                "gap-4 sm:gap-6",
                layout === "grid" &&
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                layout === "list" && "flex flex-col space-y-4",
                layout === "cards" &&
                  "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                layout === "masonry" &&
                  "columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-6 space-y-4 sm:space-y-6"
              )}
            >
              {[1, 2, 3, 4, 5, 6].map((i) => {
                const imageUrl =
                  (content.communities || [])[i - 1]?.image ||
                  `https://images.unsplash.com/photo-${
                    1500000000000 + i * 1000000
                  }?w=800&h=600&fit=crop`;

                return (
                  <div
                    key={i}
                    className={cn(
                      "bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow",
                      layout === "grid" && "flex flex-col h-full",
                      layout === "list" && "flex flex-col sm:flex-row gap-4",
                      layout === "cards" && "flex flex-col",
                      layout === "masonry" && "break-inside-avoid"
                    )}
                  >
                    {layout !== "list" && (
                      <div
                        className={cn(
                          "w-full bg-muted flex items-center justify-center bg-cover bg-center",
                          layout === "grid" && "h-48 sm:h-56 md:h-64",
                          layout === "cards" && "h-40 sm:h-48",
                          layout === "masonry" &&
                            `h-${[32, 48, 24, 64, 32, 24][i - 1]}`
                        )}
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      ></div>
                    )}
                    {layout === "list" && (
                      <div
                        className="w-full sm:w-16 h-40 sm:h-16 rounded-lg bg-muted flex-shrink-0 bg-cover bg-center"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      ></div>
                    )}
                    <div className={cn("p-4", layout === "list" && "flex-1")}>
                      <h3 className="font-semibold text-base sm:text-lg">
                        {(content.communities || [])[i - 1]?.name ||
                          `Community ${i}`}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {(content.communities || [])[i - 1]?.description ||
                          "Community description"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* --- CEO/CHAIRMAN MESSAGE RENDERER --- */}
      {type === "ceo-message" && (
        <div className="py-16 px-8">
          <div className="max-w-6xl mx-auto">
            {content.title && (
              <h2 className="text-3xl font-bold mb-12 text-center">
                {content.title}
              </h2>
            )}

            {(content.messages || []).map((message: any, index: number) => (
              <div key={index} className={cn("mb-16 last:mb-0")}>
                {/* 1. CLASSIC CARD */}
                {layout === "classic-card" && (
                  <div className="bg-card border rounded-2xl p-8 shadow-lg">
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                      {message.image && (
                        <div className="flex-shrink-0">
                          <img
                            src={message.image}
                            alt={message.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">
                          {message.name || "CEO Name"}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {message.designation || "Chief Executive Officer"}
                        </p>
                        <p className="text-lg leading-relaxed mb-6">
                          {message.message || "Message content goes here..."}
                        </p>
                        {message.signature && (
                          <img
                            src={message.signature}
                            alt="Signature"
                            className="h-16 object-contain"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SPLIT SCREEN */}
                {layout === "split-screen" && (
                  <div
                    className={cn(
                      "bg-card border rounded-2xl overflow-hidden shadow-lg",
                      message.image
                        ? "grid md:grid-cols-2 gap-0 min-h-[500px]"
                        : "p-12"
                    )}
                  >
                    {message.image && (
                      <div className="relative">
                        <img
                          src={message.image}
                          alt={message.name}
                          className="w-full h-full object-cover"
                        />
                        {message.signature && (
                          <div className="absolute bottom-8 left-8 bg-white/90 p-4 rounded-lg">
                            <img
                              src={message.signature}
                              alt="Signature"
                              className="h-12 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                    <div className="p-12 flex flex-col justify-center">
                      <div className="text-6xl text-primary/20 mb-4">"</div>
                      <p className="text-xl leading-relaxed mb-8 italic">
                        {message.message || "Message content goes here..."}
                      </p>
                      <div>
                        <h3 className="text-2xl font-bold">
                          {message.name || "CEO Name"}
                        </h3>
                        <p className="text-muted-foreground">
                          {message.designation || "Chief Executive Officer"}
                        </p>
                      </div>
                      {!message.image && message.signature && (
                        <div className="mt-6">
                          <img
                            src={message.signature}
                            alt="Signature"
                            className="h-12 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 3. CENTERED */}
                {layout === "centered" && (
                  <div className="max-w-3xl mx-auto text-center">
                    {message.image && (
                      <img
                        src={message.image}
                        alt={message.name}
                        className="w-40 h-40 rounded-full object-cover border-4 border-primary/20 mx-auto mb-6"
                      />
                    )}
                    <h3 className="text-3xl font-bold mb-2">
                      {message.name || "CEO Name"}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {message.designation || "Chief Executive Officer"}
                    </p>
                    <p className="text-lg leading-relaxed mb-8">
                      {message.message || "Message content goes here..."}
                    </p>
                    {message.signature && (
                      <img
                        src={message.signature}
                        alt="Signature"
                        className="h-16 object-contain mx-auto"
                      />
                    )}
                  </div>
                )}

                {/* 4. TESTIMONIAL STYLE */}
                {layout === "testimonial" && (
                  <div className="max-w-4xl mx-auto">
                    <div className="bg-muted/30 rounded-2xl p-8 relative">
                      <div className="flex items-start gap-4 mb-6">
                        {message.image && (
                          <img
                            src={message.image}
                            alt={message.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                          />
                        )}
                        <div>
                          <h3 className="text-xl font-bold">
                            {message.name || "CEO Name"}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {message.designation || "Chief Executive Officer"}
                          </p>
                        </div>
                      </div>
                      <p className="text-lg leading-relaxed pl-4 border-l-4 border-primary">
                        {message.message || "Message content goes here..."}
                      </p>
                      {message.signature && (
                        <div className="mt-6 flex justify-end">
                          <img
                            src={message.signature}
                            alt="Signature"
                            className="h-12 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 5. MODERN ASYMMETRIC */}
                {layout === "modern-asymmetric" && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl p-8 md:p-12">
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <h3 className="text-3xl font-bold mb-2">
                          {message.name || "CEO Name"}
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          {message.designation || "Chief Executive Officer"}
                        </p>
                        <p className="text-lg leading-relaxed mb-6">
                          {message.message || "Message content goes here..."}
                        </p>
                        {message.signature && (
                          <img
                            src={message.signature}
                            alt="Signature"
                            className="h-14 object-contain"
                          />
                        )}
                      </div>
                      {message.image && (
                        <div className="md:col-span-1">
                          <img
                            src={message.image}
                            alt={message.name}
                            className="w-full aspect-square object-cover rounded-xl shadow-xl"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- TESTIMONIALS RENDERER --- */}
      {type === "testimonials" && (
        <div className="py-16 px-8 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            {content.title && (
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-3">{content.title}</h2>
                {content.description && (
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    {content.description}
                  </p>
                )}
              </div>
            )}

            {/* 1. GRID CARDS */}
            {layout === "grid-cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.testimonials || []).map(
                  (testimonial: any, index: number) => (
                    <div
                      key={index}
                      className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div className="flex-1">
                          <h4 className="font-semibold">
                            {testimonial.name || "Customer Name"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role || "Position"}
                            {testimonial.company &&
                              ` at ${testimonial.company}`}
                          </p>
                        </div>
                      </div>
                      {testimonial.rating && (
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-lg",
                                i < testimonial.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        "{testimonial.testimonial || "Testimonial text..."}"
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* 2. CAROUSEL */}
            {layout === "carousel" && (
              <div className="relative max-w-4xl mx-auto">
                <div className="overflow-hidden">
                  {(content.testimonials || []).length > 0 && (
                    <div className="bg-card border rounded-2xl p-12 shadow-lg text-center">
                      <div className="text-6xl text-primary/20 mb-4">"</div>
                      <p className="text-xl leading-relaxed mb-8 italic">
                        {content.testimonials[0].testimonial ||
                          "Testimonial text..."}
                      </p>
                      {content.testimonials[0].rating && (
                        <div className="flex gap-1 justify-center mb-6">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-2xl",
                                i < content.testimonials[0].rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center justify-center gap-4">
                        {content.testimonials[0].image && (
                          <img
                            src={content.testimonials[0].image}
                            alt={content.testimonials[0].name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="text-left">
                          <h4 className="font-bold text-lg">
                            {content.testimonials[0].name || "Customer Name"}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {content.testimonials[0].role || "Position"}
                            {content.testimonials[0].company &&
                              ` at ${content.testimonials[0].company}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {(content.testimonials || []).length > 1 && (
                  <div className="flex gap-2 justify-center mt-6">
                    {(content.testimonials || []).map((_: any, i: number) => (
                      <div
                        key={i}
                        className={cn(
                          "h-2 rounded-full transition-all",
                          i === 0 ? "w-8 bg-primary" : "w-2 bg-muted"
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. MARQUEE SCROLL */}
            {layout === "marquee" && (
              <div className="relative overflow-hidden">
                <div className="flex gap-6 animate-marquee">
                  {[
                    ...(content.testimonials || []),
                    ...(content.testimonials || []),
                  ].map((testimonial: any, index: number) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-96 bg-card border rounded-xl p-6 shadow-sm"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-sm">
                            {testimonial.name || "Customer"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role || "Position"}
                          </p>
                        </div>
                        {testimonial.rating && (
                          <div className="ml-auto flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-sm",
                                  i < testimonial.rating
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                )}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-muted-foreground line-clamp-4">
                        "{testimonial.testimonial || "Testimonial..."}"
                      </p>
                    </div>
                  ))}
                </div>
                <style jsx>{`
                  @keyframes marquee {
                    0% {
                      transform: translateX(0);
                    }
                    100% {
                      transform: translateX(-50%);
                    }
                  }
                  .animate-marquee {
                    animation: marquee 30s linear infinite;
                  }
                  .animate-marquee:hover {
                    animation-play-state: paused;
                  }
                `}</style>
              </div>
            )}

            {/* 4. FEATURED LARGE */}
            {layout === "featured-large" && (
              <div className="max-w-5xl mx-auto">
                {(content.testimonials || []).length > 0 && (
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16">
                    <div className="text-center space-y-8">
                      {content.testimonials[0].image && (
                        <img
                          src={content.testimonials[0].image}
                          alt={content.testimonials[0].name}
                          className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-xl"
                        />
                      )}
                      {content.testimonials[0].rating && (
                        <div className="flex gap-2 justify-center">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-3xl",
                                i < content.testimonials[0].rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="text-5xl text-primary/30 leading-none">
                        "
                      </div>
                      <p className="text-2xl md:text-3xl leading-relaxed font-medium max-w-3xl mx-auto">
                        {content.testimonials[0].testimonial ||
                          "Testimonial text goes here..."}
                      </p>
                      <div className="pt-4">
                        <h4 className="text-xl font-bold">
                          {content.testimonials[0].name || "Customer Name"}
                        </h4>
                        <p className="text-muted-foreground">
                          {content.testimonials[0].role || "Position"}
                          {content.testimonials[0].company &&
                            ` at ${content.testimonials[0].company}`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. MASONRY WALL */}
            {layout === "masonry-wall" && (
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {(content.testimonials || []).map(
                  (testimonial: any, index: number) => (
                    <div
                      key={index}
                      className="break-inside-avoid bg-card border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                    >
                      {testimonial.rating && (
                        <div className="flex gap-1 mb-3">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={cn(
                                "text-lg",
                                i < testimonial.rating
                                  ? "text-yellow-500"
                                  : "text-gray-300"
                              )}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                      )}
                      <p className="text-sm leading-relaxed mb-4">
                        "{testimonial.testimonial || "Testimonial text..."}"
                      </p>
                      <div className="flex items-center gap-3 pt-4 border-t">
                        {testimonial.image && (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h4 className="font-semibold text-sm">
                            {testimonial.name || "Customer Name"}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {testimonial.role || "Position"}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {/* 6. MINIMAL LIST */}
            {layout === "minimal-list" && (
              <div className="max-w-3xl mx-auto space-y-6">
                {(content.testimonials || []).map(
                  (testimonial: any, index: number) => (
                    <div
                      key={index}
                      className="flex gap-4 items-start p-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {testimonial.image && (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">
                              {testimonial.name || "Customer Name"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {testimonial.role || "Position"}
                              {testimonial.company &&
                                ` at ${testimonial.company}`}
                            </p>
                          </div>
                          {testimonial.rating && (
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className={cn(
                                    "text-sm",
                                    i < testimonial.rating
                                      ? "text-yellow-500"
                                      : "text-gray-300"
                                  )}
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          "{testimonial.testimonial || "Testimonial text..."}"
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            {(content.testimonials || []).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>
                  No testimonials yet. Add testimonials in the settings panel.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- ABOUT PAGE RENDERER --- */}
      {type === "about" && (
        <div className="py-16 px-4 sm:px-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            {/* 1. STORY & VISION */}
            {layout === "story-vision" && (
              <div className="space-y-16">
                {/* Hero Section */}
                <div className="text-center max-w-4xl mx-auto space-y-6">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {content.title || "Our Story"}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {content.subtitle ||
                      "Building the future, one step at a time"}
                  </p>
                </div>

                {/* Story Timeline */}
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <h2 className="text-3xl font-bold">The Journey</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {content.story ||
                        "Our journey began with a simple idea: to create meaningful connections and empower communities to thrive together."}
                    </p>
                    <div className="space-y-4">
                      {(
                        content.milestones || [
                          { year: "2020", event: "Founded" },
                          { year: "2022", event: "10K Members" },
                          { year: "2024", event: "Global Expansion" },
                        ]
                      ).map((milestone: any, i: number) => (
                        <div key={i} className="flex gap-4">
                          <div className="text-2xl font-bold text-primary">
                            {milestone.year}
                          </div>
                          <div className="flex-1 border-l-2 border-primary/20 pl-4">
                            <p className="font-medium">{milestone.event}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-8 h-96 flex items-center justify-center">
                    {content.image ? (
                      <img
                        src={content.image}
                        alt="Our Story"
                        className="rounded-lg max-h-full object-cover"
                      />
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <p className="text-6xl mb-4">🚀</p>
                        <p>Our Journey</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vision */}
                <div className="bg-card border rounded-2xl p-8 md:p-12 text-center">
                  <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                    {content.vision ||
                      "To create a world where every community has the tools and support to achieve their full potential."}
                  </p>
                </div>
              </div>
            )}

            {/* 2. MISSION & VALUES */}
            {layout === "mission-values" && (
              <div className="space-y-16">
                {/* Mission Statement */}
                <div className="text-center max-w-4xl mx-auto space-y-6">
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    {content.title || "Mission & Values"}
                  </h1>
                  <div className="bg-primary/10 border-l-4 border-primary rounded-r-lg p-6">
                    <p className="text-xl font-medium">
                      {content.mission ||
                        "Empowering communities to connect, collaborate, and grow together."}
                    </p>
                  </div>
                </div>

                {/* Core Values */}
                <div>
                  <h2 className="text-3xl font-bold text-center mb-12">
                    Core Values
                  </h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(
                      content.values || [
                        {
                          icon: "Heart",
                          title: "Community First",
                          description:
                            "We put our members at the center of everything we do",
                        },
                        {
                          icon: "Shield",
                          title: "Trust & Safety",
                          description:
                            "Creating a secure environment for authentic connections",
                        },
                        {
                          icon: "Zap",
                          title: "Innovation",
                          description:
                            "Constantly evolving to meet community needs",
                        },
                        {
                          icon: "Users",
                          title: "Inclusivity",
                          description:
                            "Welcoming diverse perspectives and backgrounds",
                        },
                        {
                          icon: "Target",
                          title: "Impact",
                          description:
                            "Measuring success by community growth and engagement",
                        },
                        {
                          icon: "Star",
                          title: "Excellence",
                          description:
                            "Delivering quality experiences every day",
                        },
                      ]
                    ).map((value: any, i: number) => (
                      <div
                        key={i}
                        className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                          <DynamicIcon
                            name={value.icon}
                            className="h-6 w-6 text-primary"
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2">
                          {value.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {value.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. FOUNDER'S MESSAGE */}
            {layout === "founder-message" && (
              <div className="max-w-5xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    {content.title || "A Message from Our Founder"}
                  </h1>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-start">
                  {/* Founder Image */}
                  <div className="md:col-span-1">
                    <div className="sticky top-8">
                      {content.founderImage ? (
                        <img
                          src={content.founderImage}
                          alt="Founder"
                          className="rounded-2xl w-full aspect-square object-cover border-4 border-primary/20"
                        />
                      ) : (
                        <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl flex items-center justify-center">
                          <div className="text-6xl">👤</div>
                        </div>
                      )}
                      <div className="mt-4 text-center">
                        <h3 className="font-bold text-lg">
                          {content.founderName || "John Doe"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {content.founderTitle || "Founder & CEO"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="md:col-span-2 space-y-6">
                    <div className="text-6xl text-primary/20">"</div>
                    <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                      <p>
                        {content.message ||
                          "When we started this journey, we had a simple vision: to create a platform where communities could truly thrive."}
                      </p>
                      <p>
                        {content.message2 ||
                          "Today, I'm proud to see thousands of communities using our platform to connect, collaborate, and achieve their goals together."}
                      </p>
                      <p>
                        {content.message3 ||
                          "This is just the beginning. We're committed to continuously improving and innovating to serve you better."}
                      </p>
                    </div>
                    {content.signature && (
                      <div className="pt-6">
                        <img
                          src={content.signature}
                          alt="Signature"
                          className="h-16"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. IMPACT & GROWTH */}
            {layout === "impact-growth" && (
              <div className="space-y-16">
                <div className="text-center max-w-4xl mx-auto space-y-6">
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    {content.title || "Our Impact"}
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    {content.subtitle ||
                      "Measuring success through community growth and engagement"}
                  </p>
                </div>

                {/* Key Metrics */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {(
                    content.stats || [
                      { value: "50K+", label: "Active Members", icon: "Users" },
                      {
                        value: "1M+",
                        label: "Connections Made",
                        icon: "Heart",
                      },
                      { value: "200+", label: "Communities", icon: "Globe" },
                      {
                        value: "98%",
                        label: "Satisfaction Rate",
                        icon: "Star",
                      },
                    ]
                  ).map((stat: any, i: number) => (
                    <div
                      key={i}
                      className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl p-6 text-center"
                    >
                      <DynamicIcon
                        name={stat.icon}
                        className="h-8 w-8 text-primary mx-auto mb-3"
                      />
                      <div className="text-4xl font-bold text-primary mb-2">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Growth Chart Placeholder */}
                <div className="bg-card border rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6">Growth Over Time</h2>
                  <div className="h-64 bg-gradient-to-t from-primary/5 to-transparent rounded-lg flex items-end justify-around p-4">
                    {[40, 60, 55, 75, 70, 90, 85, 100].map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 mx-1 bg-primary/20 hover:bg-primary/40 transition-colors rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    ))}
                  </div>
                  <div className="flex justify-around mt-4 text-xs text-muted-foreground">
                    {[
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                    ].map((month, i) => (
                      <span key={i}>{month}</span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div>
                  <h2 className="text-3xl font-bold text-center mb-8">
                    Key Achievements
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {(
                      content.achievements || [
                        {
                          year: "2024",
                          title: "Best Community Platform Award",
                          description:
                            "Recognized for innovation in community building",
                        },
                        {
                          year: "2023",
                          title: "Reached 50K Members",
                          description: "Milestone achievement in user growth",
                        },
                        {
                          year: "2022",
                          title: "Series A Funding",
                          description:
                            "Secured $10M to expand platform features",
                        },
                        {
                          year: "2021",
                          title: "Product Launch",
                          description:
                            "Successfully launched v1.0 to the public",
                        },
                      ]
                    ).map((achievement: any, i: number) => (
                      <div
                        key={i}
                        className="flex gap-4 bg-card border rounded-lg p-6"
                      >
                        <div className="text-2xl font-bold text-primary">
                          {achievement.year}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold mb-1">
                            {achievement.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. SIMPLE OVERVIEW */}
            {layout === "simple-overview" && (
              <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-6">
                  <h1 className="text-4xl sm:text-5xl font-bold">
                    {content.title || "About Us"}
                  </h1>
                  <p className="text-xl text-muted-foreground leading-relaxed">
                    {content.description ||
                      "We're on a mission to empower communities worldwide."}
                  </p>
                </div>

                {/* Main Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {content.intro ||
                      "Founded in 2020, we've been dedicated to creating tools that help communities thrive. Our platform brings people together, facilitates meaningful connections, and provides the resources needed for collective success."}
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-6 py-8 border-y">
                  {(
                    content.quickStats || [
                      { value: "50K+", label: "Members" },
                      { value: "200+", label: "Communities" },
                      { value: "4.9/5", label: "Rating" },
                    ]
                  ).map((stat: any, i: number) => (
                    <div key={i} className="text-center">
                      <div className="text-3xl font-bold text-primary mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* What We Do */}
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold">What We Do</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {(
                      content.features || [
                        {
                          icon: "Users",
                          title: "Community Building",
                          description:
                            "Tools to create and manage thriving communities",
                        },
                        {
                          icon: "MessageSquare",
                          title: "Engagement",
                          description:
                            "Features that drive meaningful interactions",
                        },
                        {
                          icon: "BarChart",
                          title: "Analytics",
                          description:
                            "Insights to understand and grow your community",
                        },
                        {
                          icon: "Shield",
                          title: "Security",
                          description: "Enterprise-grade security and privacy",
                        },
                      ]
                    ).map((feature: any, i: number) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <DynamicIcon
                            name={feature.icon}
                            className="h-5 w-5 text-primary"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">
                            {feature.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="bg-primary/10 rounded-xl p-8 text-center">
                  <h3 className="text-2xl font-bold mb-3">Ready to Join Us?</h3>
                  <p className="text-muted-foreground mb-6">
                    {content.ctaText || "Start building your community today"}
                  </p>
                  <a
                    href={content.ctaHref || "#"}
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity inline-block"
                  >
                    {content.ctaButtonText || "Get Started"}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {type === "jobs" && (
        <div className="py-16 px-8 bg-background">
          <div className="max-w-7xl mx-auto">
            {content.title && (
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-3">{content.title}</h2>
                {content.description && (
                  <p className="text-muted-foreground text-lg">
                    {content.description}
                  </p>
                )}
              </div>
            )}

            {/* 1. GRID CARDS */}
            {layout === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(content.jobs || []).map((job: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {job.logo && (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-lg mb-1">
                          {job.title || "Job Title"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {job.company || "Company Name"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>📍</span>
                        <span>{job.location || "Location"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                          {job.type || "Full-time"}
                        </span>
                        {job.salary && (
                          <span className="text-sm font-semibold">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.tags.slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-muted text-xs rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* 2. LIST VIEW */}
            {layout === "list" && (
              <div className="space-y-4">
                {(content.jobs || []).map((job: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start gap-6">
                      {job.logo && (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-16 h-16 rounded-lg object-cover border flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-xl mb-1">
                              {job.title || "Job Title"}
                            </h3>
                            <p className="text-muted-foreground">
                              {job.company || "Company Name"}
                            </p>
                          </div>
                          {job.salary && (
                            <span className="font-bold text-lg text-primary">
                              {job.salary}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {job.description || "Job description..."}
                        </p>
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>📍</span>
                            <span>{job.location || "Location"}</span>
                          </div>
                          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                            {job.type || "Full-time"}
                          </span>
                          {job.tags && job.tags.length > 0 && (
                            <div className="flex gap-2">
                              {job.tags
                                .slice(0, 4)
                                .map((tag: string, i: number) => (
                                  <span
                                    key={i}
                                    className="px-2 py-1 bg-muted text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. COMPACT */}
            {layout === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(content.jobs || []).map((job: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {job.logo && (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-10 h-10 rounded object-cover border"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold truncate">
                          {job.title || "Job Title"}
                        </h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {job.company || "Company"}
                        </p>
                      </div>
                      {job.salary && (
                        <span className="text-sm font-semibold text-primary whitespace-nowrap">
                          {job.salary}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-sm flex-wrap">
                      <span className="text-muted-foreground">
                        📍 {job.location || "Location"}
                      </span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs">
                        {job.type || "Full-time"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. FEATURED */}
            {layout === "masonry" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(content.jobs || []).map((job: any, index: number) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-card to-muted/20 border-2 rounded-2xl p-8 hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      {job.logo && (
                        <img
                          src={job.logo}
                          alt={job.company}
                          className="w-16 h-16 rounded-xl object-cover border-2 shadow-md"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-2xl mb-2">
                          {job.title || "Job Title"}
                        </h3>
                        <p className="text-lg text-muted-foreground">
                          {job.company || "Company Name"}
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {job.description || "Job description goes here..."}
                    </p>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="font-medium">
                          {job.location || "Location"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg font-medium">
                          {job.type || "Full-time"}
                        </span>
                        {job.salary && (
                          <span className="font-bold text-xl text-primary">
                            {job.salary}
                          </span>
                        )}
                      </div>
                    </div>
                    {job.tags && job.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {job.tags.map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-background border rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {(content.jobs || []).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No jobs yet. Add jobs in the settings panel.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- MARKETPLACE RENDERER --- */}
      {type === "marketplace" && (
        <div className="py-16 px-8 bg-muted/10">
          <div className="max-w-7xl mx-auto">
            {content.title && (
              <div className="mb-12">
                <h2 className="text-4xl font-bold mb-3">{content.title}</h2>
                {content.description && (
                  <p className="text-muted-foreground text-lg">
                    {content.description}
                  </p>
                )}
              </div>
            )}

            {/* 1. GRID CARDS */}
            {layout === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {(content.products || []).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    {product.image && (
                      <div className="aspect-square bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold mb-1 line-clamp-2">
                        {product.name || "Product Name"}
                      </h3>
                      {product.category && (
                        <p className="text-xs text-muted-foreground mb-2">
                          {product.category}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-primary">
                          ${product.price || "0.00"}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-sm font-medium">
                              {product.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 2. LIST VIEW */}
            {layout === "list" && (
              <div className="space-y-4">
                {(content.products || []).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex gap-4">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-32 h-32 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-bold text-xl mb-1">
                              {product.name || "Product Name"}
                            </h3>
                            {product.category && (
                              <p className="text-sm text-muted-foreground">
                                {product.category}
                              </p>
                            )}
                          </div>
                          <span className="font-bold text-2xl text-primary">
                            ${product.price || "0.00"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {product.description || "Product description..."}
                        </p>
                        <div className="flex items-center gap-4">
                          {product.seller && (
                            <span className="text-sm text-muted-foreground">
                              Sold by: {product.seller}
                            </span>
                          )}
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="text-sm font-medium">
                                {product.rating} / 5
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. MASONRY */}
            {layout === "masonry" && (
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {(content.products || []).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="break-inside-avoid bg-card border rounded-xl overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    {product.image && (
                      <div className="w-full bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold mb-2">
                        {product.name || "Product Name"}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mb-3">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg text-primary">
                          ${product.price || "0.00"}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            <span className="text-yellow-500">★</span>
                            <span className="text-sm">{product.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. FEATURED CARDS */}
            {layout === "cards" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {(content.products || []).map((product: any, index: number) => (
                  <div
                    key={index}
                    className="bg-card border-2 rounded-2xl overflow-hidden hover:shadow-2xl transition-all cursor-pointer group"
                  >
                    {product.image && (
                      <div className="aspect-[4/3] bg-muted overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {product.category && (
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                          {product.category}
                        </span>
                      )}
                      <h3 className="font-bold text-xl mb-2">
                        {product.name || "Product Name"}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {product.description || "Product description..."}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="font-bold text-2xl text-primary">
                          ${product.price || "0.00"}
                        </span>
                        {product.rating && (
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  "text-lg",
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-500"
                                    : "text-gray-300"
                                )}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {(content.products || []).length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No products yet. Add products in the settings panel.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CONTACT RENDERER --- */}
      {type === "contact" && <ContactRenderer module={module} previewDevice={previewDevice} />}
      
      {/* --- PRIVACY POLICY RENDERER --- */}
      {type === "privacy-policy" && <PrivacyPolicyRenderer module={module} previewDevice={previewDevice} />}

      {/* --- TEAM MEMBERS RENDERER --- */}
      {type === "team-members" && <TeamMembersRenderer module={module} previewDevice={previewDevice} />}

      {/* --- TERMS RENDERER --- */}
      {type === "terms-conditions" && <TermsRenderer module={module} previewDevice={previewDevice} />}

      {/* --- FAQ RENDERER --- */}
      {type === "faq" && <FaqRenderer module={module} previewDevice={previewDevice} />}

      {/* --- FOOTER RENDERER (5 VARIANTS) --- */}
      {type === "footer" && (
        <div
          className={cn(
            "bg-slate-900 text-white w-full",
            layout === "columns" && "py-16 px-8",
            layout === "simple" && "py-8 px-8",
            layout === "minimal" && "py-6 px-8 border-t border-slate-800",
            layout === "corporate" && "py-12 px-8 bg-slate-950",
            layout === "newsletter" &&
              "py-16 px-8 bg-gradient-to-br from-slate-900 to-slate-800"
          )}
        >
          {/* 1. COLUMNS: Classic Logo + Multi-column Links */}
          {layout === "columns" && (
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">
              <div className="max-w-xs space-y-4">
                <div className="bg-white/10 p-2 rounded w-fit">
                  <LogoRenderer
                    content={{
                      ...content,
                      logoType: content.logoType || "text",
                      logoText: content.logoText || "Brand",
                    }}
                  />
                </div>
                <p className="opacity-60 text-sm leading-relaxed">
                  {content.description ||
                    "Building the future of communities, one block at a time."}
                </p>
                <div className="flex gap-4 opacity-50">
                  {content.socialLinks?.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.platform}
                      className="hover:opacity-100 transition-opacity"
                    >
                      <DynamicIcon name={link.platform} className="h-5 w-5" />
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex gap-16 flex-wrap">
                {content.menuItems?.map((col: MenuItem) => (
                  <div key={col.id} className="space-y-4 min-w-[120px]">
                    <div className="font-bold text-white tracking-wider text-sm uppercase">
                      {col.label}
                    </div>
                    <ul className="space-y-2 opacity-70 text-sm">
                      {col.children?.map((link: MenuItem) => (
                        <li
                          key={link.id}
                          className="hover:text-primary transition-colors cursor-pointer flex items-center gap-2"
                        >
                          {link.icon && (
                            <DynamicIcon name={link.icon} className="h-3 w-3" />
                          )}
                          {link.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. SIMPLE: Center Stacked */}
          {layout === "simple" && (
            <div className="flex flex-col items-center text-center gap-6">
              <LogoRenderer content={content} />
              <div className="flex gap-8 text-sm opacity-80 flex-wrap justify-center">
                {content.menuItems?.map((item: MenuItem) => (
                  <span
                    key={item.id}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
              <p className="text-xs opacity-40">{content.description}</p>
            </div>
          )}

          {/* 3. MINIMAL: Split Legal/Copyright */}
          {layout === "minimal" && (
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
              <div className="font-semibold">
                {content.logoText || "Brand"} © 2024
              </div>
              <div className="flex gap-6">
                {content.menuItems?.map((item: MenuItem) => (
                  <span
                    key={item.id}
                    className="hover:text-white cursor-pointer transition-colors"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. CORPORATE: Top Links, Bottom Legal */}
          {layout === "corporate" && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-white/10">
                <div className="col-span-1 space-y-4">
                  <LogoRenderer content={content} />
                  <p className="text-sm opacity-60">{content.description}</p>
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-4">
                  {content.menuItems?.slice(0, 3).map((col: MenuItem) => (
                    <div key={col.id} className="space-y-4">
                      <div className="font-bold text-white">{col.label}</div>
                      <ul className="space-y-2 opacity-60 text-sm">
                        {col.children?.map((link: MenuItem) => (
                          <li
                            key={link.id}
                            className="hover:text-white cursor-pointer"
                          >
                            {link.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center text-xs opacity-40">
                <p>© 2024 {content.logoText}. All rights reserved.</p>
                <div className="flex gap-4 items-center">
                  {content.socialLinks?.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      <DynamicIcon name={link.platform} className="h-4 w-4" />
                    </a>
                  ))}
                  <span className="opacity-40">|</span>
                  <span>Privacy Policy</span>
                  <span>Terms of Service</span>
                  <span>Cookies</span>
                </div>
              </div>
            </div>
          )}

          {/* 5. NEWSLETTER: CTA Focus */}
          {layout === "newsletter" && (
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold">Stay up to date</h3>
                <p className="opacity-70 max-w-md">
                  {content.description ||
                    "Join our newsletter to receive the latest updates and exclusive offers directly in your inbox."}
                </p>
                <div className="flex gap-2 max-w-sm pt-2">
                  <input
                    className="bg-white/10 border-white/20 rounded px-4 py-2 text-sm w-full placeholder:text-white/30 text-white"
                    placeholder="Enter your email"
                  />
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded font-medium text-sm">
                    Subscribe
                  </button>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-8 justify-items-end">
                {content.menuItems?.slice(0, 2).map((col: MenuItem) => (
                  <div key={col.id} className="text-right space-y-3">
                    <div className="font-bold">{col.label}</div>
                    <ul className="space-y-2 opacity-60 text-sm">
                      {col.children?.map((link: MenuItem) => (
                        <li
                          key={link.id}
                          className="hover:text-white cursor-pointer"
                        >
                          {link.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {![
        "hero",
        "navbar",
        "communities",
        "footer",
        "ceo-message",
        "testimonials",
      ].includes(type) && (
        <div className="p-12 bg-background border-y">
          <div className="text-center opacity-50">
            <h2 className="text-xl font-bold uppercase tracking-widest mb-2">
              {type.replace("-", " ")}
            </h2>
            <p className="text-sm">Layout: {layout}</p>
            {content.description && (
              <p className="text-xs mt-2">{content.description}</p>
            )}
          </div>
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
  } = useWebsiteBuilderStore();

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const modules = currentPage?.modules || [];
  const enabledModules = modules.filter((m) => m.isEnabled);

  // Theme Font Mapping
  const THEME_FONT_MAP: Record<ThemeType, string> = {
    academia: "var(--font-playfair)", // Serif
    enterprise: "var(--font-inter)", // Clean Sans
    creator: "var(--font-space-grotesk)", // Default / Grotesk
    association: "var(--font-inter)", // Clean Sans
    startup: "var(--font-outfit)", // Modern Sans
    "dark-mode": "var(--font-inter)"
  };

  return (
    <div className="flex flex-col h-full bg-slate-100 dark:bg-slate-900 relative transition-colors">
      {/* Simulation Bar */}
      <div className="h-12 border-b bg-white dark:bg-black flex items-center justify-between px-4 sticky top-0 z-20 shadow-sm shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setPreviewDevice("desktop")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewDevice === "desktop"
                  ? "bg-white shadow text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Laptop className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewDevice("tablet")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewDevice === "tablet"
                  ? "bg-white shadow text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Tablet className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPreviewDevice("mobile")}
              className={cn(
                "p-1.5 rounded-md transition-all",
                previewDevice === "mobile"
                  ? "bg-white shadow text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-4 w-4" />
            </button>
          </div>
          <span className="text-xs text-muted-foreground ml-2">
            {previewDevice === "desktop"
              ? "1280px"
              : previewDevice === "tablet"
              ? "768px"
              : "375px"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground mr-2">
            Live Preview • {currentTheme} theme
          </span>
          <button className="text-xs font-semibold bg-primary text-primary-foreground px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity">
            Publish
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-auto bg-muted/30 p-4">
        <div
          className={cn(
            "mx-auto transition-all duration-300 bg-white shadow-lg overflow-hidden",
            previewDevice === "desktop" && "w-full",
            previewDevice === "tablet" && "w-[768px] rounded-xl border my-4",
            previewDevice === "mobile" &&
              "w-[375px] rounded-2xl border-8 border-slate-800 my-4 shadow-2xl"
          )}
          style={{
            width: previewDevice === "desktop" ? "100%" : undefined,
            maxWidth: previewDevice === "desktop" ? "100%" : undefined,
            transform:
              previewDevice === "tablet"
                ? "scale(0.9)"
                : previewDevice === "mobile"
                ? "scale(0.85)"
                : "scale(1)",
            transformOrigin: "top center",
            fontFamily: THEME_FONT_MAP[currentTheme],
          }}
        >
          <div
            className="w-full overflow-auto"
            style={{
              maxHeight:
                previewDevice === "mobile"
                  ? "667px"
                  : previewDevice === "tablet"
                  ? "1024px"
                  : "none",
            }}
          >
            {enabledModules.map((module) => (
              <ModuleRenderer
                key={module.id}
                module={module}
                theme={currentTheme}
                previewDevice={previewDevice}
              />
            ))}
            {enabledModules.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-muted-foreground opacity-50">
                <p>All modules are hidden.</p>
                <p className="text-sm">
                  Enable modules from the left panel to see them here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
