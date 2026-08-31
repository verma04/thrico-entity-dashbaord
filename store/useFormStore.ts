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
  endIndex: number,
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

interface FormState {
  formId: string | null;
  setFormId: (formId: string | null) => void;
  formTitle: string;
  formDescription: string;
  questions: Question[];
  formSettings: FormSettings;
  previewType: "SCROLL_LONG" | "MULTI_STEP";
  startDate: moment.Moment | null;
  endDate: moment.Moment | null;
  setQuestions: (questions: Question[]) => void;

  selectedQuestionId: string | number | null;
  selectQuestion: (id: string | number | null) => void;

  setFormTitle: (title: string) => void;
  setFormDescription: (desc: string) => void;

  addQuestion: (question: Question) => void;
  updateQuestionId: (oldId: string | number, newId: string) => void;
  updateQuestion: UpdateQuestionFn;
  duplicateQuestion: DuplicateQuestionFn;
  updateOption: UpdateOptionFn;
  addOption: AddOptionFn;
  removeQuestion: (id: any) => void;
  updateFormSetting: UpdateFormSettingFn;
  reorderQuestions: (oldIndex: number, newIndex: number) => void;
  setPreviewType: (previewType: "SCROLL_LONG" | "MULTI_STEP") => void;
  setStartDate: (date: moment.Moment | null) => void;
  setEndDate: (date: moment.Moment | null) => void;
  resetForm: () => void;
  loadForm: (data: any) => void;
}

export const useFormStore = create<FormState>((set, get) => ({
  formId: null,
  setFormId: (formId) => set({ formId }),
  formTitle: "Untitled Form",
  formDescription: "",
  previewType: "SCROLL_LONG",
  startDate: null,
  endDate: null,
  selectedQuestionId: 1,
  questions: [],
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
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setPreviewType: (previewType) => set({ previewType: previewType }),
  setFormDescription: (desc) => set({ formDescription: desc }),
  setQuestions: (questions) => set({ questions }),
  addQuestion: (newQuestion) => {
    const questions = get().questions;
    set({
      questions: [...questions, newQuestion],
      selectedQuestionId: newQuestion.id,
    });
  },

  updateQuestionId: (oldId, newId) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === oldId ? { ...q, id: newId } : q,
      ),
      selectedQuestionId:
        state.selectedQuestionId === oldId ? newId : state.selectedQuestionId,
    })),

  updateQuestion: (id, field, value) =>
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q,
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

  resetForm: () =>
    set({
      formId: null,
      formTitle: "Untitled Form",
      formDescription: "",
      previewType: "SCROLL_LONG",
      startDate: null,
      endDate: null,
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
      selectedQuestionId: 1,
    }),

  loadForm: (data) =>
    set({
      formId: data.formId || null,
      formTitle: data.title || "Untitled Form",
      formDescription: data.description || "",
      previewType: data.previewType || "SCROLL_LONG",
      startDate: data.startDate ? moment(data.startDate) : null,
      endDate: data.endDate ? moment(data.endDate) : null,
      questions: data.questions || [],
      formSettings: data.appearance || {
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
    }),
}));
