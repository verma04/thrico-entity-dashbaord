"use client";

import React, { useEffect, useRef } from "react";

interface IsolatedHtmlRendererProps {
  html: string;
  css?: string;
  className?: string;
  style?: React.CSSProperties;
  minHeight?: number;
}

/**
 * IsolatedHtmlRenderer
 *
 * Renders custom HTML and CSS safely inside a Shadow Root (Shadow DOM).
 * This guarantees 100% style encapsulation:
 * - NO CSS (like h1, h2, p, button, *, body, .btn, etc.) can leak out to the document or other sections.
 * - body and html selectors in user styles are automatically mapped to :host / .isolated-html-root.
 * - Adopts document stylesheets and fonts where available so utility classes and typography work seamlessly.
 * - Fits natural page flow without iframe scrollbars or height lag.
 */
export const IsolatedHtmlRenderer: React.FC<IsolatedHtmlRendererProps> = ({
  html,
  css = "",
  className,
  style,
  minHeight,
}) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const shadowRootRef = useRef<ShadowRoot | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Attach shadow root only once or reuse existing
    if (!shadowRootRef.current) {
      if (host.shadowRoot) {
        shadowRootRef.current = host.shadowRoot;
      } else {
        try {
          shadowRootRef.current = host.attachShadow({ mode: "open" });
        } catch (e) {
          shadowRootRef.current = host.shadowRoot;
        }
      }
    }

    const shadow = shadowRootRef.current;
    if (!shadow) return;

    // Adopt document stylesheets if available (for Tailwind utilities, page CSS, etc.)
    if (typeof document !== "undefined" && document.adoptedStyleSheets) {
      try {
        shadow.adoptedStyleSheets = [...document.adoptedStyleSheets];
      } catch (e) {
        // Cross-origin sheets might throw, ignore gracefully
      }
    }

    // Helper to remap body / html / :root selectors to :host and container class
    const processCss = (rawCss: string) => {
      if (!rawCss) return "";
      return rawCss
        .replace(/\bhtml\b(?![^{]*\})/gi, ":host, .isolated-html-root")
        .replace(/\bbody\b(?![^{]*\})/gi, ":host, .isolated-html-root")
        .replace(/:root\b/gi, ":host");
    };

    // Extract styles and body if user provided a full HTML document
    let processedHtml = html || "";
    let extractedHeadContent = "";

    if (/<!DOCTYPE|<html|<body/i.test(processedHtml)) {
      const headMatch = processedHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
      if (headMatch) {
        extractedHeadContent = headMatch[1];
      }
      const bodyMatch = processedHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        processedHtml = bodyMatch[1];
      }
    }

    // Extract styles in user html and remap body/html selectors
    processedHtml = processedHtml.replace(
      /<style\b([^>]*)>([\s\S]*?)<\/style>/gi,
      (_match, attrs, styleContent) => {
        return `<style${attrs}>${processCss(styleContent)}</style>`;
      }
    );

    extractedHeadContent = extractedHeadContent.replace(
      /<style\b([^>]*)>([\s\S]*?)<\/style>/gi,
      (_match, attrs, styleContent) => {
        return `<style${attrs}>${processCss(styleContent)}</style>`;
      }
    );

    const scopedCustomCss = processCss(css);

    // Host baseline styles
    const hostBaseStyles = `
      <style>
        :host {
          display: block;
          width: 100%;
          position: relative;
          color: inherit;
          font-family: inherit;
          line-height: inherit;
          box-sizing: border-box;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        img, video, iframe {
          max-width: 100%;
        }
        .isolated-html-root {
          width: 100%;
          position: relative;
          color: inherit;
          font-family: inherit;
        }
        ${scopedCustomCss ? `${scopedCustomCss}` : ""}
      </style>
    `;

    // Copy any font-face rules and external stylesheets from document.head to preserve custom fonts
    let headFontStyles = "";
    if (typeof document !== "undefined") {
      const styles = document.head.querySelectorAll(
        "style, link[rel='stylesheet']"
      );
      styles.forEach((tag) => {
        if (tag.tagName.toLowerCase() === "link") {
          headFontStyles += tag.outerHTML;
        } else if (tag.textContent && tag.textContent.includes("@font-face")) {
          const fontFaces = tag.textContent.match(/@font-face\s*\{[^}]+\}/g);
          if (fontFaces) {
            headFontStyles += `<style>${fontFaces.join("\n")}</style>`;
          }
        }
      });
    }

    shadow.innerHTML = `
      ${headFontStyles}
      ${extractedHeadContent}
      ${hostBaseStyles}
      <div class="isolated-html-root">
        ${processedHtml}
      </div>
    `;

    // Recreate script tags inside shadow root so inline scripts can execute if intended
    const scripts = shadow.querySelectorAll("script");
    scripts.forEach((oldScript) => {
      const newScript = document.createElement("script");
      Array.from(oldScript.attributes).forEach((attr) =>
        newScript.setAttribute(attr.name, attr.value)
      );
      newScript.textContent = oldScript.textContent;
      oldScript.parentNode?.replaceChild(newScript, oldScript);
    });

    // Intercept all link clicks inside the Shadow DOM so they redirect the main browser window
    const handleLinkClick = (e: MouseEvent) => {
      const path = e.composedPath ? e.composedPath() : [];
      let anchor: HTMLAnchorElement | null = null;
      for (let i = 0; i < path.length; i++) {
        const el = path[i] as HTMLElement;
        if (el && (el.tagName === "A" || el instanceof HTMLAnchorElement)) {
          anchor = el as HTMLAnchorElement;
          break;
        }
      }
      if (!anchor && e.target) {
        anchor = (e.target as HTMLElement).closest?.("a") || null;
      }

      if (!anchor) return;

      const rawHref = anchor.getAttribute("href") || "";
      if (!rawHref || rawHref === "#") return;

      // 1. Hash anchor links (e.g. #events, #contact, #pricing)
      if (rawHref.startsWith("#")) {
        e.preventDefault();
        try {
          const innerEl = shadow.querySelector(rawHref);
          if (innerEl) {
            innerEl.scrollIntoView({ behavior: "smooth" });
            return;
          }
          const outerEl = document.querySelector(rawHref);
          if (outerEl) {
            outerEl.scrollIntoView({ behavior: "smooth" });
            return;
          }
        } catch (err) {}
        return;
      }

      // 2. Protocols like mailto:, tel:, javascript:
      if (
        rawHref.startsWith("javascript:") ||
        rawHref.startsWith("mailto:") ||
        rawHref.startsWith("tel:")
      ) {
        return;
      }

      // 3. User holds modifier key for new tab
      if (e.ctrlKey || e.metaKey) {
        return;
      }

      // 4. Redirect top-level browser window
      e.preventDefault();
      const destination = anchor.href;
      const targetAttr = anchor.getAttribute("target");

      let isSameHost = false;
      try {
        const url = new URL(destination, window.location.href);
        isSameHost = url.host === window.location.host;
      } catch (err) {}

      if (targetAttr === "_blank" && !isSameHost) {
        try {
          if (window.top) {
            window.top.open(destination, "_blank", "noopener,noreferrer");
          } else {
            window.open(destination, "_blank", "noopener,noreferrer");
          }
        } catch (err) {
          window.open(destination, "_blank", "noopener,noreferrer");
        }
      } else {
        try {
          if (window.top && window.top !== window) {
            window.top.location.href = destination;
          } else {
            window.location.href = destination;
          }
        } catch (err) {
          try {
            window.open(destination, "_top");
          } catch (e2) {
            window.location.href = destination;
          }
        }
      }
    };

    shadow.addEventListener("click", handleLinkClick as EventListener, true);

    return () => {
      shadow.removeEventListener("click", handleLinkClick as EventListener, true);
    };
  }, [html, css]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={{
        ...style,
        minHeight: minHeight && minHeight > 0 ? `${minHeight}px` : undefined,
      }}
    />
  );
};
