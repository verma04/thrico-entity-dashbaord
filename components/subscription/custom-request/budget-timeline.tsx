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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCustomFormStore } from "@/store/custom-form-store";

interface BudgetTimelineProps {
  onNext: () => void;
  onPrevious: () => void;
}

export default function BudgetTimeline({
  onNext,
  onPrevious,
}: BudgetTimelineProps) {
  const { timeLine, setTimeLine } = useCustomFormStore();
  const [budget, setBudget] = useState(timeLine?.budget || "");
  const [timeline, setTimeline] = useState(timeLine?.timeline || "");
  const [decisionMakers, setDecisionMakers] = useState(
    timeLine?.decisionMakers || ""
  );

  const handleSubmit = () => {
    setTimeLine({
      budget,
      timeline,
      decisionMakers,
    });
    onNext();
  };

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Budget & Timeline</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="budget" className="mb-2 block font-medium">
            Annual Budget Range
          </Label>
          <Select value={budget} onValueChange={setBudget}>
            <SelectTrigger id="budget">
              <SelectValue placeholder="Select your budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under25k">Under $25,000</SelectItem>
              <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
              <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
              <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
              <SelectItem value="over250k">Over $250,000</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="mb-3 block font-medium">
            Implementation Timeline
          </Label>
          <RadioGroup value={timeline} onValueChange={setTimeline}>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="immediate" id="immediate" />
                <Label
                  htmlFor="immediate"
                  className="font-normal cursor-pointer"
                >
                  Immediate (within 30 days)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1-3" id="1-3" />
                <Label htmlFor="1-3" className="font-normal cursor-pointer">
                  1-3 months
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3-6" id="3-6" />
                <Label htmlFor="3-6" className="font-normal cursor-pointer">
                  3-6 months
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="6plus" id="6plus" />
                <Label htmlFor="6plus" className="font-normal cursor-pointer">
                  6+ months
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="exploring" id="exploring" />
                <Label
                  htmlFor="exploring"
                  className="font-normal cursor-pointer"
                >
                  Just exploring options
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div>
          <Label htmlFor="decisionMakers" className="mb-2 block font-medium">
            Who else is involved in the decision-making process?
          </Label>
          <Textarea
            id="decisionMakers"
            placeholder="e.g., CTO, IT Director, Procurement team..."
            rows={4}
            value={decisionMakers}
            onChange={(e) => setDecisionMakers(e.target.value)}
          />
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
