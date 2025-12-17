import { DynamicIcon, LogoRenderer } from "../../preview";
import { cn } from "@/lib/utils";

interface FooterSimpleProps {
  content: Record<string, any>;
  previewDevice: string;
}

export const FooterSimple = ({ content, previewDevice }: FooterSimpleProps) => {
  return (
    <div className="py-8 px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            "flex items-center gap-8",
            previewDevice === "mobile"
              ? "flex-col text-center"
              : "justify-between"
          )}
        >
          <div className="flex items-center gap-8">
            <LogoRenderer content={content} className="text-white" />
            {previewDevice !== "mobile" && (
              <nav className="flex gap-6">
                {["About", "Features", "Pricing", "Contact"].map((item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-slate-300 hover:text-white transition-colors text-sm"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            )}
          </div>

          <div className="flex items-center gap-4">
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
        </div>

        {previewDevice === "mobile" && (
          <nav className="flex flex-wrap justify-center gap-4 mt-6">
            {["About", "Features", "Pricing", "Contact"].map((item) => (
              <a
                key={item}
                href="#"
                className="text-slate-300 hover:text-white transition-colors text-sm"
              >
                {item}
              </a>
            ))}
          </nav>
        )}

        <div className="border-t border-slate-800 mt-8 pt-6 text-center">
          <p className="text-slate-400 text-sm">
            {content.copyright || "© 2024 Thrico Inc. All rights reserved."}
          </p>
        </div>
      </div>
    </div>
  );
};
