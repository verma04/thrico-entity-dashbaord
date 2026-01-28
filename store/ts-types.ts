export type QuestionOption = string | { text: string; imageUrl: string };
export interface Question {
  id: number | string;
  type:
    | "SHORT_TEXT"
    | "LONG_TEXT"
    | "EMAIL"
    | "PHONE"
    | "WEBSITE"
    | "NUMBER"
    | "OPINION_SCALE"
    | "RATING"
    | "MULTIPLE_CHOICE"
    | "DROPDOWN"
    | "ISOPTION"
    | "DATE"
    | "TIME"
    | "YES_NO"
    | "LEGAL";
  question: string;
  description?: string;
  required: boolean;

  // Specific properties
  maxLength?: number;
  min?: number;
  max?: number;
  labels?: {
    start: string;
    end: string;
  };
  options?: string[];
  allowMultiple?: boolean;
  scale?: number;
  ratingType?: "star" | "heart" | "thumb";
  text?: string;
}

export interface FormSettings {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  borderRadius: number;
  borderWidth: number;
  borderStyle: string;
  borderColor: string;
  inputBackground: string;
  inputBorderColor: string;
  fontSize: number;
  fontWeight: string;
  boxShadow: string;
  hoverEffect: string;
}

export type DuplicateQuestionFn = (id: string | number) => void;
export type RemoveQuestionFn = (id: string | number) => void;

export type UpdateOptionFn = (
  questionId: string | number,
  index: number,
  value: string,
) => void;

export type AddOptionFn = (questionId: string | number) => void;

export type UpdateQuestionFn = (
  id: string | number,
  field: keyof Question,
  value: any,
) => void;

export type UpdateFormSettingFn = (
  key: keyof FormSettings,
  value: string | number,
) => void;

export type AnswerMapFn = (questionId: string | number, value: any) => any;
