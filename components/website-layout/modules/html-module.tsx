"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import { ModuleData } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { Code, FileCode2 } from "lucide-react";
import { ModuleHeader } from "./module-header";

interface HtmlModuleProps {
  module: ModuleData;
  previewDevice?: "desktop" | "tablet" | "mobile" | string;
}

export const HtmlModule: React.FC<HtmlModuleProps> = ({
  module,
  previewDevice = "desktop",
}) => {
  const { content, layout } = module;
  const htmlCode = content?.htmlCode || content?.embedCode || "";
  // Support layout string values
  let renderMode = content?.renderMode || (layout === "iframe" ? "iframe" : "direct");
  if (layout === "direct") renderMode = "direct";
  if (layout === "iframe") renderMode = "iframe";

  let containerWidth = content?.containerWidth || (layout === "fullwidth-embed" ? "full" : "contained");
  if (layout === "fullwidth-embed") containerWidth = "full";
  if (layout === "contained") containerWidth = "contained";
  const padding = content?.padding || "medium"; // "none" | "small" | "medium" | "large"
  const minHeight = content?.minHeight ? Number(content.minHeight) : 0;
  const customCss = content?.customCss || "";
  const backgroundColor = content?.backgroundColor || "transparent";

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(0);
  const moduleId = module.id || "html-mod";

  const hasContent = htmlCode.trim().length > 0;

  // Auto-resize iframe so it never shows internal scrollbars
  const updateHeightFromIframe = () => {
    if (iframeRef.current) {
      try {
        const doc =
          iframeRef.current.contentDocument ||
          iframeRef.current.contentWindow?.document;
        if (doc && doc.body) {
          const h = Math.max(
            doc.body.scrollHeight,
            doc.documentElement.scrollHeight,
            doc.body.offsetHeight,
            doc.documentElement.offsetHeight
          );
          if (h > 0) {
            setIframeHeight(h);
          }
        }
      } catch (e) {
        // Fallback handled by postMessage
      }
    }
  };

  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === "HTML_MODULE_HEIGHT" &&
        e.data.moduleId === moduleId
      ) {
        if (typeof e.data.height === "number" && e.data.height > 0) {
          setIframeHeight(e.data.height);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [moduleId]);

  // Container sizing classes
  const widthClasses = {
    full: "w-full",
    contained: "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8",
    narrow: "max-w-3xl mx-auto px-4 sm:px-6",
  }[containerWidth as "full" | "contained" | "narrow"] || "max-w-6xl mx-auto px-4 sm:px-6 lg:px-8";

  // Padding classes
  const paddingClasses = {
    none: "py-0",
    small: "py-4 sm:py-6",
    medium: "py-8 sm:py-12",
    large: "py-16 sm:py-24",
  }[padding as "none" | "small" | "medium" | "large"] || "py-8 sm:py-12";

  // Build iframe document for sandboxed mode with auto-height reporter
  const iframeSrcDoc = useMemo(() => {
    if (renderMode !== "iframe") return "";
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
      *, *::before, *::after { box-sizing: border-box; }
      html, body {
        margin: 0;
        padding: 0;
        overflow: hidden !important;
        height: auto !important;
        min-height: 0 !important;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        background: transparent;
        color: inherit;
        line-height: 1.5;
      }
      img, video, iframe { max-width: 100%; }
      ${customCss}
    </style>
    <script>
      function reportHeight() {
        var body = document.body;
        var html = document.documentElement;
        var height = Math.max(
          body ? body.scrollHeight : 0,
          body ? body.offsetHeight : 0,
          html ? html.clientHeight : 0,
          html ? html.scrollHeight : 0,
          html ? html.offsetHeight : 0
        );
        window.parent.postMessage({
          type: 'HTML_MODULE_HEIGHT',
          moduleId: '${moduleId}',
          height: height
        }, '*');
      }
      window.addEventListener('load', reportHeight);
      window.addEventListener('resize', reportHeight);
      document.addEventListener('DOMContentLoaded', reportHeight);
      if (window.ResizeObserver) {
        new ResizeObserver(reportHeight).observe(document.documentElement);
      }
      setTimeout(reportHeight, 50);
      setTimeout(reportHeight, 300);
      setTimeout(reportHeight, 1000);
    </script>
  </head>
  <body>
    ${htmlCode}
  </body>
</html>`;
  }, [htmlCode, customCss, renderMode, moduleId]);

  const effectiveHeight = Math.max(iframeHeight, minHeight);

  return (
    <section
      className={cn("relative w-full transition-all duration-300 overflow-visible", paddingClasses)}
      style={{ backgroundColor }}
    >
      <div className={cn(widthClasses)}>
        {/* Optional Section Header */}
        <ModuleHeader
          title={content?.title}
          description={content?.description}
          alignment="center"
          titleClassName="text-2xl sm:text-3xl font-bold mb-3 tracking-tight"
          descriptionClassName="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto"
          titleColor={content?.titleColor}
          descriptionColor={content?.descriptionColor}
          hideTitle={content?.hideTitle !== undefined ? content.hideTitle : true}
          hideDescription={content?.hideDescription !== undefined ? content.hideDescription : true}
        />

        {/* Content Container */}
        {hasContent ? (
          <div className="w-full relative overflow-visible">
            {renderMode === "iframe" ? (
              <div
                className="w-full transition-all overflow-hidden rounded-lg bg-transparent"
                style={{
                  height: effectiveHeight > 0 ? `${effectiveHeight}px` : "auto",
                  minHeight: minHeight > 0 ? `${minHeight}px` : undefined,
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={iframeSrcDoc}
                  title={content?.title || "Custom HTML"}
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  scrolling="no"
                  onLoad={updateHeightFromIframe}
                  className="w-full border-0 block overflow-hidden"
                  style={{
                    height: effectiveHeight > 0 ? `${effectiveHeight}px` : "100%",
                    minHeight: minHeight > 0 ? `${minHeight}px` : undefined,
                  }}
                />
              </div>
            ) : (
              <div
                className="w-full relative overflow-visible"
                style={{ minHeight: minHeight > 0 ? `${minHeight}px` : undefined }}
              >
                {/* Optional Scoped Style Tag */}
                {customCss && (
                  <style
                    dangerouslySetInnerHTML={{
                      __html: customCss,
                    }}
                  />
                )}
                {/* Direct HTML Injection - no scroll, full height */}
                <div
                  className="custom-html-wrapper w-full overflow-visible"
                  dangerouslySetInnerHTML={{ __html: htmlCode }}
                />
              </div>
            )}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full rounded-2xl border-2 border-dashed border-border/70 p-8 sm:p-14 text-center bg-card/40 backdrop-blur-sm transition-all hover:border-primary/40">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 text-primary shadow-sm">
              <Code className="h-7 w-7" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 flex items-center justify-center gap-2">
              <span>HTML Section</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/15 text-primary border border-primary/20">
                Ready
              </span>
            </h3>
            <p className="text-muted-foreground text-xs sm:text-sm max-w-md mx-auto mb-5 leading-relaxed">
              Upload an HTML file or write custom HTML/CSS code in the settings panel to render custom components, forms, animations, or embeds.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/60 border text-[11px] font-medium text-muted-foreground">
              <FileCode2 className="h-3.5 w-3.5 text-primary" />
              <span>Supports .html files, inline styles &amp; custom CSS</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
