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

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
    } else if (onCancel) {
      onCancel();
    }
  };

  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto mt-6">
      {/* Sidebar Stepper */}
      <div className="lg:w-1/4 shrink-0">
        <div className="sticky top-6">
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-muted-foreground mb-6 text-sm">{description}</p>

          <div className="space-y-4">
            {steps.map((step, index) => {
              const isCompleted = currentStepIndex > index;
              const isCurrent = currentStepIndex === index;

              return (
                <div
                  key={step.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : isCompleted
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : isCurrent ? (
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${
                        isCurrent ? "text-foreground" : ""
                      }`}
                    >
                      {step.title}
                    </p>
                    {isCurrent && (
                      <p className="text-xs mt-1 text-muted-foreground">
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
          <CardContent className="p-6 md:p-8 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-medium">{currentStep.title}</h3>
              <span className="text-sm text-muted-foreground">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
            </div>
            
            <Progress value={progress} className="h-1 mb-8" />

            <div className="flex-1">
              {currentStep.component}
            </div>

            <div className="mt-8 pt-6 border-t flex justify-between items-center">
              <Button
                variant={isFirstStep ? "ghost" : "outline"}
                onClick={handleBack}
              >
                {isFirstStep ? "Cancel" : "Back"}
              </Button>
              <Button
                onClick={handleNext}
                className={isLastStep ? "bg-green-600 hover:bg-green-700 text-white" : ""}
                disabled={currentStep.isValid === false}
              >
                {isLastStep ? "Complete Setup" : "Continue"}
                {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
