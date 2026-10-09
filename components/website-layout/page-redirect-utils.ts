export interface PageRedirectConfig {
  isRedirect: boolean;
  type: "internal" | "external";
  targetUrl: string;
  openInNewTab?: boolean;
  statusCode?: 301 | 302;
}

export interface PageLike {
  redirect?: PageRedirectConfig | null;
  seo?: {
    schemaMarkup?: unknown;
    [key: string]: unknown;
  } | null;
}

/**
 * Extracts and normalizes page redirect configuration from a Page or WebsitePageRecord.
 * Checks both page.redirect and page.seo.schemaMarkup.
 */
export function getPageRedirect(
  page: PageLike | null | undefined,
): PageRedirectConfig | null {
  if (!page) return null;

  // 1. Check direct redirect property on page or store object
  if (
    page.redirect &&
    typeof page.redirect === "object" &&
    page.redirect.isRedirect
  ) {
    return {
      isRedirect: true,
      type: page.redirect.type === "external" ? "external" : "internal",
      targetUrl: page.redirect.targetUrl || "",
      openInNewTab: Boolean(page.redirect.openInNewTab),
      statusCode: page.redirect.statusCode === 302 ? 302 : 301,
    };
  }

  // 2. Check within seo.schemaMarkup (JSON object or string)
  const schemaMarkup = page.seo?.schemaMarkup;
  if (schemaMarkup) {
    try {
      const parsed =
        typeof schemaMarkup === "string"
          ? (JSON.parse(schemaMarkup) as Record<string, unknown>)
          : (schemaMarkup as Record<string, unknown>);
      const redirect = parsed?.redirect as PageRedirectConfig | undefined;
      if (redirect?.isRedirect) {
        return {
          isRedirect: true,
          type: redirect.type === "external" ? "external" : "internal",
          targetUrl: redirect.targetUrl || "",
          openInNewTab: Boolean(redirect.openInNewTab),
          statusCode: redirect.statusCode === 302 ? 302 : 301,
        };
      }
    } catch {
      // Non-JSON schema markup
    }
  }

  return null;
}

/**
 * Formats a clean human-readable destination label.
 */
export function formatRedirectDestination(
  redirect: PageRedirectConfig,
): string {
  if (!redirect || !redirect.targetUrl) return "";
  if (redirect.type === "external") {
    return redirect.targetUrl.replace(/^https?:\/\//i, "");
  }
  return redirect.targetUrl.startsWith("/")
    ? redirect.targetUrl
    : `/${redirect.targetUrl}`;
}
