// useFormStore.ts
import { create } from "zustand";
import {
  Question,
  FormSettings,
  UpdateFormSettingFn,
  UpdateOptionFn,
  AddOptionFn,
  DuplicateQuestionFn,
  UpdateQuestionFn,
} from "./ts-types";
import moment from "moment";

// Helper function to reorder array items (replaces arrayMove from @dnd-kit/sortable)
const reorderArray = <T>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface FormState {
  formTitle: string;
  formDescription: string;
  questions: Question[];
  formSettings: FormSettings;
  previewType: "SCROLL_LONG" | "MULTI_STEP";
  endDate: moment.Moment | null;
  setQuestions: (questions: Question[]) => void;

  selectedQuestionId: string | number | null;
  selectQuestion: (id: string | number | null) => void;

  setFormTitle: (title: string) => void;
  setFormDescription: (desc: string) => void;

  addQuestion: (type: Question["type"]) => void;
  updateQuestion: UpdateQuestionFn;
  duplicateQuestion: DuplicateQuestionFn;
  updateOption: UpdateOptionFn;
  addOption: AddOptionFn;
  removeQuestion: (id: any) => void;
  updateFormSetting: UpdateFormSettingFn;
  reorderQuestions: (oldIndex: number, newIndex: number) => void;
  setPreviewType: (previewType: "SCROLL_LONG" | "MULTI_STEP") => void;
  setEndDate: (previewType: moment.Moment | null) => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  formTitle: "Untitled Form",
  formDescription: "",
  previewType: "SCROLL_LONG",
  endDate: null,
  selectedQuestionId: 1,
  questions: [
    {
      id: 1,
      type: "MULTIPLE_CHOICE",
      question: "How satisfied are you with our service?",
      options: [
        "Very satisfied",
        "Satisfied",
        "Neutral",
        "Dissatisfied",
        "Very dissatisfied",
      ],
      required: true,
    },
  ],
  formSettings: {
    primaryColor: "#667eea",
    secondaryColor: "#764ba2",
    backgroundColor: "#f8f9fa",
    textColor: "#2c3e50",
    buttonColor: "#667eea",
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: "solid",
    borderColor: "#e1e8ed",
    inputBackground: "#ffffff",
    inputBorderColor: "#d9d9d9",
    fontSize: 16,
    fontWeight: "400",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
    hoverEffect: "none",
  },

  selectQuestion: (id) => set({ selectedQuestionId: id }),
  setFormTitle: (title) => set({ formTitle: title }),
  setEndDate: (date) => set({ endDate: date }),
  setPreviewType: (previewType) => set({ previewType: previewType }),
  setFormDescription: (desc) => set({ formDescription: desc }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (type) => {
    const questions = get().questions;
    let defaultQuestion = "New Question";

    switch (type) {
      case "SHORT_TEXT":
        defaultQuestion = "What is your name?";
        break;
      case "LONG_TEXT":
        defaultQuestion = "Please describe your feedback";
        break;
      case "MULTIPLE_CHOICE":
        defaultQuestion = "Select an option";
        break;
      case "DROPDOWN":
        defaultQuestion = "Select one from the list";
        break;
      case "ISOPTION":
        defaultQuestion = "Choose your preference";
        break;
      case "RATING":
        defaultQuestion = "How would you rate us?";
        break;
      case "OPINION_SCALE":
        defaultQuestion = "How likely are you to recommend us?";
        break;
      case "LEGAL":
        defaultQuestion = "Do you accept the terms?";
        break;
      case "DATE":
        defaultQuestion = "Select a date";
        break;
      case "TIME":
        defaultQuestion = "Select a time";
        break;
      case "EMAIL":
        defaultQuestion = "What is your email?";
        break;
      case "PHONE":
        defaultQuestion = "What is your phone number?";
        break;
      case "WEBSITE":
        defaultQuestion = "What is your website?";
        break;
      case "NUMBER":
        defaultQuestion = "Enter a number";
        break;
      case "YES-NO":
        defaultQuestion = "Do you agree?";
        break;
    }

    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      question: defaultQuestion,
      required: false,
    };

    switch (type) {
      case "SHORT_TEXT":
        newQuestion.maxLength = 255;
        break;
      case "LONG_TEXT":
        newQuestion.maxLength = 4000;
        break;
      case "MULTIPLE_CHOICE":
      case "DROPDOWN":
      case "ISOPTION":
        newQuestion.options = ["Option 1", "Option 2", "Option 3"];
        newQuestion.allowMultiple = type === "MULTIPLE_CHOICE";
        break;
      case "RATING":
        newQuestion.scale = 5;
        newQuestion.ratingType = "star";
        break;
      case "OPINION_SCALE":
        newQuestion.min = 1;
        newQuestion.max = 10;
        newQuestion.labels = {
          start: "Not at all likely",
          end: "Extremely likely",
        };
        break;
      case "LEGAL":
        newQuestion.text = "I agree to the terms and conditions";
        break;
    }

    set({
      questions: [...questions, newQuestion],
      selectedQuestionId: newQuestion.id,
    });
  },

  updateQuestion: (id, field, value) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    })),

  duplicateQuestion: (id) =>
    set((state) => {
      const questionToDuplicate = state.questions.find((q) => q.id === id);
      if (!questionToDuplicate) return {};
      const newId =
        state.questions.length > 0
          ? Math.max(...state.questions.map((q) => Number(q.id))) + 1
          : 1;
      const newQuestion = { ...questionToDuplicate, id: newId };
      return { questions: [...state.questions, newQuestion] };
    }),

  updateOption: (questionId, index, value) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (q.id === questionId) {
          const newOptions = [...(q.options ?? [])];
          newOptions[index] = value;
          return { ...q, options: newOptions };
        }
        return q;
      }),
    })),

  addOption: (questionId) =>
    set((state) => ({
      questions: state.questions.map((q) => {
        if (String(q.id) === questionId) {
          return {
            ...q,
            options: [
              ...(q.options as string[]),
              `Option ${(q.options as string[]).length + 1}`,
            ],
          };
        }
        return q;
      }),
    })),

  removeQuestion: (id) =>
    set((state) => ({
      questions: state.questions.filter((q) => q.id !== id),
    })),

  updateFormSetting: (key, value) =>
    set((state) => ({
      formSettings: {
        ...state.formSettings,
        [key]: value,
      },
    })),

  // Reorder questions using our custom reorderArray helper
  reorderQuestions: (oldIndex, newIndex) =>
    set((state) => ({
      questions: reorderArray(state.questions, oldIndex, newIndex),
    })),
}));
