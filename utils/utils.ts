import { getMediaUrls, getPreferredMediaUrl } from './media'
import { formatNumber } from '../lib/formatNumber'
import moment from 'moment'

/**
 * Common media URL utility.
 * Proxies to getPreferredMediaUrl for simpler usage in components.
 */
export const getMediaUrl = (path: string | null | undefined): string | undefined => {
  return getPreferredMediaUrl(path)
}

/**
 * Returns an array of URLs for fallback handling.
 */
export const getMediaUrlsList = (path: string | null | undefined): string[] => {
  return getMediaUrls(path)
}

/**
 * Formats a number with K/M suffixes for better UI presentation.
 */
export function formatCount(n: number): string {
  return formatNumber(n)
}

/**
 * Formats a time string (e.g. "14:30", "09:00:00") into AM/PM format ("2:30 PM", "9:00 AM").
 */
export function formatTimeWithAmPm(timeStr?: string | null): string {
  if (!timeStr) return ''
  const trimmed = timeStr.trim()
  if (!trimmed) return ''
  if (/am|pm/i.test(trimmed)) {
    return trimmed.toUpperCase()
  }
  const parsed = moment(trimmed, ['HH:mm:ss', 'HH:mm', 'H:mm:ss', 'H:mm'])
  if (parsed.isValid()) {
    return parsed.format('h:mm A')
  }
  return timeStr
}

/**
 * Strips HTML tags and decodes basic HTML entities for safe presentation in React Native Text components.
 */
export function cleanHtml(htmlStr: string | null | undefined): string {
  if (!htmlStr) return ''
  return htmlStr
    .replace(/<br\s*\/?>/gi, '\n') // Replace break tags with newlines
    .replace(/<\/p>/gi, '\n\n')    // Replace paragraph endings with double newlines
    .replace(/<li>/gi, '• ')        // Add bullets to list items
    .replace(/<\/li>/gi, '\n')     // Newline after each list item
    .replace(/<[^>]*>/g, '')       // Strip all remaining HTML tags
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim()
}
