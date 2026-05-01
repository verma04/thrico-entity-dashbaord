import { format as dateFnsFormat, formatDistance as dateFnsFormatDistance, formatDistanceToNow as dateFnsFormatDistanceToNow, isValid } from "date-fns";

/**
 * Safely parses a date from various formats (Unix timestamp string, ISO string, or Date object)
 */
export function safeParseDate(dateInput: any): Date | null {
  if (!dateInput) return null;

  let date: Date;

  // If it's already a Date object
  if (dateInput instanceof Date) {
    date = dateInput;
  } 
  // If it's a number (Unix timestamp)
  else if (typeof dateInput === 'number') {
    date = new Date(dateInput);
  }
  // If it's a string
  else if (typeof dateInput === 'string') {
    // Check if it's a numeric string (Unix timestamp)
    if (/^\d+$/.test(dateInput)) {
      date = new Date(Number(dateInput));
    } else {
      // Try parsing as ISO or other string format
      date = new Date(dateInput);
    }
  } else {
    return null;
  }

  return isValid(date) ? date : null;
}

/**
 * Safely formats distance to now, returning a fallback if the date is invalid
 */
export function safeFormatDistanceToNow(dateInput: any, options?: any): string {
  const date = safeParseDate(dateInput);
  if (!date) return "N/A";
  
  try {
    return dateFnsFormatDistanceToNow(date, options);
  } catch (error) {
    console.error("Error formatting date distance:", error);
    return "N/A";
  }
}

/**
 * Safely formats distance between two dates
 */
export function safeFormatDistance(dateInput: any, baseDate: any, options?: any): string {
  const date = safeParseDate(dateInput);
  const base = safeParseDate(baseDate);
  if (!date || !base) return "N/A";

  try {
    return dateFnsFormatDistance(date, base, options);
  } catch (error) {
    console.error("Error formatting date distance:", error);
    return "N/A";
  }
}

/**
 * Safely formats a date using date-fns format string
 */
export function safeFormat(dateInput: any, formatStr: string, fallback = "N/A"): string {
  const date = safeParseDate(dateInput);
  if (!date) return fallback;

  try {
    return dateFnsFormat(date, formatStr);
  } catch (error) {
    console.error("Error formatting date:", error);
    return fallback;
  }
}

/**
 * Safely gets locale date string
 */
export function safeLocaleDateString(dateInput: any, fallback = "N/A"): string {
  const date = safeParseDate(dateInput);
  if (!date) return fallback;
  return date.toLocaleDateString();
}
