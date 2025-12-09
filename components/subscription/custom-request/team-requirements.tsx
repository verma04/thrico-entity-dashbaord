"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomFormStore } from "@/store/custom-form-store";
import { Users } from "lucide-react";

interface TeamRequirementsProps {
  onNext: () => void;
}

const painPointOptions = [
  { label: "Current solution is too expensive", value: "expensive" },
  { label: "Limited scalability", value: "scalability" },
  { label: "Poor user experience", value: "ux" },
  { label: "Lack of mobile access", value: "mobile" },
  { label: "Insufficient analytics/reporting", value: "analytics" },
  { label: "Security concerns", value: "security" },
  { label: "Integration challenges", value: "integration" },
  { label: "Poor customer support", value: "support" },
  { label: "Missing key features", value: "features" },
  { label: "Compliance issues", value: "compliance" },
];

export default function TeamRequirements({ onNext }: TeamRequirementsProps) {
  const { teamRequirements, setTeamRequirements } = useCustomFormStore();
  const [teamSize, setTeamSize] = useState(teamRequirements?.teamSize || "");
  const [currentSolution, setCurrentSolution] = useState(
    teamRequirements?.currentSolution || ""
  );
  const [painPoints, setPainPoints] = useState<string[]>(
    teamRequirements?.painPoints || []
  );

  const handlePainPointChange = (value: string, checked: boolean) => {
    if (checked) {
      setPainPoints([...painPoints, value]);
    } else {
      setPainPoints(painPoints.filter((p) => p !== value));
    }
  };

  const handleSubmit = () => {
    setTeamRequirements({
      teamSize,
      currentSolution,
      painPoints,
    });
    onNext();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Users className="w-5 h-5 text-blue-600" />
        <h2 className="text-2xl font-bold">Team & Requirements</h2>
      </div>

      <div className="space-y-6">
        <div>
          <Label htmlFor="teamSize" className="mb-2 block font-medium">
            Expected Team Size
          </Label>
          <Select value={teamSize} onValueChange={setTeamSize}>
            <SelectTrigger id="teamSize">
              <SelectValue placeholder="Select expected team size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1-10">1-10 employees</SelectItem>
              <SelectItem value="11-50">11-50 employees</SelectItem>
              <SelectItem value="51-200">51-200 employees</SelectItem>
              <SelectItem value="201-500">201-500 employees</SelectItem>
              <SelectItem value="501-1000">501-1000 employees</SelectItem>
              <SelectItem value="1000plus">1000+ employees</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="currentSolution" className="mb-2 block font-medium">
            Current Solution
          </Label>
          <Input
            id="currentSolution"
            placeholder="What solution are you currently using?"
            value={currentSolution}
            onChange={(e) => setCurrentSolution(e.target.value)}
          />
        </div>

        <div>
          <Label className="mb-3 block font-medium">
            What are your main pain points? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {painPointOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={painPoints.includes(option.value)}
                  onCheckedChange={(checked) =>
                    handlePainPointChange(option.value, checked as boolean)
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

        <div className="flex justify-center pt-6">
          <Button onClick={handleSubmit} size="lg">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}
