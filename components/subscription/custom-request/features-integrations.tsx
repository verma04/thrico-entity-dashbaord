"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useCustomFormStore } from "@/store/custom-form-store";
import { Settings } from "lucide-react";

interface FeaturesIntegrationsProps {
  onNext: () => void;
  onPrevious: () => void;
}

const featureOptions = [
  { label: "Custom branding/white-label", value: "branding" },
  { label: "Advanced analytics & reporting", value: "analytics" },
  { label: "API access & integrations", value: "api" },
  { label: "Mobile applications", value: "mobile" },
  { label: "Single Sign-On (SSO)", value: "sso" },
  { label: "Advanced security features", value: "security" },
  { label: "Custom workflows", value: "workflows" },
  { label: "Multi-language support", value: "multilanguage" },
  { label: "Dedicated infrastructure", value: "infrastructure" },
  { label: "24/7 priority support", value: "support" },
  { label: "Custom training & onboarding", value: "training" },
  { label: "Data export & migration tools", value: "export" },
];

export default function FeaturesIntegrations({
  onNext,
  onPrevious,
}: FeaturesIntegrationsProps) {
  const { features, setFeatures } = useCustomFormStore();
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    features?.features || []
  );

  const handleFeatureChange = (value: string, checked: boolean) => {
    if (checked) {
      setSelectedFeatures([...selectedFeatures, value]);
    } else {
      setSelectedFeatures(selectedFeatures.filter((f) => f !== value));
    }
  };

  const handleSubmit = () => {
    setFeatures({ features: selectedFeatures });
    onNext();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">Features</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="mb-4 block font-medium">
            Required Features (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {featureOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={selectedFeatures.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handleFeatureChange(option.value, checked as boolean)
                  }
                />
                <Label
                  htmlFor={option.value}
                  className="font-normal cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-6">
          <Button onClick={onPrevious} variant="outline">
            Previous
          </Button>
          <Button onClick={handleSubmit}>Next</Button>
        </div>
      </div>
    </Card>
  );
}
