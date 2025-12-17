import type { Metadata } from "next";

/**
 * Utility functions for generating dynamic metadata in Next.js
 */

interface GeneratePageMetadataOptions {
  title: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Generate metadata for a page with common defaults
 * 
 * @example
 * export const metadata = generatePageMetadata({
 *   title: "My Page",
 *   description: "This is my page description",
 *   keywords: ["keyword1", "keyword2"],
 * });
 */
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  noIndex = false,
}: GeneratePageMetadataOptions): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.thrico.app";
  
  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
        },
    alternates: {
      canonical: baseUrl,
    },
  };
}

/**
 * Generate metadata for a dynamic route
 * 
 * @example
 * export async function generateMetadata({ params }): Promise<Metadata> {
 *   const page = await getPage(params.id);
 *   return generateDynamicMetadata({
 *     title: page.title,
 *     description: page.description,
 *     path: `/pages/${params.id}`,
 *   });
 * }
 */
export function generateDynamicMetadata({
  title,
  description,
  path,
  ogImage,
}: {
  title: string;
  description?: string;
  path: string;
  ogImage?: string;
}): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://admin.thrico.app";
  const fullUrl = `${baseUrl}${path}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Merge custom metadata with default metadata
 */
export function mergeMetadata(
  defaultMeta: Metadata,
  customMeta: Metadata
): Metadata {
  return {
    ...defaultMeta,
    ...customMeta,
    openGraph: {
      ...defaultMeta.openGraph,
      ...customMeta.openGraph,
    },
    twitter: {
      ...defaultMeta.twitter,
      ...customMeta.twitter,
    },
  };
}
