/**
 * Media URL utility for handling CDN migration and fallback.
 */

const CLOUDFRONT_URL = "https://d588lezzxe2zm.cloudfront.net/";
const S3_URL = "https://thrico-storage.s3.ap-south-1.amazonaws.com";
const CDN_URL = "https://cdn.thrico.network/";

/**
 * Transforms a media path or URL to use the preferred CloudFront CDN,
 * with S3 as a fallback.
 *
 * @param path The relative path or full URL of the media
 * @returns An array of URLs to try (CloudFront first, then S3)
 */
export const getMediaUrls = (path: string | null | undefined): string[] => {
  if (!path) return [];

  // If it's already a full URL, extract the path if it matches our domains
  let cleanPath = path;
  if (path.startsWith(S3_URL)) {
    cleanPath = path.substring(S3_URL.length);
  } else if (path.startsWith(CLOUDFRONT_URL)) {
    cleanPath = path.substring(CLOUDFRONT_URL.length);
  } else if (path.startsWith(CDN_URL)) {
    cleanPath = path.substring(CDN_URL.length);
  }

  // Ensure cleanPath doesn't have a leading slash for consistency when joining
  if (cleanPath.startsWith("/")) {
    cleanPath = cleanPath.substring(1);
  }

  return [
    `${CLOUDFRONT_URL}${cleanPath}`,
    `${S3_URL}/${cleanPath}`,
    `${CDN_URL}${cleanPath}`,
  ];
};

/**
 * Returns a single preferred CDN URL for components that don't support multiple sources.
 */
export const getPreferredMediaUrl = (
  path: string | null | undefined
): string => {
  const urls = getMediaUrls(path);
  return urls.length > 0 ? urls[0] : "";
};
