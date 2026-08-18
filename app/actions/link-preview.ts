"use server";

import { getLinkPreview } from "link-preview-js";
import dns from "node:dns/promises";

export async function fetchLinkPreview(url: string) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsedUrl = new URL(url);
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }

    // Skip localhost and loopback domains to prevent connection refused errors
    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1" ||
      parsedUrl.hostname === "0.0.0.0"
    ) {
      return null;
    }

    const data = await getLinkPreview(url, {
      timeout: 3000,
      followRedirects: "follow",
      resolveDNSHost: async (urlStr: string) => {
        try {
          const { hostname } = new URL(urlStr);
          const res = await dns.lookup(hostname);
          return res.address;
        } catch {
          return "";
        }
      },
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      },
    });

    return data;
  } catch {
    // Gracefully handle unreachable URLs / dead links
    return null;
  }
}
