"use client";

import { useFormStore } from "@/store/useFormStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { QuestionPreview } from "./question-preview";

export function Canvas() {
  const {
    questions,
    selectedQuestionId,
    updateQuestion,
    updateOption,
    addOption,
    formSettings,
  } = useFormStore();

  const question = questions.find((q) => q.id === selectedQuestionId);

  if (!question) {
    return (
      <div className="flex-1 h-full bg-gray-50 flex items-center justify-center text-gray-400">
        Select a question to edit
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-gray-50 overflow-y-auto flex items-center justify-center p-8">
      {/* Visual Preview Container */}
      <div className="w-full max-w-4xl min-h-[500px] flex items-center justify-center p-12 transition-all duration-300">
        <QuestionPreview
          question={question}
          formSettings={formSettings}
          questions={questions}
        />
      </div>
    </div>
  );
}
