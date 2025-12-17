"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnswerMapFn,
  FormSettings,
  Question,
} from "../../../../store/ts-types";

interface MultiStepPreviewProps {
  formTitle: string;
  formDescription?: string;
  questions: any[];
  formSettings: FormSettings;
  onClose: () => void;
}

export function MultiStepPreview({
  formTitle,
  formDescription,
  questions,
  formSettings,
  onClose,
}: MultiStepPreviewProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: string]: any;
  }>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const totalSteps = questions.length;
  const progress = (currentStep / (totalSteps + 1)) * 100;

  const isCurrentQuestionValid = () => {
    if (currentStep === 0) return true;
    if (currentStep > questions.length) return true;

    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion?.required) return true;

    const answer = answers[currentQuestion?.id];
    return answer !== undefined && answer !== null && answer !== "";
  };

  const handleNext = () => {
    if (!isCurrentQuestionValid()) {
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAnswer: AnswerMapFn = (questionId, value) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const renderWelcomeScreen = () => (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{
        background: `linear-gradient(135deg, ${formSettings?.primaryColor} 0%, ${formSettings?.secondaryColor} 100%)`,
        color: "white",
      }}
    >
      <div className="max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">{formTitle}</h1>
        {formDescription && (
          <p className="text-xl mb-12 text-white/90">{formDescription}</p>
        )}
        <Button
          size="lg"
          onClick={handleNext}
          className="text-lg h-12 px-8"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "2px solid white",
            color: "white",
            borderRadius: formSettings?.borderRadius,
          }}
        >
          Start Survey <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );

  const renderQuestion = (question: Question, index: number) => {
    const questionNumber = index + 1;
    const isLastQuestion = index === questions.length - 1;

    return (
      <div
        className="flex flex-col justify-center min-h-screen px-6"
        style={{ background: formSettings?.backgroundColor }}
      >
        <div className="max-w-3xl mx-auto w-full">
          <div className="mb-8">
            <p className="text-base text-muted-foreground mb-2">
              {questionNumber} of {questions.length}
            </p>
            <Progress
              value={(questionNumber / questions.length) * 100}
              className="h-2"
              style={{
                backgroundColor: `${formSettings?.primaryColor}20`,
              }}
            />
          </div>

          <div className="mb-12">
            <div className="flex items-start justify-between mb-6">
              <h2
                className="text-2xl font-bold"
                style={{
                  color:
                    !isCurrentQuestionValid() && currentStep > 0
                      ? "#e74c3c"
                      : formSettings?.primaryColor,
                }}
              >
                {question?.question}
                {question?.required && (
                  <span className="text-destructive"> *</span>
                )}
              </h2>
              <Button
                variant="link"
                onClick={handleNext}
                style={{ borderRadius: formSettings?.borderRadius }}
              >
                Skip
              </Button>
            </div>

            {renderQuestionInput(question)}
            {!isCurrentQuestionValid() && currentStep > 0 && (
              <div
                className="mt-4 p-3 rounded"
                style={{
                  color: "#e74c3c",
                  background: "#ffeaea",
                  border: "1px solid #ffcdd2",
                  borderRadius: formSettings?.borderRadius,
                }}
              >
                This field is required. Please provide an answer to continue.
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              size="lg"
              style={{
                visibility: currentStep === 1 ? "hidden" : "visible",
                borderRadius: formSettings?.borderRadius,
              }}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isCurrentQuestionValid()}
              size="lg"
              className="text-lg px-8"
              style={{
                background: !isCurrentQuestionValid()
                  ? "#d9d9d9"
                  : formSettings?.primaryColor,
                borderColor: !isCurrentQuestionValid()
                  ? "#d9d9d9"
                  : formSettings?.primaryColor,
                cursor: !isCurrentQuestionValid() ? "not-allowed" : "pointer",
                borderRadius: formSettings?.borderRadius,
              }}
            >
              {isLastQuestion ? "Submit" : "Next"}{" "}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionInput = (question: Question) => {
    const inputStyle = {
      fontSize: `${formSettings?.fontSize}px`,
      fontWeight: formSettings?.fontWeight,
      borderRadius: formSettings?.borderRadius,
      borderWidth: formSettings?.borderWidth,
      borderStyle: formSettings?.borderStyle,
      borderColor: formSettings?.inputBorderColor || formSettings?.borderColor,
      background: formSettings?.inputBackground,
      color: formSettings?.textColor,
      boxShadow: formSettings?.boxShadow,
    };

    switch (question?.type) {
      case "SHORT_TEXT":
        return (
          <Input
            maxLength={question?.maxLength || 255}
            placeholder="Type your answer here..."
            className="text-lg p-5"
            style={inputStyle}
            value={answers[Number(question?.id)] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "LONG_TEXT":
        return (
          <Textarea
            maxLength={question?.maxLength || 255}
            placeholder="Type your answer here..."
            rows={6}
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "EMAIL":
        return (
          <Input
            type="email"
            placeholder="email@example.com"
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "MULTIPLE_CHOICE":
      case "ISOPTION":
        return (
          <div className="grid gap-4">
            {question?.options?.map((option, index) => (
              <div
                key={index}
                onClick={() => handleAnswer(question?.id, option)}
                className="p-5 cursor-pointer transition-all"
                style={{
                  border: `${formSettings?.borderWidth}px ${formSettings?.borderStyle} ${formSettings?.borderColor}`,
                  borderRadius: formSettings?.borderRadius,
                  background:
                    answers[question?.id] === option
                      ? formSettings?.primaryColor
                      : "white",
                  color: answers[question?.id] === option ? "white" : "#2c3e50",
                  fontSize: `${formSettings?.fontSize}px`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={{
                      border: `2px solid ${answers[question?.id] === option ? "white" : formSettings?.primaryColor}`,
                      background:
                        answers[question?.id] === option
                          ? "white"
                          : "transparent",
                    }}
                  >
                    {answers[question?.id] === option && (
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: formSettings?.primaryColor }}
                      />
                    )}
                  </div>
                  <span>{option}</span>
                </div>
              </div>
            ))}
          </div>
        );

      case "RATING":
        return (
          <div className="flex justify-center gap-4">
            {Array.from({ length: question?.scale || 5 }).map((_, index) => (
              <Button
                key={index}
                onClick={() => handleAnswer(question?.id, index + 1)}
                className="w-15 h-15 rounded-full text-2xl"
                style={{
                  background:
                    answers[question?.id] === index + 1
                      ? formSettings?.primaryColor
                      : "white",
                  color:
                    answers[question?.id] === index + 1
                      ? "white"
                      : formSettings?.primaryColor,
                  border: `${formSettings?.borderWidth}px ${formSettings?.borderStyle} ${formSettings?.primaryColor}`,
                }}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        );

      case "OPINION_SCALE":
        return (
          <div>
            <div className="flex justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                {question?.labels?.start || "Not at all likely"}
              </span>
              <span className="text-sm text-muted-foreground">
                {question?.labels?.end || "Extremely likely"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {Array.from({
                length: (question?.max || 10) - (question?.min || 1) + 1,
              }).map((_, index) => {
                const value = (question?.min || 1) + index;
                return (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(question?.id, value)}
                    className="w-12 h-12 rounded-full text-xl"
                    style={{
                      background:
                        answers[question?.id] === value
                          ? formSettings?.primaryColor
                          : "white",
                      color:
                        answers[question?.id] === value
                          ? "white"
                          : formSettings?.primaryColor,
                      border: `${formSettings?.borderWidth}px ${formSettings?.borderStyle} ${formSettings?.primaryColor}`,
                    }}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
        );

      case "YES-NO":
        return (
          <div className="flex gap-6 justify-center">
            <Button
              onClick={() => handleAnswer(question?.id, "Yes")}
              className="w-30 h-15 text-xl"
              style={{
                background:
                  answers[question?.id] === "Yes" ? "#52c41a" : "white",
                color: answers[question?.id] === "Yes" ? "white" : "#52c41a",
                border: `${formSettings?.borderWidth}px ${formSettings?.borderStyle} #52c41a`,
                borderRadius: formSettings?.borderRadius,
              }}
            >
              Yes
            </Button>
            <Button
              onClick={() => handleAnswer(question?.id, "No")}
              className="w-30 h-15 text-xl"
              style={{
                background:
                  answers[question?.id] === "No" ? "#ff4d4f" : "white",
                color: answers[question?.id] === "No" ? "white" : "#ff4d4f",
                border: `${formSettings?.borderWidth}px ${formSettings?.borderStyle} #ff4d4f`,
                borderRadius: formSettings?.borderRadius,
              }}
            >
              No
            </Button>
          </div>
        );

      case "DATE":
        return (
          <Input
            type="date"
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "DROPDOWN":
        return (
          <Select
            value={answers[question?.id]}
            onValueChange={(value) => handleAnswer(question?.id, value)}
          >
            <SelectTrigger
              className="text-lg p-5"
              style={{ fontSize: `${formSettings?.fontSize}px` }}
            >
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {question?.options?.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "TIME":
        return (
          <Input
            type="time"
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "NUMBER":
        return (
          <Input
            type="number"
            placeholder="+1234567890"
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      case "WEBSITE":
        return (
          <Input
            type="url"
            placeholder="https://example.com"
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );

      default:
        return (
          <Input
            placeholder="Type your answer here..."
            className="text-lg p-5"
            style={inputStyle}
            value={answers[question?.id] || ""}
            onChange={(e) => handleAnswer(question?.id, e.target.value)}
          />
        );
    }
  };

  const renderCompletionScreen = () => (
    <div
      className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      style={{
        background: `linear-gradient(135deg, ${formSettings?.primaryColor} 0%, ${formSettings?.secondaryColor} 100%)`,
        color: "white",
      }}
    >
      <div className="max-w-2xl">
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-8">
          <Check className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-6">Thank you!</h1>
        <p className="text-xl mb-12 text-white/90">
          Your response has been recorded. We appreciate your feedback!
        </p>
        <Button
          size="lg"
          onClick={onClose}
          className="text-lg h-12 px-8"
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "2px solid white",
            color: "white",
            borderRadius: formSettings?.borderRadius,
          }}
        >
          Close Preview
        </Button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[1000] bg-white">
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 z-[1001]"
        style={{
          background: formSettings?.primaryColor,
          color: "white",
        }}
      >
        <X className="h-4 w-4" />
      </Button>

      {isCompleted
        ? renderCompletionScreen()
        : currentStep === 0
          ? renderWelcomeScreen()
          : renderQuestion(questions[currentStep - 1], currentStep - 1)}
    </div>
  );
}
