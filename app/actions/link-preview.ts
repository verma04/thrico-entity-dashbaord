"use server";

import { getLinkPreview } from "link-preview-js";

function decodeHtmlEntities(str: string): string {
  if (!str) return "";
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2019;/g, "’")
    .replace(/&#x2018;/g, "‘")
    .replace(/&#064;/g, "@")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

async function scrapeMetadata(rawUrl: string) {
  let targetUrl = rawUrl;
  if (/instagram\.com|instagr\.am/i.test(rawUrl)) {
    try {
      const u = new URL(rawUrl);
      targetUrl = u.origin + u.pathname;
    } catch {}
  }

  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php) Facebot Twitterbot/1.0 LinkedInBot/1.0",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
    },
    redirect: "follow",
    signal: AbortSignal.timeout(8000),
  });

  if (!res.ok) throw new Error("HTTP " + res.status);

  const finalUrl = res.url || rawUrl;
  const finalUrlObj = new URL(finalUrl);
  const html = await res.text();

  const getMeta = (prop: string) => {
    const match =
      html.match(
        new RegExp(
          "<meta\\s+(?:property|name)=[\"']" +
            prop +
            "[\"']\\s+content=[\"']([^\"']*)[\"']",
          "i",
        ),
      ) ||
      html.match(
        new RegExp(
          "<meta\\s+content=[\"']([^\"']*)[\"']\\s+(?:property|name)=[\"']" +
            prop +
            "[\"']",
          "i",
        ),
      );
    return match ? decodeHtmlEntities(match[1]) : null;
  };

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const pageTitle = titleMatch ? decodeHtmlEntities(titleMatch[1]) : null;

  let ogTitle = getMeta("og:title") || getMeta("twitter:title") || pageTitle;
  let ogDesc =
    getMeta("og:description") ||
    getMeta("twitter:description") ||
    getMeta("description");
  let ogImage = getMeta("og:image") || getMeta("twitter:image");
  let siteName =
    getMeta("og:site_name") || finalUrlObj.hostname.replace(/^www\./, "");

  // Favicon detection
  const faviconMatch =
    html.match(
      /<link[^>]+rel=["'](?:shortcut icon|icon)["'][^>]+href=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut icon|icon)["']/i,
    );
  let favicon = faviconMatch ? faviconMatch[1] : null;
  if (favicon && !favicon.startsWith("http")) {
    if (favicon.startsWith("//")) {
      favicon = "https:" + favicon;
    } else if (favicon.startsWith("/")) {
      favicon = finalUrlObj.origin + favicon;
    } else {
      favicon = finalUrlObj.origin + "/" + favicon;
    }
  }
  if (!favicon) {
    favicon = finalUrlObj.origin + "/favicon.ico";
  }

  const images: string[] = [];
  if (ogImage && !ogImage.startsWith("data:")) {
    if (ogImage.startsWith("//")) {
      ogImage = "https:" + ogImage;
    } else if (ogImage.startsWith("/")) {
      ogImage = finalUrlObj.origin + ogImage;
    }
    // Filter out generic Facebook static icon logos so they do not masquerade as media previews
    const isGenericFbLogo =
      ogImage.includes("rsrc.php") ||
      ogImage.includes("static.xx.fbcdn.net") ||
      ogImage.includes("facebook_logo");
    if (!isGenericFbLogo) {
      images.push(ogImage);
    }
  }

  const isInstagram =
    /instagram\.com|instagr\.am/i.test(finalUrl) ||
    /instagram\.com|instagr\.am/i.test(rawUrl);
  const isFacebook =
    /facebook\.com|fb\.watch|fb\.me|fb\.com/i.test(finalUrl) ||
    /facebook\.com|fb\.watch|fb\.me|fb\.com/i.test(rawUrl);
  const isYouTube =
    /youtube\.com|youtu\.be/i.test(finalUrl) ||
    /youtube\.com|youtu\.be/i.test(rawUrl);
  const isLinkedIn =
    /linkedin\.com|lnkd\.in/i.test(rawUrl) || /linkedin\.com/i.test(finalUrl);

  let instagramId: string | null = null;
  let facebookId: string | null = null;
  let youTubeId: string | null = null;
  let isReel = false;
  let isPost = false;
  let isVideo = false;
  let author: string | null = null;
  let caption = ogTitle;
  let stats: string | null = null;

  // Instagram Intelligence
  if (isInstagram) {
    siteName = "Instagram";
    const match = finalUrl.match(/\/(p|reel|reels|tv)\/([a-zA-Z0-9_-]+)/i);
    if (match) {
      instagramId = match[2];
      isReel = match[1].toLowerCase().includes("reel");
      isPost = match[1].toLowerCase() === "p";
    }
    if (ogTitle) {
      const titleMatch = ogTitle.match(
        /^(.+?)\s+on Instagram:\s*["“]?([\s\S]*?)["”]?$/i,
      );
      if (titleMatch) {
        author = titleMatch[1].trim();
        caption = titleMatch[2].trim();
      } else {
        const profileMatch = ogTitle.match(/^([^(]+)\s*\(@([^)]+)\)/i);
        if (profileMatch) {
          author = profileMatch[1].trim();
        }
      }
    }
    if (ogDesc) {
      const statsMatch = ogDesc.match(
        /^([\d,KMkm\.\s]+likes?,\s*[\d,KMkm\.\s]+comments?)/i,
      );
      if (statsMatch) {
        stats = statsMatch[1].trim();
      }
    }

    // Sanitize Instagram titles that are just generic login/site titles
    if (
      !caption ||
      caption.toLowerCase() === "instagram" ||
      caption.toLowerCase().includes("login • instagram") ||
      caption.toLowerCase().includes("page not found")
    ) {
      caption = isReel ? "Instagram Reel" : "Instagram Post";
      ogTitle = caption;
    }

    // High-res cover image scrape from Instagram captioned embed
    if (images.length === 0 && instagramId) {
      try {
        const type = isReel ? "reel" : "p";
        const embedUrl = `https://www.instagram.com/${type}/${instagramId}/embed/captioned/`;
        const embedRes = await fetch(embedUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          },
          signal: AbortSignal.timeout(3000),
        });
        if (embedRes.ok) {
          const embedHtml = await embedRes.text();
          const embedImgMatch = embedHtml.match(
            /class=["']EmbeddedMediaImage["'][^>]*src=["']([^"']+)["']/i,
          );
          if (embedImgMatch) {
            const highResImg = embedImgMatch[1].replace(/&amp;/g, "&");
            images.unshift(highResImg);
          } else {
            const coverMatch = embedHtml.match(
              /https:[^"'\\\s]*video_default_cover_frame[^"'\\\s]*/i,
            );
            if (coverMatch) {
              const highResImg = coverMatch[0]
                .replace(/\\u0026/g, "&")
                .replace(/\\\\/g, "");
              images.unshift(highResImg);
            }
          }
        }
      } catch (err) {
        console.warn("Instagram high-res embed scrape failed:", err);
      }
    }
  }

  // Facebook Intelligence
  if (isFacebook) {
    siteName = "Facebook";
    isReel =
      /share\/r\/|\/reel\/|\/reels\//i.test(finalUrl) ||
      /share\/r\/|\/reel\/|\/reels\//i.test(rawUrl);
    isVideo =
      /\/watch|\/share\/v\/|fb\.watch/i.test(finalUrl) ||
      /\/watch|\/share\/v\/|fb\.watch/i.test(rawUrl);
    isPost =
      /share\/p\/|\/posts\/|\/story\.php/i.test(finalUrl) ||
      /share\/p\/|\/posts\/|\/story\.php/i.test(rawUrl);

    // Extract Facebook ID / token
    const fbMatch =
      finalUrl.match(/\/share\/(?:r|p|v)\/([a-zA-Z0-9_-]+)/i) ||
      finalUrl.match(/\/(?:reel|reels)\/([a-zA-Z0-9_-]+)/i) ||
      finalUrl.match(/watch\?v=([a-zA-Z0-9_-]+)/i);
    if (fbMatch) {
      facebookId = fbMatch[1];
    }

    // Clean Facebook title & author
    let rawFbTitle = (pageTitle || ogTitle || "").trim();
    rawFbTitle = rawFbTitle.replace(/\s*\|\s*Facebook$/i, "").trim();

    const parts = rawFbTitle.split(/\s*\|\s*/);
    if (parts.length > 1) {
      author = parts.pop()?.trim() || null;
      rawFbTitle = parts.join(" | ").trim();
    }

    // If Facebook returned "Error", "Log in to Facebook", etc., replace with clean title
    const isErrorOrLogin =
      !rawFbTitle ||
      rawFbTitle.toLowerCase() === "error" ||
      rawFbTitle.toLowerCase().startsWith("log in") ||
      rawFbTitle.toLowerCase().includes("something went wrong") ||
      rawFbTitle.toLowerCase().includes("security check");

    if (isErrorOrLogin) {
      rawFbTitle = isReel
        ? "Facebook Reel"
        : isVideo
          ? "Facebook Video"
          : isPost
            ? "Facebook Post"
            : "Facebook Content";
    }

    ogTitle = rawFbTitle;
    caption = rawFbTitle;

    // Clean description if it is just Facebook login boilerplate
    if (
      ogDesc &&
      (ogDesc.toLowerCase().includes("log in or sign up to view") ||
        ogDesc.toLowerCase().includes("facebook helps you connect"))
    ) {
      ogDesc = isReel
        ? "Facebook Reel • Tap to view on Facebook"
        : "Facebook Post • Tap to view on Facebook";
    }
  }

  // YouTube Intelligence
  if (isYouTube) {
    siteName = "YouTube";
    const ytMatch = rawUrl.match(
      /(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]{11})/i,
    );
    if (ytMatch) {
      youTubeId = ytMatch[1];
      if (images.length === 0) {
        images.push(`https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`);
      }
    }
    if (!ogTitle || ogTitle === "YouTube") {
      ogTitle = rawUrl.includes("shorts") ? "YouTube Shorts" : "YouTube Video";
    }
  }

  if (isLinkedIn) {
    siteName = "LinkedIn";
  }

  return {
    url: rawUrl,
    finalUrl,
    title: ogTitle || finalUrlObj.hostname,
    caption: caption || undefined,
    description: ogDesc || undefined,
    stats: stats || undefined,
    images,
    favicons: [favicon],
    siteName,
    author: author || undefined,
    mediaType: isReel || isVideo ? "video" : "website",
    contentType: "text/html",
    instagramId,
    facebookId,
    youTubeId,
    isInstagram,
    isFacebook,
    isYouTube,
    isLinkedIn,
    isReel,
    isVideo,
    isPost,
  };
}

