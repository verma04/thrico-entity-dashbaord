/**
 * Polaris Primitives — Shared form design system primitives
 *
 * Shopify Polaris-inspired components with consistent sizing:
 * - Labels: 12px, font-medium, #303030
 * - Inputs: 34px height, 12.5px text, rounded-6px, border-#aeb4b9
 * - Helpers/Errors: 11px, #616161 / #d72c0d
 * - Cards: rounded-10px, border-#d2d5d9, shadow-sm
 */

export { PolarisCard } from "./polaris-card";
export type { PolarisCardProps } from "./polaris-card";

export { PolarisLabel, renderPolarisLabelAction } from "./polaris-label";
export type {
  PolarisLabelProps,
  PolarisLabelAction,
  PolarisLabelActionObject,
} from "./polaris-label";

export { PolarisInput } from "./polaris-input";
export type { PolarisInputProps } from "./polaris-input";

export { PolarisTextarea } from "./polaris-textarea";
export type { PolarisTextareaProps } from "./polaris-textarea";

export { PolarisSelect } from "./polaris-select";
export type { PolarisSelectProps, PolarisSelectOption } from "./polaris-select";

export { PolarisMultiSelect } from "./polaris-multi-select";
export type {
  PolarisMultiSelectProps,
  PolarisMultiSelectOption,
} from "./polaris-multi-select";

export { PolarisCombobox } from "./polaris-combobox";
export type {
  PolarisComboboxProps,
  PolarisComboboxOption,
} from "./polaris-combobox";

export { PolarisDatePicker } from "./polaris-date-picker";
export type { PolarisDatePickerProps } from "./polaris-date-picker";

export {
  PolarisFormSkeleton,
  Bone,
  SkeletonCard,
  SkeletonSidebarCard,
  SkeletonInfoCard,
  SkeletonTipCard,
} from "./polaris-form-skeleton";
export type { PolarisFormSkeletonProps } from "./polaris-form-skeleton";
