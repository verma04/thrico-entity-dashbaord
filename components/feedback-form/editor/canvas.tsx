"use client";

import { useFormStore } from "@/store/useFormStore";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { QuestionPreview } from "./question-preview";

export function Canvas() {
  const {
    questions,
    selectedQuestionId,
    formSettings,
  } = useFormStore();

  const question = questions.find((q) => q.id === selectedQuestionId);

  if (!question) {
    return (
      <div className="flex-1 h-full bg-muted/20 flex items-center justify-center text-muted-foreground text-xs">
        Select a question to edit
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-muted/15 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      {/* Visual Preview Container */}
      <div className="w-full max-w-2xl min-h-[380px] flex items-center justify-center p-4 transition-all duration-300">
        <QuestionPreview
          question={question}
          formSettings={formSettings}
          questions={questions}
        />
      </div>
    </div>
  );
}
