import { cn } from "@/lib/utils";
import { LogoRenderer } from "./logo-renderer";
import { DynamicIcon } from "./dynamic-icon";
import { MenuItem } from "@/store/useWebsiteBuilderStore";

interface LivePreviewFooterProps {
  content: Record<string, any>;
  layout: string;
}

export const LivePreviewFooter = ({
  content,
  layout,
}: LivePreviewFooterProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "bg-slate-900 text-white w-full",
        layout === "columns" && "py-16 px-8",
        layout === "simple" && "py-8 px-8",
        layout === "minimal" && "py-6 px-8 border-t border-slate-800",
        layout === "corporate" && "py-12 px-8 bg-slate-950",
        layout === "newsletter" &&
          "py-16 px-8 bg-linear-to-br from-slate-900 to-slate-800",
        layout === "default" && "py-8 px-8"
      )}
    >
      {/* 1. COLUMNS: Classic Logo + Multi-column Links */}
      {layout === "columns" && (
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Brand Column */}
            <div className="md:col-span-1 space-y-4">
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
              {/* Social Links */}
              {content.socialLinks && content.socialLinks.length > 0 && (
                <div className="flex gap-4 opacity-50">
                  {content.socialLinks.map((link: any, i: number) => (
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
              )}
            </div>

            {/* Menu Columns */}
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-8">
              {content.menuItems?.slice(0, 3).map((col: MenuItem) => (
                <div key={col.id} className="space-y-4">
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

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-40">
            <div>{content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}. All rights reserved.`}</div>
            <div className="flex gap-6">
              <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. SIMPLE: Center Stacked */}
      {layout === "simple" && (
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center gap-6">
            <LogoRenderer content={content} />
            <nav className="flex gap-8 text-sm opacity-80 flex-wrap justify-center">
              {content.menuItems?.map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </nav>
            {content.description && (
              <p className="text-sm opacity-60 max-w-md">{content.description}</p>
            )}
            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4 opacity-50">
                {content.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon name={link.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
            <div className="text-xs opacity-40 mt-4">
              {content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}`}
            </div>
          </div>
        </div>
      )}

      {/* 3. MINIMAL: Split Legal/Copyright */}
      {layout === "minimal" && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs opacity-60">
            <div className="font-semibold">
              {content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}`}
            </div>
            <nav className="flex gap-6">
              {content.menuItems?.map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </nav>
            {/* Social Links */}
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4">
                {content.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
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
        </div>
      )}

      {/* 4. CORPORATE: Top Links, Bottom Legal */}
      {layout === "corporate" && (
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1 space-y-4">
              <LogoRenderer content={content} />
              {content.description && (
                <p className="text-sm opacity-60 leading-relaxed">
                  {content.description}
                </p>
              )}
            </div>
            {content.menuItems?.slice(0, 3).map((col: MenuItem) => (
              <div key={col.id} className="space-y-4">
                <div className="font-semibold text-white text-sm">
                  {col.label}
                </div>
                <ul className="space-y-2 opacity-70 text-sm">
                  {col.children?.map((link: MenuItem) => (
                    <li
                      key={link.id}
                      className="hover:text-white cursor-pointer transition-colors"
                    >
                      {link.label}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-xs opacity-40">
              {content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}. All rights reserved.`}
            </div>
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4 opacity-50">
                {content.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon name={link.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. NEWSLETTER: Newsletter signup focus */}
      {layout === "newsletter" && (
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h3 className="text-2xl font-bold">Stay Updated</h3>
            <p className="opacity-60 text-sm max-w-md mx-auto">
              {content.description || "Subscribe to our newsletter for the latest updates and news."}
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links & Social */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10">
            <nav className="flex gap-6 text-sm opacity-80">
              {content.menuItems?.slice(0, 4).map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </nav>
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4 opacity-50">
                {content.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon name={link.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="text-center text-xs opacity-40 pt-4">
            {content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}`}
          </div>
        </div>
      )}

      {/* Default Fallback */}
      {layout === "default" && (
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <LogoRenderer content={content} />
            <nav className="flex gap-6 text-sm opacity-80">
              {content.menuItems?.map((item: MenuItem) => (
                <span
                  key={item.id}
                  className="hover:text-white cursor-pointer transition-colors"
                >
                  {item.label}
                </span>
              ))}
            </nav>
            {content.socialLinks && content.socialLinks.length > 0 && (
              <div className="flex gap-4 opacity-50">
                {content.socialLinks.map((link: any, i: number) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:opacity-100 transition-opacity"
                  >
                    <DynamicIcon name={link.platform} className="h-5 w-5" />
                  </a>
                ))}
              </div>
            )}
          </div>
          <div className="text-center text-xs opacity-40 mt-6">
            {content.copyrightText || `© ${currentYear} ${content.logoText || "Brand"}`}
          </div>
        </div>
      )}
    </footer>
  );
};
