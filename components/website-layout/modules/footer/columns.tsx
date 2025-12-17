import { DynamicIcon, LogoRenderer } from "../../preview";
import { cn } from "@/lib/utils";

interface FooterColumnsProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const FooterColumns = ({
  content,
  previewDevice,
}: FooterColumnsProps) => {
  return (
    <div className="py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            "grid gap-8",
            previewDevice === "mobile"
              ? "grid-cols-1"
              : "grid-cols-2 md:grid-cols-4"
          )}
        >
          <div className="space-y-4">
            <LogoRenderer content={content} className="text-white" />
            <p className="text-slate-300 text-sm leading-relaxed">
              {content.description ||
                "Building the future of community platforms."}
            </p>
            <div className="flex gap-3">
              {(content.socialLinks || []).map((link: any, i: number) => (
                <a
                  key={i}
                  href={link.url}
                  className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors"
                >
                  <DynamicIcon name={link.platform} className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Product</h4>
            <ul className="space-y-2">
              {["Features", "Pricing", "Documentation", "Support"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-slate-300 hover:text-white transition-colors text-sm"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Press"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold text-white">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Cookie Policy", "Licenses"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            {content.copyright || "© 2024 Thrico Inc. All rights reserved."}
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-400 hover:text-white transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
