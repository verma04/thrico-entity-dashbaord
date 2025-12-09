"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomFormStore } from "@/store/custom-form-store";
import { Shield } from "lucide-react";

interface SecurityRequirementsProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function SecurityRequirements({
  onNext,
  onPrevious,
}: SecurityRequirementsProps) {
  const { security, setSecurity } = useCustomFormStore();
  const [technicalRequirements, setTechnicalRequirements] = useState(
    security?.technicalRequirements || ""
  );
  const [additionalInfo, setAdditionalInfo] = useState(
    security?.additionalInfo || ""
  );
  const [referral, setReferral] = useState(security?.referral || "");

  const handleSubmit = () => {
    setSecurity({
      technicalRequirements,
      additionalInfo,
      referral,
    });
    onNext();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">
          Security & Additional Requirements
        </h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label
            htmlFor="technicalRequirements"
            className="mb-2 block font-medium"
          >
            Specific Technical Requirements
          </Label>
          <Textarea
            id="technicalRequirements"
            placeholder="Any specific technical requirements, infrastructure needs, or constraints..."
            rows={4}
            value={technicalRequirements}
            onChange={(e) => setTechnicalRequirements(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="additionalInfo" className="mb-2 block font-medium">
            Additional Information
          </Label>
          <Textarea
            id="additionalInfo"
            placeholder="Anything else you'd like us to know about your requirements..."
            rows={4}
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="referral" className="mb-2 block font-medium">
            How did you hear about Thrico?
          </Label>
          <Select value={referral} onValueChange={setReferral}>
            <SelectTrigger id="referral">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="search">Search Engine</SelectItem>
              <SelectItem value="social">Social Media</SelectItem>
              <SelectItem value="referral">Referral</SelectItem>
              <SelectItem value="event">Event or Conference</SelectItem>
              <SelectItem value="ad">Online Advertisement</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
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