export async function fetchLinkPreview(url: string) {
  if (!url || typeof url !== "string") return null;

  try {
    const parsedUrl = new URL(url.trim());
    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      return null;
    }

    if (
      parsedUrl.hostname === "localhost" ||
      parsedUrl.hostname === "127.0.0.1" ||
      parsedUrl.hostname === "0.0.0.0"
    ) {
      return null;
    }
  } catch {
    return null;
  }

  // First attempt: Resilient direct metadata scraping with social crawler headers
  try {
    const scraped = await scrapeMetadata(url.trim());
    if (scraped && scraped.title) {
      return scraped;
    }
  } catch (scrapeError) {
    console.warn("Direct metadata scrape fallback needed for:", url, scrapeError);
  }

  // Second attempt: link-preview-js library with crawler headers
  try {
    const data = await getLinkPreview(url.trim(), {
      timeout: 5000,
      followRedirects: "follow",
      headers: {
        "user-agent":
          "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php) Facebot Twitterbot/1.0 LinkedInBot/1.0",
      },
    });
    if (data && (data as { title?: string }).title) {
      return data;
    }
  } catch (error) {
    console.error("Link-preview-js error:", error);
  }

  // Final graceful fallback: Domain & URL info so preview never completely vanishes
  try {
    const parsed = new URL(url.trim());
    const isInstagram = /instagram\.com|instagr\.am/i.test(url);
    const isFacebook = /facebook\.com|fb\.watch|fb\.me|fb\.com/i.test(url);
    const isYouTube = /youtube\.com|youtu\.be/i.test(url);
    const isLinkedIn = /linkedin\.com|lnkd\.in/i.test(url);

    const isReel =
      /share\/r\/|\/reel\/|\/reels\//i.test(url);
    const isVideo =
      /\/watch|\/share\/v\/|fb\.watch/i.test(url);

    const defaultTitle = isFacebook
      ? isReel
        ? "Facebook Reel"
        : isVideo
          ? "Facebook Video"
          : "Facebook Post"
      : isInstagram
        ? isReel
          ? "Instagram Reel"
          : "Instagram Post"
        : isYouTube
          ? "YouTube Video"
          : isLinkedIn
            ? "LinkedIn"
            : parsed.hostname.replace(/^www\./, "");

    return {
      url: url.trim(),
      title: defaultTitle,
      description: url.trim(),
      images: [],
      favicons: [`https://${parsed.hostname}/favicon.ico`],
      siteName: isFacebook
        ? "Facebook"
        : isInstagram
          ? "Instagram"
          : isYouTube
            ? "YouTube"
            : isLinkedIn
              ? "LinkedIn"
              : parsed.hostname.replace(/^www\./, ""),
      isInstagram,
      isFacebook,
      isYouTube,
      isLinkedIn,
      isReel,
      isVideo,
      mediaType: isReel || isVideo ? "video" : "website",
    };
  } catch {
    return null;
  }
}

