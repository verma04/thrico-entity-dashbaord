import React from "react";
import { cn } from "@/lib/utils";
import { LogoRenderer } from "./logo-renderer";
import { DynamicIcon } from "./dynamic-icon";
import { MenuItem } from "@/store/useWebsiteBuilderStore";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Phone,
  Building,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Globe,
  Code2,
} from "lucide-react";

interface LivePreviewFooterProps {
  content: Record<string, any>;
  layout: string;
  previewDevice?: "mobile" | "desktop";
}

const DEFAULT_MENU_COLUMNS: MenuItem[] = [
  {
    id: "col-product",
    label: "Product",
    children: [
      { id: "p1", label: "Features", link: "#" },
      { id: "p2", label: "Integrations", link: "#" },
      { id: "p3", label: "Changelog", link: "#" },
      { id: "p4", label: "Roadmap", link: "#" },
    ],
  },
  {
    id: "col-resources",
    label: "Resources",
    children: [
      { id: "r1", label: "Documentation", link: "#" },
      { id: "r2", label: "Community", link: "#" },
      { id: "r3", label: "Help Center", link: "#" },
      { id: "r4", label: "API Reference", link: "#" },
    ],
  },
  {
    id: "col-company",
    label: "Company",
    children: [
      { id: "c1", label: "About Us", link: "#" },
      { id: "c2", label: "Careers", link: "#" },
      { id: "c3", label: "Press & News", link: "#" },
      { id: "c4", label: "Contact", link: "#" },
    ],
  },
];

const DEFAULT_FLAT_LINKS: MenuItem[] = [
  { id: "l1", label: "Home", link: "#" },
  { id: "l2", label: "Features", link: "#" },
  { id: "l3", label: "Pricing", link: "#" },
  { id: "l4", label: "Blog", link: "#" },
  { id: "l5", label: "Support", link: "#" },
  { id: "l6", label: "Contact", link: "#" },
];

