import { useRef, useCallback } from "react";
import { useFormStore } from "@/store/useFormStore";
import {
  useAddQuestion,
  useEditQuestion,
  useDeleteQuestion,
  useReorderQuestions,
  useUpdateFormSettings,
} from "@/graphql/surveys/survey-mutations";
import { debounce } from "lodash";
import { useParams } from "next/navigation";

export function useSurveyEditor() {
  const params = useParams();
  const surveyId = Array.isArray(params?.id) ? params?.id[0] : params?.id;
  const store = useFormStore();

  const [addQuestionMutation, { loading: isAddingQuestion }] = useAddQuestion({
    onError: (err) => console.error("Failed to add question:", err),
  });

  const [editQuestionMutation] = useEditQuestion({
    onError: (err) => console.error("Failed to update question:", err),
  });

  const [deleteQuestionMutation, { loading: isDeletingQuestion }] =
    useDeleteQuestion({
      onError: (err) => console.error("Failed to delete question:", err),
    });

  const [reorderQuestionsMutation] = useReorderQuestions({
    onError: (err) => console.error("Failed to reorder questions:", err),
  });

  const [updateFormSettingsMutation] = useUpdateFormSettings({
    onError: (err) => console.error("Failed to update settings:", err),
  });

  // Debounced update for saving changes to the server
  const debouncedUpdate = useCallback(
    debounce((id: string, input: any) => {
      // Don't send updates for temporary IDs
      if (id.toString().startsWith("temp-")) return;
      editQuestionMutation({
        variables: { id, input },
      });
    }, 1000),
    [editQuestionMutation],
  );

  const debouncedSettingsUpdate = useCallback(
    debounce((surveyId: string, input: any) => {
      updateFormSettingsMutation({
        variables: {
          updateFormSettingsId: surveyId,
          input,
          
        },
      });
    }, 1000),
    [updateFormSettingsMutation],
  );

  const addQuestion = useCallback(
    async (type: any) => {
      try {
        if (!surveyId) {
          console.error("Survey ID is missing, cannot sync addQuestion");
          return;
        }

        const currentQuestions = useFormStore.getState().questions;

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
          case "YES_NO":
            defaultQuestion = "Do you agree?";
            break;
        }

        let questionInput: any = {
          formId: surveyId,
          type,
          question: defaultQuestion,
          order: currentQuestions.length,
          required: false,
        };

        switch (type) {
          case "SHORT_TEXT":
            questionInput.maxLength = 255;
            break;
          case "LONG_TEXT":
            questionInput.maxLength = 4000;
            break;
          case "MULTIPLE_CHOICE":
          case "DROPDOWN":
          case "ISOPTION":
            questionInput.options = ["Option 1", "Option 2", "Option 3"];
            questionInput.allowMultiple = type === "MULTIPLE_CHOICE";
            break;
          case "RATING":
            questionInput.scale = 5;
            questionInput.ratingType = "star";
            break;
          case "OPINION_SCALE":
            questionInput.min = 1;
            questionInput.max = 10;
            questionInput.labels = {
              start: "Not at all likely",
              end: "Extremely likely",
            };
            break;
          case "LEGAL":
            questionInput.legalText = "I agree to the terms and conditions";
            break;
        }

        const { data } = await addQuestionMutation({
          variables: {
            input: questionInput,
          },
        });

        if (data?.addQuestion) {
          store.addQuestion(
            data.addQuestion as unknown as import("@/store/ts-types").Question,
          );
        }
      } catch (error) {
        console.error("AddQuestion Failed:", error);
      }
    },
    [store, addQuestionMutation, surveyId],
  );

  const updateQuestion = useCallback(
    (id: string | number, field: string, value: any) => {
      store.updateQuestion(id, field as any, value);

      // Debounce server update
      // Construct a partial input based on the field changed
      // Note: This assumes the API accepts partial updates (EditQuestionInput attributes are optional)
      const input = { [field]: value };
      debouncedUpdate(id.toString(), input);
    },
    [store, debouncedUpdate],
  );

  const deleteQuestion = useCallback(
    async (id: string | number) => {
      try {
        if (!id.toString().startsWith("temp-")) {
          await deleteQuestionMutation({ variables: { id: id.toString() } });
        }
        // Only remove from store after successful server deletion
        store.removeQuestion(id);
      } catch (error) {
        console.error("DeleteQuestion Failed:", error);
      }
    },
    [store, deleteQuestionMutation],
  );

  // Wrappers for option management
  const updateOption = useCallback(
    (questionId: string | number, index: number, value: string) => {
      store.updateOption(questionId, index, value);
      // We need to send the FULL list of options for the update
      const question = store.questions.find((q) => q.id === questionId);
      if (question && !questionId.toString().startsWith("temp-")) {
        const newOptions = [...(question.options || [])];
        newOptions[index] = value;
        debouncedUpdate(questionId.toString(), { options: newOptions });
      }
    },
    [store, debouncedUpdate],
  );

  const addOption = useCallback(
    (questionId: string | number) => {
      store.addOption(questionId);
      const question = store.questions.find((q) => q.id === questionId);
      if (question && !questionId.toString().startsWith("temp-")) {
        const newOptions = [
          ...(question.options || []),
          `Option ${(question.options?.length || 0) + 1}`,
        ];
        debouncedUpdate(questionId.toString(), { options: newOptions });
      }
    },
    [store, debouncedUpdate],
  );

  const reorderQuestions = useCallback(
    (oldIndex: number, newIndex: number) => {
      store.reorderQuestions(oldIndex, newIndex);

      // Prepare input for bulk reorder
      // We need the new order of ALL questions or just the changed ones.
      // The mutation expects [ { id, order } ]
      // We can just send the whole list with new indices
      const updatedQuestions = store.questions; // This might be stale if state update is async? Zustand is sync usually.
      // Actually, store.reorderQuestions updates state. We need the result.
      // Let's rely on the fact that we can calculate the new order or get it from store next tick?
      // Better: let's calc it here to be safe and send it.

      // Limitation: Accessing accurate `store.questions` immediately after `store.reorderQuestions`
      // works in Vanilla Zustand usage if called via reading state, but `useFormStore()` hook returns a snapshot.
      // For sync correctness, we should probably construct the reordered list locally too or assume optimistically.

      // Ideally we debounce this too, but reordering is usually a drag-end event.
      // Let's just collect all IDs and their new index.

      // NOTE: This implementation assumes `store.questions` will be updated on next render.
      // For immediate access, we might need `useFormStore.getState().questions`

      setTimeout(() => {
        const currentQuestions = useFormStore.getState().questions;
        const input = currentQuestions
          .map((q, index) => ({
            id: q.id.toString(),
            order: index + 1,
          }))
          .filter((q) => !q.id.startsWith("temp-"));

        if (input.length > 0) {
          reorderQuestionsMutation({ variables: { input } });
        }
      }, 0);
    },
    [store, reorderQuestionsMutation],
  );

  const updateFormSetting = useCallback(
    (
      key: keyof import("@/store/ts-types").FormSettings | "previewType",
      value: any,
    ) => {
      // Update store immediately
      if (key === "previewType") {
        store.setPreviewType(value);
      } else {
        store.updateFormSetting(key as any, value);
      }

      if (!surveyId) return;

      // Prepare payload for server
      // We need to construct the full appearance object or partial?
      // Since it's an update, let's just send what changed if possible, OR send the whole appearance object from store.
      // Getting latest state from store to ensure consistency
      const currentSettings = useFormStore.getState().formSettings;
      const currentPreviewType = useFormStore.getState().previewType;

      let input: any = {};

      if (key === "previewType") {
        input.previewType = value;
      } else {
        // If it's an appearance setting, we need to send the mostly complete appearance object
        // or at least the part that changed wrapped in "appearance".
        // Assuming 'appearance' is a JSON field that merges or replaces.
        // Safer to send the updated appearance state.
        input.appearance = {
          ...currentSettings,
          [key]: value,
        };
      }

      debouncedSettingsUpdate(surveyId as string, input);
    },
    [store, debouncedSettingsUpdate, surveyId],
  );

  return {
    ...store, // exposing other store methods/state directly if needed
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    updateFormSetting,
    updateOption,
    addOption,
    isAddingQuestion,
    isDeletingQuestion,
  };
}
