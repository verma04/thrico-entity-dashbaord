/**
 * Utility functions and snippet templates for the HTML editor and full viewer.
 */

export interface HtmlSnippet {
  label: string;
  category: "Layout" | "Components" | "Media";
  description: string;
  code: string;
}

export const HTML_SNIPPETS: HtmlSnippet[] = [
  {
    label: "Card",
    category: "Components",
    description: "Styled card container with heading and link",
    code: `<div style="padding: 24px; border-radius: 14px; background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); text-align: left;">
  <h3 style="font-size: 18px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Card Title</h3>
  <p style="font-size: 14px; color: #64748b; line-height: 1.6; margin: 0 0 16px 0;">This is a customizable card component. You can edit text, colors, and layout directly.</p>
  <a href="#" style="font-size: 14px; font-weight: 600; color: #4f46e5; text-decoration: none;">Learn more &rarr;</a>
</div>`,
  },
  {
    label: "Button",
    category: "Components",
    description: "Modern gradient CTA button",
    code: `<a href="#" style="display: inline-block; padding: 12px 26px; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; border-radius: 8px; font-weight: 600; font-size: 14px; text-decoration: none; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.3); transition: all 0.2s ease;">Get Started</a>`,
  },
  {
    label: "Badge",
    category: "Components",
    description: "Pill badge for tags or status",
    code: `<span style="display: inline-block; padding: 4px 12px; background: #e0e7ff; color: #4338ca; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">New Feature</span>`,
  },
  {
    label: "2-Col Grid",
    category: "Layout",
    description: "Responsive 2-column flex/grid container",
    code: `<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; width: 100%;">
  <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Column One</h4>
    <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">Put your first column content or widgets here.</p>
  </div>
  <div style="padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h4 style="font-size: 16px; font-weight: 700; margin: 0 0 8px 0; color: #0f172a;">Column Two</h4>
    <p style="font-size: 14px; color: #64748b; margin: 0; line-height: 1.5;">Put your second column content or widgets here.</p>
  </div>
</div>`,
  },
  {
    label: "Banner Hero",
    category: "Layout",
    description: "Full gradient hero section with call-to-action",
    code: `<div style="padding: 48px 24px; text-align: center; background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: #ffffff; border-radius: 16px; box-shadow: 0 10px 30px rgba(30, 27, 75, 0.2);">
  <span style="display: inline-block; padding: 4px 12px; background: rgba(255,255,255,0.15); border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 14px;">Special Announcement</span>
  <h2 style="font-size: 32px; font-weight: 800; margin: 0 0 14px 0; color: #ffffff;">Welcome to Our Community</h2>
  <p style="font-size: 16px; opacity: 0.9; max-width: 580px; margin: 0 auto 24px auto; line-height: 1.6;">Connect, collaborate, and grow with thousands of like-minded innovators worldwide.</p>
  <a href="#" style="display: inline-block; padding: 12px 28px; background: #ffffff; color: #1e1b4b; border-radius: 8px; font-weight: 700; font-size: 14px; text-decoration: none;">Explore Today &rarr;</a>
</div>`,
  },
  {
    label: "Image",
    category: "Media",
    description: "Responsive rounded image container",
    code: `<div style="width: 100%; overflow: hidden; border-radius: 14px; box-shadow: 0 8px 20px rgba(0,0,0,0.08);">
  <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80" alt="Cover Visual" style="width: 100%; height: auto; display: block; object-fit: cover;" />
</div>`,
  },
  {
    label: "Video Embed",
    category: "Media",
    description: "16:9 responsive video / iframe container",
    code: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 14px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); border: 1px solid #e2e8f0;">
  <iframe src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ" title="Video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
</div>`,
  },
];

/**
 * Cleanly formats/indents HTML markup while protecting embedded <style> and <script> contents.
 */
export function formatHtml(html: string): string {
  if (!html || !html.trim()) return "";

  // 1. Preserve <style> and <script> blocks
  const preservedBlocks: string[] = [];
  const preserved = html.replace(
    /(<style\b[^>]*>[\s\S]*?<\/style>|<script\b[^>]*>[\s\S]*?<\/script>)/gi,
    (match) => {
      const id = `___PRESERVED_BLOCK_${preservedBlocks.length}___`;
      preservedBlocks.push(match);
      return id;
    }
  );

  // 2. Tokenize tags and non-tag text
  const tokens = preserved
    .replace(/>\s*</g, "><")
    .replace(/(<(?:\/)?(?:[a-zA-Z0-9\-]+)[^>]*>)/g, "\n$1\n")
    .split("\n");

  const selfClosingTags = new Set([
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
    "!doctype",
  ]);

  const tab = "  "; // 2 spaces
  let indent = 0;
  const lines: string[] = [];

  for (const rawLine of tokens) {
    const line = rawLine.trim();
    if (!line) continue;

    // Check if closing tag
    const isClosing = /^<\/[a-zA-Z0-9\-]+>/.test(line);
    const isOpening =
      /^<[a-zA-Z0-9\-]+(?:>| [^>]*>)/.test(line) && !line.endsWith("/>");
    const tagNameMatch = line.match(/^<([a-zA-Z0-9\-!]+)/);
    const tagName = tagNameMatch ? tagNameMatch[1].toLowerCase() : "";
    const isSelfClosing =
      line.endsWith("/>") || selfClosingTags.has(tagName) || tagName.startsWith("!");

    if (isClosing) {
      indent = Math.max(0, indent - 1);
    }

    lines.push(tab.repeat(indent) + line);

    if (isOpening && !isSelfClosing && !line.includes(`</${tagName}>`)) {
      indent++;
    }
  }

  let result = lines.join("\n");

  // 3. Restore preserved <style> and <script> blocks
  preservedBlocks.forEach((block, index) => {
    result = result.replace(`___PRESERVED_BLOCK_${index}___`, block);
  });

  return result.trim();
}

/**
 * Downloads HTML code as an .html file.
 */
export function downloadHtmlFile(html: string, filename = "custom-section.html") {
  if (typeof window === "undefined") return;
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".html") ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
