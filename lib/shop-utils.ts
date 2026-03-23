/**
 * Category image mapping utility
 * Maps product categories to default placeholder images
 */

export const CATEGORY_DEFAULT_IMAGES: Record<string, string> = {
  clothing:
    "https://cdn.thrico.network/shop_product_clothing.png",
  electronics:
    "https://cdn.thrico.network/shop_product_electronics.png",
  digital:
    "https://cdn.thrico.network/shop_product_digital_goods.png",
  services:
    "https://cdn.thrico.network/shop_product_services.png",
  merch:
    "https://cdn.thrico.network/shop_product_merchandise.png",
};

/**
 * Get default image for a category
 * @param category - Category ID or name
 * @returns Default image URL or fallback
 */
export const getCategoryDefaultImage = (category: string): string => {
  const normalizedCategory = category.toLowerCase().trim();
  return (
    CATEGORY_DEFAULT_IMAGES[normalizedCategory] ||
    CATEGORY_DEFAULT_IMAGES.clothing
  );
};
/**
 * Get full CDN URL for an image key or return as is if already a URL
 * @param urlOrKey - The image key or full URL
 * @returns Full CDN URL
 */
export const resolveCdnUrl = (urlOrKey?: string | null): string => {
  if (!urlOrKey) return "";
  if (urlOrKey.startsWith("http")) return urlOrKey;
  return `https://cdn.thrico.network/${urlOrKey}`;
};
