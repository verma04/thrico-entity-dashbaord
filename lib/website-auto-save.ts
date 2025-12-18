/**
 * Utility functions for website builder auto-save functionality
 */

export interface AutoSaveHandlers {
  saveTheme: (websiteId: string, theme: string) => Promise<void>;
  saveFont: (websiteId: string, font: string) => Promise<void>;
  saveModule: (moduleId: string, data: {
    name?: string;
    layout?: string;
    content?: any;
    isEnabled?: boolean;
  }) => Promise<void>;
  saveNavbar: (websiteId: string, data: {
    layout?: string;
    content?: any;
    isEnabled?: boolean;
  }) => Promise<void>;
  saveFooter: (websiteId: string, data: {
    layout?: string;
    content?: any;
    isEnabled?: boolean;
  }) => Promise<void>;
}

/**
 * Type-safe wrapper for creating auto-save handlers
 */
export function createAutoSaveHandler<T extends (...args: any[]) => Promise<void>>(
  handler: T
): T {
  return handler;
}

/**
 * Debounce utility for auto-save operations
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
