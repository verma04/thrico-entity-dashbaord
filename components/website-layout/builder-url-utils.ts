/**
 * Utility to synchronize builder URL parameters (page, theme) without triggering Next.js
 * router transitions, layout re-evaluations, or infinite re-render loops.
 */

export interface BuilderUrlUpdates {
  page?: string | null;
  pageId?: string | null;
  theme?: string | null;
}

export function syncBuilderUrl(updates: BuilderUrlUpdates): void {
  if (typeof window === "undefined") return;

  try {
    const url = new URL(window.location.href);

    if (updates.page !== undefined) {
      if (updates.page) {
        url.searchParams.set("page", updates.page);
        url.searchParams.delete("pageId");
      } else {
        url.searchParams.delete("page");
      }
    }

    if (updates.pageId !== undefined) {
      if (updates.pageId) {
        url.searchParams.set("pageId", updates.pageId);
        url.searchParams.delete("page");
      } else {
        url.searchParams.delete("pageId");
      }
    }

    if (updates.theme !== undefined) {
      if (updates.theme) {
        url.searchParams.set("theme", updates.theme);
      } else {
        url.searchParams.delete("theme");
      }
    }

    const newRelativeUrl = `${url.pathname}?${url.searchParams.toString()}`;
    window.history.replaceState(null, "", newRelativeUrl);
  } catch {
    // Graceful fallback in non-standard environments
  }
}
