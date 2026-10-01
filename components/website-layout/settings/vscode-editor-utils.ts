/**
 * VS Code-style syntax highlighting, HTML linting, and DOM outline extraction utilities.
 */

export interface HtmlProblem {
  line: number;
  message: string;
  severity: "error" | "warning";
}

export interface DomOutlineItem {
  tag: string;
  className: string;
  id: string;
  line: number;
  isVoid: boolean;
}

export interface DocStats {
  totalLines: number;
  charCount: number;
  domNodes: number;
  imageCount: number;
  styleTags: number;
  estimatedKb: string;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Tokenizes HTML into VS Code Dark+ syntax colored HTML spans.
 */
export function tokenizeHtml(input: string): string {
  if (!input) return "";
  let out = "";
  let i = 0;
  const len = input.length;

  while (i < len) {
    // Comment <!-- ... -->
    if (input.startsWith("<!--", i)) {
      const end = input.indexOf("-->", i + 4);
      const comment = end === -1 ? input.slice(i) : input.slice(i, end + 3);
      out += `<span style="color:#6a9955;font-style:italic">${escapeHtml(comment)}</span>`;
      i += comment.length;
      continue;
    }

    // Doctype
    if (input.slice(i, i + 9).toLowerCase() === "<!doctype") {
      const end = input.indexOf(">", i);
      const dt = end === -1 ? input.slice(i) : input.slice(i, end + 1);
      out += `<span style="color:#569cd6">${escapeHtml(dt)}</span>`;
      i += dt.length;
      continue;
    }

    // Tag opening or closing: <tag or </tag
    if (input[i] === "<") {
      let tagEnd = input.indexOf(">", i);
      if (tagEnd === -1) tagEnd = len;
      else tagEnd = tagEnd + 1;

      const fullTag = input.slice(i, tagEnd);
      const tagMatch = fullTag.match(/^<(\/)?([a-zA-Z0-9\-:]+)/);
      if (tagMatch) {
        out += `<span style="color:#808080">&lt;${tagMatch[1] ? "/" : ""}</span><span style="color:#569cd6;font-weight:600">${tagMatch[2]}</span>`;
        let rest = fullTag.slice(tagMatch[0].length);

        let suffix = "";
        if (rest.endsWith("/>")) {
          suffix = `<span style="color:#808080">/&gt;</span>`;
          rest = rest.slice(0, -2);
        } else if (rest.endsWith(">")) {
          suffix = `<span style="color:#808080">&gt;</span>`;
          rest = rest.slice(0, -1);
        }

        const attrRegex = /([a-zA-Z0-9\-:]+)(?:(=)("[^"]*"|'[^']*'|[^\s>]+))?/g;
        let lastIdx = 0;
        let m: RegExpExecArray | null;

        while ((m = attrRegex.exec(rest)) !== null) {
          out += escapeHtml(rest.slice(lastIdx, m.index));
          out += `<span style="color:#9cdcfe">${escapeHtml(m[1])}</span>`;
          if (m[2]) {
            out += `<span style="color:#808080">=</span>`;
            if (m[3]) {
              out += `<span style="color:#ce9178">${escapeHtml(m[3])}</span>`;
            }
          }
          lastIdx = attrRegex.lastIndex;
        }
        out += escapeHtml(rest.slice(lastIdx)) + suffix;
        i = tagEnd;
        continue;
      }
    }

    out += escapeHtml(input[i]);
    i++;
  }
  return out;
}

/**
 * Tokenizes CSS into VS Code Dark+ syntax colored CSS spans.
 */
export function tokenizeCss(input: string): string {
  if (!input) return "";
  let out = "";
  let i = 0;
  const len = input.length;

  while (i < len) {
    // Comment /* ... */
    if (input.startsWith("/*", i)) {
      const end = input.indexOf("*/", i + 2);
      const comment = end === -1 ? input.slice(i) : input.slice(i, end + 2);
      out += `<span style="color:#6a9955;font-style:italic">${escapeHtml(comment)}</span>`;
      i += comment.length;
      continue;
    }

    // Declarations or selectors
    if (input[i] !== "{" && input[i] !== "}") {
      let nextDelim = len;
      for (let j = i; j < len; j++) {
        if (
          input[j] === "{" ||
          input[j] === "}" ||
          input[j] === ";" ||
          input.startsWith("/*", j)
        ) {
          nextDelim = j;
          break;
        }
      }

      if (nextDelim === i) {
        out += escapeHtml(input[i]);
        i++;
        continue;
      }

      const segment = input.slice(i, nextDelim);

      if (segment.includes(":")) {
        const colonIdx = segment.indexOf(":");
        const prop = segment.slice(0, colonIdx);
        const val = segment.slice(colonIdx + 1);
        out += `<span style="color:#9cdcfe">${escapeHtml(prop)}</span><span style="color:#808080">:</span><span style="color:#ce9178">${escapeHtml(val)}</span>`;
      } else {
        out += `<span style="color:#d7ba7d;font-weight:600">${escapeHtml(segment)}</span>`;
      }
      i = nextDelim;
      continue;
    }

    // Punctuation { or }
    out += `<span style="color:#ffd700">${escapeHtml(input[i])}</span>`;
    i++;
  }

  return out;
}

/**
 * Validates HTML markup and reports problems.
 */
export function validateHtmlMarkup(html: string): HtmlProblem[] {
  if (!html) return [];
  const problems: HtmlProblem[] = [];
  const lines = html.split("\n");

  lines.forEach((line, lineIdx) => {
    // Check unmatched single quotes
    const singleQuotes = (line.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0 && !line.includes("//") && !line.includes("/*")) {
      problems.push({
        line: lineIdx + 1,
        message: "Unmatched single quote in markup",
        severity: "warning",
      });
    }

    // Check unmatched double quotes
    const doubleQuotes = (line.match(/"/g) || []).length;
    if (doubleQuotes % 2 !== 0 && !line.includes("//") && !line.includes("/*")) {
      problems.push({
        line: lineIdx + 1,
        message: "Unmatched double quote in markup",
        severity: "warning",
      });
    }

    // Check <img> missing alt
    if (/<img\b/i.test(line) && !/\balt\s*=/i.test(line)) {
      problems.push({
        line: lineIdx + 1,
        message: "<img /> missing alt attribute (accessibility)",
        severity: "warning",
      });
    }

    // Check deprecated HTML tags
    const deprecated = line.match(
      /<(center|font|marquee|blink|strike|big|tt)\b/i
    );
    if (deprecated) {
      problems.push({
        line: lineIdx + 1,
        message: `Deprecated HTML tag <${deprecated[1]}>`,
        severity: "warning",
      });
    }

    // Check unclosed tags on simple one-liners like <div> without </div>
    const openTags = (line.match(/<([a-zA-Z0-9\-]+)(?:\s[^>]*)?>/g) || []).filter(
      (t) =>
        !t.endsWith("/>") &&
        !t.startsWith("<!") &&
        !t.startsWith("</") &&
        !/^(<br|<hr|<img|<input|<meta|<link|<source)/i.test(t)
    );
    const closeTags = (line.match(/<\/([a-zA-Z0-9\-]+)>/g) || []);
    if (openTags.length > 2 && closeTags.length === 0 && line.length > 120) {
      // Just a gentle hint for very long nested single lines
    }
  });

  return problems.slice(0, 20);
}

/**
 * Extracts DOM outline tree with tags, classes, IDs, and line numbers.
 */
export function extractDomOutline(html: string): DomOutlineItem[] {
  if (!html) return [];
  const outline: DomOutlineItem[] = [];
  const lines = html.split("\n");
  const tagRegex = /<([a-zA-Z0-9\-]+)([^>]*)>/g;
  const voidTags = new Set([
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

  lines.forEach((line, lineIdx) => {
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(line)) !== null) {
      const tagName = match[1].toLowerCase();
      if (tagName.startsWith("!") || tagName.startsWith("/")) continue;

      const rest = match[2];
      const classMatch = rest.match(/\bclass=["']([^"']+)["']/);
      const idMatch = rest.match(/\bid=["']([^"']+)["']/);

      const className = classMatch
        ? classMatch[1].split(" ").slice(0, 2).join(".")
        : "";
      const id = idMatch ? idMatch[1] : "";

      outline.push({
        tag: tagName,
        className,
        id,
        line: lineIdx + 1,
        isVoid: voidTags.has(tagName) || rest.trim().endsWith("/"),
      });
    }
  });

  return outline.slice(0, 80);
}

/**
 * Calculates HTML and CSS document metrics.
 */
export function calculateDocStats(html: string, css: string): DocStats {
  const combined = (html || "") + (css || "");
  const totalLines = combined.split("\n").length;
  const charCount = combined.length;
  const domNodes = (html.match(/<[a-zA-Z0-9\-]+/g) || []).length;
  const imageCount = (html.match(/<img\b/gi) || []).length;
  const styleTags =
    (html.match(/<style\b/gi) || []).length + (css.trim().length > 0 ? 1 : 0);
  const estimatedKb = (charCount / 1024).toFixed(1);

  return {
    totalLines,
    charCount,
    domNodes,
    imageCount,
    styleTags,
    estimatedKb,
  };
}
