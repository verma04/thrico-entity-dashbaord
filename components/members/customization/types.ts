export type AuthMethod = "BOTH" | "EMAIL_ONLY" | "GOOGLE_ONLY";

export type CustomFieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "select"
  | "textarea"
  | "date"
  | "url"
  | "checkbox";

export type ValidationMode = "NONE" | "REGEX" | "CSV_ROSTER" | "BOTH";

export interface CustomFieldItem {
  id: string;
  key: string;
  label: string;
  type: CustomFieldType;
  placeholder?: string;
  helperText?: string;
  required: boolean;
  options?: string[]; // for select dropdown
  order: number;
  // Custom Validation & Gatekeeping
  validationMode?: ValidationMode;
  validationRegex?: string;
  validationErrorMessage?: string;
  blockIfNotExists?: boolean;
  preventDuplicate?: boolean;
}

export interface MemberOnboardingConfig {
  authMethod: AuthMethod;
  enableGoogleLogin: boolean;
  enableEmailLogin: boolean;
  referral: {
    enabled: boolean;
    required: boolean;
    helperText?: string;
  };
  customFields: CustomFieldItem[];
}

export const DEFAULT_ONBOARDING_CONFIG: MemberOnboardingConfig = {
  authMethod: "BOTH",
  enableGoogleLogin: true,
  enableEmailLogin: true,
  referral: {
    enabled: true,
    required: false,
    helperText: "Have a referral code? Enter it below.",
  },
  customFields: [],
};

export const FIELD_TYPE_LABELS: Record<CustomFieldType, { label: string; iconName: string }> = {
  text: { label: "Short Text", iconName: "Type" },
  number: { label: "Number", iconName: "Hash" },
  email: { label: "Email Address", iconName: "Mail" },
  tel: { label: "Phone Number", iconName: "Phone" },
  select: { label: "Dropdown Select", iconName: "ListFilter" },
  textarea: { label: "Long Text / Bio", iconName: "AlignLeft" },
  date: { label: "Date Picker", iconName: "Calendar" },
  url: { label: "Website / URL", iconName: "Globe" },
  checkbox: { label: "Checkbox / Agree", iconName: "CheckSquare" },
};
