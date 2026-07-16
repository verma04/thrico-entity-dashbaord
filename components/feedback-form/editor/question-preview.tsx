import { Question } from "@/store/ts-types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Star, Check } from "lucide-react";

interface QuestionPreviewProps {
  question: Question;
  formSettings: any; // Type this properly later
  questions?: Question[];
}

export function QuestionPreview({
  question,
  formSettings,
  questions,
}: QuestionPreviewProps) {
  // Common container styles for Typeform look
  const containerClass =
    "w-full max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 p-8 rounded-lg";
  const titleClass =
    "text-2xl md:text-4xl font-light leading-tight transition-colors duration-300";
  const descClass =
    "text-xl font-light opacity-70 mt-2 transition-colors duration-300";

  // Dynamic Styles
  const containerStyle = {
    // We don't set background here as the Canvas parent might set it,
    // or we set it on the preview container.
    // For Typeform, usually the whole page has the background.
    // Let's assume the parent (Canvas) handles the page background,
    // and this component handles text colors.
    color: formSettings?.textColor || "#000000",
  };

  const inputStyle = {
    color: formSettings?.textColor || "#000000",
    borderColor: `${formSettings?.primaryColor || "#000000"}80`, // 50% opacity
    "--primary-color": formSettings?.primaryColor || "#000000",
  } as React.CSSProperties;

  const buttonStyle = {
    backgroundColor: formSettings?.buttonColor || "#000000",
    color: "#FFFFFF", // Assuming white text on buttons for now, or calculate contrast
  };

  const optionStyle = {
    borderColor: `${formSettings?.primaryColor || "#000000"}30`,
  };

  const renderContent = () => {
    switch (question.type) {
      case "SHORT_TEXT":
      case "EMAIL":
      case "PHONE":
      case "WEBSITE":
      case "NUMBER":
        return (
          <div className="space-y-4">
            <div className="relative">
              <Input
                disabled
                placeholder="Type your answer here..."
                className="text-2xl md:text-3xl border-0 border-b-2 rounded-none px-0 py-4 shadow-none focus-visible:ring-0 bg-transparent h-auto placeholder:opacity-30 transition-all hover:border-b-opacity-100"
                style={inputStyle}
              />
            </div>
            {question.type === "SHORT_TEXT" && question.maxLength && (
              <div className="text-sm opacity-60 uppercase tracking-widest font-medium group">
                Shift{" "}
                <strong className="border border-current rounded px-1 py-0.5 text-xs mx-1">
                  Enter
                </strong>{" "}
                to make a line break
              </div>
            )}
          </div>
        );

      case "LONG_TEXT":
        return (
          <div className="space-y-4">
            <Textarea
              disabled
              placeholder="Type your answer here..."
              className="text-xl md:text-2xl border-0 border-b-2 rounded-none px-0 py-2 shadow-none focus-visible:ring-0 bg-transparent resize-none min-h-[120px] placeholder:opacity-30 transition-all hover:border-b-opacity-100"
              style={inputStyle}
            />
            <div className="flex items-center justify-between">
              <div className="text-sm opacity-60 uppercase tracking-widest font-medium">
                <strong className="border border-current rounded px-1 py-0.5 text-xs mr-1">
                  Shift + Enter
                </strong>{" "}
                to make a line break
              </div>
              {question.maxLength && (
                <div className="text-sm opacity-60">0/{question.maxLength}</div>
              )}
            </div>
          </div>
        );

      case "MULTIPLE_CHOICE":
      case "DROPDOWN":
      case "ISOPTION":
        return (
          <div className="space-y-3">
            <div className="grid gap-3">
              {question.options?.map((opt, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-center p-3 border-2 rounded-md cursor-pointer transition-all duration-200 group relative overflow-hidden",
                    "w-full max-w-md hover:bg-black/5",
                  )}
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}40`,
                  }}
                >
                  <div
                    className="w-6 h-6 border rounded-sm mr-4 flex items-center justify-center text-[10px] font-bold opacity-60 uppercase transition-colors"
                    style={{
                      borderColor: formSettings?.primaryColor,
                      color: formSettings?.primaryColor,
                    }}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className="text-xl font-light">{opt}</span>
                  <div
                    className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: formSettings?.primaryColor }}
                  >
                    <Check size={20} />
                  </div>

                  {/* Hover effect highlight */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 pointer-events-none"
                    style={{ backgroundColor: formSettings?.primaryColor }}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case "RATING":
        return (
          <div className="flex gap-4 flex-wrap">
            {Array.from({ length: question.scale || 5 }).map((_, i) => (
              <div
                key={i}
                className="group cursor-pointer flex flex-col items-center gap-2"
              >
                <Star
                  className="w-12 h-12 transition-transform group-hover:scale-110"
                  strokeWidth={1}
                  style={{
                    color: formSettings?.primaryColor || "#000000",
                    fill: "transparent", // Hover logic would be complex in preview without state, assume empty
                  }}
                />
                <div className="text-lg opacity-0 group-hover:opacity-60 transition-opacity">
                  {i + 1}
                </div>
              </div>
            ))}
          </div>
        );

      case "OPINION_SCALE":
        return (
          <div className="space-y-6 w-full">
            <div className="flex justify-between w-full flex-wrap gap-2">
              {Array.from({
                length: (question.max || 10) - (question.min || 1) + 1,
              }).map((_, i) => (
                <div
                  key={i}
                  className="flex-1 min-w-[40px] h-[60px] border-2 flex items-center justify-center text-xl font-medium cursor-pointer transition-all rounded hover:-translate-y-1"
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}40`,
                    color: formSettings?.textColor,
                  }}
                >
                  {(question.min || 1) + i}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-base opacity-60 font-medium px-1 uppercase tracking-wide">
              <span>{question.labels?.start || "Not Likely"}</span>
              <span>{question.labels?.end || "Very Likely"}</span>
            </div>
          </div>
        );

      case "YES_NO":
        return (
          <div className="flex gap-6">
            {["Yes", "No"].map((opt, idx) => (
              <div
                key={idx}
                className="flex-1 max-w-[160px] border-2 rounded-lg p-6 text-center cursor-pointer transition-all hover:bg-black/5 flex flex-col items-center gap-2"
                style={{
                  borderColor: `${formSettings?.primaryColor || "#000000"}40`,
                }}
              >
                <span className="text-2xl font-medium">{opt}</span>
              </div>
            ))}
          </div>
        );

      case "DATE":
        return (
          <div className="max-w-xs space-y-2">
            <Input
              type="date"
              disabled
              className="text-2xl border-0 border-b-2 rounded-none px-0 py-2 shadow-none bg-transparent"
              style={inputStyle}
            />
          </div>
        );

      case "TIME":
        return (
          <div className="max-w-xs space-y-2">
            <Input
              type="time"
              disabled
              className="text-2xl border-0 border-b-2 rounded-none px-0 py-2 shadow-none bg-transparent"
              style={inputStyle}
            />
          </div>
        );

      case "LEGAL":
        return (
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 rounded-md text-sm opacity-70">
              {question.text || "I accept the Terms and Conditions"}
            </div>
            <div className="flex gap-6">
              {["I accept", "I don't accept"].map((opt, idx) => (
                <div
                  key={idx}
                  className="flex-1 max-w-[160px] border-2 rounded-lg p-4 text-center cursor-pointer transition-all hover:bg-black/5 flex flex-col items-center gap-2"
                  style={{
                    borderColor: `${formSettings?.primaryColor || "#000000"}40`,
                  }}
                >
                  <span className="text-lg font-medium">{opt}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 border border-dashed rounded opacity-50">
            Preview not available for this type
          </div>
        );
    }
  };

  return (
    <div className={containerClass} style={containerStyle}>
      <div className="flex gap-6">
        <div
          className="text-xl pt-1 font-medium opacity-40"
          style={{ color: formSettings?.primaryColor }}
        >
          <span>
            {(questions?.findIndex((q: Question) => q.id === question.id) ??
              0) + 1}
          </span>
          <span className="ml-1">→</span>
        </div>
        <div className="space-y-4 flex-1">
          <h2 className={titleClass}>
            {question.question || "..."}
            {question.required && (
              <span className="text-red-500 ml-1" title="Required">
                *
              </span>
            )}
          </h2>
          {question.description && (
            <p className={descClass}>{question.description}</p>
          )}
        </div>
      </div>

      <div className="pl-12 md:pl-16 pt-4">{renderContent()}</div>

      <div className="pl-12 md:pl-16 pt-12">
        <Button
          className="h-14 px-10 text-xl font-medium rounded-md shadow-lg transition-transform hover:scale-105 active:scale-95"
          style={buttonStyle}
        >
          OK <Check className="ml-2 w-6 h-6" strokeWidth={3} />
        </Button>
      </div>
    </div>
  );
}
