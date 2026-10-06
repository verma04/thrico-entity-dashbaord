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

export interface AuthPageTexts {
  loginTagline: string;
  loginTitle: string;
  loginDescription: string;
  loginFooterText: string;
  loginFooterLink: string;
  loginButtonText: string;
  signupTagline: string;
  signupTitle: string;
  signupDescription: string;
  signupFooterText: string;
  signupFooterLink: string;
  signupButtonText: string;
}

export const DEFAULT_AUTH_TEXTS: AuthPageTexts = {
  loginTagline: "WELCOME BACK",
  loginTitle: "Community Login",
  loginDescription: "Log in to access your community and exclusive features.",
  loginFooterText: "Don't have an account?",
  loginFooterLink: "Register",
  loginButtonText: "Login to Community",
  signupTagline: "GET STARTED",
  signupTitle: "Create your account",
  signupDescription: "Sign up to unlock exclusive features and connect with your community.",
  signupFooterText: "Already have an account?",
  signupFooterLink: "Log in here",
  signupButtonText: "Join Community",
};

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
  authTexts: AuthPageTexts;
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
  authTexts: DEFAULT_AUTH_TEXTS,
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
