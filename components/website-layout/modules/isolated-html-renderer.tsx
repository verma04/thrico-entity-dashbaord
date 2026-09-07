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

    // Extract styles in user html and remap body/html selectors
    let processedHtml = html || "";
    processedHtml = processedHtml.replace(
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
