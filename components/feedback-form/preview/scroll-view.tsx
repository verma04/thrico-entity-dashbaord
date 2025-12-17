import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import React from "react";
import { Question } from "../../../../store/ts-types";

const FormTitle = ({ question }: { question: Question }) => {
  return (
    <h5 className="text-lg font-semibold">
      {question?.question}{" "}
      {question?.required && <span className="text-destructive">*</span>}
    </h5>
  );
};

export const ScrollView = (question: Question) => {
  switch (question.type) {
    case "SHORT_TEXT":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input placeholder="Type your answer here..." disabled />
          <p className="text-sm text-muted-foreground">
            Max length: {question.maxLength || 255} characters
          </p>
        </div>
      );

    case "LONG_TEXT":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Textarea placeholder="Type your answer here..." disabled rows={4} />
          <p className="text-sm text-muted-foreground">
            Max length: {question.maxLength || 4000} characters
          </p>
        </div>
      );

    case "EMAIL":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="email" placeholder="email@example.com" disabled />
        </div>
      );

    case "PHONE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="tel" placeholder="+1 (555) 123-4567" disabled />
        </div>
      );

    case "WEBSITE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="url" placeholder="https://example.com" disabled />
        </div>
      );

    case "NUMBER":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="number" placeholder="0" disabled />
        </div>
      );

    case "OPINION_SCALE":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                {question.labels?.start || "Not at all likely"}
              </span>
              <span className="text-sm text-muted-foreground">
                {question.labels?.end || "Extremely likely"}
              </span>
            </div>
            <div className="flex justify-between gap-2">
              {Array.from({
                length: (question.max || 10) - (question.min || 1) + 1,
              }).map((_, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="w-10 h-10 rounded-full p-0"
                >
                  {(question.min || 1) + index}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );

    case "MULTIPLE_CHOICE":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          {question.allowMultiple ? (
            <div className="space-y-2">
              {question?.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          ) : (
            <RadioGroup>
              {question?.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`radio-${index}`} />
                  <Label htmlFor={`radio-${index}`} className="font-normal cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
        </div>
      );

    case "ISOPTION":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <RadioGroup>
            {question?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`radio-${index}`} />
                <Label htmlFor={`radio-${index}`} className="font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      );

    case "RATING":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <div className="flex justify-between gap-2">
            {Array.from({ length: question.scale || 5 }).map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-1">
                <Button
                  variant="outline"
                  className="w-10 h-10 rounded-full p-0"
                >
                  {index + 1}
                </Button>
                <span className="text-xs text-muted-foreground">
                  {index === 0
                    ? "Poor"
                    : index === (question.scale || 5) - 1
                      ? "Excellent"
                      : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case "DROPDOWN":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Select disabled>
            <SelectTrigger>
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
        </div>
      );

    case "DATE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="date" />
        </div>
      );

    case "TIME":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input type="time" />
        </div>
      );

    case "YES-NO":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <div className="flex gap-2">
            <Button variant="outline">Yes</Button>
            <Button variant="outline">No</Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
