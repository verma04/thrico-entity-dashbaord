/**
 * Polaris Primitives — Shared form design system primitives
 *
 * Shopify Polaris-inspired components with consistent sizing:
 * - Labels: 13.5px, font-medium, #303030
 * - Inputs: 40px height, 14px text, rounded-8px, border-#aeb4b9
 * - Helpers/Errors: 12.5px, #616161 / #d72c0d
 * - Cards: rounded-12px, border-#d2d5d9, shadow-sm
 */

export { PolarisCard } from "./polaris-card";
export type { PolarisCardProps } from "./polaris-card";

export { PolarisLabel } from "./polaris-label";
export type { PolarisLabelProps } from "./polaris-label";

export { PolarisInput } from "./polaris-input";
export type { PolarisInputProps } from "./polaris-input";

export { PolarisTextarea } from "./polaris-textarea";
export type { PolarisTextareaProps } from "./polaris-textarea";

export { PolarisSelect } from "./polaris-select";
export type { PolarisSelectProps, PolarisSelectOption } from "./polaris-select";

export {
  PolarisFormSkeleton,
  Bone,
  SkeletonCard,
  SkeletonSidebarCard,
  SkeletonInfoCard,
  SkeletonTipCard,
} from "./polaris-form-skeleton";
export type { PolarisFormSkeletonProps } from "./polaris-form-skeleton";
