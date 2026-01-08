import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { ModuleContainer } from "../modules/module-container";
import { ChevronDown, ChevronUp, Mail, MapPin } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface TermsRendererProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile";
}

export const TermsRenderer = ({
  module,
  previewDevice = "desktop",
}: TermsRendererProps) => {
  const { layout, content } = module;
  const isMobile = previewDevice === "mobile";

  const sections = content.sections || [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using this website...",
    },
    {
      title: "2. Use License",
      content: "Permission is granted to temporarily download...",
    },
  ];

  return (
    <ModuleContainer containerSettings={content.containerSettings}>
      {/* 1. SIMPLE TERMS */}
      {layout === "simple-terms" && (
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="border-b pb-8">
            <h1 className="text-4xl font-extrabold tracking-tight mb-4">
              {content.title || "Terms of Service"}
            </h1>
            <p className="text-muted-foreground font-mono text-sm">
              Effective: {content.lastUpdated || "January 1, 2024"}
            </p>
          </div>

          {content.introduction && (
            <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
              <p>{content.introduction}</p>
            </div>
          )}

          <div className="space-y-10">
            {sections.map((section: any, idx: number) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-wide opacity-80">
                  {section.title}
                </h2>
                <div className="prose prose-slate dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                  <p>{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {(content.contactEmail || content.contactAddress) && (
            <div className="pt-12 border-t mt-16 space-y-4">
              <h2 className="text-xl font-bold uppercase tracking-wide opacity-80">
                Contact Information
              </h2>
              <p className="text-muted-foreground">
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                {content.contactEmail && (
                  <li className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      Email:
                    </span>
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="text-primary hover:underline"
                    >
                      {content.contactEmail}
                    </a>
                  </li>
                )}
                {content.contactAddress && (
                  <li className="flex items-start gap-2">
                    <span className="font-semibold text-foreground whitespace-nowrap">
                      Address:
                    </span>
                    <span>{content.contactAddress}</span>
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 2. STRUCTURED AGREEMENT */}
      {layout === "structured-agreement" && (
        <div className={cn("flex gap-12", isMobile && "flex-col")}>
          {/* TOC Sidebar */}
          {!isMobile && (
            <div className="w-64 shrink-0">
              <div className="sticky top-24 space-y-4 border rounded-xl p-6 bg-muted/10">
                <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 opacity-70">
                  Clause Navigator
                </h4>
                <ul className="space-y-2 text-sm">
                  {sections.map((section: any, idx: number) => (
                    <li key={idx}>
                      <a
                        href={`#clause-${idx}`}
                        className="text-muted-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
                {(content.contactEmail || content.contactAddress) && (
                  <div className="pt-4 mt-4 border-t space-y-2">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-tight">
                      Legal Support
                    </p>
                    {content.contactEmail && (
                      <a
                        href={`mailto:${content.contactEmail}`}
                        className="text-xs text-primary hover:underline block truncate"
                      >
                        {content.contactEmail}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex-1 space-y-12">
            <div className="bg-muted p-8 rounded-2xl mb-8">
              <h1 className="text-3xl font-serif font-medium mb-2">
                {content.title || "Terms & Conditions"}
              </h1>
              <p className="opacity-60 text-sm">
                Last Modified: {content.lastUpdated}
              </p>
            </div>

            {content.introduction && (
              <div className="prose prose-lg dark:prose-invert max-w-none text-muted-foreground/90 font-serif leading-relaxed italic border-l-4 pl-6 border-muted bg-slate-50 p-6 rounded-r-xl">
                <p>{content.introduction}</p>
              </div>
            )}

            <div className="space-y-12 counter-reset-clauses">
              {sections.map((section: any, idx: number) => (
                <div
                  key={idx}
                  id={`clause-${idx}`}
                  className="scroll-mt-32 card p-8 border rounded-xl hover:shadow-sm transition-shadow"
                >
                  <h2 className="text-xl font-serif font-bold mb-4 flex items-center gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-sans">
                      {idx + 1}
                    </span>
                    {section.title}
                  </h2>
                  <p className="text-muted-foreground leading-7">
                    {section.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. FAQ STYLE */}
      {layout === "faq-style" && (
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold">
              {content.title || "Legal FAQ"}
            </h1>
            <p className="text-xl text-muted-foreground">
              Common questions about our terms and usage policies.
            </p>
          </div>

          {content.introduction && (
            <div className="max-w-2xl mx-auto text-center text-muted-foreground">
              <p>{content.introduction}</p>
            </div>
          )}

          <div className="grid gap-4">
            {sections.map((section: any, idx: number) => (
              <DropdownSection
                key={idx}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>

          {(content.contactEmail || content.contactAddress) && (
            <div className="pt-12 border-t mt-16 text-center space-y-4 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold">Still have questions?</h2>
              <p className="text-muted-foreground">
                We're here to help clarify any terms or conditions.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                {content.contactEmail && (
                  <div className="flex items-center gap-2 text-primary">
                    <Mail className="h-4 w-4" />
                    <a
                      href={`mailto:${content.contactEmail}`}
                      className="font-semibold"
                    >
                      {content.contactEmail}
                    </a>
                  </div>
                )}
                {content.contactAddress && (
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{content.contactAddress}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </ModuleContainer>
  );
};

// Helper for FAQ Style
const DropdownSection = ({
  title,
  content,
}: {
  title: string;
  content: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border rounded-xl overflow-hidden bg-card transition-all">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-muted/50 transition-colors"
      >
        <span className="font-semibold text-lg">{title}</span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 opacity-50" />
        ) : (
          <ChevronDown className="h-5 w-5 opacity-50" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-muted-foreground leading-relaxed animate-in slide-in-from-top-2">
          {content}
        </div>
      )}
    </div>
  );
};
