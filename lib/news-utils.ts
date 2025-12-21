/**
 * Generate a URL-friendly slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Calculate estimated read time based on content
 * Assumes average reading speed of 200 words per minute
 */
export function calculateReadTime(content: string): string {
  // Strip HTML tags for word count
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / 200);
  
  return minutes === 1 ? "1 min read" : `${minutes} min read`;
}

/**
 * Sanitize HTML content to prevent XSS attacks
 * Basic sanitization - in production, consider using a library like DOMPurify
 */
export function sanitizeContent(html: string): string {
  // This is a basic sanitization - you may want to use DOMPurify in production
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/on\w+="[^"]*"/g, "")
    .replace(/on\w+='[^']*'/g, "");
}

/**
 * Format date to readable format
 */
export function formatNewsDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // If within last 7 days, show relative time
  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  }

  // Otherwise show formatted date
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Get excerpt from content if not provided
 */
export function generateExcerpt(content: string, maxLength: number = 200): string {
  const text = content.replace(/<[^>]*>/g, "").trim();
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Validate news article data
 */
export function validateNewsArticle(article: {
  title: string;
  content: string;
  excerpt: string;
  author: string;
  category: string;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!article.title || article.title.trim().length === 0) {
    errors.push("Title is required");
  }

  if (!article.content || article.content.trim().length === 0) {
    errors.push("Content is required");
  }

  if (!article.excerpt || article.excerpt.trim().length === 0) {
    errors.push("Excerpt is required");
  }

  if (!article.author || article.author.trim().length === 0) {
    errors.push("Author is required");
  }

  if (!article.category || article.category.trim().length === 0) {
    errors.push("Category is required");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
