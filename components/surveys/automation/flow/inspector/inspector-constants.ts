import {
  ClipboardList,
  CheckCircle2,
  PlusCircle,
} from "lucide-react";
import { SurveyRuleTrigger } from "@/graphql/survey-automation";

export interface SurveyConditionFieldMeta {
  value: string;
  label: string;
  category: "Survey Response" | "Respondent Profile" | "Engagement";
  type: "number" | "string" | "boolean" | "array";
}

export const SURVEY_CONDITION_FIELDS: SurveyConditionFieldMeta[] = [
  // Survey Specific Fields
  {
    value: "context.rating",
    label: "Overall Rating / Score (1 - 5 ★)",
    category: "Survey Response",
    type: "number",
  },
  {
    value: "context.selectedOptions",
    label: "Selected Option / Answer Choice",
    category: "Survey Response",
    type: "string",
  },
  {
    value: "context.isPromoter",
    label: "Is NPS Promoter (Score 9-10)",
    category: "Survey Response",
    type: "boolean",
  },
  {
    value: "context.isDetractor",
    label: "Is NPS Detractor (Score 0-6)",
    category: "Survey Response",
    type: "boolean",
  },
  {
    value: "context.npsScore",
    label: "NPS Rating Value (0 - 10)",
    category: "Survey Response",
    type: "number",
  },
  {
    value: "context.completionTimeSeconds",
    label: "Completion Time (Seconds)",
    category: "Engagement",
    type: "number",
  },
  {
    value: "context.answers.feedbackText",
    label: "Written Comment / Feedback Text",
    category: "Survey Response",
    type: "string",
  },
  {
    value: "context.answers.recommendToColleague",
    label: "Would Recommend (Yes/No)",
    category: "Survey Response",
    type: "boolean",
  },
  // Respondent / Member Profile Fields
  {
    value: "userToEntity.tags",
    label: "Respondent Member Tags",
    category: "Respondent Profile",
    type: "array",
  },
  {
    value: "userToEntity.membershipTierId",
    label: "Current Membership Tier",
    category: "Respondent Profile",
    type: "string",
  },
  {
    value: "user.email",
    label: "Respondent Email Domain / Address",
    category: "Respondent Profile",
    type: "string",
  },
];

export const SURVEY_CONDITION_OPERATORS = [
  { value: "contains", label: "Contains (text/choice match)" },
  { value: "eq", label: "Equals (=)" },
  { value: "gte", label: "Greater than or equal (≥)" },
  { value: "lte", label: "Less than or equal (≤)" },
  { value: "not_equals", label: "Does not equal (≠)" },
  { value: "is_not_empty", label: "Is Set / Not Empty" },
  { value: "is_empty", label: "Is Empty / Not Set" },
];

export const TRIGGER_OPTIONS: {
  value: SurveyRuleTrigger;
  label: string;
  badge: string;
  description: string;
  icon: any;
}[] = [
  {
    value: "SURVEY_SUBMITTED",
    label: "Survey Response Submitted",
    badge: "Submit Event",
    description:
      "Evaluated immediately when a user submits responses to any question in the survey.",
    icon: ClipboardList,
  },
  {
    value: "SURVEY_COMPLETED",
    label: "Survey Full Completion",
    badge: "Completed",
    description:
      "Triggered only when all required pages and questions are 100% completed.",
    icon: CheckCircle2,
  },
  {
    value: "SURVEY_CREATED",
    label: "New Survey Published",
    badge: "Launch Event",
    description:
      "Triggered when an administrator launches and publishes a new survey.",
    icon: PlusCircle,
  },
];

export const SUGGESTED_TAGS = [
  "Survey Completed",
  "NPS Promoter",
  "NPS Detractor",
  "Mentorship Seeker",
  "Dev Contributor",
  "Community Champion",
  "Product Feedback",
  "VIP Respondent",
  "Needs Follow-Up",
];
