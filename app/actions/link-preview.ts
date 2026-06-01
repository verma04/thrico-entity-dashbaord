"use server";

import { getLinkPreview } from "link-preview-js";

export async function fetchLinkPreview(url: string) {
  try {
    const data = await getLinkPreview(url, {
      timeout: 5000,
      headers: {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
      }
    });
    return data;
  } catch (error) {
    console.error("Link preview error:", error);
    return null;
  }
}
