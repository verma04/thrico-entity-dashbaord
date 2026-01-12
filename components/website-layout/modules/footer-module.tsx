import { cn } from "@/lib/utils";
import { LogoRenderer } from "../preview/logo-renderer";
import { DynamicIcon } from "../preview/dynamic-icon";
import { MenuItem } from "@/store/useWebsiteBuilderStore";

interface FooterModuleProps {
  content: Record<string, any>;
  layout: string;
}

export const FooterModule = ({ content, layout }: FooterModuleProps) => {
  return (
    <div
      style={{
        color: content.containerSettings?.textColor,
        background: content.containerSettings?.background,
      }}
      className={cn(
        "w-full",
        !content.containerSettings?.background && "bg-slate-900",
        !content.containerSettings?.textColor && "text-white",
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
            <p>{content.copyrightText}</p>
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
