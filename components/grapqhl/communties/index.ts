/**
 * Communities GraphQL Operations - Main Export File
 * 
 * This file re-exports all GraphQL operations, hooks, and utilities from the split files
 * to maintain backward compatibility with existing imports.
 */

// Re-export fragments
export * from "./fragments";

// Re-export community queries and hooks
export * from "./community-queries";

// Re-export community mutations and hooks
export * from "./community-mutations";

// Re-export feed operations and hooks
export * from "./feed-operations";

// Re-export cache utilities
export * from "./cache-utils";

// Re-export types (assuming they're still needed)
export * from "./types";

// Export the deprecated updateFeedCache function from the original file for backward compatibility
// This will be available through cache-utils export above, but we can also import it here if needed

// Note: Member management operations are still in the original file
// Once we split them out, we can add:
// export * from "./member-management";
// Re-export chat queries and mutations
export * from "./chat/queries";
export * from "./chat/mutations";