export const LivePreviewFooter = ({
  content,
  layout,
  previewDevice = "desktop",
}: LivePreviewFooterProps) => {
  const currentYear = new Date().getFullYear();

  const customBg = content?.containerSettings?.background;
  const customText = content?.containerSettings?.textColor;

  const isMobile = previewDevice === "mobile";

  // Menu items resolution
  const hasMenuItems = content.menuItems && content.menuItems.length > 0;
  const menuColumns = hasMenuItems ? content.menuItems : DEFAULT_MENU_COLUMNS;

  // Flattened links for simple/minimal layouts
  const flatLinks: MenuItem[] = hasMenuItems
    ? content.menuItems.flatMap((item: MenuItem) =>
        item.children && item.children.length > 0 ? item.children : [item]
      )
    : DEFAULT_FLAT_LINKS;

  const socialLinks =
    content.socialLinks && content.socialLinks.length > 0
      ? content.socialLinks.filter((l: any) => l.platform || l.url)
      : [
          { platform: "twitter", url: "#" },
          { platform: "linkedin", url: "#" },
          { platform: "github", url: "#" },
          { platform: "instagram", url: "#" },
        ];

  const brandName = content.logoText || "Brand";
  const copyright =
    content.copyrightText ||
    `© ${currentYear} ${brandName}. All rights reserved.`;

  return (
    <footer
      className={cn(
        "w-full transition-colors relative overflow-hidden",
        !customBg && "bg-slate-900",
        !customText && "text-white",
        layout === "columns" && (isMobile ? "py-10 px-4" : "py-16 px-8"),
        layout === "simple" && (isMobile ? "py-10 px-4" : "py-14 px-8"),
        layout === "minimal" &&
          (isMobile
            ? "py-6 px-4 border-t border-current/10"
            : "py-6 px-8 border-t border-current/10"),
        layout === "corporate" && (isMobile ? "py-10 px-4" : "py-16 px-8"),
        layout === "newsletter" && (isMobile ? "py-12 px-4" : "py-16 px-8"),
        (layout === "custom-html" || layout === "html") && "py-0 px-0",
        layout === "default" && "py-10 px-8"
      )}
      style={{
        ...(customBg ? { background: customBg } : {}),
        ...(customText ? { color: customText } : {}),
      }}
    >
      {/* ─────────────────────────────────────────────────────────────
          1. COLUMNS: Classic Multi-Column Grid
         ───────────────────────────────────────────────────────────── */}
      {layout === "columns" && (
        <div className="max-w-7xl mx-auto space-y-12">
          <div
            className={cn(
              "grid gap-10",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"
            )}
          >
            {/* Brand Column */}
            <div
              className={cn(
                "space-y-4",
                isMobile ? "col-span-1" : "md:col-span-4"
              )}
            >
              <div className="p-1 rounded inline-block">
                <LogoRenderer
                  content={{
                    ...content,
                    logoType: content.logoType || "text",
                    logoText: brandName,
                  }}
                />
              </div>

              <p className="opacity-70 text-sm leading-relaxed max-w-sm">
                {content.description ||
                  "Empowering teams and modern communities with intuitive workspace tools, high-speed collaboration, and secure infrastructure."}
              </p>

              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2 pt-1 flex-wrap">
                  {socialLinks.map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={link.platform}
                      className="w-8 h-8 rounded-full bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all duration-200 hover:scale-105"
                    >
                      <DynamicIcon
                        name={link.platform}
                        className="h-4 w-4 opacity-80 hover:opacity-100"
                      />
                    </a>
                  ))}
                </div>
              )}

              {/* Optional Mini Newsletter Snippet */}
              {content.showNewsletterSnippet && (
                <div className="pt-3 max-w-xs space-y-2">
                  <span className="text-xs font-semibold tracking-wide uppercase opacity-75">
                    Subscribe
                  </span>
                  <div className="flex gap-1.5">
                    <input
                      type="email"
                      placeholder="Email address..."
                      readOnly
                      className="flex-1 px-3 py-1.5 text-xs rounded-md bg-current/10 border border-current/20 focus:outline-none placeholder:opacity-50"
                    />
                    <button
                      type="button"
                      className="px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-1 shrink-0"
                    >
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Menu Columns */}
            <div
              className={cn(
                "grid gap-8",
                isMobile
                  ? "grid-cols-2"
                  : "md:col-span-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-3"
              )}
            >
              {menuColumns.slice(0, 4).map((col: MenuItem) => (
                <div key={col.id} className="space-y-3.5">
                  <div className="font-semibold text-xs tracking-wider uppercase opacity-90 flex items-center gap-1.5">
                    {col.label}
                  </div>
                  <ul className="space-y-2 text-xs opacity-75">
                    {col.children && col.children.length > 0 ? (
                      col.children.map((link: MenuItem) => (
                        <li key={link.id}>
                          <span className="hover:opacity-100 hover:underline transition-opacity cursor-pointer flex items-center gap-1.5 py-0.5">
                            {link.icon && (
                              <DynamicIcon
                                name={link.icon}
                                className="h-3 w-3 opacity-70"
                              />
                            )}
                            {link.label}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="hover:opacity-100 hover:underline transition-opacity cursor-pointer">
                          {col.label} Overview
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-current/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs opacity-60">
            <div>{copyright}</div>
            <div className="flex items-center gap-5 flex-wrap">
              <span className="hover:opacity-100 cursor-pointer transition-opacity">
                Privacy Policy
              </span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">
                Terms of Service
              </span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">
                Cookie Preferences
              </span>
              <span className="hover:opacity-100 cursor-pointer transition-opacity">
                Security
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          2. SIMPLE: Center Stacked & Refined
         ───────────────────────────────────────────────────────────── */}
      {layout === "simple" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6">
            {/* Optional Badge */}
            {content.badgeText && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-current/10 text-xs font-medium backdrop-blur-sm">
                <Globe className="h-3 w-3 opacity-70" />
                <span>{content.badgeText}</span>
              </div>
            )}

            <div className="p-1 rounded">
              <LogoRenderer content={content} />
            </div>

            {content.description !== false && (
              <p className="text-xs sm:text-sm opacity-70 max-w-lg leading-relaxed">
                {content.description ||
                  "A minimalist, beautifully engineered experience designed to keep you connected with the community."}
              </p>
            )}

            {/* Navigation Row */}
            <nav className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm opacity-80 flex-wrap justify-center font-medium">
              {flatLinks.slice(0, 6).map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:opacity-100 hover:underline cursor-pointer transition-all px-1.5 py-0.5"
                >
                  {item.label}
                </span>
              ))}
            </nav>

            {/* Social Links Pills */}
            {socialLinks.length > 0 && (
              <div className="flex gap-2.5 opacity-80 pt-1">
                {socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="w-8 h-8 rounded-full bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all duration-200 hover:scale-110"
                  >
                    <DynamicIcon
                      name={link.platform}
                      className="h-4 w-4 opacity-80"
                    />
                  </a>
                ))}
              </div>
            )}

            {/* Divider & Copyright */}
            <div className="w-full max-w-xs pt-4 border-t border-current/10 text-xs opacity-50">
              {copyright}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          3. MINIMAL: Single Horizontal Clean Bar
         ───────────────────────────────────────────────────────────── */}
      {layout === "minimal" && (
        <div className="max-w-7xl mx-auto">
          <div
            className={cn(
              "flex items-center justify-between gap-4 text-xs",
              isMobile
                ? "flex-col items-center text-center space-y-3"
                : "flex-row"
            )}
          >
            {/* Left: Brand / Copyright */}
            <div className="flex items-center gap-3">
              <div className="font-semibold tracking-tight">{brandName}</div>
              <span className="opacity-40">•</span>
              <div className="opacity-60">{copyright}</div>
            </div>

            {/* Center: Inline Navigation */}
            <nav className="flex items-center gap-4 sm:gap-6 opacity-75 font-medium flex-wrap justify-center">
              {flatLinks.slice(0, 5).map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:opacity-100 cursor-pointer transition-opacity"
                >
                  {item.label}
                </span>
              ))}
            </nav>

            {/* Right: Status Pill & Socials */}
            <div className="flex items-center gap-4">
              {content.showStatusIndicator !== false && (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-medium text-emerald-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>{content.statusText || "All systems operational"}</span>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="flex items-center gap-2">
                  {socialLinks.slice(0, 4).map((link: any, i: number) => (
                    <a
                      key={i}
                      href={link.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="opacity-60 hover:opacity-100 transition-opacity p-1"
                    >
                      <DynamicIcon
                        name={link.platform}
                        className="h-3.5 w-3.5"
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          4. CORPORATE: Heavy Enterprise Base & Contact Cards
         ───────────────────────────────────────────────────────────── */}
      {layout === "corporate" && (
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Top Corporate Summary Grid */}
          <div
            className={cn(
              "grid gap-8 pb-10 border-b border-current/10",
              isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-12"
            )}
          >
            {/* Left: Identity & Mission */}
            <div
              className={cn(
                "space-y-4",
                isMobile ? "col-span-1" : "md:col-span-5"
              )}
            >
              <div className="p-1 rounded inline-block">
                <LogoRenderer content={content} />
              </div>

              {content.companyName && (
                <div className="text-xs font-semibold tracking-wide uppercase opacity-80">
                  {content.companyName}
                </div>
              )}

              <p className="text-xs sm:text-sm opacity-70 leading-relaxed max-w-md">
                {content.description ||
                  "Global enterprise infrastructure and governance platform powering compliant, performant, and scalable community operations."}
              </p>

              {/* Contact Information Chips */}
              <div className="space-y-2 pt-2 text-xs opacity-80">
                {content.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 opacity-60 text-primary" />
                    <span>{content.address}</span>
                  </div>
                )}
                <div className="flex items-center gap-4 flex-wrap">
                  {content.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 shrink-0 opacity-60 text-primary" />
                      <span>{content.email}</span>
                    </div>
                  )}
                  {content.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 shrink-0 opacity-60 text-primary" />
                      <span>{content.phone}</span>
                    </div>
                  )}
                </div>
                {content.registrationNumber && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] opacity-60">
                    <Building className="h-3 w-3 shrink-0" />
                    <span>{content.registrationNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Multi-column Enterprise Directory */}
            <div
              className={cn(
                "grid gap-8",
                isMobile
                  ? "grid-cols-2"
                  : "md:col-span-7 grid-cols-2 sm:grid-cols-3"
              )}
            >
              {menuColumns.slice(0, 3).map((col: MenuItem) => (
                <div key={col.id} className="space-y-3.5">
                  <div className="font-semibold text-xs uppercase tracking-wider opacity-90">
                    {col.label}
                  </div>
                  <ul className="space-y-2 text-xs opacity-70">
                    {col.children && col.children.length > 0 ? (
                      col.children.map((link: MenuItem) => (
                        <li key={link.id}>
                          <span className="hover:opacity-100 hover:underline cursor-pointer transition-opacity flex items-center gap-1">
                            <ChevronRight className="h-2.5 w-2.5 opacity-40" />
                            {link.label}
                          </span>
                        </li>
                      ))
                    ) : (
                      <li>
                        <span className="hover:opacity-100 hover:underline cursor-pointer">
                          {col.label} Directory
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Bar with Corporate Attributions */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
            <div>{copyright}</div>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-3">
                {socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon
                      name={link.platform}
                      className="h-4 w-4 opacity-75"
                    />
                  </a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              <span className="hover:opacity-100 cursor-pointer">
                Privacy Statement
              </span>
              <span className="hover:opacity-100 cursor-pointer">
                Terms & Conditions
              </span>
              <span className="hover:opacity-100 cursor-pointer">
                Compliance
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          5. NEWSLETTER: Lead Capture Hero Focus
         ───────────────────────────────────────────────────────────── */}
      {layout === "newsletter" && (
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Newsletter Lead Capture Card */}
          <div className="p-8 sm:p-10 rounded-2xl bg-current/5 border border-current/15 backdrop-blur-md shadow-lg text-center space-y-5 relative overflow-hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 text-primary mx-auto mb-1">
              <Mail className="h-6 w-6" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {content.newsletterTitle ||
                  "Stay in the loop with our newsletter"}
              </h3>
              <p className="text-xs sm:text-sm opacity-70 leading-relaxed">
                {content.newsletterDescription ||
                  content.description ||
                  "Get our weekly product updates, design insights, and community highlights delivered directly to your inbox."}
              </p>
            </div>

            {/* Subscription Form */}
            <div className="flex flex-col sm:flex-row gap-2.5 max-w-md mx-auto pt-1">
              <div className="relative flex-1">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 opacity-40" />
                <input
                  type="email"
                  placeholder={
                    content.newsletterPlaceholder ||
                    "Enter your email address..."
                  }
                  readOnly
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-current/10 border border-current/20 focus:outline-none placeholder:opacity-50"
                />
              </div>
              <button
                type="button"
                className="px-6 py-2.5 bg-primary text-primary-foreground text-xs sm:text-sm font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>{content.newsletterButtonText || "Subscribe"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Disclaimer reassurance */}
            <div className="inline-flex items-center gap-1.5 text-[11px] opacity-60 pt-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>
                {content.newsletterDisclaimer ||
                  "We respect your privacy. No spam ever. Unsubscribe at any time."}
              </span>
            </div>
          </div>

          {/* Secondary Row: Brand, Links & Social */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 border-t border-current/10">
            <div className="p-1 rounded">
              <LogoRenderer content={content} />
            </div>

            <nav className="flex gap-5 sm:gap-7 text-xs sm:text-sm opacity-75 font-medium flex-wrap justify-center">
              {flatLinks.slice(0, 5).map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:opacity-100 hover:underline cursor-pointer transition-opacity"
                >
                  {item.label}
                </span>
              ))}
            </nav>

            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2.5 opacity-80">
                {socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={link.platform}
                    className="w-8 h-8 rounded-full bg-current/10 hover:bg-current/20 flex items-center justify-center transition-all duration-200"
                  >
                    <DynamicIcon
                      name={link.platform}
                      className="h-4 w-4 opacity-80"
                    />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-xs opacity-50 pt-2">{copyright}</div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          6. CUSTOM HTML: Manual Upload / Raw HTML
         ───────────────────────────────────────────────────────────── */}
      {(layout === "custom-html" || layout === "html") && (
        <div className="w-full">
          {content.customCss && (
            <style dangerouslySetInnerHTML={{ __html: content.customCss }} />
          )}
          {content.htmlCode?.trim() ? (
            content.renderMode === "iframe" ? (
              <iframe
                srcDoc={`<!DOCTYPE html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><style>${content.customCss || ""}</style></head><body style="margin:0;padding:0;">${content.htmlCode}</body></html>`}
                title="Custom HTML Footer"
                className="w-full border-0 min-h-[140px] overflow-hidden"
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            ) : (
              <div
                className="custom-html-footer-wrapper w-full"
                dangerouslySetInnerHTML={{ __html: content.htmlCode }}
              />
            )
          ) : (
            <div className="p-10 max-w-md mx-auto text-center border border-dashed border-current/20 rounded-2xl bg-current/5 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 text-primary mx-auto flex items-center justify-center">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold">Custom HTML Footer</h4>
                <p className="text-xs opacity-60">
                  Upload an HTML file or write manual HTML in the Footer Manager to display your custom footer here.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Default Fallback
         ───────────────────────────────────────────────────────────── */}
      {layout === "default" && (
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <LogoRenderer content={content} />
            <nav className="flex gap-6 text-sm opacity-80 flex-wrap justify-center">
              {flatLinks.slice(0, 5).map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:opacity-100 cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </nav>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 opacity-60">
                {socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon name={link.platform} className="h-4 w-4" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="text-center text-xs opacity-40 pt-4 border-t border-current/10">
            {copyright}
          </div>
        </div>
      )}
    </footer>
  );
};

