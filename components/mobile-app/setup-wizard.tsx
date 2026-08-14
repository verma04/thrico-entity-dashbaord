"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronRight, Circle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  component: React.ReactNode;
  isValid?: boolean;
  isOptional?: boolean;
  onNext?: () => Promise<boolean | void>;
  onSkip?: () => Promise<boolean | void>;
}

interface SetupWizardProps {
  title: string;
  description: string;
  steps: WizardStep[];
  onComplete: () => void;
  onCancel?: () => void;
}

export function SetupWizard({
  title,
  description,
  steps,
  onComplete,
  onCancel,
}: SetupWizardProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    setIsLoading(true);
    try {
      if (currentStep.onNext) {
        const success = await currentStep.onNext();
        if (success === false) {
          setIsLoading(false);
          return;
        }
      }

      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      console.error("Step onNext failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const handleSkip = async () => {
    setIsLoading(true);
    try {
      if (currentStep.onSkip) {
        const success = await currentStep.onSkip();
        if (success === false) {
          setIsLoading(false);
          return;
        }
      }
      if (!isLastStep) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        onComplete();
      }
    } catch (error) {
      console.error("Step onSkip failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto mt-6">
      {/* Sidebar Stepper */}
      <div className="lg:w-1/4 shrink-0">
        <div className="sticky top-6">
          <h2 className="text-lg font-semibold mb-1">{title}</h2>
          <p className="text-muted-foreground mb-4 text-xs">{description}</p>

          <div className="space-y-2.5">
            {steps.map((step, index) => {
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      </div>
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-xs font-medium ${
                        isCurrent ? "text-foreground" : ""
                      }`}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <p className="text-[11px] mt-0.5 text-muted-foreground">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Card className="flex-1 border shadow-sm">
          <CardContent className="p-5 md:p-6 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold">{currentStep.title}</h3>
              <span className="text-xs text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            
            <Progress value={progress} className="h-1 mb-6" />

            <div className="flex-1">
              {currentStep.component}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between items-center">
              <div className="flex gap-2">
                <Button
                  variant={isFirstStep ? "ghost" : "outline"}
                  onClick={handleBack}
                >
                  {isFirstStep ? "Cancel" : "Back"}
                </Button>
                {currentStep.isOptional && (
                  <Button
                    variant="outline"
                    onClick={handleSkip}
                    disabled={isLoading}
                  >
                    Skip for now
                  </Button>
                )}
              </div>
              {currentStep.isValid !== false && (
                <Button
                  onClick={handleNext}
                  className={isLastStep ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : (isLastStep ? "Complete Setup" : "Continue")}
                  {!isLastStep && !isLoading && <ChevronRight className="w-4 h-4 ml-1" />}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
