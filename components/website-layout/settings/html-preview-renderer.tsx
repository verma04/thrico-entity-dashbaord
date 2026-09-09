"use client";

import React, { useMemo, useRef, useState, useEffect, useId } from "react";
import { IsolatedHtmlRenderer } from "../modules/isolated-html-renderer";
import { cn } from "@/lib/utils";
import { Code2, Tablet, Smartphone } from "lucide-react";

export type PreviewDevice = "desktop" | "tablet" | "mobile";
export type PreviewBg = "light" | "dark" | "checker" | "transparent";

interface HtmlPreviewRendererProps {
  html: string;
  customCss?: string;
  renderMode?: "direct" | "iframe";
  minHeight?: number;
  previewDevice?: PreviewDevice;
  background?: PreviewBg;
  className?: string;
  refreshKey?: number;
}

export const HtmlPreviewRenderer: React.FC<HtmlPreviewRendererProps> = ({
  html,
  customCss = "",
  renderMode = "direct",
  minHeight = 150,
  previewDevice = "desktop",
  background = "light",
  className,
  refreshKey = 0,
}) => {
  const rawId = useId();
  const internalModuleId = useMemo(
    () => `preview-mod-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`,
    [rawId]
  );
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeHeight, setIframeHeight] = useState<number>(0);

  const hasContent = Boolean(html && html.trim().length > 0);

  // Auto-resize iframe
  const updateIframeHeight = () => {
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
      } catch {
        // cross-origin or sandbox restriction fallback
      }
    }
  };

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (
        e.data &&
        e.data.type === "HTML_MODULE_HEIGHT" &&
        e.data.moduleId === internalModuleId
      ) {
        if (typeof e.data.height === "number" && e.data.height > 0) {
          setIframeHeight(e.data.height);
        }
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, [internalModuleId]);

  // Build iframe document for sandboxed mode
  const iframeSrcDoc = useMemo(() => {
    if (renderMode !== "iframe") return "";

    const heightScript = `
      <script>
        function reportHeight() {
          try {
            var body = document.body;
            var html = document.documentElement;
            var height = Math.max(
              body ? body.scrollHeight : 0,
              body ? body.offsetHeight : 0,
              html ? html.clientHeight : 0,
              html ? html.scrollHeight : 0,
              html ? html.offsetHeight : 0
            );
            if (height > 0) {
              window.parent.postMessage({
                type: 'HTML_MODULE_HEIGHT',
                moduleId: '${internalModuleId}',
                height: height
              }, '*');
            }
          } catch (err) {}
        }
        window.addEventListener('load', reportHeight);
        window.addEventListener('resize', reportHeight);
        document.addEventListener('DOMContentLoaded', reportHeight);
        if (window.ResizeObserver) {
          new ResizeObserver(reportHeight).observe(document.documentElement);
          if (document.body) {
            new ResizeObserver(reportHeight).observe(document.body);
          }
        }
        setTimeout(reportHeight, 50);
        setTimeout(reportHeight, 200);
        setTimeout(reportHeight, 600);
      </script>
    `;

    const baseStyles = `
      <base target="_top">
      <style>
        *, *::before, *::after { box-sizing: border-box; }
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
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
    `;

    const isFullDoc = /<!DOCTYPE|<html|<head|<body/i.test(html);
    if (isFullDoc) {
      if (html.includes("</head>")) {
        return html.replace("</head>", `${baseStyles}${heightScript}</head>`);
      } else if (html.includes("<body")) {
        return html.replace(
          "<body",
          `<head>${baseStyles}${heightScript}</head><body`
        );
      } else {
        return `${baseStyles}${heightScript}${html}`;
      }
    }

    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${baseStyles}
    ${heightScript}
  </head>
  <body>
    ${html}
  </body>
</html>`;
  }, [html, customCss, renderMode, internalModuleId]);

  // Background style helper
  const bgClass = {
    light: "bg-white text-zinc-900 border-zinc-200",
    dark: "bg-zinc-950 text-zinc-100 border-zinc-800",
    checker:
      "bg-white dark:bg-zinc-900 text-foreground bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]",
    transparent: "bg-transparent text-foreground",
  }[background];

  // Device width constraints
  const deviceWidthClass = {
    desktop: "w-full",
    tablet: "max-w-[768px] mx-auto shadow-2xl rounded-xl border border-border/80 my-4",
    mobile: "max-w-[375px] mx-auto shadow-2xl rounded-2xl border border-border/80 my-4",
  }[previewDevice];

  const effectiveIframeHeight = Math.max(iframeHeight, minHeight);

  return (
    <div className={cn("flex flex-col w-full h-full relative overflow-auto", className)}>
      {/* Container sizing according to device viewport */}
      <div
        className={cn(
          "w-full transition-all duration-300 flex-1 relative flex flex-col justify-start",
          previewDevice !== "desktop" && "items-center"
        )}
      >
        <div
          className={cn(
            "w-full transition-all duration-300 relative overflow-visible rounded-lg",
            deviceWidthClass,
            bgClass
          )}
          style={{ minHeight: `${minHeight}px` }}
        >
          {/* Device Bezel Header for Tablet & Mobile */}
          {previewDevice !== "desktop" && (
            <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40 bg-muted/40 text-[10px] text-muted-foreground select-none">
              <span className="font-semibold flex items-center gap-1">
                {previewDevice === "tablet" ? (
                  <Tablet className="h-3 w-3" />
                ) : (
                  <Smartphone className="h-3 w-3" />
                )}
                <span>{previewDevice === "tablet" ? "Tablet (768px)" : "Mobile (375px)"}</span>
              </span>
              <span className="text-[9px] uppercase tracking-wider bg-background px-1.5 py-0.5 rounded border">
                Responsive View
              </span>
            </div>
          )}

          {/* Render Preview Content */}
          {hasContent ? (
            <div className="w-full p-4 relative" key={refreshKey}>
              {renderMode === "iframe" ? (
                <iframe
                  ref={iframeRef}
                  srcDoc={iframeSrcDoc}
                  title="HTML Preview"
                  sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                  scrolling="no"
                  onLoad={updateIframeHeight}
                  className="w-full border-0 block overflow-hidden transition-all"
                  style={{
                    height: effectiveIframeHeight > 0 ? `${effectiveIframeHeight}px` : "auto",
                    minHeight: `${minHeight}px`,
                  }}
                />
              ) : (
                <IsolatedHtmlRenderer
                  html={html}
                  css={customCss}
                  minHeight={minHeight}
                  className="custom-html-preview w-full overflow-visible"
                />
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center space-y-3 text-muted-foreground">
              <div className="h-12 w-12 rounded-2xl bg-muted/70 flex items-center justify-center text-muted-foreground/60">
                <Code2 className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-xs font-semibold text-foreground">
                  No HTML Content to Preview
                </p>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Type HTML in the code editor, choose a starter template, or paste embed code to view live output here.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
