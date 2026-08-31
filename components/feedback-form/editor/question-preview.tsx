import { Question } from "@/store/ts-types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star, Check } from "lucide-react";

interface QuestionPreviewProps {
  question: Question;
  formSettings: any;
  questions?: Question[];
}

export function QuestionPreview({
  question,
  formSettings,
  questions,
}: QuestionPreviewProps) {
  const containerClass =
    "w-full max-w-xl mx-auto space-y-4 animate-in fade-in duration-300 p-5 rounded-xl border border-border/70 bg-card shadow-2xs";
  const titleClass =
    "text-base md:text-lg font-semibold leading-snug transition-colors duration-200";
  const descClass =
    "text-xs md:text-sm font-normal opacity-75 mt-0.5 transition-colors duration-200";

  // Dynamic Styles
  const containerStyle = {
    color: formSettings?.textColor || "inherit",
  };

  const inputStyle = {
    color: formSettings?.textColor || "inherit",
    borderColor: `${formSettings?.primaryColor || "var(--primary)"}60`,
    "--primary-color": formSettings?.primaryColor || "var(--primary)",
  } as React.CSSProperties;

  const buttonStyle = {
    backgroundColor: formSettings?.buttonColor || formSettings?.primaryColor || "var(--primary)",
    color: "#FFFFFF",
  };

  const renderContent = () => {
    switch (question.type) {
      case "SHORT_TEXT":
      case "EMAIL":
      case "PHONE":
      case "WEBSITE":
      case "NUMBER":
        return (
          <div className="space-y-2">
            <div className="relative">
              <Input
                disabled
                placeholder="Type your answer here..."
                className="text-sm md:text-base border-0 border-b-2 rounded-none px-0 py-2 shadow-none focus-visible:ring-0 bg-transparent h-auto placeholder:opacity-40 transition-all"
                style={inputStyle}
              />
            </div>
            {question.type === "SHORT_TEXT" && question.maxLength && (
              <div className="text-[10.5px] opacity-60 uppercase tracking-wider font-medium">
                Max {question.maxLength} characters
              </div>
            )}
          </div>
        );

      case "LONG_TEXT":
        return (
          <div className="space-y-2">
            <Textarea
              disabled
              placeholder="Type your answer here..."
              className="text-xs md:text-sm border-0 border-b-2 rounded-none px-0 py-2 shadow-none focus-visible:ring-0 bg-transparent resize-none min-h-[70px] placeholder:opacity-40 transition-all"
              style={inputStyle}
            />
            <div className="flex items-center justify-between text-[10.5px] opacity-60">
              <span>Shift + Enter to make a line break</span>
              {question.maxLength && (
                <span>0/{question.maxLength}</span>
              )}
            </div>
          </div>
        );

      case "MULTIPLE_CHOICE":
      case "DROPDOWN":
      case "ISOPTION":
        return (
          <div className="space-y-2">
            <div className="grid gap-2">
              {question.options?.map((opt, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center p-2.5 px-3 border rounded-lg cursor-pointer transition-all duration-150 group relative overflow-hidden",
                    "w-full max-w-sm hover:bg-muted/40",
                  )}
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}30`,
                  }}
                >
                  <div
                    className="w-5 h-5 border rounded-xs mr-3 flex items-center justify-center text-[10px] font-bold opacity-70 uppercase transition-colors shrink-0"
                    style={{
                      borderColor: formSettings?.primaryColor,
                      color: formSettings?.primaryColor,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xs md:text-sm font-medium">{opt}</span>
                  <div
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: formSettings?.primaryColor }}
                  >
                    <Check size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "RATING":
        return (
          <div className="flex gap-2.5 flex-wrap pt-1">
            {Array.from({ length: question.scale || 5 }).map((_, i) => (
              <div
                key={i}
                className="group cursor-pointer flex flex-col items-center gap-1"
              >
                <Star
                  className="w-7 h-7 transition-transform group-hover:scale-110"
                  strokeWidth={1.5}
                  style={{
                    color: formSettings?.primaryColor || "#000000",
                    fill: "transparent",
                  }}
                />
                <div className="text-xs opacity-0 group-hover:opacity-70 transition-opacity">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        );

      case "OPINION_SCALE":
        return (
          <div className="space-y-3 w-full pt-1">
            <div className="flex justify-between w-full flex-wrap gap-1.5">
              {Array.from({
                length: (question.max || 10) - (question.min || 1) + 1,
              }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[28px] h-8 border flex items-center justify-center text-xs font-semibold cursor-pointer transition-all rounded-md hover:bg-muted/50"
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}30`,
                    color: formSettings?.textColor,
                  }}
                >
                  {(question.min || 1) + i}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10.5px] opacity-60 font-medium px-0.5 uppercase tracking-wide">
              <span>{question.labels?.start || "Not Likely"}</span>
              <span>{question.labels?.end || "Very Likely"}</span>
            </div>
          </div>
        );

      case "YES_NO":
        return (
          <div className="flex gap-3 pt-1">
            {["Yes", "No"].map((opt, idx) => (
              <div
                key={idx}
                className="flex-1 max-w-[100px] border rounded-lg p-2.5 text-center cursor-pointer transition-all hover:bg-muted/40 flex flex-col items-center"
                style={{
                  borderColor: `${formSettings?.primaryColor || "#000000"}30`,
                }}
              >
                <span className="text-sm font-semibold">{opt}</span>
              </div>
            ))}
          </div>
        );

      case "DATE":
        return (
          <div className="max-w-xs space-y-1.5">
            <Input
              type="date"
              disabled
              className="text-sm border-0 border-b-2 rounded-none px-0 py-1.5 shadow-none bg-transparent"
              style={inputStyle}
            />
          </div>
        );

      case "TIME":
        return (
          <div className="max-w-xs space-y-1.5">
            <Input
              type="time"
              disabled
              className="text-sm border-0 border-b-2 rounded-none px-0 py-1.5 shadow-none bg-transparent"
              style={inputStyle}
            />
          </div>
        );

      case "LEGAL":
        return (
          <div className="space-y-3">
            <div className="p-3 bg-muted/30 rounded-lg text-xs opacity-80 leading-relaxed border border-border/50">
              {question.text || "I accept the Terms and Conditions"}
            </div>
            <div className="flex gap-3">
              {["I accept", "I don't accept"].map((opt, idx) => (
                <div
                  key={idx}
                  className="flex-1 max-w-[120px] border rounded-lg p-2 text-center cursor-pointer transition-all hover:bg-muted/40"
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}30`,
                  }}
                >
                  <span className="text-xs font-semibold">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-3 border border-dashed rounded-md text-xs opacity-50 text-center">
            Preview not available for this type
          </div>
        );
    }
  };

  return (
    <div className={containerClass} style={containerStyle}>
      <div className="flex gap-3 items-start">
        <div
          className="text-xs font-semibold px-1.5 py-0.5 rounded bg-muted/60 text-muted-foreground shrink-0 mt-0.5"
          style={{ color: formSettings?.primaryColor }}
        >
          <span>
            {(questions?.findIndex((q: Question) => q.id === question.id) ??
              0) + 1}
          </span>
        </div>
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className={titleClass}>
            {question.question || "Untitled Question"}
            {question.required && (
              <span className="text-destructive ml-1" title="Required">
                *
              </span>
            )}
          </h2>
          {question.description && (
            <p className={descClass}>{question.description}</p>
          )}
        </div>
      </div>

      <div className="pt-2 pl-7">{renderContent()}</div>

      <div className="pt-3 pl-7">
        <Button
          className="h-8 px-4 text-xs font-medium rounded-md shadow-2xs gap-1.5"
          style={buttonStyle}
        >
          <span>Submit</span>
          <Check className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
