"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TeamRequirements from "./team-requirements";
import FeaturesIntegrations from "./features-integrations";
import BudgetTimeline from "./budget-timeline";
import SecurityRequirements from "./security-requirements";
import ContactInformation from "./contact-information";
import ThankYou from "./thank-you";
import FormHeader from "./form-header";
import { MessageCircle } from "lucide-react";

const TOTAL_STEPS = 6;

const steps = [
  { title: "Requirement", number: 1 },
  { title: "Features", number: 2 },
  { title: "Budget", number: 3 },
  { title: "Security", number: 4 },
  { title: "Contact", number: 5 },
];

export default function CustomRequestForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const nextStep = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TeamRequirements onNext={nextStep} />;
      case 1:
        return <FeaturesIntegrations onNext={nextStep} onPrevious={prevStep} />;
      case 2:
        return <BudgetTimeline onNext={nextStep} onPrevious={prevStep} />;
      case 3:
        return <SecurityRequirements onNext={nextStep} onPrevious={prevStep} />;
      case 4:
        return <ContactInformation onNext={nextStep} onPrevious={prevStep} />;
      case 5:
        return <ThankYou />;
      default:
        return <TeamRequirements onNext={nextStep} />;
    }
  };

  const progressPercentage = Math.round(
    ((currentStep + 1) / TOTAL_STEPS) * 100
  );

  return (
    <>
      <Card className="mt-8 bg-gradient-to-r from-purple-100 to-purple-50 border-purple-200 p-6">
        <div className="flex flex-col items-center justify-center gap-5">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-1">Need a Custom Plan?</h3>
            <p className="text-sm text-gray-700">
              For teams with 100,000+ members or special requirements
            </p>
            <p className="text-sm text-gray-600 mt-1">
              • Unlimited team members • Custom integrations • Dedicated support
            </p>
          </div>

          <Button
            onClick={() => setIsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
            size="lg"
          >
            Contact Sales
          </Button>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Custom Enterprise Plan Request</DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <FormHeader />

            {currentStep < TOTAL_STEPS - 1 && (
              <Card className="p-4">
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2 text-sm">
                    <span className="font-medium">
                      Step {currentStep + 1} of {TOTAL_STEPS}
                    </span>
                    <span className="text-gray-600">
                      {progressPercentage}% complete
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                  <div className="flex gap-1 mt-3">
                    {steps.map((step, index) => (
                      <div
                        key={index}
                        className={`flex-1 h-1 rounded-full ${
                          index < currentStep
                            ? "bg-purple-600"
                            : index === currentStep
                            ? "bg-purple-400"
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {renderStep()}

            <Alert className="bg-blue-50 border-blue-200">
              <MessageCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-900">
                <span className="font-bold">Need help?</span> Our sales team is
                available to assist you. Call us at +1 (555) 123-4567 or email
                enterprise@thrico.com
              </AlertDescription>
            </Alert>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
