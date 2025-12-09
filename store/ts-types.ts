export type QuestionOption = string | { text: string; imageUrl: string };
export interface Question {
  id: string | number;
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
    | "ISOPTION"
    | "DROPDOWN"
    | "DATE"
    | "TIME"
    | "YES-NO"
    | "LEGAL";

  question?: string;
  required?: boolean;
  options?: string[];
  allowMultiple?: boolean;
  maxLength?: number;
  scale?: number;
  ratingType?: string;
  min?: number;
  max?: number;
  labels?: { start: string; end: string };
  text?: string;
  statement?: string;
  questions?: Question[];
  fieldName?: string;
  defaultValue?: string;
  allowedTypes?: string[];
  maxSize?: number;
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

export interface DuplicateQuestionFn {
  (id: number): void;
}

export interface UpdateOptionFn {
  (questionId: number | string, index: number, value: string): void;
}

export interface UpdateQuestionFn {
  (id: string, field: string, value: any): void;
}

export interface UpdateFormSettingFn {
  (key: keyof FormSettings, value: string | number): void;
}

export interface AddOptionFn {
  (questionId: string | number): void;
}

export interface RemoveQuestionFn {
  (id: string): void;
}

export interface AnswerMapFn {
  (questionId: string | number, value: any): any;
}

export type ButtonTheme = {
  colorPrimary?: string;
  colorText?: string;
  colorBorder?: string;
  borderRadius?: number;
  defaultBg?: string;
  defaultColor?: string;
  defaultBorderColor?: string;
  fontSize?: number;
};

export type EntityTheme = {
  primaryColor?: string;
  secondaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  buttonColor?: string;
  borderRadius?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
  inputBackground?: string;
  inputBorderColor?: string;
  fontSize?: number;
  fontWeight?: string;
  boxShadow?: string;
  hoverEffect?: string;
  Button?: ButtonTheme;
};
