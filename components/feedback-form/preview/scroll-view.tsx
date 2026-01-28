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
import { FormSettings, Question } from "@/store/ts-types";

import { useFormikContext, ErrorMessage } from "formik";
import React from "react";

const FormTitle = ({ question }: { question: Question }) => {
  return (
    <h5 className="text-lg font-semibold">
      {question?.question}{" "}
      {question?.required && <span className="text-destructive">*</span>}
    </h5>
  );
};

export const ScrollView = ({
  question,
  formSettings,
}: {
  question: Question;
  formSettings: FormSettings;
}) => {
  const { setFieldValue, values, errors, touched } = useFormikContext<any>();
  const error = touched[question.id] && errors[question.id];

  const commonStyle = {
    borderColor: error
      ? "red"
      : formSettings?.inputBorderColor || formSettings?.borderColor,
    backgroundColor: formSettings?.inputBackground,
    color: formSettings?.textColor,
    borderRadius: formSettings?.borderRadius,
    borderWidth: formSettings?.borderWidth,
    borderStyle: formSettings?.borderStyle,
  };

  switch (question.type) {
    case "SHORT_TEXT":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            placeholder="Type your answer here..."
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          <p className="text-sm text-muted-foreground">
            Max length: {question.maxLength || 255} characters
          </p>
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "LONG_TEXT":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Textarea
            placeholder="Type your answer here..."
            rows={4}
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          <p className="text-sm text-muted-foreground">
            Max length: {question.maxLength || 4000} characters
          </p>
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "EMAIL":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="email"
            placeholder="email@example.com"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "PHONE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "WEBSITE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="url"
            placeholder="https://example.com"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "NUMBER":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="number"
            placeholder="0"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
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
            <div className="flex justify-between gap-2 overflow-x-auto pb-2">
              {Array.from({
                length: (question.max || 10) - (question.min || 1) + 1,
              }).map((_, index) => {
                const val = (question.min || 1) + index;
                const isSelected = values[question.id] === val;
                return (
                  <Button
                    key={index}
                    variant={isSelected ? "default" : "outline"}
                    className="w-10 h-10 rounded-full p-0 flex-shrink-0"
                    onClick={() => setFieldValue(String(question.id), val)}
                    style={{
                      backgroundColor: isSelected
                        ? formSettings?.primaryColor
                        : undefined,
                      color: isSelected ? "white" : undefined,
                      borderColor: formSettings?.primaryColor,
                    }}
                  >
                    {val}
                  </Button>
                );
              })}
            </div>
            {error && (
              <p className="text-red-500 text-sm mt-2">{String(error)}</p>
            )}
          </div>
        </div>
      );

    case "MULTIPLE_CHOICE":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          {question.allowMultiple ? (
            <div className="space-y-2">
              {question?.options?.map((option, index) => {
                const isChecked = values[question.id]?.includes(option);
                return (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`option-${question.id}-${index}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const current = values[question.id] || [];
                        if (checked) {
                          setFieldValue(String(question.id), [
                            ...current,
                            option,
                          ]);
                        } else {
                          setFieldValue(
                            String(question.id),
                            current.filter((v: any) => v !== option),
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`option-${question.id}-${index}`}
                      className="font-normal cursor-pointer"
                    >
                      {option}
                    </Label>
                  </div>
                );
              })}
            </div>
          ) : (
            <RadioGroup
              value={values[question.id]}
              onValueChange={(val) => setFieldValue(String(question.id), val)}
            >
              {question?.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={option}
                    id={`radio-${question.id}-${index}`}
                  />
                  <Label
                    htmlFor={`radio-${question.id}-${index}`}
                    className="font-normal cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "ISOPTION":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <RadioGroup
            value={values[question.id]}
            onValueChange={(val) => setFieldValue(String(question.id), val)}
          >
            {question?.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={option}
                  id={`radio-${question.id}-${index}`}
                />
                <Label
                  htmlFor={`radio-${question.id}-${index}`}
                  className="font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "RATING":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <div className="flex justify-between gap-2 overflow-x-auto pb-2">
            {Array.from({ length: question.scale || 5 }).map((_, index) => {
              const val = index + 1;
              const isSelected = values[question.id] === val;
              return (
                <div
                  key={index}
                  className="flex flex-col items-center gap-1 flex-shrink-0"
                >
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-10 h-10 rounded-full p-0"
                    onClick={() => setFieldValue(String(question.id), val)}
                    style={{
                      backgroundColor: isSelected
                        ? formSettings?.primaryColor
                        : undefined,
                      color: isSelected ? "white" : undefined,
                      borderColor: formSettings?.primaryColor,
                    }}
                  >
                    {val}
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {index === 0
                      ? "Poor"
                      : index === (question.scale || 5) - 1
                        ? "Excellent"
                        : ""}
                  </span>
                </div>
              );
            })}
          </div>
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "DROPDOWN":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Select
            value={values[question.id]}
            onValueChange={(val) => setFieldValue(String(question.id), val)}
          >
            <SelectTrigger style={commonStyle}>
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
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "DATE":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="date"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "TIME":
      return (
        <div className="space-y-2">
          <FormTitle question={question} />
          <Input
            type="time"
            value={values[question.id]}
            onChange={(e) => setFieldValue(String(question.id), e.target.value)}
            style={commonStyle}
          />
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    case "YES_NO":
      return (
        <div className="space-y-4">
          <FormTitle question={question} />
          <div className="flex gap-2">
            <Button
              variant={values[question.id] === "Yes" ? "default" : "outline"}
              onClick={() => setFieldValue(String(question.id), "Yes")}
              style={{
                backgroundColor:
                  values[question.id] === "Yes"
                    ? formSettings?.primaryColor
                    : undefined,
                color: values[question.id] === "Yes" ? "white" : undefined,
                borderColor: formSettings?.primaryColor,
              }}
            >
              Yes
            </Button>
            <Button
              variant={values[question.id] === "No" ? "default" : "outline"}
              onClick={() => setFieldValue(String(question.id), "No")}
              style={{
                backgroundColor:
                  values[question.id] === "No"
                    ? formSettings?.primaryColor
                    : undefined,
                color: values[question.id] === "No" ? "white" : undefined,
                borderColor: formSettings?.primaryColor,
              }}
            >
              No
            </Button>
          </div>
          {error && <p className="text-red-500 text-sm">{String(error)}</p>}
        </div>
      );

    default:
      return null;
  }
};
